1. 文字竖排：`writing-mode: vertical-rl;`

2. 文字倒叙：`letter-spacing: -1px`

3. 左重右轻（左边多个元素，右边一个元素，中间有不固定的间隙）：最后一个元素`margin-left:auto`

4. 伪类content取内容文字

   ```vue
   <p data-content="Adicwu">Adicwu</p>
   
   p::after {
   	content: attr(data-content);
   }
   ```

5. css控制表单内容验证样式

   ```vue
   // pattern+:valid+:invalid 实现
   <input type="text" pattern="^\d+$" />
   
   input[type='text'] {
   	outline: unset;
   }
   input[type='text']:valid { // 正确的类型
   	border-color: green;
   }
   input[type='text']:invalid { // 错误的类型
   	border-color: red;
   }
   ```

6. 禁止元素的事件触发：`pointer-events: none`

7. 保留动画起始帧：`transform-delay`或`animation-delay`设置负值

8. 宽高比盒子

   ```less
   // 最终比例为 16宽-9高 
   .box{
   	width: 200px;
   	padding-top: calc((9 / 16) * 100%);
   }
   ```

9. 不规则形状阴影：`filter: drop-shadow(0 0 4px rgba(0, 0, 0, 0.5))`

10. 中英文字体高度不同：设置height和line-height为相同大小

