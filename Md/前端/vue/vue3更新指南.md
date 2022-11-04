## vue3初探

官方中文文档地址：[Vue3](https://vue3js.cn/docs/zh/)

### 大型变动

1. 新增组合式api，业务分离更加方便
2. 移除filters（原因：| 语法和位运算冲突，其作用完全可以使用计算属性代替）
3. 一个template可定义多个根节点！
4. v-model语法变化
5. 全局内容改变，移除Vue.use，使用createApp().use代替
6. 自定义指令钩子名称变化，新增**beforeUpdate**、**beforeUnmount**，类似于vue实例
7. 分支`v-if`/`v-else`/`v-else-if`不再需要手动绑定key，会自动生成
8. v-if优先级提升，高于v-for，但由于语法歧义，仍不推荐一起使用
9. watch不再支持`xx.aa`监听写法，请使用computed计算后监听
10. `destroyed/beforeDestroy`生命周期修改为`unmounted/beforeUnmount`.
11. 移除$children

### 新增组件

#### 一.teleport

> 渲染节点选择组件

```javascript
<h1 id="test">h1</h1>
<h2>h2</h2>

<teleport to="#test" :disabled="false"> 
    // 里面的节点，最终将被渲染到#test的标签下;disabled控制是否执行渲染移位
	<a href="">adic</a> 
</teleport>
```

注意：

1. 如果同时使用`teleport`对多个相同的标签添加不同节点内容，则会根据 `先来后到` 在容器内一次渲染
2. 此组件内部只支持一个父节点，超出会被忽视

### 新增钩子

#### 一.emits

> 自定义事件总集，使其更易管理，更加严格，类似于props

```javascript
emits: { // emits是个对象，也可以是个数组，如果是数组，类似于props
	replace: null, // 不进行任何操作
	onbos(key) { // 对传入值进行验证
		return typeof key === "number";
	},
},
methods: {
	add() {
		this.$emit("onbos", "1");
	},
	replace() {
		this.$emit("replace", "1");
	},
},
```

疑惑：

1. 软性限制。如果不符合定义的要求，只会警告，并不会影响方法执行与参数传递，只会在控制台输出一条警告

### 新增样式处理

#### 一.style扩展

```javascript
// ::v-deep() 类似于/deep/
::v-deep(.test) {}
// 相当于
[v-data-xxxxxxx] .test {}
```

```javascript
// ::v-global() 全局样式
::v-global(.xsx){}
// 相当于在全局创建一个.xsx样式
```

### 新增全局

#### 一.provide

> 全局注入

```javascript
// 全局 main
app.provide('name','adic');

// 任意地点
inject: {
  penMal: { // 名字随意
    from: "name",
  },
},
```

### 修改内容

#### 一.v-model

> 语法更新，现在支持多个于一个标签，移除model钩子，让组件通讯更加便捷

```javascript
// parent
<div id="app">
	{{ name }}=={{ age }}
    <Test v-model:name="name" v-model:age="age" />
</div>

data() {
	return {
		name: "adic",
		age: 18,
	};
},
methods: {
	handler(res) {
		console.log(res);
	},
},
```

```javascript
// Test
 this.$emit("update:name", "lucy");
 this.$emit("update:age", 12);
```



> 修饰符，现在可在子组件中检查是否使用了某修饰符

```javascript
// parent
<Test v-model:name.capitalize="name" />

// Test
props: {
	name: String,
	nameModifiers: { // 传入值名称+'Modifiers'
		default: () => ({}),
	},
},
created() {
	console.log(this.nameModifiers); // {capitalize: true}
},
```

#### 二.$nextTick

> vue3进行了全局和内部api重构，现在nextTick不再是原型上的方法，需要导入使用

```javascript
// old 
this.$nextTick...
// new 
import {nextTick} from 'vue'
nextTick...
```

#### 三.全局原型

> 注：vue3中不推荐将自定义内容挂载到全局原型

```javascript
// old
// 声明
Vue.prototype.adic = 'w'
// 在任意钩子中通过this使用
this.adic

//new
app.config.globalProperties.adic = 'w'
// 在任意钩子中通过this使用
this.adic
// 在setup中使用
import { getCurrentInstance } from 'vue'
const { proxy } = getCurrentInstance();
proxy.adic
```

### TypeScript支持

#### 组合式api

```typescript
// 自动判断类型
const num = 0; // 基础类型
const info = computed(()=>....); // 计算属性
const isShow = ref(false); // ref 确定类型

// 手动设置类型
const obj = reactive<{ name:string; }>({ name: 'adic' }); //reactive
const dom = ref<HTMLElement | null>(null); // ref 默认为null 实际上等待dom渲染完成后为节点
```

### 其他提示

1. 在v-for的渲染中，如果源数据被整体替换（地址变化，部分child变换），并不会导致所有渲染重新进行
2. v-for可遍历对象，其返回第一个参数为对象的值，第二个为对象的键，且of可代替in使用
3. @xx支持多方法传递。如：`@click="aa(), bb()"`

### 实验概念

1. 单文件css使用组件中定义的值 `<style vars="{ color }">`
2. 单文件组合api `<script setup>`