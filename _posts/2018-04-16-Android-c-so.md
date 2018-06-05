---
layout: post
title:  " Android studio 编译so文件"
date:   2018-04-16 11:00:00 +0800
categories: Android 
tags: Android 
author: chenjy
---



* content
{:toc}

本篇简单介绍如何在`Android studio`中 编译`so`文件。





## 编译`so`文件

### NDK安装

`Android studio` --> `Tools` --> `Android` --> `SDK manager`

选择 `SDK Tools`,勾选 `CMake`,`LLDB`和`NDK`

![NDK](http://wx1.sinaimg.cn/mw690/c584f169ly1fqfso8gjsuj20r40j5gn3.jpg)

下载、安装完成即可。

### JNI

1.创建一个`java`类，类名要与后面要编译的`.c`文件名相同。

如我们要编译 `gpx.c`，需要创建一个`gpx.java`。下面代码中load的`raylandGpx`生成的so文件名(不添加.so后缀)。

```java

public class Gpx {

	static {
        System.loadLibrary("raylandGpx");
    }
    
	//java调c/c++中的方法都需要用native声明且方法名必须和c的方法名一样
    public native String getString();
}

```

2.生成`class`文件

`build` --> `Make project`

![build](http://wx2.sinaimg.cn/mw690/c584f169ly1fqfsobgc1cj206y08pgll.jpg)

![class](http://wx4.sinaimg.cn/mw690/c584f169ly1fqfsodj1b7j20940b8749.jpg)

3.生成`.h`文件

在`Android studio` `Terminal`中 进入上图所示`debug`目录

```java

cd app\build\intermediates\classes\debug\cn\rayland\api

```

执行

```java

javah -classpath . -jni cn.rayland.api.Gpx

```

会在`debug`目录生成一个`.h`文件

![.h](http://wx4.sinaimg.cn/mw690/c584f169ly1fqfsofp8tbj208b07jwed.jpg)

4.JNI 

我们需要创建一个 `jni`文件夹

然后将 `.h`文件复制到`jni`中，并添加要编译的`.c`文件

接着在`jni`中创建一个`Android.mk`和`Application.mk`文件

`Android.mk`:

```xml
LOCAL_PATH := $(call my-dir)
include $(CLEAR_VARS)
LOCAL_MODULE    := raylandGpx
LOCAL_SRC_FILES := gpx.c
LOCAL_LDLIBS    := -lm -llog
include $(BUILD_SHARED_LIBRARY)

```

Tips: `LOCAL_MODULE`:编译的`Library`名，编译器会在`raylandGpx`基础上加上`lib`的前缀和`.so`的后缀就是我们最终的`so`文件。

`LOCAL_SRC_FILES`:我们要编译的 `c\c++`文件

`Application.mk`:选择要生成的`so`文件的架构

```xml

APP_ABI := all

```

![jni](http://wx2.sinaimg.cn/mw690/c584f169ly1fqft3hqrgvj206p031dfm.jpg)

5.修改`gradle`配置

![gradle](http://wx2.sinaimg.cn/mw690/c584f169ly1fqfsopszyhj20as07vweg.jpg)

最后在`Terminal`中，`main`目录下

```java

ndk-build

```

`so`文件就生成了

![so](http://wx1.sinaimg.cn/mw690/c584f169ly1fqfsosm8acj206p06hjr9.jpg)

















