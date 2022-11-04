const vue = {
	data() {
		return {
			base: 'wu'
		}
	},
	computed: {
		name() {
			return 'adic' + this.base
		},
		job() {
			return this.base + 'front'
		}
	}
};

/*
	以下方法皆为简化，仅供逻辑梳理
*/

// 实例创建时 初始化computed 传入 vue实例、当前实例的计算属性
(function initComputed(vm, computed) {
	// 创建一个被watch的对象
	var watchers = vm._computedWatchers = Object.create(null);

	// 读取所有实例上的计算属性定义
	for (let key in computed) {
		const userDef = computed[key];
		// 由于computed可以是个对象，也可以是个方法，但最终这里只是读取，而方法时默认为get，所以需要单独判断getter
		const getter = typeof userDef === 'function' ? userDef : userDef.get;

		// 将计算属性的定义实例化并打入watchers对象，也就说computed的get实际上是Watcher原型上的get
		watchers[key] = new Watcher(vm, getter, {
			lazy: true // 设置computed在未被使用时 不进行计算；设置这个表示Watcher带有缓存机制
		});

		// 判断实例中是否被解析，如果没有，则解析
		if (!(key in vm)) {
			defineComputed(vm, key, userDef);
		}
	}

})(vue, vue.computed);

// 定义computed
function defineComputed(target, key, userDef) {
	let set = function() {};
	if (userDef.set) set = userDef.set;

	Object.defineProperty(target, key, {
		get: createComputedGetter(key),
		set,
	})
}

// 创建 computed-getter
function createComputedGetter(key) {
	return function() {
		const watcher = this._computedWatchers[key];

		// 缓存控制
		if (watcher.dirty) {
			watcher.evaluate();
		}

		// 链接控制 如：页面-computed-data 略微复杂...
		if (Dep.target) {
			watcher.depend();
		}

		return watcher.value
	}
}

function Watcher(vm, expOrFn, options) {
	this.dirty = this.lazy = options.lazy;
	this.getter = expOrFn;
	this.value = this.lazy ? undefined : this.get();
};

Watcher.prototype.get = function() {
	// getter 就是 watcher 回调
	var value = this.getter.call(vm, vm);
	return value
};
Watcher.prototype.evaluate = function() {
	this.value = this.get();
	// 执行完更新函数之后，立即重置标志位
	this.dirty = false;
};
// 假设computed-A依赖data-B，当监听到B发生改变时，则触发A的update方法，然后再次计算新值
Watcher.prototype.update = function() {
	if (this.lazy) this.dirty = true;
	// ....还有其他无关操作，已被省略
};


// computed原理
// 1.创建空对象并变量实例上的计算属性定义，将其每个创建watcher后存入空对象
// 2.定义computed，使用Object.defineProperty定义每个属性的get和set
// 3.get的实例方法中控制缓存以及数据链接
//		3-1.控制缓存.通过dirty变量，在依赖发生变化时触发自身的get
//		3-2.数据链接.....
