## 其实vue3的组合式api，就这么简单

> 组合式api对于vue2来说可谓颠覆性的改变，他不再使用this，不再推荐使用全局属性（如常见的将axios挂载在入口vue上），也不再有繁琐的钩子大对象（{ methods computed.... }）。取而代之的是将其所有内容通过函数封装为hooks放入setup中。更利于逻辑分离以及代码规范，对ts的支持也更加完善

```javascript
// 以单文件组件举例
import { defineComponent, ref, watch, computed } from 'vue'

export default defineComponent({ // 推荐使用defineComponent创建，更有利于类型和原型获取
    name: 'xx',
    setup(props,{ emit }){
        const aa = ref(1)
        const bb = computed(()=> aa.value + 1)
        watch(aa,()=> {
            // do something...
        })
        // 注意，一切需要在template和原型中使用的内容，必须return出去
        return {
            aa
        }
    }
})
```

### 一.reactive

> 深响应，适用于对象结构

```javascript
const xx = reactive({
    lucy: {
        age: 18
    },
    type: 1
})

xx.lucy // 获取
xx.type = 2 // 赋值
```

```javascript
// 因为其内部常常作为一个对象，故其支持对象的扩展操作，如下
const aa = reactive({
   get jack() {
     return 1
   }
})
```

### 二.ref/unref/toRef/toRefs/isRef/customRef/shallowRef/ triggerRef

> 浅响应。由于此处覆盖内容较多，故只取常用的几个介绍，详情请见官方地址，如下

