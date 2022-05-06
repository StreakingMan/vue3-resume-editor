<div style="display: flex;justify-content: center">
    <img alt="icon" style="width:300px" src="public/favicon.svg"/>
</div>

# Vue3 Resume Editor

![version](https://img.shields.io/github/package-json/v/StreakingMan/vue3-resume-editor)
![license](https://img.shields.io/github/license/StreakingMan/vue3-resume-editor)
![stars](https://img.shields.io/github/stars/StreakingMan/vue3-resume-editor?style=social)
![forks](https://img.shields.io/github/forks/StreakingMan/vue3-resume-editor?style=social)
![issues](https://img.shields.io/github/issues/StreaKingman/vue3-resume-editor)
![commit-activity](https://img.shields.io/github/commit-activity/m/StreakingMan/vue3-resume-editor)
![last-commit](https://img.shields.io/github/last-commit/StreakingMan/vue3-resume-editor)

![production-state](https://img.shields.io/github/deployments/StreakingMan/vue3-resume-editor/Production?label=proccution%20state)
![preview-state](https://img.shields.io/github/deployments/StreakingMan/vue3-resume-editor/Preview?label=preview%20state)

[在线地址：https://resume-editor.streakingman.com/](https://resume-editor.streakingman.com/)

![resume-editor](src/assets/previews/app.png)

vue3+ts 学习项目，web 简历编辑器，轻松制作一份精美简历

- 免费
- 灵活，高自由度
- 纯前端应用，不收集隐私数据

## 目录
- [功能演示](#功能演示)
  - [基础元素](#基础元素)
  - [元素缩放控制](#元素缩放控制)
  - [元素操作栏](#元素操作栏)
  - [元素配置面板](#元素配置面板)
  - [对齐&分组](#对齐&分组)
  - [画布操作](#画布操作)
  - [画布移动&缩放](#画布移动&缩放)
  - [使用模板](#使用模板)
  - [打印/另存PDF](#打印/另存PDF)
- [TODO](#TODO)
- [参与贡献](#参与贡献)

## 功能演示

### 基础元素

![](src/assets/previews/drag-material.gif)

### 元素缩放控制

![](src/assets/previews/resize-material.gif)

### 元素操作栏

点击元素激活操作栏，包含移动、复制、层级调整、删除、配置面板唤出操作

![](src/assets/previews/operte-material.gif)

### 元素配置面板

唤出配置面板，配置元素支持的配置项

![](src/assets/previews/config-panel.gif)

### 对齐&分组

按住shift点击元素进行多选后，可进行对齐和编组操作

![](src/assets/previews/align-and-group.gif)

### 画布操作

画布支持辅助网格、背景色、视口缩放控制

![](src/assets/previews/page-operate.gif)

### 画布移动&缩放

按住空格可拖拽视口，按住ctrl缩放滚轮快捷操作视口缩放

![](src/assets/previews/paper-move-resize.gif)

### 使用模板

![](src/assets/previews/use-template.gif)

### 打印/另存PDF

![](src/assets/previews/print.gif)

## TODO

- [ ] qianduan.pro评级卡片接入
- [ ] 历史记录、撤销、重做
- [ ] 多页模式
- [ ] 组合套件
- [ ] 键盘移动
- [ ] 交互优化

## 参与贡献

- 欢迎提交issue和PR！
- 分享模板也可以通过提交PR的方式，导出简历的json配置文件，放在```src/components/templates```即可。
