---
title: "Lumina Studio"
description: "基于物理校准的多色FDM色彩系统"
sidebar_position: 1
---
# **Lumina Studio**

项目源码与源码运行说明见 [Lumina-Layers 公开仓库](https://github.com/lumina-layer-studio/Lumina-Layers)。使用启动器时如遇到激活提示，可查看[启动器激活教程](./launcher-activation/launcher-activation.mdx)。

## 项目介绍
Lumina Studio 是面向多材料 FDM 叠色打印的开源软件。它使用打印色卡的实测数据匹配图片颜色，生成可在切片软件中继续处理的模型。可以使用已有的 LUT 预设，也可以通过梯度卡建立耗材档案，再组合自己使用的耗材。

项目从 1.x 公开发布，2.0 经内部开发后已转为公开开发，继续使用原有的 Lumina-Layers 仓库。

:::info[位图转 SVG]

Lumina Studio 提供图像转矢量工具，操作方法见[从位图生成 SVG](../knowledge/bitmap-to-svg/bitmap-to-svg.mdx)。另有开源工具：https://github.com/Neroued/neroued_vectorizer
:::

我们积极的和很多耗材厂家进行沟通，在不影响耗材厂家生产的情况下，使用现有的耗材进行打印色卡校准，意思是不会要求任何厂家强行生产特定透光率和颜色的耗材，在这个基础上我们咨询一些厂家的意见，厂家提供现有颜色的耗材，我们不收取任何费用也不会收取任何佣金，即使是厂家需要挂推广链接，所获得的佣金项目组也用来抽奖做活动了，开发组去使用这些耗材打印对应的颜色的色卡，并且通过精校拍摄，来得到最准的色卡预设。同时也支持用户自行分享自己的使用的色卡预设

:::success[Lumina 的主旨是：开源开放，合作共创。]
:::

## 更多功能
### 颜色模式
2/4/5/6/8色
### 生成模式
高保真模式 / 像素模式 / SVG 模式
### 其他功能
支持自定义色卡和颜色校准
支持调节生成颜色数量
支持抠图
支持背板独立
支持描边
支持添加透明层
支持在生成预览后替换图中颜色

### 高级功能
支持颜色配方查询
支持合并色卡
