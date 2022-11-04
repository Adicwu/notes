## Promise承诺者

> 用于解决异步请求带来的部分问题，常见有请求未完成就开始执行数据渲染，使用可监听对象内函数执行完成再往下执行

### 一.基本用法

```javascript
new Promise((resolve, reject) => {//resolve成功执行必写，reject错误抛出执行可写
	//这里放执行内容，如下请求
	axios.post('getinfo').then(respon=>{
		resolve(respon.data);//把数据放到resolve中并且往下传递
		//reject('1');如果调用这个方法，则会跳到下面的catch地方，不会继续执行后面的内容
	})
}).then(info => {//当上面执行完成后，把resolve中接收的到的数据传递到info中
	//这里判断如果上面执行完成后执行，如方法
	console.log(info)
}).catch(rel=>{//异常捕捉，可选
	console.log(rel)
}).finally(()=>{//无论是异常还是正常都会执行
    console.log('over')
})
```

### 二.扩展用法

##### 1.链式调用，适用于多嵌套环环相扣

```javascript
new Promise(resolve=>{
	var data=1
	console.log('第一个执行',data)
	resolve(data+1)
}).then(data=>{
	console.log('第二个执行',data)
	return data+1;//这里属于简写,实际上是返回了一个Promise.resolve()方法
}).then(data=>{
	console.log('第三个执行',data)
	return data+1;
}).then(data=>{
	console.log('第四个执行',data)
})
```

##### 3.对象接口

###### 1).批量调用多执行，适用于需要判断多个Promise执行完成后执行

```javascript
Promise.all([//使用此方法监听多个Promise执行
	new Promise((resolve,reject)=>{//第一个Promise执行
		setTimeout(()=>{
			console.log('第一次')
			resolve('1')//必须使用此方法来提示Promise执行完成
		},1000)
	}),
	new Promise((resolve,reject)=>{//第二个Promise执行
		setTimeout(()=>{
			console.log('第二次')
			resolve('2')
		},2000)
	}),
]).then(rel=>{//上面执行完成后执行,这里传入的rel的值为上面执行中所有resolve传递的值的总汇
	console.log('ok')
}).catch(err=>{//当all监测到内部有对象异常走了reject方法时，会中断执行跳转catch方法
    console.log('err')
})

//如果想不管内部有没有错误都执行then成功方法的话，则使用allSettled方法
//如果想选择性比较多个promise速度，且只获取最快的那个结果，则使用race方法
```

###### 2).直接调用

```javascript
//直接传入调用的成功和失败
Promise.resolve('成功').then(res=>console.log(res))
Promise.reject('失败').catch(err=>console.log(err))
```



### 三.promise语法糖，async  await  Generator扩展

> js异步编程经过几代的更替，在es7中发表了最新扩展async  await，其原理基本类似Generator，但结合了Generator和Promise，使异步编程更加完善

```javascript
var data = 0
const setOne = () => {
    //方法中返回Promise对象
	return new Promise(resolve => {
		setTimeout(() => {
			data = 1
			resolve(data)
		}, 2000)
	})
}
const setTwo = () => {
	return new Promise((resolve, reject) => {
		setTimeout(() => {
			data = 2
			// resolve(data)
			reject('oh its bad')
		}, 1000)
	})
}
//使用async关键字声明函数
const holder = async () => {
    //使用await关键字声明函数
	var f1 = await setOne();
    
    //由于async中如果有await监测到使用了reject，则会停止后续操作，所以需配合try catch使用
	try {
		var f2 = await setTwo();
	} catch (err) {
		console.log(err)
	}
    
    //将内容输出，传入then()携带参数中
	return [f1, f2]
}
//使用方法并调用then
holder().then(res => {
	console.log(res)
})
//输出 
//oh its bad
//(2) [1, undefined]
```

