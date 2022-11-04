const nextTick = (function() {
	const tasks = [];
	let pending = false

	function taskHandler() {
		pending = false
		const fns = tasks.slice(0)
		tasks.length = 0;
		fns.forEach(fn => fn())
	}

	function timerFunc(callback) {
		setTimeout(taskHandler, 0)
	}

	return function(callback) {
		tasks.push(() => callback())
		if (!pending) {
			pending = true
			timerFunc()
		}
	}
})()
