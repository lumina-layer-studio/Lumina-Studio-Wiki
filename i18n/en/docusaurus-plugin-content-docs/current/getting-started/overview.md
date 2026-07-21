---
id: wikijs-1
title: "Lumina Studio"
slug: "/"
description: "A physically calibrated multi-color FDM workflow"
sidebar_position: 1
---

# Lumina Studio

## Project overview

Lumina Layers is a fully open-source application first released on GitHub in January 2026. It lowers the learning barrier of tools such as HueForge and FlatForge and avoids requiring one fixed set of specialty filaments.

Lumina uses photographed print samples for physical color calibration. Its current workflow is: print a calibration chart, photograph it, extract the measured colors, map them to layer-stacking recipes, and generate the final print. This is a color-matching workflow rather than a purely theoretical color calculation.

:::info
For easier image preparation, the team also created an open-source, high-precision bitmap-to-SVG converter. It is planned for integration into Lumina Studio 2.x.

Tool: https://github.com/Neroued/neroued_vectorizer
:::

We work with filament manufacturers using their existing production colors. Manufacturers are not required to create proprietary colors or a specific light transmittance for Lumina. The team prints and photographs calibrated charts, while users remain free to create and share their own presets.

:::success
**Lumina is built around open source, open collaboration, and co-creation.**
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
