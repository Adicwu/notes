> 在vue3中，由于setup的大量使用（导致this难以获取），且this.$children的删除，导致父获取子组件变得麻烦。

*ps:本文思路解析源自于vant3源码以及网上思路，源码地址如下*

[vant3对应源码地址](https://github.com/youzan/vant/tree/dev/packages/vant-use/src/useRelation)

### 0.需求

> 为什么会有这种需求？为什么不通过ref依赖的形式获取？举个例子，轮播组件。对于轮播组件来说，一般都是父子嵌套的关系，且在定义父子组件时完全分离开，利用slot来进行插入，那么此时，问题就来了。在v3中，我们无法通过setup的slot以及对slot进行ref操作来获取内部子组件，但我们仍需要获取子组件的根节点等内容。

### 1.使用

#### 1.1实例

```typescript
// 父组件
import { useChildren } from '你的路径/useRelation/index'
...
setup(){
    // useChildren接受一个key值，返回一个对象：children子组件实例 linkChildren：链接子组件的方法
    const { children, linkChildren } = useChildren('RELATION_KEY')
    linkChildren({
      add: () => console.log('add')
    })
    onMounted(() => {
      console.log(children)
    })
}
...
```

```typescript
// 子组件
import { useParent } from '你的路径/useRelation/index'
...
setup(){
    // useChildren接受一个key值，这个key值取决于父组件定义的key值
	const { parent, index } = useParent('RELATION_KEY')
    parent.add()
    index.value // 当前组件索引
}
...
```

#### 1.2文档

**useParent返回值** 

| 参数   | 说明                                         | 类型          |
| ------ | -------------------------------------------- | ------------- |
| parent | 父组件提供的值                               | *any*         |
| index  | 当前组件在父组件的所有子组件中对应的索引位置 | *Ref<number>* |

**useChildren返回值**

| 参数         | 说明                             | 类型                        |
| ------------ | -------------------------------- | --------------------------- |
| children     | 子组件实例列表                   | *ComponentPublicInstance[]* |
| linkChildren | 向子组件提供值的方法，链接子组件 | *(value: any) => void*      |

### 2.原理分析

> 以provide/inject为传递基础，在子组件中调用父组件的方法，然后将子组件自身实例传入方法，再通过父组件的方法将其保存到父组件自身

#### 1.1 useParent

```typescript
export function useChildren<
  Child extends ComponentPublicInstance = ComponentPublicInstance
> (key: string | symbol): {
  children: Child[],
  linkChildren: (value:any)=>void
} {
  const publicChildren: Child[] = reactive([])
  const internalChildren: ComponentInternalInstance[] = reactive([])
  const parent = getCurrentInstance()! // 获取当前实例

  const linkChildren = (value?: any) => {
    // 定义link\unlink方法，将传入实例放入\移除
    const link = (child: ComponentInternalInstance) => {
      if (child.proxy) {
        internalChildren.push(child)
        publicChildren.push(child.proxy as Child)
        ....
      }
    }

    const unlink = (child: ComponentInternalInstance) => {
      const index = internalChildren.indexOf(child)
      publicChildren.splice(index, 1)
      internalChildren.splice(index, 1)
    }

    // 将链接方法、子组件实例以及传入内容注入
    provide(key, {
      link,
      unlink,
      children: publicChildren,
      internalChildren,
      ...value
    })
  }

  return {
    children: publicChildren,
    linkChildren
  }
}

```

#### 1.2 useParent

```typescript
export function useParent<T> (key: string | symbol): {
  parent: any;
  index: Ref<number>
} {
  const parent = inject<ParentProvide<T> | null>(key, null) // inject接收注入内容

  if (parent) {
    const instance = getCurrentInstance()!
    const { link, unlink, internalChildren, ...rest } = parent

    link(instance) // 进行链接 

    // 在生命周期销毁前删除父组件中的子组件实例  	
    onUnmounted(() => {
      unlink(instance)
    })

    const index = computed(() => internalChildren.indexOf(instance)) // 计算当前索引值

    return {
      parent: rest,
      index
    }
  }

  return {
    parent: null,
    index: ref(-1)
  }
}
```

