---
layout: post
title:  "Jfinal 项目搭建"
date:   2016-12-01 19:00:00 +0800
categories: Java
tags: Java JFinal
author: chenjy
---

* content
{:toc}

本篇介绍`JFinal`项目的搭建和简单功能实现。



## `JFinal`项目搭建

### 项目搭建

新建一个`Dynamic Web Project`

![outPut](http://ww2.sinaimg.cn/mw690/c584f169gw1famyubg7kpj20el0dw3yv.jpg)

`Target runtime`  为 <None>

![outPut](http://ww3.sinaimg.cn/mw690/c584f169gw1famyucen0qj20el0l175g.jpg)

`Default Output Folder` 推荐使用`WebRoot\WEB-INF\classes`



*此处的 `Default out folder` 必须要与` WebRoot\WEB-INF\classes` 目录完全一致才可以使用 `JFinal` 集成的 `Jetty` 来启动项目。 *

修改 `Content directory`，推荐输入` WebRoot `。


![outPut](http://ww3.sinaimg.cn/mw690/c584f169gw1famyucwrmej20el0l13yv.jpg)

`jfinal-xxx.jar` 与` jetty-server-8.1.8.jar` 拷贝至项目 `WEB-INF\lib` 下即可。

* Tips:这里的`WEB-INF\lib` 为`WebRoot`目录下的和上面配置的保持一致，当然你也可以使用`WebContent`

 修改 <u>web.xml</u>： 

```xml
 
<filter>
	<filter-name>jfinal</filter-name>
	<filter-class>com.jfinal.core.JFinalFilter</filter-class>
	<init-param>
		<param-name>configClass</param-name>
		<param-value>config.DemoConfig</param-value>
	</init-param>
</filter>
<filter-mapping>
	<filter-name>jfinal</filter-name>
	<url-pattern>/*</url-pattern>
</filter-mapping>
```


添加<u>DemoConfig</u>：

```java
 
package config;

import com.jfinal.config.*;

import controller.HelloController;

public class DemoConfig extends JFinalConfig {
    // 配置常量值  `如开发模式常量 devMode 的配置，默认视图类型 ViewType的配置`
	public void configConstant(Constants me) {
		me.setDevMode(true);
	}
    
    // 配置 JFinal 访问路由  如下代码配置了将”/hello”映射到 HelloController 这个控制器  http://localhost/hello 将 访 问 HelloController.index() 方
	public void configRoute(Routes me) {
		me.add("/hello", HelloController.class);
	}
    
    // 配置 JFinal 的 Plugin 如数据库访问插件
	public void configPlugin(Plugins me) {
	}

    // 配置 JFinal 的全局拦截器
	public void configInterceptor(Interceptors me) {
	}

    // 配置JFinal的Handler
	public void configHandler(Handlers me) {
	}
}


```

添加<u>HelloController</u>：

```java

package controller;

import com.jfinal.core.Controller;
public class HelloController extends Controller {
	public void index() {
		renderText("Hello JFinal World.");
	}
}

```

`Run As --> Run configurations`

![outPut](http://ww1.sinaimg.cn/mw690/c584f169gw1famyuddkbcj20ll0jita5.jpg)


* 访问http://localhost/hello


> 上面的启动配置也可以使用一个任意的main方法代替。在任意一个类文件中添加一个main启动集成的jetty

如在`DemoConfig`中：

```java

public static void main(String[] args) {
	// eclipse 下的启动方式 指定端口和路径
	JFinal.start("WebRoot", 8088, "/Demo", 5);
}

```

### 连接`mysql`数据库

修改<u>DemoConfig</u>：

```java

//加载datasource.properties 数据库配置

	public void configConstant(Constants me) {
		loadPropertyFile("datasource.properties");
		me.setEncoding("UTF-8");
		me.setDevMode(true);
	}


//连接mysql数据库

	public void configPlugin(Plugins me) {
		
		C3p0Plugin c3p0Plugin = new C3p0Plugin(getProperty("jdbcUrl"), getProperty("user"), getProperty("password").trim());
        me.add(c3p0Plugin);
        ActiveRecordPlugin arp = new ActiveRecordPlugin(c3p0Plugin);
        me.add(arp);
	}
	
//更改启动项目配置 现在就可以直接 `Run As` -->`Java Appliaction` 访问地址`http://localhost:8088/Demo/index.html`
	public static void main(String[] args) throws Exception {
		JFinal.start("WebRoot", 8088, "/Demo", 5);
	}
	
```

添加<u>datasource.properties<u>：

```xml
 
jdbcUrl = jdbc:mysql://121.40.78.44/zhitong_test?characterEncoding=utf-8&zeroDateTimeBehavior=convertToNull
user = root
password =Ne0Print1202
devMode = true
	
```

### 简单的增删查改功能

下面简单实现账号的增删查改。(不要太在意逻辑...)

添加一个简单的html页面,<u>index.html</u>

`hello/addUser`、`hello/deleteUser`、`hello/findUser`和`hello/updateUser`分别对应着`HelloController`的四个方法

```html

<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8" />
		<title></title>
	</head>
	<body>
		<span>账号</span>
		<input type="text" id="username" />
		<span>密码</span>
		<input type="text" id="password" />
		<button id="add">添加</button>
		<button id="delete">删除</button>
		<button id="find">查询</button>
		<button id="update">修改</button>
	</body>
	<script type="text/javascript" src="js/jquery-1.9.1.js" ></script>
	
	<script>
		
		$(document).ready(function(){

             // 点击添加调用 HelloController中的addUser方法，路径"hello/addUser"
             // 路径在 DemoConfig - configRoute 已配置好为 /hello
             
             // 账号添加   传入参数 ”账号密码”
			$("#add").click(function(){
				var _userName = $("#username").val();
				var _password = $("#password").val();
				
				$.post("hello/addUser",{userName:_userName,password:_password},function(data){
					alert(data);
				})
				
			});
			
			// 账号删除  传入参数 ”账号密码”  
			$("#delete").click(function(){
				var _userName = $("#username").val();
				var _password = $("#password").val();
				
				$.post("hello/deleteUser",{userName:_userName,password:_password},function(data){
					alert(data);
				})
				
			});
			
			// 密码查询  传入参数 ”账号”  根据账号 查找密码
			$("#find").click(function(){
				var _userName = $("#username").val();
				
				$.post("hello/findUser",{userName:_userName},function(data){
					alert(data);
				})
				
			});		
			
			// 密码修改  传入参数 ”账号 新密码”  根据账号 修改密码
			$("#update").click(function(){
				var _userName = $("#username").val();
				var _password = $("#password").val();
				
				$.post("hello/updateUser",{userName:_userName,password:_password},function(data){
					alert(data);
				})
				
			});		
		})
	</script>
</html>

```

在`service`包中添加和`HelloController`对应的<u>HelloService</u>

> 这里使用`JFinal`独创的 `Db + Record` 模式 ，提供了`Model`类之外的数据库操作功能。它充当了`MVC`中的`Model`层。

```java

package service;

import java.util.List;

import com.jfinal.plugin.activerecord.Db;
import com.jfinal.plugin.activerecord.Record;

public class HelloService {

	
	public static void addUser(Record record){	
		Db.save("zt_user", record);
		
	}
	
	public static void deleteUser(String userName,String password){
		Db.update("delete from zt_user where name = "+userName+" and password = "+password+" ");
		
	}
	public static Record findUser(String userName){
		
		return Db.findFirst("select password from zt_user where name = "+userName+" ");
	}
	
	public static void updateUser(String userName,String password){
		Db.update("update zt_user set password = "+password+" where name = "+userName+" ");
		
	}
	
	
}

```

然后修改<u>HelloController</u>

> jfinal Controller类提供了getPara系列方法用来从请求中获取参数。

这里我们使用getPara((String string)来获取账号和密码。

```java

import java.util.List;

import com.jfinal.core.Controller;
import com.jfinal.plugin.activerecord.Record;

import service.HelloService;

import com.jfinal.core.Controller;

public class HelloController extends Controller {

	public void addUser() {
        
		String userName = getPara("userName");
		String password = getPara("password");
		Record user = new Record().set("name", userName).set("password", password);

		HelloService.addUser(user);
		renderText("添加成功");
	}

	public void deleteUser() {

		String userName = getPara("userName");
		String password = getPara("password");

		HelloService.deleteUser(userName, password);
		renderText("删除成功");
	}
	
	public void findUser() {

		String userName = getPara("userName");

		Record record = HelloService.findUser(userName);
		renderText(""+record.get("password")+"");
	}
	
	public void updateUser() {

		String userName = getPara("userName");
		String password = getPara("password");

		HelloService.updateUser(userName, password);
		renderText("修改成功");
	}
	
}

```

![outPut](http://ww3.sinaimg.cn/mw690/c584f169gw1famyuez0gbj210208zmxg.jpg)

![outPut](http://ww3.sinaimg.cn/mw690/c584f169gw1famyufb3ibj20eu02o747.jpg)

### other

同样你也可以使用`Model`类对应`configPlugin`配置 。

<u>DemoConfig</u>：

```java

arp.addMapping("user", User.class); 

```
建立数据库表名到 Model 的映射关系，然后使用继承Model的方法。

```java

public class User extends Model<User> {  

public static final User dao = new User(); 

} 
```


## 项目部署

1.1 `Jfinal`项目部署和web项目相同，将项目webroot下的文件（包括webroot）拷贝到服务器`tomcat`的webapps目录下面。

2.2 然后删除webroot中的` jetty-server-8.1.8.jar`jar包

3.3` startup` 运行`tomcat`即可


Tips: 项目`JDK版本`要和服务器`JDK`版本一致，高版本编译的项目不能跑在低版本上面。

Tips: 使用`render html` `404`，可以使用`redirect`


>1：redirect 是重定向，当服务端向客户端响应 redirect后，并没有提供任何view数据进行渲染，仅仅是告诉浏览器响应为 redirect，以及重定向的目标地址
>
>2：浏览器收到服务端 redirect 过来的响应，会再次发起一个 http 请求
>
>3：由于是浏览器再次发起了一个新的 http 请求，所以浏览器地址栏中的 url 会发生变化
>
>4：浏览中最终得到的页面是最后这个 redirect  url 请求后的页面
>
>5：所以redirect("/user/login.html") 相当于你在浏览器中手动输入 localhost/user/login.html



[源代码](https://github.com/Chenjy1225/ChenjyDemo/tree/gh-pages/JFinal_demo)