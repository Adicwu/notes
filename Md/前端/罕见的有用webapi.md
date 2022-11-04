## 节点大小高宽获取

### Element.clientXxx

最常见也是最基础的高宽等数据获取，不多解释，会省略小数

### window.getComputedStyle(Element)

获取节点在浏览器计算并执行完成之后的所有样式（会跳过样式过渡）

### Element.getBoundingClientRect()

获取节点当前的位置样式

> 三者都可以获取节点的高宽大小，getBoundingClientRect获取的只是执行时的节点大小，clientXxx会自动省略小数，getComputedStyle貌似性能开销挺大

## 监听指定节点下的节点变化

```javascript
const callback = () => ....... // 回调
const target = ..... //htmlElement
const observer = new MutationObserver(callback) // 创建对象，并传入节点变化时触发的回调
observer.observe(target, { // 第一个参数为监听节点，第二个为配置对象
	attributes: true,
	childList: true,
	subtree: true,
    ....
});
observer.disconnect(); // 手动销毁监听
```


