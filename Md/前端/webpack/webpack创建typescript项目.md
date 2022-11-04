[原文链接](https://www.jianshu.com/p/4f98662a4ad2)

### 一.初始化webpack项目

1. 新建文件夹，名称为自己`项目名称`，并在其下创建`src`与`public`文件夹
2. 在其根文件夹下打开终端，使用`npm init -y`初始化项目

### 二.依赖安装

修改项目下自动生成`package.json`文件，如下

```json
{
  "name": "adicw-utils", // 此名字为项目名称，随意更改
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "build": ".\\node_modules\\.bin\\webpack --mode development",
    "serve": ".\\node_modules\\.bin\\webpack-dev-server"
  },
  "author": "",
  "license": "ISC",
  "devDependencies": {
    "html-webpack-plugin": "^5.5.0",
    "ts-loader": "^9.3.0",
    "typescript": "^4.6.4",
    "webpack": "^5.72.1",
    "webpack-cli": "^4.9.2",
    "webpack-dev-server": "^4.9.0"
  },
  "dependencies": {
    "@babel/core": "^7.17.10",
    "@babel/preset-env": "^7.17.10",
    "babel-loader": "^8.0.0-beta.0"
  }
}
```

在终端执行 `npm i` 指令安装依赖

### 三.项目基础配置

1.在项目根目录下创建`webpack.config.js`配置文件，并写入下列配置

```javascript
const path = require('path');  //nodejs内置模块
const HtmlWebpackPlugin = require('html-webpack-plugin');
module.exports = {
  mode: 'development',
  /**
   * 入口
   */
  entry: './src/index.ts',
  resolve: {
    extensions: ['.tsx', '.ts', '.js']
  },
  /**
   * 出口
   */
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      }
    ]
  },
  plugins: [new HtmlWebpackPlugin({
    filename: 'index.html',
    template: __dirname + "/public/index.html"
  })],
}
```

2.在项目根目录下创建`tsconfig.json`配置文件，并写入下列配置

```
{
  "compilerOptions": {
    "outDir": "./dist/",
    "noImplicitAny": true,
    "module": "es6",
    "target": "es5",
    "jsx": "react",
    "allowJs": true
  }
}
```

3.在`public`文件夹下创建`index.html`文件，作为项目入口页面

4.在`src`文件夹下创建`index.ts`文件，作为项目入口js

### * 题外，将其包发布到自己的npm

1. 项目根目录下打开终端，并输入`npm adduser`配置个人npm账户

   ```
   // 如果报下列错误，请输入 npm set registry https://registry.npmjs.org/
   Unexpected token ＜ in JSON at position 0 while parsing near ‘＜!DOCTYPE html、＞
   ```

2. 执行`npm publish` 进行代码推送。注意，每次推送都需要刚刚`package.json`中的version属性

