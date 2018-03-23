---
layout: post
title:  "500 Data Structures and Algorithms practice problems and their solutions"
date:   2017-08-07 20:00:00 +0800
categories: Java 
tags: Java
author: chenjy
---



* content
{:toc}





`500 Data Structures and Algorithms practice problems and their solutions`

[500 Data Structures and Algorithms practice problems and their solutions](https://techiedelight.quora.com/500-Data-Structures-and-Algorithms-practice-problems-and-their-solutions)

## 001`Find pair with given sum in the array`

### `My solutions`

遍历`arr`,比对取合适的值

* Time complexity `o(n²)`

* auxiliary space `o(1)`


```java

package test;

public class d001 {

    /*Q: Input: arr = [8,7,2,5,3,1]; 
     *   sum = 10;
     *
     *  Output: pair found at index 0 and 2(8+2)
     *  or
     *  pair found at index 1 and 4(7+3)    
     * 	
     */
	
	public static void findPair(int [] arr,int sum){
		String str = "";
		int length = arr.length;
		for(int i = 0;i < length ;i++){
			for(int j = i + 1;j < length;j++){
					if(arr[i]+arr[j] == sum){
						if(str.equals("")){
							str +=" pair found at index"+i+" and "+j+"("+arr[i]+"+"+arr[j]+")\n";
						}else{
							str +=" or\n pair found at index"+i+" and "+j+"("+arr[i]+"+"+arr[j]+")\n";
						}
					}
			}
		}
	if(str.equals(""))str+="pair not found";
	System.out.println(str);	
	}
}


```

### better

使用`Arrays.sort`对`arr`进行排序,从两端开始遍历`max`、`min`。如果两个值大于给定的`sum`,取更小的`max`。如果小于`sum`，取更大的`min`。

* Time complexity `o(nlogn)`

* auxiliary space `o(1)`

[深入理解Arrays.sort()](http://blog.csdn.net/wisgood/article/details/16541013)

> `Arrays.sort()` 时间复杂度为 `nlogn`

### best

使用`hash map`将`arr`值存入`map`中,遍历存在不同于当前元素并且值为`(sum - arr[i])`的元素。



* Time complexity `o(n)`

* auxiliary space `o(n)`

> `hash` 表的查找效率近似于`o(1)`

```java

		// create an empty Hash Map
		Map<Integer, Integer> map = new HashMap<Integer, Integer>();
	 
		// do for each element
		for (int i = 0; i < arr.length; i++)
		{
			// check if pair (arr[i], sum-arr[i]) exists
	 
			// if difference is seen before, print the pair
			if (map.containsKey(sum - arr[i]))
			{
				System.out.println("Pair found at index " + 
						map.get(sum - arr[i]) + " and " + i);
				return;
			}
	 
			// store index of current element in the map
			map.put(arr[i], i);
		}

		// No pair with given sum exists in the array
		System.out.println("Pair not found");

```

## 002`check if subarray with 0 sum is exists or not`

### `My solutions`

```java


    /*Q: Input: arr = [3,4,-7]; 
     *
     *  Output: exists    
     * 	
     */
	
		
	public static boolean zeroSumSubarray(int[] arr){
		Set<Integer> set = new HashSet<Integer>();
		set.add(0);
		int sum = 0;
		for(int i = 0;i < arr.length;i++){
			sum += arr[i];
			if(set.contains(sum)){
				return true;
			}	
			set.add(sum);
		}
		return false;	
	}
	
```

* Time complexity `o(n)`

* auxiliary space `o(n)`

[Java 集合类详解](http://blog.csdn.net/u014136713/article/details/52089156)

## 003`Print all sub-array with 0 sum `

### `My solutions`


```java
		
	public static void printAllSubattays(int[] arr){

        // 使用	Map<Integer,ArrayList> 存所有sum 及其 索引值
		Map<Integer,ArrayList> map = new HashMap<Integer,ArrayList>();
		
		// 先存入0 索引为-1.
		insert(map,0,-1);
		
		int sum = 0;
		
		for(int i = 0 ;i< arr.length;i++){
			
			sum += arr[i];
			
			// 当sum值在 map中存在，则说明存在至少一个 sub-array为0
			if(map.containsKey(sum)){
				
				ArrayList<Integer> list = map.get(sum);
				
		
				for(Integer j:list){
					System.out.println("["+(j+1)+"..."+i+"]");
				}
			}
			insert(map,sum,i);
		}
	}
	
	public static void insert(Map<Integer,ArrayList> hashMap,int key,int value){
	
		if(hashMap.containsKey(key)){
			hashMap.get(key).add(value);	
		}else{
			ArrayList<Integer> list = new ArrayList<Integer>();
			list.add(value);
			hashMap.put(key,list);
		}
		
	}
	
```

## 004`Rearrange the array with alternate high and low elements `

### `My solutions`

```java


	/*Q: Input: {1,2,3,4,5,6,7}
     *
     *  Output: {1,3,2,5,4,7,6} 
     * 	
     */

	public static void rearrangeArray(int[] arr){
			
			int temp;
			int n = arr.length;
			for(int i =1;i< n;i+=2){
				
				// 如果小于前一个值，则和前一个交换
				if(arr[i] < arr[i - 1]){
					temp = arr[i - 1];
					arr[i - 1] = arr[i];
					arr[i] = temp;
				}
				
				// 如果小于后一个值，则和后一个交换
				if(i+1 > n && arr[i] < arr[i + 1]){
					temp = arr[i + 1];
					arr[i + 1] = arr[i];
					arr[i] = temp;
				}	
			}
		}

```

* &&具有短路的功能，即如果第一个表达式为false，则不再计算第二个表达式.

## 005`Sort binary array in linear time `

### `My solutions`

```java


	/*Q: Input: {1,0,1,0,1,0,0,1}
     *
     *  Output: {0,0,0,0,1,1,1,1} 
     * 	
     */

	public static void sort(int[] arr){

		int k = 0;
		int n = arr.length;
		for(int i = 0;i<n;i++){
			if(arr[i]== 0){
				arr[k++] = 0;
			}
		}
		for(int i = k;i<n;i++){
			arr[k++] = 1;
		}
	}

```

## 006`Sort an array containing 0’s, 1’s and 2’s (Dutch national flag problem) `

### `My solutions`

```java

	/*Q: Input: {0,1,2,2,1,0,0,2,0,1,1,0}
     *
     *  Output: {0,0,0,0,0,1,1,1,1,2,2,2} 
     * 	
     */

	public static void threeWayPartition(int[] arr){

		int end = arr.length;
	    int mid = 0,start = 0;
	    int pivot = 1;
	    int temp;
	    
	    while(mid <= end){
	    	
	    	if(arr[start] > pivot){
	    		temp = arr[end];
	    		arr[end] = arr[start];
	    		arr[start] = temp;
	    		end--;
	    	}else if(arr[start] < pivot){
	    		temp = arr[mid];
	    		arr[mid] = arr[start];
	    		arr[start] = temp;
	    		start++;
	    		mid++;
	    	}else {
	    		mid++;
	    	}
	    	
	    }
		
	}

```



* ++i 先自增再赋值 , i++ 先赋值再自增(标准答案为 ++mid)


## 007`Shuffle a given array of elements (Fisher–Yates shuffle)`

### `My solutions`

```java

	/*Q: Input: {1,2,3,4,5,6}
     *
     *  Output: (Random) {4,6,1,2,5,3} 
     * 	
     */

	public static void shuffle(int arr[]){
		int temp;
		int n = arr.length;
		
		for(int i = n -1;i>=1;i--){

			Random random = new Random();
			// [0,i+1)
			int j = random.nextInt(i+1);
			
			temp = arr[i];
			arr[i] = arr[j];
			arr[j] = temp;
			
		}
		
		
	}


```

`Fisher–Yates shuffle:`洗牌算法

给定一个大小为n数组将元素随机排列。有n！中可能。

* 第一个元素，可以和包括自己在内的n个元素交互。

* 第二个元素，可以和包括自己在内的n-1个元素交换。

* 重复上述步骤，直至只剩一个元素


## 008`Find equilibrium index of an array`

### `My solutions`

```java

	/*Q: Input: {0,-3,5,-4,-2,3,1,0}
     *
     *  Output: index {0,3,7} 
     * 	
     */

public static void equilibriumIndex(int arr[]){
		
	 
		int n = arr.length;
		int[] left = new int[n];
		left[0] = 0;
		
		for(int i = 1;i< n;i++){
			left[i] = left[i-1] + arr[i-1];
		}
		
		int right = 0;
		for(int i = n-1;i>=0;i--){
			if(left[i] == right){
				System.out.println("index"+i);
			}
			
			right += arr[i];
		}
		
		
	
	}

```

## 009`Find majority element in an array (Boyer–Moore majority vote algorithm)`

### `My solutions`

使用HashMap去统计每个元素出现的次数，然后遍历求出答案。


* Time complexity `o(n)`

* auxiliary space `o(n)`

```java

public static int majorityElement(int arr[]){
		
		int n = arr.length;
		
		Map<Integer,Integer> map = new HashMap<Integer,Integer>();
		
		for(int i = 0;i< arr.length;i++){
			if(map.get(arr[i]) == null){
				map.put(arr[i], 0);
			}else{
				map.put(arr[i],map.get(arr[i]+1));
			}
		}
		
		Iterator it = map.entrySet().iterator();
		
		while(it.hasNext()){
			
			Map.Entry pair = (Map.Entry)it.next();
			
			if((int)pair.getValue()>n/2){
				return (int)pair.getKey();
			}
			it.remove();
		}
		return -1;
	}

```

`Boyer–Moore majority vote algorithm:`摩尔投票算法 

可以降低空间复杂度。

* Time complexity `o(1)`

* auxiliary space `o(n)`

```java

	public static int majorityElement(int arr[]){
		
		int n = arr.length;
		
		// 存储最多的元素
		int m = -1;
		
		//存储元素的个数
		int i = 0;
		
		for(int j = 0;j < n;j++){
			if(i == 0){
				m = arr[j];
				i = 1;
			}else if(arr[j] == m){
				i++;
			}else if(arr[j] != m){
				i--;
			}
		}
		
		if(i > n/2){
			return m;
		}else{
			return -1;
		}
	}


```

## 010`Move all zeros present in the array to the end`

### `My solutions`

```java

public static void partition(int arr[]){
		
		int j = arr.length - 1;
		int temp;
		int i = 0;
		 
		while(i< j){
			if(arr[i] == 0){
				temp = arr[j];
				arr[j] = arr[i];
				arr[i] = temp;
				j--;
			}else{
				i++;
			}
		}
		System.out.println(Arrays.toString(arr));
	}

```

## 011` Inplace merge two sorted arrays`

### `My solutions`

```java

	/*Q: Input: x[] = [1,4,7,8,10]; 
	 *          y[] = [2,3,9];
     *   
     *  Output: x[] = [1,2,3,4,7]; 
	 *          y[] = [8,9,10];
     * 	
     */

	public static void merge(int x[],int y[]){
		
		int n = x.length;
		int m = y.length;
		int i = 0;
		
		while(i < n){
			
			if(y[0]<x[i]){
				int temp = y[0];
				y[0] = x[i];
				x[i] = temp;
				
				int first = y[0];
				int j;
				for(j = 1;j< m && first>y[j];j++){
					y[j-1] = y[j];
				}
				y[j-1] = first;
				
			}else{
				i++;
			}
		}
	}


```

## `Update 18/03/20`也许太监了呢





































