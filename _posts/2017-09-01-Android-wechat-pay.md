---
layout: post
title:  " Android wechat 支付"
date:   2017-09-01 19:00:00 +0800
categories: Android 
tags: Android 
author: chenjy
---



* content
{:toc}


本篇简单介绍`Android App`中接入微信支付，包括`App`内支付和扫码支付。`分享+支付` `pofei`



## 微信支付

> [wechat 官方接入文档](https://pay.weixin.qq.com/wiki/doc/api/index.html)


### `App`内支付

可以参照 [Android 微信支付详解与Demo](http://blog.csdn.net/simon_crystin/article/details/53433504)
​         
* [源码下载](http://download.csdn.net/download/simon_crystin/9699743)

主要流程：

1.1 微信支付平台注册账号 
​    
* 注：注册并申请成功以后，需要在API安全中设置你的API密钥 32个字符。建议使用 [MD5加密](http://tool.chinaz.com/Tools/md5.aspx) ,并且需要妥善的保存。因为无法查看。

2.2 生成预支付订单 

3.3 生成签名参数

4.4 调起微信,完成支付

![wechat pay](http://wx4.sinaimg.cn/mw690/c584f169ly1fl58a2xbhdj20e70a8glo.jpg)

![wechat pay](http://wx3.sinaimg.cn/mw690/c584f169ly1fl58a24inlj20gl0850su.jpg)

### 扫码支付

扫码支付使用的是微信`统一下单API` ，使用的是`模式二`，`模式一` 一直说URL参数错误，完全按照官方文档来的 令人费解。

#### 统一下单`API`

* [统一下单API](https://pay.weixin.qq.com/wiki/doc/api/native.php?chapter=9_1)

在上面的基础上，修改

```java

 private String getProductArgs() {
        // TODO Auto-generated method stub
        StringBuffer xml=new StringBuffer();
        try {
            String nonceStr=getNonceStr();
            currentOrderId = getOutTrade();
            xml.append("<xml>");
            List<NameValuePair> packageParams=new LinkedList<NameValuePair>();
            packageParams.add(new BasicNameValuePair("appid", WXConstants.APP_ID));
            packageParams.add(new BasicNameValuePair("body", "APP pay test"));
            packageParams.add(new BasicNameValuePair("mch_id", WXConstants.MCH_ID));
            packageParams.add(new BasicNameValuePair("nonce_str", nonceStr));
			// 回调 URL 地址，这里是第三方
            packageParams.add(new BasicNameValuePair("notify_url", "http://www.weixunyunduan.com/yunduanwx/wxpay/getpackage"));
			// 商户系统内部订单号，要求32个字符 且同个商户下唯一
            packageParams.add(new BasicNameValuePair("out_trade_no", getNonceStr()));
			// APP和网页支付提交用户端,Native支付填调用微信支付API的机器IP
            packageParams.add(new BasicNameValuePair("spbill_create_ip", "192.168.0.1"));
            packageParams.add(new BasicNameValuePair("total_fee", "1"));
			// Native支付
            packageParams.add(new BasicNameValuePair("trade_type", "NATIVE"));

            String sign=getPackageSign(packageParams);
            packageParams.add(new BasicNameValuePair("sign", sign));
            String xmlString=toXml(packageParams);

            return xmlString;


        } catch (Exception e) {
            // TODO: handle exception
            return null;
        }
    }
	
	
	 private String getOutTrade(){
        return UUID.randomUUID().toString().replace("-", "");
    }


```

`NATIVE`请求返回值如下：

```xml

<xml>
<return_code><![CDATA[SUCCESS]]></return_code>
<return_msg><![CDATA[OK]]></return_msg>
<appid><![CDATA[]]></appid>
<mch_id><![CDATA[]]></mch_id>
<nonce_str><![CDATA[]]></nonce_str>
<sign><![CDATA[]]></sign>
<result_code><![CDATA[SUCCESS]]></result_code>
<prepay_id><![CDATA[]]></prepay_id>
<trade_type><![CDATA[NATIVE]]></trade_type>
<code_url><![CDATA[weixin://wxpay/bizpayurl?pr=]></code_url>
</xml>

```

获取`code_url`，并使用第三方二维码生成库 如`ZXing` 生成二维码。

`ZXingUtils`


```java

import android.content.Context;
import android.graphics.Bitmap;
import android.graphics.Bitmap.Config;
import android.graphics.Canvas;
import android.graphics.Color;
import android.graphics.PointF;
import android.view.Gravity;
import android.view.View.MeasureSpec;
import android.widget.LinearLayout;
import android.widget.LinearLayout.LayoutParams;
import android.widget.TextView;

import com.google.zxing.BarcodeFormat;
import com.google.zxing.EncodeHintType;
import com.google.zxing.MultiFormatWriter;
import com.google.zxing.WriterException;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.qrcode.QRCodeWriter;

import java.util.Hashtable;

/** 
*
* 	生成条形码和二维码的工具
*/
public class ZXingUtils {
	/**
	 * 生成二维码 要转换的地址或字符串,可以是中文
	 * 
	 * @param url
	 * @param width
	 * @param height
	 * @return
	 */
	public static Bitmap createQRImage(String url, final int width, final int height) {
		try {
			// 判断URL合法性
			if (url == null || "".equals(url) || url.length() < 1) {
				return null;
			}
			Hashtable<EncodeHintType, String> hints = new Hashtable<EncodeHintType, String>();
			hints.put(EncodeHintType.CHARACTER_SET, "utf-8");
			// 图像数据转换，使用了矩阵转换
			BitMatrix bitMatrix = new QRCodeWriter().encode(url,
					BarcodeFormat.QR_CODE, width, height, hints);
			int[] pixels = new int[width * height];
			// 下面这里按照二维码的算法，逐个生成二维码的图片，
			// 两个for循环是图片横列扫描的结果
			for (int y = 0; y < height; y++) {
				for (int x = 0; x < width; x++) {
					if (bitMatrix.get(x, y)) {
						pixels[y * width + x] = 0xff000000;
					} else {
						pixels[y * width + x] = 0xffffffff;
					}
				}
			}
			// 生成二维码图片的格式，使用ARGB_8888
			Bitmap bitmap = Bitmap.createBitmap(width, height,
					Bitmap.Config.ARGB_8888);
			bitmap.setPixels(pixels, 0, width, 0, 0, width, height);
			return bitmap;
		} catch (WriterException e) {
			e.printStackTrace();
		}
		return null;
	}

	/**
	 * 生成条形码
	 *
	 * @param context
	 * @param contents
	 *            需要生成的内容
	 * @param desiredWidth
	 *            生成条形码的宽带
	 * @param desiredHeight
	 *            生成条形码的高度
	 * @param displayCode
	 *            是否在条形码下方显示内容
	 * @return
	 */
	public static Bitmap creatBarcode(Context context, String contents,
									  int desiredWidth, int desiredHeight, boolean displayCode) {
		Bitmap ruseltBitmap = null;
		/**
		 * 图片两端所保留的空白的宽度
		 */
		int marginW = 20;
		/**
		 * 条形码的编码类型
		 */
		BarcodeFormat barcodeFormat = BarcodeFormat.CODE_128;

		if (displayCode) {
			Bitmap barcodeBitmap = encodeAsBitmap(contents, barcodeFormat,
					desiredWidth, desiredHeight);
			Bitmap codeBitmap = creatCodeBitmap(contents, desiredWidth + 2
					* marginW, desiredHeight, context);
			ruseltBitmap = mixtureBitmap(barcodeBitmap, codeBitmap, new PointF(
					0, desiredHeight));
		} else {
			ruseltBitmap = encodeAsBitmap(contents, barcodeFormat,
					desiredWidth, desiredHeight);
		}

		return ruseltBitmap;
	}

	/**
	 * 生成条形码的Bitmap
	 *
	 * @param contents
	 *            需要生成的内容
	 * @param format
	 *            编码格式
	 * @param desiredWidth
	 * @param desiredHeight
	 * @return
	 * @throws WriterException
	 */
	protected static Bitmap encodeAsBitmap(String contents,
										   BarcodeFormat format, int desiredWidth, int desiredHeight) {
		final int WHITE = 0xFFFFFFFF;
		final int BLACK = 0xFF000000;

		MultiFormatWriter writer = new MultiFormatWriter();
		BitMatrix result = null;
		try {
			result = writer.encode(contents, format, desiredWidth,
					desiredHeight, null);
		} catch (WriterException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}

		int width = result.getWidth();
		int height = result.getHeight();
		int[] pixels = new int[width * height];
		// All are 0, or black, by default
		for (int y = 0; y < height; y++) {
			int offset = y * width;
			for (int x = 0; x < width; x++) {
				pixels[offset + x] = result.get(x, y) ? BLACK : WHITE;
			}
		}

		Bitmap bitmap = Bitmap.createBitmap(width, height,
				Bitmap.Config.ARGB_8888);
		bitmap.setPixels(pixels, 0, width, 0, 0, width, height);
		return bitmap;
	}

	/**
	 * 生成显示编码的Bitmap
	 *
	 * @param contents
	 * @param width
	 * @param height
	 * @param context
	 * @return
	 */
	protected static Bitmap creatCodeBitmap(String contents, int width,
											int height, Context context) {
		TextView tv = new TextView(context);
		LinearLayout.LayoutParams layoutParams = new LinearLayout.LayoutParams(
				LayoutParams.MATCH_PARENT, LayoutParams.WRAP_CONTENT);
		tv.setLayoutParams(layoutParams);
		tv.setText(contents);
		tv.setHeight(height);
		tv.setGravity(Gravity.CENTER_HORIZONTAL);
		tv.setWidth(width);
		tv.setDrawingCacheEnabled(true);
		tv.setTextColor(Color.BLACK);
		tv.measure(MeasureSpec.makeMeasureSpec(0, MeasureSpec.UNSPECIFIED),
				MeasureSpec.makeMeasureSpec(0, MeasureSpec.UNSPECIFIED));
		tv.layout(0, 0, tv.getMeasuredWidth(), tv.getMeasuredHeight());

		tv.buildDrawingCache();
		Bitmap bitmapCode = tv.getDrawingCache();
		return bitmapCode;
	}

	/**
	 * 将两个Bitmap合并成一个
	 * 
	 * @param first
	 * @param second
	 * @param fromPoint
	 *            第二个Bitmap开始绘制的起始位置（相对于第一个Bitmap）
	 * @return
	 */
	protected static Bitmap mixtureBitmap(Bitmap first, Bitmap second,
										  PointF fromPoint) {
		if (first == null || second == null || fromPoint == null) {
			return null;
		}
		int marginW = 20;
		Bitmap newBitmap = Bitmap.createBitmap(
				first.getWidth() + second.getWidth() + marginW,
				first.getHeight() + second.getHeight(), Config.ARGB_4444);
		Canvas cv = new Canvas(newBitmap);
		cv.drawBitmap(first, marginW, 0, null);
		cv.drawBitmap(second, fromPoint.x, fromPoint.y, null);
		cv.save(Canvas.ALL_SAVE_FLAG);
		cv.restore();

		return newBitmap;
	}

}

```

```java


 Bitmap bitmap = ZXingUtils.createQRImage(wxUrl,200,200);
 
```

![]()

`code_url`为微信可以识别的短链。

用户扫描便可在手机上支付。

#### 查询订单`API`

获取支付回调，使用查询订单API

[查询订单API](https://pay.weixin.qq.com/wiki/doc/api/native.php?chapter=9_2)

```java

String urlString="https://api.mch.weixin.qq.com/pay/orderquery";
                CheckAsyncTask checkAsyncTask = new CheckAsyncTask();
                checkAsyncTask.execute(urlString);

private class CheckAsyncTask extends AsyncTask<String,Void, Map<String, String>>
    {
        private ProgressDialog dialog;
        @Override
        protected void onPreExecute() {
            // TODO Auto-generated method stub
            super.onPreExecute();
            dialog = ProgressDialog.show(PayActivity.this, "提示", "正在查看订单状态！");

        }
        @Override
        protected Map<String, String> doInBackground(String... params) {
            // TODO Auto-generated method stub
            String url=String.format(params[0]);
            String entity=getProductCheckArgs();
            byte[] buf= wxUtils.httpPost(url, entity);
            String content = new String(buf);
            Map<String,String> xml=decodeXml(content);
            // 可以通过 xml.get("trade_state"); 获取订单的状态
            return xml;
        }

        @Override
        protected void onPostExecute(Map<String, String> result) {
            // TODO Auto-generated method stub
            super.onPostExecute(result);
            if (dialog != null) {
                dialog.dismiss();
            }
        }
    }

```














