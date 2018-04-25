---
layout: post
title:  " Java 集合框架"
date:   2018-04-16 11:00:00 +0800
categories: Java
tags: Java
author: chenjy
---



* content
{:toc}

`Java` 集合框架总结 





## Java 集合框架

先来一张书上的简图

![collections](http://wx1.sinaimg.cn/mw690/c584f169ly1fqp19jqfb3j20yc0gn7of.jpg)

> set 规则集，用来存储互不相同的元素
> list 线性表，用来存储有序集合
> queue 队列，用于存储先进先出的对象


### set

#### hashset 散列集 1）

基于`hashmap`、实现了`set`接口的具体类。

#### hashmap 哈希表


![collections](http://wx3.sinaimg.cn/mw690/c584f169ly1fqp19mxkfwj20nx0b0aa9.jpg)

哈希表本质上可以看成如图所示的 数组和链表的结合体，存在一块连续的存储空间。

插入元素时会将输入的`key` 通过一个固定的哈希函数转换成一个整型数字，然后将该数字对数组长度取余，取余的结果就当做数组的下标，将`value`存在以该数字为下标的数组空间。

当使用`hashmap`查询的时候，再次使用哈希函数将`key`转为数组下标，取出对应空间的`value`。

数组最大的特点就是寻址容易，但是插入和删除操作就很困难。 而链表虽然寻址很困难但是 插入和删除却很容易。所以上面所示的拉链式 就结合了数组和链表的特点。（哈希表有很多实现方式）

数组的每个成员包含了一个指令，指向了链表的头。我们根据元素的特征将他们分配到不同的链表中。需要的时候然后根据特征快速定位到元素，做出需要的操作。

`hashmap` 的查找时间复杂度近乎于 `O(1)`

#### hashset 散列集 2）

继续`hashset`，它实现了`set`自然是不能存储相同的元素。

我们知道每个`object`都有 `hashcode` ，不同对象`hashcode`不同，但是两个对象不相同可能有相同`hashcode`。所以

* 如果两个对象`hashcode`不同，则为新对象

* 如果两个对象`hashcode`相同，`equals`不同 ，则为新对象

* 如果两个对象`hashcode`相同，`equals`相同 ，则为存在对象


`hashset`又是一个数组，我们知道数组大小是固定的。那是不是意味着`hashset`大小固定？

并不然，书上提了两个概念 初始容量和客座率。如果初始容量为`16`,默认客座率（数组饱满程度）为`0.75`。当尺寸超过了`12`容量会翻倍。

这个容量翻倍的过程所有元素会被重新散列，得到新的散列表，这叫意味着原来的没用了。

`hashset` 源码

```java

// add方法
public boolean add(E e) {
        return map.put(e, PRESENT)==null;
    }

// hashmap put
public V put(K key, V value) {
        ...
        addEntry(hash, key, value, i);
        return null;
    }

// 容量变为原来两倍
void addEntry(int hash, K key, V value, int bucketIndex) {
      if ((size >= threshold) && (null != table[bucketIndex])) {
            resize(2 * table.length);
            ...
        }
        createEntry(hash, key, value, bucketIndex);
    }

```

> resize()
> Rehashes the contents of this map into a new array with a larger capacity.  This method is called automatically when the number of keys in this map reaches its threshold.

> If current capacity is MAXIMUM_CAPACITY, this method does not resize the map, but sets threshold to Integer.MAX_VALUE. This has the effect of preventing future calls.


#### linkedhashset 

用一个双向链表扩展`hashset`,支持内部元素排序，保持元素插入的顺序。

`双向链表` ，每个元素都有前驱和后继元素。

* 网上看到的 使用`LinkedHashSet`给`ArrayList`去重并保持顺序(记录一哈)

```java

public static void main(String[] args) {  
        List<String> list = new ArrayList<String>();  
        list.add("1");  
        list.add("2");  
        list.add("3");  
        list.add("4");  
        list.add("1");  
        list.add("2");  
        list.add("7");  
          
        List<String> listWithoutDup = new ArrayList<String>(new LinkedHashSet<String>(list));  

```

#### treeset

`treeset` 在确保元素是有顺序的基础上还提供了 

* `first()`:返回规则集的第一个元素

* `last()`:返回规则集的最后一个元素

* `headSet(toElement)`，`tailSet(fromElement)`  返回规则集中小于toElement或是大于等于fromElement的部分

`treeset`实现了`sortedSet`接口的具体类，来对元素进行比较。

### list

不同于`set`,线性表`list`不但可以存储重复元素而且指定他们的存储位置，可以通过下标来访问。同时增加了一个能够双向遍历的迭代器。

#### arraylist

数组线性表类`ArrayList`，顾名思义 使用数组来存储元素。这个数组是动态创建的，如果超过了数组的容量，就会创建一个更大的将所有元素复制到新数组中(可以动态增大或减小，往`ArrayList`添加元素，其容量会自动增大，但是不会自动减小。可以调用`trimToSize()`减小到线性表大小)。

> 如果程序不需要在线性表中插入和删除元素，那么数组的效率是最高的。

#### linkedlist

`LinkedList`和`ArrayList`操作上类似，主要不同在内部实现。

* 若要提取元素或是在线性表尾部插入或删除元素，`ArrayList`效率较高

* 若要在任意位置插入和删除元素，`LinkedList`效率较高

### queue

```java

// 向队列插入一个元素
offer(element): boolean

// 获取并删除队列头 如果队列为空返回null
poll()：E

// 获取并删除队列头 如果队列为空抛出异常
remove()：E

// 获取但不删除队列头 如果队列为空返回null
peek()：E

// 获取但不删除队列头 如果队列为空抛出异常
element()：E
```

### map

`map`是按照值键存储元素的容器

* `HashMap`：对于定位一个值、插入一个映射以及删除一个而言是高效

* `LinkedHashMap`：用链表扩展`HashMap`支持条目的排序，可以按照他们插入图的顺序，也可以按照最后一次被访问的顺序

Tips: 如果按照被访问的顺序，`A,B,C,D`,如果访问元素`C` 则顺序变为`A,B,D,C`

* `TreeMap`：在遍历排好序的键值是高效的。键值可以使用` comparable`和` comparator`接口排序。












