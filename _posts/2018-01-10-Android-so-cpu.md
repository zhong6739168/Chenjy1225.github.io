---
layout: post
title:  " Android so文件"
date:   2018-01-18 11:00:00 +0800
categories: Android 
tags: Android 
author: JiuYang Chen
---



* content
{:toc}

本篇简单介绍`Android`中so文件相关事项。





## CPU架构

目前主流的CPU架构：x86,ARM,MIPS

它们采用的指令集又分为CISC(复杂指令集)和RISC(精简指令集)两种

`CISC(复杂指令集)`：

1.指令系统庞大，指令功能复杂，指令格式、寻址方式多

2.绝大多数指令需多个机器周期完成

3.各种指令都可访问存储器

4.采用微程序控制

5.有专用寄存器，少量

6.难以用优化编译技术生成高效的目标代码程序


`RISC(精简指令集)`:

1.统一指令编码，可快速解译；

2.泛用的暂存器，所有暂存器可用于所有内容，以及编译器设计的单纯化

3.单纯的寻址模式

4.硬件中支援少数资料型别


* `x86``CISC`绝大部分pc都是x86架构。

* `ARM``RISC`广泛应用在嵌入式系统

* `MIPS``RISC`广泛被使用在许多电子产品、网络设备、个人娱乐装置与商业装置上

## CPU架构和ABI

`Android`系统目前支持以下七种不同的CPU架构：`ARMv5`，`ARMv7` (从2010年起)，`x86` (从2011年起)，`MIPS` (从2012年起)，`ARMv8`，`MIPS64`和`x86_64` (从2014年起)，每一种都关联着一个相应的应用程序二进制接口ABI（Application Binary Interface）。

ABI定义了二进制文件（尤其是.so文件）如何运行在相应的系统平台上，从使用的指令集，内存对齐到可用的系统函数库。



| ABI\CPU     | armeabi      | armeabi-v7a | arm64-v8a | mips|mips64|x86|x86_64|
|-----------|:-------------:|:-------------:|:-----:|-------------:|
| ARMv5  |支持 |||||||
| ARMv7| 支持|支持||||||
| ARMv8        |支持 |支持|支持|||||
| MIPS       | |||支持||||
| MIPS64       | |||支持|支持|||
| x86       | 支持|支持||||支持||
| x86_64       | 支持|||||支持|支持|


[ABI官方介绍](https://developer.android.com/ndk/guides/abis.html)

## so文件


* so机制让开发者最大化利用已有的C和C++代码，达到重用的效果，利用软件世界积累了几十年的优秀代码

* so是二进制，没有解释编译的开消，用so实现的功能比纯java实现的功能要快

* so内存分配不受Dalivik/ART的单个应用限制，减少OOM

* 相对于java代码，二进制代码的反编译难度更大，一些核心代码可以考虑放在so中。

### so文件的加载

so文件的加载，Android在System类中提供两种方法。

```java

/**
  * See {@link Runtime#loadLibrary}.
  */
 public static void loadLibrary(String libName) {
     Runtime.getRuntime().loadLibrary(libName, VMStack.getCallingClassLoader());
 }
/**
  * See {@link Runtime#load}.
  */
 public static void load(String pathName) {
     Runtime.getRuntime().load(pathName, VMStack.getCallingClassLoader());
 }


```

#### System.loadLibrary

这是我们最常用的一个方法，System.loadLibrary只需要传入so在Android.mk中定义的LOCAL_MODULE的值即可，系统会调用System.mapLibraryName把这个libName转化成对应平台的so的全称并去尝试寻找这个so加载。比如我们的so文件全名为libmath.so，加载该动态库只需要传入math即可：

```java

System.loadLibrary("math");

```

#### System.load

官方介绍： 

>Loads a code file with the specified filename from the local file system as a dynamic library.The filename argument must be a complete path name.

所以它为动态加载非apk打包期间内置的so文件提供了可能，也就是说可以使用这个方法来指定我们要加载的so文件的路径来动态的加载so文件。比如我们在打包期间并不打包so文件，而是在应用运行时将当前设备适用的so文件从服务器上下载下来，放在/data/data/<package-name>/mydir下，然后在使用so时调用：   

```java

System.load("/data/data/<package-name>/mydir/libmath.so");

```

即可成功加载这个so，开始调用本地方法了。

其实loadLibrary和load最终都会调用nativeLoad(name, loader, ldLibraryPath)方法，只是因为loadLibrary的参数传入的仅仅是so的文件名，所以，loadLibrary需要首先找到这个文件的路径，然后加载这个so文件。
而load传入的参数是一个文件路径，所以它不需要去寻找这个文件路径，而是直接通过这个路径来加载so文件。

但是当我们把需要加载的so文件放在SdCard中，会发生什么呢？把上面so的路径改成/mnt/sdcard/libmath.so，再尝试加载时，会得到如下错误： 

```java

java.lang.UnsatisfiedLinkError: dlopen failed: couldn't map "/mnt/sdcard/libmath.so" segment 1: Permission denied

```
 这是因为SD卡等外部存储路径是一种可拆卸的（mounted）不可执行（noexec）的储存媒介，不能直接用来作为可执行文件的运行目录，使用前应该把可执行文件复制到APP内部存储下再运行。所以使用System.load加载so时要注意把so拷贝至/data/data/<package-name>/下。

### so文件注意事项

1.很多设备都支持多于一种的ABI。但最好是针对特定平台提供相应平台的二进制包，从而得到更好的性能。

2.你应该尽可能的提供专为每个ABI优化过的.so文件，但要么全部支持，要么都不支持：你不应该混合着使用。你应该为每个ABI目录提供对应的.so文件。
当一个应用安装在设备上，只有该设备支持的CPU架构对应的.so文件会被安装。在x86设备上，libs/x86目录中如果存在.so文件的话，会被安装，如果不存在，则会选择armeabi-v7a中的.so文件，如果也不存在，则选择armeabi目录中的.so文件（因为x86设备也支持armeabi-v7a和armeabi）。

3.使用NDK时，你可能会倾向于使用最新的编译平台，但事实上这是错误的，因为NDK平台不是后向兼容的，而是前向兼容的。推荐使用app的minSdkVersion对应的编译平台。









