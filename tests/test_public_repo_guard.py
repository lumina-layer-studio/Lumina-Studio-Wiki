from __future__ import annotations

import subprocess
import sys
import tempfile
import unittest
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
GUARD = ROOT / "scripts" / "public_repo_guard.py"


class PublicRepoGuardTests(unittest.TestCase):
    def make_repo(self, files: dict[str, str | bytes]) -> Path:
        workspace = Path(self.enterContext(tempfile.TemporaryDirectory()))
        subprocess.run(
            ["git", "init", "-q", "-b", "main"],
            cwd=workspace,
            check=True,
        )
        for relative, content in files.items():
            target = workspace / relative
            target.parent.mkdir(parents=True, exist_ok=True)
            if isinstance(content, bytes):
                target.write_bytes(content)
            else:
                target.write_text(content, encoding="utf-8")
        subprocess.run(["git", "add", "."], cwd=workspace, check=True)
        return workspace

    def run_guard(
        self,
        repository: Path,
        *extra: str,
    ) -> subprocess.CompletedProcess[str]:
        return subprocess.run(
            [
                sys.executable,
                str(GUARD),
                "--repo",
                str(repository),
                *extra,
            ],
            cwd=ROOT,
            text=True,
            stdout=subprocess.PIPE,
            stderr=subprocess.STDOUT,
            check=False,
        )

    def test_accepts_normal_public_documentation(self) -> None:
        repository = self.make_repo(
            {
                "docs/tutorials/example.md": (
                    "# Tutorial\n\n"
                    "Visit https://wiki.luminastudio.com.cn/en/ and "
                    "https://www.youtube.com/watch?v=example.\n"
                ),
                "i18n/en/example.md": "# English translation\n",
                "static/img/example.png": b"\x89PNG\r\n\x1a\n",
                "pnpm-lock.yaml": "lockfileVersion: '9.0'\n",
            }
        )

        result = self.run_guard(repository)

        self.assertEqual(result.returncode, 0, result.stdout)
        self.assertIn("Public repository guard passed", result.stdout)

    def test_accepts_lowercase_public_api_routes(self) -> None:
        repository = self.make_repo(
            {"src/client.js": "fetch(`/users/${userId}`);\n"}
        )

        result = self.run_guard(repository)

        self.assertEqual(result.returncode, 0, result.stdout)

    def test_rejects_local_and_ssh_paths_without_echoing_content(self) -> None:
        repository = self.make_repo(
            {
                "docs/bad.md": (
                    "TOP-SECRET /Users/example/Documents/wiki "
                    "/Volumes/archive .ssh/id_ed25519 ssh -i key.pem\n"
                )
            }
        )

        result = self.run_guard(repository)

        self.assertNotEqual(result.returncode, 0)
        self.assertIn("local_path: docs/bad.md", result.stdout)
        self.assertIn("ssh_reference: docs/bad.md", result.stdout)
        self.assertNotIn("TOP-SECRET", result.stdout)
        self.assertNotIn("/Users/example", result.stdout)

    def test_rejects_network_and_credential_markers(self) -> None:
        repository = self.make_repo(
            {
                "docs/bad.md": (
                    "origin=203.0.113.42\n"
                    "token=ghp_abcdefghijklmnopqrstuvwxyz1234567890\n"
                    "R2_SECRET_ACCESS_KEY=do-not-print\n"
                    "https://account.r2.cloudflarestorage.com\n"
                    "-----BEGIN PRIVATE KEY-----\n"
                )
            }
        )

        result = self.run_guard(repository)

        self.assertNotEqual(result.returncode, 0)
        for rule in (
            "ip_literal",
            "secret_token",
            "credential_marker",
            "private_storage_endpoint",
            "private_key",
        ):
            self.assertIn(f"{rule}: docs/bad.md", result.stdout)
        self.assertNotIn("203.0.113.42", result.stdout)
        self.assertNotIn("do-not-print", result.stdout)

    def test_rejects_internal_topology_references(self) -> None:
        private_repository = "lumina-layer-studio" + "/Wiki"
        storage_name = "R" + "2"
        archive_name = "N" + "AS"
        repository = self.make_repo(
            {
                "docs/bad.md": (
                    f"private={private_repository}\n"
                    f"storage={storage_name}\n"
                    f"archive={archive_name}\n"
                )
            }
        )

        result = self.run_guard(repository)

        self.assertNotEqual(result.returncode, 0)
        self.assertIn("internal_topology: docs/bad.md", result.stdout)
        self.assertNotIn(private_repository, result.stdout)

    def test_rejects_private_operations_paths(self) -> None:
        repository = self.make_repo(
            {
                "infrastructure/deploy/run.sh": "#!/bin/sh\n",
                "docs/superpowers/private-plan.md": "private\n",
                "data/devlog/private.json": "{}\n",
            }
        )

        result = self.run_guard(repository)

        self.assertNotEqual(result.returncode, 0)
        self.assertIn(
            "forbidden_path: infrastructure/deploy/run.sh",
            result.stdout,
        )
        self.assertIn(
            "forbidden_path: docs/superpowers/private-plan.md",
            result.stdout,
        )
        self.assertIn("forbidden_path: data/devlog/private.json", result.stdout)

    def test_rejects_private_payload_suffixes_and_oversized_files(self) -> None:
        repository = self.make_repo(
            {
                "static/media/tutorial.mp4": b"video",
                "backup/archive.zip": b"archive",
                "static/img/large.png": b"x" * 32,
            }
        )

        result = self.run_guard(repository, "--max-file-bytes", "16")

        self.assertNotEqual(result.returncode, 0)
        self.assertIn(
            "forbidden_suffix: static/media/tutorial.mp4",
            result.stdout,
        )
        self.assertIn("forbidden_suffix: backup/archive.zip", result.stdout)
        self.assertIn("oversized_file: static/img/large.png", result.stdout)

    def test_rejects_private_key_files(self) -> None:
        private_key = (
            "-----BEGIN PRIVATE KEY-----\n"
            "TOP-SECRET\n"
            "-----END PRIVATE KEY-----\n"
        )
        repository = self.make_repo(
            {"credentials/compromised.pem": private_key}
        )

        result = self.run_guard(repository)

        self.assertNotEqual(result.returncode, 0)
        self.assertIn(
            "forbidden_suffix: credentials/compromised.pem", result.stdout
        )
        self.assertIn("private_key: credentials/compromised.pem", result.stdout)
        self.assertNotIn("TOP-SECRET", result.stdout)

    def test_tree_mode_scans_generated_output(self) -> None:
        repository = self.make_repo({"README.md": "safe\n"})
        build = repository / "build"
        build.mkdir()
        (build / "index.html").write_text(
            "generated from C:\\Users\\example\\wiki",
            encoding="utf-8",
        )

        result = self.run_guard(repository, "--tree", str(build))

        self.assertNotEqual(result.returncode, 0)
        self.assertIn("local_path: index.html", result.stdout)
        self.assertNotIn("example", result.stdout)

    def test_guard_source_and_fixture_paths_may_contain_detection_samples(self) -> None:
        repository = self.make_repo(
            {
                "scripts/public_repo_guard.py": "pattern = '/Users/'\n",
                "tests/test_public_repo_guard.py": (
                    "sample = '203.0.113.42 R2_SECRET_ACCESS_KEY'\n"
                ),
            }
        )

        result = self.run_guard(repository)

        self.assertEqual(result.returncode, 0, result.stdout)


if __name__ == "__main__":
    unittest.main()
