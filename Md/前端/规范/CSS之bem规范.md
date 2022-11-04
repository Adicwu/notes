## 0.bem

> 我是谁、我在哪里、我要干什么。这是一句哲学，你懂我意思吧

- bem是css的一种命名规范，这种规范被大范围使用，比如框架组件样式命名（bootstrap、elementui等等）；
- css规范是非常有必要的，可以有效减少类名重复冲突（常见的命名污染），也更有利于读写；
- bem简单来说就是一句话`block-name__element-name--modifier-name`：模块名 + 元素名 + 修饰器名

官方文档：[点击跳转](https://www.bemcss.com/)

## 1.实际使用

**这里我以轮播组件举例，技术涉及到**

### 1.1 首先，我们打出基础布局

```html
<div class="aw-carousel">
    <div class="aw-carousel__contain">
    	....
    </div>        
</div>
```

1. 最为层命名为`aw-carousel`，aw为修饰名称、carousel为内容，以`-`分隔
2. 里面命名继承外层名称`aw-carousel`，而里层为内容容器，且我没有对其使用修饰名称（ps：如果加修饰，则为`xx-contain`），故单一取名为`contain`，以下划线`__`（ps：此处使用双下划线，也可以使用单下划线，看个人爱好）

### 1.2 然后，我们为其放入内容

```html
.... 此处承接上一步的....
<button class="aw-carousel__arrow aw-carousel__arrow--left"></button>
<button class="aw-carousel__arrow aw-carousel__arrow--right"></button>
<div class="aw-carousel__item"></div>
<div class="aw-carousel__item aw-carousel__item--active"></div>
<div class="aw-carousel__item"></div>
....
```

1. 内容包含轮播子组件`aw-carousel__item`以及左右指示器`aw-carousel__arrow`，由于两者为同级关系，所以常用相同的前缀`aw-carousel`（ps：注意，只是此处这样写，可以看出该内容的父节点名称为`aw-carousel__contain`，但仍使用了顶层`aw-carousel`。这样写是因为`aw-carousel__contain`与此处内容没有关系，仅作为子节点）
2. 由于左右指示器具有不同的样式（左、右），故这里使用了`aw-carousel__arrow--left aw-carousel__arrow--right`来区分，观察其语法，使用`--`来连接，又因为其属于指示器`aw-carousel__arrow`，故使用其前缀
3. 同指示器，子组件`aw-carousel__item`存在激活状态，故以`aw-carousel__item`为前缀添加`aw-carousel__item--active`。如果认为此处无需关联或需要使用`js`去动态添加类名时，则将其命名为`is-active`等纯语义化名称也无伤大雅

### 2.注意事项

1. 避免或禁止使用子代选择器

   ```less
   // bad
   .page-btn {
   	.list {}
       span {}
   }
   ```

2. 遵守核心思想

   ```less
   // bad
   .page-btn__btn // 重复使用btn，语义错误
   ```

3. 规范是死的，人是活的，只要不太离谱，基于`bem`创建自己的写法也是可以的

