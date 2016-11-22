---
layout: post
title:  "Jquery Tips"
date:   2016-06-01 20:00:00 +0800
categories: jquery JavaScript
tags: jquery JavaScript
author: JiuYang Chen
---

* content
{:toc}





## Tips About Jquery.

1.1 `Jquery`动态绑定事件

```js

//Jquery绑定事件

$('.div').click(function(){});

//Jquery动态绑定事件

$('.div').on('click',function(){});

<-- 当页面动态刷新时，新加载的元素依然可以绑定事件 -->

$(document).on('click','.div',function(){});

```

2.2 `Jquery` `on`绑定`hover`事件

不能用`on`处理`hover`事件，因为`Jquery`的`hover`事件是一个封装的事件，不是真正的事件。

所以使用`mouseenter`和`mouseleave`来代替鼠标悬浮和离开事件。

```js

$(document).on('mouseenter', '.div', function() {
});

$(document).on('mouseleave', '.div', function() {
});


```

3.3 `Jquery`获取时间并且格式化

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

4.4 滚动条滚动底部

* `scrollTop([val])` 获取匹配元素相对滚动条顶部的偏移。

* `scrollLeft([val])` 获取匹配元素相对滚动条左侧的偏移。

* `scrollHeight` 滚动条高度

```js

$(".div").scrollTop( $(".div")[0].scrollHeight);


```

5.5 `Jquery` `size( )`和`length`

`size()`是`jQuery` 提供的函数，而 `length`是属性。两者的取值是一样的。