## thinphp5.1+初体验

> 由于博客项目接口的安全性问题，决定将后端验证升级为jwt。由于tp5版本并没有中间件，而前置操作无法像后续传参，导致需要使用5.1.17+以上的版本，所以有了此文章，单纯的记录一下坑。

[ThinkPHP5.1完全开发手册](https://www.kancloud.cn/manual/thinkphp5_1)

### 前言

**大概列举一下我了解到的变动**

1. tp5.1+版本推荐使用composer来安装第三方依赖，不推荐自己导入（这个版本的extend至今不知道怎么用，各种操作打死导不进去）
2. 命名空间。tp5控制器的命名空间为`namespace app\index\controller;`，而我使用的版本`5.1.40 LTS`将`app`关键字替换为了`application`，包括在`use`时也是，如`use application\Loader;`，但在模型里面没变化
3. 配置文件。配置文件集体移动到根目录的`config`文件夹里
4. 路由文件。单独移动到根目录下的`route`目录中

**composer的使用**

1. 安装，略过，网上太多了，安装完了记得cmd看看是否成功`composer --version`
2. 创建tp项目。`composer create-project topthink/think  项目名称 5.0.* --prefer-dist`，5.0.*为自己设置的版本
3. 安装第三方依赖。cmd居然项目根目录，`composer require 依赖名称`，成功后会在根目录下创建`vendor`文件夹和`composer.json\composer.lock`文件夹，`vendor`中会有你安装的依赖文件夹。使用`use 依赖主文件命名空间\主文件名称 `

### 一.接口开发配置

> 无session的接口开发

#### 一步到位路由配置

打开根目录下`route\route.php`，添加如下

```php
// 第一个为重定向后路由；第二个为原本路由；第三个为请求支持，默认只有get
// 实际访问 http://localhost/user/test，以为访问 index模块下的 user控制器下的 test方法
Route::rule('/:controller/:action', 'index/:controller/:action', 'GET|POST');
```

**nginx配置路由重写**

```nginx
...
location / {
    index index.html index.htm index.php;
	#autoindex on;
	if (!-e $request_filename) {
		rewrite ^(.*)$ /index.php?s=/$1 last;
		break;
	}
}
...
```

#### 老生常谈的跨域

> 在，为什么不用route自带的`allowCrossDomain`？别问，问就是用不来。我个人使用行为来处理

1. 首先，在根目录的`application`文件夹下创建`common\behavior\CronRun.php`，内容如下

   ```php
   <?php
   namespace app\common\behavior;
   
   use think\Exception;
   
   class CronRun
   {
       public function run($dispatch)
       {
           $web = request()->header('Origin');
           //跨域请求设置
           header("Access-Control-Request-Method:GET,POST");
           header("Access-Control-Allow-Credentials:true");
           header("Access-Control-Allow-Origin:".$web);
           header("Access-Control-Allow-Headers:token,Content-Type, Authorization, Accept, Range, Origin,Token,Lang,lang");
           if (request()->isOptions()) {
               exit;
           }
       }
   }
   ```

2. 然后，打开根目录下的`application\tags.php`文件，添加如下

   ```php
   ....
   // 应用行为扩展定义文件
   return [
       // 应用初始化
       'app_init'     => [
           'app\\common\\behavior\\CronRun'
       ],
       ....
   ];
   ```

### 二.中间件

> 什么是中间件，为什么要使用中间件。中间件是一种前后置操作，它可以很好的降低耦合度，比如常见的调用控制器方法时的权限验证

#### 生成

> php think make:middleware 中间件名称

执行成功后会在`application`文件夹下生成`http/middleware`文件，里面为创建的中间件，如下

```php
<?php

namespace application\http\middleware;

class test
{
    public function handle($request, \Closure $next)
    {
        //exit; //可中断后续操作，包括原方法
        
        //如果想返回某些参数，则如下，接收请看下面 使用 部分
        $request->test='test'; 
        return $next($request); //返回对象
    }
}
```

#### 注册

- 全局：进入项目根目录，创建`middleware.php`文件，如果有就修改，如下

  ```php
  <?php
  // AuthVerify为定义的中间件名称，值为 中间件路径::class；注意，版本不同application可能为app 
  return [
  	'AuthVerify' => application\http\middleware\AuthVerify::class,
  ];
  ```

- 局部：操作不来，官方文档提供的控制器加载等加载不上，留坑中...

#### 使用

推荐在控制器中使用，模型更适合只做数据库操作

```php
<?php
namespace application\index\controller;

use think\Request;
use think\Controller;

class User extends Controller{ //这里必须继承Controller
	protected $middleware = [
		//其他扩展详见官方文档，此处意为info和editInfo会先被AuthVerify中间件处理再执行
        'AuthVerify'  =>  ['only' => ['info','editInfo'] ],
    ];
    public function info(){}
    
    //使用中间件传递的值
    public function editInfo(Request $request){
        echo $request->test;
    }
}
```

### 三.各种位置的调用

#### 控制器A调用控制器B的方法

```php
<?php
namespace application\index\controller;

use application\index\controller\B; //application可能为app

class A extends Controller
{
	public function test(){
        $B = new B;
        $B->test(); //此处调用B控制器的test
    }
}
```

#### 控制器A调用模型A的方法

```php
....
    
class A extends Controller
{
	public function test(){
    	$A=new \app\index\model\A;
        $A->test();//此处调用B模型的test
    }
}
```

