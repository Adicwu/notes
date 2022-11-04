## 提要

近期修改博客（也就是本站），在新增功能时发现 `在回退页面路由时，之前的页面滚动进度会消失`，对于一个文章博客来说，这一点很不友好，于是有了此文章



## 业务逻辑

在路由切换时，将上一个路由的滚动信息保存到路由对象中，在回退时读取判断是否存在滚动信息，然后执行对应的滚动切换

## 1丶路由修改

在业务逻辑部分已经提出，需要在路由切换时保存信息，而我们不能保证每个页面需要监听的滚动节点都是当前路由的根节点，所以我们需要在路由中定义每个页面的节点名称，如下：

```javascript
// router文件
const routes = [
	.....，
	{
        path: '/essay',
        meta: {
            dom:'#essay' // 在路由的meta中设置页面的滚动节点名称
        },
    }
	......
]
```

## 2丶路由守卫

需要通过监听每次来读取或者设置页面滚动信息，而vue-router中的路由守卫`afterEach`（官方称之为：全局后置钩子）就很适合做这个，如剩下的就是逻辑实现的问题，如下：

```javascript
// router文件
// 保存滚动信息
function saveScrollTop(from) {
	let { dom } = from.meta; // 获取路由中设置的节点信息
	if (dom) {
		let fromDom = document.querySelector(dom);
		let { scrollTop } = fromDom;
		from.meta.scrollTop = scrollTop; // 读取当前滚动并保存到对应的路由meta
	}
}
// 读取设置页面历史滚动
function setScrollTop(to) {
	let { scrollTop, dom } = to.meta; // 获取路由中节点和滚动信息
	if (dom && scrollTop) {
		Vue.nextTick(() => { // 异步处理一下，否则无法获取到节点
			document.querySelector(dom).scrollTop = scrollTop; // 设置页面滚动位置
		})
	}
}
// 全局路由导航
router.afterEach(function (to, from) {
	saveScrollTop(from);
	setScrollTop(to);
})
```

## 留坑

以上情况能满足大部分需求，甚至可修改达到页面缓存效果。但由于页面不可控性，如果指定的滚动节点为自定义异步渲染（动画、v-if\v-show等操作），则会导致滚动无法正常执行