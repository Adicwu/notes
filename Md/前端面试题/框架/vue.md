## VUE

#### *.综合

1. vuex和vuerouter都是基于vue的插件，不能脱离vue使用
2. `beforeCreate`之后才能获取到data中的属性
3. vm.$nextTick 可以确保获得 DOM 异步更新的结果
4. Vue 中的数组变更通知，通过拦截数组操作方法而实现
5. patching 算法首先进行同层级比较，可能执行的操作是节点的增加、删除和更新
6. 若 data 中某属性多次发生变化，watcher 仅会进入更新队列一次

#### 单页面spa的优缺点

优点：

- 响应速度快，切换页面不需要刷新浏览器，用户体验好，避免重复渲染
- 对服务器压力较小
- 前后端分离，架构清晰

缺点：

- 第一次加载内容较多，需要特殊处理如按需加载
- 浏览器前进回退由路由管理，需要自己建立堆栈管理
- 由于单页面的原因，seo难度较大

#### v-if 与 v-show

- v-if 为真正意义上的条件渲染，因为其在切换中会摧毁对应的组件，且如果初始化渲染时条件为假，则不作任何操作，直到条件变动

- v-show实际上只是在切换display的属性，只是用户看不见，实际为渲染后的界面

- v-if适合很少改变条件，切换时消耗资源多；而v-show用于频繁切换的地方，切换时消耗资源少


#### 理解vue单向数据流

> 官方的话来说：这样是为了防止子组件意外改变父组件状态，形成难以理解的数据流

因为父组件的值在改变时，会刷新对应的父组件传入的子组件值，如果想在子组件更改父组件的值，则需要$emit派发一个事件，将事件使用v-on绑定到子组件使用时的标签内，再在父组件创建对应方法更改值

#### computed 与 watch

- computed 为计算属性，且有缓存机制，对应的值改变时也会重新计算

- watch 为监听属性，没有缓存，监听到被监听者变换则执行

- computed 更适合于数据计算，因为其有缓存，可以避免不必要的重复计算；watch 更适合处理比较复杂的业务比如异步或大开销操作，可以限制执行频率，设置中间状态


#### 数组改变，vue监测

当直接使用 this.arr.length 或者 this.arr[index] 改变data中的数据时，data会发生改变，但视图层并不会监听到改变，也就不会改变页面渲染内容，对应的解决方法

```javascript
// Vue.set
Vue.set(vm.items, indexOfItem, newValue)
// vm.$set，Vue.set的一个别名
vm.$set(vm.items, indexOfItem, newValue)
//---上面适用于单vue 下面适用于vue-cli ---
// Array.prototype.splice
vm.items.splice(indexOfItem, 1, newValue)
// Array.prototype.splice
vm.items.splice(newLength)
```

#### vue生命周期钩子理解

生命周期也就是vue实例的一个执行过程，从开始创建到结束销毁

- beforeCreate： 创建刚开始，组件的属性生效前
- created：组件创建完成，属性完成绑定，但页面dom还未开始渲染，常用于发送简单单一的请求
- beforeMount：相关的render函数被调用，开始渲染页面
- mounted：页面渲染完成，dom挂载完毕，常用于发送请求、操作dom
- beforeUpdate：数据更新前一步，在虚拟dom打补丁之前
- update：数据完成更新后
- activated： router中的keep-alive专有，组件被激活时调用
- deactivated： router中的keep-alive专有，组件被摧毁时调用
- beforeDestory： 组件销毁前调用，常用于手动摧毁之前的事件监听
- destoryed：组件摧毁后调用

#### 父子组件钩子执行

> 初始化渲染 
>
> 父 beforeCreate -> 父 created -> 父 beforeMount -> 子 beforeCreate  -> 子 created -> 子 beforeMount -> 子 mounted -> 父 mounted

> 子组件更新过程 
>
> 父 beforeUpdate -> 子 beforeUpdate -> 子 updated -> 父 updated

> 父组件更新过程
>
> 父 beforeUpdate -> 父 updated

> 销毁过程
>
> 父 beforeDestroy -> 子 beforeDestroy -> 子 destroyed -> 父 destroyed

#### 父监听子的生命周期

对应的子组件使用标签内 @hook:生命周期名称="触发时执行的方法"

#### keep-alive的了解

他是一个组件，可以使包含的组件处于保留状态，避免重复渲染，一般结合路由与动态组件使用，

提供include（名字匹配的缓存）和exclude（名字匹配的不缓存）两个属性，exclude优先级高些，都支持正则，有两个对应的钩子activated 和 deactivated

原理：他的核心是LRU(Least Recently Used)算法策略；他会为每一个当前渲染的函数增加key，并与之全局cache（队列，前出后进）进行比对，如果存在，则取出渲染并更新其key；如果不存在，则创建key并渲染；他还有一个max属性，用于限制最大的组件缓存数量，如果超出，则会清除最早缓存并没有用到过的组件

#### 为什么组件中的data是函数返回一个对象

