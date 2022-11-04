## TypeScript类型体操

> ts类型体操相当于ts的面试题；但此面试题会涵盖很多特性与常规文档所不常用的关键字，故建议过一遍

[类型体操挑战平台](https://github.com/type-challenges/type-challenges)



### 入门篇

#### Exclude 去除

> 三元判断是否为我们不需要的类型；联合类型 | 中never会被无视

```typescript
type _Exclude<T, K> = T extends K ? never : T;

type Obj = 'a' | 'b' | 'c';

type x1 = Exclude<Obj, 'a'>;
type x2 = _Exclude<Obj, 'a'>;
```



#### Pick 检出

> type map

```typescript
type _Pick<T, K extends keyof T> = {
  [P in K]: T[P];
};

interface Obj {
  name: string;
  age: number;
  sex: 0 | 1;
}

type x1 = Pick<Obj, 'sex' | 'age'>;
type x2 = _Pick<Obj, 'sex' | 'age'>;
```



#### Readonly 只读

> type map；只读声明

```typescript
type _Readonly<T> = {
  readonly [P in keyof T]: T[P];
};

interface Obj {
  name: string;
  age: number;
  sex: 0 | 1;
}

type x1 = Readonly<Obj>;
type x2 = _Readonly<Obj>;
```



#### TupleToObject 元组转对象

> T约束为只读数组类型；type map

```typescript
type TupleToObject<T extends readonly any[]> = {
  [P in T[number]]: P;
};

const tuple = ['tesla', 'model 3', 'model X', 'model Y'] as const; // 声明专为枚举
type result = TupleToObject<typeof tuple>;
```



#### First/Last 元组的头/尾

> infer可在extends后配合三元当占位使用；...展开运算符占位不需要的内容

```typescript
// type First<T extends unknown[]> = T[0];
type First<T extends unknown[]> = T extends [infer V, ...unknown[]] ? V : never;
type LAST<T extends unknown[]> = T extends [...unknown[], infer V] ? V : never;

type arr1 = ['a'];
type arr2 = [3, 2, 1];

type head1 = First<arr1>; // expected to be 'a'
type head2 = First<arr2>; // expected to be 3
type head3 = LAST<arr1>; // expected to be 'a'
type head4 = LAST<arr2>; // expected to be 1
```



#### Length 元组长度

> 类似于原型操作

```typescript
type Length<T extends readonly unknown[]> = T['length'];

type tesla = ['tesla', 'model 3', 'model X', 'model Y'];
type spaceX = ['FALCON 9', 'FALCON HEAVY', 'DRAGON', 'STARSHIP', 'HUMAN SPACEFLIGHT'];

type teslaLength = Length<tesla>; // expected 4
type spaceXLength = Length<spaceX>; // expected 5
```



#### Awaited promise返回类型

> infer取Promise泛型内的类型；递归类型取最终结果

```typescript
type _Awaited<T> = T extends Promise<infer U> ? _Awaited<U> : T;

type Obj1 = Promise<Promise<string>>;
type Obj2 = Promise<string>;

type Result1 = Awaited<Obj1>; // string
type Result2 = _Awaited<Obj1>; // string
type Result3 = _Awaited<Obj2>; // string
```



#### If bool选择返回

> extends可继承于实际类型的值

```typescript
type If<F extends Boolean, A, B> = F extends true ? A : B;

type A = If<true, 'a', 'b'>; // expected to be 'a'
type B = If<false, 'a', 'b'>; // expected to be 'b'
```



#### Concat - Array.concat

```typescript
type Concat<A extends unknown[], B extends unknown[]> = [...A, ...B];

type Result = Concat<['x', 1], [2]>; // expected to be ['x', 1, 2]
```



#### Includes - Array.includes

> TupleToObject 原理；

```typescript
type Includes<A extends unknown[], B> = B extends A[number] ? true : false;

type isPillarMen = Includes<['Kars', 'Esidisi', 'Wamuu', 'Santana'], 'Kars'>; // expected to be `true`
```



#### Parameters 函数参数转列表

```typescript
type _Parameters<T> = T extends (...args: infer U) => void ? U : never;

const foo = (arg1: string, arg2: number): void => {};

type FunctionParamsType1 = Parameters<typeof foo>; // [arg1: string, arg2: number]
type FunctionParamsType2 = _Parameters<typeof foo>; // [arg1: string, arg2: number]
```



### 进阶篇

#### ReturnType 函数返回值类型

> extends后的类型需严格判断，如下 本身fn携带了参数，如果在extends不携带参数就会认为函数类型不同，无法解析U

```typescript
type _ReturnType<T> = T extends (...args: any[]) => infer U ? U : never;
// type _ReturnType<T> = T extends () => infer U ? U : never; // useless

const fn = (v: boolean) => {
  if (v) return 1;
  else return 2;
};

type a1 = ReturnType<typeof fn>; // 应推导出 "1 | 2"
type a2 = _ReturnType<typeof fn>; // 应推导出 "1 | 2"
```



#### Omit 忽略

> Exclude原理；type map

```typescript
type _Omit<T, K> = {
  [P in Exclude<keyof T, K>]: T[P];
};

interface Obj {
  name: string;
  age: number;
  sex: 0 | 1;
}

type x1 = Omit<Obj, 'sex'>;
type x2 = _Omit<Obj, 'sex'>;
```



#### Readonly2 只读，携带键参数，不传则默认全部

> type map；只读声明；Exclude；联合类型；泛型默认值

```typescript
type _Readonly2<T, K extends keyof T = keyof T> = {
  readonly [P in K]: T[P];
} & { [P in Exclude<keyof T, K>]: T[P] };

interface Obj {
  name: string;
  age: number;
  sex: 0 | 1;
}

type x = _Readonly2<Obj, 'sex'>;
```



#### DeepReadonly 深度只读

> 类型递归；需判断当前转换值是否为函数或对象

```typescript
type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends Function ? T[P] : T[P] extends object ? DeepReadonly<T[P]> : T[P];
};

type X = {
  x: {
    a: 1;
    b: 'hi';
  };
  y: 'hey';
};

type Expected = {
  readonly x: {
    readonly a: 1;
    readonly b: 'hi';
  };
  readonly y: 'hey';
};

type Todo = DeepReadonly<X>; // should be same as `Expected`
```



#### Chainable 可串联构造器

> 递归与泛型参数；同名键先删除上一个

```typescript
type Chainable<T = {}> = {
  option: <K extends string, V>(
    a: K,
    b: V
  ) => Chainable<
    Omit<T, K> & {
      [P in K]: V;
    }
  >;
  get: () => T;
};

declare const config: Chainable;

const result1 = config.option('foo', 123).option('name', 'type-challenges').option('bar', { value: 'Hello World' }).get();
const result2 = config.option('name', 'another name').option('name', 123).get();

// 期望 result1 的类型是：
interface Result1 {
  foo: number;
  name: string;
  bar: {
    value: string;
  };
}
// 期望 result2 的类型是：

type Result2 = {
  name: number;
};
```



#### TupleToUnion 元组转集合

```typescript
type TupleToUnion<T extends unknown[]> = T[number];
type Arr = ['1', '2', '3'];

type Test = TupleToUnion<Arr>; // expected to be '1' | '2' | '3'
```



#### PromiseAll - Promise.all

> 对于元组和数组类型来说，keyof返回的就是下标；类数组的概念同样在ts类型中有效；

```typescript
declare function PromiseAll<T extends unknown[]>(
  ps: readonly [...T]
): Promise<{
  [P in keyof T]: Awaited<T[P]>
}>

const promise1 = Promise.resolve(3)
const promise2 = 42
const promise3 = new Promise<string>((resolve, reject) => {
  setTimeout(resolve, 100, 'foo')
})

// expected to be `Promise<[number, 42, string]>`
const p = PromiseAll([promise1, promise2, promise3] as const)
```



#### LookUp 根据字段值寻找其联合类型

> 联合类型分段特性；基础类型传值

```typescript
type LookUp<T, K> = T extends { type: K } ? T : never

interface Cat {
  type: 'cat'
  breeds: 'Abyssinian' | 'Shorthair' | 'Curl' | 'Bengal'
}

interface Dog {
  type: 'dog'
  breeds: 'Hound' | 'Brittany' | 'Bulldog' | 'Boxer'
  color: 'brown' | 'white' | 'black'
}

type MyDog = LookUp<Cat | Dog, 'cat'> // expected to be `Cat`
```



#### Trim - String.trim

> 考虑空格和实体字符；模板字符串可以用于string解构

```typescript
type Empty = ' ' | '\n' | '\t'

type TrimLeft<T extends string> = T extends `${Empty}${infer E}`
  ? TrimLeft<E>
  : T

type Trim<T> = T extends `${Empty}${infer E}` | `${infer E}${Empty}`
  ? Trim<E>
  : T

type trimed1 = TrimLeft<'  Hello World  '> // "Hello World  "
type trimed2 = Trim<'  Hello World  '> // "Hello World"
```



#### Capitalize 字符串首字母大写

> string解构；Uppercase将字符转大写

```typescript
type Capitalize<T extends string> = T extends `${infer F}${infer L}`
  ? `${Uppercase<F>}${L}`
  : T
type capitalized = Capitalize<'hello world'> // expected to be 'Hello world'
```



### Replace String.replace 

> string解构；拆前后取整体

```typescript
type Replace<
  S extends string,
  From extends string,
  To extends string
> = S extends `${infer F}${From}${infer L}` ? `${F}${To}${L}` : S

type replaced = Replace<'types are fun!', 'fun', 'awesome'> // 'types are awesome!'
```



### ReplaceAll String.replaceAll

> 递归；从末尾开始匹配，避免多次匹配

```typescript
type ReplaceAll<
  S extends string,
  From extends string,
  To extends string
> = From extends ''
  ? S
  : S extends `${infer F}${From}${infer L}`
  ? `${F}${To}${ReplaceAll<L, From, To>}`
  : S

type replaced1 = ReplaceAll<'t y p e s', ' ', ''> // types
type replaced2 = ReplaceAll<'foobarbar', '', 'foo'> // foobarbar
type replaced3 = ReplaceAll<'foobarfoobar', 'ob', 'b'> // fobarfobar
```



### 困难篇

### BOSS篇