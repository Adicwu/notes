[MDN文档](https://developer.mozilla.org/zh-CN/docs/Web/CSS/Pseudo-classes#%E6%A0%87%E5%87%86%E4%BC%AA%E7%B1%BB%E7%B4%A2%E5%BC%95)

### 伪类选择器

- **:focus** 表单控件聚焦
- **:root** 根选择
- **:acitve** 激活选择
- **:after/:before** 标签内前后选择
- **:hover** 鼠标悬浮选择
- **:empty** 空标签选择
- **:nth-of-type(n)** 选择第n个指定标签
- **:first-of-type** 选择第一个指定标签
- **:last-of-type** 选择最后个指定标签
- **div :nth-child(n)** 选择`div`下的的第n个子元素，n为even则选择偶数，支持运算
- **div :first-child** 选择`div`的第一个子元素，包括子元素的子元素
- **div :last-child** 选择`div`的最后一个子元素，包括子元素的子元素
- **div :only-child** 选择`div`下只有一个子元素的那个子元素
- **div p:only-of-type** 选择`div`下子元素只有一个`p`的那个`p`（注意，只判断存在一个p，其他元素仍可以为子元素）
- **div:focus-within** 当`div`下某元素触发focus事件（多为表单元素）时，会激活的样式
- **div:not(.xx,.yy)**  现在没有`.xx`或`.yy`的`div`标签 
- **div input:default** 选择`div`下的被作为默认值的的`input`标签，如下

```html
div input:default {
	background: crimson;
}
<div>
	<input type="radio" checked> // crimson
	<input type="radio">
	<input type="radio">
</div>
```

- 

### 伪元素选择器

- **p::first-line** 选择`p`标签的第一行
- **p::first-letter** 选择`p`标签的第一个字
- **p::selection** 选择被用户选取的元素部分
- **::after ::before**

### 其他选择器

- **[attribute]** 选择包含`attribute`属性名称的节点

```css
[attribute=123] 选择包含`attribute`属性名称且其值为`123`的节点
[attribute~=123] 选择包含`attribute`属性名称且其值内包含`123`的节点
[attribut^=123] 选择包含`attribute`属性名称且其值为`123`开头的节点
[attribut$=123] 选择包含`attribute`属性名称且其值为`123`结尾的节点
[attribut*=123] ???
[attribut|=123] ???
```

- 

### 符号选择器

- **h1~b** 选择与`h1`标签同级的`b`标签
- **h1+b** 选择`h1`标签向下相邻的`b`标签