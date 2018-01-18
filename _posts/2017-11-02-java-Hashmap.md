---
layout: post
title:  "Java HashMap"
date:   2017-10-31 16:00:00 +0800
categories: Java 
tags: Java 
author: JiuYang Chen
---



* content
{:toc}



HashMap 是Java中最常用的集合类框架之一。它实现了Map接口，存储的元素也是键值对映射的结构，并且允许null值和null键。
 
其元素是无序的，如果保证有序可以使用子类LinkedHashMap.
 
HashMap最常用的就是put(K,V)和get(K).HashMap中K值要保证唯一。为了保证K值唯一首先想到的是Object类的equals方法。

equals方法源码

```java

public boolean equals(Object obj) {
	return (this == obj);
}

```
 
 
String类重写的equals方法源码：
 
```java
 
 public boolean equals(Object anObject) {
	if (this == anObject) {
		return true;
	}
	if (anObject instanceof String) {
		String anotherString = (String) anObject;
		int n = value.length;
		if (n == anotherString.value.length) {
			char v1[] = value;
			char v2[] = anotherString.value;
			int i = 0;
			while (n-- != 0) {
				if (v1[i] != v2[i])
						return false;
				i++;
			}
			return true;
		}
	}
	return false;
}

```

重写equals要满足的几个重要条件：

* 自反性：对于任何非空引用值 x，x.equals(x) 都应返回 true。 

* 对称性：对于任何非空引用值 x 和 y，当且仅当 y.equals(x) 返回 true 时，x.equals(y) 才应返回 true。 

* 传递性：对于任何非空引用值 x、y 和 z，如果 x.equals(y) 返回 true，并且 y.equals(z) 返回 true，那么 x.equals(z) 应返回 true。 

* 一致性：对于任何非空引用值 x 和 y，多次调用 x.equals(y) 始终返回 true 或始终返回 false，前提是对象上 equals 比较中所用的信息没有被修改。 
  对于任何非空引用值 x，x.equals(null) 都应返回 false。 

使用equals可以实现但随着元素的增多，put和get的效率会越来越低。这里的时间复杂度为o(n)。

实际上HashMap内部通过一个哈希表来管理所有元素。

当我们使用put(K,V) 存值的时候。HashMap会调用K的hashCode方法。获取到K值的哈希码，通过哈希码快速找到存放位置，这个位置称为bucketIndex。

如果hashCode不同equals一定为false,反正则不一定为true。所以hashCode可能存在冲突，专业名词称为碰撞。当发生碰撞的时候，计算出的bucketIndex是相同的。这是会通过bucketIndex取出已存储的元素，最终通过equals比较。

hashMap的put源码

```java

public V put(K key, V value) {
	// 处理key为null,HashMap允许key和value为null
	if (key == null)
		return putForNullKey(value);
	// 得到key的哈希码
	int hash = hash(key);
	// 通过哈希码计算出bucketIndex
	int i = indexFor(hash, table.length);
	// 取出bucketIndex位置上的元素，并循环单链表，判断key是否已存在
	for (Entry<K,V> e = table[i]; e != null; e = e.next) {
		Object k;
		// 哈希码相同并且对象相同时
		if (e.hash == hash && ((k = e.key) == key || key.equals(k))) {
			// 新值替换旧值，并返回旧值
			V oldValue = e.value;
			e.value = value;
			e.recordAccess(this);
			return oldValue;
		}
	}

	// key不存在时，加入新元素
	modCount++;
	addEntry(hash, key, value, i);
	return null;
}

```

HashMap有两个重要的参数：初始容量和加载因子。默认初始容量是16，加载因子是0.75。初始容量是在哈希表创建时的容量，加载因子是在哈希表容量自动增加之前可能达到多满的一种尺度。当哈希表超出了加载因子和当前容量的乘积时，通过调用rehash方法将容量翻倍。

* HashMap和HashTable的区别

两者都实现了Map接口。HashMap几乎可以等价HashTable。

1.1 HashMap是非synchronized的并且可以接受null，而HashTable不行。

2.2 HashTable是synchronized的，这意味着是线程安全的。没有正确的同步的话，多个线程是不能共享HashMap的。Java5提供了ConcurrentHashMap 它是HashTable的替代。

3.3 由于Hashtable是线程安全的也是synchronized，所以在单线程环境下它比HashMap要慢。如果你不需要同步，只需要单一线程，那么使用HashMap性能要好过Hashtable。

4.4 另一个区别是HashMap的迭代器(Iterator)是fail-fast迭代器，而Hashtable的enumerator迭代器不是fail-fast的。所以当有其它线程改变了HashMap的结构（增加或者移除元素），将会抛出ConcurrentModificationException，但迭代器本身的remove()方法移除元素则不会抛出ConcurrentModificationException异常。同样也是Enumeration和Iterator的区别。



























