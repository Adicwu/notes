## Pinia，完全版的vue全局状态管理（vuex的代替者）

> pinia由vue核心团队中的成员所开发，尤其针对于vue3中的组合式api概念。pinia拥有更为完整的ts类型推断与模块的独立性，相当于vuex来说，也有这具大的简化操作
>
> 本篇内容配合vue3以及ts对其进行基础讲解

[官方文档](https://pinia.vuejs.org/)

### 一.安装

```shell
yarn add pinia
# or with npm
npm install pinia
```

入口文件中声明`main.ts`

```typescript
import { createApp } from 'vue'
import { createPinia } from 'pinia'

const app = createApp(App)
app.use(createPinia())
```

### 二.使用

#### 仓库声明使用

```typescript
/**
 * 声明
 * pinia不同于vuex，他不再需要手动放置到一个对象，而是类似于组合式api，其会自动挂载到全局，且各仓库不会互相影响
 * 注意，pinia拥有完整的ts类型推断，所以无需手动配置类型
 */
export const useStore = defineStore(仓库key值, {
  // ....
})
```

```typescript
// 使用
import { useStore } from '...'
export default defineComponent({
  setup() {
    const store = useStore()
    // ....
  }
})
```

#### 具体语法

```typescript
// 定义

// 注意，由于state、getters公用一个空间，故命名切勿相同
export const useStore = defineStore('store', {
  // state 状态属性
  state: () => {
    return {
      age: 1,
      name: 'adic',
      favs: ['anime', 'music']
    }
  },
  // getters 计算属性
  getters: {
    // age: (state) => state.age + 1 错误写法
    newAge: (state) => state.age + 1,
    /**
     * 当需要使用getters中的信息(newAge)时，需要使用this来获取
     * 注意，由于设计局限性，这里使用到的state中的属性(name)无法获取其类型推断，需要自己做类型处理
     */
    info(): string {
      return this.newAge + this.name
    },
    /**
     * 继承于传统异能（vuex、vue的历代骚操作）
     * 理论上getters上的属性不能传入参数，所以当我们遇见此需求时，需要返回一个函数，进行二次处理
     * 当然，此操作会导致此属性的最终结果不再进行缓存处理（在返回前的操作仍然会进行缓存），只会易于代码阅读
     */
    fav: (state) => {
      const fullName = state.name + 'wu' // 会被缓存
      return (index: number) => fullName + state.favs[index] // 不会被缓存
    }
  },
  // 方法属性，此属性内部成员无需区分同步异步，请自由发挥
  actions: {
    show() {
      this.age++
      console.log(this.newAge)
    }
  }
})
```

```typescript
// 使用
const store = useStore()

// 不同于vuex，pinia中定义的属性可以直接使用、修改，使用时不需要任何多余前缀，也不需要指定方法进行值的修改
++store.age // 2
store.newAge // 3
store.fav(1) // music
store.show()
```

### 三.辅助功能

#### $reset 仓库状态初始化

```typescript
const store = useStore()
store.$reset()
```

#### $patch 仓库多值修改

```typescript
const store = useStore()
// 普通修改
store.age = 80
// 多值修改
store.$patch({
  age: 1,
  name: 'jack'
})
// 复杂多值修改
store.$patch((state) => {
  state.list.push(1, 3)
  state.age = 28
})
```

#### $subscribe 状态监听

> 注意，此监听类似于watch，是存在于定义的空间的。也就是说，如果定义在组件内部，当组件销毁时，此监听也会销毁，如果需要常驻，则需要配置detached

```typescript
const store = useStore()
// mutation 触发源信息
// state 新数据
store.$subscribe(
  (mutation, state) => {
    console.log(mutation, state)
  },
  {
    detached: true // 是否常驻，默认为false
  }
)
```

#### $onAction 方法触发监听

暂时没想到场景，故不做介绍，有兴趣执行前往查看

[pinia-onAction ](https://pinia.vuejs.org/core-concepts/actions.html#subscribing-to-actions)