[Ref官方介绍](https://v3.cn.vuejs.org/api/refs-api.html#ref)

```javascript
/*
 * ref
 * 适用于浅数据，如number string boolean等单一类型，因为其不会对深层做响应监听，如 [{name: 'adic'}]，如果name
 * 发生变化，视图也不会更新。
 */
const aa = ref(1)
aa.value // 获取
aa.value = 2 // 赋值

// 由上可以看出，ref创建的内容相当于把其本身值新创建了一个对象，类似于 { value: 1 }。一开始这种写法会相当不适应，以我个人的理解来说，这是为了区分普通类型和复杂类型，也更利于proxy去监听对象。顺带一提，这个问题已经被推上提案，后续会针对出问题进行优化更改
```

```javascript
/*
 * unref
 * 返回响应依赖ref的值，注意，只是值
 */
const aa = ref(1)
const bb = unref(aa)
aa // 获取
```

```javascript
/*
 * toRef
 * 以响应式源对象上的某个属性，单独生成一个新ref，且两者为同源
 */
const state = reactive({
    count: 1
})
const stateCount = toRef(state, 'count')

stateCount.value++ // state.count === stateCount.value === 2
state.count++ // state.count === stateCount.value === 3
```

```javascript
/*
 * toRefs
 * 以响应式源对象为源，单独生成一个新ref集合，且两者为同源
 */
const state = reactive({
    count: 1
})
const newState = toRefs(state)

newState.count.value++ // state.count === newState.count.value === 2

/*---*/
// 此属性常用于props的响应解构
export default defineComponent({ // 推荐使用defineComponent创建，更有利于类型和原型获取
    props: {
      count: Number,
      name: String  
    },
    setup(props){
        // const { count, name } = props // 直接解构会失去其响应性
        const { count, name } = toRefs(props)
    }
})    
```

```javascript
/*
 * isRef
 * 判断一个值是否为ref对象
 */
isRef(1) // false
isRef(ref(2)) // true
```

```javascript
/*
 * customRef
 * 自定义ref，处理其响应中的get/set操作
 */
customRef((track, trigger) => {
    return {
      get() {
       	// do something
        track()
        return value
      },
      set(newValue) {
       	// do something
       	value = newValue
      	trigger()
      }
    }
  })
```

### 三.computed

```javascript
const aa = ref(1)
const bb = computed(()=> aa.value + 'ms')

// 和vue2的computed钩子一样，也支持get和set
const cc = computed({
    get(){
        return aa.value
    },
    set(newValue){
        typeof newValue === 'number' && (aa.value = newValue)
    }
})

cc.value // 获取
```

### 四.watch/watchEffect

[watchEffect文档](https://v3.cn.vuejs.org/guide/reactivity-computed-watchers.html#watcheffect)

```javascript
/**
 * watch
 * 针对性监听
 */

//....
props:{
  mode: Number  
},
setup(props){
    const $route = useRoute()
    const aa = ref(1)
    const bb = ref('jack')
    const cc = reactive({
        age: 18
    })
    const dd = computed(()=> aa.value + bb.value)
    
    // ref监听
    watch(aa, (newVal, oldVal) => {
        //do something...
    })
	// computed监听
    watch(dd, (newVal, oldVal) => {
        //do something...
    })
    // 路由监听
    watch(()=> $route.params, (newVal, oldVal) => {
        //do something...
    })
    // reactive监听。deepCopy为深拷贝函数
    watch(()=> deepCopy(cc), (newVal, oldVal) => {
        //do something...
    })
    // reactive属性监听
    watch(()=> cc.age, (newVal, oldVal) => {
        //do something...
    })
    // props监听
    watch(()=> props.mode, (newVal, oldVal) => {
        //do something...
    })
    // 多源监听。此时的newVal/oldVal也是数组。注意，在同一个函数体内更改多个监听源时，watch只会触发一次
    watch([aa, bb], (newVal, oldVal) => {
        //do something...
    })
    // 监听参数
    watch(aa, ()=> {},{
     	immediate: true, // 初始化监听，默认为false
        deep: true, // 深度监听，默认为false
        flush: true, // 多源触发，默认为false。此选项为真时会导致在同一个函数体内更改多个监听源时，watch会触发多次
        //....
    })
}

// 如你说见，监听的格式如果为浅响应类型（ref computed等），则直接监听；如果为深响应类型（props $route reactive等），则需要创建一个方法并返回实际内容
```

```javascript
/**
 * watchEffect
 * 自适应多源监听。自动收集内部使用的依赖，任意一个变化都会触发监听。注意，此监听会在初始化时执行一次
 */

//....
setup(){
    const $route = useRoute()
    const aa = ref(1)
    const cc = reactive({
        age: 18
    })
    const dd = computed(()=> aa.value + bb.value)
    
   	const watcher = watchEffect(() => {
        $route
        aa.value
        cc
        dd.value
        //do something...
    })
    
    watcher() // 销毁监听
}
```

### 五.个人使用建议

1. 由于响应式依赖在一开始创建时就不会改变源，所以在声明时请使用`const`（细心的童鞋应该可以看出实例代码全是const）

2. 如果只是简单的静态对象，请不要使用组合式api，直接`return`即可

3. 不要轻易使用watch，watchEffect更加少用。本身需要监听变化的业务就少，如果你老是遇见需要watch的地方，那就该考虑是否结构有问题

4. 响应api应该区分使用。普通值类型和不会变化内部的列表，则使用ref；复杂的结构使用reactive

5. 对于不会变化内部的列表数据来说，使用ref来添加响应的同时，也可以使用`Object.freeze`对其内部进行响应移除，能优化部分性能

6. computed计算属性没有表面那么简单，使用时请小心注意逻辑

7. 由于现在组合式api的概念，让我们的代码能更方便的提纯。所以，在用的同时，能够抽离的尽量抽离，不同的业务也要有明确的划分，如下

   ```javascript
   <script>
   function styleModule(){
       const selfStyle ....
       return { selfStyle }
   }
   function bannerMoudle(){
       const banners ....
       const mode ....
       const origin ....
       return { mode, origin, banners }
   }
   //...
   setup(){
       const { banners, ...bannerMoudleArgs } = bannerMoudle()
       const realBanners = computed(()=> banners.map....)
       return {
           realBanners,
           ...bannerMoudleArgs,
           ...styleModule()
       }
   }    
   </script>
   ```

8. 养成hooks的概念。这个东西用react的大佬应该都挺熟悉，实际上vue3的组合式api也是借鉴了这个理念，所以多对公共逻辑进行抽离，如touch的位置获取、事件监听的绑定和自动解绑等等。这个概念在 [v3版本下的vant](https://youzan.github.io/vant/v3/#/zh-CN)  中使用的非常好，其也提供了很多不错的hooks，感兴趣的可以执行进行源码研究 [vant hooks源码](https://github.com/youzan/vant/tree/dev/packages/vant-use/src)

