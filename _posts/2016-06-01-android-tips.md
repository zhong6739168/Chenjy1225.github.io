---
layout: post
title:  "Android tips"
date:   2016-06-01 20:00:00 +0800
categories: Android
tags: Android
author: JiuYang Chen
---

* content
{:toc}




## `Android`

###  `setHeight` no use

当设置的高度比原来默认的高度要小时,调整setHeight是不生效的。

```java

editText=(EditText)findViewById(R.id.myEditText);

// editText.setHeight(10); //不生效

editText.getLayoutParams().height = 100; 

```

### `Installation error:INSTALL_PARSE_FAILED_MANIFEST_MALFORMED`

1.1 包名大写了

2.2 缺少`AndroidManifest.xml`文件


### `Error:Error converting bytecode to dex`

1.1 包重复

2.2 `build`本身问题, 只需要`clean and rebuild` 一下

### `EditText`光标颜色
	
`EditText` 有一个属性 `android:textCursorDrawable` 用来控制光标的颜色。`android:textCursorDrawable="@null"`,`"@null"`作用是让光标颜色和`text color`一样
	
### 发现了以元素`'d:skin'`开头的无效内容	

把有问题的`devices.xml`删除,在`Android SDK` 里面的`tool\lib` 下找到`devices.xml`拷贝到那个文件夹。
	
### `finished with non-zero exit value 2`

重复的`jar`包,删除引用的包，同时删除`module`的`build.gradle`文件的引用。

### `border`

```java

<?xml version="1.0" encoding="UTF-8"?>
<shape xmlns:android="http://schemas.android.com/apk/res/android">
    <solid android:color="#00000000"/>
    <stroke android:width="1dp" android:color="#000000"/>
    <padding android:left="1dp" android:top="1dp" android:right="1dp" android:bottom="1dp" />
</shape>

```

### `VideoView`播放视频无法全屏问题

重写`VideoView`

```java

import android.content.Context;
import android.util.AttributeSet;
import android.widget.VideoView;

/**
 * Created by lijingnan on 12/04/2017.
 */
public class CustomerVideoView extends VideoView {

    public CustomerVideoView(Context context) {
        super(context);
    }

    public CustomerVideoView(Context context, AttributeSet attrs) {
        super(context, attrs);
    }

    public CustomerVideoView(Context context, AttributeSet attrs, int defStyleAttr) {
        super(context, attrs, defStyleAttr);
    }

    @Override
    protected void onMeasure(int widthMeasureSpec, int heightMeasureSpec) {
        // 其实就是在这里做了一些处理。
        int width = getDefaultSize(0, widthMeasureSpec);
        int height = getDefaultSize(0, heightMeasureSpec);
        setMeasuredDimension(width, height);
    }
}

```















	