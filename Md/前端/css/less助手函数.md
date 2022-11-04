1. `image-size/image-width/image-height`：根据给定本地图片来获取`宽高/宽/高`
2. `data-uri`：根据给定本地图片将其转换为`url(base64)`格式
3. `get-unit`：返回传入值单位，如px
4. `e`：css转义，e(value)代替~value
5. `replace`：字符串替换，replace(原字符串,被替换字符串,替换后字符串)
6. `length/extract`：列表(假设列表@list: apple, pear, coconut；开始下标为1)操作，length(@list)返回其长度，extract(@list,index)返回其index文章内容
7. `ceil/floor`：向上/下取整
8. `percentage`：浮动转百分比字符串
9. `round`：应用取舍，round(num,y=0) 将数字num化为小数点后y位，且四舍五入
10. `abs`：取绝对值
11. `sin/asin/cos/acos/tan/atan`：懂得都懂
12. `min/max`：获取传入内容最小/大值，支持单位混入，最高支持两种单位
13. `iscolor/isurl`：判断是否为`颜色/url格式(url(‘’))`，返回bool
14. `ispixel/isem/ispercentage/isruleset`：判断是否为`px单位/em单位/%单位/规则集`，返回bool

