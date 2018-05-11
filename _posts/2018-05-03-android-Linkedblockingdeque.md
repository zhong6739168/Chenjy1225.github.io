---
layout: post
title:  " 基于Rayland主板的3D打印机指令控制Android(部分)实现 "
date:   2018-05-03 11:00:00 +0800
categories: Android
tags: Android
author: chenjy
---



* content
{:toc}

本篇以[Magicfirm](http://www.mbot3d.com/) `MBot`和 `Rayland-C200`为例介绍基于`Rayland`主板的`FDM`打印机指令控制`Android`端部分实现。






## 基于MBot的实现

> `Mbot`打印机通过RS232串口和`Rayland`主板进行通信，通过`Rayland`主板外接屏实现人机交互。

`RS232`是全双工串口，所以程序里不需要做特别的处理。（不同于下面`Rayland-C200`）

需要注意的是，`FDM`是通过下发`Gcode`指令进行控制。`Mbot`中会有一个队列来存储通过串口接收到的`Gcode`指令，但是存储的指令数量有限。所以在下发的程序中我们需要做`容量控制`检测队列的剩余容量。

每条指令执行完成之后`Mbot`会回传一个`callback`，我们通过`callback`来控制队列的剩余容量。

### Android 实现

综上所述我们需要一个列队，而且是一个阻塞队列，来对指令进行控制。

发送指令线程不断`loop`从队列中取出指令并发送给`Mbot`。当队列为空的时候，发送线程阻塞等待。当队列满的时候存储指令线程阻塞等待。

由于我们还添加了`callback`的`容量控制`所以在`Mbot`队列达到指定余量的时候也会阻塞。这里我们使用`Semaphore`来实现阻塞。

看起来是个很完美的流程，但是很多时候我们希望有一些指令能快速的被执行。

比如说温度检测，设备内温度超过55°C时，我们希望设备能够立即停止（并会有一系列降温等其他额外操作）。而不是排在队尾进行默默等待。

所以我们就需要一个可以在队头插入的阻塞队列`LinkedBlockingDeque`。

同时保证`Mbot`中队列长度为1，执行完当前指令，发送下一条指令。如果存在上述较紧急的情况，将需要插队指令插入队列头。就能较快的响应操作。

```java

public abstract class LoopDeque<T> {
	
	private LinkedBlockingDeque<T> commands;
	private volatile boolean runningLoop;
	private volatile T current;
	private Executor executor;
	
	public LoopDeque(int capacity){
		commands = new LinkedBlockingDeque<>(capacity);
		executor = Executors.newSingleThreadExecutor();
	}

	public void startLoop() {
		if(!runningLoop){
			runningLoop = true;
			executor.execute(loop);
		}
	}
	
	public void cancelLoop() {
		if (runningLoop) {
			runningLoop = false;
		}
	}
	
	public void remove(T command){
		if(command != null && commands.contains(command)){
			try {
				commands.take();
			} catch (InterruptedException e) {
			}
		}
	}


	public void add(T object){
		if(object != null){
			try {
				commands.put(object);
			} catch (InterruptedException e) {
				e.printStackTrace();
			}
		}
	}

  public void insert(T object) {
        if (object != null) {
            try {
                commands.putFirst(object);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }
    }
  
	public int getSize(){
		return commands.size();
	}
	
	private Runnable loop = new Runnable() {
		public void run() {
			while(runningLoop){
					try {
						current = commands.take();
						if(current!=null){
							loop(current);
						}
					} catch (InterruptedException e) {
						e.printStackTrace();
					}
			}
		}
	};
	
	public abstract void loop(T object);
}

```

`MainActivity`:

```java


    private volatile boolean isSync;
    /**
     * 通过 Semaphore 控制，保证执行完当前指令发送下一条指令
     * acquire
     */
    private Semaphore semaphore = new Semaphore(0);

    queue = new LoopQueue<String>(3) {
                        @Override
                        public void loop(String object) {
                            try {
                                if(isSync){
                                    semaphore.acquire();
                                }else{
                                    Thread.sleep(3000);
                                    isSync = true;
                                }
                                os.write(object.getBytes());
                            } catch (IOException | InterruptedException e) 
                                e.printStackTrace();
                            }
                        }
                    };
                queue.startLoop();


...

           /**
             * callback and release
             */
 			if (response.contains("ok")) {
                            semaphore.release();
                        }

```

#### LinkedBlockingDeque

`LinkedBlockingDeque`双向链表实现的双向并发阻塞队列，该阻塞队列同时支持`FIFO`和`FILO`两种操作方式，即可以从队列的头和尾同时操作(插入/删除)；并且，该阻塞队列是支持线程安全。

![LinkedBlockingDeque](http://wx1.sinaimg.cn/mw690/c584f169ly1fr55se3kmoj209e0g9aa7.jpg)

![LinkedBlockingDeque](http://wx1.sinaimg.cn/mw690/c584f169ly1fr567rp5m7j20ge06t0t1.jpg)

* `capacity`:LinkedBlockingDeque的容量

* `lock`:控制对LinkedBlockingDeque的互斥锁，当多个线程竞争同时访问LinkedBlockingDeque时，某线程获取到了互斥锁lock，其它线程则需要阻塞等待，直到该线程释放lock，其它线程才有机会获取lock从而获取cpu执行权。

* `notEmpty`和`notFull`:分别是“非空条件”和“未满条件”。通过它们能够更加细腻进行并发控制。


* `first`:表头

* `last`:表尾

* `count`:LinkedBlockingDeque的实际大小

> -- 若某线程(线程A)要取出数据时，队列正好为空，则该线程会执行notEmpty.await()进行等待；当其它某个线程(线程B)向队列中插入了数据之后，会调用notEmpty.signal()唤醒“notEmpty上的等待线程”。此时，线程A会被唤醒从而得以继续运行。 此外，线程A在执行取操作前，会获取takeLock，在取操作执行完毕再释放takeLock。
> -- 若某线程(线程H)要插入数据时，队列已满，则该线程会它执行notFull.await()进行等待；当其它某个线程(线程I)取出数据之后，会调用notFull.signal()唤醒“notFull上的等待线程”。此时，线程H就会被唤醒从而得以继续运行。 此外，线程H在执行插入操作前，会获取putLock，在插入操作执行完毕才释放putLock。

## 基于Rayland-C200的实现

`Rayland-C200`和上述的稍有不同，`Rayland-C200`由`Rayland`主板直接控制。走的是`IIC`。

> `IIC`通信是同步半双工的。

意味着我们程序里面收发不能同步执行，( 同时`Rayland-C200`没有针对指令的callback） 所以我们需要在`Android`实现收发的控制。

`MainActivity`:

```java

private Runnable loop = new Runnable() {
		public void run() {
			while(runningLoop){
				if(commands.isEmpty()){
					idleLoop();
				}else{
					try {
						current = commands.take();
					} catch (InterruptedException e) {
						if(!runningLoop) {
							break ;
						}
					}
					if(current!=null && runningLoop){
						loop(current);
					}
				}
			}
		}
	};

```

`LoopDeque`:

```java

queue = new LoopQueue<SendCommand>(3) {
            @Override
            public void idleLoop() {
                packet.read();
               
                try {
                    Thread.sleep(20);
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
            }

            @Override
            public void loop(final SendCommand command) {
                SendPacket sendPacket = new SendPacket(command);
                sendPacket.send();
            }
        };
        queue.startLoop();

```




