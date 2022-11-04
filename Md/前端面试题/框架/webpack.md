[原文](https://juejin.cn/post/6943468761575849992#heading-2)

### webpack是什么

webpack是前端的一种工程化工具，他具有模块打包、编译兼容、能力扩展等功能；具体来说，他能更方便的抽离和整合模块，方便我们自由划分项目结构；他能通过各种loader，来实现我们对原生语言（html、js、css等）的预编译以及扩展（jsx、ts、less等），包括我们常说的babel-loader（es6+转es5）；他还能通过plugin来实现一系列扩展操作，如：代码压缩、按需加载等功能，进一步提高开发效率以及质量



### 运行原理

暂时无法理解



### sourceMap是什么

一般我们使用webpack打包项目时，代码会进行压缩；压缩后体积更小、更方便浏览器使用；但是，我们会遇见生产环境bug的情况，而此时如果在浏览器中对压缩后的源码进行调试，那难度会很大；而sourceMap，就是一种将压缩后代码映射还原的方式，通常以`.map`结尾的文件；实际上，sourceMap并不是webpack的功能之一，而是webpack支持sourceMap



### Loader是什么，和Plugin有什么关系

loader本质上就是一个函数（他接收到内容并进行转换，然后在返回），是一种预编译手段，能将我们的代码格式编译为浏览器能使用的格式，在module.rules中配置；他的实现过程中必须遵循 单一职责 ，只关心其输入和输出，不能有中间保留状态

plugin就是插件，基于Tapable，用于扩展webpack的功能，通过监听webpack的指定钩子来执行，在plugins中配置；他的实现依赖于webpack的发布订阅模式，通过监听来执行自身



### 热更新原理

热更新俗称HMR（Hot Module Replacement），是webpack的内置功能，他是一种根据代码更新来自动更新页面的一种行为（不用刷新浏览器），可以做到新旧模块的替换

在项目运行时，WDS（Webpack-dev-server）与浏览器间会建立一个websockt，当本地项目触发新的构建时，WDS主动像浏览器推送更新请求，并带上构建时的hash（webpack在每次构建打包项目时生成的key），与当前浏览器运行的项目hash进行对比，如果判断出现变动，则WDS会在浏览器处主动对服务端发起ajax请求，获取更改内容（文件内容、hash），然后浏览器在获取到后像WDS发送jsonp请求，获取更新内容



### 优化构建速度

- 使用高版本node和webpack

- 模块划分，只打包需要的模块

- 代码压缩、图片资源压缩

- 依赖抽离为cdn

- 打包缓存

- ...



### Tree Shaking

俗称树摇，是用于项目中去除无效代码的工具。他基于es6模块静态化和静态分析，所谓静态分析，就是指在编译时从字面量来查找引用，（uglify）删除未使用代码；而es6模块静态化则指import在执行时的前置加载与静态导入的特性（不像require的动态导入那样难以判断依赖关系）



### 为什么webpack不如vite快

- webpack基于node，vite基于esbuild（相当于go）；go比node快得多 10~100
- webpack使用node的单线程，esbuild单开了一个线程用于构建
- webpack是先全部打包，再启动服务器；esbuild直接启动服务器，并按需打包
- 对于HMR来说，vite是在原生ESM上执行的，能精确找到变动处；webpack则需要手动递归遍历文件来寻找变动处



### css-loader是干什么的

是用于支持css-import的