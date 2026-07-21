from __future__ import annotations

import unittest
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]


class SiteContractTests(unittest.TestCase):
    def test_search_theme_uses_portable_package_identifier(self) -> None:
        config = (ROOT / "docusaurus.config.ts").read_text(encoding="utf-8")

        self.assertIn("'@easyops-cn/docusaurus-search-local'", config)
        self.assertNotIn(
            "require.resolve('@easyops-cn/docusaurus-search-local')",
            config,
        )

    def test_site_points_readers_to_the_public_repository(self) -> None:
        config = (ROOT / "docusaurus.config.ts").read_text(encoding="utf-8")

        self.assertIn("projectName: 'Lumina-Studio-Wiki'", config)
        self.assertIn(
            "https://github.com/lumina-layer-studio/Lumina-Studio-Wiki",
            config,
        )


if __name__ == "__main__":
    unittest.main()
