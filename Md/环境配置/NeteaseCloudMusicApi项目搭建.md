### NeteaseCloudMusicApi项目搭建（https/域名/跨域）

> NeteaseCloudMusicApi是github上某大佬的一个接口项目，使用网易云的源数据

#### 基本运行

1. [点击链接](https://github.com/Binaryify/NeteaseCloudMusicApi)下载项目
2. 解压，进入项目目录
3. 在当前文件处打开powersell窗口(快捷键thift+文件夹窗口处右键，其他系统自己百度)
4. 输入`node app.js`，等待项目启动且输出：`server running @ http.... `
5. 此时访问上一步输出的域名即项目搭建成功

#### https/域名配置（此处使用nginx的反向代理功能，使用phpstudy配置）

1. 前往服务器购买平台解析域名(如music.xx.cn)，购买ssl证书并且下载（下载nginx对应的证书）

2. 创建一个nginx服务器（不会的百度），再使用对应软件（phpstudy等）创建网站

3. 找到网站配置文件（nginx/vhosts/域名.conf），打开并且修改如下：

   ```nginx
   listen        443 ssl;
   server_name  music.xx.cn;
   ssl_certificate ssl证书地址（.pem）;
   ssl_certificate_key ssl证书地址（.key）;
   ssl_session_timeout 5m;
   ssl_ciphers ECDHE-RSA-AES128-GCM-SHA256:ECDHE:ECDH:AES:HIGH:!NULL:!aNULL:!MD5:!ADH:!RC4;
   ssl_protocols TLSv1 TLSv1.1 TLSv1.2;
   ssl_prefer_server_ciphers on;
   #如果有 root配置项，则删除其整行
   location / {
   	proxy_pass 代理域名，改为项目运行时的地址;
       ....
   }
   ```

4. 然后使用域名访问`https://域名`测试

#### 跨域

找到项目根目录下的app.js文件的对应位置并修改

```javascript
const app = express()

//添加内容
app.all('*', function(req, res, next) {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Headers', 'Content-Type');
	res.header('Access-Control-Allow-Methods', '*');
	res.header('Content-Type', 'application/json;charset=utf-8');
	next();
});

app.use((req, res, next) => {....
```

