---
layout: post
title:  "使用 Materialise magics 对 STL文件进行切片 "
date:   2018-03-26 12:00:00 +0800
categories: 3D打印 
tags: 3D打印
author: chenjy
---



* content
{:toc}

我们在3D打印中常用的STL文件怎么转换成sla打印机需要的slc文件呢？

无疑我们需要一款切片软件，那就是`Materialise magics`了



## `Materialise magics`

> 这款业内领先、针对增材制造而打造的通用数据准备和STL编辑软件具备STL文件格式转换、修复、设计编辑、打印平台准备等多项功能。赶快准备好您的3D打印模型吧！


###  使用`Materialise magics`对`STL`切片

如图所示是你下载好的`Materialise magics`软件


![magics](http://wx2.sinaimg.cn/mw690/c584f169ly1fpqaxv0b6xj21hc0sc0ug.jpg)




## 新建平台  

加工准备 --> 新建平台

![magics](http://wx1.sinaimg.cn/mw690/c584f169ly1fpqay6aewyj210s02rwes.jpg)

新建平台的时候会提示你选择需要加载的机器。

![magics](http://wx2.sinaimg.cn/mw690/c584f169ly1fpqaxg0gykj20g309ot8n.jpg)



### 导入机器

加工准备 --> 机器库

如果没有机器可以从机器库中添加机器或是导入你的机器文件（MMCF）。

![magics](http://wx3.sinaimg.cn/mw690/c584f169ly1fpqaxip6iej20ij0cldg0.jpg)

我们可以看到机器库提供了两种长度单位的配置文件（Inch和mm）

我们随意添加一个`mm-settings`   `3D Systems SLA 7000(mm)`  机器属性后续可以修改。

## 导入模型

我们在新建平台的时候选择我们的新机器 ,可以右键导入模型（也可以直接拖拽模型到场景中）。

![magics](http://wx1.sinaimg.cn/mw690/c584f169ly1fpqayf0kf8j20kr0e274k.jpg)

![magics](http://wx4.sinaimg.cn/mw690/c584f169ly1fpqax57e2ij211b0midgl.jpg)


## 配置机器属性

然后我们可以修改一下我们的机器属性

![magics](http://wx4.sinaimg.cn/mw690/c584f169ly1fpqaxrybcoj210s02rweu.jpg)



![magics](http://wx1.sinaimg.cn/mw690/c584f169ly1fpqaylx17kj20q80i2mxj.jpg)



* **加工平台**：尺寸`x,y,z`就是平台的大小 。如果我们的平台大小为 `150mm * 150mm * 150mm`

* **零件默认位置**：零件导入平台的默认的位置。可以看到默认为`10mm * 10mm * 10mm`

* **平台位置**：平台左下角顶点的位置。以 `150mm * 150mm * 150mm` 为例，如果`x,y,z` 设为`-75mm*-75mm*0` 则`0,0,0` 点就在平台底面的中心处。




## 调整位置

可以通过 位置菜单里面的工具来调整模型的位置。

![magics](http://wx4.sinaimg.cn/mw690/c584f169ly1fpqaxdixtgj211b0mijsd.jpg)


## 生成支撑

模型添加以后需要给模型添加一个底部的支撑。因为模型的默认位置为`10mm * 10mm * 10mm` 则会生成`10mm` 的支撑。

选择生成支撑-->生成支撑	

![magics](http://wx2.sinaimg.cn/mw690/c584f169ly1fpqayjrw5jj21hc02rglp.jpg)

![magics](http://wx1.sinaimg.cn/mw690/c584f169ly1fpqaxahdvxj211b0miq42.jpg)

生成成功以后 退出`SG`，可以不保存

## 模型切片

这时候模型文件以及处理得当了。

切片 -->切片所有 

![magics](http://wx2.sinaimg.cn/mw690/c584f169ly1fpqaxx9l0qj21hc046wes.jpg)

配置切片参数

![magics](http://wx3.sinaimg.cn/mw690/c584f169ly1fpqay2jlx4j20ds0dsdg0.jpg)

主要为切片以及支撑厚度，勾选包含支撑

即可导出切片好的SLC文件（.slc 模型文件，_s.slc 的支撑文件）























