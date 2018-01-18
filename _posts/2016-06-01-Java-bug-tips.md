---
layout: post
title:  "Java tips"
date:   2016-06-01 20:00:00 +0800
categories: Java
tags: Java
author: JiuYang Chen
---

* content
{:toc}




## Java tips

### `javax.servlet.ServletContext`

BUG :`The type javax.servlet.ServletContext cannot be resolved. It is indirectly referenced from required`

Solution: 把`tomcat/lib`目录中的`jsp-api.jar`和`servlet-api.jar`导入到项目的`web/lib`目录下。
	

### `cast`

BUG :`Jfinal Db.findFirst` `java.lang.Long cannot be cast to java.lang.Integer`

Solution:`return Db.findFirst(sql).getLong("count").intValue();`
	
	
### `错误: 编码GBK的不可映射字符`

BUG : eclipse导出javadoc时的`错误: 编码GBK的不可映射字符`	

Solution：-encoding UTF-8 -charset UTF-8

![solution](http://wx2.sinaimg.cn/large/c584f169gy1fnkw18fb5bj20h40gwjrx.jpg)	
	
	
	
	
	
	
	
	
	
	