因为组件是复用的，且js对象是引用关系，返回一个对象是为了隔离作用域，避免两个组件data相互影响

#### 组件通信

1. props/$emit

2. ref/$children/$parent：当ref在普通标签内时为dom，在组件内时为组件实例；访问修改子组件值；访问修改父组件值

3. $attrs/$listeners：

   $attrs在子组件中接收父组件其被传递且未在子组件中使用props接收的绑定值，除开class与style，可继续将接收的数据v-bind:="$attrs"绑定传递到子组件中的子组件内，使用$attrs获取值

   $listeners在子组件中接收在父组件其被调用使用v-on绑定在上面的非native事件，可继续将接收的事件v-on:="$listeners"绑定传递到子组件中的子组件内，使用$emit('事件名称')调用事件

4. provide/inject：两者配合使用，在父组件中使用provide定义传入值，在子组件中使用inject获取值，可往下一直获取，另外，两者数据并非可响应的，但如果传入一个可监听对象，则可响应

```
provide(){
	return{
		app: this
	}
},
```

5.vuex全局状态管理

6.EventBus总线

7.observable响应式小型vuex

#### vuex

vuex是基于vue开发的一个状态管理模式，其内容为响应式的，每个vuex对应一个store仓库，包括以下五个模块：

- state：数据
- getter：计算属性
- mutation：定义同步函数
- action：定义异步方法
- module：分离出来的子vuex

#### vue-router

**模式：hash、history、abstract**	

- hash：使用url hash值作为路由，支持所有浏览器
- history： 依赖 HTML5 History API 和服务器配置
- abstract ：支持所有js运行环境，包括node，如果没找到api则自动进入此模式

**守卫**

- 全局beforeEach
- 后置afterEach
- 全局解析beforeResolve
- 路由独享beforeEnter

**$router/$route**

- $router是vue-router的实例化对象，包含路由跳转、生命周期函数等
- $route是路由信息对象，每个路由都有一个路由对象，是局部的，包含query、parh、hash等参数

**路由传参**

1. Params：this.$router.push({ name: xxx, params: { xx: 'xxxx' } })，参数不会显示于url，刷新页面消失
2. Query：this.$router.push({ path: xxx, query: { xx: 'xxxx' } })，参数显示于url，刷新页面不消失

#### mvvm

mvvm全称 model-view-viewmodel，由mvc（model-view-controller）演变而来，mvvm实现了双向绑定，也就降低了对dom操作导致的资源消耗，提升开发效率

- model：数据模型，指后端交互逻辑处理，也就是后端api
- view：视图，主要由html、css构成的页面
- viewmodel：视图数据层，作为view和model层的中间站，负责数据处理

#### vue双向绑定原理

双向绑定指视图变化更新数据，数据变化更新视图

1. 使用Object.defineProperty()将对象内设置setter和getter，这样促使给数据赋值时会触发setter
2. 使用解析器解析vue指令，将绑定的内容添加到订阅区，内容变化则执行
3. 实现订阅者，监听对象变化时执行对应的指令
4. 实现订阅器，采用 发布-订阅 设计模式，收集订阅者，管理监听器和订阅者

#### v-model

原理：语法糖写法，相当于`<input type="text" :value="xxx" @input="xxx=$event.value"/>`

**修饰符**

1. .lazy：将监听事件切换为change
2. .number：将输入内容转换为number
3. .trim：过滤首位字符串

#### 事件修饰符

- .stop：阻止冒泡
- .capture：事件捕获
- .native：绑定原生事件
- .once：只执行一次
- .self：仅自身执行
- .prevent：阻止默认事件
- .sync：用于组件传值时更新，配合$emit('update:xxx',xxx)使用
- .passive：提升滚动流畅度

#### 权限控制

1. 动态路由，使用router中的addRoute方法根据情况动态添加路由
2. 路由全局守卫，根据过滤判断
3. v-else-if，组件内判断
4. 使用vue指令定义全局指令在组件内判断
5. 组件内单独判断

#### nextTick原理

将执行的回调放到dom更新完成之后。利用任务轮询的特性，将回调放入非同步队列，利用以下方法（优雅降级）

- setImmediate：类似于计时器，仅ie支持
- MutationObserver：监听指定节点的节点变化
- Promise：正常人都知道
- setTimeout：正常人都知道

最终以一个异步控制器，将所有传入的回调执行

#### 为什么Vue2是单根节点，Vue3则是多根

v2中的设计便是如此，他没有考虑多根，将所有组件以单根为规范；v3则针对这个问题做了处理，比如diff与组件属性设置一类的，可以理解为在多根情况下，会自动给你套一个空节点

#### 为什么vuex区分mutation和action

首先，这是vuex所定义的一个约束（相当于遵守与否看个人），实际上你可以用action替换mutation；这样区分的好处就在于：可以通过devtools有效的追踪数据变化（因为异步改变值往往是很难做snapshot），也可以理解为设计缺陷；现在的pinia整合了两者，是因为重新花了一定时间来整合和提示devtools的支持