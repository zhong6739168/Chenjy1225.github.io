---
layout: post
title:  "Jfinal 项目搭建"
date:   2016-12-01 19:00:00 +0800
categories: Java
tags: Java JFinal
author: JiuYang Chen
---

* content
{:toc}

本篇介绍JFinal项目的搭建和基本使用。



## JFinal项目搭建

新建一个Dynamic Web Project

Target runtime  为 <None>

Default Output Folder 推荐使用WebRoot\WEB-INF\classes

此处的 Default out folder 必须要与 WebRoot\WEB-INF\classes 目录完全一致才可
以使用 JFinal 集成的 Jetty 来启动项目。 

修改 Content directory，推荐输入 WebRoot 

jfinal-xxx.jar 与 jetty-server-8.1.8.jar 拷贝至项目 WEB-INF\lib 下即可

 修改 web.xml 
 
<filter>
	<filter-name>jfinal</filter-name>
	<filter-class>com.jfinal.core.JFinalFilter</filter-class>
	<init-param>
		<param-name>configClass</param-name>
		<param-value>demo.DemoConfig</param-value>
	</init-param>
</filter>
<filter-mapping>
	<filter-name>jfinal</filter-name>
	<url-pattern>/*</url-pattern>
</filter-mapping>

添加java config文件
package demo; import com.jfinal.config.*; public class DemoConfig extends JFinalConfig {  public void configConstant(Constants me) {   me.setDevMode(true);  }  public void configRoute(Routes me) {   me.add("/hello", HelloController.class);  }  public void configPlugin(Plugins me) {}  public void configInterceptor(Interceptors me) {}  public void configHandler(Handlers me) {} } 
package 


package demo; 
import com.jfinal.core.Controller; 
public class HelloController extends Controller {  
public void index() {   renderText("Hello JFinal World.");  
} 
} 