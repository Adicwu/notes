### 一. 一些小技巧

#### 频繁的.value语法优化

> 将最外部的变量统一到一个reactive里面去，在暴露时再使用toRefs将其转换为普通依赖，方便模板使用

```javascript
setup(){
	const state = reactive({
        visible: false,
        list: [],
        keyword: ''
    })
    return {
        ...toRefs(state)
    }
}
```



#### 可以减少的操作

```javascript
const a = ref('1233')

// const b = isRef(a) ? a : ref(a) // bad

const b = ref(a) // good
```

```javascript
const a = ref('1233')

// bad
// const obj = reactive({ 
//     get b(){
//         return a.value
//     }
// })

// good
const obj = reactive({
    b: a
})
```



### 二. 使用更合适的组合式API

#### 普通的值类型，如boolean\number\string等，使用 `ref`

> 注意，如果使用ref定义对象或数组时，vue会将其使用reactive定义

```javascript
const aa = ref(0)
const bb = ref(false)
const cc = ref('hellow')
```



#### 数组，使用 `shallowRef`

> 浅层的ref数据监听响应；适用于第三方实例接收或请求数据接收

```javascript
const aa = shallowRef([
	{
		name: 123
	}
])

aa.value[0].name = 1333 // 不会触发响应
aa.value = [{ name: 1333 }] // 触发响应
```



#### 复杂对象，使用 `reactive`

```javascript
const aa = reactive({
    job: {
        main: 'web',
        accessary: 'music'
    },
    age: 18
})
```



#### 简单对象，使用 `shallowReactive`

> 注意，如果使用shallowReactive定义了多层的对象，那么只有根层对象具有响应，这也是shallowReactive与reactive的区别

```javascript
const aa = reactive({
    age: 18
})
```



#### 监听值变化，并且在视图更新后执行，使用`watchPostEffect`

> watch的回调默认是在视图更新前执行的；如果需要在watch中获取新的dom信息，则需要定义flush属性，或者使用watchPostEffect

```javascript
watch(source, callback, {
  flush: 'post'
})

watchPostEffect(callback)
```



#### 响应锁定，使用`markRaw`

> 此方法将一个对象标记为不可被代理，并返回对象本身；适用于第三方类实例或vue组件对象

```javascript
import videojs from 'video.js'

const its = shallowRef(null)
its.value = markRow(videojs(el, {}))
// 尽管shallowRef已经确定了its的浅响应规则，但仍不能控制后续新变量为its.value套壳时的响应，所以需要从根源将其videojs实例进行响应锁定，具体问题如下
```

**特性如下**

```vue
<template>
  <div> {{ aa.job.web.year }} </div>
</template>

<script lang="ts" setup>
import { markRaw, ref, shallowRef } from 'vue'

// 如果使用markRaw包裹pre对象，则aa的year在变化时则不会更新
const pre = { 
  name: 'adic',
  job: {
    web: {
      year: 3
    }
  }
}

const itx = shallowRef(pre)

const aa = ref(itx.value)

setTimeout(() => {
  aa.value.job.web.year = 4
  console.log(aa) // 数据变化，视图更新
}, 1000)
</script>
```



#### 仓库数据，使用`effectScope`

> 集中管理，一次性去除所有响应