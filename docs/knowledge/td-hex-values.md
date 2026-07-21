---
id: wikijs-14
title: "TD值/HEX值分享"
slug: "/TD值"
description: ""
sidebar_position: 14
wikijs_path: "TD值"
wikijs_author: "Evan76"
wikijs_creator: "Evan76"
wikijs_updated_at: "2026-05-31T14:08:09.209Z"
---
# 什么是TD值
什么是TD值？Hueforge给你的答案是：光线照射透过99%光线的距离就是TD值，单位是mm比如一个耗材TD值为0.1那么对应的就是99%光线透过的是0.1mm。
# 为什么共享这个值？
在包括Hueforge，Hicolor，彩色版画生成器等等生成器/软件中，会使用HEX值和TD值，Lumina目前的方案并未直接使用TD值，只是在更多颜色色卡中进行了通用td值的理论排列去重和简化，在校准过程中还未涉及到TD值。


**但为什么要分享这个值，共享这个值难道不是为了给所谓的“竞争对手软件”图方便吗？**
**这是因为我们从一开始就秉持着开放包容合作共创的主旨，希望所有类似的软件无论是否开源都可以互相帮助，互相提出建议从而可以一起进步，我觉得这个精神才是推动这类技术不断创新进步的源泉，而不是闭门造车 圈地自萌。**

所以在我们每次打印耗材厂家提供的耗材的时候，我们会顺手把TD值和颜色值进行同步测试，方便其他用户另作他用（需要td值的软件）。这就分享这个值的原因，另一层原因是为了长远发展，如果后面做更多扩展功能，涉及到了td值和hex值的计算，这样就节省了很多时间和精力。

# 这个值怎么测的？
这是根据AJAX X BIQU的 TD1S测试盒测出的数据，符合Hueforge软件的对于TD值的测试方法，即99%光线透过耗材的距离（单位mm），颜色是基于td1s灰度校准后校准颜色偏差后的测出的结果，相对准确。

# 这个数值怎么用？
:::info
**你可以在Hueforge里面添加对应的td值和颜色，可以在hicolor里面同样添加，在彩色版画生成器需要自己新建耗材库的时候添加td值。**
:::

# 品牌列表
:::info
本列表不涉及任何广告推广，都是长期用各种软件和耗材日积月累和顺手测的，也欢迎共享和纠错。联系QQ：374612153
:::

## 爱丽兹
| 类型 | 颜色 | 颜色名称 | TD值 | 潘通色号 | HEX色值 |
| ---- | ---- | -------- | ---- | -------- | ------- |
| PLA | <svg class="legacy-color-swatch" viewBox="0 0 30 20" role="img" aria-label="#FFFFFF"><rect width="30" height="20" fill="#FFFFFF"></rect></svg> | 白色 | 7.0 | / | #FFFFFF |
| PLA | <svg class="legacy-color-swatch" viewBox="0 0 30 20" role="img" aria-label="#FCE300"><rect width="30" height="20" fill="#FCE300"></rect></svg> | 黄色 | 6.3 | Pantone 102 C | #fce300 |
| PLA | <svg class="legacy-color-swatch" viewBox="0 0 30 20" role="img" aria-label="#FF671F"><rect width="30" height="20" fill="#FF671F"></rect></svg> | 橙色 | 5.5 | Pantone 165 C | #ff671f |
| PLA | <svg class="legacy-color-swatch" viewBox="0 0 30 20" role="img" aria-label="#A6192E"><rect width="30" height="20" fill="#A6192E"></rect></svg> | 红色 | 4.5 | Pantone 187 C | #a6192e |
| PLA | <svg class="legacy-color-swatch" viewBox="0 0 30 20" role="img" aria-label="#DB3EB1"><rect width="30" height="20" fill="#DB3EB1"></rect></svg> | 品红色 | 3.3 | Pantone 239 C | #db3eb1 |
| PLA | <svg class="legacy-color-swatch" viewBox="0 0 30 20" role="img" aria-label="#008AD8"><rect width="30" height="20" fill="#008AD8"></rect></svg> | 青色 | 2.7 | Pantone 2382 C | #008ad8 |
| PLA | <svg class="legacy-color-swatch" viewBox="0 0 30 20" role="img" aria-label="#888B8D"><rect width="30" height="20" fill="#888B8D"></rect></svg> | 灰色 | 1.9 | Pantone Cool Gray 8 C | #888b8d |
| PLA | <svg class="legacy-color-swatch" viewBox="0 0 30 20" role="img" aria-label="#0047BB"><rect width="30" height="20" fill="#0047BB"></rect></svg> | 蓝色 | 1.7 | Pantone 2728 C | #0047bb |
| PLA | <svg class="legacy-color-swatch" viewBox="0 0 30 20" role="img" aria-label="#6558B1"><rect width="30" height="20" fill="#6558B1"></rect></svg> | 紫色 | 1.6 | Pantone 2102 C | #6558b1 |
| PLA | <svg class="legacy-color-swatch" viewBox="0 0 30 20" role="img" aria-label="#3F2021"><rect width="30" height="20" fill="#3F2021"></rect></svg> | 深咖色 | 0.6 | Pantone 4975 C | #3f2021 |
| PLA | <svg class="legacy-color-swatch" viewBox="0 0 30 20" role="img" aria-label="#8A8D8F"><rect width="30" height="20" fill="#8A8D8F"></rect></svg> | 金属银 | 0.4 | Pantone 877 C | #8a8d8f |
| PLA | <svg class="legacy-color-swatch" viewBox="0 0 30 20" role="img" aria-label="#000000"><rect width="30" height="20" fill="#000000"></rect></svg> | 黑色 | 0.2 | / | #000000 |
| PLA | <svg class="legacy-color-swatch" viewBox="0 0 30 20" role="img" aria-label="#00573F"><rect width="30" height="20" fill="#00573F"></rect></svg> | 墨绿色 | 0.2 | Pantone 7484 C | #00573f |


