const targetMap = new WeakMap()

let activeEffect = null

function effect(ef) {
	activeEffect = ef
	activeEffect()
	activeEffect = null
}

function track(target, key) {
	if (!activeEffect) return;
	let tMap = targetMap.get(target)
	if (!tMap) {
		targetMap.set(target, tMap = new Map())
	}
	let map = tMap.get(key)
	if (!map) {
		tMap.set(key, map = new Set())
	}
	map.add(activeEffect)
}

function trigger(target, key) {
	const tMap = targetMap.get(target)
	if (!tMap) return;
	const map = tMap.get(key)
	if (!map) return;
	map.forEach(ef => ef())
}

function reactive(target) {
	return new Proxy(target, {
		get(t, k, rec) {
			track(t, k)
			return Reflect.get(t, k, rec)
		},
		set(t, k, v, rec) {
			const oldV = t[k]
			const res = Reflect.set(t, k, v, rec)
			if (oldV !== v) {
				trigger(t, k)
			}
			return res
		}
	})
}

function ref(v) {
	const r = {
		get value() {
			track(r, 'value')
			return v
		},
		set value(newV) {
			if (newV !== v) {
				v = newV
				trigger(r, 'value')
			}
		}
	}
	return r
}

function computed(getter) {
	const a = ref()
	effect(() => a.value = getter())
	return a
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
