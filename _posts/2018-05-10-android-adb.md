---
layout: post
title:  "Adb 基础 "
date:   2018-05-03 11:00:00 +0800
categories: Android
tags: Android
author: chenjy
---



* content
{:toc}

`adb`即`Android Debug Bridge`是在我们在`Android`开发过程中常用的调试工具。所以本篇总结一下`adb`基础知识。




## adb 

`adb` 是`Android` 系统给我们提供的一个工具，用于完成`客户端-服务器端`关联。能让我们可以通过使用的`服务端 - pc`操作管理`客户端 - Android 虚拟机或真实设备`。这个操作的过程通过下发指令完成。

主要功能：

* 运行设备的`shell`命令行

* 管理设备的端口映射

* pc和设备之间的文件传输

* 本地`apk`的安装

### adb 使用

`adb`工具是不用安装的只需要从网上下载即可。

包住下载的adb包解压以后有下面三个文件。

![adb](http://wx4.sinaimg.cn/mw690/c584f169ly1frfnsrkuemj20c703jdfq.jpg)

在adb解压目录 `shift`+ 鼠标右键 ，在此处打开命令窗口即可。

如果经常使用可以将`adb.exe`目录配置到系统环境变量`path`中。（废话了 当然经常使用）

### adb 常用的十条指令

1.1 `adb devices`:比较常用的指令，查看pc是否和设备连接。 

```cmd

adb devices

```

![adb](http://wx3.sinaimg.cn/mw690/c584f169ly1frfnt2v3vwj207q01xt8h.jpg)

2.2 `adb push`:将文件推送到设备中

```cmd

// adb push 'pc端文件路径' '文件在设备保存路径'

adb push F:\adb\test.txt /sdcard/

```

3.3 `adb pull`:将文件从设备中取出

```cmd

// adb pull '设备端文件路径' '文件在pc保存路径'

adb push /sdcard/test.txt F:\adb\

```

4.4 `adb reboot`:重启设备

5.5 `adb install `:安装apk

```cmd

// adb pull '设备端文件路径' '文件在pc保存路径'

adb install -r F:\adb\test.apk

```

Tips:

安装以后，我们可以通过`adb`启动它,使用`adb shell` 下文会介绍

```cmd

// adb shell am start -n 包名/主类名

adb shell am start -n com.test/com.test.MainActivity  

```

如果是第三方`apk`,我们可以使用[apktool](https://ibotpeaches.github.io/Apktool/install/) 反编译app,从反编译的`AndroidManifest.xml`中获取需要的包名和主类名

6.6 `adb help`:获取帮助信息

7.7 `adb sync`:同步跟新，如果不指定路径将同时更新`/data`和`/system`

8.8 `adb remount`:重新挂载

9.9 `adb forward`:将`pc`的某端口数据重定向到手机端的一个端口,可以实现`pc`和设备之间`socket`通信

## adb shell

上面介绍了adb 常用的指令，但是我们落下了最重要的一块`shell`

* `shell` 提供了用户和内核进行交互操作的接口，它接收用户输入的命令并把它送入内核去执行。

> Android 基于 Linux，那么 Linux shell 命令在 Android 里大都也是适用的。所有以`adb shell`开头的命令，都可以先执行`adb shell`命令进入目标设备的`Linux Shell`环境，然后在目标设备的`Linux Shell`中再执行`adb shell`之后的命令。

除了上面说的`adb shell am start -n`

常用的`adb shell`指令还有

```cmd

ls //查看目录

data // 打印或设置当前系统时间   

cat /proc/meminfo // 查看内存信息

cat /proc/cpuinfo // 查看CPU信息 

dumpsys activity //列出目标设备上的activity栈(back stack)和任务(task)的信息

pm list permissions //列出目标平台上的所有权限

pm list packages //列出目标设备上安装的所有app的包名

```

Tips:

> mount -o rw,remount /system ,以可读写的方式加载/system分区。可以对system分区文件进行操作。

## 使用批处理执行

既然`adb`是在`pc`端使用的工具就可以使用批处理`.bat`文件来完成批量或是重复操作操作。也可以做成小工具给不懂`adb`的操作人员使用。

我们将`.bat`文件新建并放在和`adb.exe`相同路径下。

* `push` 文件

```cmd

@echo off

set a= %~dp0machine.status  
set b=/sdcard/ 
echo %a%  
echo %b% 
adb.exe remount  &&echo **成功**
adb.exe push %a% %b% ||echo **失败** 

pause

```

> echo:`回显` 将这条命令后的内容显示到控制台上

> echo off:`关闭回显` 这条命令后的内容不显示到控制台上，除了本条指令

> @echo off:这条命令后的内容不显示到控制台上，包括本条指令

> %~dp0:当前批处理文件所在完整目录

![adb](http://wx4.sinaimg.cn/mw690/c584f169ly1frfnt04dvoj20a2047q2r.jpg)

* 删除文件

```cmd

@echo off
 
set a=/sdcard/machine.status
echo %a%  
adb.exe shell rm %a% ||echo **失败** 

pause

```

![adb](http://wx4.sinaimg.cn/mw690/c584f169ly1frfnt5grpej207602zgld.jpg)






