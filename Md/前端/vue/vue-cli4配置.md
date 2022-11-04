### 一. 创建项目

> vue create 项目名称

------------


   ### 二. 目录配置
**在`src`下创建**

   ```html
   assets 存放静态资源， 如css、 img
   components 存放组件
   network 存放请求相关， 如请求封装
   router 路由配置， 默认下名称index.js
   store vuex仓库， 情况复杂单独配置
   views 视图存放
   ```

**项目根目录创建`vue.config.js`配置文件， 默认内容**

   ```html
   module.exports = {}
   ```

------------


   ### 三. 服务器配置(nginx)
### 1）解决vue-router在服务器端运行无法通过指定路由访问，导致404

**在对应的`vhost.conf`配置文件中添加**

   ```html
   location / {
   	root   #;  //这里为自己项目的对应路径
   	index  index.html;
   	try_files $uri $uri/ @router;
   }
   location @router {
   	rewrite ^.*$ /index.html last;
   }
   ```

------------


   ### 四. 插件配置

   #### 1）按需引入element - ui
   > npm i element - ui - S

   > npm install babel - plugin - component - D

   > npm install babel - preset - env @next--save 看情况

**babel.config.js中添加**

   ```javascript
   plugins: [
   	[
   		"component",
   		{
   			libraryName: "element-ui",
   			styleLibraryName: "theme-chalk"
   		}
   	]
   ]
   ```

**main.js中添加**

   ```javascript
   import {
   	Button
   } from "element-ui";
   Vue.use(Button);
   ```

------------


   #### 2）Gzip代码压缩配置
**安装**

   > npm install compression-webpack-plugin -D

   

**项目配置**

   `vue.config.js`中写入

   ```javascript
   const CompressionPlugin = require('compression-webpack-plugin')
   const productionGzipExtensions = [
   	"js",
   	"css",
   	"svg",
   	"woff",
   	"ttf",
   	"json",
   	"html"
   ];
   module.exports = {
   	//配置Gzip
   	configureWebpack: {
   		plugins: [
   			//开启gzip压缩
   			new CompressionPlugin({
   				filename: "[path].gz[query]",
   				test: new RegExp("\\.(" + productionGzipExtensions.join("|") + ")$"),
   				threshold: 1024,
   				minRatio: 0.8, //压缩率大于0.8的才压缩
   				deleteOriginalAssets: false //是否删除原文件
   			})
   		],
   	},
   	productionSourceMap: false, //不输出map文件
   	devServer: {},
   }
   ```

**服务器配置(nginx)**

   > 如果为主机， 则配置nginx.conf文件
   >
   > 如果为虚拟主机， 则配置域名.conf文件

**在server内写入**

   ```nginx
gzip_static on;
gzip_disable "msie6";
gzip_min_length 100 k;
gzip_buffers 4 16 k;
gzip_comp_level 3;
gzip_types text / plain application / x - javascript text / css application / xml text / javascript application / x -httpd - php image / jpeg image / gif image / png;
   ```

------------

#### 3）全局less内容

**安装**

> npm i style-resources-loader vue-cli-plugin-style-resources-loader --save-dev

**vue.config.js中配置**

```javascript
const path = require('path');
module.exports = {
    pluginOptions: {
        'style-resources-loader': {
            preProcessor: 'less',
            patterns: [
                // 全局变量路径，不能使用路径别名
                path.resolve(__dirname, 'src/assets/css/common/util.less')
            ]
        }
    }
}
```



------

   #### 4）highlight.js以及mark使用

**安装**

   > npm install highlight.js marked  --save

**配置如下**

   ```javascript
   <script>
   //导入主题样式文件，其他名称在对应我下载目录highlight.js/styles下找
   import 'highlight.js/styles/monokai-sublime.css';
   import jQuery from 'jquery';
   //引入marked与highlight.js
   let marked = require('marked');
   let hljs = require('highlight.js');
   
   //marked配置且使其支持highlight.js
   marked.setOptions({
   	renderer: new marked.Renderer(),
   	gfm: true,
   	tables: true,
   	breaks: false,
   	pedantic: false,
   	sanitize: false,
   	smartLists: true,
   	smartypants: false,
   	highlight: function(code, lang) {
   		if (lang && hljs.getLanguage(lang)) {
   			return hljs.highlight(lang, code, true).value;
   		} else {
   			return hljs.highlightAuto(code).value;
   		}
   	}
   });
   export default {
       data(){
           return{
               context: ''
           }
       },
       computed: {
   		contextMarked() {//使用vue的计算属性，将自己需要解析的md字符串解析
   			let newcontext = marked(this.context);//使用marked方法解析
   			return newcontext;
   		},
   	},
   }
   </script>
   ```

------

### 五.请求配置

#### 1）跨域配置，axios+vue-cli4

**vue.config.js中配置**

```javascript
module.exports = {
	devServer: {
        proxy: {
            '/api': {
                target: "https://s1.hdslb.com/",//需要跨域请求的端口地址
                changeOrigin: true,//是否跨域
                ws: true,
                pathRewrite:{//路径重写，如果遇到请求中有自己定义的关键字，如这里的api，则重写为空
                    '^/api': ''
                }
            }
        }
	}
}
```

**请求封装配置**

```javascript
//这里只列举很基础的axios封装
export function Crossax(config) {
	const instance = axios.create({
		baseURL: '/api',//这里的baseUrl就是上面vue.config.js中定义的名字
		timeout: 8000
	})
	return instance(config)
}
```

