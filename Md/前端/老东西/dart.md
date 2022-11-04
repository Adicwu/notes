### 一.起步

> 每个dart文件都需要一个入口文件，格式如下

```dart
//args 运行时传入的值 例：dart xx.dart adic lucy
void main(List<String> args) {
    
}
```

### 二.声明

> dart为强类型语言，声明需要定义类型且不能直接重新赋值改变。如果定义不赋值，则默认为null

1. `int` 整型
2. `double` 浮点类型
3. `String` 字符串类型
4. `var/const/final` 推导关键字，定义时自动检测赋予类型。`const/final`声明后不可更改，`const`必须直接赋值常量，`final`可以赋值任何（如方法返回值）
5. `dynamic` 动态类型，可赋值改变类型。尽量少使用。
6. `List`  类似于数组
7. `Set` 唯一键值对
8. `Map` 类似于对象

```dart
String name = 'adic';
int age = 18;
List<String> boys = ['adic', 'jack'];
Map<String, dynamic> obj = {'name': 'jack', 'age': 18};
print('$name $age'); //在变量名前面添加$可直接作为参数在字符串中使用
print(age.runtimeType); //runtimeType获取其类型
```

```dart
// 返回值 函数名称(数据类型 参数名称)
int sumAdd(int sums1,int sum2){
	return sums1 + sum2;
}
```

### 三.类和对象

#### 基本的定义和使用

```dart
void main(List<String> args) {
  final lili = Doge('bob', 18);
  lili
    ..say()
    ..jump();
}
class Doge {
  String name;
  int age;
  // 构造函数
  Doge(String name, int age) {
    this.name = name;
    this.age = age;
  }
  void say() {
    print('i am $name');
  }
  void jump() {
    var name = 'jack';
    // 注意this指向
    print('$name like jump with ${this.name}');
  }
}

//补充
//1. 泛型类。不约束传入值类型
//class Doge<T>{
//    T age;
//    T name;
//    Doge(this.age,this.name);
//}

```

#### 构造函数的进阶

##### 1.构造函数

```dart
//基本带可选参数
void main(List<String> args) {
  final lili = Doge('bob', 18, elses: false, friend: 'duck');
}
// class
Doge(String name, int age, {var elses, var friend}) {
    this.name = name;
    this.age = age;
    this.elses = name;
    this.friend = friend;
}
```
```dart
// 在传参时初始化内容
void main(List<String> args) {
  final lili = Doge('adic', 11);
}
//class
Doge(this.name, this.age)
	: introduction = 'i am $name,$age olds',
	nextAge = age + 1;
```

##### 2.语法糖简写

```dart
//当构造函数单纯的为了赋值时，可简写如下
void main(List<String> args) {
  final lili = Doge('adic', 11, elses: 'age', friend: 'duck');
}
//class
Doge(this.name, this.age, {this.elses, this.friend});
```
##### 3.命名构造函数
```dart
// 当需要在不改变构造函数结构时改变传赋值操作，如map时
void main(List<String> args) {
  Map<String, dynamic> res = {
    'name': 'adic',
    'age': 18,
    'eslse': true,
    'friend': 'json'
  };
  final lili = Doge.fromMap(res);
}
// class
Doge.fromMap(Map<String, dynamic> map) {
    this.name = map['name'];
    this.age = map['age'];
    this.elses = map['elses'];
    this.friend = map['friend'];
}
```
##### 4.重定向构造函数
```dart
void main(List<String> args) {
  final lili = Doge.fromName('adic');
}
// class
Doge(this.name, this.age);
Doge.fromName(String name) : this(name, 0);
```
##### 5.常量构造函数
```dart
// 共用同一个实例化对象（注意：正常情况下传入相同参数的两个实例化对象不相同）
void main(List<String> args) {
  const p1 = Doge('adic');//实例化的结果使用const前缀
  const p2 = Doge('adic');
  print(identical(p1, p2)); //true,identical(a,b)函数检查ab两对象是否相同
}
// class
final String name; //定义的常量必须使用final前缀
const Doge(this.name); //定义的构造函数使用const前缀
```

##### 6.工厂构造函数

```dart
// 用于优化性能等
void main(List<String> args) {
  final p1 = Doge('adic');
  final p2 = Doge('adic');
  print(identical(p1, p2)); // true
}
class Doge {
  String name;
  static final Map<String, dynamic> _cache = <String, Doge>{}; // 创建缓存map
  factory Doge(String name) {
    if (_cache.containsKey(name)) { //判断创建对象是否已经存在
      return _cache[name]; //找到且返回老对象
    } else {
      final p = Doge._internal(name); //没找到且创建新对象
      _cache[name] = p; //将新对象存入缓存map
      return p; //返回新对象
    }
  }
  Doge._internal(this.name); //创建新对象的方法
}
```

#### 继承

```dart
void main(List<String> args) {
  final p1 = Cordg('adic', 'boy');
  p1
    ..typeSay()
    ..says();
}
class Doge {
  String type;
  Doge(this.type);
  void says() {
    print('i am doge');
  }
  void typeSay() {
    print('i am $type doge');
  }
}
class Cordg extends Doge {
  String name;
  Cordg(this.name, String type) : super(type); // 为子、父类定义参数
  //重写父类方法
  @override
  void says() {
    print('i am doge,said $name');
  }
}
```

#### 抽象

```dart
void main(List<String> args) {
  final p1 = Circle(3);
  final p2 = Rectancle(10, 2);
  calcuArea(p1);
  calcuArea(p2);
}

// 创建抽象类
abstract class shape {
  getArea();
}

class Circle extends shape {
  double r;
  double pi = 3.14;
  Circle(this.r);
  double getArea() {
    return r * r * pi;
  }
}

class Rectancle extends shape {
  double height;
  double width;
  Rectancle(this.height, this.width);
  double getArea() {
    return height * width;
  }
}

void calcuArea(shape x) {
  print(x.getArea());
}

```

#### 混入

```dart
void main(List<String> args) {
  final p1 = Person('jack');
  p1.play(); // i can play，后定义会覆盖mixin
  p1.say(); // i can bb
  print(p1.froms); // china
}

mixin Handle {
  void play() {
    print('i can dio');
  }

  void say() {
    print('i can bb');
  }
}
mixin Common {
  String type = 'common';
  String froms = 'china';
}

class Person with Common, Handle { // 支持多混入
  String name;
  Person(this.name);
  void play() {
    print('i can play');
  }
}
```

#### 枚举

```dart
void main(List<String> args) {
  print(Cpus.Amd); // index获取对应下标
}
enum Cpus { Amd, Intel }
```

### 四.库

```dart
import ''; //导入
import '' show Xxx,Yyy; //选择导入
import '' hide Xxx,Yyy; //选择隐藏
import '' as Xxx; //空间命名导入，使用是Xxx作为前缀

export '';//模块中导入其他模块
```



### *.其他

1. 没有非0、空即真
2. List去重 `List.from(Set.from(xxx))`
3. List操作：add/contains/remove(添加/是否存在/移除)
4. 新运算符：`~/`整除运算符；`??`条件运算符，类似于`||`；`..`级联运算符，用于处理对象实例化后的连续链式调用
5. 新赋值：`??=`如果值为null，则以后面内容赋值
6. dynamic和object的差别；dynamic为可变推导类型，结果类型不唯一；object为顶层类型，即dart所有对象的父类，所以定义后默认不会再改变