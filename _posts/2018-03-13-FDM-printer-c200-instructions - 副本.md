---
layout: post
title:  "Rayland-FDM打印机C200介绍"
date:   2018-03-14 14:00:00 +0800
categories: 3D打印 
tags: 3D打印 FDM
author: chenjy
typora-copy-images-to: ../images
---

* content
{:toc}

本篇主要介绍Rayland-FDM打印机 C200 App介绍以及软件结构。



## Rayland-FDM 打印机 C200



<div align="center">
<img src="http://wx4.sinaimg.cn/mw690/c584f169ly1fpmuuiwzo9j21kw28h1l0.jpg"></div>





**FDM:`Fused Deposition Modeling` 熔融沉积成型法**

FDM打印文件：STL文件,Gcode文件,x3g文件



<div align="center">
<img src="http://wx3.sinaimg.cn/mw690/c584f169ly1fpmuumha22j2064064aa4.jpg"></div>



`熔融沉积模型`

**a）** 通过加热的移动头

**b）** 供给，熔化并挤出，逐层沉积，形成期望的形状

**c）** 移动平台

**e）** 在每层沉积之后降低。对于这种3D打印技术，需要额外的垂直支撑结构

**d）** 来维持悬垂部分



> FDM APP源码Git ：// 当然保密了

> FDM Library源码Git：//

### APP主要界面

#### 主界面 

<div align="center">
<img src="http://wx4.sinaimg.cn/mw690/c584f169ly1fpmuup9uvtj20sg0godjb.jpg"></div>

从左到右，从上到下依次为

X轴当前坐标（mm），Y轴当前坐标（mm），Z轴当前坐标（mm），是否锁住电机（空闲状态）

打印速度设置（%），风扇速度设置（%），灯光亮度设置（%），热床温度设置（°C）

挤出头1温度设置，挤出头2温度设置 
（热床、挤出头1、2点击图标设置温度，点击后方条形框查看30s内温度变化）
（最多支持4个挤出头）

#### 移动界面


<div align="center">
<img src="http://wx1.sinaimg.cn/mw690/c584f169ly1fpmuurzgygj20sg0go0v4.jpg"></div>

**`左侧`**  控制电机以及挤出头运动，电机`-∞`和`+∞ `对应这`min`和`max`处碰撞开关。挤出头`-∞`和`+∞ `对应着进出料。

**`右侧`** 可以控制挤出头到达`左上`、`右上`、`左下`、`右下`四个位置（挤出头和X,Y轴电机）（移动距离由机器设置中设置的对应轴长运算得出）

`HOME`可以自动归为起始位置

`AUTO`自动调零 暂无

#### 在线下载界面

<div align="center">
<img src="http://wx2.sinaimg.cn/mw690/c584f169ly1fpmuv14jcdj20sg0go0yr.jpg"></div>

#### 读取本地文件界面


<div align="center">
<img src="http://wx3.sinaimg.cn/mw690/c584f169ly1fpmuv3ngm9j20sg0gomyh.jpg"></div>

支持 `x3g`,`Gcode`,`stl`文件。支持离线解析`stl`文件。

#### 摄像头界面


<div align="center">
<img src="http://wx4.sinaimg.cn/mw690/c584f169ly1fpmuv673zuj20sg0go75c.jpg"></div>

支持外置`USB摄像头`

#### 机器设置


<div align="center">
<img src="http://wx4.sinaimg.cn/mw690/c584f169ly1fpmuv673zuj20sg0go75c.jpg"></div>

打印机常用的参数设置

x轴为例 如：`驱动电压`、`零点坐标`、`轴长`、`碰撞开关位置`等

#### 机器设置


<div align="center">
<img src="http://wx4.sinaimg.cn/mw690/c584f169ly1fpmuv8csrmj20sg0gogn6.jpg"></div>

包括离线更新APK、WIFI设置、修改用户名密码、还原系统设置、个性logo设置等

### APP 目录结构


<div align="center">
<img src="http://wx2.sinaimg.cn/mw690/c584f169ly1fpmuvhdlinj20h60enq44.jpg"></div>

**`assets`** 用于本地切片得默认配置文件`fdmprinter.json`，默认机器设置文件`machine.txt`，以及用于`gcode预览的js文件和html文件`

**`cn.rayland.pro_3d`** 应用包，按照UI结构划出多个子目录

* **`base.App:`**`FDM打印机`、`异常捕获`、`SharePreference`等初始化设置

* **`base.MachineStateBroadcastService:`** 网络状态变化`post`事件 <EventBus.jar>

* **`camera:`** 摄像头Fragemnt,`UVCCamera` 使用UVC驱动外置摄像头 <libuvccamera.jar>

* **`homepage:`** 主页Fragment

* **`local:`**本地Fragement,加载本地 `stl`,`gcode`,`x3g`文件，以及 `stl`切片

本地切片见`3dLibrary.jar - cn.rayland.utils.ConvertUtils stlToGcodeByLocal()`

* **`machine_config:`** 机器设置Fragment

* **`movement:`** 移动Fragment

* **`online:`** 在线下载Fragment

* **`sys_config:`**系统设置Fragment

* **`render.stl:`** `stl`模型预览以及相关操作

**`recyclerview`** `recyclerview`相关组件

**`update`** 应用更新相关类，U盘、sd卡检测是否有新版本APK,有则更新

### Library.jar结构


<div align="center">
<img src="{{site.baseurl}}/images/lib_pkg.png"></div>

**`android_erialport_api `** 串口通信相关

**`cn.rayland.api`** jni相关类

**`cn.rayland.library.bean`** 可复用bean

**`cn.rayland.library.sqlite`** sqlite数据库相关	

**`cn.rayland.library.stm32`** stm32通信相关

**`cn.rayland.library.utils`** 工具类

**`libcore.io`**  stm32通信引用的核心库

**`libcore.util`** stm32通信引用的核心库


#### Library.jar 主要接口

```java

/**
     * machine 对象
     */
    public volatile Machine machine;

    /**
     * 构造函数 初始化
     * @param context Context
     * @return
     */
    MachineManager getInstance(Context context);

    /**
     * 执行FileTask任务
     * @param task FileTask
     * @param ifReset 是否抢占
     */
    void sendTask(final FileTask task, final boolean ifReset);

    /**
     * 执行GcodeTask任务
     * @param task gcode指令
     * @param ifReset 是否抢占
     */
    void sendTask(final GcodeTask task, final boolean ifReset);

    /**
     * 插入Gcode命令
     * @param gcode 通常用于速度等参数的设置
     */
    void insertCommand(String gcode);

    /**
     * 取消打印
     */
    void cancel();

    /**
     * 暂停打印
     */
    void pause();

    /**
     * 恢复打印
     */
    void resume();

    /**
     * 是否有暂停的任务
     */
    hasPausedTask();

    /**
     * 保存上一次执行完的文件，保存为x3g格式
     * @param dirPath
     * @param fileName
     */
    Machine getMachineConfig();

    /**
     * 设置机器参数
     * @param configFilePath 文件路径
     */
    boolean setCustomMachineConfig (String configFilePath);

    /**
     * 获取当前机器状态
     * @return
     */
    MachineState getMachineState();

```




















