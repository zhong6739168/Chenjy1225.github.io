---
layout: post
title:  "百度地图逆地址解析"
date:   2016-12-01 19:00:00 +0800
categories: Java
tags: Java JFinal
author: JiuYang Chen
---

* content
{:toc}

本篇使用`Geocoding API`逆地址解析经纬度，并且通过`fastjson`获取地址。



## `Geocoding API`

Geocoding API 是一类接口，用于提供从地址到经纬度坐标或者从经纬度坐标到地址的转换服务，用户可以使用C# 、C++、Java等开发语言发送请求且接收JSON、XML的返回数据。

*http://lbsyun.baidu.com/index.php?title=webapi/guide/webservice-geocoding*

简单的说就是通过向`http://api.map.baidu.com/geocoder/v2/`发送一个`HTTP/HTTPS`请求然后获取返回的数据。

请求示例：`http://api.map.baidu.com/geocoder/v2/?callback=renderReverse&location=39.915,116.404&output=json&pois=1&ak=你的ak密钥`  

Tips:ak密钥需要登录百度账号申请。

### `JavaScipt`调用

由于`ajax`跨域问题这里使用了`dataType: 'JSONP'`。

```js

<!DOCTYPE html>
<html>
	<head>
		<meta charset="UTF-8">
		<title></title>
	</head>
	<body>
		<button>提交</button>
	</body>
	<script type="text/javascript" src="js/jquery-1.9.1.js"></script>
	<script>
		$(document).ready(function() {
			$("button").click(function() {
				$.ajax({
					type: "GET",
					url: "http://api.map.baidu.com/geocoder/v2/?callback=renderReverse&location=39.915,116.404&output=json&pois=1&ak=你的ak密钥",					
					dataType: 'JSONP',
					success: function(data) {
						var list = data.result.addressComponent;
						console.log(data);
						console.log(list.country+""+list.province+""+list.district+""+list.street);
					}
				})
			});

		});
	</script>
</html>

```

output:

![outPut](http://ww1.sinaimg.cn/mw690/c584f169gw1faktepn1u8j20do0bgmxj.jpg)

### `Java`调用

```java

package HttpRequest;

// 导入`fastjson`
import com.alibaba.fastjson.JSONObject;
// 封装的`HttpRequest`类
import HttpRequest.HttpRequest;

public class BaiduMapRequset {

	public static void main(String[] args) {

		String responseData = HttpRequest.sendGet("http://api.map.baidu.com/geocoder/v2/",
				"callback=renderReverse&location=39.915,116.404&output=json&pois=1&ak=你的ak密钥");
		
		//解析返回的`Json`
		int start = responseData.indexOf("(") + 1;
		responseData = responseData.substring(start, responseData.lastIndexOf(")"));
		
		//获取返回的`city`值
		JSONObject jsonobject = new JSONObject();  
		System.out.println(jsonobject.parseObject(responseData).getJSONObject("result").getJSONObject("addressComponent").get("city"));
		

	}

}

```


output:

```java


北京市

```

由于返回的值为`Gson`:renderReverse&&renderReverse({"status":0, ...... "cityCode":131}}),所以需要简单的解析一下。
