### 项目说明
门户聚合项目，主要作为分治系统和jenkins的沟通桥梁。

### 注意事项
- 该项目只作为不同环境不同依赖包的版本控制
- 该项目的依赖将部门仓库作为唯一来源
- 请勿在该项目依赖任何非子项目包
- 请勿在该项目做任务和版本控制无关的操作
- 请勿随意修改init脚本的初始化状态
- 添加环境时，环境脚本中务必携带extract和reset指令