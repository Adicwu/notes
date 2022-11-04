class Apromise {
	static PENDING = 'pending'
	static FILFULLED = 'filfulled'
	static REJECTED = 'rejected'

	constructor(exc) {
		// A+ 状态只会 p-f 或 p-r，其不允许逆转或互通
		this.PromiseState = Apromise.PENDING
		this.PromiseResult = null
		this.callbacks = []
		try {
			exc(this.resolve.bind(this), this.reject.bind(this))
		} catch (e) {
			this.reject(e)
		}
	}

	resolve(e) {
		if (this.PromiseState !== Apromise.PENDING) return;
		this.PromiseState = Apromise.FILFULLED
		this.PromiseResult = e
		setTimeout(() => {
			this.callbacks.forEach(callback => {
				callback.onFilfulled(this.PromiseResult)
			})
		})
	}

	reject(e) {
		if (this.PromiseState !== Apromise.PENDING) return;
		this.PromiseState = Apromise.REJECTED
		this.PromiseResult = e
		setTimeout(() => {
			this.callbacks.forEach(callback => {
				callback.onRejected(this.PromiseResult)
			})
		})
	}

	/**
	 * resolve、reject验证执行
	 * @param promise promise实例
	 * @param result 执行的返回结果
	 * @param resolve promise实例的resolve回调
	 * @param reject promise实例的reject回调
	 */
	praseResolve(promise, result, resolve, reject) {
		// A+ 如果then返回结果是创建的实例本身，则抛出异常
		if (promise === result) throw new TypeError('Chaining cycle detected')
		try {
			result instanceof Apromise ? result.then(resolve, reject) : resolve(result)
		} catch (e) {
			reject(e)
		}
	}

	/**
	 * @param onFulfilled 成功回调
	 * @param onRejected 失败回调
	 */
	then(onFilfulled, onRejected) {
		if (typeof onFilfulled !== 'function') onFilfulled = () => this.PromiseResult
		if (typeof onRejected !== 'function') onRejected = (res) => {
			console.log(res)
			throw res
		}
		const promise = new Apromise((resolve, reject) => {
			switch (this.PromiseState) {
				// 执行在PENDING时，then的后续操作需要等待执行完成再操作，故暂存等待
				case Apromise.PENDING:
					{
						this.callbacks.push({
							onFilfulled: (res) => {
								this.praseResolve(promise, onFilfulled(res), resolve, reject)
							},
							onRejected: (res) => {
								this.praseResolve(promise, onRejected(res), resolve, reject)
							}
						})
						break;
					}
				case Apromise.FILFULLED:
					{
						setTimeout(() => {
							this.praseResolve(promise, onFilfulled(this.PromiseResult), resolve, reject);
						})
						break;
					}
				case Apromise.REJECTED:
					{
						setTimeout(() => {
							this.praseResolve(promise, onRejected(this.PromiseResult), resolve, reject)
						})
						break;
					}
			}
		})
		// A+ then方法必须返回一个新的promise实例
		return promise
	}

	/**
	 * 静态赋值方法
	 */
	static resolve = function(res) {
		return new Apromise((resolve, reject) => {
			res instanceof Apromise ? res.then(resolve, reject) : resolve(res)
		})
	}
	static reject = function(res) {
		return new Apromise((resolve, reject) => {
			reject(res)
		})
	}
	static all = function(promises) {
		return new Apromise((resolve, reject) => {
			promises.reduce((result, promise, index) => {
				promise.then(res => {
					result[index] = res
					result.filter(item => item).length === promises.length && resolve(result)
				}, err => {
					reject((err))
				})
				return result
			}, [])
		})
	}
	static race = function(promises) {
		return new Apromise((resolve, reject) => {
			promises.forEach(promise => {
				promise.then(resolve, reject)
			})
		})
	}
}

const wait = (time, res, bad = false) => {
	return new Apromise((resolve, reject) => {
		setTimeout(() => {
			!bad ? resolve(res) : reject(res)
		}, time)
	})
}

const wait = (time, res, bad = false) => {
	return new Apromise((resolve, reject) => {
		setTimeout(() => {
			console.log('wait', time);
			!bad ? resolve(res) : reject(res)
		}, time)
	})
}

Apromise.all([
	wait(1000, 1),
	wait(2000, 2, true),
	wait(1000, 3),
]).then(res => {
	console.log(res, 'end')
}, err => {
	console.log(err, 'bad')
})

// const promise = new Apromise((resolve, reject) => {
// 	console.log('start');
// 	setTimeout(() => {
// 		resolve(11);
// 	}, 2000);
// }).then(value => {
// 	console.log(1);
// 	console.log('resolve', value);
// 	return wait(3000, 11)
// }).then(value => {
// 	console.log(2);
// 	console.log('resolve', value);
// 	return wait(2000, 11)
// }).then(value => {
// 	console.log(3);
// 	console.log('resolve', value);
// });

/**
 * 原理理解
 * 异步：任务轮询机制，通过宏任务将其then挂载延后
 * 链式调用：每一个promise实例在调用then后都会返回一个新的promise实例；利用任务队列的机制，
 * 			在创建promise时将所有then创建的新promise进行序列化，等待主promise的resolve方法执行后，再开始执行序列
 * 状态管理：pending、filfulled、rejected；其状态只存在p-f或p-r，其不可逆；状态和当前的值通过resolve或reject进行切换
 */