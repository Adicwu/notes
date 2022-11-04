### 基本语法

#### 1.变量声明

```typescript
//定义: 定义时必须声明数据类型，且不能直接更改数据类型。当定义的同时赋值，则可省略声明数据类型
let Name: string = 'bob';
//name = 18 // 则报错

//联合类型
let ages: number | string;
ages = 18;
ages = '18';

//数组在定义时必须声明内容数据类型
let arrL: string[] = ['lucy', 'jack'];
let arrR: Array<number> = [1,3,5];
```

#### 2.函数声明

```typescript
//定义：定义时必须指明函数返回值类型，且指明后必须返回对应数据类型的值，如果不想有返回值，则定义void类型
function says1(): string { return 'hellow' }
function says2(): void {}

//携带形参时需要指定其类型，在传入时也必须为同类型
//age与name一般形参，调用时必须赋值；
//says带有默认值的形参，可在调用时不赋值；
//tips可在调用时不赋值；
//...arg,当想获取其他传入的形参时，可在接收的形参名称前添加...且定义成有数据类型的数组形式
function sayInfo(age: number, name: string, says: string = 'hellow', tips?: object, ...arg: string[]): void {
    console.log(says + ' ' + age + ' ' + name, tips);
    console.log(arg);
}
//在调用时，如果想跳过某个可以不赋值的参数时，直接为这个参数赋值undefined
sayInfo(18, 'adic', undefined, { job: 'compute' }, '略略略', 'emmm')
//输出 hellow 18 adic {job: "compute"}
//输出 ["略略略", "emmm"]
```

#### 3.形式声明

> 此声明更多用于对非.ts文件（常见于不支持ts的js库）的类型声明，是一种其他文件与ts文件一起使用的错误修正（完善）方法；也常作用于全局声明

```typescript
// env.d.ts

// 此处为vue3中的环境配置，为了使ts文件中能正常引入vue文件，告诉编译器vue文件为一个module
declare module '*.vue' {
  import { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

// 此处为video.js扩展自定义属性sss
declare module 'video.js' {
  export const sss: string
}

// 全局类型Id
declare type Id = string | number
```

#### 4.命名空间

> 注意，不推荐此写法，但有时候会用到（ES2015 module syntax is preferred over custom TypeScript modules）

```typescript
// 声明 skill.ts
namespace Skill {
    const TIMEOUT = 100;
    
    export interface Person {
        age number;
    }

    export class Fly {
        // ...
    }

    export function say(){
        console.log(TIMEOUT);
    }
}
```

```typescript
// 使用
<reference path="skill.ts" />

const lucy: Skill.Person = {
    age: 18
}
const jum = new Skill.Jump();
```

#### 5.声明断言

##### 类型断言

```typescript
// 默认情况下不使用断言会警告，因为监测默认不知道节点内置api
(document.getElementById('xx') as any).clientHeight
// 或
(<any>document.getElementById('xx')).clientHeight
```

##### 非空断言

```typescript
// 默认情况下，定义未赋值但声明了数据类型，在使用时会监测是否为指定类型，如果不同，则会报错，如下
let x: number; 
// let x!: number; // 使用!下面的Error则消除
setNum(3);
console.log(x*2); // Error
function setNum(num:number){
	x=num;
}

// 在以上操作中，我们声明了x为number类型，未赋值；但在后续使用前我们使用setNum方法为其赋值，然后再使用；编辑器在监测时较为直接，所以会认为x为未赋值（实际上已有值），所以需要使用!告诉监测x为非空
```

##### 可选断言

```typescript
// 在某些业务下，某些定义的内容可能被使用，也有可能不被使用

// 函数可选参数
function(name:string,age?:number){}

// vue+ts中的prop
@Prop() isOk?:boolean;

// 对象定义 可选属性
interface Person {
  age?: number;
}
```



### 新数据类型

#### 1.元组

> 规定了元素数量和元素类型的数组，而每个元素的类型可以不同

```typescript
//定义
let tup1: [string, number, boolean] = ['adic', 18, true]
```

#### 2.枚举

> 类似于对象和类的结合体

