---
layout: post
title:  "programe-collections"
date:   2016-06-01 20:00:00 +0800
categories: bug
tags: bug
author: JiuYang Chen
---

* content
{:toc}



## Java

### byte & 0xff

```java

 byte[] b = new byte[1];
        b[0] = -127;

        System.out.println("b[0]:"+b[0]+"; b[0]&0xff:"+(b[0] & 0xff));

//output:b[0]:-127; b[0]&0xff:129

```

计算机内二进制都是补码形式存储：

`b[0]:` 补码，10000001（8bit）

`b[0]`以`int`输出：int（32bit）,补位1。11111111 11111111 11111111 10000001（32bit）
和原数一致

`b[0]&0xff`:11111111 11111111 11111111 10000001（32bit） & 11111111 =
00000000 00000000 00000000 10000001

低精度转成高精度数据类型，有两种扩展方案。（1）补零扩展 （2）符号位扩展

对于正数两种是一样的。

* 使用补零扩展能够保证二进制存储的一致性，但不能保证十进制值不变

* 使用补符号位扩展能够保证十进制值不变，但不能保证二进制存储的一致性

> 对于有符号类型，Java使用的是补符号位扩展，这样能保证十进制的值不变

### return break 

> break is used to exit (escape) the for-loop, while-loop, switch-statement that you are currently executing.
> return will exit the entire method you are currently executing (and possibly return a value to the caller, optional).

### inputstream byte[] to String

```java

byte[] buffer = new byte[17];
                    if (is != null) {
                        int size = is.read(buffer);
                        if(size > 0 ){
                            String Str = new String(buffer,0,size);
                        }
                    }

```

### Stm32 send packet

```java

        byte[] packet = new byte[len];
        packet[0] = (byte) type;
        packet[1] = (byte) len;
        packet[2] = (byte) seq;
        packet[3] = (byte)(isreset?1:0);
        packet[4] = (byte) vx;
        packet[5] = (byte)(vx >>8);
        packet[6] = (byte) vy;
        packet[7] = (byte)(vy >>8 );
        
       // 
        System.arraycopy(command.toDatas(), 0, packet, 3, command.getLen());


       int Seq = (datas[0]&0XFF);
       int vx = (datas[1]&0XFF) | ((datas[2])<<8));
       int Vy = ((datas[3]&0XFF) | ((datas[4])<<8));
       boolean Motostatel = ((datas[4] & (1 << 1))!=0);
       boolean Motostater = ((datas[4] & (1 << 2))!=0);
```

* System.arraycopy(Object src,int srcPos,Object dest,int destPos,int length)

* `src`:源数组

* `srcPos`:源数组起始位置

* `dest`:目标数组

* `destPos`:目标数组起始位置

* `length`:长度

Tips: `src`和`dest`是要可以互相转换或是同类型的数组

Tips:

可以自己复制自己

```java

int[] src ={0,1,2,3,4,5,6}; 

System.arraycopy(src,0,src,3,3);

// output:{0,1,2,0,1,2,6}

```

生成一个长度为`length`的临时数组,将`fun`数组中`srcPos` 
到`srcPos+length-1`之间的数据拷贝到临时数组中，再执行`System.arraycopy(临时数组,0,fun,3,3)`




### new Semaphore(0)

```java

Semaphore semaphore = new Semaphore(0);

try {
                semaphore.acquire();
            } catch (InterruptedException e) {
                e.printStackTrace();
            }

//semaphore.release();

```

初始化信号量为0，`semaphore.acquire()`线程会阻塞。直到`semaphore.release()`之后 信号量变为1。

## mysql

### 1045 access denied for user 'root'@'localhost' using password yes 

>忘记localhost密码，密码错误

* step1,找到mysql安装目录下my.ini。在[mysql]下添加 skip-grant-tables 

* step2,重启mysql服务

* step3,以管理员身份运行 cmd. 输入mysql -u root -p，直接回车

* step4,输入use mysql


* step5,mysql 5.6以前的，输入UPDATE mysql.user SET Password=PASSWORD('123456') WHERE User='root'; 
  ​           
      mysql 5.6以后的，输入UPDATE mysql.user SET authentication_string=PASSWORD('root') WHERE USER='root';		 

