### 项目搭建

```powershell
// 安装vue-cli脚手架
npm i @vue/cli -g

// 创建vue项目，具体配置看个人需求
vue create 项目名称
```

```powershell
// 安装electron依赖
vue add electron-builder
```

**如果安装过程较慢，或手动安装electron其他版本时过慢，可尝试下列配置**

```powershell
// powershell
npm config set registry https://registry.npm.taobao.org/
npm config set ELECTRON_MIRROR http://npm.taobao.org/mirrors/electron/
```

然后新建用户全局变量即可。如下所示：
名称为 `ELECTRON_MIRROR`，值为： `http://npm.taobao.org/mirrors/electron/ `。



### 项目运行

`pakeage.json`文件中存在两个执行脚本，自己按需要执行，如下：

1. `"electron:serve": "vue-cli-service electron:serve"`：项目运行
2. `"electron:build": "vue-cli-service electron:build"`：项目打包



### 项目解析

与我们平常生成的`vue`项目相比，根目录的`src`文件夹多出了`background.js`文件，此文件为`electron`的主线程文件（也可以理解为入口文件）



### Electron相关功能

> 以下配置均在background.js文件下操作



#### 隐藏程序边框

```javascript
// 找到文件中的窗口实例化的地方，并修改关键字段如下
new BrowserWindow({
    // .....
    frame: false, // 隐藏默认窗口
})
```

隐藏边框后会导致整体程序无法拖动换位，如果想自己写的节点拥有拖动整体窗口的功能，则需要在对应节点增加`-webkit-app-region: drag;`样式。注意，如果使用此样式，会导致内部节点的点击以及hover等事件失效，如果需要生效，则需要在对应的子节点增加`-webkit-app-region: no-drag;`样式



#### 系统托盘（俗称任务栏的小图标）

[菜单选项配置](https://www.electronjs.org/zh/docs/latest/api/menu-item)

```javascript
import { Tray, app, Menu } from 'electron'
const path = require('path')
const iconPath = path.join(__static, 'android-chrome-192x192.png') // 路径为项目根路径。注意，如果此配置出错，会导致打包安装后程序启动异常

function createTray() {
  const tray = new Tray(iconPath) // 创建托盘，传入参数为图标的图片
  const contextMenu = Menu.buildFromTemplate([ // 创建菜单选项，具体配置请看上方链接
    {
      label: '退出',
      role: 'quit'
    }
  ])

  tray.on('click', showWindow) // 鼠标左键
  tray.setToolTip('xsx') // 鼠标移动到图标上时的提示
  tray.setContextMenu(contextMenu) // 挂载菜单选项
}

// 在app的此生命周期中执行
app.on('ready', async () => {
  createTray() // 注意，此方法需在创建主窗体前执行，如下伪代码
  //... new BrowserWindow
})
```



#### 主线程与组件通讯

```javascript
// background.js
import { ipcMain, BrowserWindow } from 'electron'

// 文件中找到窗口实例化的地方，并修改关键字段如下，为了解决window.require无法访问的问题
new BrowserWindow({
    // .....
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
})

// 创建事件，回调第一个参数为event，其他参数为传入参数
ipcMain.on('mainWindow:open', (_, id) => {
  // ...
})
```

```javascript
// 创建ipc.js
// 用于集中管理触发主线程方法

const electron = window.require('electron')
const { ipcRenderer } = electron

export function useIpc() {
  return {
    openMain: (id: ComicId) => ipcRenderer.send('mainWindow:open', id)
  }
}

```

最终在组件中直接调用即可



#### 单页面多窗口 todo



### 打包

报错请看 [electron-builder打包过程中报错——网络下载篇_onc-virn的博客-CSDN博客_electron打包报错](https://blog.csdn.net/qq_32682301/article/details/105234408)



### 小结

总的来说，这种写法对经常使用`vue-cli`开发的人来说，只需要学习	相关知识就行了，其他的和正常写`vue`没什么差别。有点可惜的是暂时不知道怎么使用`vite`搭建此等项目

