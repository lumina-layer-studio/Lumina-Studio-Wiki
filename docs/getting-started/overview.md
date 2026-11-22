---
title: "Lumina Studio"
description: "基于物理校准的多色FDM色彩系统"
sidebar_position: 1
---

# Lumina Studio

项目源码与本地运行说明见 [Lumina-Layers 公开仓库](https://github.com/lumina-layer-studio/Lumina-Layers)。如果通过启动器安装时遇到激活提示，请查看[使用启动器激活 Lumina Studio](./launcher-activation/launcher-activation.mdx)。

## 项目介绍

Lumina Studio 是面向多材料 FDM 叠色打印的开源软件。它基于实测打印色卡数据匹配图像颜色，直接生成可导入切片软件的多色模型。你可以直接使用现成的经典 LUT 预设，也可以打印梯度色卡建立自己的耗材档案，自由组合手头的耗材。

项目自 1.x 系列起公开发布；2.0 版本完成重构后，现已在原有的 [Lumina-Layers 仓库](https://github.com/lumina-layer-studio/Lumina-Layers)公开维护。

:::info[位图转 SVG]
Lumina Studio 内置图像矢量化工具，使用方法见[从位图生成 SVG](../knowledge/bitmap-to-svg/bitmap-to-svg.mdx)。你也可以使用独立开源工具：https://github.com/Neroued/neroued_vectorizer
:::

我们与多家耗材厂商合作，直接基于各品牌现有的量产颜色打印并精校拍摄色卡预设，不要求厂商定制特定颜色或透光率，也不收取合作费用。部分渠道推广链接产生的少量佣金全部用于社区抽奖与项目开发。同时，软件完全支持用户自制并分享色卡与耗材档案。

:::tip[项目理念]
开源开放，合作共创。
:::

## 核心能力

### 颜色模式

- 支持 2 色、4 色、5 色、6 色与 8 色叠色方案

### 生成模式

- 高保真模式、像素艺术模式、矢量（SVG）模式

### 模型与色彩调整

- 自定义色卡校准与耗材档案提取
- 量化颜色数调节与颜色配方查询
- 预览后局部选区换色与自由色导出
- 主体抠图、独立背板、外轮廓描边、透明镀层与浮雕结构
- 色卡对比与合并
