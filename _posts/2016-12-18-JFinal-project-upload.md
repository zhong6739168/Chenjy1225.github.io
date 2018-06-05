---
layout: post
title:  "Jfinal 文件上传"
date:   2016-12-18 19:00:00 +0800
categories: Java
tags: Java JFinal
author: chenjy
---

* content
{:toc}

本篇介绍`JFinal`和`Jquery`插件`uploadify`结合上传图片文件功能。



## `JFinal`上传文件

### `uploadify`

可以在*http://www.uploadify.com/* 下载。

在原项目的基础上。

`uploadify`使用：

```html

<input id="file_upload_1" name="file_upload" type="file" multiple="true">  

```

```js

            /*
             * @param uploader 文件上传方法
             * @param onUploadSuccess 上传成功方法  data<String>上传成功后返回JSON数据
             */

		    $("#file_upload_1").uploadify({
		        height        : 30,
		        swf           : 'js/uploadify/uploadify.swf',
		        uploader      : 'upload/upload',
				buttonText    : '上传图片',
		        width         : 120,
		        fileSizeLimit : '500MB',
		        
				onUploadSuccess : function(file, data, response) {
					 var root = $.parseJSON(data);
					     fileRoot = root.fileRoot;
				}
		    });

```


> more in [uploadify](http://www.uploadify.com/documentation/)


![outPut](http://ww2.sinaimg.cn/mw690/c584f169gw1fb34rrliptj20df02f3yd.jpg)


### 对应的`upload`方法

首先要导入`jar`包，`cos-26Dec2008.jar`这是`Jfinal`文件上传依赖包。

`Maven`地址：

```xml

<!-- https://mvnrepository.com/artifact/com.jfinal/cos -->
<dependency>
    <groupId>com.jfinal</groupId>
    <artifactId>cos</artifactId>
    <version>26Dec2008</version>
</dependency>


```

添加和上面对应的`upload`方法。

`UploadController`：

```java

package controller;

import java.io.File;
import java.util.List;

import com.jfinal.core.Controller;
import com.jfinal.kit.PathKit;
import com.jfinal.upload.UploadFile;

public class UploadController extends Controller {

	  /**
	   * #文件上传大小限制 10 * 1024 * 1024 = 10M
	   */
	  public static final String config_maxPostSize = "10485760";
	  /**
	   * 文件上传根路径 
	   */
	 public static final String config_fileUploadRoot = "/upload/";

	public void upload() {
		
		  /**
		   * 文件上传根路径  :我这里的PathKit.getWebRootPath()：G:\eclipse-WorkSpace\JFinal_demo\WebRoot
		   */
		StringBuilder savePathStr = new StringBuilder(PathKit.getWebRootPath()+config_fileUploadRoot);
		File savePath = new File(savePathStr.toString());
		if (!savePath.exists()) {
			savePath.mkdirs();
		}
		String fileRoot="";
		try{
			// 保存文件
			List<UploadFile> files = getFiles(savePath.getPath(),Integer.parseInt(config_maxPostSize),"UTF-8");
			
			fileRoot = config_fileUploadRoot+files.get(0).getFileName();
		}catch(Exception e){
			e.printStackTrace();
		}
		setAttr("fileRoot", fileRoot);
		renderJson();

	}

}

```

上传图片

![outPut](http://ww3.sinaimg.cn/mw690/c584f169gw1fb34rqg2dmj20kd08mt98.jpg)

上传成功

![outPut](http://ww2.sinaimg.cn/mw690/c584f169gw1fb34rqui4mj20kk03uweg.jpg)


上传成功后会在WebRoot生成一个upload文件。

![outPut](http://ww1.sinaimg.cn/mw690/c584f169gw1fb34rrah9bj20bh0eygm2.jpg)

> Tips: 在文件上传表单中如果存在其他请求参数，在后端处理时，要先处理`file`请求，再处理其他请求参数，否则同样获取不到其他参数

[源代码](https://github.com/Chenjy1225/ChenjyDemo/tree/gh-pages/JFinal_demo_upload)

### 兼容性问题

上传插件`uploadify`新版本`chrome v59`无法正常使用

需要在`chrome://settings/content/flash` ,设置`flash`允许网站使用flash即可。

但是这个也太麻烦了吧！！！

## web uploader

我们可以用`web uploader`替换之 [web uploader](http://fex.baidu.com/webuploader/)

