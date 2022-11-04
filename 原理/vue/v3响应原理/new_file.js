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
		dep.forEach(ef => ef())
	}
}

/**
 * @param {*} target 
 */
function reactive(target) {
	// 使用Proxy代理对象，进行get/set拦截
	return new Proxy(target, {
		get(t, k, rec) {
			// 收集
			track(t, k)
			// 执行get原有的默认操作
			return Reflect.get(t, k, rec)
		},
		set(t, k, v, rec) {
			const oldV = t[k]
			// 执行set原有的默认操作（需要优先执行，不然触发器无法获取最新的数据）
			const res = Reflect.set(t, k, v, rec)

			if (oldV !== v) {
				trigger(t, k)
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
		get value() {
			track(r, 'value')
			return v
		},
		set value(newV) {
			if (newV !== v) {
				(v = newV)
				trigger(r, 'value')
			}
		},
	}
	return r
}

function computed(getter) {
	const res = ref()
	effect(() => res.value = getter())
	return res
}


const aa = reactive({
	p: 5,
	q: 2
})
let saleTotal = computed(() => aa.p * 0.8)
let total = computed(() => saleTotal.value * aa.q)

console.log(total.value, saleTotal.value) // 8 4
aa.q = 5
console.log(total.value, saleTotal.value) // 20 4
aa.p = 10
console.log(total.value, saleTotal.value) // 40 8