## Android

### 权限

#### root

在`linux`系统中是只有`root权限`和`普通权限`,root即是最高权限。

`Android`获取`root`其实和`Linux`获取root权限一样。Linux下获取root权限的时候就是执行`sudo`或者`su`。

Android本身就不想让你获得Root权限，大部分手机出厂的时候根本就没有su这个程序。所以你想获得Android的root权限，第一步就是要把编译好的su文件拷贝到Android手机的`/system/bin`或者`/system/xbin/`目录下。接下来你可以在Android手机的adb shell或者串口下输入su了。



### getColor() 过时

```java

// 过时
textView.setTextColor(getResources().getColor(R.color.text_color));

textView.setTextColor(ContextCompat.getColor(this,R.color.text_color));

```

###  Installation error:INSTALL_FAILED_UID_CHANGED

尝试通过ADB删除产生冲突的数据文件

```cmd

adb rm -rf /data/data/<your.package.name>

```
###  setHeight  no use

当设置的高度比原来默认的高度要小时,调整setHeight是不生效的。

```java

editText=(EditText)findViewById(R.id.myEditText);

// editText.setHeight(10); //不生效

editText.getLayoutParams().height = 100; 

```

### Installation error:INSTALL_PARSE_FAILED_MANIFEST_MALFORMED

1.1 包名大写了

2.2 缺少`AndroidManifest.xml`文件


### Error:Error converting bytecode to dex

1.1 包重复

2.2 `build`本身问题, 只需要`clean and rebuild` 一下

### EditText光标颜色

`EditText` 有一个属性 `android:textCursorDrawable` 用来控制光标的颜色。`android:textCursorDrawable="@null"`,`"@null"`作用是让光标颜色和`text color`一样
​	
### 发现了以元素'd:skin'开头的无效内容	

把有问题的`devices.xml`删除,在`Android SDK` 里面的`tool\lib` 下找到`devices.xml`拷贝到那个文件夹。
​	
### finished with non-zero exit value 2

重复的`jar`包,删除引用的包，同时删除`module`的`build.gradle`文件的引用。

### border

```java

<?xml version="1.0" encoding="UTF-8"?>
<shape xmlns:android="http://schemas.android.com/apk/res/android">
    <solid android:color="#418bdc"/>
    <corners android:radius="2dp"/>
    <stroke android:width="2dp" android:color="#303f9f"/>
    <padding android:left="1dp" android:top="1dp" android:right="1dp" android:bottom="1dp" />
</shape>

```

### VideoView播放视频无法全屏问题

重写`VideoView`

```java

import android.content.Context;
import android.util.AttributeSet;
import android.widget.VideoView;

/**
 * Created by lijingnan on 12/04/2017.
 */
public class CustomerVideoView extends VideoView {

    public CustomerVideoView(Context context) {
        super(context);
    }

    public CustomerVideoView(Context context, AttributeSet attrs) {
        super(context, attrs);
    }

    public CustomerVideoView(Context context, AttributeSet attrs, int defStyleAttr) {
        super(context, attrs, defStyleAttr);
    }

    @Override
    protected void onMeasure(int widthMeasureSpec, int heightMeasureSpec) {
        // 其实就是在这里做了一些处理。
        int width = getDefaultSize(0, widthMeasureSpec);
        int height = getDefaultSize(0, heightMeasureSpec);
        setMeasuredDimension(width, height);
    }
}

```

### 退出程序

* KillProcess 

```java

  //结束当前程序的进程  
  android.os.Process.killProcess(android.os.Process.myPid());

```

Tips:`android`中所有的`activity`都在主进程中，`在Androidmanifest.xml`中可以设置成启动不同进程，`Service`不是一个单独的进程也不是一个线程。

当你Kill掉当前程序的进程时也就是说整个程序的所有线程都会结束，Service也会停止，整个程序完全退出。

* System.exit

```java

//0表示正常退出，1表示异常退出(只要是非0的都为异常退出)，即使不传0也可以退出，该参数只是通知操作系统该程序是否是正常退出
System.exit(0),System.exit(1)

```

