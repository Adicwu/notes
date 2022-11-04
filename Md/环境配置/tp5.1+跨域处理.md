### thinkphp5.1+处理

1.在项目application下创建目录极其文件：common/behavior/CronRun.php

2.在CronRun.php中写入

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

3.在项目application下找到tags.php文件，打开并修改

```php
// 应用初始化
'app_init'     => [
    'app\\common\\behavior\\CronRun'
],
```

#### 注意

这种跨域是无session和cookie的处理，所以前端要设置请求withCredentials为false

