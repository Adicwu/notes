## ThinkPhp5.1.4之think-glide动态裁剪

### 一.安装

```powershell
composer require slince/think-glide:0.0.1
```

默认安装的版本是支持tp6的，需要手动安装0.0.1版本来支持tp5

### 二.配置

#### 2-1基础全局配置

1. 在application文件夹下找到`middleware.php`文件（如果没有，手动创建即可）

2. 在application文件夹下创建images文件夹（此文件夹作为模块入口，内部为空）

3. 在文件中写入

   ```php
   <?php
   return [
   	\Slince\Glide\GlideMiddleware::factory([
   	    'source' => '../public/uploads',
   	])
   ];
   ```

   更多参数配置请访问：[think-glide](https://github.com/top-think/think-glide)

4. 完成上述即可使用

   ```javascript
   // 假设静态资源文件夹public/uploads存在2.jpg图片，则方法访问如下
   http://xx.com/images/2.jpg?w=100&h=100 // w h 为裁剪后的图片高宽
   ```

   #### 2-2单独配置

   > 很多情况下，我们的后端图片并不在同一个目录下，也就导致全局配置无法正常运行，故推荐以下写法

1. 在application文件夹下创建images文件夹，内部创建controller文件夹，其内创建`Index.php`，完整路径如下

   ```
   application->images->controller->Index.php
   ```

2. 在`Index.php`中写入

   ```php
   <?php
   namespace application\images\controller;
   use think\Controller;
   
   class Index extends Controller{
   	public function handleImageRequest()
   	{
           // 我这里以path传入参数来动态设置路径
   		$path = input('path');
   	    $middleware = \Slince\Glide\GlideMiddleware::factory([
   	        'source' => './uploads/'.$path,
   	    ]);
   	    return $middleware(app('request'), function(){
   	        return app('response');
   	    });
   	}
   }
   ```

3. 在项目根目录下的`route->route.php`文件中添加

   ```php
   //....
   Route::get('images/:file', 'images/index/handleImageRequest');
   ```

4. 完成上述即可使用

   ```
   // 假设静态资源文件夹public/uploads/img下存在2.jpg图片，则方法访问如下
   http://xx.com/images/2.jpg?path=img&w=100&h=100 // path为指定子目录名称， w h 为裁剪后的图片高宽
   ```

### 三.其他

think-glide还有其他图片处理操作，[详情点击](http://glide.thephpleague.com/1.0/api/quick-reference/)

图片裁剪后的缓存文件在项目根目录下的`runtime->glide`，默认两天过期

频繁同ip进行同文件操作会导致请求拉黑，请注意