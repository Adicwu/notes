### 常量

> @名称:值
> *可当做字符串使用，如下：

```less
@res: color;
@blue: #009688;
.@{res} {
	//这里.@{res}相当于.color
	@{res}: @blue; //这里@{res}相当于color,@blue相当于#009688
}
```

### 混合

> &代表父级
>
> 单独定义的类可以直接在其他类中使用，如下：	

```less
.box {
	//如果不想在最终文件中输出，这定义为 .box()
	width: 300px;
	height: 156px;
	background: saddlebrown;
}
.contain {
	.box;
}
```



### 带参

> *如果为重名带参类，则在调用时会根据传参的数量自动选择对应参数的类，如果类参数带默认值，则情况更复杂

```less
.border(@band;@style;@color) {
//如果想设置默认值，则.border(@color:red),多个参数用;隔开(也可以,分隔，如果两者存在，则,分隔的效果会被;覆盖)
	border: @band @style @color; //亦可简写为border: @arguments;
}
.contain {
	.border(10px;solid;blue); //亦可写作@color:blue,多参数时好区分
}
```



### 匹配模式

```less
.radius(all,@band) {
	border-radius: @band;
}
.radius(top,@band) {
	border-top-left-radius: @band;
	border-top-right-radius: @band;
}
.contain {
	.radius(top, 20px); //根据具体匹配参数匹配对应的类
}
```



### 命名空间

```less
.astyle{
	.a{
		color: cadetblue;
		.b{
			color: blue;
		}
	}
	.c{
		background: red;
	}
}
.contain{
	.astyle>.a;//选择astyle类下.a里面直系样式，如果存在嵌套则需要再次>选择，可将空格替换>
}
```

