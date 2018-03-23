---
layout: post
title:  "SLA打印机之Slc文件解析"
date:   2018-03-16 08:00:00 +0800
categories: 3D打印 
tags: 3D打印 SLA
author: chenjy
---



* content
{:toc}

`SLA打印机`打印文件`SLC`解析和`java`实现。




 [SLC format](http://paulbourke.net/dataformats/slc/)

## `SLC format`

>The SLC file format is a “21/2D” contour representation of a CAD model.

### SLC术语定义

* Segment （线段）：两点（x/y）之间的连线

* Polyline（折线）：一组连续线段的集合，折现必须是闭合的（最后一个点和第一个点坐标一致）

* Boundary（轮廓）：轮廓是一个闭合的折线（Polyline）来表示的填充固体材料范围。轮廓又分为外轮廓和内轮廓。外轮廓（Boundary）为逆时针，内轮廓为顺时针。


![Boundary](http://wx2.sinaimg.cn/mw690/c584f169ly1fpmu75v1oaj20pd0bljrq.jpg)


`slc`文件包括 `Header section` ，`3-D reserved section`，`Sample Table section`以及`Contour Data section`

### `Header section`

头文件部分为ASCII字符串，包括部分全局参数信息。

头文件以回车、换行符和control-Z 字符（0x0d,0x0a,0x1a） 结束

最大2018bytes（包括换行符）

头部你可以用关键字追踪你需要的参数

* `-SLCVER <X.X>`  `SLC`文件格式版本号

* `-UNIT <INCH/MM>` `SLC`文件单位 INCH（英寸）或是MM（毫米）

* `-TYPE <PART/SUPPORT/WEB>` `CAD模型类型` `PART`和`SUPPORT`必须是闭合轮廓 ，`WEB`可以是打开的

* `-PACKAGE <vendor specific>`  供应商名称，最多可以有32字节

* `-EXTENTS <minx,maxx miny,maxy minz,maxz>` `CAD模型` x,y,z轴的范围

其他参照上述文档。


###  `3-D reserved section`

> This 256 byte section is reserved for future use.

跳过 `256byte`即可。

###  `Sample Table section`

`Sample Table` 中每个 `entry`表示一组`Layer Thickness`每层层高、，`Line Width Compensation`线宽补偿等配置信息相同的连续层的集合。

每个 `entry`的信息，包括`Minimum Z Level` z轴最小值（垂直方向起始位置）,`Layer Thickness` 每层层高，`Line Width Compensation`线宽补偿，`Reserved` 预留字段

```xml

Sampling Table Size （1 Byte）
Sampling Table Entry （4 Floats）
        Minimum Z Level （1 Float）
        Layer Thickness （1 Float）
        Line Width Compensation （1 Float）
        Reserved （1 Float）

```

### `Contour Data Section`

轮廓数据

数据格式：

* `Z layer` Z轴高度
* `Number of Boundaries`轮廓数量
* `Number of Vertices for the 1st Boundary`第一个轮廓点个数
* `Number of Gaps for the 1st Boundary`第一个轮廓间隙数
* `Vertex List for 1st Boundary`第一个轮廓点`List`

最后一个层由`Z layer`和`Termination Value Unsigned Integer` 结束字符串 `0xFFFFFFFF` 表示



```xml

Z Layer 0.4  （1Float）
Number of Boundaries 2  （1 Unsigned Integer）
Number of Vertices for the 1st Boundary 5  （1 Unsigned Integer）
Number of Gaps for the 1st Boundary 0  （1 Unsigned Integer）
Vertex List for 1st Boundary  0.0, 0.0  （Number of Vertices * 2 Float）
                              1.0, 0.0
                              1.0, 1.0
                              0.0, 1.0
                              0.0, 0.0187

Number of Vertices for the 2nd Boundary 5
Number of Gaps for the 2nd Boundary 0
Vertex List for the 2nd Boundary  0.2, 0.2
                                  0.2, 0.8
                                  0.8, 0.8
                                  0.8, 0.2
                                  0.2, 0.2

```


### A SLC File Example

```xml
[Header]
HeaderStr=-SLCVER 2.0 -UNIT MM -TYPE PART -PACKAGE
MATERIALISE C-TOOLS 2.xx -EXTENTS 10.000000,38.000000
10.000000,66.660600 6.000000,14.000000 –CHORDDEV
[Sampling_Table]:
Sampling_Table_Size=1
TableEntry_N=Minimum Z Level,Layer Thickness,Line Width
Compensation,Reserved
TE0=6.0000000000,0.1250000000,0.0250000000,0.0250000000
[Layer1]
z=6.0000000000
NContours=2.0000000000
VC1=5
GC1=0
C1PT0=10.125000000,26.785600000
C1PT1=10.125000000,66.535600000
C1PT2=37.875000000,66.535600000
C1PT3=37.875000000,26.785600000194
C1PT4=10.125000000,26.785600000
VC2=5
GC2=0
C2PT0=30.000000000,40.000000000
C2PT1=20.000000000,40.000000000
C2PT2=20.000000000,30.000000000
C2PT3=30.000000000,30.000000000
C2PT4=30.000000000,40.000000000
VC3=5
GC3=0
C3PT0=30.000000000,47.000000000
C3PT1=20.000000000,47.000000000
C3PT2=20.000000000,42.000000000
C3PT3=30.000000000,42.000000000
C3PT4=30.000000000,47.000000000
VC4=5
GC4=0
C4PT0=30.000000000,60.000000000
C4PT1=20.000000000,60.000000000
C4PT2=20.000000000,50.000000000
C4PT3=30.000000000,50.000000000
C4PT4=30.000000000,60.000000000

```

## Java实现


```java

try {
			modelFis = new FileInputStream(modelFile);
			/**
			 *
			 * header string 最大字符串2048
			 * header string 结束字符 0x0d,0x0a,0x1a
			 */
			int b;
			StringBuilder builder = new StringBuilder();
			while (builder.length() < 2048) {
				b = modelFis.read();
				builder.append((char) b);
				if (b == 0x0d) {
					b = modelFis.read();
					builder.append((char) b);
					if(b == 0x0a){
						b = modelFis.read();
						builder.append((char) b);
						if(b == 0x1a){
							break;
						}
					}
				}
			}
			/**
			 * reserved section 跳过预留的256byte
			 *
 			 */
			modelFis.skip(256);

			/**
			 * sampleing table section
			 * sampleing table 每个entry 1 byte size
			 * sampleing table 每个entry 4 float ,将minZ和thickness 保存
			 */
			b = modelFis.read();
			layerMap = new HashMap<>(b);
			byte[] entry = new byte[16];
			for (int i = 0; i < b; i++) {
				modelFis.read(entry);
				float minZ = Float.intBitsToFloat(Utils.getIntByLittleEndian(entry, 0));
				float thickness = Float.intBitsToFloat(Utils.getIntByLittleEndian(entry, 4));
				layerMap.put(minZ, thickness);
				if(i == 0){
					layerThickness = thickness;
				}
			}
			
            /**
            * Contour Data Section
            * 如果是最后一层 `z layer`和终止符  2 float , 打印结束
            * 如果不是 `z layer`和边界数量
            *
            *
            */
			supportFis.read(tmp);
				supportBoundary = getIntByLittleEndian(tmp, 4);
				if(supportBoundary == 0xFFFFFFFF){
					LogUtil.w(TAG, "support finished");
					return false;
				}else{
                  for(int i=0;i<supportBoundary;i++){
						supportFis.read(tmp);
						int vertices = Utils.getIntByLittleEndian(tmp, 0);
						// 这里的 vertices * 8 便是每层的点
						supportFis.skip(vertices*8);
					}
				}
				
			
			return true;
		}catch (Exception e){
			e.printStackTrace();
			return false;
		}


```

到这一步你就已经取到了所有的`vertices`,结合一定的扫描填充算法就可以完成slc文件的打印。



## 打印


### 扫描填充算法

例仿 `UnionTech联泰`，

可以模型的每层自下往上生成一系列连续的辅助线，求出辅助线和模型内外轮廓交线。

如下图：

![outPut](http://wx1.sinaimg.cn/mw690/c584f169ly1fpj29j43n3j20j50axdfp.jpg)

蓝色为辅助线，红色、绿色为辅助线和轮廓交线也就是最后填充部分，为了较大程度避免激光的开关将先填充部分分为两块，先填充红色部分再填充绿色部分。

打印效果：

![outPut](http://wx3.sinaimg.cn/mw690/c584f169ly1fpj2gwb8dag20f40qoe8e.gif)