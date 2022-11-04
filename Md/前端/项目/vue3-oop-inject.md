## 模块分包原理

实现首先以下结构

```
-- 项目名称
  -- src
    -- modules
       -- modules.json
       -- 模块名称
          -- router.ts
    -- entry
       -- 页面入口名称
          -- router
             -- __modules__.ts
             -- index.ts
      
```

实现一个插件（无论是vite还是webpack，如vite是buildStart时），此插件运行机制如下：

1. 读取`modules.json`中的模块列表（对应modules文件夹下面的文件夹名称），然后根据模块名称，进行文件夹匹配，并读取其模块下的`router.ts`文件，并将其整合；
2. 在对应的入口`entry`文件夹下的`router`下，生成一个新的文件`__modules__.ts`，用于导出真实的路由列表（就是上一步的整合结果）；
3. 对应的`entry`文件夹下的`router/index.ts`中会事先引入`__modules__.ts`文件，并放到真实的路由列表中



`module.json`示范

```json
{
  "main": [ // 入口名称（entry里面）
    "pet" // 模块名称（modules里面）
  ]
}
```



## 全局依赖注入原理

实现两个装饰器 Injectable-全局状态声明 Inject-全局状态引用

**Injectable**

在运行环境中创建一个单例Map对象，用于存储所有使用过的注入数据

**Inject**

读取单例Map中的对象，并将其值遍历到当前组件实例上，实现数据响应