## nginx thinkphp phpstudy_pro配置

> 删除原本项目，如果不需要的话，如果不删除，切记不要使用相同的域名创建nginx下的网站
>

操作：

1. 将thinkphp项目放到 phpstudy_pro 安装目录下的WWW目录下，这里假设项目名称为 Obj

2. 创建项目，域名自己取，不要使用localhost 会重复报错，自己另外取一个，网站地址选择 Obj/public

3. 重启

4. 设置-配置文件-v-hosts.conf，现在点击刚才创建的名称 名字为刚才的 域名 ，打开文件

   ```nginx
   修改 
   location / {
   	index index.html index.htm index.php;
   	autoindex off;			
    }
   
   为
   location / {
   	index index.html index.htm index.php;
   	   #autoindex on;
   	   if (!-e $request_filename) {
   	   rewrite ^(.*)$ /index.php?s=/$1 last;
   	   break;
   	}
   }
   ```

5. 重启nginx服务

------



> 解决vue-router在服务器端运行无法通过指定路由访问，导致404
>

在对应的.conf配置文件中

```nginx
添加
location / {
	root   #;  //这里为自己项目的对应路径
	index  index.html;
	try_files $uri $uri/ @router;
}
location @router {
	rewrite ^.*$ /index.html last;
}
```



### ssl证书配置

> 前言，由于http运行在80端口，而https一般在443端口，所以需要在服务器设置开放443端口

1.nginx配置

1）.找到nginx配置目录，在其目录下的conf目录下创建ssl文件夹，将ssl证书放进去(.pem\.key)

`目录结构为nginx/conf/ssl/`

2）.修改对应.conf文件如下：

```nginx
server{
    listen        443 ssl;
    ssl_certificate  D:/nginx/conf/ssl/XXX.cn.pem; #路径自己修改，使用绝对路径
	ssl_certificate_key  D:/nginx/conf/ssl/XXX.cn.pem; #路径自己修改，使用绝对路径
	ssl_session_timeout 5m;
	ssl_ciphers ECDHE-RSA-AES128-GCM-SHA256:ECDHE:ECDH:AES:HIGH:!NULL:!aNULL:!MD5:!ADH:!RC4;
	ssl_protocols TLSv1 TLSv1.1 TLSv1.2;
	ssl_prefer_server_ciphers on;
}
```



3）.重定向http，使其访问域名时自动跳转https

*在上面修改过的文件内容前添加*

```nginx
server {
	listen 80;
	server_name xxx.com; #自己的项目域名
	rewrite ^(.*)$ https://${server_name}$1 permanent; 
}
```

