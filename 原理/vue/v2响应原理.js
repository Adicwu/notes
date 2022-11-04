// 浅析
const obj = {
	name: 'adic'
}

function updateDom(value) {
	document.getElementById('app').innerText = value
}

function defineReactive(data, key, val = '') {
	Object.defineProperty(data, key, {
		enumerable: true,
		configurable: true,
		get() {
			return val
		},
		set(value) {
			val = value
			updateDom(value)
		}
	})
}
defineReactive(obj, 'name')
