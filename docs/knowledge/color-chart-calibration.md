---
id: wikijs-8
title: "校准板校色"
slug: "/校准板校色"
description: "Lumina Studio的校准板图片校色教程"
sidebar_position: 8
wikijs_path: "校准板校色"
wikijs_author: "二氧化萌"
wikijs_creator: "Evan76"
wikijs_updated_at: "2026-04-23T09:08:32.975Z"
---
<h1>校准板校色</h1>
<p>当您发现预览时颜色出现了明显的色偏，如肤色偏绿、灰色偏绿等。可能是因为您生成lut时所上传的校准板照片没有进行颜色校准。</p>
<p>本文将指导您进行<mark class="marker-green">基础级</mark>和<mark class="marker-pink">进阶级</mark>的颜色校准，以获得一个准确的lut。</p>
<p>目前项目开发组已经对部分厂家的耗材进行了校准并标注，推荐优先使用。</p>
<h1><mark class="marker-pink">进阶级校准板校色</mark></h1>
<p>&nbsp;</p>
<h2>在拍摄时，您需要准备</h2>
<ol>
  <li>一台可以拍摄RAW的数码相机，如数码微单、数码单反、数码桥式相机等（暂不推荐使用手机、运动相机等拍摄RAW）</li>
  <li>一张爱色丽标准的ColorChecker Classic 24色卡</li>
  <li>通过Lumina Studio生成并打印好的校准板</li>
</ol>
<p>&nbsp;</p>
<h2>在电脑上，您需要准备的软件</h2>
<ol>
  <li>ColorChecker Camera Calibration——通过爱色丽官方获取，或网络下载获取</li>
  <li>Adobe Photoshop——通过Adobe官方获取，或网络下载获取</li>
</ol>
<blockquote>
  <p>目前<strong>calibrite PROFILER</strong>已经替代ColorChecker Camera Calibration软件。新版<strong>calibrite PROFILER</strong>使用方法与ColorChecker Camera Calibratio类似，且操作更简单，因此推荐使用新版<strong>calibrite PROFILER</strong>。</p>
  <p>本文讲述的是ColorChecker Camera Calibration使用方法。</p>
  <p><strong>calibrite PROFILER</strong>通过以下链接获取：<a href="https://calibrite.com/cn/software-downloads/">https://calibrite.com/cn/software-downloads/</a></p>
</blockquote>
<h2>拍摄环境要求</h2>
<ol>
  <li>在晴天，无阴影遮挡的地方进行拍摄。周围环境避免有大面积的纯色物品（比如一颗树），以免环境的反光浸染校准板和色卡。</li>
  <li>日光照在校准板上不产生凸显校准板纹理的阴影和高光点，如有，尝试换个角度。</li>
  <li>尽量避开接近日出和日落的时间拍摄，因为此时色温偏低。</li>
</ol>
<blockquote>
  <p>注意，光源质量非常重要。如果您有较高显色指数（RA&gt;95）的人造光源。经过布置，校准板的四角和中心五点照度均匀度高于90%，则可以平替日光环境。但日光天然质量较高，而人造光源想要达到相近的光质并不是很轻松的事，因此更推荐在日光条件下拍摄。</p>
</blockquote>
<p>&nbsp;</p>
<h2>拍摄构图</h2>
<ol>
  <li>在一张照片内同时拍摄到校准板和色卡</li>
  <li>校准板在画面中的比例不低于30%。</li>
  <li>避免拍摄歪斜，校准板在画面中应当接近正方形。</li>
</ol>
<ul>
  <li>必要时可以通过三脚架辅助定位构图。</li>
</ul>
<figure class="image"><img src="/zh/snipaste_2026-04-15_18-07-41.png" alt="">
  <figcaption>拍摄成图样例</figcaption>
</figure>
<p>&nbsp;</p>
<h2>相机设定</h2>
<ol>
  <li>打开相机的RAW存储。</li>
  <li>使用默认的色彩模式，不要开启胶片模拟、滤镜等影响色准的功能。</li>
  <li>参数设定A档，白平衡自动，ISO100（相机的Base ISO，常见值是100），光圈F8。</li>
