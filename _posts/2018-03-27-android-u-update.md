---
layout: post
title:  "Android App内检测更新新版本APK "
date:   2018-03-27 15:00:00 +0800
categories: Android 
tags: Android
author: chenjy
---


* content
{:toc}

`Rayland`主板虽然作为一块基于`Android`的工控板，但是很多设备厂商并不想让用户看到`Android系统`信息。所以`APK`默认设置为开机启动项、`img`去除了`Android`头部和底部菜单。但是随之带来了`APK`更新的问题，传统的插入`u盘`,`sd卡`手动安装新版本`APK`的方式已经不够用了。所以我们需要点自动的东西。




## App内检测更新新版本APK

### 检测新版本APK

我们使用 四大组件之一的`BroadcastReceiver`来检测 `sd卡`或是`u盘设备`的接入。



```java

public class StorageMountListener extends BroadcastReceiver{

    @Override
    public void onReceive(final Context context, Intent intent) {
        if(intent.getAction().equals(Intent.ACTION_MEDIA_MOUNTED)){
            // 获取插入设备路径
            String path = intent.getData().getPath();
            
 // 检测路径是否有新版本APK
 ApkUpdateUtils.getInstance().checkLocalUpdateAtBackground(context, path);
        }
    }

}



```

`ApkUpdateUtils.java`

```java

    /**
     * 后台检查指定目录下是否有新版本的APK，有则提示安装
     * @param context 上下文
     * @param path 需要检查的目录
     */
    public void checkLocalUpdateAtBackground(final Context context, final String path){
    ExecutorService executorService =         Executors.newSingleThreadExecutor();
    
        executorService.execute(new Runnable() {
            @Override
            public void run() {
                // 检查指定目录下是否存在高版本的更新包，并返回结果
                File apkFile = findUpdatePackage(context, path);
                if(apkFile == null){
                    return;
                }
                File msg = new File(apkFile.getParent(), apkFile.getName().replace(".apk", ".txt"));
                String description = readStringFile(msg);
                Intent intent = new Intent(context, UpdateActivity.class);
                intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                // 新版本apk 路径
                intent.putExtra("apk", apkFile.getAbsolutePath());
                // 新版本apk 描述信息
                intent.putExtra("description", description);
                context.startActivity(intent);
            }
        });
    }

    /**
     * 检查指定目录下是否存在高版本的更新包，并返回结果
     * @param path  检查目录
     * @return  APK文件
     */
    public File findUpdatePackage(Context context, String path) {
        File parent = new File(path);
        if(!parent.exists() || parent.isFile()){
            return null;
        }
        File[] apks = parent.listFiles(new FileFilter() {
            @Override
            public boolean accept(File pathname) {
                return pathname.getName().toLowerCase().endsWith(".apk");
            }
        });
        if(apks == null || apks.length == 0){
            return null;
        }
        try {

            /**
             *  通过 build.gradle 中的 versionCode 来判断
             *  每次版本更新后 修改versionCode
             */
            PackageManager packageManager = context.getPackageManager();
            PackageInfo packageInfo = packageManager.getPackageInfo(context.getPackageName(), 0);
            File apkFile = null;
            int versionCode = 0;
            for(File apk : apks){
                PackageInfo apkInfo = packageManager.getPackageArchiveInfo(apk.getAbsolutePath(), 0);
                if(packageInfo.packageName.equals(apkInfo.packageName) && packageInfo.versionCode < apkInfo.versionCode){
                    if(apkFile == null){
                        apkFile = apk;
                        versionCode = apkInfo.versionCode;
                    }else{
                        if(versionCode < apkInfo.versionCode){
                            apkFile = apk;
                            versionCode = apkInfo.versionCode;
                        }
                    }
                }
            }
            return apkFile;
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

    /**
     * 将文件内容读取成String
     * @param file 要读取的文件
     * @return 文件内容
     */
    public String readStringFile(File file){
        StringBuilder builder = new StringBuilder();
        BufferedReader br = null;
        try {
            br = new BufferedReader(new InputStreamReader(new FileInputStream(file), "GBK"));
            String line;
            while((line = br.readLine())!=null){
                builder.append(line);
                builder.append("\n");
            }
        } catch (IOException e) {
            e.printStackTrace();
        }finally {
            if(br!=null){
                try {
                    br.close();
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
        }
        return builder.toString();
    }

```




###  新版本更新提示

`UpdateActivity.java`

