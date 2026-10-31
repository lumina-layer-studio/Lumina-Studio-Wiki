---
title: "Lumina Studio"
description: "A physically calibrated multi-color FDM workflow"
sidebar_position: 1
---

# Lumina Studio

Find the source code and instructions for running it in the public [Lumina-Layers repository](https://github.com/lumina-layer-studio/Lumina-Layers). If your launcher asks for activation, see the [launcher activation guide](./launcher-activation/launcher-activation.mdx).

## Project overview

Lumina Studio is open-source software for multi-material FDM color printing. The 1.x series was released publicly; after a period of internal development, 2.0 is now developed openly in the original Lumina-Layers repository.

Lumina uses photographed print samples to match image colors and generate models for slicing. You can use an existing LUT preset or make gradient cards to create material profiles and combine your own filaments.

:::info[Bitmap to SVG]

Lumina Studio includes a Vectorizer; see [Convert a Bitmap to SVG](../knowledge/bitmap-to-svg/bitmap-to-svg.mdx). A separate open-source tool is available at https://github.com/Neroued/neroued_vectorizer.
:::

We work with filament manufacturers using their existing production colors. Manufacturers are not required to create proprietary colors or a specific light transmittance for Lumina. The team prints and photographs calibrated charts, while users remain free to create and share their own presets.

:::success[Lumina is built around open source, open collaboration, and co-creation.]
:::

## Features

### Color modes

2-color, 4-color, 5-color, 6-color, and 8-color workflows.

### Generation modes

High-fidelity, pixel-art, and SVG modes.

### Other tools

- custom color charts and color calibration;
- adjustable output color count;
- subject cutout and background removal;
- independent backplates and outlines;
- transparent layers and cloisonné-style output;
- color replacement after preview generation.

### Advanced tools

- color recipe lookup;
- color-chart merging.
