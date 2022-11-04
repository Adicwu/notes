## Flutter

## 中断学习，原因：太繁琐

##  https://www.bilibili.com/video/BV1KE41117XV?p=25

### 一.Widget

**基础 Widget**（内部状态无法改变）

```dart
class ProductItem extends StatelessWidget{ // 创建Widget，继承StatelessWidget
  final String title; // 定义参数必须为final
  ProductItem(this.title);
  @override
  Widget build(BuildContext context) { //重写build，返回Widget内容
    return Text(title);
  }
}
```

**可变状态Widget**

```dart
class TestWidget extends StatefulWidget{ // 创建Widget，继承StatefulWidget
 @override
  State<StatefulWidget> createState() { // 重写createState，返回State
    return TestWidgetState();
  }
}
class TestWidgetState extends State<TestWidget>{ // 创建Widget的State，State
  int count = 0;
  @override
  Widget build(BuildContext context) {
    return Center(
      child: Column(
        children: [
          RaisedButton(
            child: Text('++'),
            onPressed: (){
              print('add');
              setState(() { // 修改状态时触发视图更新
                count++;
              });
            },
          ),
          Text('当前：$count',style: TextStyle(fontSize: 16),)
        ],
      ),
    );
  }
}
```

**生命周期**

> 构造函数->initState->didChangeDependencies->build

**内置Widget**

1. Text文本

   ```dart
   Text(
       'xxxx', //文本
       textDirection: TextDirection.ltr, // 本身位置，独立使用时必写，其他时候会得到父继承
       textAlign: TextAlign.center, // 文本align
       maxLines: 2, // 最高多少行，默认不限
     	overflow: TextOverflow.ellipsis, // 超出样式，此处...
       textScaleFactor: .5, // 文本缩放
       style: TextStyle( // 文本样式
       	fontSize: 16,
           color: Colors.orange, // Color(0xffff0000)
       ),
   )
   ```

2. MaterialApp单页面

   ```dart
   MaterialApp(
   	title: 'hello world', // 顶部文本
   	home: xx() // 内界面
   )    
   ```

3. Scaffold脚手架

   ```dart
   Scaffold(
   	appBar: AppBar( // bar
   		title: Text('Adic Wu'),
   	),
   	body: xx(), // 内界面
   )
   ```

4. 