| 类型 | 颜色 | 颜色名称 | TD值 | 潘通色号 | HEX色值 |
| ---- | ---- | -------- | ---- | -------- | ------- |
| PETG | <svg class="legacy-color-swatch" viewBox="0 0 30 20" role="img" aria-label="#FEDD00"><rect width="30" height="20" fill="#FEDD00"></rect></svg> | 黄色 | 5.7 | PANTONE YELLOW C | #FEDD00 |
| PETG | <svg class="legacy-color-swatch" viewBox="0 0 30 20" role="img" aria-label="#E4D5D3"><rect width="30" height="20" fill="#E4D5D3"></rect></svg> | 肤色 | 5.7 | PANTONE 7604C | #E4D5D3 |
| PETG | <svg class="legacy-color-swatch" viewBox="0 0 30 20" role="img" aria-label="#E4C6D4"><rect width="30" height="20" fill="#E4C6D4"></rect></svg> | 樱花粉 | 4.7 | PANTONE 684C | #E4C6D4 |
| PETG | <svg class="legacy-color-swatch" viewBox="0 0 30 20" role="img" aria-label="#FF6A39"><rect width="30" height="20" fill="#FF6A39"></rect></svg> | 橙色 | 4.0 | PANTONE 1645C | #FF6A39 |
| PETG | <svg class="legacy-color-swatch" viewBox="0 0 30 20" role="img" aria-label="#EFDDB2"><rect width="30" height="20" fill="#EFDDB2"></rect></svg> | 米黄色 | 4.0 | PANTONE 7506C | #EFDDB2 |
| PETG | <svg class="legacy-color-swatch" viewBox="0 0 30 20" role="img" aria-label="#FFFFFF"><rect width="30" height="20" fill="#FFFFFF"></rect></svg> | 白色 | 3.9 | / | #FFFFFF |
| PETG | <svg class="legacy-color-swatch" viewBox="0 0 30 20" role="img" aria-label="#CB333B"><rect width="30" height="20" fill="#CB333B"></rect></svg> | 朱砂红 | 3.3 | PANTONE 1797C | #CB333B |
| PETG | <svg class="legacy-color-swatch" viewBox="0 0 30 20" role="img" aria-label="#D50032"><rect width="30" height="20" fill="#D50032"></rect></svg> | 大红色 | 3.1 | PANTONE 199C | #D50032 |
| PETG | <svg class="legacy-color-swatch" viewBox="0 0 30 20" role="img" aria-label="#DB3EB1"><rect width="30" height="20" fill="#DB3EB1"></rect></svg> | 品红色 | 2.9 | PANTONE 239C | #DB3EB1 |
| PETG | <svg class="legacy-color-swatch" viewBox="0 0 30 20" role="img" aria-label="#C5A900"><rect width="30" height="20" fill="#C5A900"></rect></svg> | 琥珀金 | 2.9 | PANTONE 103C | #C5A900 |
| PETG | <svg class="legacy-color-swatch" viewBox="0 0 30 20" role="img" aria-label="#E58F33"><rect width="30" height="20" fill="#E58F33"></rect></svg> | 金属钛空橙 | 2.7 | PANTONE 144C | #E58F33 |
| PETG | <svg class="legacy-color-swatch" viewBox="0 0 30 20" role="img" aria-label="#6CC24A"><rect width="30" height="20" fill="#6CC24A"></rect></svg> | 柠檬绿 | 2.6 | PANTONE 360 C | #6CC24A |
| PETG | <svg class="legacy-color-swatch" viewBox="0 0 30 20" role="img" aria-label="#00358E"><rect width="30" height="20" fill="#00358E"></rect></svg> | 克莱因蓝 | 2.3 | PANTONE 2146C | #00358e |
| PETG | <svg class="legacy-color-swatch" viewBox="0 0 30 20" role="img" aria-label="#6D3332"><rect width="30" height="20" fill="#6D3332"></rect></svg> | 酒红色 | 2.3 | PANTONE 7629C | #6D3332 |
| PETG | <svg class="legacy-color-swatch" viewBox="0 0 30 20" role="img" aria-label="#6B3D2E"><rect width="30" height="20" fill="#6B3D2E"></rect></svg> | 咖啡色 | 2.2 | PANTONE 7595C | #6B3D2E |
| PETG | <svg class="legacy-color-swatch" viewBox="0 0 30 20" role="img" aria-label="#7B4D35"><rect width="30" height="20" fill="#7B4D35"></rect></svg> | 棕色 | 2.0 | PANTONE 7588C | #7B4D35 |
| PETG | <svg class="legacy-color-swatch" viewBox="0 0 30 20" role="img" aria-label="#0084D4"><rect width="30" height="20" fill="#0084D4"></rect></svg> | 青色 | 1.8 | PANTONE 2184C | #0084D4 |
| PETG | <svg class="legacy-color-swatch" viewBox="0 0 30 20" role="img" aria-label="#97999B"><rect width="30" height="20" fill="#97999B"></rect></svg> | 浅灰色 | 1.6 | PANTONE cool gray 7c | #97999B |
| PETG | <svg class="legacy-color-swatch" viewBox="0 0 30 20" role="img" aria-label="#00843D"><rect width="30" height="20" fill="#00843D"></rect></svg> | 绿色 | 1.5 | PANTONE 348C | #00843D |
| PETG | <svg class="legacy-color-swatch" viewBox="0 0 30 20" role="img" aria-label="#8866BC"><rect width="30" height="20" fill="#8866BC"></rect></svg> | 紫罗兰 | 1.5 | PANTONE 2075C | #8866BC |
| PETG | <svg class="legacy-color-swatch" viewBox="0 0 30 20" role="img" aria-label="#2DCCD3"><rect width="30" height="20" fill="#2DCCD3"></rect></svg> | 薄荷绿 | 1.3 | PANTONE 319C | #2DCCD3 |
| PETG | <svg class="legacy-color-swatch" viewBox="0 0 30 20" role="img" aria-label="#147BD1"><rect width="30" height="20" fill="#147BD1"></rect></svg> | 湖蓝色 | 1.1 | PANTONE 2172C | #147BD1 |
| PETG | <svg class="legacy-color-swatch" viewBox="0 0 30 20" role="img" aria-label="#686F12"><rect width="30" height="20" fill="#686F12"></rect></svg> | 橄榄绿 | 0.8 | PANTONE 2307C | #686F12 |
| PETG | <svg class="legacy-color-swatch" viewBox="0 0 30 20" role="img" aria-label="#284734"><rect width="30" height="20" fill="#284734"></rect></svg> | 军绿色 | 0.8 | PANTONE 553C | #284734 |
| PETG | <svg class="legacy-color-swatch" viewBox="0 0 30 20" role="img" aria-label="#3E4827"><rect width="30" height="20" fill="#3E4827"></rect></svg> | 墨绿色 | 0.6 | PANTONE 5743C | #3E4827 |
| PETG | <svg class="legacy-color-swatch" viewBox="0 0 30 20" role="img" aria-label="#75787B"><rect width="30" height="20" fill="#75787B"></rect></svg> | 闪光银 | 0.4 | PANTONE cool gray 9c | #75787B |
| PETG | <svg class="legacy-color-swatch" viewBox="0 0 30 20" role="img" aria-label="#4E5B73"><rect width="30" height="20" fill="#4E5B73"></rect></svg> | 蓝灰色 | 0.3 | PANTONE 2376C | #4E5B73 |
| PETG | <svg class="legacy-color-swatch" viewBox="0 0 30 20" role="img" aria-label="#3D3935"><rect width="30" height="20" fill="#3D3935"></rect></svg> | 铁灰色 | 0.3 | PANTONE cool gray 11c | #3D3935 |
| PETG | <svg class="legacy-color-swatch" viewBox="0 0 30 20" role="img" aria-label="#87674F"><rect width="30" height="20" fill="#87674F"></rect></svg> | 金属香槟金 | 0.3 | PANTONE 7532C | #87674F |
| PETG | <svg class="legacy-color-swatch" viewBox="0 0 30 20" role="img" aria-label="#BD9B60"><rect width="30" height="20" fill="#BD9B60"></rect></svg> | 金属黄铜色 | 0.3 | PANTONE 7562c | #BD9B60 |
| PETG | <svg class="legacy-color-swatch" viewBox="0 0 30 20" role="img" aria-label="#000000"><rect width="30" height="20" fill="#000000"></rect></svg> | 黑色 | 0.3 | / | #000000 |
| PETG | <svg class="legacy-color-swatch" viewBox="0 0 30 20" role="img" aria-label="#8A8D8F"><rect width="30" height="20" fill="#8A8D8F"></rect></svg> | 金属银 | 0.3 | PANTONE 877C | #8A8D8F |
| PETG | <svg class="legacy-color-swatch" viewBox="0 0 30 20" role="img" aria-label="#708090"><rect width="30" height="20" fill="#708090"></rect></svg> | 寒武岩灰蓝 | 0.2 | PANTONE 2139 C | #708090 |
| PETG | <svg class="legacy-color-swatch" viewBox="0 0 30 20" role="img" aria-label="#20B2AA"><rect width="30" height="20" fill="#20B2AA"></rect></svg> | 金属松湖绿 | 0.2 | PANTONE 7743 C | #20B2AA |
| PETG | <svg class="legacy-color-swatch" viewBox="0 0 30 20" role="img" aria-label="#8A2BE2"><rect width="30" height="20" fill="#8A2BE2"></rect></svg> | 金属钛暮紫 | 0.2 | PANTONE 669 C | #8A2BE2 |
| PETG | <svg class="legacy-color-swatch" viewBox="0 0 30 20" role="img" aria-label="#9370DB"><rect width="30" height="20" fill="#9370DB"></rect></svg> | 金属紫 | 0.2 | PANTONE 511 C | #9370DB |
| PETG | <svg class="legacy-color-swatch" viewBox="0 0 30 20" role="img" aria-label="#000000"><rect width="30" height="20" fill="#000000"></rect></svg> | 金属黑镍色 | 0.1 | PANTONE Black 7C | #000000 |
| PETG | <svg class="legacy-color-swatch" viewBox="0 0 30 20" role="img" aria-label="#B87333"><rect width="30" height="20" fill="#B87333"></rect></svg> | 金属铜色 | 0.1 | PANTONE 875C | #B87333 |
| PETG | <svg class="legacy-color-swatch" viewBox="0 0 30 20" role="img" aria-label="#8B4513"><rect width="30" height="20" fill="#8B4513"></rect></svg> | 金属红铜色 | 0.1 | PANTONE 7610C | #8B4513 |

