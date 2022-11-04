文档：[github文档](https://github.com/kaorun343/vue-property-decorator)

### 实例对象

> **export default class Xxx extends Vue {}**
>
> 当然：`<script lang="ts">`

##### 0.公共

1. readonly只读，设置了此属性，在准备修改和执行修改时均会阻止报错
2. private私有
3. 定义组件时必须声明@Component

##### 1.Component引入

```typescript
import { Component } from 'vue-property-decorator' //导入

//同样是import引入，但是不能省略.vue后缀
@Component({
	components: {}
})
```

##### 2.data/methods创建

```typescript
//直接定义在实例中
//data
变量名称: 数据类型 = 值;
//methods
函数名称() :函数返回值{}
```

##### 3.Watch监听

```typescript
import { Watch } from 'vue-property-decorator' //导入

//监听
@Wacth('监听内容',options) on监听内容Changed(newval: any,oldval: any){}

//options内容，选写
//options: {
//    immediate: true,//初始化监听
//    deep：true,//深度监听    
//}
```

##### 4.computed计算属性

```vue
set 返回名称(){}
```

##### 5.生命周期，写法不变，略...

##### 6.Provide/Inject注入

```typescript
import { Provide, Inject } from 'vue-property-decorator' //导入

//注入
@Provide() 注入常量名 = 值;
//接收
@Inject('注入常量名') 注入常量名!: any;
//当然，注意一个对象同样是响应式的
```

##### 7.Emit/Prop组件通讯

```typescript
import { Emit, Prop } from 'vue-property-decorator' //导入

//修改，这种写法会触发$emit去修改父传入的值
@Emit() changeXxx(){
	this.Xxx = 'xxx'
}
//获取
@Prop(options) private 接收名称!: any
//options内容，选写
//options: {
//    type: String,//数据类型，如果多种可能，则用[]
//    default：'xx',//未定义时值    
//}
```

##### 8.Ref链点

```typescript
import { Ref } from 'vue-property-decorator' //导入

//获取，这里的ref会默认将获取的具体内容根据名称转换为computed
@Ref() readonly ref名称!: 数据类型
//*数据类型可使用any，其他的俺也不懂
```

