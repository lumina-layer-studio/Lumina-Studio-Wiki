---
id: wikijs-9
title: "使用教程"
slug: "/使用教程"
description: ""
sidebar_position: 9
wikijs_path: "使用教程"
wikijs_author: "Evan76"
wikijs_creator: "Evan76"
wikijs_updated_at: "2026-04-11T06:27:17.820Z"
---
# 1.X.X版本
GITHUB和打包版本目前都是1.X.X的版本，这个版本目前是保持维护状态，开发中心已经转移到了2.0，2.0目前暂时不公开更新，后续需要评估开源众筹或者其他模式来开源。

## 主页面
使用目前最新部署版1.6.7 打包版应该是1.6.3
在你一切部署好后，在弹出网页上面应该是这样的

![use1.png](pathname:///zh/use1.png)
## 预设选择
**在左上角图像转换中输入的窗口里，可以选择项目自带或者是共享预设，也可以上传自己校准的lut
上传后需要在左侧下拉栏选择预设**

![use2.png](pathname:///zh/use2.png)

## 图像上传
**可以选择图片上传，图片支持多种格式，如果你使用SVG图，会默认帮你选择SVG模式，而其他图片会默认高保真模式**

![use3.png](pathname:///zh/use3.png)

**上传图片后会弹出裁切框，可以自己调整，或者使用原图**

![use4.png](pathname:///zh/use4.png)
## 参数调整
**可以设置生成的宽高（锁定图片的宽高比）
可以修改底部背板的厚度(高级里面可以解锁大尺寸)**
![use4.png](pathname:///zh/use5.png)
## 生成模式
调整单双面模式
**针对不同的图使用不同的生成模式
高保真：无缝拼接，比较万能，但建议避免使用噪点过多的图
像素模式：体素生成，直接按体素方块拼接生成，适合体素像素图，无需额外调整图片
SVG模式：矢量图模式，部分矢量图工具可能会出现假矢量的情况，如果你不知道使用什么可以选择这个工具
GITHUB项目：https://github.com/Neroued/neroued_vectorizer
项目在线版：https://chromaprint3d.com/**

![use4.png](pathname:///zh/use6.png)

## 高级设置
**色彩细节：代表使用颜色数量的参数，但实际生成会量化颜色，不代表一定准确是细节值，但建议使用64以内，复杂的图在32-64之间足够了
抠图：能用，但不建议用，容易抠多了
清理杂色：可以去掉一些独立像素，避免过多杂色
独立背板，可以把背板独立一个对象，可单独修改背板颜色或者删掉**

![use4.png](pathname:///zh/use7.png)

## 调色板

**高级设置里可以修改调色板模式。一个是默认模式，另一个是按照色卡打印排列顺序显示（合并色卡不支持色卡模式）**
![use4.png](pathname:///zh/use8.png)

**点击生成预览等待一会**

![use4.png](pathname:///zh/use9.png)
![use4.png](pathname:///zh/use10.png)

**中间预览窗口显示了预览效果后，可以单独选择位置，高亮后点开下方调色板**

![use4.png](pathname:///zh/use11.png)

**在色卡模式下可以按照实际打印色卡选择自己想要替换的颜色 选择后在最下方选择确认替换**

![use4.png](pathname:///zh/use12.png)
![use4.png](pathname:///zh/use13.png)

**颜色合并：可以根据delta E值和阈值把相似色或者是杂色合并**

![use4.png](pathname:///zh/use14.png)

## 生成3MF
**生成后可以选择直接在BBS和orca或未来其他兼容的切片中打开，也可以下拉选择下载3MF直接打开**

![use4.png](pathname:///zh/use15.png)
![use16.png](pathname:///zh/use16.png)

**切片参数请移步切片参数参考页面（默认情况下已经注入了参数值，除非你弄丢了可以参考重新设置）**

# 进阶玩法