## FULLJOY
| 耗材类型 | 颜色 | 颜色名称 | TD值 | HEX色值 |
| -------- | ---- | -------- | ---- | ------- |
| PLA | <svg class="legacy-color-swatch" viewBox="0 0 30 20" role="img" aria-label="#FFFFFF"><rect width="30" height="20" fill="#FFFFFF"></rect></svg> | 骨白色 | 7.5 | #FFFFFF |
| PLA | <svg class="legacy-color-swatch" viewBox="0 0 30 20" role="img" aria-label="#D4A123"><rect width="30" height="20" fill="#D4A123"></rect></svg> | 黄色 | 5.1 | #D4A123 |
| PLA | <svg class="legacy-color-swatch" viewBox="0 0 30 20" role="img" aria-label="#D66927"><rect width="30" height="20" fill="#D66927"></rect></svg> | 橙色 | 4.3 | #D66927 |
| PLA | <svg class="legacy-color-swatch" viewBox="0 0 30 20" role="img" aria-label="#A83A35"><rect width="30" height="20" fill="#A83A35"></rect></svg> | 红色 | 2.9 | #A83A35 |
| PLA | <svg class="legacy-color-swatch" viewBox="0 0 30 20" role="img" aria-label="#CC99C0"><rect width="30" height="20" fill="#CC99C0"></rect></svg> | 粉红色 | 2.9 | #CC99C0 |
| PLA | <svg class="legacy-color-swatch" viewBox="0 0 30 20" role="img" aria-label="#2A6A3C"><rect width="30" height="20" fill="#2A6A3C"></rect></svg> | 绿色 | 2.2 | #2A6A3C |
| PLA | <svg class="legacy-color-swatch" viewBox="0 0 30 20" role="img" aria-label="#42AFBA"><rect width="30" height="20" fill="#42AFBA"></rect></svg> | 天蓝色 | 2.2 | #42AFBA |
| PLA | <svg class="legacy-color-swatch" viewBox="0 0 30 20" role="img" aria-label="#908789"><rect width="30" height="20" fill="#908789"></rect></svg> | 炫彩银 | 1.9 | #908789 |
| PLA | <svg class="legacy-color-swatch" viewBox="0 0 30 20" role="img" aria-label="#2F4637"><rect width="30" height="20" fill="#2F4637"></rect></svg> | 橄榄绿 | 1.7 | #2F4637 |
| PLA | <svg class="legacy-color-swatch" viewBox="0 0 30 20" role="img" aria-label="#604035"><rect width="30" height="20" fill="#604035"></rect></svg> | 咖啡色 | 1.0 | #604035 |
| PLA | <svg class="legacy-color-swatch" viewBox="0 0 30 20" role="img" aria-label="#76726F"><rect width="30" height="20" fill="#76726F"></rect></svg> | 航空灰 | 0.4 | #76726F |
| PLA | <svg class="legacy-color-swatch" viewBox="0 0 30 20" role="img" aria-label="#606264"><rect width="30" height="20" fill="#606264"></rect></svg> | 灰色 | 0.3 | #606264 |
| PLA | <svg class="legacy-color-swatch" viewBox="0 0 30 20" role="img" aria-label="#000000"><rect width="30" height="20" fill="#000000"></rect></svg> | 黑色 | 0.2 | #000000 |
| PLA | <svg class="legacy-color-swatch" viewBox="0 0 30 20" role="img" aria-label="#474643"><rect width="30" height="20" fill="#474643"></rect></svg> | 金属钛 | 0.2 | #474643 |


