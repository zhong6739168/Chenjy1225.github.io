---
layout: post
title:  "在Android 中实现scp操作 "
date:   2018-05-03 11:00:00 +0800
categories: Android
tags: Android
author: chenjy
---



* content
{:toc}

本文简单介绍用`SSH`库`ganymed-ssh2`在`Android`中实现`scp`操作。




## SSH

`SSH`是专为远程登录会话和其他网络服务提供安全性的协议，简单的说就是一种网络协议。是`linux`的标准配置。用于`linux`设备之间的通讯。

### SCP

`SCP`是一种基于`SSH`完成加密拷贝文件的协议。使用`SSH`进行身份认证确保数据传输的真实性和可靠性。



> SCP默认通过TCP端口22运行

`SCP`程序常用语法：

```java

// 复制文件到主机
scp SourceFile user@host:directory/TargetFile

```

```java

// 从主机复制文件
scp user@host:directory/SourceFile TargetFile
scp -r user@host:directory/SourceFolder TargetFolder

```

### SFTP 

`SFTP`也是基于`SSH`安全文件传输协议。不同于基于`FTP`,`FTP`基于`Tcp`使用明文传输用户信息。安全性较差。

### Android中使用SCP

* 下载`ganymed-ssh2` jar包

```xml

<!-- https://mvnrepository.com/artifact/ch.ethz.ganymed/ganymed-ssh2 -->
<dependency>
    <groupId>ch.ethz.ganymed</groupId>
    <artifactId>ganymed-ssh2</artifactId>
    <version>build210</version>
</dependency>


```

> 官方下载地址 `http://www.ganymed.ethz.ch/ssh2/` 

```java

public class Scp {

    private volatile static Scp scpInstance;

    private String user;
    private String pass;
    private String host;
    private Connection connection;
    private SCPClient scpClient;
    private Boolean isAuthed;

    private Scp(String user, String pass, String host){
        this.user = user;
        this.pass = pass;
        this.host = host;
    }

    public static Scp getScpUtilsInstance(String user, String pass, String host){

        if(scpInstance == null) {
            synchronized(Scp.class) {
                if(scpInstance == null) {
                    scpInstance = new Scp(user,pass,host);
                }
            }
        }
        return scpInstance;
    }


    public void connect(){
        connection = new Connection(host);
        try {
            connection.connect();
            isAuthed = connection.authenticateWithPassword(user,pass);
            // scp 连接
            scpClient = connection.createSCPClient();
        } catch (IOException e) {
            e.printStackTrace();
            close();
        }
    }

    public void close(){
        connection.close();
        sftPv3Client.close();
    }

    public boolean getIsAuthed(){
        return isAuthed;
    }

    // 拷贝文件到服务器
    public void putFile(String filePath,String aimPath){
        try {
            if(scpClient != null){
                scpClient.put(filePath,aimPath);
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

  

}

```

```java

Scp scp = Scp.getScpUtilsInstance("root","psd","192.168.199.3");
                            scp.connect();
                            if(scp.getIsAuthed()){
                                for(int i = 0;i<data.getLayers();i++){
                                    scp.putFile(SlcParser.pngDirectory+"/"+i+".png","/home");
                                }
                            }


```

![scp](http://wx1.sinaimg.cn/mw690/c584f169ly1fr7gcm2ojfj20e40eqab1.jpg)

### SFTP 删除文件

```java


    private SFTPv3Client sftPv3Client;
    
   sftPv3Client = new SFTPv3Client(connection);

    public void rmFile(String filePath){
            try {
                if(sftPv3Client != null){
                    sftPv3Client.rm(filePath);
                }
            } catch (IOException e) {
                e.printStackTrace();
            }
        }

```

```java

Scp scp = Scp.getScpUtilsInstance("root","psd","192.168.199.3");
                scp.connect();
                if(scp.getIsAuthed()){
                    for(int i = 0;i<10;i++){
                        scp.rmFile("/home/"+i+".png");
                    }
                }


```


![scp](http://wx1.sinaimg.cn/mw690/c584f169ly1fr7gbmkrjwj20eo0f0my7.jpg)
















