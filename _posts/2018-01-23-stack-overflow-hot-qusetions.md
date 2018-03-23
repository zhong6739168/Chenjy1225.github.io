---
layout: post
title:  "stack overflow hot qusetions"
date:   2018-01-23 11:00:00 +0800
categories: stackoverflow 
tags: stackoverflow 
author: chenjy
---



* content
{:toc}







## stack overflow

### Is it ever possible that (a ==1 && a== 2 && a==3) could evaluate to true, in JavaScript?


#### Answer 1

```js

const a = {
  i: 1,
  toString: function () {
    return a.i++;
  }
}

if(a == 1 && a == 2 && a == 3) {
  console.log('Hello World!');
}

```

这里使用了 `==`比较松散的等式，引擎会将一个操作数转换成另一个。这里会将a转换成数字。

对于非Date类型对象会优先尝试valueOf方法，如果失败再尝试toString方法(Date对象则反之)。这里先尝试`a.valueOf()`失败后尝试`a.toString()``return 1`。

#### Answer 2

```js

var aﾠ = 1;
var a = 2;
var ﾠa = 3;
if(aﾠ==1 && a== 2 &&ﾠa==3) {
    console.log("Why hello there!")
}

```

问题中的if中的三个a其实是不一样的，它们中间有Unicode空格字符。它不是由ECMA脚本解释为空格字符，它是标识符的有效字符。

它们可以等同于 _a,a,a_

### Why is port a string and not an integer?

因为冒号后面可以跟一个端口号或是一个服务名。

### How to set null context in call function?

```java

function test(){         
     if(this === null){
        console.log("This is null");
     }else{
         console.log("This is Object");
     }
 }
test.call(null);
test.call({});

Output :

This is Object.

This is Object.

expect Output :

This is Null.

This is Object.

```

#### Answer

> 如果该方法是在非严格模式下的函数，那么null和未定义将被全局对象替换，而原始值将被转换为对象。

```java

function test() {
  "use strict";
  if (this === null) {
    console.log("This is null");
  } else {
    console.log("This is Object");
  }
}
test.call(null);
test.call({});

Output :

This is Null.

This is Object.

```

#### 严格模式"use strict"

严格模式通过在脚本或函数的头部添加 "use strict"; 表达式来声明。

严格模式 消除Javascript语法的一些不合理、不严谨之处，减少一些怪异行为;

* 消除代码运行的一些不安全之处，保证代码运行的安全；

* 提高编译器效率，增加运行速度；

* 为未来新版本的Javascript做好铺垫。

[more](http://www.runoob.com/js/js-strict.html)

### How to sum the values in List<int[]> using Java 8

### 也许太监了

我发现轮子重复了