## 赛纳
| 类型 | 颜色 | 颜色名称 | TD值 | HEX色值 |
| ---- | ---- | -------- | ---- | -------- |
| PLA | <svg class="legacy-color-swatch" viewBox="0 0 30 20" role="img" aria-label="#000000"><rect width="30" height="20" fill="#000000"></rect></svg> | 黑色 | 0.1 |  #000000 |
| PLA | <svg class="legacy-color-swatch" viewBox="0 0 30 20" role="img" aria-label="#FFFFFF"><rect width="30" height="20" fill="#FFFFFF"></rect></svg> | 白色 | 2.6 | #FFFFFF |
| PLA | <svg class="legacy-color-swatch" viewBox="0 0 30 20" role="img" aria-label="#FFFF4A"><rect width="30" height="20" fill="#FFFF4A"></rect></svg> | 黄色 | 4.8 |  #FFFF4A |
| PLA | <svg class="legacy-color-swatch" viewBox="0 0 30 20" role="img" aria-label="#15215E"><rect width="30" height="20" fill="#15215E"></rect></svg> | 深蓝色 | 3.2 |  #15215E |
| PLA | <svg class="legacy-color-swatch" viewBox="0 0 30 20" role="img" aria-label="#3F8BD8"><rect width="30" height="20" fill="#3F8BD8"></rect></svg> | 蓝色 | 2.1 |  #3F8BD8 |
| PLA | <svg class="legacy-color-swatch" viewBox="0 0 30 20" role="img" aria-label="#861E15"><rect width="30" height="20" fill="#861E15"></rect></svg> | 红色 | 4.9 |  #861E15 |
| PLA | <svg class="legacy-color-swatch" viewBox="0 0 30 20" role="img" aria-label="#B9FF7B"><rect width="30" height="20" fill="#B9FF7B"></rect></svg> | 浅绿色 | 3.6 |  #B9FF7B |
| PLA | <svg class="legacy-color-swatch" viewBox="0 0 30 20" role="img" aria-label="#A73D81"><rect width="30" height="20" fill="#A73D81"></rect></svg> | 品红色 | 2.8 |  #A73D81 |

