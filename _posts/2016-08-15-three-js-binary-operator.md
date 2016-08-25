---
layout: post
title:  "three.js-binary operator"
date:   2016-08-15 20:00:00 +0800
categories: three.js
tags: three.js javaScript WebGL THREEBSP
author: JiuYang Chen
---

* content
{:toc}

Three.js学习笔记 本篇使用three.js的扩展库THREEBSP来操作标准的几何体来创造出新的几何体。
*learn more from `https://github.com/skalnik/ThreeBSP`*



## ThreeBSP

由于three.js提供的标准几何体有限，自定义几何体的构造比较麻烦。所以我们也许可以使用three.js的扩展库ThreeBSP来构造几何体。
Three.js提供了三种函数：`intersect（相交）` 、`union（联合）` 和 `substract（相减）`


* 相交函数可以将几个几何体联合起来形成新的几何体。

* 联合函数可以基于两个几何体的交集创建出新的几何体，即两个几何体的重叠部分。

* 相减函数和联合函数正好相反可以在第一个几何体的基础上减去两个几何体的重叠部分。

### how to use

ThreeBSP库是使用coffee-script写的,所以需要添加coffee-script文件在运行时编译。或是使用编译好的JavaScript文件。

* 添加coffee-script

```js
 
    <script type="text/javascript" src="js/Three/coffee-script.js"></script>  
    <script type="text/javascript" src="js/Three/ThreeBSP.coffee"></script>  
    
```

* 使用编译好的JavaScript文件

```js

	<script type="text/javascript" src="js/Three/ThreeBSP.js"></script>
		
```

```js
    //实例化两个需要进行操作的物体 （cube1,cube2为两个cube）
    var BSP1 = new ThreeBSP(cube1);
    var BSP2 = new ThreeBSP(cube2);
    
    //将两个物体相交操作，操作完的`resultBSP`为一个`ThreeBSP`对象
    var resultBSP = BSP1.subtract(BSP2);
    
    //可以使用`ThreeBSP`的`toMesh()`方法将`ThreeBSP`转为一个`Mesh`对象
    var result = resultBSP.toMesh();
    
    //使用`geometry`的computeFaceNormals()和computeVertexNormals()来确保生成的`Mesh`对象的所有面和顶点的法向量可以正确计算
    result.geometry.computeFaceNormals();
    
    result.geometry.computeVertexNormals();
    scene.add(result);
            
```

