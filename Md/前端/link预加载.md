### 何为link

> 超文本标记语言（俗称html）内head中的一个异步资源加载标签

### 何为预加载

> 在页面渲染前提前加载需要资源，以方便后续使用，提升页面性能。由于link属于异步，所以有时页面加载完成，但link使用的资源仍在加载，就会导致页面显示错误的问题。

#### 使用

```html
// 一般的link标签
<link rel="stylesheet" href='https://xxx.xx.xx/xx.css' />

// 预加载形式
<link rel="preload" href='https://xxx.xx.xx/xx.css' as="style"/>
<link rel="stylesheet" href='https://xxx.xx.xx/xx.css' />
```

**正如上述代码，预加载资源需要新起一个`link`标签，填入相同的`href`地址，设置`rel`为`preload`。注意，这里还有属性叫`as`，这个属于用于区分资源类型，以便浏览器正确识别资源优先级与类型，来做出不同的处理，常见的`as`资源对应表如下：**

1. audio：音频文件
2. document：将要被嵌入到` <iframe>` 或 `<iframe>` 内部的 html 文档
3. embed：将要被嵌入到` <embed> `元素内部的资源
4. fetch：将要通过 `fetch `和 `XHR `请求来获取的资源，比如一个` ArrayBuffer `或` JSON `文件
5. font：字体
6. image：图片
7. object：将会被嵌入到`<embed>`元素内的文件
8. script：`JavaScript`文件
9. style：样式文件
10. track：`WebVTT` 文件
11. worker：一个` JavaScript `的` web worker` 或 `shared worker`
12. video：视频文件
13. .....

#### 跨域

大部分情况下，使用第三方`cdn`，会导致跨域问题而无法获取（注：如果为字体文件，则必然存在此情况），解决方法如下：

```html
// 为其设置跨域属性 crossorigin="anonymous"
<link rel="preload" href='https://xxx.xx.xx/xx.woff2' type="font/woff2" as="font" crossorigin="anonymous"/>
```

