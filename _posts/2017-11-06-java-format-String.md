---
layout: post
title:  "Java Format String"
date:   2017-11-06 16:00:00 +0800
categories: Java 
tags: Java 
author: chenjy
---



* content
{:toc}


本篇博客介绍java中使用`printf`格式化`String`字符串，孤陋寡闻当然要学习一下。




熟悉c语言的开发者经常使用 printf方法来格式化String字符串。在java中PrintStream类提供了printf方法来完成同样的功能。


### printf 方法

* printf(String format,Object...args):

参数String 用来描述期望的输出格式,String 后面可以跟一系列参数。最基本的规则为

```java

"% [argument index] [flag] [width] [.precision] type"

```

* `%` 是一个特殊的字符表示格式化指令如下。

* `[argument index]` 表示参数的索引，如果参数不存在。则按照参数在参数列表出现的顺序进行格式化。

* `[flag]` 是一个特殊的格式化标记。`+`指定一个数值总是用一个符号格式化,`0`使用数字0进行填充。`-`右侧填充。

* `[width]`表示要输出的最小字符数量。

* `[.precision]`表示要输出的浮点数的精度。这基本上就是你想打印出来的小数位数。但是也可以用于其他类型截取输出宽度。

* `type` 和 %成对出现。表示要在输出中格式化的类型。 整数 `d`，字符串`s`，浮点数`f`，hex`x`。

```java

System.out.printf("Integer : %d\n",15);

System.out.printf("Floating point number with 3 decimal digits: %.3f\n",1.21312939123);

System.out.printf("Floating point number with 8 decimal digits: %.8f\n",1.21312939123);

System.out.printf("String: %s, integer: %d, float: %.6f", "Hello World",89,9.231435);


//output

Integer : 15

Floating point number with 3 decimal digits: 1.213

Floating point number with 8 decimal digits: 1.21312939

String: Hello World, integer: 89, float: 9.231435

```

### 基本规则

#### Integer

* `%d`输出原Integer

* `%6d`输出原Integer,如果不足6位则在左侧补上空格。

* `%-6d`输出原Integer,如果不足6位则在右侧补上空格。

* `%06d`输出原Integer,如果不足6位则在左侧补上0。

#### String 

* `%s`输出原String

* `%15s`输出原String,如果不足15字符则在左侧补上空格。

* `%-15d`输出原String,如果不足15字符则在右侧补上空格。


#### Float

* `%f`输出原Float

* `%15f`输出原Float,如果不足15位则在左侧补上空格。

* `%.8f`保留小数点后8位。

* `%9.4f`保留小数点后4位，如果不足9位则在左侧补上空格。

## String.format

如果你不想打印字符串只是想格式化字符串，你可以使用String 类的format方法。它和上面printf用法基本一致。











