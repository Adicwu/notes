#### 1）.监听子组件的生命周期函数并执行对应函数

```vue
<child-comp @hook:mounted="someFunction" />
```

#### 2）.在生命周期中调用其他生命周期函数

```javascript
mounted () {
	this.$on("hook:beforeDestroy", () => {})
}
```

#### 3）.在组件初始化时执行watch

```javascript
watch: {
    title: {
		immediate: true,
		handler(newTitle, oldTitle) {}
    }，
    //如果监听对象是对象中的属性，则如下'title.center'；深度监听则使用deep
}
```

#### 4）.可变动的@事件

```javascript
<aButton @[someEvent]="handleSomeEvent()" />
...
data(){
	return{
		someEvent: 'click'
    }
},
methods: {
	handleSomeEvent(){}
}  
...
```

#### 5）.自定义v-model

```javascript
export default {
	model: {
		event: 'change',
		prop: 'checked'  
	}
}
```

#### 6）.动态切换的组件

```vue
<transition enter-active-class="animated slideInLeft" leave-active-class="animated slideOutRight">
    <keep-alive>
		<div :is="comp"></div>
	</keep-alive>
</transition>
```

#### 7）.定义vue对象上的全局方法

```javascript
//toolfunc.js定义
export default {
	install(Vue, options) {
		Vue.prototype.says = function(str) {
			console.log('str')
		}
	}
}

//main.js导入
import toolfunc from './toolfunc.js'//路径自己改
Vue.use(toolfunc)

//.vue中使用，因为是挂载到Vue原型上的方法，所以可以直接使用
this.says('lll')
```

#### 8）.可拆分的父路由

> 将本来十分臃肿的routes数组拆分为很多个单文件，定义文件和单文件同一目录

**router定义文件中设置自动引入，路由文件格式为xxx.routes.js**

```javascript
const routerList = []
function importAll(routerArr) {
	routerArr.keys().forEach(key => {
		routerList.push(routerArr(key).default)
	})
}
importAll(require.context('.', true, /\.routes\.js/))//路径自己配置
Vue.use(VueRouter)

//原本的臃肿路由简化为以下
const routes = [...routerList]
```

**单个父路由配置如下**

```javascript
const fa = () => import('xxx')
const child = () => import('xxx')
export default {
	path: '/fa',
	component: fa,
	children: [{
		path: 'child',
		component: child,
	}, ]
}
```

#### 9）.自动全局引入组件

**创建文件GlobalComps.js，并在main.js中import，内容如下**

```javascript
import Vue from 'vue'
const changeStr = str => str.charAt(0).toUpperCase() + str.slice(1)
//路径自己设置，需要全局导入的组件放在对应路径下
const requireComponent = require.context('../components/Global', false, /\.vue$/)
requireComponent.keys().forEach(fileName => {
	const config = requireComponent(fileName)
	const componentName = changeStr(
		fileName.replace(/^\.\//, '').replace(/\.\w+$/, '')
	)
	Vue.component(componentName, config.default || config)
})
```

#### 10）.全局bus

> 常用于跨组件的单一方法调用，组件层级无影响

**创建文件bus.js，并在main.js中导入，内容如下**

```javascript
const install = (Vue) => {
	const Bus = new Vue({
		methods: {
			on(event, ...args) {
				this.$on(event, ...args);
			},
			emit(event, callback) {
				this.$emit(event, callback);
			},
			off(event, callback) {
				this.$off(event, callback);
			}
		}
	})
	Vue.prototype.$bus = Bus;
}
export default install;
```

**导入**

```javascript
import Bus from './Bus'
Vue.use(Bus)
```

**使用**

```javascript
//被调用方法的组件A
mounted() {//创建
    //第一个参数，派发的事件名称；第二参数，派发的对应方法
	this.$bus.on('open', this.open);
},
beforeDestroy() {//销毁
	this.$bus.off('open');
},

//调用组件A方法的组件B
this.$bus.emit('open')
```

#### 11）.作用域插槽

> 用于slot作用域传值

**子组件**

```vue
//组件名 LazyLoad
<template>
	<div class="lazyload">
		<slot name="contain" :curdata="currentlist"></slot>//curdata为传入插槽的属性
	</div>
</template>
```

**父组件**

```vue
//alldata为定义在父组件的值
<LazyLoad :data="alldata">
	<template #contain="{ curdata }">//使用数组结构将所有传入contain插槽的值解构获取
		//在这里使用返回值		
	</template>
</LazyLoad>
```

#### 12）.全局小型vuex，observable

**创建文件LVuex.js，并在需要使用的地方导入，内容如下**

```javascript
import Vue from 'vue'
export const lVuexStore = Vue.observable({
    counts: 0
})
export const lVuexMuations = {
    setCount(val){
        lVuexStore.counts = val
    }
}
```

**导入**

```javascript
import { lVuexStore, lVuexMuations } from 'xx/LVuex'
```

**使用**

```javascript
//lVuexStore的内容放到computed中，因为异步
computed: {
    counts(){
        return lVuexStore.counts
    }
}
//lVuexMuations的内容放到methods中，因为作用域
methods: {
    setCount: lVuexMuations.setCount
}
```

#### 12）.修饰器(装饰器)Decorator

> 应付一些外层嵌套函数，如节流防抖、对话框等，相当于在函数外层嵌套一层处理函数

```javascript
//创建Decorator.js文件
import { throttle } from 'lodash'//使用lodash提供的函数，当然可以自己写，注意指向问题
export const throttles = function (wait = 300, options = {}) {
    //Decorator携带三个参数：target被挂载对象、name被挂载的方法名称、descriptor被挂载的属性
    return function (target, name, descriptor) {
        descriptor.value = throttle(descriptor.value, wait, options)
    }
}
```

```javascript
//在vue实例中使用
import { throttles } from './Decorator.js'
export default{
	methods:{
        @throttles(300)//支持多个修饰器
        resize(){}
    }
}
```

#### 13）.methods中使用自己创建的节流防抖函数

> 由于vue模板编译的问题，直接定义的闭包防抖节流不能直接使用

```javascript
function debounce(fn, delay) { //节流同理
	let timer = null;
	return function() {
		if (timer) clearTimeout(timer);
		timer = setTimeout(() => { //改变this指向
			fn.apply(this, arguments);
		}, delay)
	}
}
new Vue({
	el: '#app',
	methods: {
		test: debounce(function() {
			console.log(this)
		}, 500)
	}
})
```

