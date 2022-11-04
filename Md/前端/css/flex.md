## flex弹性布局

> 将容器定义为有横纵轴的弹性模型

------

### 一.容器定义

- display: flex 将容器定义为弹性容器
- flex-direction 设置容器排序方式，默认为row，row左到右、主轴为横向/column上到下、主轴为纵向
- flex-wrap 溢出容器处理，默认为挤压，wrap超出折行

##### 简写

- flex-wrap+flex-wrap：  flex-flow: wrap direction;

------

### 二.盒模型

#### 1.分布方式

`justify-content` 主轴的整体分布方式；`align-content` 辅轴的分布方式

- flex-start 以开始排布
- flex-end 以结束排布
- center 整体性居中	
- space-around 以每行居中
- space-between 平均居中 左右最边靠边
- space-evenly 完全性平均居中 左右间隔相同



`align-items` 辅轴的整体分布方式 ；`align-self` 单个元素辅轴的位置

- flex-start
- flex-end
- center
- stretch 拉撑 将子盒子以辅轴的高度拉满，权重低于直接设置高宽，故子盒子不能设置高宽



`align-content`辅轴在多行时每行的分布方式，值同`justify-content`

`order` 单个原生的排序位置，类似于z-index；注意，这个排序是基于兄弟元素的order值的，未设置值的永远会在设置值的元素之前

#### 2.基础轴

- flex-grow 可用位置分配宽度大小，大小随其他设置的分区大小改变
- flex-shrink 可用位置分配宽度缩小比例，大小随其他设置的分区大小改变，设置flex-wrap:warp时无效
- flex-basis 定义主轴的宽度，权重大于度，权重小于max、min度
- 简写 flex:  grow shrink basis



### 三.注意事项

- 对flex内部元素使用定位position时，相对定位性质依然存在，也不会影响兄弟元素，但绝对定位会（相当于此元素以不算flex内部内容）