## 纵维立方
| 类型 | 颜色 | 颜色名称 | TD值 | HEX色值 |
| ---- | ---- | -------- | ---- | -------- |
| PLA | <svg class="legacy-color-swatch" viewBox="0 0 30 20" role="img" aria-label="#000000"><rect width="30" height="20" fill="#000000"></rect></svg> | 黑色 | 0.1 |  #000000 |
| PLA | <svg class="legacy-color-swatch" viewBox="0 0 30 20" role="img" aria-label="#FFFFFF"><rect width="30" height="20" fill="#FFFFFF"></rect></svg> | 白色 | 5.9 | #FFFFFF |
| PLA | <svg class="legacy-color-swatch" viewBox="0 0 30 20" role="img" aria-label="#FFFF3F"><rect width="30" height="20" fill="#FFFF3F"></rect></svg> | 黄色 | 5.8 |  #FFFF3F |
| PLA | <svg class="legacy-color-swatch" viewBox="0 0 30 20" role="img" aria-label="#2946B5"><rect width="30" height="20" fill="#2946B5"></rect></svg> | 蓝色 | 1.6 |  #2946B5 |
| PLA | <svg class="legacy-color-swatch" viewBox="0 0 30 20" role="img" aria-label="#BB4680"><rect width="30" height="20" fill="#BB4680"></rect></svg> | 品红色 | 3.6 |  #BB4680 |
| PLA | <svg class="legacy-color-swatch" viewBox="0 0 30 20" role="img" aria-label="#8A1E1D"><rect width="30" height="20" fill="#8A1E1D"></rect></svg> | 红色 | 5.1 |  #8A1E1D |
| PLA | <svg class="legacy-color-swatch" viewBox="0 0 30 20" role="img" aria-label="#519F47"><rect width="30" height="20" fill="#519F47"></rect></svg> | 绿色 | 1.5 |  #519F47 |
| PLA | <svg class="legacy-color-swatch" viewBox="0 0 30 20" role="img" aria-label="#53A0F2"><rect width="30" height="20" fill="#53A0F2"></rect></svg> | 青色 | 2.4 |  #53A0F2 |