</ol>
<ul>
  <li>晴天时，快门速度通常快于1/200s。</li>
</ul>
<p>&nbsp;</p>
<h2>在Camera Raw中转换RAW为DNG</h2>
<p>将拍摄得到的RAW文件导入Photoshop，会自动进入Camera Raw插件。</p>
<figure class="image"><img src="/zh/%E8%BD%ACdng-1.png" alt=""></figure>
<p>&nbsp;</p>
<h3>进入CameraRaw首选项，修改工作色彩空间</h3>
<p>如下图，点击底部中间的选项</p>
<figure class="image"><img src="/zh/校色-cameraraw颜色设置.jpg"></figure>
<p>如下图设定色彩空间和色彩深度</p>
<figure class="image"><img src="/zh/校色-cameraraw颜色设置-2.png"></figure>
<p>色彩空间设定只需要设定一次，CameraRaw插件会记住该设定。</p>
<p>&nbsp;</p>
<h3>选择白平衡</h3>
<p>如下图，点击使用白平衡吸管吸取色块，该吸管可以框选，框选区域为色块中心的50%。</p>
<figure class="image"><img src="/zh/%E8%BD%ACdng-2.png" alt=""></figure>
<p>&nbsp;</p>
<h3>RAW降噪（可选）</h3>
<p>如下图，在细节栏中勾选去杂色，调整滑块强度。该步骤为可选项。</p>
<figure class="image"><img src="/zh/%E9%99%8D%E5%99%AA%E8%AE%BE%E7%BD%AE.png" alt=""></figure>
<blockquote>
  <p>去杂色功能是Photoshop在较新的版本中引入的AI降噪，较早版本中可能只有手动降噪功能。</p>
  <p>如果您使用较早版本的Photoshop，如Photoshop CS6，则可能只有手动降噪的功能，应当省略该步骤，或尝试在不损失颜色饱和度的前提下适当调整。</p>
