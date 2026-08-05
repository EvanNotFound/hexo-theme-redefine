---
title: 使用 Vercel 和 Github 部署 Hexo 安装以及使用教程
layout: post
date: 2022-08-27 11:19:26
tags:
  - "hexo"
  - "vercel"
  - "Github"
  - "教程"
  - "博客"
categories:
  - "Github"
  - "Vercel"
  - "教程"
  - "网站"
  - "博客"
keywords: "Vercel Hexo,Vercel,Hexo,博客,部署教程,安装教程,使用教程,Config"
description: "本篇文章会教你如何安装并且配置Hexo，以及使用教程。很多玩博客的大佬都在使用 Hexo 静态博客作为自己的系统而不是 WordPress 或者 Typecho，这是因为 Hexo 这一类的静态博客，可以部署在很多稳定且免费的环境中，同时也可以保持访问速度，对于大佬来说，这是个最好不过的选择了。"
thumbnail: https://evan.beee.top/img/1*oBm_3saYz4AI_MS6OekdFQ.png
link: vercel-hexo-configuration
lang: zh-Hans
---

## 1.引言 <a href="/vercel-hexo-configuration-en.html" style="border-bottom: none;"><i class="fa-duotone fa-language"></i></a>

本教程会教你如何使用 Github + Vercel 部署 Hexo 博客

### 1.1 为什么选择 Hexo？

