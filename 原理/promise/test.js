class Apromise {
	static PENDING = 'pending'
	static FILFULLED = 'filfulled'
	static REJECTED = 'rejected'
	constructor(cb) {
		this.cbs = []
		this.status = Apromise.PENDING
		this.value = undefined
		try {
			cb(this.resolve.bind(this), this.reject.bind(this))
		} catch (e) {
			this.reject(e)
		}
	}
	resolve(res) {
		this.status = Apromise.FILFULLED
		this.value = res
		setTimeout(() => {
			this.cbs.forEach((cb) => {
				cb.onFulfulled(res)
			})
		})
	}
	reject(res) {
		this.status = Apromise.REJECTED
		this.value = res
		setTimeout(() => {
			this.cbs.forEach((cb) => {
				cb.onRejected(res)
			})
		})
	}
	pasre(pr, res, resolve, reject) {
		if (pr === res) throw new TypeError('Chaining cycle detected')
		try {
			res instanceof Apromise ? res.then(resolve, reject) : resolve(res)
		} catch (err) {
			this.reject(err)
		}
	}
	then(onFull, onReject) {
		if (typeof onFull !== 'function') {
			onFull = () => this.value
		}
		if (typeof onReject !== 'function') {
			onReject = (err) => {
				throw err
			}
		}
		const pr = new Apromise((resolve, reject) => {
			switch (this.status) {
				case Apromise.PENDING: {
					this.cbs.push({
						onFulfulled: (res) => {
							this.pasre(pr, onFull(res), resolve, reject)
						},
						onRejected: (res) => {
							this.pasre(pr, onReject(res), resolve, reject)
						}
					})
					break;
				}
				case Apromise.FILFULLED: {
					setTimeout(() => {
						this.pasre(pr, onFull(this.value), resolve, reject)
					})
					break;
				}
				case Apromise.REJECTED: {
					setTimeout(() => {
						this.pasre(pr, onReject(this.value), resolve, reject)
					})
					break;
				}
			}
		})
		return pr
	}

	static all(prs) {
		return new Apromise((resolve, reject) => {
			try {
				const result = []
				prs.forEach(pr => {
					pr.then(
						(res) => {
							result.push(res)
							if (result.length === prs.length) {
								resolve(result)
							}
						},
						err => {
							reject(err)
						})
				})
			} catch (e) {
				reject(e)
			}
		})
	}
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