```java

   /**
     * 显示更新提示对话框
     */
    private void showUpdateMsgDialog(final Context context, final String apk, String descrption ){
        PackageInfo apkInfo = getPackageManager().getPackageArchiveInfo(apk, 0);

        AlertDialog updateMsgDialog = new AlertDialog.Builder(context).create();
        updateMsgDialog.setOnDismissListener(new DialogInterface.OnDismissListener() {
            @Override
            public void onDismiss(DialogInterface dialog) {
                finish();
            }
        });
        updateMsgDialog.setTitle("检测到新版本"+apkInfo.versionName);
        updateMsgDialog.setMessage(descrption);
        updateMsgDialog.setButton(AlertDialog.BUTTON_NEGATIVE, "取消", new DialogInterface.OnClickListener() {
            @Override
            public void onClick(DialogInterface dialog, int which) {
                finish();
            }
        });
        updateMsgDialog.setButton(AlertDialog.BUTTON_POSITIVE, "安装", new DialogInterface.OnClickListener() {
            @Override
            public void onClick(DialogInterface dialog, int which) {
                // 启动后台安装服务 `SilentInstallService`
                Intent intent = new Intent(UpdateActivity.this, SilentInstallService.class);
                intent.putExtra("apkPath", apk);
                context.startService(intent);

            }
        });
        updateMsgDialog.setCanceledOnTouchOutside(false);
        updateMsgDialog.show();
    }

```

###  后台安装服务

`SilentInstallService.java`

```java

public class SilentInstallService extends IntentService {
    static final String TAG = SilentInstallService.class.getSimpleName();

    public SilentInstallService() {
        super(TAG);
    }

    @Override
    protected void onHandleIntent(Intent intent) {
        PackageManager pm = getPackageManager();
        String apkPath = intent.getStringExtra("apkPath");
        PackageInfo info = pm.getPackageArchiveInfo(apkPath,PackageManager.GET_ACTIVITIES);
        if(install(apkPath) && info!=null){
            startActivity(getPackageManager().getLaunchIntentForPackage(info.packageName));
        }
    }

    public boolean install(String apkPath){
        Process process = null;
        BufferedReader errorStream = null;
        try {
            process = Runtime.getRuntime().exec("pm install -r "+apkPath+"\n");
            process.waitFor();
            errorStream = new BufferedReader(new InputStreamReader(process.getErrorStream()));
            String msg = "";
            String line;
            while((line=errorStream.readLine())!=null){
                msg += line;
            }
            Log.i(TAG, "silent install msg : "+msg);
            if(!msg.contains("Failure")){
                return true;
            }
        } catch (Exception e) {
            e.printStackTrace();
        }finally {
            if(errorStream!=null){
                try {
                    errorStream.close();
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
            if(process!=null){
                process.destroy();
            }
        }
        return false;
    }
}



```

`AndroidManifest.xml`注册 `StorageMountListener`和`SilentInstallService`

```xml

<receiver android:name=".StorageMountListener">
            <intent-filter>
                <action android:name="android.intent.action.MEDIA_MOUNTED" />
                <data android:scheme="file"/>
            </intent-filter>
        </receiver>
        
 <service android:name="cn.rayland.update.SilentInstallService">
        </service>
```

### 权限配置

到这个一切看起来尽善尽美了？ but it does't work.

我们需要系统权限

```xml

<manifest xmlns:android="http://schemas.android.com/apk/res/android"
     ... ... 
   android:sharedUserId="android.uid.system">

```

但是我们会发现安装失败

```java

error:Failure [INSTALL_PARSE_FAILED_INCONSISTENT_CERTIFICATES]

```

网上说这是因为你安装了`debug`权限签名，再安装系统`sign`签名就会有这个问题。需要卸载以前的`app`再安装。

然后我们又遇到了它

```java

error:Failure [INSTALL_FAILED_SHARED_USER_INCOMPATIBLE]

```

这是因为我们在 `AndroidManifest.xml`申明了系统签名，然而并没有。

我们需要一顿操作

* 找到编译目标系统时的签名证书platform.pk8和platform.x509.pem，在android源码目录build\target\product\security下
 
* 将签名工具（signapk.jar）、签名证书（platform.pk8和platform.x509.pem）及编译出来的apk文件都放到同一目录

然后命令行执行：

```c

java -jar signapk.jar platform.x509.pem platform.pk8 input.apk output.apk

```

就能把路径下的 `input.apk`变成签名的`output.apk`

当然你也可以使用现成的[signapk](https://chenjy1225.github.io/sign)，运行`signApk.bat`

就可以开心的更新了

![update](http://wx1.sinaimg.cn/mw690/c584f169ly1fprjk24ckbj20re0c675s.jpg)

### 其他方法

你也可以将更新APK服务`SilentInstallService`编译成一个`app`烧在`img`中。每次调用有系统签名的`SilentInstallService` `app`即可。