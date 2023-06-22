<div align="right">
  <img src="https://img.shields.io/badge/-%E7%B9%81%E9%AB%94%E4%B8%AD%E6%96%87-A31F34?style=for-the-badge" alt="language">
  <a title="en" href="README.md"><img src="https://img.shields.io/badge/-English-545759?style=for-the-badge" alt="english"></a>
  <a title="zh-CN" href="README_zh-CN.md">  <img src="https://img.shields.io/badge/-%E7%AE%80%E4%BD%93%E4%B8%AD%E6%96%87-545759?style=for-the-badge" alt="简体中文"></a>
</div>

<a href="https://redefine.ohevan.com"><img align="center" src="https://user-images.githubusercontent.com/68590232/226141917-68124e8f-fde0-4edd-b86d-c62932ec369a.png"  alt="Redefine"></a>



# hexo-theme-redefine

"Redefine" 是一個簡潔、快速、純净的 hexo 主題。簡潔，但不簡單。本主題包含很多廣泛使用的功能，並擁有著優秀的設計。

本主題基於 [hexo-theme-keep](https://github.com/XPoet/hexo-theme-keep) 開發，感謝 XPoet 的開源。本主題主要優化了樣式，增加了寫作模塊，以及各種插件的支持。同時加大自定義程度，讓你可以更加方便的使用本主題。

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



## 📷 屏幕截圖

![redefine-1-final](https://github.com/EvanNotFound/hexo-theme-redefine/assets/68590232/1c4f802b-b949-4313-8935-6ea5178be9e3)

![redefine-2-final](https://github.com/EvanNotFound/hexo-theme-redefine/assets/68590232/bf6529a6-bce9-4388-899c-1d96325c49d6)

![redefine-3-final](https://github.com/EvanNotFound/hexo-theme-redefine/assets/68590232/33ee3d7c-189c-4b75-89c9-914b0cb63caf)


## 🌐 在線演示站

- [EvanNotFound's Blog](https://ohevan.com)
- [Theme Redefine 演示站点](https://redefine.ohevan.com)
- [Redefine 用戶牆](https://redefine.ohevan.com/showcase)

如果你也在使用 Redefine，歡迎在前往 [Redefine 用戶牆](https://redefine.ohevan.com/showcase) 添加你的博客鏈接。

## ⛰️ 部分功能

- [筆記模塊](https://redefine-docs.ohevan.com/modules/notes)
- [友鏈樣式](https://redefine-docs.ohevan.com/page_templates/friends)
- [數學公式](https://redefine-docs.ohevan.com/plugins/mathjax)
- 代碼塊語言顯示
- Light/Dark 模式切換
- [Font Awesome 6.2.1 Pro](https://redefine-docs.ohevan.com/basic/fontawesome)（包含 Duotone/Regular/Thin 等不同樣式）
- [下拉菜單](https://redefine-docs.ohevan.com/dhome/navbar#%E9%93%BE%E6%8E%A5%E5%88%97%E8%A1%A8)
- [可自定義頁腳](https://redefine-docs.ohevan.com/footer)
- [網站運行時間顯示](https://redefine-docs.ohevan.com/footer#%E8%BF%90%E8%A1%8C%E6%97%B6%E9%97%B4)
- [文章頭圖](https://redefine-docs.ohevan.com/article_customize/banner)
- [Mermaid JS 支持](https://redefine-docs.ohevan.com/plugins/mermaid)
- SEO 友好
- [Aplayer 音樂播放器支持](https://redefine-docs.ohevan.com/plugins/aplayer)
- [說說模塊](https://redefine-docs.ohevan.com/shuoshuo)
- [自定義字體](https://redefine-docs.ohevan.com/basic/global#%E8%87%AA%E5%AE%9A%E4%B9%89%E5%AD%97%E4%BD%93)

## ☁️ 安裝

如果你的 Hexo 版本在 `5.0` 及以上，推薦通過 `npm` 安裝

```sh
$ cd your-hexo-site
$ npm install hexo-theme-redefine@latest
```

或者使用 git 克隆

```sh
$ cd your-hexo-site
$ git clone https://github.com/EvanNotFound/hexo-theme-redefine.git themes/redefine
```

安裝完成後，在 Hexo 配置文件 `_config.yml` 中將 `theme` 設置為 `Redefine`。

```yaml
theme: redefine
```



## ⏫ 更新

Theme Redefine 經常發布新版本，你可以透過如下命令更新 Theme Redefine。

通過 `npm` 安裝最新版本：

```sh
$ npm install hexo-theme-redefine@latest
```

通過 `git` 更新到最新的 `main` 分支：

```sh
$ git clone https://github.com/EvanNotFound/hexo-theme-redefine.git themes/redefine
```



## 📄 文檔

請閱讀 [Redefine 主題官方文檔](https://redefine-docs.ohevan.com/) 進行主題配置與安裝，非常簡單易懂。

## ☕ 支持

歡迎 **pull request** 或者 提交 **issues**.

如有問題，請發郵件到 [contact@ohevan.com](mailto:contact@ohevan.com). 我會及時回复

如果你覺得主題還不錯的話，歡迎給我 Github 點個 Star，謝謝

如果你在使用 [Typora](https://typora.io/) 編輯器寫文章，歡迎查看我寫的 [Typora Redefine 主題](https://github.com/EvanNotFound/typora-theme-redefine)，按照本 Hexo 主題樣式編寫，讓你可以直接預覽文章效果，更好排版。

## 💗 贊助

非常感謝所有贊助者的支持，你們的支持是我維護這個項目的動力。

如果你覺得這個項目還不錯，歡迎給我買杯咖啡，給 CDN 續命續久一點，感謝

所有贊助者名單：[贊助者名單](https://github.com/EvanNotFound/hexo-theme-redefine/blob/dev/DONATION.md)

再次感謝你們！

## 🌟 Star 記錄

[![Star History Chart](https://api.star-history.com/svg?repos=EvanNotFound/hexo-theme-redefine&type=Date)](https://star-history.com/#EvanNotFound/hexo-theme-redefine&Date)

## 📢 其他

如果你恰好需要雲主機，可以去 [Racknerd](https://my.racknerd.com/aff.php?aff=8346) 看看，性價比高。

很多活動，比如 2核 2G 活動價一年只要 20 刀，比國內云便宜而且還沒有監管，可以用來部署各種服務。