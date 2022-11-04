## SOLID 原则

[原文出处](https://github.com/xitu/gold-miner/blob/master/TODO/solid-principles-the-definitive-guide.md)

> SOLID是一种设计模式中的规范，分为`单一职责原则/开闭原则/里氏替换原则/接口隔离原则/依赖倒转原则 `五大原则，用于提升代码的可读性、健壮性。本原则均适用于前后端，本文以前端的角度阐述

### 提要

在讲解五大原则之前，我们需要搞清楚两个在开发领域常见的词汇：`耦合`与`内聚`。

耦合，指两者之间的依赖程度。通俗来说，就是功能A与功能B的关联程度，假设功能B建立在功能A的前提下，就代表两者高耦合。而我们日常开发中，这种情况常常是不愿意见到的，故我们需要的是关联度较低的，`低耦合`

内聚，这个概念正好与耦合相反。通俗来说，功能A只会影响功能A自己，功能A仅供他人使用，就代表`高内聚`。我们日常开发中，这种做法是被推崇的，而组件的概念就是如此

### 单一职责原则（SRP：Single Responsibility Principle）

> 我只做一个功能，其他功能和我没关系

**BAD**

```javascript
class Customer {
    // 保存用户
    private saveCustomer() {}
    // 生成用户记录
    private generateCustomerReport() {}
}
```

**GOOD**

```javascript
class Customer {
    // 保存用户
    private save() {}
}
class CustomerReport {
    // 生成用户记录
    private generate() {}
}
```

*这样，我们生成的功能没有关联，有独自的职责，使他变成了高内聚低耦合*

### 开闭原则（OCP：Open  Closed Principle）

> 你能加新功能，但别动我老代码

**BAD**

```javascript
class Rectangle {
    private width;
    private height;
}
class Square {
    private side;
}
public class ShapePrinter {
    public draw(shape) {
        if (shape instanceof Rectangle) {
            // Draw Rectangle...
        } else if (shape instanceof Square) {
            // Draw Square...
        }
    }
}

new ShapePrinter(new Rectangle())
```

**GOOD**

```javascript
class Rectangle {
    private width;
    private height;
    public void draw() {
        // Draw Rectangle...
    }
}
class Square {
    private side;
    public void draw() {
        // Draw Square...
    }
}
public class ShapePrinter {
    public draw(shape) {
        shape.draw()
    }
}

new ShapePrinter(new Rectangle())
```

*现在，我们在新加形状时，ShapePrinter类不再需要增加判断，同时也不会影响新旧形状*

### 里氏替换原则（LSP：Liskov Substitution Principle）

> todo，暂时理解不了场景

### 接口隔离原则（ISP：Interface Segregation Principle)

> 我不用用不到的接口内容

**已存在内容**

```typescript
interface Car {
	start();
	bell();
}

class Bus implements Car {
    public start() {}
    public bell() {}
}
```

接到新需求：新加一种Car，它可以飞

**BAD**

```typescript
interface Car {
	start();
	bell();
    fly();
}

class Bus implements Car {
    public start() {}
    public bell() {}
    public fly() {
        // 实际上他不会飞
    }
}
class FlyCar implements Car {
    public start() {}
    public bell() {}
    public fly() {
        // fly...
    }
}
```

**GOOD**

```typescript
interface Car {
	start();
	bell();
}
interface FlyCar {
    fly();
}

class Bus implements Car {
    public start() {}
    public bell() {}
}
class FlyCar implements Car, FlyCar {
    public start() {}
    public bell() {}
    public fly() {
        // fly...
    }
}
```

### 依赖倒转原则（DIP：Dependency Inversion Principle)

> 只能低依赖高

**BAD**

```typescript
class GoldenRetriever {
    private shout() {}
}

class Person {
    private shoutingDog() {
        const dog = new GoldenRetriever();
        dog.shout()
    }
}
```

接到新需求：新加一条狗

**GOOD**

```typescript
interface Dog {
    shout();
}
class GoldenRetriever implements Dog {
    private shout() {}
}
class Pomeranian implements Dog {
    private shout() {}
}

class Person {
    private dog;
    private setDog(dog) {
        this.dog = dog
    }
    private shoutingDog() {
        this.dog.shout()
    }
}
```

