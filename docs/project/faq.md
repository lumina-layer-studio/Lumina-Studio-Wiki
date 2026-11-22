---
title: "常见问题Q&A"
description: "关于兼容机型、开源许可、生成模式与耗材选择的常见问题解答。"
sidebar_position: 11
---

# 常见问题 Q&A

1. **哪些打印机可以使用 Lumina Studio？**
   支持多色打印的 FDM 机型均可使用，包括拓竹（Bambu Lab）、爱乐酷（Elegoo）、创想三维（Creality）、纵维立方（Anycubic）、闪铸（Flashforge）、起迪（QIDI）、快造（Snapmaker）、普罗森（Phrozen）、Prusa 等主流品牌。

2. **叠色版画和浮雕打印会产生很多废料吗？**
   平面叠色模式的换料次数通常不到 50 次（具体取决于颜色种数，显色层一般为 5 层，每层只切换固定几种颜色），废料很少。开启 2.5D 浮雕后，由于不同高度存在跨层换色，换料次数会比平面模式多一些。

3. **Lumina 叠色方案的核心价值是什么？**
   在不添置 UV 打印机或喷墨设备的前提下，利用普通多色 FDM 打印机与常见耗材的透光叠层特性，印出细腻丰富的色彩层次，降低多色平面与浮雕创作的设备门槛。

4. **项目是开源的吗？使用需要付费吗？**
   是的。Lumina Studio 在 [Lumina-Layers 公开仓库](https://github.com/lumina-layer-studio/Lumina-Layers)开源维护，个人与企业均可免费使用。除另有说明的文件或模块外，自有软件代码采用 AGPL-3.0-only 许可，详见仓库中的[许可说明](https://github.com/lumina-layer-studio/Lumina-Layers/blob/main/LICENSING.md)。从源码运行无需购买或激活启动器；若使用启动器验证既有支持权益，可参考[使用启动器激活 Lumina Studio](../getting-started/launcher-activation/launcher-activation.mdx)。

5. **Lumina 1.x 和 2.x 有什么区别？**
   1.x 是早期公开发布的版本系列；2.0 在此基础上重构了色彩求解、三维预览、颜色工作站与原生 3MF 管线，现已回到 [Lumina-Layers 仓库](https://github.com/lumina-layer-studio/Lumina-Layers)公开开发。各阶段演进记录见[更新日志](../releases/overview.md)。

6. **高保真、像素艺术、矢量（SVG）三种模式有什么区别？**
   - **高保真模式**：按精细网格还原位图细节并生成水密无缝模型，通用性最强，适合照片、插画与渐变图；原图若有压缩噪点或杂边也会一并体现，建议用清晰原图输入。
   - **像素艺术模式**：按喷嘴线宽对齐像素格并保留硬朗边缘，专为像素画设计。
   - **矢量模式（SVG）**：直接解析 SVG 矢量路径建模，边缘最干净锐利，适合提前整理好路径的 Logo、徽章与扁平图形。

7. **用 Lumina 生成的模型和打印品可以商用盈利吗？**
   可以。个人与企业均可免费使用软件；公开分享或销售生成文件与打印成品时，请遵守仓库中的[生成物使用与署名规则](https://github.com/lumina-layer-studio/Lumina-Layers/blob/main/OUTPUT-TERMS.md)，并确保你拥有原始图片或矢量素材的合法使用权。

8. **校准色卡数据（`.npy`）和耗材档案可以自己制作吗？**
   可以。你既可以直接使用官方和社区共享的预设，也可以自行打印色卡校准并导出分享。

9. **有推荐的耗材品牌或材质吗？**
   Lumina 不捆绑销售任何耗材，也不要求厂商定制专用线材。我们仅为提供样品支持的品牌制作实拍精校预设；部分视频推广链接产生的少量佣金公开用于社区抽奖与项目开发。
   日常打印推荐使用 **PLA** 或 **PETG**，优先挑选具有一定透光率（TD 值适中或偏高）的常规耗材，避免使用遮盖力过强的哑光或高填充不透光耗材。使用 PETG 时注意烘干防潮以减少拉丝起球；使用 PLA 时注意打印仓散热，避免高温软化堵头。
