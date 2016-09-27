---
layout: post
title:  "javaScript constructor和prototype"
date:   2016-09-20 20:00:00 +0800
categories: javaScript
tags: javaScript
author: JiuYang Chen
---

* content
{:toc}


本篇介绍JavaScript对象中的constructor和prototype。




## constructor和prototype


JS中函数定义：

```js
    
    function Person(name)   
    {   
       this.name=name;  
    };   
    
    var chen = new Person("chenjy")

```

### `类`

因为有关键字`new`可以实例对象所以函数`Person`可以当做是一个`类`。
定义的函数都有一个`prototype`的属性，但是使用`new`来创建的对象没有。

每个`prototype`的属性又指向一个`prototype`对象(`__ proto __`)，每个`prototype`对象(`__ proto __`)包含一个`constructor`的属性，
而这个属性又指向一个`constructor`对象，该对象就是这个函数。


```
      _____________________             ______________________
     |                     |           |                      |   
     |                     | <———————— |     constructor      |   
     |   function Person   |           |______________________|   
     |                     |           |                      |   
     |                     |           |                      |   
     |_____________________|           |     __ proto __      |   
     |      prototype      | ————————> |                      |   
     |_____________________|           |______________________|           
       
```

### `原型继承`

当我们使用`new`实例对象`chen`,它指向`Person`的`prototype`对象(`__ proto __`)，然后`prototype`对象( `__ proto __`)中所有的属性和函数都可以调用。

```
      _____________________             ______________________              _____________________
     |                     |           |                      |            |                     |
     |                     | <———————— |     constructor      | ————————>  |                     | 
     |   function Person   |           |______________________|            |        chen         | 
     |                     |           |                      |            |                     | 
     |                     |           |                      |            |                     | 
     |_____________________|           |      __ proto __     |            |_____________________| 
     |      prototype      | ————————> |                      |            |        name         |
     |_____________________|           |______________________|            |_____________________|
             
                                              
```

### `原型链`


```
      _____________________             _____________________  
     |                     |           |                     |
     |   function Person   |           |       Object        |
     |_____________________|           |_____________________|             _______________ 
     |                     |           |                     |            |               |
     |      prototype      |           |      prototype      |            |     null      |                   
     |                     |           |                     |            |               |
     |     __ proto __     | ————————> |     __ proto __     | ————————>  |_______________|
     |_____________________|           |_____________________|
                     
              |\  
              |   `原型继承`
              |
      _____________________    
     |                     |  
     |       chen          | 
     |_____________________|    
     |                     |       
     |     __ proto __     |    
     |                     |
     |_____________________|
                                              
```

这样就可以形成一个`原型链` 

* chen.__ proto __  === Person.prototype

* person.prototype.__ proto __ === Object.prototype

* Object.prototype.__ proto __ === null (由于比较特殊)