<div align="right">
  <img src="https://img.shields.io/badge/-English-A31F34?style=for-the-badge" alt="English" />
  <a title="zh-CN" href="README_zh-CN.md">  <img src="https://img.shields.io/badge/-%E7%AE%80%E4%BD%93%E4%B8%AD%E6%96%87-545759?style=for-the-badge" alt="简体中文"></a>
  <a title="zh-TW" href="README_zh-TW.md"><img src="https://img.shields.io/badge/-%E7%B9%81%E4%BD%93%E4%B8%AD%E6%96%87-545759?style=for-the-badge" alt="繁体中文"></a>
</div>

<a href="https://redefine.ohevan.com"><img align="center" src="https://user-images.githubusercontent.com/68590232/226141917-68124e8f-fde0-4edd-b86d-c62932ec369a.png"  alt="Redefine"></a>



# hexo-theme-redefine

"Redefine" hexo theme is **a simple & fast & pure theme**, but with **no compromise**. This theme contains lots of widely use functions and great web design.

Hexo Theme Redefine source code is based on [hexo-theme-keep](https://github.com/XPoet/hexo-theme-keep). Redefine Theme optimized its style and added useful writing modules and plugins. Also, you can customize many things in this theme.




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


<p align="center">
  <a href>

## 📷 Screenshots

![redefine-1-final](https://user-images.githubusercontent.com/68590232/235559377-ac157edd-19eb-4596-9ef2-211eec0b6fe7.png)
[![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2FEvanNotFound%2Fhexo-theme-redefine.svg?type=shield)](https://app.fossa.com/projects/git%2Bgithub.com%2FEvanNotFound%2Fhexo-theme-redefine?ref=badge_shield)

![redefine-2-final](https://user-images.githubusercontent.com/68590232/235559385-c13132ca-29c5-4b01-bd1b-e37ca500c824.png)

![redefine-3-final](https://user-images.githubusercontent.com/68590232/235559394-ebf339f6-3297-485c-85cc-834eb3ea986e.png)


## 🌐 Online Demo

- [EvanNotFound's Blog](https://ohevan.com)
- [Theme Redefine Demo](https://redefine.ohevan.com)
- [Redefine Theme Showcase](https://redefine.ohevan.com/showcase)

If you are also using Redefine, please go to [Redefine Theme Showcase](https://redefine.ohevan.com/showcase) to add your blog link.

## ⛰️ Some functions

- [Note Module](https://redefine-docs.ohevan.com/modules/notes)
- [Friend Link Page](https://redefine-docs.ohevan.com/page_templates/friends)
- [Mathjax Support](https://redefine-docs.ohevan.com/plugins/mathjax)
- Code block language display
- Light/Dark mode switching
- [Font Awesome 6.2.1 Pro](https://redefine-docs.ohevan.com/basic/fontawesome) (contains different styles like Duotone/Regular/Thin/Sharp)
- [Drop-down menu](https://redefine-docs.ohevan.com/dhome/navbar#%E9%93%BE%E6%8E%A5%E5%88%97%E8%A1%A8)
- [Customizable footer](https://redefine-docs.ohevan.com/footer)
- [Site Uptime Display](https://redefine-docs.ohevan.com/footer#%E8%BF%90%E8%A1%8C%E6%97%B6%E9%97%B4)
- [Article Header Image](https://redefine-docs.ohevan.com/article_customize/banner)
- [Mermaid JS support](https://redefine-docs.ohevan.com/plugins/mermaid)
- SEO friendly
- [Aplayer support](https://redefine-docs.ohevan.com/plugins/aplayer)
- [Shuoshuo support](https://redefine-docs.ohevan.com/shuoshuo)
- [Customizable Font](https://redefine-docs.ohevan.com/basic/global#%E8%87%AA%E5%AE%9A%E4%B9%89%E5%AD%97%E4%BD%93)



## ☁️ Installation

The easiest way to install Theme Redefine is by using **npm** (after your hexo version has been up to `5.0`+)

```sh
$ cd your-hexo-site
$ npm install hexo-theme-redefine@latest
```

Another method is by **git clone**

```sh
$ cd your-hexo-site
$ git clone https://github.com/EvanNotFound/hexo-theme-redefine.git themes/redefine
```

After the installation, go to the `_config.yml` of your hexo site and set

```yaml
theme: redefine
```

## ⏫ Update

To update hexo-theme-redefine, you can run the same **npm** command

```sh
$ npm install hexo-theme-redefine@latest
```

Another method is by **git clone**

```sh
$ git clone https://github.com/EvanNotFound/hexo-theme-redefine.git themes/redefine
```



## 📄 Documentations

Please read [Redefine Docs](https://redefine-docs.ohevan.com/) when installing

It's very easy to understand.



## ☕ Support

Feel free to **pull request** and **send issues**.

If you have any questions, please send an email to [contact@ohevan.com](mailto:contact@ohevan.com). I will reply in time.

Please **give me a star** to support me, thanks!

Also, if you are using [Typora](https://typora.io/), check out [Typora Theme Redefine](https://github.com/EvanNotFound/typora-theme-redefine) so that you can preview the styles of your blog in Typora.

## 💗 Donations

Thanks to all the people who have donated to me. Your support is my greatest motivation.

If you like this theme, you can also support me by donating.

This is the list of all the people who have donated to me: [Donation List](https://github.com/EvanNotFound/hexo-theme-redefine/blob/dev/DONATION.md)

Thanks to all of you!



## License
[![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2FEvanNotFound%2Fhexo-theme-redefine.svg?type=large)](https://app.fossa.com/projects/git%2Bgithub.com%2FEvanNotFound%2Fhexo-theme-redefine?ref=badge_large)