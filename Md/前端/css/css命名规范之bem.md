> BEM的命名规矩：`block-name__element-name--modifier-name，也就是模块名__元素名--修饰器名`

- 子选择器。尽量不使用子选择器，使用`.page-btn__list`替代`.page-btn .list`
- less中子选择器不能超过四层嵌套
- 修饰器。当类名为动态切换时，使用` .block__element.is-active`替代`.block__element--active`
- 原子类(全局独立类)。尽量使用在实际页面中而不是组件中