## 魔创
| 类型 | 颜色 | 颜色名称 | TD值 | HEX色值 |
| ---- | ---- | -------- | ---- | -------- |
| PETG | <svg class="legacy-color-swatch" viewBox="0 0 30 20" role="img" aria-label="#000000"><rect width="30" height="20" fill="#000000"></rect></svg> | 黑色 | 0.2 | #000000 |
| PETG | <svg class="legacy-color-swatch" viewBox="0 0 30 20" role="img" aria-label="#FFFFFF"><rect width="30" height="20" fill="#FFFFFF"></rect></svg> | 白色 | 6.8 | #FFFFFF |
| PETG | <svg class="legacy-color-swatch" viewBox="0 0 30 20" role="img" aria-label="#90BB2E"><rect width="30" height="20" fill="#90BB2E"></rect></svg> | 草绿色 | 4.5  | #90BB2E |
| PETG | <svg class="legacy-color-swatch" viewBox="0 0 30 20" role="img" aria-label="#B93875"><rect width="30" height="20" fill="#B93875"></rect></svg> | 品红色 | 3.4  | #B93875 |
| PETG | <svg class="legacy-color-swatch" viewBox="0 0 30 20" role="img" aria-label="#FFFA50"><rect width="30" height="20" fill="#FFFA50"></rect></svg> | 黄色 | 6.9 | #FFFA50 |
| PETG | <svg class="legacy-color-swatch" viewBox="0 0 30 20" role="img" aria-label="#7D1B1A"><rect width="30" height="20" fill="#7D1B1A"></rect></svg> | 红色 | 4.7  | #7D1B1A |
| PETG | <svg class="legacy-color-swatch" viewBox="0 0 30 20" role="img" aria-label="#56A69A"><rect width="30" height="20" fill="#56A69A"></rect></svg> | 青碧色 | 6.6 | #56A69A |
| PETG | <svg class="legacy-color-swatch" viewBox="0 0 30 20" role="img" aria-label="#1C367A"><rect width="30" height="20" fill="#1C367A"></rect></svg> | 蓝色 | 2.7  | #1C367A |