![Hexo](https://evan.beee.top/wp-content/uploads/2022/08/16616144187928.webp)

很多玩博客的大佬都在使用 Hexo 静态博客作为自己的系统而不是 WordPress 或者 Typecho，这是因为 Hexo 这一类的静态博客，可以部署在很多稳定且免费的环境中，同时也可以保持访问速度，对于大佬来说，这是个最好不过的选择了。

**优点：**

- 环境稳定且免费，可以省出维护服务器的精力和开支
- 大佬们一般对服务器有很高的要求，一个服务器通常会专门做一件事情，如果挂博客太低的配置没法有很好的访问性能，太高的配置又是资源浪费，中规中矩的配置却又比上不足比下有余，这时候`静态博客`就是个很好的解决方案。

在所有静态博客系统中，最受欢迎的，莫过于 Hexo 系统。

当然，如果你比较喜欢 `Hugo`，也可以仿照本教程进行安装。

### 1.2 方案细则

把 Hexo 文件放在 Github 上，每次更新文件都推送到 Github 上，由 Vercel 自动拉取构建

## 2. 安装教程

### 2.1 账号准备

**请注册好：**[Github 账号](https://github.com/)

再前往[Vercel 网站](https://vercel.com/)**使用Github账号**注册一个账号。这样注册好以后 Vercel里面就可以看到你 Github 里面的项目了。

![Vercel 主界面](https://evan.beee.top/wp-content/uploads/2022/08/screenshot-20220827-at-113532.webp)

### 2.2 创建 Hexo 项目

这一步很简单，前往 Vercel 网站，点击 `Add New`，选择 `Project`

![Add Project界面](https://evan.beee.top/wp-content/uploads/2022/08/16616147156182.webp)

点击右边 `Clone Template` 下面的 `Browse All Template`

找到 `Hexo`

![Vercel Browse All Template 页面](https://evan.beee.top/wp-content/uploads/2022/08/16616147933616.webp)

这时候就到了创建 Hexo 项目的页面了。

左边的 `Git Scope` 是你的 Github 账号，右边 `REPOSITORY NAME` 是你账号下 Hexo 项目的名字，可以**自定义**

项目可见性就保持 `Private`，这样别人就看不到你 Hexo 仓库的各种机密信息了，有效保持版权和隐私

![Vercel 创建 Hexo页面](https://evan.beee.top/wp-content/uploads/2022/08/16616148585893.webp)

最后点击 `Create` 创建项目，等一会就好了。

![Hexo项目页面](https://evan.beee.top/wp-content/uploads/2022/08/16616158812735.webp)

最后成功以后，会给你一个二级域名，这个二级域名是属于你的，不会回收，建议可以调试的时候临时使用。

部署完成后，它就和你刚刚所填写的仓库绑定了，一旦你的仓库有什么变化，它就会自动同步部署，全过程大概 5 分钟可以完成部署。

你现在可以点击那个二级域名，就可以看到你的 Hexo 博客了。

但是不建议长期使用。

原因有下：

- 这个 `vercel.app` 域名已经被各大搜索引擎屏蔽，无法被收录
- 这个 `vercel.app` 根域名已经被中国大陆防火长城屏蔽，中国国内无法访问，如果你的读者面向国内，不建议使用

所以建议绑定自己的域名。

### 2.3 本地调试

如果你想直接在 Github 上调试你博客也行，但是就是要在改完以后等待Vercel 自动部署，很慢，不方便。同时 vercel **一天最多部署100次**。

所以建议你在本地安装hexo环境调试，更改能及时看到，改好以后可以直接 `git push` 到你的 Github 项目

#### 2.3.1 本地环境配置

Macos，Windows均可安装环境。如果你是资深geek，`Git`和`Node.js`已经安装好的，可以直接跳过本步骤

首先安装 `Git`，可以前往[Git官网](https://git-scm.com/)下载安装

其次安装 `Node.js`，可以前往 [Node.js官网](https://nodejs.org/en/)下载安装

安装好以后，接下来是**验证配置**

**macOS用户**请打开终端 (Terminal)

**Windows用户**请打开 `Git bash`

通过下面的代码查看版本

```bash
node -v
npm -v
```

如果都有显示，那么就说明配置成功了

![NPM 版本号](https://evan.beee.top/wp-content/uploads/2022/08/16616166324585.webp)

#### 2.3.2 安装本地Hexo

> **macOS用户**请打开终端 (Terminal)
>
> **Windows用户**请打开 `Git bash`

输入以下命令安装 Hexo

```bash
npm install -g hexo
```

等一会，大概一分钟

提示 hexo@[版本号] 即为安装成功。

#### 2.3.3 配置 GitHub & SSH key

> **macOS用户**请打开终端 (Terminal)
>
> **Windows用户**请打开 `Git bash`

打开 Git Bash ，运行下面的命令：

```bash
ssh-keygen -t rsa -C "你的电子邮箱地址"
```

连续3次回车，最终命令行会显示公钥私钥等数据的目录地址（这边盗个图）

![RSA密钥](https://evan.beee.top/wp-content/uploads/2022/08/16616186656557.webp)

找到 `id_rsa.pub` 文件的目录，用文本编辑器（VScode或者记事本）打开这个文件，复制里面的全部内容。

前往 `GitHub -> Settings -> SSH and GPG keys -> New SSH key`，直达链接：[这里捏](https://github.com/settings/ssh/new)

将刚复制的内容粘贴到 `Key` 中，`Title`填你喜欢的，点击保存 `Add SSH Key`。

![SSH keys Github](https://evan.beee.top/wp-content/uploads/2022/08/16616188695065.webp)

**接下来设置 Git**

在终端中运行以下指令：

```bash
git config --main user.name "你的 GitHub username"

git config --main user.email "你的 GitHub 注册邮箱地址"
```

**验证是否配置成功**

```bash
ssh -T git@github.com #这里不用更改邮箱地址
```

如果提示如果提示 `Are you sure you want to continue connecting (yes/no)?` 输入 `yes` 并回车。

看到

```bash
Hi [你的Github用户名]! You've successfully authenticated, but GitHub does not provide shell access.
```

就说明成功了，到此，**本地环境配置成功**

#### 2.3.4 克隆Github仓库

前往你在 Github上的仓库，然后点击 `Code`，复制 `HTTPS` 下方的链接

![Git clone地址](https://evan.beee.top/wp-content/uploads/2022/08/16616194478181.webp)

先`cd`到你打算放博客的文件夹，再使用以下命令克隆你的 hexo 仓库到本地

```bash
git clone 粘贴你的链接
```

比如这样：

![Git clone粘贴链接](https://evan.beee.top/wp-content/uploads/2022/08/16616195542897.webp)

私有仓库 clone 可能需要输入 Github 账号和密码。

此时，当你输入 Github 密码的时候，会提示错误。因为 Github 已经关闭了 Password Login Support

所以请前往 `Github -> Settings -> Developer Settings -> Personal Access Token` 创建一个Token。直达链接：[这里捏](https://github.com/settings/tokens/new)

**命名随便**，过期时间选择 `No expiration`，**然后勾选 `repo` **

如图

![Create Personal Access Token](https://evan.beee.top/img/Screen%20Shot%202022-09-03%20at%2012.26.59%20PM.png)

创建完成以后复制这个 Token，保存好，因为这个 Token 只显示一次。

此时就可以继续命令行登录账号了。

> 账号是你 Github 邮箱
>
> 密码是你刚刚复制的 Token

#### 2.3.5 本地使用教程

现在既然clone好了，那么该如何使用呢？

每次当你改完hexo文件，可以使用以下命令让 hexo 在本地运行起来

```bash
hexo clean&&hexo s
```

`hexo clean` 是清除之前的缓存

`hexo s`是指运行 hexo server

当你看见这条信息的时候，就可以打开 http://127.0.0.1:4000 查看你所做的更改的效果了

![Hexo本地运行成功](https://evan.beee.top/wp-content/uploads/2022/08/16616232831453.webp)

如果要结束运行，可以执行：`Ctrl+C`

**如果本地测试好没问题，就可以 push 到 Github 了**

查看文件状态：

```bash
git status
```

添加**所有更改后的文件**：

```bash
git add --all
```

对这些文件进行 commit：

```bash
git commit -m "你要commit的内容"
```

最后，同步到 Github 云端仓库：

```bash
git push
```

此时，Vercel 会自动拉取更改信息，重新构建网站，过程一般40s左右

## 3.使用教程

### 3.1 安装主题

这个很简单，在网上找到你喜欢的主题，找到主题的 Github 链接，上面就会有安装教程。

比如我做的 [Redefine 主题](https://github.com/EvanNotFound/hexo-theme-redefine)

![Redefine主题安装界面](https://evan.beee.top/img/Screen%20Shot%202022-10-22%20at%2011.04.23%20AM.png)

跟着安装即可，编辑 hexo 根目录下的 `_config.yml` 文件，把 `theme` 选项从默认的 `landscape` 更改为你所用主题的名字。

最后测试没问题就可以参考 **步骤2.3.5** push 到云端了

具体的主题的自定义指南可以看主题自己的文档

### 3.2 安装插件

Hexo 插件还是比较多的（当然肯定没有wordpress多），可以自行去网上找。

找到插件的 Github 页面，也会提供安装指南

比如这个 [sitemap 插件](https://github.com/hexojs/hexo-generator-sitemap)

![Hexo generator sitemap插件](https://evan.beee.top/wp-content/uploads/2022/08/16616240840401.webp)

安装好以后根据插件文档，在 hexo 根目录下的 `_config.yml` 中添加指定参数就行。

比如这个插件的参数

![插件参数页面](https://evan.beee.top/wp-content/uploads/2022/08/16616241929541.webp)

最后测试没问题就可以参考 **步骤2.3.5** push 到云端了

## 4.总结

Hexo 静态博客适合喜欢自定义自己的博客的人。

如果安装有问题，欢迎联系我，我会及时回复

邮件：contact@evanluo.top

如果写的还不错，欢迎留下评论，让我知道。谢谢阅读！

让我知道。谢谢阅读！
