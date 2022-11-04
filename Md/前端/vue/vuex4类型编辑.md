## 说一说那让人蛋疼的Vuex与Typescript

> 由于vuex3的设计缺陷，以及vue2对ts的支持微乎其微，导致我们在定义时无法使用ts对其进行优美的类型约束，调用时也不能有相对应的类型提示。但vuex4.0的到来，这都不是梦！本文适用于vuex4.0+和vue3.0+，之前的版本不行。

[Vuex对于TypeScript支持的官方文档](https://next.vuex.vuejs.org/guide/typescript-support.html)

## 1.文件定义

### 普通的Vuex

```javascript
// vuex入口文件 index.js
import { createStore } from 'vuex'
const store = createStore({
    ....
})
export default store
```

```javascript
// 项目入口文件 main.js
import { createApp } from 'vue'
import store from vuex文件路径

const app = createApp(App)
app.use(store)
....
```

```javascript
// 使用
import { useStore } from vuex文件路径
....
```

### Typescript与Vuex

```typescript
// vuex入口文件 index.ts
import { createStore, Store, useStore as baseUseStore } from 'vuex'
import { InjectionKey } from 'vue'
import { RootState, AllState } from './type/root.type' // 导入内容为类型，后面会单独介绍

/** 当前vuex实例key */
export const key: InjectionKey<Store<RootState>> = Symbol()
const store = createStore({
    ....
})
/**
 * 带数据类型的vuex实例
 * @returns vuex根实例
 */
export function useStore<T = AllState>() {
  return baseUseStore<T>(key)
}
export type StoreType = Store<AllState>
```

```typescript
// 项目入口文件 main.ts
import { createApp } from 'vue'
import store, { key as storeKey } from vuex文件路径

const app = createApp(App)
app.use(store, storeKey)
....
```

```typescript
// 使用
import { useStore } from vuex文件路径
....
```

## 2.类型编写

> 个人建议在vuex的入口文件处创建`type`文件夹，用于存放vuex的类型定义，文件名称如：`xx.type.ts`；对于vuex的子模块modules来说，一般也会在vuex的入口文件处创建`modules`文件夹

```typescript
// 类型文件 root.type.ts

/** 此类型为vuex实例的根state类型 */
export interface RootState {
  ...
}
/** 此类型为vuex实例的根modules类型，用于定义vuex子模块类型 */
export interface AllState extends RootState {
  user: UserState
  ...
}
// 上面对应 { modules: { user, ... } }
```

```typescript
// 类型文件 user.type.ts
import { Module } from 'vuex'
import { RootState } from '../type/root.type'

/** user模块的state类型 */
export interface UserState {
 ....
}
/** user模块的类型 */
export type UserModule = Module<UserState, RootState>
```

```typescript
// 子模块 user
import { UserModule } from '../type/user.type'
export default {
    ...
} as UserModule
```

## 3.片尾

细心的选手可能已经发现了，一顿捣鼓之后，只有`state`有了类型提示，其他的`getters、mutations、actions`仍然没有提示，不过好在，定义`getters、mutations、actions`时再也不用去对参数赋值了

