// 浅析
const vue = {
	data() {
		return {
			name: 'adic',
			arr: [{
					name: '486'
				},
				{
					name: 'luyisi'
				}
			],
			elses: {
				job: {
					main: 'fornt'
				}
			}
		}
	}
}

function updateDom(value) {
	document.getElementById('app').innerText = JSON.stringify(obj)
}

function isObject(target) {
	return toString.call(target).match(/\b(\w+)\b/g)[1] === 'Object'
}

// Reflect是用来配合Proxy的全局api，可代替执行其默认事件
function defineReactive(obj) {
	if (!isObject(obj)) return obj
	return new Proxy(obj, {
		get(target, name) {
			const ret = Reflect.get(target, name)
			console.log('get')
			return defineReactive(ret) // Proxy默认情况下是惰性的，只会深度监听get，set需要手动递归
		},
		set(target, name, value, receiver) {
			const ret = Reflect.set(target, name, value, receiver)
			console.log('set', ret)
			updateDom()
			return ret
		}
	})
}
const aa = defineReactive(vue.data())
