---
layout: post
title:  " Android 关机和重启"
date:   2018-04-14 11:00:00 +0800
categories: Android 
tags: Android 
author: chenjy
---



* content
{:toc}

本篇简单介绍在`Android`中关机和重启的一种方法。



## `Android`关机和重启

### 配置系统签名和关机权限

AndroidManifest.xml

```xml

<manifest 
    ...
    android:sharedUserId="android.uid.system">


    <uses-permission android:name="android.permission.SHUTDOWN"/>

```

如果关机权限报错修改一下 `Inspections Settings`即可

![Inspections Settings](http://wx1.sinaimg.cn/mw690/c584f169ly1fqfso54s66j20jz0ieta3.jpg)


### 相关代码

* 重启

```java

Intent i = new Intent("android.intent.action.REBOOT");
                // 立即重启：1
                i.putExtra("nowait", 1);
                // 重启次数：1
                i.putExtra("interval", 1);
                // 不出现弹窗：0
                i.putExtra("window", 0);
                startActivity(i);

```

* 关机

```java

Intent i = new Intent("android.intent.action.ACTION_REQUEST_SHUTDOWN");
    // 是否弹出提示框
    i.putExtra("android.intent.extra.KEY_CONFIRM", false);
    startActivity(i);

```

### 添加系统签名

同上一篇[静默安装](https://chenjy1225.github.io/2018/03/27/android-u-update/)中使用的方式，添加系统签名。

安装签名成功的apk即可。
























