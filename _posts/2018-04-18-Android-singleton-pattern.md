---
layout: post
title:  " 在Android studio 中使用单例模式"
date:   2018-04-18 11:00:00 +0800
categories: Android 
tags: Android 
author: chenjy
---



* content
{:toc}

本篇简单介绍如何在`Android studio`中 使用单例模式和使用注意事项。





## 单例模式

> 为什么要使用单例模式?

有一些对象我们只需要一个，只需要一个线程池 、缓存或是只有一台打印机、机器人 、机器人上面只有一个寻磁传感器。我们可以通过全局的静态变量来实现，但是全局变量在程序一开始就创建 可能比较耗费资源、可能一直没用到。单例模式和全局变量一样方便又没有它的缺点。

## 单利模式使用

```java

public class Sensor {

    // 使用静态变量记录唯一的实例
    private static Sensor sensorInstance;

    /**
     * 私有的构造方法
      */
    private Sensor(){}

    /**
     * 实例化方法
     * @return Sersor
     * synchronized包住不会有两个线程同时进入
     */
    public static synchronized Sensor getSersorInstance(){
        if(sensorInstance == null) {
             sensorInstance = new Sensor();
        }
        // 返回Sensor唯一实例
        return sensorInstance;
    }

}

```

但是如果想要很急切的创建示例，而且在示例创建方面的负担不繁重。

```java
public class Sensor {

    private static Sensor sensorInstance = new Sensor();

    private Sensor(){}

    public static Sensor getSersorInstance(){
        return sensorInstance;
    }
}

```

如果有很多线程频繁的使用`getSersorInstance`可能就影响性能，可以使用`双重检查加锁`

```java

public class Sensor {

    // volatile 保证 sensorInstance 被初始化 多个线程正确的处理
    private volatile static Sensor sensorInstance;
    
    private Sensor(){}
    
    public static Sensor getSersorInstance(){
        // 检查 sensorInstance是否存在 如果不存在就进入同步区块
       
        if(sensorInstance == null) {
            // 同步区块里面的代码只有在第一次才会执行
            synchronized(Sensor.class) {
                if(sensorInstance == null) {
                    sensorInstance = new Sensor();
                }
            }
        }
        return sensorInstance;
    }

}

```

## Android 中使用内存泄漏问题


1.在实例化的时候我们经常需要传入一些参数 比如说 `Context`

然后顺利成章的


```java

Sensor sensor = Sensor.getSersorInstance(MainActivity.this);

```

然后出现了一个很严重的问题`Sensor`单例持有了`MainActivity` 的`this对象`,所以当我们转跳其他`Activity`页面的时候`MainActivity` 的对象仍然得不到释放不能被回收。

所以我们应该使用`Application`中的 `context`

2.同样在急切的方法中

```java

public class Sensor {

        public static final Sensor SENSOR_INSTANCE = new Sensor();
        private List<MyListener> mListenerList;

        private Sensor() {
            mListenerList = new ArrayList<MyListener>();
        }

        public static Sensor getInstance() {
            return SENSOR_INSTANCE;
        }

        public void registerListener(MyListener listener) {
            if (!mListenerList.contains(listener)) {
                mListenerList.add(listener);
            }
        }
        public void unregisterListener(MyListener listener) {
            mListenerList.remove(listener);
        }
    }

    interface MyListener {
        public void onSomeThingHappen();
    }

```

MainActivity:

```java

public class MainActivity extends Activity {

        private MyListener mMyListener=new MyListener() {
            @Override
            public void onSomeThingHappen() {
            }
        };

        private Sensor sensor = Sensor.getInstance();
    
        @Override
        protected void onCreate(Bundle savedInstanceState) {
            super.onCreate(savedInstanceState);
            setContentView(R.layout.activity_main);
            sensor.registerListener(mMyListener);
        }
}


```

非静态的内部类(Sensor)的对象(mListenerList)都是会持有指向外部类对象(mMyListener)的引用。因此外部类对象(mMyListener)被持有了 同样的不会被回收,内存泄漏，所以需要

```java

@Override
    protected void onDestroy() {
        Sensor.unregisterListener(mMyListener);
        super.onDestroy();
    }

```