### Can't create handler inside thread that has not called Looper.prepare()

> Handler对象与其调用者在同一线程中，如果在Handler中设置了延时操作，则调用线程也会堵塞。每个Handler对象都会绑定一个Looper对象，每个Looper对象对应一个消息队列（MessageQueue）。如果在创建Handler时不指定与其绑定的Looper对象，系统默认会将当前线程的Looper绑定到该Handler上。

> 在主线程中，可以直接使用new Handler()创建Handler对象，其将自动与主线程的Looper对象绑定；在非主线程中直接这样创建Handler则会报错，因为Android系统默认情况下非主线程中没有开启Looper，而Handler对象必须绑定Looper对象。


1.手动开启`Looper`,然后将其绑定到`Handler`对象上

```java

final Runnable runnable = new Runnable() {
　　@Override
　　public void run() {
　　　　//执行耗时操作
　　　　try {
　　　　　　Thread.sleep(2000);
　　　　} catch (InterruptedException e) {
　　　　e.printStackTrace();
　　　　}
　　}
};
new Thread() {
　　public void run() {
　　　　Looper.prepare();
　　　　new Handler().post(runnable);//在子线程中直接去new 一个handler
　　　　Looper.loop();　　　　//这种情况下，Runnable对象是运行在子线程中的，可以进行联网操作，但是不能更新UI
　　}
}.start();

```

2.通过`Looper.getMainLooper()`，获得主线程的`Looper`

```java

final Runnable runnable = new Runnable() {
　　@Override
　　public void run() {
　　　　//执行耗时操作
　　　　try {
　　　　　　Thread.sleep(2000);
　　　　} catch (InterruptedException e) {
　　　　e.printStackTrace();
　　　　}
　　}
};
new Thread() {
　　public void run() {
　　　　new Handler(Looper.getMainLooper()).post(runnable);
　　　　//这种情况下，Runnable对象是运行在主线程中的，不可以进行联网操作，但是可以更新UI
　　}
}.start();

```

### xxx is not an enclosing class

* 一般出现在内部类中，若要创建内部类的实例，需要有外部类的实例才行，或者是将内部类设置为静态的，添加 `static` 关键字

```java

public class A {  
    public class B {  
          
    }  
}

A a = new A();  
A.B ab = a.new B();  

```

### there is no default constructor available in ...

子类中使用了无参构造方法，而它的父类中至少有一个没有无参的构造方法。

* 如果一个类没有构造方法，会有一个默认的无参构造方法。
* 如果显示的定义了带参构造方法则默认的无参构造方法就会失效。

* 一个类只要有父类，那么在它实例化的时候，一定是从顶级的父类开始创建

> 子类使用无参构造函数创建子类对象时，会去先递归调用父类的无参构造方法，这时候如果某个类的父类没有无参构造方法就会出错

错误实例：

```java

public class Parent{

        int aga;

        public Parent(int age){
            this.aga = age;
        }
    }

    public class Child extends Parent{

        public Child(){
          /*
           * 默认调用父类的无参构造方法 
           * super();
           */
        }
    }


```

> 如果子类使用带参参构造函数创建子类对象时，没有使用super先调用父类的带参构造方法，这时默认会调用父类的无参构造方法，如果父类没有也会报错

错误实例：

```java

public class Parent{

        int aga;

        public Parent(int age){
            this.aga = age;
        }
    }

    public class Child extends Parent{

        public Child(int age){
          /*
           * 默认调用父类的无参构造方法 
           * super();
           */
        }
    }


```

上述也可以在子类调用父类的有参构造函数

```java

 public class Child extends Parent{

        public Child(int age){
        super(age);
        }
    }

```


## JFinal


### javax.servlet.ServletContext

BUG :`The type javax.servlet.ServletContext cannot be resolved. It is indirectly referenced from required`

Solution: 把`tomcat/lib`目录中的`jsp-api.jar`和`servlet-api.jar`导入到项目的`web/lib`目录下。
​	

### cast

BUG :`Jfinal Db.findFirst` `java.lang.Long cannot be cast to java.lang.Integer`

