### 项目部署

1. 下载`live2d`文件
2. 部署`vue-cli`项目
3. 将`live2d`文件放置到`vue`项目的`public`文件夹下



### 实例初始化

#### 1.打开`public`下的`index.html`文件，在`body`后引入`L2Dwidget.min.js`文件

```javascript
<script src="live2dw/lib/L2Dwidget.min.js" type="text/javascript" charset="utf-8"></script>
```

#### 2.打开`src`目录下的`app.vue`文件，创建初始化方法`liveTwoD` 名字可以自己定义，在`mounted`钩子中调用，内容如下

> *注意，由于文件打包的原因，vue-cli会默认将live2d中的所有看板娘数据打包，酌情将自己不需要的数据删除即可

```javascript
liveTwoD() {
	console.log = function(){}//禁止控制台输出信息，看需要写入，因为看板娘会在控制台输出一堆配置信息
	setTimeout(()=>{//延时加载，不然会导致异步情况而无法正常显示
		window.L2Dwidget.init({
            pluginRootPath: 'live2dw/',
            pluginJsPath: 'lib/',
             //live2d-widget-model-koharu为live2d文件夹下的文件，名称对应不同的看板娘   
            pluginModelPath: 'live2d-widget-model-koharu/assets/',
            tagMode: false,
            debug: false,
             //这里的路径对应的看板娘需和上面一样，注意看清楚名称
            model: { jsonPath: 'live2dw/live2d-widget-model-koharu/assets/koharu.model.json' },
             //定义看板娘出现的位置以及大小   
            display: { position: 'right', width: 200, height: 350 },
            mobile: { show: true },
            log: false,
		})
	},1000)
}
```