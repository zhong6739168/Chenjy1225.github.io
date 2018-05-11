---
layout: post
title:  " Android activity间通讯几种方式"
date:   2018-04-23 11:00:00 +0800
categories: Android
tags: Android
author: chenjy
---



* content
{:toc}

文本简单介绍`Android`中`activity`间的传统通讯方式和`EventBus`




## Activity 通讯

### Bundle

我们可以通过将数据封装在`Bundle`对象中 ，然后在Intent跳转的时候携带`Bundle`对象

> `bundle` 本质上是使用 `arrayMap`实现的

```java

Bundle bundle = new Bundle();
bundle.putString("name", "chenjy");
bundle.putInt("age", 18);

Intent intent = new Intent(MainActivity.this, SecondActivity.class);
intent.putExtras(bundle);
startActivity(intent);

```

用上述方法可以传递基本数据类型和String类型的数据，如果传递的是对象就需要进行序列化。

####  Serializable 和 Parcelable

`Serializable`和`Parcelable`是两个序列化接口，如果使用`Bundle`在`Intent`之间传递对象需要先进行序列化。

* 序列化的目的

1.通过序列化操作将对象数据在网络上进行传输(由于网络传输是以字节流的方式对数据进行传输的.因此序列化的目的是将对象数据转换成字节流的形式

2.将对象数据在进程之间进行传递(`Activity`之间传递对象数据时,需要在当前的`Activity`中对对象数据进行序列化操作.在另一个`Activity`中需要进行反序列化操作讲数据取出)

3.`Java`平台允许我们在内存中创建可复用的`Java`对象，但一般情况下，只有当`JVM`处于运行时，这些对象才可能存在，即，这些对象的生命周期不会比`JVM`的生命周期更长（即每个对象都在`JVM`中）但在现实应用中，就可能要停止`JVM`运行，但有要保存某些指定的对象，并在将来重新读取被保存的对象。这是`Java`对象序列化就能够实现该功能。（可选择入数据库、或文件的形式保存）

4.序列化对象的时候只是针对变量进行序列化,不针对方法进行序列化.

##### Serializable

`Serializable`是由`Java`提供的序列化接口，它是一个空接口。

`Person`:

```java

public class Person implements Serializable {

    private String name;
    private int age;

    public Person() {}

    public void setName(String name){
        this.name = name;
    }

    public void setAge(int age){
        this.age = age;
    }

    public String getName(){
        return name;
    }

    public int getAge(){
        return age;
    }

}

```

`MainActivity`:

```java

Person person = new Person();
                person.setName("chenjy");
                person.setAge(18);

                Bundle bundle = new Bundle();
                bundle.putSerializable("person",person);

                Intent intent = new Intent(MainActivity.this, SecondActivity.class);
                intent.putExtras(bundle);
                startActivity(intent);

```

`SecondAcitvity`:

```java

Person person = (Person)getIntent().getSerializableExtra("person");

```

这种序列化是通过反射机制从而削弱了性能，这种机制也创建了大量的临时对象从而引起GC频繁回收调用资源。

##### Parcelable

`Parcelable`是由`Android`提供的序列化接口,`google`做了大量的优化

`Person`:

```java

public class Person implements Parcelable {

    private String name;
    private int age;

    public Person() {}

    protected Person(Parcel in) {
        name = in.readString();
        age = in.readInt();
    }

    public void setName(String name){
        this.name = name;
    }

    public void setAge(int age){
        this.age = age;
    }

    public String getName(){
        return name;
    }

    public int getAge(){
        return age;
    }


    public static final Creator<Person> CREATOR = new Creator<Person>() {
        @Override
        public Person createFromParcel(Parcel in) {
            Person person = new Person();
            person.name = in.readString();
            person.age = in.readInt();
            return person;
        }

        @Override
        public Person[] newArray(int size) {
            return new Person[size];
        }
    };

    @Override
    public int describeContents() {
        return 0;
    }

    @Override
    public void writeToParcel(Parcel dest, int flags) {
     dest.writeString(name);
     dest.writeInt(age);
    }
}

```

运用真实的序列化处理代替反射,大量的引入代码但是速度会远快于`Serializable`。

所以优先选择`Parcelable`

#### arrayMap 1）

`arrayMap`是`HashMap`的替代品，因为手机的内存很宝贵，如果内存使用不当很容易引起`OOM`.`arrayMap`就是通过牺牲时间来换取空间的方式。

> `arrayMap` 使用两个数组来保存 key 和value的数据。`arrayMap`key使用二分法排序。在增、删、改使用的是二分查找法，查找效率比传统`hashmap` 会慢很多。在增、删元素以后会对空间进行调整，所以不适合数据量较大的场景。

与`arrayMap`类似的还有`SparseArray`

### 类静态变量

可以通过`public static`定义`Activity`的静态变量然后在其他`Activity`使用`类名.变量名`传递

### Application

可以通过在`Application` 中的全局静态变量来实现

### EventBus 

但是当传输的数据量较大的时候`Parcelable`虽然很便捷，但是会出现异常`TransactionTooLargeException`。只时候就需要用到插件`EventBus`


> `EventBus` 使用的是发布 订阅者模型,发布者通过EventBus发布事件，订阅者通过EventBus订阅事件。当发布者发布事件时，订阅该事件的订阅者的事件处理方法将被调用。


* 定义事件

```java

public class MessageEvent {

    private String message;

    public MessageEvent(String message) {
        this.message = message;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}

```

* 订阅事件

使用`@Subscribe`注解来定义订阅者方法，方法名可以是任意合法的方法名，参数类型为订阅事件的类型

```java

@Subscribe(threadMode = ThreadMode.MAIN)
public void onMessageEvent(MessageEvent event) {
    ...
}

```

`@Subscribe(threadMode = ThreadMode.MAIN)`中使用了ThreadMode.MAIN这个模式，表示该函数在主线程即UI线程中执行

EventBus总共有四种线程模式，分别是：

`ThreadMode.MAIN`：表示无论事件是在哪个线程发布出来的，该事件订阅方法onEvent都会在UI线程中执行，这个在Android中是非常有用的，因为在Android中只能在UI线程中更新UI，所有在此模式下的方法是不能执行耗时操作的。

`ThreadMode.POSTING`：表示事件在哪个线程中发布出来的，事件订阅函数onEvent就会在这个线程中运行，也就是说发布事件和接收事件在同一个线程。使用这个方法时，在onEvent方法中不能执行耗时操作，如果执行耗时操作容易导致事件分发延迟。

`ThreadMode.BACKGROUND`：表示如果事件在UI线程中发布出来的，那么订阅函数onEvent就会在子线程中运行，如果事件本来就是在子线程中发布出来的，那么订阅函数直接在该子线程中执行。

`ThreadMode.AYSNC`：使用这个模式的订阅函数，那么无论事件在哪个线程发布，都会创建新的子线程来执行订阅函数。


订阅者还需要在总线上注册，并在不需要时在总线上注销

```java

@Override
protected void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
    setContentView(R.layout.activity_main);
    // 注册订阅者
    EventBus.getDefault().register(this);
}

@Override
protected void onDestroy() {
    super.onDestroy();
    // 注销订阅者
    EventBus.getDefault().unregister(this);
}    


```

* 发布事件

```java

EventBus.getDefault().post(new MessageEvent("Post Event!"));

```










