---
822layout: post
title:  "AGV 控制协议 for ROS"
date:   2018-04-12 14:00:00 +0800
categories: AGV 
tags: AGV 
author: chenjy
---



* content
{:toc}

> Ray-land AGV物流车控制协议  for ROS
> version 1.0
> data 2018/04/12






## `AGV`

`ROS -> Android`

**1.s-v控制指令** 

**G206 A**  `v` **X** `magn` `rfid` `ut` 

| Param |  Describe   |      Range       |   Unit |
| ----- | :---------: | :--------------: | -----: |
| v     |     速度      |    -200 ~ 200    | `cm/s` |
| magn  |  是否开启寻磁传感器  | `0:false 1:true` |        |
| rfid  | 是否开启rfid读卡器 | `0:false 1:true` |        |
| ut    |  是否开启雷达壁障   | `0:false 1:true` |        |

**2.目标点控制指令** 

**G207 A**  `v` **B** `start`**C** `aim` **X** `ut`

| Param | Describe |      Range       |   Unit |
| ----- | :------: | :--------------: | -----: |
| v     |    速度    |    -200 ~ 200    | `cm/s` |
| start |   起始点    |                  |        |
| aim   |   目标点    |                  |        |
| ut    | 是否开启雷达壁障 | `0:false 1:true` |        |































