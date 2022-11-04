**核心：reactive provide/inject plugin effectScope**

1. 使用vue的plugin注册，将使用effectScope创建的store总集，通过provide挂载到项目vue根实例上；
2. 在声明store时，将其配置参数进行处理（state返回值的reactive响应处理，getter使用computed进行封装，action进行this绑定），将其，通过inject获取全局的store总集，创建新store（或取出），并返回供使用
3. 在创建新store时，会将创建一个reactive作为当前store的依赖底座，将state、getter、actions一同放入，期间需处理好this指向以及响应关系