Solution:`return Db.findFirst(sql).getLong("count").intValue();`
​	
​	
### 错误: 编码GBK的不可映射字符

BUG : eclipse导出javadoc时的`错误: 编码GBK的不可映射字符`	

Solution：-encoding UTF-8 -charset UTF-8

![solution](http://wx2.sinaimg.cn/large/c584f169gy1fnkw18fb5bj20h40gwjrx.jpg)	
​	
​
## Jquery

### Jquery

#### Jquery动态绑定事件


```js

//Jquery绑定事件

$('.div').click(function(){});

//Jquery动态绑定事件

$('.div').on('click',function(){});

<-- 当页面动态刷新时，新加载的元素依然可以绑定事件 -->

$(document).on('click','.div',function(){});

```

#### Jquery on绑定hover事件

不能用`on`处理`hover`事件，因为`Jquery`的`hover`事件是一个封装的事件，不是真正的事件。

所以使用`mouseenter`和`mouseleave`来代替鼠标悬浮和离开事件。

```js

$(document).on('mouseenter', '.div', function() {
});

$(document).on('mouseleave', '.div', function() {
});


```

#### Jquery获取时间并且格式化

```js

Date.prototype.format = function(format) {
    /*
     * eg:format="YYYY-MM-dd hh:mm:ss";

     */
    var o = {
        "M+" :this.getMonth() + 1, // month
        "d+" :this.getDate(), // day
        "h+" :this.getHours(), // hour
        "m+" :this.getMinutes(), // minute
        "s+" :this.getSeconds(), // second
        "q+" :Math.floor((this.getMonth() + 3) / 3), // quarter
        "S" :this.getMilliseconds()
    // millisecond
    }
    if (/(y+)/.test(format)) {
        format = format.replace(RegExp.$1, (this.getFullYear() + "")
                .substr(4 - RegExp.$1.length));
    }
    for ( var k in o) {
        if (new RegExp("(" + k + ")").test(format)) {
            format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k]
                    : ("00" + o[k]).substr(("" + o[k]).length));
        }
    }
    return format;
}

var startTime = new Date().format("yyyy-MM-dd 00:00:00");
var endTime = new Date().format("yyyy-MM-dd hh:mm:ss");

```

#### 滚动条滚动底部

* `scrollTop([val])` 获取匹配元素相对滚动条顶部的偏移。

* `scrollLeft([val])` 获取匹配元素相对滚动条左侧的偏移。

* `scrollHeight` 滚动条高度

```js

$(".div").scrollTop( $(".div")[0].scrollHeight);


```

#### Jquery size( )和length

`size()`是`jQuery` 提供的函数，而 `length`是属性。两者的取值是一样的。

#### 页面之间传值

```js

   //页面一
   location.href = "href2.html?id=3";

```

```js   
   //页面二
   var _url = document.URL;
   var _urlParam = _url.split('?')[1];
   var _value = _urlParam.split('=')[1];

```

 也可以使用`jquery.params.js` `$.query.get("id");`

 ### 灵活运用三目运算符

```js   
 
 (_list.equipStatus ==1?"运行中":(_list.repairStatus ==2?"维修中":"待确认"))
 
```

#### 正确引用jQuery

1.	尽量在`body`结束前才引入`jQuery`，而不是在`head`中。
  2.借助第三方提供的CDN来引入jQuery，同时注意当使用第三方CDN出现问题时，要引入本地的`jQuery`文件。
  3.<u>如果在`</body>`前引入`script`文件的话，就不用写`document.ready`了</u>，因为这时执行`js`代码时`DOM`已经加载完毕了。

```js   

<body>  
    <script src="http://lib.sinaapp.com/js/jquery11/1.8/jquery.min.js"></script>  
    <script>window.jQuery  document.write('<script src="jquery1.8.min.js">\x3C/script>')</script>  
</body> 

```

#### 优化jQuery选择器

```js   

<div id="nav" class="nav">  
    <a class="home" href="http://www.jquery001.com">jQuery学习网</a>  
    <a class="articles" href="http://www.jquery001.com/articles/">jQuery教程</a>  
</div>

```

如果我们选择class为home的a元素时，可以使用下边代码：

$('.home');  //1  

$('#nav a.home');  //2  

$('#nav').find('a.home');  //3 

1.	方法1，会使jQuery在整个DOM中查找class为home的a元素，性能可想而知。
  2.方法2，为要查找的元素添加了上下文，在这里变为查找id为nav的子元素，查找性能得到了很大提升。
  3.方法3，使用了find方法，它的速度更快，所以方法三最好。

关于jQuery选择器的性能优先级，ID选择器快于元素选择器，元素选择器快于class选择器。因为ID选择器和元素选择器是原生的`JavaScript`操作，而类选择器不是。


#### 缓存jQuery对象

缓存jQuery对象可以减少不必要的DOM查找，关于这点大家可以参考下缓存jQuery对象来提高性能。

```js  

// 糟糕
h = $('#element').height();
$('#element').css('height',h-20);

// 建议
$element = $('#element');
h = $element.height();
$element.css('height',h-20);

```

#####  使用子查询缓存的父元素
正如前面所提到的，DOM遍历是一项昂贵的操作。典型做法是缓存父元素并在选择子元素时重用这些缓存元素。

```js  

// 糟糕
var
    $container = $('#container'),
    $containerLi = $('#container li'),
    $containerLiSpan = $('#container li span');
// 建议 (高效)
var
    $container = $('#container '),
    $containerLi = $container.find('li'),
    $containerLiSpan= $containerLi.find('span');

```

#### 精简jQuery代码

一般来说,最好尽可能合并函数。

```js  

// 糟糕
$first.click(function(){
    $first.css('border','1px solid red');
    $first.css('color','blue');
});
// 建议
$first.on('click',function(){
    $first.css({
        'border':'1px solid red',
        'color':'blue'
    });
});

```

#### 减少DOM操作

##### 最小化DOM更新

重布局和重绘是WEB页面中最常见的也是最昂贵的两种操作。
当改变样式，而不改变页面几何布局时，将会发生重绘。隐藏一个元素或者改变一个元素的背景色时都将导致一次重绘。
当对页面结构进行更新时，将导致页面重布局。

```js  

	//糟糕
	for(var i=0; i<10000; i++){
	$("#main table").append("<tr><td>aaaa</td></tr>");
	}
	//建议
	var tablerow = "";
	for(var i=0; i<10000; i++){
	tablerow  += "<tr><td>aaaa</td></tr>";
	}
$("#main table").append(tablerow);

```

#### prop和attr方法

对于元素自身的固有属性 使用 prop 对于自定义的属性使用attr方法

例：获取选中的checkbox的value值

```js  

	$("input[type=checkbox]").each(function() {

					if(true == $(this).prop("checked")) {
					
						alert($(this).attr("value"));
						
					}
				});

```

#### each遍历

用`each`实现全选或是取消全选。

```js  

	$("#selectAll").click(function() {
	
				if($("#selectAll").prop("checked")) {
					$("#selectAll input[type=checkbox]").each(function() {
						$(this).prop("checked", "true");
					});
					
				} else {
				
					$("#selectAll input[type=checkbox]").each(function() {
						$(this).removeAttr("checked");
					});
				}
			});


```

### layer.js

#### 父页面和子页面传值

1.1 访问父页面值

```js  

// "id" 父页面元素
var parentId=parent.$("#id").val();

```

2.2 访问父页面方法

```js  

var parentMethod=parent.getMethod();

```

3.3 给父页面传值

```js  

    // "id" 父页面元素
    parent.$('#id').text('');
	

```

4.4 关闭弹出的子页面窗口

```js  

//获取窗口索引  

var index = parent.layer.getFrameIndex(window.name); 

//关闭弹出的子页面窗口  

parent.layer.close(index);

```

5.5 子页面调用父页面刷新

```js  

parent.location.reload();

```

### uploadify.js

#### error placeholder element

这是因为input 元素必须有id，并且用id初始化uploadify函数。否则就报错。
​	



























​	
​	
​	
​	
​	
​	
​	
​	