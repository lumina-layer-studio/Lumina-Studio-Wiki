---
title: "1.x Public Release History"
description: "Complete public release history for Lumina Studio 1.0 through 1.6.4"
sidebar_position: 29
---

# Lumina Studio 1.x Public Release History

> Public release period: January 15–March 20, 2026

[Changelog overview](/en/docs/releases/overview) · [2.0 development report: March 2026](/en/docs/releases/2026-03)

Compiled from the official Chinese and English 1.x changelogs in the [Lumina-Layers repository](https://github.com/lumina-layer-studio/Lumina-Layers), this page summarizes user-facing features and key fixes across every public 1.x release.

## v1.6.4 · March 20, 2026

### Improvements and fixes

- Reduced unnecessary rerenders in the 3D scene.
- Unified settings-panel cards, status banners, and controls, with finer slider display precision.
- Added async retry handling for settings loading and normalized legacy slicer and printer option IDs.
- Cleaned up temporary files reliably after automatic color detection.

Thanks to `@sandboxdream` for contributing to UI polish, settings reliability, and project maintenance in this release.

## v1.6.3 · March 8, 2026

### Features

- **Cloisonné**: Extracted color boundaries into independent metal-wire objects with adjustable width and height.
- **Free Color**: Supported arbitrary RGB colors outside a fixed LUT, exporting each color as a separate 3MF object.
- **Transparent coating and outline**: Added independent protective coating and adjustable border objects that can be used together.
- **Card layout and color search**: Matched the physical calibration-board layout and added eyedropper, Hex/RGB, and hue-family filtering.
- **2.5D relief**: Assigned Z heights by color or heightmap while preserving the top optical color layers.
- **Color cleanup**: Introduced isolated-pixel cleanup, connected-region replacement, CIELAB perceptual matching, and automatic low-usage color merging.
- **Slicer integration**: Launched Bambu Studio, OrcaSlicer, or ElegooSlicer directly and remembered the last selected slicer.
- **Complete multi-material 3MF**: Improved object naming and material metadata; added 5-color extended, large-canvas, recipe-log, and output-directory workflows.

### Important fixes and performance

- Corrected 8-color stack order, RYBW/BW detection, model face orientation, 5-color orientation, and material-matrix updates.
- Fixed outline edges, relief state, SVG subpaths/clipping/fill rules, HEIC uploads, and cache invalidation.
- Improved PyInstaller asset bundling, slicer launch reliability, 3MF compression, and Gradio 6.x compatibility.
- Cut a representative SVG workflow from roughly 140 seconds to 51 seconds, with additional speedups from vectorized meshing, parallel generation, streaming export, and SVG caching.
- Relicensed the project under GPLv3.

## v1.5.9 · February 26, 2026

- Standardized exception handling and removed bare catch blocks that could swallow process-exit signals.

## v1.5.8 · February 25, 2026

- Automatically detected and merged isolated color speckles in High-Fidelity mode.
- Exported the backing plate as an independent 3MF object and fixed hard-coded backing layer counts and dropped parameters.

## v1.5.7 · February 10, 2026

### Features

- Added 6-color extended (1,296 colors), 8-color professional (2,738 colors), and 32-level grayscale modes.
- Introduced a two-page 8-color calibration workflow with manual cell correction and mode-aware corner detection.
- Preserved stack recipes when merging 4-, 6-, and 8-color and grayscale LUTs, with full color-replacement support.
- Added Docker deployment, a unified 4-color architecture, and automated test coverage.

### Fixes

- Fixed 8-color stacking and face orientation, RYBW detection, manual calibration persistence, and macOS UI layout issues.
- Deferred linked width/height recalculation until input blur so numbers no longer jump while typing.

## v1.5.6 · February 8, 2026

- Completed 8-color image conversion with automatic mode recognition from LUT size.
- Unified internal modeling-mode representation and fixed 8-color optical mixing and a missing version label on the About page.

## v1.5.5 · February 7, 2026

- Improved the 8-color calibration-board layout algorithm and output quality.

## v1.5.4 · February 6, 2026

- Improved vector overlap booleans, SVG stacking order, and small-feature preservation.
- Applied a minimal Z offset to keep neighboring details separated as distinct structures.
- Fixed black backgrounds in 2D vector previews, click-coordinate offsets, and a missing dependency.

## v1.5.3 · February 5, 2026

- Added non-destructive image cropping with common aspect-ratio presets.
- Extracted the standalone Color Analyzer and added width-aware automatic color-detail calculation.
- Added undo support for color replacement and fixed unapplied quantized-color counts.
- Accelerated color matching and rectangular mesh merging with NumPy vectorization.

## v1.5.1 · February 3, 2026

- Delivered a full UI redesign, batch mode, and internationalization framework, with previews following the active modeling mode.
- Added greedy rectangle merging to reduce 3MF triangle counts.
- Accelerated large-image K-Means clustering by roughly 20–50× via prescaling.
- Fixed X-axis mirroring in single-sided models, missing meshes, and localization merge conflicts.

## v1.5.0 · February 1, 2026

- Standardized code comments and public API documentation across the codebase.

## v1.4.2 · January 31, 2026

- Added localized system-tray menu items.
- Fixed version metadata and reverted an unstable 3MF color-injection implementation.

## v1.4.1 · January 29, 2026

- Consolidated early Vector and Woodblock modes into High-Fidelity, streamlining the main workflow into High-Fidelity and Pixel Art paths.
- Added live Chinese/English switching without reloading the page.
- Moved output and Gradio temporary files into project-local directories instead of the system temp drive.
- Fixed missing-color 3MF filenames and transparent-background detection.

## v1.4 · January 20, 2026

- Introduced Vector, Woodblock, and Voxel modeling alongside a “cluster first, match second” color-quantization engine.
- Decoupled per-mode resolution settings; large models automatically simplified 3D preview meshes and paused preview above a safety threshold to protect browser memory.
- Added system-tray integration, automatic port selection, and a modular Core/UI/Utils project layout.
- Fixed Gradio 6.x, macOS memory usage, language-toggle, and Windows temporary-image cleanup issues.

## v1.3 · January 18, 2026

- Added a complete bilingual UI, interactive live 3D preview, and full CMYW/RYBW color-system support.
- Fixed color names shown in slicers and tuned default gaps for standard nozzle line widths.

## v1.2 · January 17, 2026

- Combined the calibration-board generator, computer-vision color extractor, and image-to-3D converter into a single unified app.

## v1.0 · January 15, 2026

- Initial public release featuring calibration-board generation, color extraction, LUT color matching, and Bambu Studio-compatible 3MF export.
- Supported both CMYW and RYBW color systems out of the box.

---

[Back to the changelog overview](/en/docs/releases/overview)
