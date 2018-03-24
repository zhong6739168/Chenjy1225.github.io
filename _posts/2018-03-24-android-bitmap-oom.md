---
layout: post
title:  "Android BitmapFactory.Options 解决大图片加载OOM问题 "
date:   2018-03-24 08:00:00 +0800
categories: Android 
tags: Android
author: chenjy
---



* content
{:toc}

当我们在`Android`使用`bitmap`加载图片过程中，它会将整张图片所有像素都存在内存中，由于`Android`对图片内存使用的限制，很容易出现`OOM（Out of Memory）`问题。

为了避免此类问题我们可以采用[BitmapFactory.Options](https://developer.android.com/reference/android/graphics/BitmapFactory.Options.html)或是使用第三方的图片加载库。如[Fresco](https://github.com/facebook/fresco)、[Picasso](http://square.github.io/picasso/)等。




## `BitmapFactory.Options`

### 读取图片尺寸、类型

如文档所示：

如果`BitmapFactory.Options`中`inJustDecodeBounds` 字段设置为`true`

> If set to true, the decoder will return null (no bitmap), but the out...

`decodeByteArray(), decodeFile(), decodeResource()`等解析`bitmap`方法并不会真的返回一个`bitmap` 而是仅仅将图片的宽、高、图片类型参数返回给你，这样就不会占用太多内存，避免`OOM`


```java
itmapFactory.Options options = new BitmapFactory.Options();
options.inJustDecodeBounds = true;
BitmapFactory.decodeResource(getResources(), R.id.myimage, options);
int imageHeight = options.outHeight;
int imageWidth = options.outWidth;
String imageType = options.outMimeType;

```

### 图片显示

图片的显示可以选择缩略图的形式减少内存占用。

```java


public static int calculateInSampleSize(
            BitmapFactory.Options options, int reqWidth, int reqHeight) {
    // 原始图片尺寸
    final int height = options.outHeight;
    final int width = options.outWidth;
    int inSampleSize = 1;

    if (height > reqHeight || width > reqWidth) {
                // 计算出实际宽高和目标宽高的比率
                final int heightRatio = Math.round((float) height / (float) reqHeight);
                final int widthRatio = Math.round((float) width / (float) reqWidth);
                // 选择宽和高比率中最小的作为inSampleSize的值，这样可以保证最终生成图片的宽和高
                // 一定都会大于等于目标的宽和高。
                inSampleSize = heightRatio < widthRatio ? heightRatio : widthRatio;
            }

    return inSampleSize;
}

```

## Fresco

[Fresco 模块和特性](https://www.fresco-cn.org/)



