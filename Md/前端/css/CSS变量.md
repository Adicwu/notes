> 你还在因为js直接操作css样式而烦恼吗，你还在不知如何做全局样式而备受折磨吗？恭喜你，看见了本文。
>
> 本文将讲解Css变量的便利性以及日常开发使用

### 一.基础

> 顾名思义，变量说的是存在动态变化的量，而js操作的一般只是一对一，而css则可以利用变量特性实现一对多性质

#### 1.1 声明

```less
// 在任意样式中定义
:root {
    --root-color: #def;
    --root-font-famliy: '微软雅黑';
}
body {
    --body-font-size: 16px;
    --body-box: flex;
    --body-theme-color: #000;
    --top: calc(2vh + 10px);
}
#app {
    --app-theme-color: #fff;
}
```

**注意**

1. 因为是css本身的东西，所以less和scss中同样不影响使用，且基本上不需要考虑兼容问题
2. 声明是向下的，只有其自身和子节点可访问，无法在外层访问
3. 名称大小写敏感，`--APP-color` 和 `--app-color` 是两个变量

#### 1.2 使用

```less
/**
 * var函数用于读取变量
 * @param name 读取的变量名称
 * @param defaultValue 默认值，没有找到对应的名称时的值，不在乎逗号、空格、冒号等
 * @returns 对应的值
 */
#app {
    --app-theme-color: #fff;
    --app-height: 90vh;
    .app-content {
        width: var(--app-width, 100vw); // 此处为默认值实例
        height: calc(var(--app-height) - 100px);
        border: var(--app-border,1px solid #000); // 此处为默认值实例
        .app-content__aside {
            background: var(--app-theme-color);
        }
    }
}
```

**注意**

1. 变量仅作用于值，不能使用来定义属性名称

#### 1.3 扩展

可与其他变量值拼接

```less
--base: 'adic';
--full-name: var(--base)' wu'; // 相当于adic wu
```

如果变量值为数字，那么需要使用`calc`方法

```less
--size: 100;
height: calc(var(--size) * 1px)
```

### 二.作用域

与css层叠（cascade）规则相同

### 三.js交互操作

#### 1.1 检查是否支持css变量

```javascript
const isSupported =
  window.CSS &&
  window.CSS.supports &&
  window.CSS.supports('--a', 0);

if (isSupported) {
  /* supported */
} else {
  /* not supported */
}
```

#### 2.2 操作css变量

```typescript
const el: HtmlElement; // 需要操作的节点
el.style.setProperty('--xxx','xx') // 设置
el.style.getPropertyValue('--yy').trim() // 读取
el.style.removeProperty('--zz') // 删除
```

#### 2.3 利用css变量实现js间的通信

```less
// css变量不会执行js代码，尽管传入的像js代码。我们可以使用此特性进行js文件间的通讯
--login-type: if(type === 'qq') this.xx = 1;
```

### 结语

参考链接：[CSS变量教程 - 阮一峰](https://www.ruanyifeng.com/blog/2017/05/css-variables.html) https://www.ruanyifeng.com/blog/2017/05/css-variables.html