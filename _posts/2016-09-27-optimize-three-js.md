---
layout: post
title:  "three.js 性能优化的几种方法"
date:   2016-09-27 22:00:00 +0800
categories: three.js javaScript
tags: three.js javaScript
author: JiuYang Chen
---

* content
{:toc}


本篇介绍`three.js`性能优化的若干方法。(个人拙见)






## `three.js`性能优化

### 尽量重用`Material`和`Geometry`

这里以Material和Geometry为例（使用比较频繁）

```js


    for (var i = 0; i < 100; i++) {
        var material = new THREE.MeshBasicMaterial();
        var geometry = new THREE.BoxGeometry(10, 10, 10);

        var mesh = new THREE.Mesh(geometry, material);
        scene.add(mesh);
    }


```

改为

```js

    var material = new THREE.MeshBasicMaterial();
    var geometry = new THREE.BoxGeometry(10, 10, 10);

    for (var i = 0; i < 100; i++) {
        var mesh = new THREE.Mesh(geometry, material);
        scene.add(mesh);
    }



```

### 谨慎的在`render()`中操作

一般FPS为60也就意味着一秒会执行60次如果render()中有有实例化或是赋值操作很容易会崩溃。

如下：


```js

function render() {
    
    material.map = canvasMap;
    material.map.needsUpdate = true;
    
}


```

### 选择合适的对象

* `THREE.ParticleSystem`(粒子系统)代替`THREE.Particle`(粒子)

```js

    for (var x = -5; x < 5; i++) {
        for (var y = -5; y < 5; y++) {
            var particle = new THREE.Particle(material);
            particle.position.set(x * 10, y * 10, 0);
            scene.add(particle);
        }
    }


```

代替

```js

    var geometry = new THREE.Geometry();
    var material = new THREE.ParticleBasicMaterial();

    for (var x = -5; x < 5; i++) {
        for (var y = -5; y < 5; y++) {
            var particle = new THREE.Vector3(x * 10, y * 10, 0);
            geometry.vertices.push(particle);
        }
    }

    var system = new THREE.ParticleSystem(geometry,material);

    scene.add(system);
    
```


* 要操作一组对象时使用 `THREE.Object3D`

```js
    
    var contain = new THREE.Object3D(); 

    var material = new THREE.MeshBasicMaterial();
    var geometry = new THREE.BoxGeometry(10, 10, 10);

    for (var i = 0; i < 100; i++) {
        var mesh = new THREE.Mesh(geometry, material);
        contain.add(mesh);
    }
    
    contain.rotation.x = Math.PI/3;


```

* 网格合并 `THREE.GeometryUtils.merge`

R60

```js
        var geometry = new THREE.BoxGeometry(5, 5, 5);
        var material = new THREE.MeshBasicMaterial({color: 0xff0000});

        for (var i = 0; i < 100; i++) {

            THREE.GeometryUtils.merge(geometry, new THREE.BoxGeometry(5, 5, 5));
        }

        var mesh = new THREE.Mesh(geometry, material);

        scene.add(mesh);


```

或是一下方式（geometry有位置信息）

```js
        var geometry = new THREE.BoxGeometry(5, 5, 5);
        var material = new THREE.MeshBasicMaterial({color: 0xff0000});
        
        var mesh = new THREE.Mesh(geometry,material);
        mesh.position.set(10,10,10);
        
        var mGeo = new THREE.BoxGeometry(10, 2, 10);
        
        THREE.GeometryUtils.merge(mGeo, mesh);
   

        scene.add(new THREE.Mesh(mGeo, material));


```

R80 `THREE.GeometryUtils.merge()` change to `geometry.merge()`


```js
            var geometry = new THREE.BoxGeometry(2, 4, 2);
            
            var mGeo = new THREE.BoxGeometry(5, 5, 5);
    
            var matrix = new THREE.Matrix4();
    
            for(var i=0;i<100;i++){
    
                matrix.setPosition(new THREE.Vector3(Math.random()*10,0,Math.random()*10));
                geometry.merge(mGeo, matrix);
            }
   
    
            var mesh = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({color: 0xff0000}));
            scene.add(mesh);


```

### 使用`Web Workers`

`web worker` 是运行在后台的 JavaScript，它独立于其他脚本，不会影响页面的性能
我们会发现`Physijs`物理库就是使用这种方式来保证页面的性能。

使用之前你可能需要是否支持`web worker`

```js

if(typeof(Worker)!=="undefined"){}else { }


```

我们将`web worker`运行脚本放在一个js文件中。

three_workers.js：

```js
    
    // 添加监听事件，从主线程接收数据
    self.addEventListener('message', function(event) {
        
        // 向主线程发送数据
        self.postMessage({
            some_data: '',
            more_data: ''
          })
        })

```

主线程.js：


```js
    
    //新建一个 `Web Workers`
    
    var worker = new Worker('three_workers.js'); 
    
    // 添加监听事件，获取`Web Workers`传回数据 
    worker.addEventListener('message', function (event) { 
    
      var data = event.data;
      
    });
    
    // 向`Web Workers`发送数据
    worker.postMessage({  
      some_data: '',
      more_data: ''
    });
    
    
   

```

可以参照：

*https://threejs.org/examples/?q=sand#raytracing_sandbox*


## 分时加载

可以参照：

*https://www.nczonline.net/blog/2009/08/11/timed-array-processing-in-javascript/*

## 使用自定义着色器

以后会有一篇专门讲着色器





























