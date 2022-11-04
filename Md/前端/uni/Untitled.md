## 使用规范

- 不要使用通配符*，元素选择器名称有对应的变化（最好不使用元素选择器），page元素相当于body
- 如果要考虑老旧运行平台，请勿使用太新的css属性
- 非H5端部分原生组件(video等)会高于前端组件，如果要遮挡这类，请使用cover-view组件
- 停止使用宿主对象，如window、document等，大部分环境没有此类对象
- 请勿在组件实例上书写style属性
- 针对某些端的动态视口高度问题（如移动端chrome的导航），可使用css变量--window-top` 和 `--window-bottom
- 为了区分自定义组件，请对其名字增加固定前缀，如`aw-view`
- 部分小程序的自定义组件会在渲染时多一层节点壳，写样式时需注意隔离问题
- components下根据指定格式创建的组件为自动引入的（如 components/aw-icon/aw-icon.vue）
- 内置了一套事件总线，在全局uni对象上 
- rpx的比例计算（px转rpx），`uni默认总宽750rpx * 设计元素宽px / 设计窗口宽px`



## v3特性

- 页面可通过props来接收页面query参数



## vue使用规范

- v-show不适用于display为flex的节点
- ref只支持组件，不支持节点



## nvue规范（偏向高性能的页面文件）

[nvue使用场景](https://uniapp.dcloud.net.cn/tutorial/nvue-outline.html#适用场景)

- 文字内容只能在text标签下使用，且只有其存在字体大小和颜色
- 不能使用百分比和媒体查询



## 性能优化

[uni性能优化篇](https://uniapp.dcloud.net.cn/tutorial/performance.html)