## AndroidStudio+GenyMotion+Flutter环境搭建之win10

### 一.需要文件下载安装

#### 1）安装Flutter

点击链接跳转（需要翻墙）：[FlutterSdk](https://flutter.dev/docs/development/tools/sdk/releases#windows)

#### 2）安装GenyMotion

点击链接跳转（需要翻墙）：[GenyMotion](https://www.genymotion.com/download/)	

#### 3）安装AndroidStudio

点击链接跳转：[AndroidStudio](http://www.android-studio.org/)	

### 二.环境变量配置

> 右键此电脑，单击属性，左边列表选择高级系统设置，弹出框选高级->环境变量

#### 1）用户变量

1. 新建`FLUTTER_STORAGE_BASE_URL`->`https://storage.flutter-io.cn`
2. 新建`PUB_HOSTED_URL`->`https://pub.flutter-io.cn`
3. 编辑path选项，弹出框点新建，输入`flutter放置指定路径`，如：`W:\flutter\bin`

#### 2）系统变量

1. 新建`ANDROID_HOME`->`AndroidSdk存放目录`，如：`W:\android-sdk`
2. 编辑path选择，弹出框点新建，输入`AndroidSdk目录`下的`platform-tools`目录，如：`W:\android-sdk\platform-tools`
3. 新建`VBOX_MSI_INSTALL_PATH`->`VirtualBox安装目录`，如：`W:\Orade\VirtualBox\`

#### 3）保存退出

以上操作解决以下问题：

1. flutter附属文件一直下载
2. as找不到VirtualBox
3. as找不到设备：`No connected devices found; please connect a device, or see flutter.io/setup for getti`
4. ....忘了

### 三.AndroidStudio配置

#### 1）软件配置

1. View->`Appearence`->勾选`ToolBar`

#### 2）插件配置

> `File->setting->Plugins`打开插件管理。`Markedplace`插件市场、`Installed`已经安装的

1. 搜索安装`Dart\Flutter`
2. 搜索安装`Genymotion`。在完成软件配置中的`ToolBar`后，工具栏会出现一个粉红背景的手机图标，用于开启模拟器

##### 3）保存关闭重启as

### 四.其他配置

##### 1）解决运行项目卡在  `Running Gradle task 'assembleDebug'...`（因为默认的请求对象在国外）

修改项目文件中的`android->build.gradle`

```dart
buildscript {
    .......
    repositories {
        maven { url 'https://maven.aliyun.com/repository/google' }
        maven { url 'https://maven.aliyun.com/repository/jcenter' }
        maven { url 'http://maven.aliyun.com/nexus/content/groups/public' }
    }
	.......
}
allprojects {
    repositories {
        maven { url 'https://maven.aliyun.com/repository/google' }
        maven { url 'https://maven.aliyun.com/repository/jcenter' }
        maven { url 'http://maven.aliyun.com/nexus/content/groups/public' }
    }
}
```

修改flutter原文件`flutter安装目录->/packages/flutter_tools/gradle/flutter.gradle`

```dart
buildscript {
    repositories {
        maven { url 'https://maven.aliyun.com/repository/google' }
        maven { url 'https://maven.aliyun.com/repository/jcenter' }
        maven { url 'http://maven.aliyun.com/nexus/content/groups/public' }
    }
    .....
}
```

修改完成后，仍然需要等待很长一段时间自动下载gradle

**其他方法**

> 在点击启动项目后会自动下载gradle，会在系统盘生成一个文件夹，但由于上面说了下载太慢，所以我们给他加把劲

1. 先运行项目，过几十秒后（等待他创建gradle文件夹）停止运行
2. 然后根据目录找到下载路径`C:\Users(或者叫用户)\你自己给电脑命名的名字\.gradle\wrapper\dists`
3. 进入有一个文件夹类似于`gradle-5.6.2-all`，5.6.2为版本号，点进去后是一个文件夹，名称为随机字符串，再点进去
4. 进入网站手动下载gradle，切记版本号名称相同[gradle下载](https://services.gradle.org/distributions/)
5. 下载完成后将文件拖入随机字符串文件夹，再次启动项目等待即可

### 五.bios硬件配置

> 由于电脑主板、处理器型号不同，可自行百度主板型号+处理器Intel/Amd+开启虚拟服务