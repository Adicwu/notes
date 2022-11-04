### 项目初始化

1. 创建项目文件，使用`npm init --yes`初始化

2. 下载koa框架`npm install koa --save`

3. 手动在根目录创建app.js，写入以下内容初始化，`nodeapp.js`运行

   ```javascript
   var koa = require('koa')
   new koa().use(async ctx => {
   	ctx.body = 'hellow koa1'
   }).listen(3000)
   ```

4. 完成上述后，安装插件

**脚手架**

> npm install koa-generator -g

- 项目创建：koa xxx
- 安装依赖：npm intall
- 启动项目：npm start

### 路由

> 依赖koa-router

```javascript
var Koa = require('koa')
var router = require('koa-router')() //引入和实例化
var app = new Koa();

//全局中间件
app.use(async (ctx, next) => { //优先级高于普通路由
	console.log(new Date())
	await next()
	if (ctx.status === 404) {
		ctx.body = '404page'
	}
})

//路由设置
router.get('/', async ctx => {
	ctx.body = 'emmm'
	console.log(ctx) //普通路由
}).get('/study', async ctx => {
	ctx.body = 'study'
	console.log(ctx.query) //get传值，'/study?id=xx'，如果不传值则返回空对象
}).get('/comic/:uid', async ctx => {
	ctx.body = 'comic'
	console.log(ctx.params) //动态路由传值，'/comic/xx'，如果不传值则会导致notfound
})

app.use(router.routes()).use(router.allowedMethods())
app.listen(3000)
```

### 模板引擎

> 依赖koa-views、ejs（推荐使用art-template）

```javascript
var views = require('koa-views'),
//配置模板引擎(这种配置的页面文件后缀为html，使用extension方法则为ejs)
app.use(views('views', {
	map: { html: 'ejs' }
}))

//路由内配置
await ctx.render('xx')//xx为页面名称
```

### 获取提交数据

> 依赖koa-bodyparser

### Cookie/Session

**cookie**

```javascript
ctx.cookies.set('user','jack')//设置，可配置过期时间、可访问页面
ctx.cookies.get('user')//获取

//默认来说koa的cookie值无法存在中文，所以需转义后使用
//var userinfo = Buffer.from("吴某").toString('base64') //编码
//Buffer.from(ctx.cookies.get('userinfo').toString('base64'), 'base64').toString('utf-8') //解码
```

**session**

> 依赖koa-session

```javascript
//初始化
session = require('koa-session')
app.keys = ['some secret hurr'];
const CONFIG = {
	key: 'koa:sess',
	maxAge: 86400000, //过期时间
	overwrite: true, //是否覆盖 貌似无效
	httpOnly: true, //只有服务器端可获取
	signed: true, 
	rolling: false, //每次访问强制重新设置
	renew: true, //每次访问快过期时重新设置
}
app.use(session(CONFIG, app))

//使用

```

### 数据库

**基于MongoDB封装的DB类库**

> 依赖mongodb

```

```

