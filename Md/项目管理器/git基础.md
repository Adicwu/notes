### 命令

- 创建文件夹：mkdir 名称
- 显示当前目录列表：ls
- 显示当前目录详细列表：ll
- 居然指定下级目录：cd 路径
- 新增库：git init
- 修改git配置信息：git config xx.xx 值
- 项目克隆：git clone 地址
- 删除指定位置：rm -rf 路径名称。*为当前目录全删
- 查看当前可被add内容：git status。红色为待添加(git add)，绿色为已准备添加
- 项目add：git add *

### 快捷操作

- 清屏：ctrl+L

### 文件配置

#### .gitignore 忽略文件配置

- 直接写入名称则不被add，如果是目录则整个目录不被add；*.文件类型表示此文件类型不被add

