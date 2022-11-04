### transform动画操作

1. rotate(30deg);//旋转
   	以x为轴：rotateX(120deg);
    以y为轴：rotateY(120deg);
2. skew(30deg,20deg);//翻转
3. scale(1.8);//缩放

------



### background背景

-attachment

-origin :背景图片可以放置于 content-box（小）padding-box（中） 或 border-box（大） 区域

-attachment: 背景定位模式fixed订死背景图片

-position: 背景定位位置，用法像margin

- 图片的覆盖（多重）
  background-image:url(上面图一),url(下面图二);

- 图色混合

  background-color与background-image同时使用，再使用

  background-blend-mode :设置叠加模式

- 简写 
  background: #ffffff url("1.jpeg") no-repeat fixed;//颜色 图片 重复 定位，重复和定位可以看情况写

------



### text文本

- 文字过长自动换行
  word-wrap:break-word;
- 文本位置 
  vertical-align:text-top/middle/bottom;
- 字体简写 
  font:字体大小px/行高px "字体";
- 字符间距 
  letter-spacing: px;

- 首行缩进 
  text-indent: px;
- 英文单词拆分换行
- word-break:break-all;
- rem概念
  以父级元素的字体大小为基准,计算当前区的字体大小
  如: *{font-size: 20px;} h1{font-size: 6.25rem;}
  当*里面的size改变时,h1的size也会改变

------



### position定位

##### 绝对定位（多用于内部子元素）

（1.脱离文档流,后续正常元素会上去 2.以body为原点进行定位 3.以最近一个有定位的父元素进行定位）： 
	position：absolute；
	top：；bottom：；left：；right：；

##### 相对定位（多于外部父元素）

（1.不会脱离文档流 2.以自己所在的位置进行定位 3.）：	
	position: relative;

------

### 特殊样式

##### 动画加载变换

animation:myf（名字） 5s（0时间） ease infinite（无限循环） alternate（动画完成后到放）;

- 把box分为几个相同大小的块
  column-count:？;
- 每栏间的间距
  column-gap:px;
- 每栏间可插入的竖线
  column-rule:3px outset #ff0000;
- 移入变手指
  cursor：pointer

- 不占位置的边框线
  outline： px solid 
- 超出隐藏
  overflow：hidden
- 高斯模糊 
  filter:blur(?px);
- 切片背景
  linear-gradient(-45deg,#ffb300 33%,transparent 0),linear-gradient(-45deg,#512da8 67%,transparent 0),linear-gradient(-45deg,#ffb300 100%,transparent 0)

------



### class类

class可写入多个类
class="CSS1 CSS2 CSS3..."
当一个元素同时有id类和class类时，id类会覆盖class类且无视先后
内敛样式会覆盖class与id类样式
类里的属性的值后面(;前)加上!important可以下达最终值，无法被覆盖

p.name p元素中class叫name的
p .name p元素中的子元素中class叫name的
p>.name p在直接子元素的class叫name 
p[class$=name]盘元素中class为name的

##### 伪类

多个使用需要按照顺序
p:hover{}鼠标移入
p:active{}鼠标点击不放
p:visited{}鼠标点击过

die li：hover .div01（移入父元素，让子元素变化）



块级元素独占一行 内敛元素独占一块，所以内敛元素无法设置宽高
置换元素：image、input、textarea、select、object等为内敛元素，但任然能设置宽高
置换元素在其显示中生成了框，这也就是有的内联元素能够设置宽高的原因。

------



### box盒模型

##### width\height

```html
//自动型高宽
-webkit-fill-available 会自动按照父级元素的宽高设置相同的宽高
-webkit-fit-content 会按照元素内容的高宽设置本身的高宽
-webkit-min-content 会根据最小的下一级子元素宽度设置自身高宽
-webkit-max-content 会根据最大的下一级子元素宽度设置自身高宽
```

```html
//视口高宽
vw：1vw等于视口宽度的1%。
vh：1vh等于视口高度的1%。
vmin：选取vw和vh中最小的那个。
vmax：选取vw和vh中最大的那个。
```



##### 设置边框计算到盒子尺寸中

box-sizing: border-box;

##### 偏移缩放的边框

outline-offset :设置偏移缩放大小

##### 可改变大小的模型

```
resize: both;
overflow:auto;
```

