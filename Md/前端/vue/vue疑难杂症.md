## vue疑难杂症

### 一.刷新导致index.html引入的js失效

> 当页面处于二级以上的路由路径时，刷新页面会导致页面加载时引入的js`报错404`，且无法正常加载

解决：

1. 将路由mode切换为hash
2. 在index.html引入js时使用绝对路径

```html
// 在二级路由刷新报错
<script src="./xxx.js"></script>

// 一切正常
<script src="/xxx.js"></script>
```