## 快造
| 类型 | 颜色 | 颜色名称 | TD值 | HEX色值 |
| ---- | ---- | -------- | ---- | -------- |
| PLA | <svg class="legacy-color-swatch" viewBox="0 0 30 20" role="img" aria-label="#000000"><rect width="30" height="20" fill="#000000"></rect></svg> | 黑色 | 0.1 |  #000000 |
| PLA | <svg class="legacy-color-swatch" viewBox="0 0 30 20" role="img" aria-label="#FFFFFF"><rect width="30" height="20" fill="#FFFFFF"></rect></svg> | 白色 | 6.7 |  #FFFFFF |
| PLA | <svg class="legacy-color-swatch" viewBox="0 0 30 20" role="img" aria-label="#FFCB30"><rect width="30" height="20" fill="#FFCB30"></rect></svg> | 黄色 | 4.8 |  #FFCB30 |
| PLA | <svg class="legacy-color-swatch" viewBox="0 0 30 20" role="img" aria-label="#162145"><rect width="30" height="20" fill="#162145"></rect></svg> | 蓝色 | 0.3 |  #162145 |
| PLA | <svg class="legacy-color-swatch" viewBox="0 0 30 20" role="img" aria-label="#A41A17"><rect width="30" height="20" fill="#A41A17"></rect></svg> | 红色 | 1.9 | #A41A17 |
| PLA | <svg class="legacy-color-swatch" viewBox="0 0 30 20" role="img" aria-label="#D03060"><rect width="30" height="20" fill="#D03060"></rect></svg> | 品红色 | 3.0 |  #D03060 |

## 必趣
| 类型 | 颜色 | 颜色名称 | TD值 | HEX色值 |
| ---- | ---- | -------- | ---- | -------- |
| PLA | <svg class="legacy-color-swatch" viewBox="0 0 30 20" role="img" aria-label="#000000"><rect width="30" height="20" fill="#000000"></rect></svg> | 黑色 | 0.1 |#000000 |
| PLA | <svg class="legacy-color-swatch" viewBox="0 0 30 20" role="img" aria-label="#FFFFFF"><rect width="30" height="20" fill="#FFFFFF"></rect></svg> | 白色 | 6.1 |#FFFFFF |
| PLA | <svg class="legacy-color-swatch" viewBox="0 0 30 20" role="img" aria-label="#D2FF6D"><rect width="30" height="20" fill="#D2FF6D"></rect></svg> | 绿色 | 1.4 |#D2FF6D |
| PLA | <svg class="legacy-color-swatch" viewBox="0 0 30 20" role="img" aria-label="#8B2523"><rect width="30" height="20" fill="#8B2523"></rect></svg> | 红色 | 1.6 | #8B2523 |
| PLA | <svg class="legacy-color-swatch" viewBox="0 0 30 20" role="img" aria-label="#2950CA"><rect width="30" height="20" fill="#2950CA"></rect></svg> | 蓝色 | 0.7 |#2950CA |
| PLA | <svg class="legacy-color-swatch" viewBox="0 0 30 20" role="img" aria-label="#FFFF41"><rect width="30" height="20" fill="#FFFF41"></rect></svg> | 黄色 | 4.8 | #FFFF41 |

## 必应

| 类型 | 颜色 | 颜色名称 | TD值 | HEX 色值 |
| ---- | ---- | -------- | ---- | -------- |
| PETGHF | <svg class="legacy-color-swatch" viewBox="0 0 30 20" role="img" aria-label="#FFFF5F"><rect width="30" height="20" fill="#FFFF5F"></rect></svg> | 黄色 | 6.6 | #FFFF5F |
| PETGHF | <svg class="legacy-color-swatch" viewBox="0 0 30 20" role="img" aria-label="#294FB8"><rect width="30" height="20" fill="#294FB8"></rect></svg> | 蓝色 | 2.6 | #294FB8 |
| PETGHF | <svg class="legacy-color-swatch" viewBox="0 0 30 20" role="img" aria-label="#81221C"><rect width="30" height="20" fill="#81221C"></rect></svg> | 红色 | 4.4 | #81221C |
| PETGHF | <svg class="legacy-color-swatch" viewBox="0 0 30 20" role="img" aria-label="#FFFFFF"><rect width="30" height="20" fill="#FFFFFF"></rect></svg> | 白色 | 6.6 | #FFFFFF |
| 类型   | 颜色 | 颜色名称 | TD值 | HEX 色值 |
| PLA-F  | <svg class="legacy-color-swatch" viewBox="0 0 30 20" role="img" aria-label="#FFFFFF"><rect width="30" height="20" fill="#FFFFFF"></rect></svg> | 白色 | 5.7 | #FFFFFF |
| PLA-F  | <svg class="legacy-color-swatch" viewBox="0 0 30 20" role="img" aria-label="#F8DA39"><rect width="30" height="20" fill="#F8DA39"></rect></svg> | 黄色 | 5.9 | #F8DA39 |
| PLA-F  | <svg class="legacy-color-swatch" viewBox="0 0 30 20" role="img" aria-label="#141B45"><rect width="30" height="20" fill="#141B45"></rect></svg> | 蓝色 | 3.1 | #141B45 |
| PLA-F  | <svg class="legacy-color-swatch" viewBox="0 0 30 20" role="img" aria-label="#871919"><rect width="30" height="20" fill="#871919"></rect></svg> | 红色 | 5.1 | #871919 |


