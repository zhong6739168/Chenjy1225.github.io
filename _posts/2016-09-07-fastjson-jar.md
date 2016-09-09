---
layout: post
title:  "fastjson 配置和使用"
date:   2016-09-07 19:00:00 +0800
categories: Java 
tags: Java fastjson
author: JiuYang Chen
---

* content
{:toc}





## fastjson

`fastjson`是一个很好的java实现的JSON解析和生成器，from `alibaba`。

### fastjson 下载

* 使用`Maven`下载：
(Maven使用可以参照以往的博客)

```xml

		<!-- https://mvnrepository.com/artifact/com.alibaba/fastjson -->
		<dependency>
		    <groupId>com.alibaba</groupId>
		    <artifactId>fastjson</artifactId>
		    <version>1.2.17</version>
		</dependency>

```

* `github`

[alibaba/fastjson](https://github.com/alibaba/fastjson)

### fastjson 使用

`Fastjson`的最主要的使用入口是`com.alibaba.fastjson.JSON`

```

1. 1 public static final Object parse(String text); // 把`JSON`文本解析为`JSONObject`或者`JSONArray`
2. 2 public static final JSONObject parseObject(String text)； // 把`JSON`文本解析成`JSONObject`
3. 3 public static final <T> T parseObject(String text, Class<T> clazz); // 把`JSON`文本解析为`JavaBean`
4. 4 public static final JSONArray parseArray(String text); // 把`JSON`文本解析成`JSONArray`
5. 5 public static final <T> List<T> parseArray(String text, Class<T> clazz); //把`JSON`文本解析成`JavaBean集合`
6. 6 public static final String toJSONString(Object object); // 将`JavaBean`序列化为`JSON`文本
7. 7 public static final String toJSONString(Object object, boolean prettyFormat); // 将`JavaBean`序列化为带格式的`JSON`文本
8. 8 public static final Object toJSON(Object javaObject); 将`JavaBean`转换为`JSONObject`或者`JSONArray`。

```

```java
     
     //将传入的`JSON`文本解析成了`JSONObject`
     JSONObject rs = new JSONObject();
				rs.put("robot1","ws1");
				rs.put("robot2", "ws2");
				rs.put("robot3", "ws3");
        
		System.out.println(rs);
    
    output: {"robot1":"ws1","robot2":"ws2","robot3":"ws3"}
```
