class UploadRequestIdle {
	deadlineTime = null;
	callback = () => {};
	channel = null;
	port1 = null;
	port2 = null;
	isWaitingAvailableFrame = true;

	constructor() {
		this.channel = new MessageChannel();
		this.port1 = this.channel.port1;
		this.port2 = this.channel.port2;
		this.port2.onmessage = () => {
			const timeRemaining = () => this.deadlineTime - performance.now();
			const _timeRemain = timeRemaining();
			if (!this.callback || !this.isWaitingAvailableFrame) return;
			if (_timeRemain > 0) {
				const deadline = {
					timeRemaining,
					didTimeout: _timeRemain < 0
				};
				this.callback(deadline);
				this.isWaitingAvailableFrame = false;
			} else {
				this.uploadRequestIdleCallback(this.callback);
			}
		};
	}

	uploadRequestIdleCallback(cb) {
		const SECONDE_DURATION = 1000;
		const FRAME_DURATION = SECONDE_DURATION / 60;
		this.callback = cb;
		this.isWaitingAvailableFrame = true;
		if (!document.hidden) {
			requestAnimationFrame(rafTime => {
				this.deadlineTime = rafTime + FRAME_DURATION;
				this.port1.postMessage(null);
			});
		} else {
			this.deadlineTime = performance.now() + SECONDE_DURATION;
			this.port1.postMessage(null);
		}
	};
}

// 作者： 寒草
// 链接： https: //juejin.cn/post/7069597252473815053
// 	来源： 稀土掘金
// 著作权归作者所有。 商业转载请联系作者获得授权， 非商业转载请注明出处。
