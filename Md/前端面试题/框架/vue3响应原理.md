[原视频：Vue 3 Reactivity - Vue 3 Reactivity | Vue Mastery](https://www.vuemastery.com/courses/vue-3-reactivity/vue3-reactivity/)

> 本文为vue3响应式课程视频的笔记，请先具备以下技能后阅读：Vue3 WeakMap\Map\Set Proxy

### 一. 依赖收集触发的实现(track\trigger WeakMap\Map\Set)

> 依赖的雏形为一种三层结构，从内到外分为：根对象->根对象的属性->根对象的属性对应的事件集

```javascript
// 收集列表 根对象-子属性-事件集
const targetMap = new WeakMap()
// 伪触发事件
const effect = () => {}

/**
 * 收集器
 * @param {Object} target 根对象
 * @param {String} key 子属性名称
 */
function track(target, key) {
	// 判断并 创建/获取 属性对应的事件集
	let depsMap = targetMap.get(target)
	if (!depsMap) {
		targetMap.set(target, depsMap = new Map())
	}
	let dep = depsMap.get(key)
	if (!dep) {
		depsMap.set(key, dep = new Set())
	}

	// 将事件放入 属性对应的事件集
	dep.add(effect)
}

/**
 * 触发器
 */
function trigger(target, key) {
	const depsMap = targetMap.get(target)
	if (!depsMap) return;
	const dep = depsMap.get(key)
	if (dep) {
		dep.forEach(effect => effect())
	}
}
```



### 二. 对象代理reactive(proxy/reflect)

```javascript
/**
 * @param {*} target 被代理对象
 */
function reactive(target) {
	// 使用Proxy代理对象，进行get/set拦截
	return new Proxy(target, {
		get(target, k, rec) {
			// 收集
			track(target, k)
			// 执行get原有的默认操作
			return Reflect.get(target, k, rec)
		},
		set(target, k, v, rec) {
            const oldV = target[k]
			// 执行set原有的默认操作（需要优先执行，不然触发器无法获取最新的数据）
			const res = Reflect.set(target, k, v, rec)
			
			if (oldV !== v) {
				trigger(target, k)
			}
			
			return res
		}
	})
}
```


**实验一下**

```javascript
const aa = reactive({
	p: 5,
	q: 2
})
let total = 0
const effect = () => {
	console.log('re', aa);
	total = aa.p * aa.q
}
effect()
console.log(total) // 10
aa.q = 5
console.log(total) // 25
```



### 三. 事件收集与值代理ref

#### 事件收集

> 之前的代码中，代理属性的事件effect为伪代码，会导致只有一个对应的effect，接下来我们将其替换为正规格式

首先，我们修改 `const effect = () => {}` 方法，将其实现为一个属性对应多个`effect`

```javascript
// 当活动中的effect事件
let activeEffect = null

/**
 * 事件收集器
 * @param {*} eff 事件
 */
function effect(eff) {
	activeEffect = eff
	// 由于eff内部会用到代理的对象，所以执行时会触发track收集eff
	activeEffect()
	// 代理结束，清空
	activeEffect = null
}
```

接下来，我们修改`track`

```javascript
function track(target, key) {
	if (activeEffect) { // 增加判断，当前是否存在需要收集的对应事件 
		let depsMap = targetMap.get(target)
		if (!depsMap) {
			targetMap.set(target, depsMap = new Map())
		}
		let dep = depsMap.get(key)
		if (!dep) {
			depsMap.set(key, dep = new Set())
		}

		dep.add(activeEffect) // 收集活动中的事件
	}
}
```

#### 值代理

```javascript
/**
 * @param {*} v 被代理的值
 */
function ref(v) {
	const r = {
		set value(newV) {
			if (newV !== v) {
				(v = newV)
				trigger(r, 'value')
			}
		},
		get value() {
			track(r, 'value')
			return v
		}
	}
	return r
}
```



**实验一下**

```javascript
const aa = reactive({
	p: 5,
	q: 2
})
let total = 0
let saleTotal = ref(0)

effect(() => {
	saleTotal.value = aa.p * 0.8
})
effect(() => {
	total = saleTotal.value * aa.q
})

console.log(total, saleTotal.value) // 8 4
aa.q = 5
console.log(total, saleTotal.value) // 20 4
aa.p = 10
console.log(total, saleTotal.value) // 40 8
```



### 四. 计算属性computed

```javascript
function computed(getter) {
	const res = ref()
	effect(() => res.value = getter())
	return res
}
```



**实验一下**

```javascript
const aa = reactive({
	p: 5,
	q: 2
})
const saleTotal = computed(() => aa.p * 0.8)
const total = computed(() => saleTotal.value * aa.q)

console.log(total.value, saleTotal.value) // 8 4
aa.q = 5
console.log(total.value, saleTotal.value) // 20 4
aa.p = 10
console.log(total.value, saleTotal.value) // 40 8
```



### 完整的代码

```javascript
// 收集列表 根对象-子属性-事件集
const targetMap = new WeakMap()
// 当前触发的effect事件
let activeEffect = null

/**
 * 事件收集器
 * @param {*} eff 事件
 */
function effect(eff) {
	activeEffect = eff
	// 由于eff内部会用到代理的对象，所以执行时会触发track收集eff
	activeEffect()
	// 代理结束，清空
	activeEffect = null
}

/**
 * 收集器
 * @param {Object} target 根对象
 * @param {String} key 子属性名称
 */
function track(target, key) {
	if (activeEffect) {
		// 判断并 创建/获取 属性对应的事件集
		let depsMap = targetMap.get(target)
		if (!depsMap) {
			targetMap.set(target, depsMap = new Map())
		}
		let dep = depsMap.get(key)
		if (!dep) {
			depsMap.set(key, dep = new Set())
		}

		// 将事件放入 属性对应的事件集
		dep.add(activeEffect)
	}
}

/**
 * 触发器
 * @param {Object} target
 * @param {Object} key
 */
function trigger(target, key) {
	const depsMap = targetMap.get(target)
	// console.log(depsMap);
	if (!depsMap) return;
	const dep = depsMap.get(key)
	if (dep) {
		dep.forEach(effect => effect())
	}
}

/**
 * @param {*} target 
 */
function reactive(target) {
	// 使用Proxy代理对象，进行get/set拦截
	return new Proxy(target, {
		get(target, k, rec) {
			// 收集
			track(target, k)
			// 执行get原有的默认操作
			return Reflect.get(target, k, rec)
		},
		set(target, k, v, rec) {
			const oldV = target[k]
			// 执行set原有的默认操作（需要优先执行，不然触发器无法获取最新的数据）
			const res = Reflect.set(target, k, v, rec)

			if (oldV !== v) {
				trigger(target, k)
			}

			return res
		}
	})
}

/**
 * @param {*} v 被代理的值
 */
function ref(v) {
	const r = {
		set value(newV) {
			if (newV !== v) {
				(v = newV)
				trigger(r, 'value')
			}
		},
		get value() {
			track(r, 'value')
			return v
		}
	}
	return r
}

function computed(getter) {
	const res = ref()
	effect(() => res.value = getter())
	return res
}
```