```typescript
//定义
enum Gender {
    Boy = 1,
    Girl = 2,
    UnKnown = 3
}

//使用
let userSex: Gender = Gender.Boy
console.log(userSex)
```

#### 3.任意类型

> any表示不在乎的类型，会跳过类型检查，作为ts的逃生舱，尽量不用

#### 4.不知道的类型

> unknown，更好的any。any会完全放弃对变量的类型判断，unknown则不行，unknown需要手写对其变量的类型判断，再进行不同的操作

```typescript
function sta(cb: any) {
  cb() // 类型检查正常
}
sta(123) // 执行报错 Uncaught TypeError: cb is not a function

// ------------------- //

function sta(cb: unknown) {
  // cb() // 类型报错 对象的类型为 "unknown"
  if (typeof cb === 'function') {
    // 类型检查正常
    cb()
  }
}
sta(123) // 执行正常
```

#### 5.没有类型

> void表示没有类型，一般用在没有返回值的函数

#### 6.不存在的值类型

> never表示不存在的值类型，一般用在抛出异常或无限循环的函数返回类型

#### 7.自定义\联合类型

```typescript
type Value =  string | number;
```



### 接口

> 定义类或对象的形状，可定义多个同名接口，其会被合并

#### 1.只读、可选

```typescript
interface Person {
  readonly name: string;
  age?: number;
  (x: number, y: number): void; // 此处为方法定义
}

// 定义只读数组
const arr ReadonlyArray<number> = [1,2,3];
arr.push(1) // 报错
arr[1] = 3 // 报错
arr.length = 2 // 报错
arr = [] // 报错
```

#### 2.任意属性

总会有遇见不可知的对象属性，所以提供定义未知属性的方法

```typescript
interface Person {
  [propName: string]: any; 
}
```

#### 3.属性类型合并

```typescript
interface A { x: number; }
interface B { y: string; }
interface C { z: boolean; }

type AB = A & B & C;
```



### 泛型

> 在面对不确定传入类型，而内部又需要使用此类型时使用。在vue3中的组合式api很常见

```typescript
// N T相当于类型变量，可在调用函数时传入，但大多数时候不传，因为会自动根据参数类型传入
function say<N, T>(name: N, text: T): T {
  console.log(name);
  return text;
}
say('adic','vue') // 或 say<string, string>("adic", "vue");

interface Obj<T> {
    name: string;
    skills: T;
}
const xx: Obj<{ main: string }> = {
    name: 'adic',
    skills: {
        main: 'code'
    }
}
```

#### extends 类型约束

```typescript
interface A {
  name: string;
}
interface B {
  name: number;
  age: number;  
}

// 结果 { name: never; age: numbre; }
// 当遇见一个属性有多种不同类型时，则会变为never
interface C extends A, B {
    age: number;
}

function say<T extends A>(obj: T) { // 设置泛型T继承于A接口
  return obj;
}
say({}); // 报错
say({ name: "XX" }); // 通过
```



### 操作符

#### 1.keyof

```typescript
interface A {
  name: string;
  age: number;
}
type As = keyof A; // 相当于'name' | 'age' 。将A接口的所有键名称转换为字符串，定义为新类型
type Bs = A[keyof A]; // 索引访问，相当于 'name' | 'age'

const ss: As = 'age'
console.log(ss);
```

#### 2.infer 捡取函数参数或者返回值

> 注意，infer P中，infer只能在extends后使用，且P只能放在条件判断的 真 位置

```typescript
type Xs<T> = T extends () => infer P ? P : any
type As = Xs<() => string> // string

type Xs<T> = T extends (...args: infer P) => any ? P : T
type As = Xs<(age: number, name: string) => boolean> // [age: number, name: string]
type Bs = As[0] // number

type Xs<T> = {
  [K in keyof T]: T[K] extends infer U ? U : T
}[keyof T]
type As = Xs<{ // string | number
  name: string
  age: number
}>
```

#### 2.is 类型保护

