### flat数组降维

> 利用递归循环和数组合并

```javascript
Array.prototype.adFlat = function(deep) {
	return deep > 0 ? this.reduce((total, item, index) => {
		return total.concat(Array.isArray(item) ? item.adFlat(deep - 1) : item)
	}, []) : this.slice()
}
```



### call\apply\bind指向修改

> 利用this的特性，将要执行的方法放到指定的this上，然后执行

```javascript
//call\apply
Function.prototype.adCall = function() {
	//如果是apply，将 [pointer, ...args] 改为 [pointer, args]
	let [pointer, ...args] = [...arguments], //将传入参数解析成指针和其他参数
	fn = Symbol(); //创建独立名称
	pointer = Object(pointer) || window; //将传入指针转换成实例对象
	pointer[fn] = this; //向创建对象添加fn独立方法
	let rel = pointer[fn](...args); //将执行结果赋值
	delete pointer[fn]; //删除之前添加进指针对象的方法
	return rel; //返回执行结果
}
//bind
Function.prototype.adBind = function(pointer, ...args) {
	return (...newagrs) => this.call(pointer, ...args, ...newagrs) //方法返回一个方法，传入两次传入的参数
}
```



### new对象实例化

> 创建一个新对象，这个对象的原型指向构造函数的原型->在新对象上执行这个构造函数->返回新对象；与Object.create的差别在于，new会执行构造函数

```javascript
function _new(fn, ...args) {
	const obj = {}; // 创建一个空对象
	obj.__proto__ = fn.prototype; // 空对象原型指向构造函数原型
	const res = fn.call(obj, ...args); // 改变指向并执行构造函数
	return res instanceof Object ? res : obj; // 返回
}
```

**扩展**

1. 如果用于实例化的构造函数，存在自己的返回值，且此值为引用类型，会导致最终new的结果为这个返回值



### instanceOf实例判断

> 由于instanceOf的判断是会往原型链顶层走的，所以我们需要使用递归或者循环来往原型顶层走，通过实例对象的`__proto__`和对象的原型`prototype`进行比对

```javascript
function instanceOf(leftVal, rightVal) {
	if (typeof leftVal != 'object' || leftVal === null) return false;
	let leftPro = leftVal.__proto__, // 获取实例化内容的原型
		rightPro = rightVal.prototype; // 获取原型
	while (true) { // 深度向上寻找原型，直到顶层Object.prototype
		if (leftPro === null) return false;
		if (leftPro === rightPro) return true;
		leftPro = leftPro.__proto__
	}
}
```



### JSON.parse解析

> 利用eval函数

```javascript
function parse (json) {
    // 此处的括号是为了表明内部执行内容为一个整体，就像箭头函数简写返回一个对象也需要括号包裹一样
    return eval("(" + json + ")"); 
}
```



### await/async异步自动执行队列

> await与async实际上就是generator函数的语法糖，所以此处使用generator实现。generator本身拥有中断递进的功能，所以与promise配合，通过next的传参性质，使用递归执行generator内容即可

```javascript
// 此处伪代码并未考虑抛错，如需了解请看下一个代码块
function generatorToAsync(generatorFn) {
	return function() {
		return new Promise((resolve, reject) => {
			const g = generatorFn()
			const handler = (res) => {
				const cb = g.next(res).value
				if (typeof cb.then === 'function') {
					cb.then(res => handler(res))
				} else {
					resolve(res)
				}
			}
			g.next().value.then(handler)
		})
	}
}

function fn(nums) {
	return new Promise(resolve => {
		setTimeout(() => {
			resolve(nums * 2)
		}, 1000)
	})
}

const asyncFn = generatorToAsync(function*() {
	const num1 = yield fn(1)
	console.log('1 end');
	const num2 = yield fn(num1)
	console.log('2 end');
	const num3 = yield fn(num2)
	console.log('3 end');
	return num3
})
asyncFn().then(res => console.log(res)) // 3秒后输出 8
```

**较为完善的实现**

[原文链接](https://juejin.cn/post/7007031572238958629)

```javascript
function generatorToAsync(generatorFn) {
	return function() {
		const gen = generatorFn.apply(this, arguments) // gen有可能传参
		// 返回一个Promise
		return new Promise((resolve, reject) => {
			function go(key, arg) {
				let res
				try {
					res = gen[key](arg) // 这里有可能会执行返回reject状态的Promise
				} catch (error) {
					return reject(error) // 报错的话会走catch，直接reject
				}
				// 解构获得value和done
				console.log(res);
				const {
					value,
					done
				} = res
				if (done) {
					// 如果done为true，说明走完了，进行resolve(value)
					return resolve(value)
				} else {
					// 如果done为false，说明没走完，还得继续走
					// value有可能是：常量，Promise，Promise有可能是成功或者失败
					return Promise.resolve(value).then(val => go('next', val), err => go('throw', err))
				}
			}
			go("next") // 第一次执行
		})
	}
}
```



### is值相同对比

> 利用`1/0===Infinity`与`1/-0===-Infinity`的特性区分正负0相同判断；利用NaN永不与NaN相等的特性判断NaN

```javascript
function is(x, y) {
	if (x === y) {
		// 防止 -0 和 +0
		return x !== 0 || 1 / x === 1 / y
	}
	// 防止NaN
	return x !== x && y !== y
}
console.log(is(0, -0)); // false
```



### extends继承

> 假设有构造函数Obj和Dog，需要Obj继承于Dog

- `Obj.prototype = new Dog()` 原型链继承，此方法能使实现继承。但以后实例化的Obj都会基础同一个Dog，导致数据共享
- `在Obj内执行 Dog.call(this)` 构造函数继承，此方法仅能使用Dog的实例内容，无法访问Dog原型上的内容
- `结合原型链和构造函数，并手动挂载构造器 Obj.prototype.constructor = Obj` 组合继承，解决了前两者的问题，但会导致Obj执行两次
- `Object.create`原型式继承，将Obj和Dog写法改为普通对象，使用Object.create创建Obj对象，并往Obj对象上挂载Dog的属性；由于Object.create是浅拷贝，会导致Obj深内容被间接引用
- `深拷贝+Object.create`寄生式继承，去除了原型式继承的问题
- 最终方案，寄生组合式继承，也是babel中的方案，结合上续所有内容实现

```javascript
function clone (parent, child) {
    // 这里改用 Object.create 就可以减少组合继承中多进行一次构造的过程
    child.prototype = Object.create(parent.prototype);
    child.prototype.constructor = child;
}

function Obj() {
    this.name = 'Obj';
    this.play = [1, 2, 3];
}
Obj.prototype.getName = function () {
    return this.name;
}
function Dog() {
    Obj.call(this); // Obj实例信息链接
    this.friends = 'child5';
}

clone(Obj, Dog); // Obj原型内容链接

Dog.prototype.getFriends = function () { // 注意，对Obj的原型操作需要在原型链接完成后才会有效
    return this.friends;
}

let person6 = new Dog();
console.log(person6);
console.log(person6.getName()); 
console.log(person6.getFriends());
```

**总结**

1. 继承需要实现两者间的 对象实例与原型链接