## gird栅格布局

> 将指定容器划分为格子

------

### 一.容器划分定义

- display: grid 将容器定义为栅格容器
- grid-template-columns 将容器的列划分为指定类型
- grid-template-rows 将容器的行划分为指定类型
- grid-template 将容器的行列划分为指定类型，用`/`分开

值：

1. 按照具体的高宽、数据个数，如：`grid-template-columns: 20px 20px 20px` 指将容器按列分割为三列、每列20px
2. 按照百分比的高宽、数据个数，如：`grid-template-columns: 20% 20%  20% 20%` 指将容器按列分割为四列、每列占总长的20%
3. 按照给定样式划分，如：`grid-template-columns: 1fr 1fr 3fr` 将容器按列分别分割为1、1、3等份
4. 使用`repeat()`函数简写，如：`grid-template-columns: repeat(2,100px)` 指将容器按列分割为两列、每列占100px宽度，更多详情下面单独说

### 二.盒模型

##### 1.行列间距

- row-gap：设置栅格内每行的间隔距离

- column-gap：设置栅格内每列的间隔距离

  简写： `gap: row column` 使用类似于padding

##### 2.排列顺序

> grid-auto-flow: x y;

- x：默认为row，row横向/column纵向
- y：默认空，dense自动将空间填满

##### 3.自身内部对齐方法

> 当内容划分总大小小于容器总大小时，就需要对齐方式。

just-content、align-content，简写：`place-content: align/just` grid-template

##### 4.子元素内部对齐方法

just-self、align-self，简写：`place-items: align/just``

### 三.内容放置 

##### 1.默认情况

> 在不设置的情况下，容器子元素会根据划分的格子从左到右，超出换行的方式排列，高宽自动为格子高宽

##### 2.手动设置

1).区域定位

> 将容器划分后的划分先作为指标，最上面的为行线的1、依次向下递增，最左边为行线的1、依次向左递增

- grid-row-start：开始行
- grid-column-start：开始列
- grid-row-end：结束行
- grid-column-end:：结束列

简写：`gird-row: start/end`、`gird-column: start/end`，合并两者为：`gird-area: row-start/column-start/row-end/column-end`

偏移：使用span可将行或列偏移指定数量，从指定元素的起始线（也就是上、左）计算，如当起始线为1时：`grid-row-end：span 3`相当于`grid-row-end：4`

2).命名定位	

> 将容器按照划分好的区域命名，然后再使用。当使用这种方法命名时，会默认将定义元素定义新的行线命名，如定义指定区域为header，则其起始线则为header-start

- grid-template-areas：行用`" "`包裹，引号内部定义列，列中可使用`.`占位

例子：

```css
/*将容器划分为2列3行，如下*/
grid-template-rows: 48px 1fr 48px;
grid-template-columns: 48px 1fr;
/*将容器内部按照行列定义名称*/
grid-template-areas: "header header" "nav main" "footer footer";

/*内部容器使用*/
grid-area: header
```



------

### 其他

### 1).repeat()

> x:数量 y:具体值;当x*y超出容器高宽时，则会溢出容器，且会导致内容划分错乱
>
> repeat(x,y)

##### x的具体值

1. 数值：1、2、3等等
2. 给定样式：`auto-fill`会自动按照容易的高宽和给定的y值来划分容器最大支持的行列数量（parseInt(容器/y)）

##### y的具体值

1. 一个数值：`20px`或`20%`等，
2. 多个数值：`20px 100px 30px`等，如果多个数值的数量大于等于x，则前x为的数值有效；如果多个数值的数量小于x，则会循环给定的多个数值为行列赋值
3. 给定样式： `1fr`等，每份按一等分划分
4. 给定函数：`minmax(i,j)`,将值数值为i-j之前