## Inslogic

| 类型 | 颜色 | 颜色名称 | TD值 | HEX 色值 |
| ---- | ---- | -------- | ---- | -------- |
|  PLA PRO | <svg class="legacy-color-swatch" viewBox="0 0 30 20" role="img" aria-label="#2F4C94"><rect width="30" height="20" fill="#2F4C94"></rect></svg> | 蓝色 | 7.2 | #2F4C94 |
|  PLA PRO | <svg class="legacy-color-swatch" viewBox="0 0 30 20" role="img" aria-label="#601C18"><rect width="30" height="20" fill="#601C18"></rect></svg> | 红色 | 6.3 | #601C18 |
|  PLA PRO | <svg class="legacy-color-swatch" viewBox="0 0 30 20" role="img" aria-label="#FFFFFF"><rect width="30" height="20" fill="#FFFFFF"></rect></svg> | 白色 | 2.7 | #FFFFFF |
|  PLA PRO | <svg class="legacy-color-swatch" viewBox="0 0 30 20" role="img" aria-label="#FFDB43"><rect width="30" height="20" fill="#FFDB43"></rect></svg> | 黄色 | 5.5 | #FFDB43 |
|  PLA PRO | <svg class="legacy-color-swatch" viewBox="0 0 30 20" role="img" aria-label="#449434"><rect width="30" height="20" fill="#449434"></rect></svg> | 绿色 | 1.9 | #449434 |
| PLA PRO | <svg class="legacy-color-swatch" viewBox="0 0 30 20" role="img" aria-label="#131715"><rect width="30" height="20" fill="#131715"></rect></svg> | 黑色 | 0.1 | #131715 |



## 三绿
| 类型 | 颜色 | 颜色名称 | TD值 | HEX 色值 |
| ---- | ---- | -------- | ---- | -------- |
|PETG | <svg class="legacy-color-swatch" viewBox="0 0 30 20" role="img" aria-label="#172368"><rect width="30" height="20" fill="#172368"></rect></svg> | 蓝色 | 2.8 | #172368 |
|  PETG | <svg class="legacy-color-swatch" viewBox="0 0 30 20" role="img" aria-label="#711919"><rect width="30" height="20" fill="#711919"></rect></svg> | 红色 | 4.2 | #711919 |
|  PETG | <svg class="legacy-color-swatch" viewBox="0 0 30 20" role="img" aria-label="#FFFF14"><rect width="30" height="20" fill="#FFFF14"></rect></svg> | 黄色 | 3.8 | #FFFF14 |
|  PETG | <svg class="legacy-color-swatch" viewBox="0 0 30 20" role="img" aria-label="#FFFFFF"><rect width="30" height="20" fill="#FFFFFF"></rect></svg> | 白色 | 2.4 | #FFFFFF |
## 蚁在云端
| 类型 | 颜色 | 颜色名称 | TD值 | HEX 色值 |
| ---- | ---- | -------- | ---- | -------- |
| PLA+ | <svg class="legacy-color-swatch" viewBox="0 0 30 20" role="img" aria-label="#FFFFFF"><rect width="30" height="20" fill="#FFFFFF"></rect></svg> | 白色 | 4.1 | #FFFFFF |
| PLA+ | <svg class="legacy-color-swatch" viewBox="0 0 30 20" role="img" aria-label="#C42926"><rect width="30" height="20" fill="#C42926"></rect></svg> | 深红色 | 4.1 | #C42926 |
| PLA+ | <svg class="legacy-color-swatch" viewBox="0 0 30 20" role="img" aria-label="#000000"><rect width="30" height="20" fill="#000000"></rect></svg> | 黑色 | 0.1 | #000000 |
| PLA+ | <svg class="legacy-color-swatch" viewBox="0 0 30 20" role="img" aria-label="#51C4B4"><rect width="30" height="20" fill="#51C4B4"></rect></svg> | 绿色 | 2.8 | #51C4B4 |
| PLA+ | <svg class="legacy-color-swatch" viewBox="0 0 30 20" role="img" aria-label="#FFFF47"><rect width="30" height="20" fill="#FFFF47"></rect></svg> | 黄色 | 6.1 | #FFFF47 |
| PLA+ | <svg class="legacy-color-swatch" viewBox="0 0 30 20" role="img" aria-label="#1D33AA"><rect width="30" height="20" fill="#1D33AA"></rect></svg> | 蓝色 | 1.9 | #1D33AA |
##
