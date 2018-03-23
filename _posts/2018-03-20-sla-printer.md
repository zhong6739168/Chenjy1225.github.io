---
layout: post
title:  "SLA打印机之打印机介绍"
date:   2018-03-16 08:00:00 +0800
categories: 3D打印 
tags: 3D打印 SLA
author: chenjy
---



* content
{:toc}

`SLA打印机`结构以及原理介绍 



## SLA打印机



`SLA`:Stereo lithography Apparatus，立体光刻设备。通过光聚合逐层的创建模型。

### 打印机结构

如图所示的SLA打印机

![dla](http://wx2.sinaimg.cn/mw690/c584f169ly1fpj9oz7wpzj20g80fo40f.jpg)


`1`  刮刀,`2` 打印部分,`3` 树脂,`4` 打印平台,`5` 升降舵,`6` 树脂槽,`7`  激光光线,`8，9` 激光振镜,`10` UV激光器


可能还需要的部件，`真空泵`：保证打印机内真空环境。`浮块`：通过升降来控制液面位置。

### 工作流程

激光通过激光振镜聚焦在树脂表面，树脂凝固成型，刮刀刮去表面可能存在的气泡或是毛刺，完成单层打印。然后平台下降等于单层厚度的距离，树脂填充液面，覆盖新的树脂，继续打印直至模型打印完成。

## Rayland-Sla打印机 App介绍

参见后续博客。

## 打印文件Slc解析与实现

参见上一篇博客。

## 打印展示		

![eiffel](http://wx4.sinaimg.cn/mw690/c584f169ly1fpj4zu9oc7j20qo1hcwkm.jpg)


![eiffel2](http://wx1.sinaimg.cn/mw690/c584f169ly1fpj4zzmarpj20dc0qoq3j.jpg)