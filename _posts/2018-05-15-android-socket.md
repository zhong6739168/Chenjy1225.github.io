---
layout: post
title:  "Android 客户端和 web服务器通信"
date:   2018-05-15 11:00:00 +0800
categories: Android
tags: Android
author: chenjy
---



* content
{:toc}

本篇简单介绍`Android`客户端和`web`服务器使用`socket`进行通讯，向客户端发送文件的`demo`。




## socket

> 套接字使用`TCP`提供了两台计算机之间的通信机制。客户端创建一个套接字，并尝试连接服务端的嵌套字。当连接建立时，服务器会创建一个 Socket 对象。客户端和服务器现在可以通过对 Socket 对象的写入和读取来进行通信。

`java.net.Socket`类代表一个套接字，并且` java.net.ServerSocket`类为服务器程序提供了一种来监听客户端，并与他们建立连接的机制。

TCP 是一个双向的通信协议，因此数据可以通过两个数据流在同一时间发送


## 服务端

为了实现向客户端发送文件，我们基于前面的[jFinal 文件上传](https://chenjy1225.github.io/2016/12/18/JFinal-project-upload/) 来完成。

```java

public class ServerUtils {

	private volatile static ServerUtils serverInstance;

	private static ServerSocket serverSocket;

	private ServerUtils() {
	}

	public static ServerUtils getServerInstance() {

		if (serverInstance == null) {
			synchronized (ServerUtils.class) {
				if (serverInstance == null) {
					serverInstance = new ServerUtils();
				}
			}
		}
		return serverInstance;
	}

	public void init(int port) {
		try {
			if (serverSocket == null) {
				serverSocket = new ServerSocket(port);
			}
		} catch (IOException e) {
			e.printStackTrace();
		}
	}

	public static ServerSocket getServerSocket() {
		return serverSocket;
	}

     /**
       *  发送文件线程
       **/
	public static class SendThread implements Runnable {
		static Socket socket;
		File file;
		static FileInputStream fis;
		static DataOutputStream dos;

		public SendThread(File file) {
			this.file = file;
		}

		@Override
		public void run() {

			try {
                 // 监听并接受到此嵌套字的连接 (该方法会阻塞等待，直到客户端连到服务端的指定端口)
				socket = getServerSocket().accept();
              
				// 上传的模型文件
				File getFile = file;
				fis = new FileInputStream(getFile);

				// 获取嵌套字的输出流
				dos = new DataOutputStream(socket.getOutputStream());
                  // 嵌套字的输入流
				//dis = new DataInputStream(socket.getInputStream());
              
				// 模型名称和大小
				dos.writeUTF(getFile.getName());
				dos.flush();
				dos.writeLong(getFile.length());
				dos.flush();

				byte[] bytes = new byte[1024];
				int length = 0;

				while ((length = fis.read(bytes, 0, bytes.length)) != -1) {
					dos.write(bytes, 0, length);
					dos.flush();
				}

			} catch (IOException e) {
				e.printStackTrace();

			} finally {
				if (fis != null)
					fis.close();
				if (dos != null)
					dos.close();
				if (socket != null) {
					socket.close();
				}
			}

		}
	}

}

```


`UploadController`:

```java


private static ThreadPoolExecutor threadPool;
private static SendThread sendThread;

// jfinal 获取 Web Uploader 上传的文件 
final File getFile = getFile().getFile();

threadPool = new ThreadPoolExecutor(1, 1, 0L, TimeUnit.MILLISECONDS, new LinkedBlockingQueue<Runnable>());

// 初始化 ServerSocket
ServerUtils.getServerInstance().init(port);

sendThread = new SendThread(getFile);

// 创建一个线程 向客户端发送文件
threadPool.submit(sendThread);


```

## 客户端

```java


   final Socket socket = new Socket();
        final ThreadPoolExecutor threadPool = new ThreadPoolExecutor(4, 4,
                0L, TimeUnit.MILLISECONDS,
                new LinkedBlockingQueue<Runnable>());

        threadPool.submit(new Runnable() {
            @Override
            public void run() {

                try {
                    socket.connect(new InetSocketAddress("192.168.0.100", 6001));
                    // 获取嵌套字输入流
                    final DataInputStream dis = new DataInputStream(socket.getInputStream());

                    // 获取文件名
                    String fileName = dis.readUTF();
                    // 获取文件大小
                    final long fileLength = dis.readLong();
                    File file = new File(App.RECEIVE_PATH + File.separatorChar + fileName);
                    final FileOutputStream fos = new FileOutputStream(file);

                    threadPool.execute(new Runnable() {
                        @Override
                        public void run() {
                            try {
                                int length = 0;
                                byte[] bytes = new byte[1024];

                                while ((length = dis.read(bytes, 0, bytes.length)) != -1) {
                                    fos.write(bytes, 0, length);
                                    fos.flush();

                                }
                            } catch (IOException e) {
                                e.printStackTrace();
                            }
                        }

                    });

                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
        });

```

## 应用场景

这里只是一个最基本的上传demo，每次用户web页面上传文件，服务端都会开启一个线程来发送文件。客户端连接并接收上传的文件，文件发送结束 关闭客户端。

关于socket 优化以及深入了解

可参见[Java Socket编程基础及深入讲解](https://www.cnblogs.com/yiwangzhibujian/p/7107785.html#q2)































