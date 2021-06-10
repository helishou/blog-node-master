
# 个人博客

   [博客文章链接](http://wangxinyang.xyz/article/60c027af538f510268ba51b4) 

- 前台展示  [github链接](https://github.com/helishou/react-blog-acg)  [演示地址](http://www.wangxinyang.xyz)
- 后台管理  [github链接](https://github.com/helishou/blog-react-admin)  [演示地址](http://admin.wangxinyang.xyz)
- 后端接口   [github链接](https://github.com/helishou/blog-node-master)  

## 项目描述

此项目为一个前后台分离的的 SPA, 包括**前端跨端展示应用**,**后端应用**,**前端后台管理应用**,采用模块化、组件化、工程化的模式开发。

### 展示应用

- 包括 登陆 / 文章分类 / 标签墙 / 时间轴 / 文章详情 / 友情链接 / 文章搜索等功能模块
- 使用 React 全家桶 + Antd + Axios + ES6 + Webpack + Redux 等技术

### 管理应用

- 包括 用户管理 / 文章管理 / 文章创作 / 标签管理 / 分类管理 等功能模块
- 使用 AntdPro 进行二次开发

### 后端
- 使用 Node + Express + Mongodb 等技术

## 详细描述

### 展示应用

1. 利用响应式 + 弹性布局 + viewport 实现移动端适配
2. 利用 redux  + react-redux +redux-thunk + redux-immutable进行状态管理
3. OAuth 实现网页登陆接入
4. CSS 实现动画效果，如标题旋转，首页文章列表向上浮现等
5. 利用正则表达式实现相关内容展示以及搜索功能
6. 利用 react-loadable 实现懒加载，优化首屏加载速度
7. 利用 cookies 持久化登陆，实现同域名下登陆状态共享
8. 利用 marked  和 highlight.js 展示markdown文章
9. react-images 实现文章内的图片大图查看
10. 利用 meta 的 referrer 实现跨域图片引用
11.  cdn 优化字体，静态 js ，css 等文件，提高访问速度

### 管理应用

1.  使用 dva 进行状态，路由管理

2.  利用拦截器对未登录用户进行权限限制

3.  利用 marked ,simpleMDN,  highlight.js 写markdown文章

4.  利用 antd form 等组件实现了用户管理 / 文章管理 / 标签管理 / 分类管理等功能模块的增删改查