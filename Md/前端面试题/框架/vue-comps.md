### keep-alive原理

> LRU淘汰算法；

设置一个阈值，如果超出，则删除起最少使用的内容

在新增缓存时将其放入缓存队列最后端；在获取缓存时，如果获取到，则删除当前缓存位置，并将其放入缓存队列最后端；

下列通过Map特性实现，如果手动实现，则需要注重头尾获取的方法

```js
class LRUCache {
	constructor(capacity) {
		this.capacity = capacity;
		this.cache = new Map();
	}
	get(key) {
		const founded = this.cache.get(key);
		if (founded) {
			this.cache.delete(key);
			this.cache.set(key, founded);
		}
		return founded ? founded : -1;
	}
	put(key, value) {
		const founded = this.cache.get(key);
		if (founded) {
			this.cache.delete(key);
		}
		this.cache.set(key, value);
		if (this.cache.size > this.capacity) {
			this.cache.delete(this.cache.keys().next().value);
		}
	}
}
```

