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

### return break 

> break is used to exit (escape) the for-loop, while-loop, switch-statement that you are currently executing.
return will exit the entire method you are currently executing (and possibly return a value to the caller, optional).


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
    <solid android:color="#00000000"/>
    <stroke android:width="1dp" android:color="#000000"/>
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