</blockquote>
<p>&nbsp;</p>
<h3>存储为DNG</h3>
<p>如下图，点击右上角存储按键。</p>
<figure class="image"><img src="/zh/%E5%AD%98%E5%82%A8dng.png" alt=""></figure>
<h3>如下图，按图设置并存储DNG。</h3>
<figure class="image"><img src="/zh/%E5%AD%98%E5%82%A8dng-3.png" alt=""></figure>
<p>&nbsp;</p>
<h3>关闭Photoshop软件</h3>
<p>&nbsp;</p>
<h2>在ColorChecker相机校准中生成相机校准配置文件</h2>
<p>将上一步生成的DNG文件导入ColorChecker相机校准软件中，可能有两种情况，一种情况是软件自动完成了识别校准板和定位，另一种情况如下图，自动识别失败，需要手动点击四角定位。</p>
<figure class="image"><img src="/zh/colorchecker%E6%A0%A1%E5%87%86-1.png" alt=""></figure>
<p>&nbsp;</p>
<h3>点击定位24色卡的四角（非必需，定位失败或定位不准时使用，定位准确时跳过该步骤）</h3>
<p>如下图，使用放大镜工具，放大图片。</p>
<figure class="image"><img src="/zh/colorchecker%E6%A0%A1%E5%87%86-2.png" alt=""></figure>
<p>如下图，使用裁切标记工具，点击色块区域的四角。</p>
<figure class="image"><img src="/zh/colorchecker%E6%A0%A1%E5%87%86-3.png" alt=""></figure>
<p>&nbsp;</p>
<h3>创建相机配置文件</h3>
<p>如下图，点击创建配置文件，保存，完成创建。</p>
<figure class="image"><img src="/zh/colorchecker%E6%A0%A1%E5%87%86-4.png" alt=""></figure>
<p>&nbsp;</p>
<h2>在Photoshop中进行校色</h2>
<p>在Photoshop中打开前面导出的DNG。</p>
<p>&nbsp;</p>
<h3>选择配置文件</h3>
<p>如下图，在Camera Raw插件中选择配置文件。</p>
<figure class="image"><img src="/zh/校色-选择配置文件-1.jpg"></figure>
<p>如下图操作。选择刚才生成的配置文件，如果找不到新的配置文件，有可能是因为您在生成配置文件后没有重启Photoshop，应当尝试重启一下。</p>
<figure class="image"><img src="/zh/校色-选择配置文件-2.jpg"></figure>
<p>&nbsp;</p>
<h3>矫正白平衡</h3>
<p>如下图，使用吸管点选白平衡</p>
<figure class="image"><img src="/zh/校色-白平衡.jpg"></figure>
<p>&nbsp;</p>
<h3>矫正曝光</h3>
<p>如下图，矫正RAW曝光</p>
<figure class="image"><img src="/zh/校色-曝光.jpg"></figure>
<p>&nbsp;</p>
<h3>打开RAW，进入Photoshop主操作界面</h3>
<p>点击打开，进入Photoshop主操作界面</p>
<figure class="image"><img src="/zh/校色-打开raw.jpg"></figure>
<p>&nbsp;</p>
<h3>修改工作色彩空间和色彩管理方案</h3>
<p>编辑-颜色设置</p>
<figure class="image"><img src="/zh/校色-颜色设置-1.png"></figure>
<p>如下图，修改选项</p>
<figure class="image"><img src="/zh/校色-颜色设置.png"></figure>
<p>&nbsp;</p>
<h3>放置颜色取样器，调整色阶</h3>
<p>使用颜色取样器工具</p>
<figure class="image"><img src="/zh/校色-颜色取样器-1.png"></figure>
<figure class="image"><img src="/zh/校色-颜色取样器-2.png"></figure>
<p>在Photoshop界面右侧，选择调整工具栏，点击色阶工具</p>
<figure class="image image_resized legacy-figure-third"><img src="/zh/校色-添加色阶图层-1.png"></figure>
<p>此时会自动跳转到属性工具栏。而色阶调整图层应当在背景图层之上。</p>
<figure class="image image_resized legacy-figure-third"><img src="/zh/校色-添加色阶图层-2.png"></figure>
<p>如下图，将校准板白色色块的值设定为白点。</p>
<figure class="image"><img src="/zh/校色-色阶白点-1.png"></figure>
<p>设置后，采样点1的输出值应当为255/255/255（如下图）。少数情况下，如果有一通道值略低于255，比如253，可尝试继续调低白点值，直到输出为255/255/255。</p>
<figure class="image"><img src="/zh/校色-色阶白点-2.png"></figure>
<p>如下图，调整黑点值。</p>
<figure class="image"><img src="/zh/校色-色阶黑点-1.png"></figure>
<p>&nbsp;</p>
<p>&nbsp;</p>
<h3>修改黑色块为纯黑（非必需，5/6/8色模式使用，4色模式跳过该步骤）</h3>
<p>Photoshop界面右下角，点击新建图层。</p>
<figure class="image"><img src="/zh/新建图层.png"></figure>
<p>将前景色改为黑色</p>
<figure class="image"><img src="/zh/校色-前景色改成黑色-1.png"></figure>
<p>使用矩形选框工具，在新图层框选校准板左上角的黑色色块。5色模式黑色色块为Page2左上角第1个，6色模式黑色色块为左上角第6个，8色模式黑色色块为Page1左上角第5个。</p>
<figure class="image"><img src="/zh/校色-填色-1.png"></figure>
<p>在选区右键-填充选区</p>
<figure class="image"><img src="/zh/校色-填充-1.png"></figure>
<p>填充设定如下图</p>
<figure class="image"><img src="/zh/校色-填充-2.png"></figure>
<p>如下图，检查是否填充成功。检查完记得把背景放回来</p>
<figure class="image"><img src="/zh/校色-填充-3.png"></figure>
<p>&nbsp;</p>
<h3>导出校色完成的图片</h3>
<p>文件-导出-导出为</p>
<figure class="image"><img src="/zh/校色-导出-1.png"></figure>
<p>选择格式为PNG，勾选转换为sRGB和嵌入颜色配置文件，导出校色结果图</p>
<figure class="image"><img src="/zh/校色-导出-2.png"></figure>
<p>&nbsp;</p>
<p>&nbsp;</p>
