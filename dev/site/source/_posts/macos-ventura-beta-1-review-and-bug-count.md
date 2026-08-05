---
title: "macOS Ventura 使用心得及 Bug 总结"
date: "2022-06-10"
categories:
  - "macos"
  - "使用体验"
  - "分享"
  - "技术"
tags:
  - "Bug"
  - "macos"
  - "Ventura"
  - "使用体验"
  - "学习笔记"
  - "总结"
link: macos-ventura-beta-1-review-and-bug-count
layout: post
keywords: "macos ventura,review,使用心得,bug,苹果,Apple,macos,stage manager"
description: "macOS Ventura 总体心得：Ventura真的很令人失望，不建议更新。已经退回 Monterey ，没升级的建议再等等，首先谈谈发热，不管是 i3 还是 M1，异常发热都很严重，以前在上海的时候气温20摄氏度左右，i3版本平均每天60摄氏度左右，M1 小概率不定期触发异常发热。手放键盘上就真·煎熬。"
thumbnail: https://evan.beee.top/img/Get-the-new-macOS-Ventura-wallpapers-here.webp
---

## 1\. 引入

请注意，本文章为不完全使用心得，所以的体验均为本人感受和朋友感受，如有不同意见，欢迎指正，

同时本文也 Include 了网上许多人反应的问题，

本人电脑配置：

| 硬件 |                                    版本                                    |
| :--: | :------------------------------------------------------------------------: |
| 型号 |                              Macbook Air 2020                              |
| CPU  |                               Intel i3 双核                                |
| 系统 | [macOS Ventura Beta 1](https://www.apple.com/macos/macos-ventura-preview/) |
| 风扇 |                                   单风扇                                   |

朋友电脑配置：

| 硬件 |                                    版本                                    |
| :--: | :------------------------------------------------------------------------: |
| 型号 |                               Macbook Air M1                               |
| CPU  |                                  Apple M1                                  |
| 系统 | [macOS Ventura Beta 1](https://www.apple.com/macos/macos-ventura-preview/) |
| 风扇 |                                     无                                     |

## 2\. 总体心得

macOS Ventura 总体来说真的很令人失望，不建议更新。本人已经退回 [Monterey](https://www.evanluo.top/macbook-air-macos-monterey.html) ，没升级的建议等个半年。

## 3\. 具体问题

### 3.1 发热

首先谈谈发热，不管是 i3 还是 M1，异常发热都很严重，上海气温20摄氏度左右，i3版本平均每天60摄氏度左右，M1 小概率不定期触发异常发热（看电脑体质）。手放键盘上真的煎熬

### 3.2 界面

这块主要介绍界面更改

#### 3.2.1 设置

macOS Ventura 把设置界面改了，变成了库克认为我们**熟悉的 iPad 界面**，然而事与愿违，改成了这鬼样😅

![macos ventura 设置](https://evan.beee.top/wp-content/uploads/2022/06/16548212232633.png?x-oss-process=style/turn-to-webp)

左边图标间距很不自然

真的不理解，这图标大小，这行距，直接让美感消失。山寨 macOS 系统做的都比这个好看

#### 3.2.2 关于本机界面

点击左上角苹果图标--->关于本机，变成了这鬼样：

![macOS Ventura 关于本机](https://evan.beee.top/wp-content/uploads/2022/06/16548219405158.png?x-oss-process=style/turn-to-webp)

再和原本的对比一下

![macos monterey 关于本机](https://evan.beee.top/wp-content/uploads/2022/06/16548217197718.png?x-oss-process=style/turn-to-webp)

差别高下立判，而在 Ventura 中点击 `More Info...` 以后，就会跳转到设置里面的界面。讲真，真的没有 Monterey 好看。

#### 3.2.3 StageManager

新加入的功能，和 iPad 上的一模一样，需要的可以自己搜索。

![STAGE Manager](https://evan.beee.top/wp-content/uploads/2022/06/16548220536470.png?x-oss-process=image/auto-orient,1/format,webp)

可以便捷切换应用，讲真，很鸡肋，毕竟 Macos 又不是 iPad 😅

而且还有很多bug，有时候白屏，只有图标，左边窗口列表显示不出来

#### 3.2.4 输入法图标

看上图就可以看出，`拼`这个字的底变大了。然后导致两边的间距不一样，强迫症直接去世。

![输入法图标变更](https://evan.beee.top/wp-content/uploads/2022/06/16548221992370.png?x-oss-process=style/turn-to-webp)

原 macOS Moneterey 的界面：

![macos moneterey任务栏图标](https://evan.beee.top/wp-content/uploads/2022/06/16548230491200.png?x-oss-process=style/turn-to-webp)

还是 Monterey 好看

#### 3.2.5 应用兼容及优化

首先，有些旧版的应用就不能用了，比如我以前的用的 Termius 破解版，7.24 版本

![termius](https://evan.beee.top/wp-content/uploads/2022/06/16548232447766.png?x-oss-process=style/turn-to-webp)

更新完以后，直接显示软件包错误了，我迫不得已申请了 Github Education Pack，成功拿到 Termius Pro

![GITHub education pack](https://evan.beee.top/wp-content/uploads/2022/06/16548234313818.png?x-oss-process=style/turn-to-webp)

其次，很多应用没有针对新版 macOS 进行适配，比如 Bartender（整理菜单栏图标的应用

![Bartender 4](https://evan.beee.top/wp-content/uploads/2022/06/16548236522532.png?x-oss-process=style/turn-to-webp)

更新：作者更新新版适配了新版系统，不过还是有些其他应用没有适配

![Bartender 4.2 update](https://evan.beee.top/wp-content/uploads/2022/06/16548241567179.png?x-oss-process=style/turn-to-webp)

如果你在用很多破解版的软件，建议等个半年再更新

### 3.3 卡顿

用起来感觉挺卡的，加上我的丐版 i3，超级加倍，直接卡死。

开个 VScode都发热严重

## 4\. Bug Count

经典 Bug 体质环节，随时更新

### 4.1 设置里账号图标消失

复现方法：我也不知道，看库克心情

![macos settings bug](https://evan.beee.top/wp-content/uploads/2022/06/16548250353053.png?x-oss-process=style/turn-to-webp)

### 4.2 其他 Bug（网上反馈）

- 系统自带录屏卡住无工具栏
- 图书应用打开目录崩溃
- 台前调度下照片应用最小化会闪出图库第一张照片

## 5\. 结尾

写完了，随时更新，就在本页

Monterey 还是最稳定的，想要更新的可以等几个月，让苹果优化一下
