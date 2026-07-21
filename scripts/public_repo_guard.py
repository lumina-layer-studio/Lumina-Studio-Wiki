#!/usr/bin/env python3
"""Reject private or operational material from the public Wiki repository."""

from __future__ import annotations

import argparse
import ipaddress
import re
import subprocess
import sys
from dataclasses import dataclass
from pathlib import Path
from typing import Iterable, Sequence


DEFAULT_MAX_FILE_BYTES = 25 * 1024 * 1024

DETECTION_FIXTURE_PATHS = {
    "scripts/media-contributions.mjs",
    "scripts/public_repo_guard.py",
    "tests/media-contributions.test.mjs",
    "tests/test_public_repo_guard.py",
}

FORBIDDEN_PATH_PREFIXES = (
    ".scratch/",
    ".superpowers/",
    ".playwright-cli/",
    ".docusaurus/",
    "build/",
    "data/devlog/",
    "data/publication/",
    "data/tutorials/",
    "docs/superpowers/",
    "infrastructure/",
    "node_modules/",
)

FORBIDDEN_FILENAMES = {
    ".env",
    ".env.local",
    ".env.production",
    "id_ed25519",
    "id_rsa",
}

FORBIDDEN_SUFFIXES = {
    ".7z",
    ".avi",
    ".bak",
    ".db",
    ".dump",
    ".gz",
    ".key",
    ".mkv",
    ".mov",
    ".mp4",
    ".p12",
    ".pem",
    ".pfx",
    ".sqlite",
    ".sqlite3",
    ".tar",
    ".tgz",
    ".vtt",
    ".zip",
}

TEXT_SUFFIXES = {
    "",
    ".cjs",
    ".css",
    ".csv",
    ".html",
    ".ini",
    ".js",
    ".json",
    ".jsx",
    ".md",
    ".mdx",
    ".mjs",
    ".pem",
    ".py",
    ".sh",
    ".svg",
    ".toml",
    ".ts",
    ".tsx",
    ".txt",
    ".xml",
    ".yaml",
    ".yml",
}

TEXT_RULES: tuple[tuple[str, re.Pattern[str]], ...] = (
    (
        "local_path",
        re.compile(
            r"(?:/Users/|/Volumes/|/home/[^/\s]+/(?:Documents|Desktop|\.ssh)/|"
            r"[A-Za-z]:\\Users\\)",
        ),
    ),
    (
        "ssh_reference",
        re.compile(
            r"(?:\.ssh[/\\]|\bssh\s+-i\b|\bid_(?:rsa|ed25519)\b)",
            re.IGNORECASE,
        ),
    ),
    (
        "private_key",
        re.compile(r"-----BEGIN (?:OPENSSH |RSA |EC |DSA )?PRIVATE KEY-----"),
    ),
    (
        "secret_token",
        re.compile(
            r"(?:\bgh[pousr]_[A-Za-z0-9_]{20,}\b|"
            r"\bgithub_pat_[A-Za-z0-9_]{20,}\b|"
            r"\bsk-[A-Za-z0-9_-]{20,}\b|"
            r"\bBearer\s+[A-Za-z0-9._~+/=-]{20,})"
        ),
    ),
    (
        "credential_marker",
        re.compile(
            r"\b(?:ARTALK_APP_KEY|AWS_SECRET_ACCESS_KEY|CF_API_TOKEN|"
            r"CLOUDFLARE_API_TOKEN|R2_ACCESS_KEY_ID|R2_SECRET_ACCESS_KEY)\b",
            re.IGNORECASE,
        ),
    ),
    (
        "private_storage_endpoint",
        re.compile(r"\b[A-Za-z0-9-]+\.r2\.cloudflarestorage\.com\b", re.IGNORECASE),
    ),
    (
        "internal_topology",
        re.compile(
            r"(?:\blumina-layer-studio/Wiki\b|\bR2\b|\bNAS\b)",
        ),
    ),
)

IPV4_CANDIDATE = re.compile(r"(?<![A-Za-z0-9.])(?:\d{1,3}\.){3}\d{1,3}(?![A-Za-z0-9.])")


@dataclass(frozen=True, order=True)
class Finding:
    rule: str
    path: str


