### 事件

> 用于监听状态

```javascript
var events = require('events');
var eventEmitter = new events.EventEmitter();
eventEmitter.on('emm1', (name, age) => { //如果重复定义,则会同时生效，once只执行一次
	console.log('emm11', name, age)
})
eventEmitter.emit('emm1', 'adic', 17) //触发，参数以单个传递
```

### 缓冲

### 流

```javascript
//写
var fs = require('fs')
var data = '2333sheakj';
var rfs = fs.createWriteStream('out.txt')
rfs.write(data, 'UTF8')
rfs.end()
rfs.on('finish', e => {
	console.log('end')
})
```

```javascript
//读
var fs = require('fs')
var data = '';
var rfs = fs.createReadStream('out.txt')
rfs.setEncoding('UTF8')
rfs.on('data', e => {
	data += e
})
rfs.on('end', e => {
	console.log(data)
})
```

```javascript
//交换 将in.txt内容读取且传入新创建的out.txt，如果存在out则无效
var fs = require('fs')
var data = '';
var rfs = fs.createReadStream('in.txt')
var wfs = fs.createWriteStream('out.txt')
rfs.pipe(wfs)
```

```javascript
//链式操作 压缩/解压文件
var fs = require('fs')
var zlib = require('zlib')
//压
fs.createReadStream('xnh.mp4')
	.pipe(zlib.createGzip())
	.pipe(fs.createWriteStream('xnh.mp4.gz'))
//解
// fs.createReadStream('xnh.mp4.gz')
// 	.pipe(zlib.createGunzip())
// 	.pipe(fs.createWriteStream('xnh.mp4'))

```

### 文件系统

> fs这个模块的接口都是异步和同步(sync)两种类型，异步以回调函数接收，同步以返回值接收

```javascript
var fs = require('fs')

//读 文件/目录[readFile/readdir(返回文件名称数组)]
fs.readFile('test.txt', 'utf-8', (err, data) => {
	console.log(data)
})
//var rel = fs.readFileSync('test.txt', 'utf-8') //同步写法

//写 文件/目录[writeFile/mkdir]
 fs.writeFile('str.txt','emmm2333','utf-8',err=>{
	console.log(err)
})

//删 文件/目录[unlink/rmdir]
fs.unlink('./out.txt',err=>{//成功返回null
	console.error(err)
})

//其他 获取真路径realpath 更换名称rename 获取文件信息stat 
```