```typescript
// const isString = (val: unknown) => typeof val === 'string' // error，返回值只知道是bool
const isString = (val: unknown): val is string => typeof val === 'string' // success，知道返回值为true时 val为字符串
const aa = Math.random() < 0.5 ? null : 'xsa'

isString(aa) && aa.substring(0, 1)
```



### 高级工具类型

#### 1.Record

> 将一个类型的所有属性值都映射到另一个类型上并创造一个新的类型

```typescript
type SortProps = 'date' | 'num'
interface SortPropInfo {
  list: any[];
  order: 'desc' | 'asc'
}
const sort: Record<SortProps, SortPropInfo> = {
  date: {
    list: [],
    order: 'desc'
  },
  num: {	
    list: [],
    order: 'desc'
  }
  // ...此处不能定义非SortProps属性且不能少定义
}
```

#### 2.Readonly

> 将一个类型定义为只读类型，可用于约束对象

```typescript
interface Obj {
	name: string;
    age: number;
}
const aa: Readonly<xx> = {
    name: 'adic',
    age: 18
};
aa.name = 'lucy' // error
```

#### 3.Pick/Omit

> 将组属性中的指定属性检出/筛选

```typescript
interface Obj {
	name: string;
    age: number;
    size: number;
}
type Name = Pick<Obj, 'name'>
type Person = Omit<Obj, 'size'>

const aa: Name = 18 // error
const lucy: Person = {
    name: 'lucy',
    age: 18,
    size: 1 // error
}
```

#### 4.Exclude/Extract

> 将联合类型A中存在的联合类型B内容去除/取联合类型中共有的内容

```typescript
interface A {
    name: string;
    age: number;
    size: number; 
}
interface B {
    size: number; 
}
type Nums = Exclude<1 | 2 | 3, 2 | 3>

const aa: Exclude<A,B> = {
    name: 'lucy',
    age: 18,
    size: 1 // error
}
const num: Nums = 2 // error

const bb: Extract<A, B> = {
    name: 'lucy', // error
    age: 18, // error
    size: 1 
} 
```

#### 5.Partial

> 将接口类型内所有属性转换为可选

```typescript
interface A {
    name: string;
    age: number;
}
const aa: Partial<A> = {
    name: 'adic'
}
```

#### 6.Parameters

> 接收一个函数类型，返回其参数元组

#### 7.ReturnType

> 接受一个函数类型，返回其返回值类型

```typescript
function fn() {
    return {
        say(){},
        name: 'adic',
        age: 18
    }
}

type FnReturn = ReturnType<typeof fn> // 相当于 { say:()=>void; name: string; age: number;}
type Say = FnReturn['say'] // 相当于 { say:()=>void; }      
```

#### 8.ConstructorParameters

> 接收一个类的类型，返回其构造函数的参数元组

#### 9.ThisType

> 为一个对象增加上下文类型this

```typescript
type Animal = {
  name: string
  shut: (word: string) => void
} & ThisType<{ type: string }>

let p: Animal = {
  x: 10,
  y: 20,
  shut(word) {
    this // {type: string}
  },
}
```



### 细节特性

1. 类型联合和继承中，如果两个相同属性却有不同的类型，则返回never

   ```typescript
   interface A {
       age: number;
   }
   interface B {
       age: string;
   }
   
   // { age: never }
   interface C extends A, B { }
   
   // { age: never }
   type D =  A & B
   ```

2. 父子集处理

   ```typescript
   // 集合论中，如果一个集合的所有元素在集合B中都存在，则A是B的子集；
   // 类型系统中，如果一个类型的属性更具体，则该类型是子类型。（因为属性更少则说明该类型约束的更宽泛，是父类型）
   interface Animal {
     name: string;
   }
   
   interface Dog extends Animal {
     break(): void;
   }
   
   let a: Animal;
   let b: Dog;
   
   // 可以赋值，子类型更佳具体，可以赋值给更佳宽泛的父类型
   a = b;
   // 反过来不行
   b = a;
   ```

   ```typescript
   type A = 1 | 2 | 3;
   type B = 2 | 3;
   let a: A;
   let b: B;
   
   // 不可赋值
   b = a;
   // 可以赋值
   a = b;
   ```
