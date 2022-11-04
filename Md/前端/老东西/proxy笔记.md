## Proxy代理人

> 监听对象（数组, 对象, 函数等等）内部变化，定义基本操作的自定义行为（如属性查找，赋值，枚举，函数调用等）。

### 一.基础语法

```javascript
const new_obj = new Proxy(obj,handler)		
//new_obj 为代理后的对象
//obj 为被代理的对象
//handler 自定义的方法集合
```

### 二.代理的范围--handler（13种）

```javascript
const cxy = {
	name: 'adic',
	says() {
		console.log('hellow')
	},
	age: 18,
}
//代理对象->new_cxy 被代理对象->cxy
const new_cxy = new Proxy(cxy, {
	//当读取代理对象的某个值时触发
	//target 被代理对象,key 读取的关键字,val 代理对象
	get(target, key, val) {
		console.log('val get')
		return target[key] //使用时应返回获取值
	},
	//当改变代理对象的某个值时触发
	//target 被代理对象,key 读取的关键字,val 新设置的值
	set(target, key, val) {
		console.log('val set')
		target[key] = val //使用时应手动改变要改变的值
         return true
	},
	//当读取对象原型时触发
	//target 被代理对象
	getPrototypeOf(target) {
		console.log('pototype get')
		return target.__proto__ //使用时应手动返回对象原型
	},
	//当设置对象原型时触发
	//target 被代理对象
	setPrototypeOf(target, val) {
		console.log('prototype set')
		target.__proto__ = val //使用时应手动改变原型
		return target //使用时返回自己
	},
	//当定义属性值时触发
	//target 被代理对象,key 指定的关键字,val 新的定义属性
	defineProperty(target, key, val) {
		console.log('val change')
		target[key] = val.value //使用时应手动增加值,这里只举例value
		return target //使用时返回自己
	}
    
	//getOwnPropertyDescriptor() 读取指定属性描述时触发
	//Object.getOwnPropertyDescriptor(proxy, "foo")
    
	//isExtensible() 判断对象可扩展时触发
	//Object.isExtensible(proxy)
    
	//preventExtensions() 判断对象不可扩展时触发
	//Object.preventExtensions(proxy)
    
	//has() 判断对象是否拥有指定属性时触发
	//"foo" in proxy
    
	//deleteProperty() 删除对象属性时触发
	// delete proxy.foo
    
	//ownKeys() 获取对象所有键值时触发
	//Object.getOwnPropertyNames(proxy)
    
	// apply() 调用目标对象的代理对象时触发
	// proxy()
    
	//construct() 给一个目标对象为构造函数的代理对象构造实例时触发该操作
	//new proxy()
})

//执行读取值
// console.log(new_cxy.name)
//输出val get与adic

//执行设值
// new_cxy.name = 'bob'
//输出val set

//执行读取原型
// console.log(Object.getPrototypeOf(new_cxy))
//输出 pototype get与指定对象的原型

//执行设置原型
// console.log(Object.setPrototypeOf(new_cxy,null))
//输出 pototype set与指定对象

//执行定义属性值
// Object.defineProperty(new_cxy,'name',{
// 	value: 'bob'
// })
//输出 val change
```

### 三.使用场景

待续....