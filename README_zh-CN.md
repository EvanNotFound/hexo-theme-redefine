<div align="right">
  <img src="https://img.shields.io/badge/-%E7%AE%80%E4%BD%93%E4%B8%AD%E6%96%87-A31F34?style=for-the-badge" alt="简体中文">
  <a title="en" href="README.md"><img src="https://img.shields.io/badge/-English-545759?style=for-the-badge" alt="english"></a>
  <a title="zh-TW" href="README_zh-TW.md"><img src="https://img.shields.io/badge/-%E7%B9%81%E4%BD%93%E4%B8%AD%E6%96%87-545759?style=for-the-badge" alt="繁体中文"></a>
</div>

<a href="https://redefine.ohevan.com"><img align="center" src="https://user-images.githubusercontent.com/68590232/226141917-68124e8f-fde0-4edd-b86d-c62932ec369a.png"  alt="Redefine"></a>


# hexo-theme-redefine

"Redefine" 是一个简洁、快速、纯净的 hexo 主题。简洁，但不简单。本主题包含很多广泛使用的功能，并拥有着优秀的设计。

本主题基于 [hexo-theme-keep](https://github.com/XPoet/hexo-theme-keep) 开发，感谢 XPoet 的开源。本主题主要优化了样式，增加了写作模块，以及各种插件的支持。同时加大自定义程度，让你可以更加方便的使用本主题。

<p align="center">
    <a href="https://www.npmjs.com/package/hexo-theme-redefine">
        <img src="https://img.shields.io/npm/v/hexo-theme-redefine?color=F38181&amp;label=version&amp;logo=npm&amp;logoColor=F38181&amp;style=for-the-badge" referrerpolicy="no-referrer" alt="NPM version" />
    </a>
    <a href="https://www.npmjs.com/package/hexo-theme-redefine">
        <img src="https://img.shields.io/npm/dw/hexo-theme-redefine?color=FCE38A&amp;logo=npm&amp;logoColor=FCE38A&amp;style=for-the-badge" referrerpolicy="no-referrer" alt="npm downloads" />
    </a>
    <a href="https://www.npmjs.com/package/hexo-theme-redefine">
        <img src="https://img.shields.io/npm/dt/hexo-theme-redefine?color=95E1D3&amp;label=total&amp;logo=npm&amp;logoColor=95E1D3&amp;style=for-the-badge" referrerpolicy="no-referrer" alt="npm-total" />
    </a>
    <a href="https://hexo.io"><img src="https://img.shields.io/badge/hexo-%3E=5.0.0-8caaee?style=for-the-badge&amp;logo=hexo&amp;logoColor=8caaee" referrerpolicy="no-referrer" alt="Required Hexo version" /></a>
    <img src="https://img.shields.io/badge/node-%3E=12.0-a6d189?style=for-the-badge&amp;logo=node.js&amp;logoColor=a6d189" referrerpolicy="no-referrer" alt="NodeJS Version" />
</p>


## 📷 屏幕截图

![redefine-1-final](https://github.com/EvanNotFound/hexo-theme-redefine/assets/68590232/1c4f802b-b949-4313-8935-6ea5178be9e3)

![redefine-2-final](https://github.com/EvanNotFound/hexo-theme-redefine/assets/68590232/bf6529a6-bce9-4388-899c-1d96325c49d6)

![redefine-3-final](https://github.com/EvanNotFound/hexo-theme-redefine/assets/68590232/33ee3d7c-189c-4b75-89c9-914b0cb63caf)

## 🌐 官方演示站

- [EvanNotFound's Blog](https://ohevan.com)
- [Theme Redefine 演示站点](https://redefine.ohevan.com)
- [Redefine 用户墙](https://redefine.ohevan.com/showcase)

如果你也在使用 Redefine，欢迎在前往 [Redefine 用户墙](https://redefine.ohevan.com/showcase) 添加你的博客链接。

## ⛰️ 部分功能

- [笔记模块](https://redefine-docs.ohevan.com/modules/notes)
- [友链样式](https://redefine-docs.ohevan.com/page_templates/friends)
- [数学公式](https://redefine-docs.ohevan.com/plugins/mathjax)
- 代码块语言显示
- Light/Dark 模式切换
- [Font Awesome 6.2.1 Pro](https://redefine-docs.ohevan.com/basic/fontawesome)（包含 Duotone/Regular/Thin 等不同样式）
- [下拉菜单](https://redefine-docs.ohevan.com/dhome/navbar#%E9%93%BE%E6%8E%A5%E5%88%97%E8%A1%A8)
- [可自定义页脚](https://redefine-docs.ohevan.com/footer)
- [网站运行时间显示](https://redefine-docs.ohevan.com/footer#%E8%BF%90%E8%A1%8C%E6%97%B6%E9%97%B4)
- [文章头图](https://redefine-docs.ohevan.com/article_customize/banner)
- [Mermaid JS 支持](https://redefine-docs.ohevan.com/plugins/mermaid)
- SEO 友好
- [Aplayer 音乐播放器支持](https://redefine-docs.ohevan.com/plugins/aplayer)
- [说说模块](https://redefine-docs.ohevan.com/shuoshuo)
- [自定义字体](https://redefine-docs.ohevan.com/basic/global#%E8%87%AA%E5%AE%9A%E4%B9%89%E5%AD%97%E4%BD%93)

## ☁️ 安装

如果你的 Hexo 版本在 `5.0` 及以上，推荐通过 `npm` 安装

```sh
$ cd your-hexo-site
$ npm install hexo-theme-redefine@latest
```

或者使用 git 克隆

```sh
$ cd your-hexo-site
$ git clone https://github.com/EvanNotFound/hexo-theme-redefine.git themes/redefine
```

安装完成后，在 Hexo 配置文件 `_config.yml` 中将 `theme` 设置为 `Redefine`。

```yaml
theme: redefine
```



## ⏫ 更新

Theme Redefine 经常发布新版本，你可以通过如下命令更新 Theme Redefine。

通过 `npm` 安装最新版本：

```sh
$ npm install hexo-theme-redefine@latest
```

通过 `git` 更新到最新的 `main` 分支：

```sh
$ git clone https://github.com/EvanNotFound/hexo-theme-redefine.git themes/redefine
```



## 📄 文档

请阅读 [Redefine 主题官方文档](https://redefine-docs.ohevan.com/) 进行主题配置与安装，非常简单易懂。

## ☕ 支持

欢迎 **pull request** 或者 提交 **issues**.

如有问题，请发邮件到 [contact@ohevan.com](mailto:contact@ohevan.com). 我会及时回复

如果你觉得主题还不错的话，欢迎给我 Github 点个 Star，谢谢。建议点个 Watch，以便及时获取主题更新。

如果你在使用 [Typora](https://typora.io/) 编辑器写文章，欢迎查看我写的 [Typora Redefine 主题](https://github.com/EvanNotFound/typora-theme-redefine)，按照本 Hexo 主题样式编写，让你可以直接预览文章效果，更好排版。

## 💗 赞助

非常感谢所有赞助者的支持，你们的支持是我维护这个项目的动力。

如果你觉得这个项目还不错，欢迎给我买杯咖啡，给 CDN 续命续久一点，感谢

所有赞助者名单：[赞助者名单](https://github.com/EvanNotFound/hexo-theme-redefine/blob/dev/DONATION.md)

再次感谢你们！

## 🌟 Star 记录

[![Star History Chart](https://api.star-history.com/svg?repos=EvanNotFound/hexo-theme-redefine&type=Date)](https://star-history.com/#EvanNotFound/hexo-theme-redefine&Date)

## 📢 其他

如果你恰好需要云主机，可以去 [Racknerd](https://my.racknerd.com/aff.php?aff=8346) 看看，性价比高。

很多活动，比如 2核 2G 活动价一年只要 20 刀，比国内云便宜而且还没有监管，可以用来部署各种服务。