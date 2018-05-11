---
layout: post
title:  " Android ANR 分析"
date:   2018-04-28 11:00:00 +0800
categories: Android
tags: Android
author: chenjy
---



* content
{:toc}

`ANR``Application Not Responding`。在Android中，如果一些耗时操作造成主线程阻塞了一定时间，则系统会显示`ANR`提示用户此应用处于未响应的状态。




## ANR

### ANR出现的原因

* 用户的输入在5s内没被App响应

* BroadcastReceiver的onReceiver()超过10s

* Service中各生命周期函数执行超过20s


### ANR经典场景

1. UI线程等待其它线程释放某个锁，导致UI线程无法处理用户输入

2. 游戏中每帧动画都进行了比较耗时的大量计算，导致CPU忙不过来

3. Web应用中，网络状态不稳定，而界面在等待网络数据

4. UI线程中进行了一些磁盘IO（包括数据库、SD卡等等）的操作，在个别设备上因为硬件损坏等原因阻塞住了

5. 手机被其他App占用着CPU

### ANR日志分析

当`app`出现`ANR`会在`data/anr/`目录下生成`traces.txt`日志文件。每次发生`ANR`时都会删除旧的`traces`文件，重新创建新文件。也就是说`Android`只保留最后一次发生`ANR`时的信息。

我们可以使用`adb`导出

```xml

adb pull /data/anr/traces.txt  d:\

```

以最近发生的`ANR`为例，我们可以从`Android studio logcat`很明显的看出`ANR`发生的原因，用户的输入超时了，问题线程的`PID:879`

同时我们还可以通俗易懂的看出来 `CPU`平均负载，`CPU`的使用情况

```xml

// 4.67 ,3.32 ,1.49 分别表示 发生`ANR` 前一分钟，五分钟，十五分钟 `CPU`的平均负载
Load: 4.67 / 3.32 / 1.49

CPU usage from 6021ms to 79ms ago:

```

![anr](http://wx1.sinaimg.cn/mw690/c584f169ly1fr07yqkxh3j21cs0j9myu.jpg)

但是要进一步分析问题还需要看`traces.txt`

```xml

----- pid 879 at 1970-01-02 08:05:04 -----
Cmd line: com.sandiyu.lcd

JNI: CheckJNI is off; workarounds are off; pins=2; globals=273

DALVIK THREADS:
(mutexes: tll=0 tsl=0 tscl=0 ghl=0)

"main" prio=5 tid=1 WAIT
  | group="main" sCount=1 dsCount=0 obj=0x4159cd68 self=0x414d6510
  | sysTid=879 nice=0 sched=0/0 cgrp=apps handle=1074020692
  | state=S schedstat=( 0 0 0 ) utm=602 stm=168 core=1
  at java.lang.Object.wait(Native Method)
  - waiting on <0x4159ce38> (a java.lang.VMThread) held by tid=1 (main)
  at java.lang.Thread.parkFor(Thread.java:1205)
  at sun.misc.Unsafe.park(Unsafe.java:325)
  at java.util.concurrent.locks.LockSupport.park(LockSupport.java:157)
  at java.util.concurrent.locks.AbstractQueuedSynchronizer$ConditionObject.await(AbstractQueuedSynchronizer.java:2017)
  at java.util.concurrent.LinkedBlockingQueue.put(LinkedBlockingQueue.java:318)
  at com.sandiyu.lcd.utils.DeviceCommandSender$CommandSendThread.send(DeviceCommandSender.java:156)
  at com.sandiyu.lcd.utils.DeviceCommandSender.displayNull(DeviceCommandSender.java:81)
  at com.sandiyu.lcd.DlpPrintActivity$PrintRunnable.clearImage(DlpPrintActivity.java:884)
  at com.sandiyu.lcd.DlpPrintActivity$PrintRunnable.access$1900(DlpPrintActivity.java:253)
  at com.sandiyu.lcd.DlpPrintActivity.onBackPressed(DlpPrintActivity.java:954)
  at android.app.Activity.onKeyUp(Activity.java:2193)
  
  ...

```

一般`trace`文件顶部的线程即为`ANR`的元凶，找到了犯罪线程我们就可以查看、分析一下犯罪现场。

* line 1,2

```xml

----- pid 879 at 1970-01-02 08:05:04 -----
Cmd line: com.sandiyu.lcd

```

发现`ANR` 线程id，时间，名称

* line 3,4,5

```xml

JNI: CheckJNI is off; workarounds are off; pins=2; globals=273

DALVIK THREADS:
(mutexes: tll=0 tsl=0 tscl=0 ghl=0)

```

线程的基本信息（tll：thread list lock，tsl：thread suspend lock，tscl：thread suspend count lock，ghl：gc heap lock）

* line "main"

```xml

"main" prio=5 tid=1 WAIT

```

分别说明了线程名称，优先级，线程锁id和线程状态。

线程状态有如下几种，可以看到本次`ANR` 线程为`WAIT`状态



| java thread 状态 | cpp thread状态     | 说明                          |
| -------------- | ---------------- | --------------------------- |
| TERMINATED     | ZOMBIE           | 线程死亡，终止运行                   |
| RUNNABLE       | RUNNING/RUNNABLE | 线程可运行或正在运行                  |
| TIMED_WAITING  | TIMED_WAIT       | 执行了带有超时参数的wait、sleep或join函数 |
| BLOCKED        | MONITOR          | 线程阻塞，等待获取对象锁                |
| WAITING        | WAIT             | 执行了无超时参数的wait函数             |
| NEW            | INITIALIZING     | 新建，正在初始化，为其分配资源             |
| NEW            | STARTING         | 新建，正在启动                     |
| RUNNABLE       | NATIVE           | 正在执行JNI本地函数                 |
| WAITING        | VMWAIT           | 正在等待VM资源                    |
| RUNNABLE       | SUSPENDED        | 线程暂停，通常是由于GC或debug被暂停       |
|                | UNKNOWN          | 未知状态                        |


接着看

```xml

at com.sandiyu.lcd.utils.DeviceCommandSender$CommandSendThread.send(DeviceCommandSender.java:156)
  at com.sandiyu.lcd.utils.DeviceCommandSender.displayNull(DeviceCommandSender.java:81)
  at com.sandiyu.lcd.DlpPrintActivity$PrintRunnable.clearImage(DlpPrintActivity.java:884)
  at com.sandiyu.lcd.DlpPrintActivity$PrintRunnable.access$1900(DlpPrintActivity.java:253)
  at com.sandiyu.lcd.DlpPrintActivity.onBackPressed(DlpPrintActivity.java:954)

```


我们找到了原因，`CommandSendThread.send`需要等待网络资源来更新`UI`，连接中断了。这时候点击`onBackPressed`长时间得不到相应，它就挂了。






