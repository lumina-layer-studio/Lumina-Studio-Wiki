---
title: "Lumina Studio"
description: "A physically calibrated multi-color FDM workflow"
sidebar_position: 1
---

# Lumina Studio

Source code and local setup instructions are available in the [Lumina-Layers repository](https://github.com/lumina-layer-studio/Lumina-Layers). If Lumina Launcher prompts you to activate your device, see [Activate Lumina Studio with the Launcher](./launcher-activation/launcher-activation.mdx).

## Project overview

Lumina Studio is open-source software for multi-material FDM layered color printing. It matches image colors against measured print swatches and generates multi-color 3MF models ready for slicing. You can start right away with built-in LUT presets, or print gradient cards to build custom material profiles from your own filaments.

Following the public 1.x releases and a ground-up 2.0 rebuild, active development continues openly in the [Lumina-Layers repository](https://github.com/lumina-layer-studio/Lumina-Layers).

:::info[Bitmap to SVG]
Lumina Studio includes a built-in Vectorizer; see [Convert a Bitmap to SVG](../knowledge/bitmap-to-svg/bitmap-to-svg.mdx). A standalone open-source tool is also available at https://github.com/Neroued/neroued_vectorizer.
:::

We collaborate with filament makers to calibrate presets directly from their standard production colors—without requiring custom colors or special transmittance targets, and without charging fees. Users can also calibrate and share their own presets and material profiles.

:::tip[Project philosophy]
Open source, open collaboration, and community co-creation.
:::

## Key features

### Color modes

- 2-color, 4-color, 5-color, 6-color, and 8-color workflows

### Generation modes

- High-Fidelity, Pixel Art, and Vector (SVG) modes

### Modeling and color tools

- Custom color-chart calibration and gradient-card material profiles
- Adjustable quantized color count and recipe lookup
- Post-preview local recoloring and Free Color object export
- Subject cutout, separate backing, outlines, transparent coating, and 2.5D relief
- LUT comparison and merging
