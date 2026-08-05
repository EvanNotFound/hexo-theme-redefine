---
title: External Blog Test - Hexo Setup Guide
date: 2024-11-14 18:46:00
tags:
  - "Hexo"
  - "hexo-theme"
  - "Github Pages"
thumbnail: images/hexo-head.png
excerpt: "Test file for external blog content - comprehensive Hexo setup guide to test theme compatibility with third-party posts."
---

## 提示

1. 本网站基于[hexo](https://github.com/hexojs/hexo-deployer-git)框架 

2. 基于[redefine](https://github.com/EvanNotFound/hexo-theme-redefine)主题做了修改

3. 我自己比起官方文档提到的内容，还有很多功能我没有成功实现。

4. 我搭建时使用的是Windows 10系统，使用Linux与MacOS的同志**只可参考**。

5. **一定要将三个官方文档结合着看**

- [GitHub Pages 快速入门](https://docs.github.com/zh/pages/quickstart)
- [文档 | Hexo](https://hexo.io/zh-cn/docs/)
- [快速开始 | Hexo Theme Redefine Docs](https://redefine-docs.ohevan.com/zh/getting-started)



## 基本操作

1. 第一步一定要有一个状态正常的Github账号。

2. 本地下载好[Git](https://git-scm.com/downloads/win)和[Node.js](https://nodejs.org/zh-cn)一路默认安装即可（可以修改安装位置）。

3. 桌面空白处右键`Open Git Bash Here`配置Git。

   ```bash
   $ git config --global user.name "UserName"  # 配置用户名
   $ git config --global user.email "UserEmail"  # 配置用户邮箱
   $ git config --global https.proxy https://IP:Port  # （可选）配置代理
   $ ssh-keygen -t rsa -b 4096 -C "UserEmail"  # 生成SSH Key
   ```

4. 复制`%homepath%\用户名\.ssh\id_rsa.pub`文件中的内容。

5. 访问[Add new SSH key](https://github.com/settings/ssh/new)(访问的是Github>Settings>SSH>Add)`Title`随便取，`Key type`不变，`Key`为`id_rsa.pub`文件中的内容。

6. 执行这句指令测试SSH是否连通。（首次测试需要输入一次`yes`）

   ```bash
   $ ssh -T git@github.com
   ```

7. [创建新仓库](https://github.com/new)

   - `Repository name`为`UserName.github.io`(用户名大小写要相同)
   - Github Pages要求仓库为`Public`模式
   - `License`可以选择`None`、`MIT`、`GNU General Public License v3.0`（按照主题制作者的许可证来）
   - 创建完成后进入`Settings`在左侧导航中找到`Pages`，右侧找到`Build and deployment`将`Source`修改为`GitHub Actions`



## 安装框架与主题

1. 在本地选择合适的位置（例如`D:\Website\Blog\`)使用这句命令创建`Hexo基本框架`

   ```bash
   $ npm install hexo-cli -g
   ```

   - 要求`Blog`文件夹为空
   - 可能会有较长时间的等待，请不要进行其他操作

2. 使用该命令（二选一执行）正式新建站点

   ```bash
   $ hexo init  # 将打开Git Bash的位置设定为工作目录
   $ hexo init D:\Website\Blog  # 手动设定工作目录
   ```

3. 安装主题(可以使用git克隆也可以使用npm下载) 推荐使用npm

   ```bash
   $ npm install hexo-theme-redefine@latest
   ```

4. 修改`_config.yml`

   ```yaml
   language: zh-CN  # Line 11 设定语言
   timezone: 'Asia/Shanghai'  # Line 12 设定时区
   theme: redefine  # Line 99 启用主题
   ```

   - 一般`_config.yml`中有`theme`，修改其值就可以
   - 如果文件中出现`remote_theme`请删除，他与`theme`不能并存

5. 在根目录新建`_config.redefine.yml`文件，并填入模板代码

   ```yaml
   # >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> 开始
   # THEME REDEFINE CONFIGURATION FILE V2
   # BY EVANNOTFOUND
   # 仓库地址: https://github.com/EvanNotFound/hexo-theme-redefine
   # 指导手册: https://redefine-docs.ohevan.com
   # 预览: https://redefine.ohevan.com
   # <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< 结束
   
   
   # 基本信息 >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> 开始
   # Docs: https://redefine-docs.ohevan.com/basic/info
   info:
     # 网站标题
     title: Theme Redefine
     # 网站副标题
     subtitle: Redefine Your Hexo Journey.
     # 作者名称
     author: The Redefine Team
     # 网站地址
     url: https://redefine.ohevan.com
   # 基本信息 <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< 结束
   
   
   # 图像配置 >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> 开始
   # Docs: https://redefine-docs.ohevan.com/basic/defaults
   defaults:
     # 站点图标
     favicon: /images/redefine-favicon.svg
     # 站点LOGO
     logo: 
     # 个人头像
     avatar: /images/redefine-avatar.svg
   # 图像配置 <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< 结束
   
   
   # 色彩 >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> 开始
   # Docs: https://redefine-docs.ohevan.com/basic/colors
   colors:
     #主题色（按钮、进度条、链接、选中等组件的颜色）
     primary: "#A31F34"
     # 二级色（暂无用处）
     secondary:
     # 默认的显示模式（明亮模式、黑夜模式）
     default_mode: light # light, dark
   # 色彩 <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< e结束
   
   
   # 网站定制 >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> 开始
   # Docs: https://redefine-docs.ohevan.com/basic/global
   global:
     # Custom global fonts
     fonts:
       # 自定义中文字体
       chinese: 
         enable: false # 是否启用
         family:  # 中文字体名称
         url:  # 字体样式文件地址（css）
       # 自定义英文字体
       english: 
         enable: false # 是否启用
         family:  # 字体名称
         url:  # 字体样式文件地址（css）
       # 自定义标题字体
       title:
         enable: false # 是否启用
         family:  # 字体名称
         url:  # 字体样式地址(css)
     # 文章显示的最大宽度
     content_max_width: 1000px
     # 边栏的宽度
     sidebar_width: 210px
     # 鼠标悬停效果
     hover:
       shadow: true # 悬停时卡片产生阴影
       scale: false # 悬停时卡片变大
     # 阅读进度展示
     scroll_progress:
       bar: false #  网页加载时的顶部进度条变成阅读进度的显示条
       percentage: true # 页面右下角工具栏的齿轮显示网页滚动位置的百分比数
     # 网站统计
     website_counter:
       url: https://cn.vercount.one/js # 统计功能调用的API（不需要修改）
       enable: true # 是否启用统计
       site_pv: true # 显示网站总访问量
       site_uv: true # 显示网站总访客数
       post_pv: true # 显示文章总访问量
     # 单页应用体验（也叫动态页面加载）https://swup.js.org/ -推荐开启
     single_page: true
     # 首页全屏加载动画
     preloader:
       enable: false
       custom_message: # 自定义全屏加载动画的展示内容
     # OG协议，作用是优化网页内容在社交媒体上的展示效果 -推荐开启
     open_graph: true
     # 谷歌分析 用来追踪和报告用户在网站或应用上的行为和数据
     google_analytics:
       enable: false # 是否启用
       id:  # 填写从谷歌分析平台中得到的ID
   # 网站定制 <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< 结束
       
   
   # FONTAWESOME(系列小图标的名字) >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> 开始
   # Docs: https://redefine-docs.ohevan.com/basic/fontawesome
   fontawesome: # Pro v6.2.1
     # Thin 版
     thin: false
     # Light 版
     light: false
     # Duotone 版
     duotone: false
     # Sharp Solid 版
     sharp_solid: false
   # FONTAWESOME（系列小图标的名字） <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< 结束
   
   
   # 第一屏 >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> 开始
   # Docs: https://redefine-docs.ohevan.com/home/home_banner
   home_banner:
     # 启用第一屏
     enable: true
     # 第一屏背景图片样式
     style: fixed # static（静态可滚动） fixed（始终占满屏幕）
     # 背景图片
     image: 
       light: /images/wallhaven-wqery6-light.webp # 明亮模式的图片
       dark: /images/wallhaven-wqery6-dark.webp # 暗色模式的图片
     # 画面中心的主标题
     title: Theme Redefine
     # 主标题下方的副标题
     subtitle:
       text: [] # 自定义内容（用英文半角逗号分割）
       hitokoto:  # 一言配置
         enable: false # 是否启用一言
         show_author: false # 是否显示当前语句的作者
         api: https://v1.hitokoto.cn # 一言API，可通过参数设置句子类型（见开发者中心）https://developer.hitokoto.cn/sentence/#%E5%8F%A5%E5%AD%90%E7%B1%BB%E5%9E%8B-%E5%8F%82%E6%95%B0
       typing_speed: 100 # 每毫秒打印字母数量
       backing_speed: 80 # 每毫秒退格字母数量
       starting_delay: 500 # 开始打字的延迟
       backing_delay: 1500 # 开始退格的延迟
       loop: true # 是否启用循环（打字与退格）
       smart_backspace: true # 是否启用智能退格
     # 主标题文字颜色
     text_color: 
       light: "#fff" # 亮色模式下文字颜色的HEX色值
       dark: "#d1d1b6" # 暗色模式下文字颜色的HEX色值
     # 文字样式
     text_style: 
       # 主标题字体大小
       title_size: 2.8rem
       # 副标题字体大小
       subtitle_size: 1.5rem
       # 标题与副标题的行高
       line_height: 1.2
     # 自定义第一屏字体
     custom_font: 
       # 自定义字体开关
       enable: false
       # 字体名称
       family: 
       # 字体样式文件地址（CSS）
       url:
     # 社交链接
     social_links:
       # 是否启用社交链接的单独展示
       enable: false
       # 社交链接的展示位置
       style: default # default（默认）, reverse（反向）, center（居中）
       # 社交平台
       links:
         github:  # 填写个人的Github主页地址
         instagram: # 个人的Instagram主页地址
         zhihu:  # 个人知乎的地址
         twitter:  # 个人X（twitter）的地址
         email:  # 个人邮箱地址
         # 按照[Fontawesome图标名称]:[社交平台地址]格式可以添加更多你想展示的社交平台
       # 个人二维码
       qrs:
         weixin:  # 微信个人二维码
         # ...... # 按照[图标名称]:[二维码图像地址]格式可以添加更多个人二维码
   # 第一屏 <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< 结束
   
   
   # 导航栏设置 >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> start
   # Docs: https://redefine-docs.ohevan.com/home/navbar
   navbar:
     # 是否自动隐藏
     auto_hide: false
     # 导航栏的颜色渐变效果设置
     color:
       left: "#f78736" # 左边的颜色 
       right: "#367df7"  # 右边的颜色
       transparency: 35 # 透明度 (范围10-99)
     # 导航栏宽度（通常不修改）
     width:
       home: 1200px # 在第一屏时的宽度
       pages: 1000px # 其他页面的宽度
     # 导航栏展示的链接
     links:
       Home: 
         path: / 
         icon: fa-regular fa-house # 可以不填写（无图标）
       # Archives: 
       #   path: /archives 
       #   icon: fa-regular fa-archive # 可以不填写（无图标）
       # Status: 
       #   path: https://status.ohevan.com/
       #   icon: fa-regular fa-chart-bar
       # About: 
       #   icon: fa-regular fa-user
       #   submenus:
       #     Me: /about
       #     Github: https://github.com/EvanNotFound/hexo-theme-redefine
       #     Blog: https://ohevan.com
       #     Friends: /friends
       # Links: 
       #   icon: fa-regular fa-link
       #   submenus:
       #     Link1: /link1
       #     Link2: /link2
       #     Link3: /link3
       # 按照模板格式可以添加更多你需要的页面
     # 在导航栏中的页面搜索功能 https://github.com/theme-next/hexo-generator-searchdb
     search:
       # 是否启用导航栏搜索
       enable: false
       # 在加载页面的时候加载搜索数据
       preload: true
   # 导航栏设置 <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< 结束
   
   
   # 主页文章设置 >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> 开始
   # Docs: https://redefine-docs.ohevan.com/home/home
   home:
     # 侧边栏设置
     sidebar:
       enable: true # 是否启用侧边栏（links留空为不显示）
       position: left # 侧边栏位置（left-左侧 right-右侧）
       first_item: menu # 侧边栏先显示导航栏menu/公告info
       announcement: # 公告内容
       show_on_mobile: true # 是否在手机上显示侧边栏
       links:
         # Archives: 
         #   path: /archives 
         #   icon: fa-regular fa-archive
         # Tags: 
         #   path: /tags 
         #   icon: fa-regular fa-tags
         # Categories: 
         #   path: /categories 
         #   icon: fa-regular fa-folder
         # 可以按照导航栏格式添加更多项
     # 文章日期格式
     article_date_format: auto # auto-根据文章日期自动选择格式, relative-显示相对时间, YYYY-MM-DD-显示年月日, YYYY-MM-DD HH:mm:ss-显示年月日时分秒
     # 自定义文章摘要的长度
     excerpt_length: 200 # 最大长度字数
     # 分类功能
     categories:
       enable: true  # 分类功能开关
       limit: 3 # 最大分类显示数量
     # 标签
     tags:
       enable: true  # 显示标签开关
       limit: 3  #最大标签显示数量
   # 主页文章设置 <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< 结束
   
   
   # 文章 >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> 开始
   # Docs: https://redefine-docs.ohevan.com/posts/articles
   articles:
     # 文章样式
     style:
       font_size: 16px # 正文字体大小
       line_height: 1.5 # 正文行高
       image_border_radius: 14px # 图片圆角大小
       image_alignment: center # 图片对齐方向（left-左对齐 center-中心对齐）
       image_caption: false # 是否在图片下方显示描述（alt参数）
       link_icon: true # 是否在超链接后面显示图标（提示可点击前往的图标）
       title_alignment: left # 标题对齐方式（left-左 center-中心）
       headings_top_spacing: # 标题顶部间距
         h1: 3.2rem
         h2: 2.4rem
         h3: 1.9rem
         h4: 1.6rem
         h5: 1.4rem
         h6: 1.3rem
     # 字数统计功能，查看 https://github.com/willin/hexo-wordcount
     word_count:
       enable: true # 是否启用
       count: true # 是否显示
       min2read: true # 是否显示阅读时间
     # 作者标签
     author_label: 
       enable: true # 是否启用作者标签
       auto: false # 自动打上作者标签
       list: []
     # 代码块设置
     code_block:
       copy: true #是否能被一键复制
       style: mac # 代码块边框样式：mac | simple
       highlight_theme: # 代码高亮配色方案 请查看https://highlightjs.org/examples
         light: github # 亮色模式下的配色方案, 支持: github, atom-one-light, default
         dark: vs2015 # 暗色模式下的高亮配色, 支持: github-dark, monokai-sublime, vs2015, night-owl, atom-one-dark, nord, tokyo-night-dark, a11y-dark, agate
       font: # 自定义字体
         enable: false # 是否启用
         family: # 字体名称
         url: # 字体CSS样式文件的URL
     # 目录设置
     toc:
       enable: true # 是否启用目录
       max_depth: 3 # 最大目录深度（1-6）
       number: false # 自动目录编号
       expand: true # 是否全部展开
       init_open: true # 是否默认打开TOC
     # 文章版权
     copyright:
       enable: true # 是否在文章末尾展示版权信息
       default: cc_by_nc_sa # 默认版权信息, 可填写方式： cc_by_nc_sa, cc_by_nd, cc_by_nc, cc_by_sa, cc_by, all_rights_reserved, public_domain
     # 懒加载功能
     lazyload: true
     # Article recommendation. Requires nodejieba (npm install nodejieba). Transplanted from hexo-theme-volantis.
     recommendation:
       # Whether to enable article recommendation
       enable: false
       # Article recommendation title
       title: 推荐阅读
       # Max number of articles to display
       limit: 3
       # Max number of articles to display mobile
       mobile_limit: 2
       # Placeholder image
       placeholder: /images/wallhaven-wqery6-light.webp
       # Skip directory
       skip_dirs: []
   # ARTICLE <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< end
   
   
   # COMMENT >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> start
   # Docs: https://redefine-docs.ohevan.com/posts/comment
   comment:
     # Whether to enable comment
     enable: true
     # Comment system
     system: waline # waline, gitalk, twikoo, giscus
     # System configuration
     config:
       # Waline comment system. See https://waline.js.org/
       waline:
         serverUrl: https://example.example.com # Waline server URL. e.g. https://example.example.com
         lang: zh-CN # Waline language. e.g. zh-CN, en-US. See https://waline.js.org/guide/client/i18n.html
         emoji: [] # Waline emojis, see https://waline.js.org/guide/features/emoji.html
         recaptchaV3Key: # Google reCAPTCHA v3 key. See https://waline.js.org/reference/client/props.html#recaptchav3key
         turnstileKey: # Turnstile key. See https://waline.js.org/reference/client/props.html#turnstilekey
         reaction: false # Waline reaction. See https://waline.js.org/reference/client/props.html#reaction
       # Gitalk comment system. See https://github.com/gitalk/gitalk
       gitalk:
         clientID: # GitHub Application Client ID
         clientSecret: # GitHub Application Client Secret
         repo: # GitHub repository
         owner: # GitHub repository owner
         proxy: # GitHub repository proxy
       # Twikoo comment system. See https://twikoo.js.org/
       twikoo:
         version: 1.6.10 # Twikoo version, do not modify if you dont know what it is
         server_url: # Twikoo server URL. e.g. https://example.example.com
         region: # Twikoo region. can be empty
       # Giscus comment system. See https://giscus.app/
       giscus:
         repo: # Github repository name e.g. EvanNotFound/hexo-theme-redefine
         repo_id: # Github repository id
         category: # Github discussion category
         category_id: # Github discussion category id
         mapping: pathname # Which value to use as the unique identifier for the page. e.g. pathname, url, title, og:title. DO NOT USE og:title WITH PJAX ENABLED since pjax will not update og:title when the page changes
         strict: 0 # Whether to enable strict mode. e.g. 0, 1
         reactions_enabled: 1 # Whether to enable reactions. e.g. 0, 1
         emit_metadata: 0 # Whether to emit metadata. e.g. 0, 1
         lang: en # Giscus language. e.g. en, zh-CN, zh-TW
         input_position: bottom # Place the comment box above/below the comments. e.g. top, bottom
         loading: lazy # Load the comments lazily
   # COMMENT <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< end
   
   
   # FOOTER >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> start
   # Docs: https://redefine-docs.ohevan.com/footer
   footer:
     # Show website running time
     runtime: true # show website running time or not
     # Icon in footer, write fontawesome icon code here
     icon: '<i class="fa-solid fa-heart fa-beat" style="--fa-animation-duration: 0.5s; color: #f54545"></i>'
     # The start time of the website, format: YYYY/MM/DD HH:mm:ss
     start: 2022/8/17 11:45:14
     # Site statistics
     statistics: true # show site statistics or not (total articles, total words)
     # Footer message
     customize:
     # ICP record number. See https://beian.miit.gov.cn/
     icp:
       enable: false # Whether to enable
       number: # ICP record number
       url: # ICP record url
   # FOOTER <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< end
   
   
   # INJECT >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> start
   # Docs: https://redefine-docs.ohevan.com/inject
   inject:
     # Whether to enable inject
     enable: false
     # Inject custom head html code
     head: 
       -
       -
     # Inject custom footer html code
     footer:
       -
       -
   # INJECT <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< end
   
   
   # PLUGINS >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> start
   # Docs: https://redefine-docs.ohevan.com/plugins
   plugins:
     # RSS feed. Requires hexo-generator-feed (npm i hexo-generator-feed). See https://github.com/hexojs/hexo-generator-feed
     feed:
       enable: false # Whether to enable
     # Aplayer. See https://github.com/DIYgod/APlayer
     aplayer:
       enable: false # Whether to enable
       type: fixed # fixed, mini
       audios:
         - name: # audio name
           artist: # audio artist
           url: # audio url
           cover: # audio cover url
           lrc: # audio cover lrc
   #      - name: # audio name
   #        artist: # audio artist
   #        url: # audio url
   #        cover: # audio cover url
   #        lrc: # audio cover lrc
         # .... you can add more audios here
     # Mermaid JS. Requires hexo-filter-mermaid-diagrams (npm i hexo-filter-mermaid-diagrams). See https://mermaid.js.org/
     mermaid:
       enable: false # enable mermaid or not
       version: "9.3.0" # default v9.3.0
   # PLUGINS <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< end
   
   
   # PAGE TEMPLATES >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> start
   # Docs: https://redefine-docs.ohevan.com/page_templates
   page_templates:
     # Friend Links page column number
     friends_column: 2
     # Tags page style
     tags_style: blur # blur, cloud
   # PAGE TEMPLATES <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< end
   
   
   # CDN >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> start
   # Docs: https://redefine-docs.ohevan.com/cdn
   cdn:
     # Whether to enable CDN
     enable: false
     # CDN Provider
     provider: npmmirror # npmmirror, zstatic, sustech, cdnjs, jsdelivr, unpkg, custom
     # Custom CDN URL
     # format example: https://cdn.custom.com/hexo-theme-redefine/${version}/source/${path}
     # The ${path} must leads to the root of the "source" folder of the theme
     custom_url: 
   # CDN <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< end
   
   # DEVELOPER MODE >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> start
   # Docs: https://redefine-docs.ohevan.com/developer
   developer:
     # Whether to enable developer mode (only for developers who want to modify the theme source code, not for ordinary users)
     enable: false
   # DEVELOPER MODE <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< end
   ```

   - 英文好的话可以直接看文件内的注释，不好的话看主题官网[Hexo Theme Redefine Docs](https://redefine-docs.ohevan.com/zh/basic)
   - 按照需求修改键值对
   - 后面比较少用，中文写不动了嘿嘿~



## 预览与推送

```bash
$ hexo generate  # 生成静态页面
$ hexo server  # 启动服务器
# 访问 https://localhost:4000 检查完成后执行下面这句命令
$ hexo clean  # 清除缓存(db.json与public/内的静态页面)
```

1. 检查页面无问题后可以开始推送到Github仓库中

2. 前面我们已经配置好了Git与Github的SSH连接，现在前往远程仓库复制SSH地址

3. 在本地站点使用`Git Bash`中执行这几句命令

   ```bash
   $ git init  # 创建Git工作目录
   $ git add .  # 添加目录中的所有文件
   $ git commit -m "第一次推送"  # 填写提交描述
   $ git remote add origin git@github.com:UserName/UserName.github.io.git  # 关联远程仓库
   $ git push -u origin main  # 推送到main分支（也可以是master\gh-pages）
   ```

   - 分支可以是`main`、`master`或`gh-pages`，现在已无硬性要求

   - 如果Git显示默认分支为`master`，可以使用这句指令切换（创建）分支

     ```bash
     $ git branch main
     $ git checkout main
     ```
     
     



## 配置Github Actions

1. 先记录本地`node.js`版本号

   ```bash
   $ node --version
   ```

   > 输出：v22.11.0

2. 在`.github/workflows/`中创建`pages.yml`文件

   ```yaml
   name: Pages
   
   on:
     push:
       branches:
         - main # default branch
   
   jobs:
     build:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v4
           with:
             token: ${{ secrets.GITHUB_TOKEN }}
             # If your repository depends on submodule, please see: https://github.com/actions/checkout
             submodules: recursive
         - name: Use Node.js 22.11.0
           uses: actions/setup-node@v4
           with:
             # Examples: 20, 18.19, >=16.20.2, lts/Iron, lts/Hydrogen, *, latest, current, node
             # Ref: https://github.com/actions/setup-node#supported-version-syntax
             node-version: "22.11.0"
         - name: Cache NPM dependencies
           uses: actions/cache@v4
           with:
             path: node_modules
             key: ${{ runner.OS }}-npm-cache
             restore-keys: |
               ${{ runner.OS }}-npm-cache
         - name: Install Dependencies
           run: npm install
         - name: Build
           run: npm run build
         - name: Upload Pages artifact
           uses: actions/upload-pages-artifact@v3
           with:
             path: ./public
     deploy:
       needs: build
       permissions:
         pages: write
         id-token: write
       environment:
         name: github-pages
         url: ${{ steps.deployment.outputs.page_url }}
       runs-on: ubuntu-latest
       steps:
         - name: Deploy to GitHub Pages
           id: deployment
           uses: actions/deploy-pages@v4
   ```

   - 如果远程仓库分支名不为`main`，请修改文件第6行代表`default branch`的`main`为你的分支名

## 网站使用方法

1. 如何攥写博客请查阅[写作指南 | Hexo Theme Redefine Docs](https://redefine-docs.ohevan.com/zh/tips)

2. 攥写博客在`website\source\`目录下进行

3. 图片文件请在`source\`目录下创建文件夹存放，攥写博客插入图片时填写相对路径。

4. 该主题在文章开头不适合使用一级标题，请使用`fornt-matter`中的`title`键值对。(输入`---`后回车即可创建文件标头)

   ```markdown
   ---
   title: 博客建立帮助文档
   date: 2024-11-14 18:46:00
   tags:
     - "Hexo"
     - "hexo-theme"
     - "Github Pages"
   ---
   ```



### 感谢您看到这里，官方文档有各自重点考虑的部分，遇到问题一定要多文档结合检查，祝您建站顺利！