def _tracked_files(repository: Path) -> list[Path]:
    completed = subprocess.run(
        ["git", "ls-files", "-z"],
        cwd=repository,
        check=False,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
    )
    if completed.returncode != 0:
        raise RuntimeError("unable to enumerate tracked files")
    paths = completed.stdout.decode("utf-8", errors="strict").split("\0")
    return [repository / path for path in paths if path]


def _tree_files(tree: Path) -> list[Path]:
    return sorted(path for path in tree.rglob("*") if path.is_file() or path.is_symlink())


def _relative(path: Path, root: Path) -> str:
    return path.relative_to(root).as_posix()


def _is_forbidden_path(relative: str) -> bool:
    normalized = relative.lstrip("./")
    return any(
        normalized == prefix.rstrip("/") or normalized.startswith(prefix)
        for prefix in FORBIDDEN_PATH_PREFIXES
    )


def _is_public_verification_key(relative: str, path: Path) -> bool:
    if not relative.startswith("data/media-keys/") or path.suffix.lower() != ".pem":
        return False
    try:
        text = path.read_text(encoding="ascii")
    except (UnicodeDecodeError, OSError):
        return False
    return (
        text.startswith("-----BEGIN PUBLIC KEY-----\n")
        and text.rstrip().endswith("-----END PUBLIC KEY-----")
        and "PRIVATE" not in text
    )


def _contains_ip_literal(text: str) -> bool:
    for match in IPV4_CANDIDATE.finditer(text):
        try:
            ipaddress.ip_address(match.group(0))
        except ValueError:
            continue
        return True
    return False


def _read_text(path: Path) -> str | None:
    if path.suffix.lower() not in TEXT_SUFFIXES:
        return None
    try:
        return path.read_text(encoding="utf-8")
    except (UnicodeDecodeError, OSError):
        return None


def scan_files(
    files: Iterable[Path],
    *,
    root: Path,
    max_file_bytes: int,
) -> list[Finding]:
    findings: set[Finding] = set()
    for path in files:
        relative = _relative(path, root)
        if path.is_symlink():
            findings.add(Finding("symlink", relative))
            continue
        if not path.exists() or not path.is_file():
            continue
        if _is_forbidden_path(relative):
            findings.add(Finding("forbidden_path", relative))
        if path.name.lower() in FORBIDDEN_FILENAMES:
            findings.add(Finding("forbidden_filename", relative))
        if path.suffix.lower() in FORBIDDEN_SUFFIXES and not _is_public_verification_key(
            relative, path
        ):
            findings.add(Finding("forbidden_suffix", relative))
        if path.stat().st_size > max_file_bytes:
            findings.add(Finding("oversized_file", relative))

        if relative in DETECTION_FIXTURE_PATHS:
            continue

        text = _read_text(path)
        if text is None:
            continue
        for rule, pattern in TEXT_RULES:
            if pattern.search(text):
                findings.add(Finding(rule, relative))
        if _contains_ip_literal(text):
            findings.add(Finding("ip_literal", relative))
    return sorted(findings)


def parse_args(argv: Sequence[str]) -> argparse.Namespace:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "--repo",
        type=Path,
        default=Path.cwd(),
        help="Git repository to inspect (default: current directory)",
    )
    parser.add_argument(
        "--tree",
        type=Path,
        help="Inspect every file below this generated tree instead of Git files",
    )
    parser.add_argument(
        "--max-file-bytes",
        type=int,
        default=DEFAULT_MAX_FILE_BYTES,
        help="Maximum allowed file size",
    )
    return parser.parse_args(argv)


def main(argv: Sequence[str] | None = None) -> int:
    args = parse_args(argv or sys.argv[1:])
    repository = args.repo.resolve()
    if args.tree is None:
        root = repository
        try:
            files = _tracked_files(repository)
        except RuntimeError:
            print("Guard error: unable to enumerate repository files", file=sys.stderr)
            return 2
    else:
        root = args.tree.resolve()
        if not root.is_dir():
            print("Guard error: generated tree does not exist", file=sys.stderr)
            return 2
        files = _tree_files(root)

    findings = scan_files(
        files,
        root=root,
        max_file_bytes=args.max_file_bytes,
    )
    if findings:
        print("Public repository guard failed:")
        for finding in findings:
            print(f"- {finding.rule}: {finding.path}")
        return 1

    print("Public repository guard passed")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
