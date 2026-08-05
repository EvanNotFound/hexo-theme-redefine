---
title: "WordPress 无缝从 Apache 迁移到 Nginx"
date: "2022-04-20"
categories:
  - "learning-to-take-notes"
  - "技术"
  - "教程"
  - "the-website"
  - "the-optimization-of-the-website"
  - "translation-of-the"
tags:
  - "apache2"
  - "Nginx"
  - "wordpress"
  - "技术"
  - "教程"
  - "方法"
  - "网站"
coverImage: "what-is-nginx-1024x512-1.png"
link: migrating-from-apache-to-nginx-on-ubuntu-with-wordpress-chinese
layout: post
keywords: "apache,Nginx,apache转Nginx,migrate from apache to nginx,Apache无缝迁移Nginx,apache to nginx"
description: "本文将教你如何从 Apache无缝迁移Nginx。由于 apache 访问实在是太慢了，同时占用服务器资源又多，我就决定将服务器内核从 apache迁移到 nginx。有幸在谷歌上找到一个大佬写的教程。原教程是英文，我现在将它翻译过来并且完善、增加一些我自己的部分"
---

<div class="wr">
  <div class="t">
    版权声明
  </div>
  <div class="c">
    原文：<a href="https://www.labsrc.com/migrating-from-apache-to-nginx-on-ubuntu-with-wordpress/">https://www.labsrc.com/migrating-from-apache-to-nginx-on-ubuntu-with-wordpress/</a>
    <br>翻译：Evan Luo
		<br>已获得原作者许可，未经授权禁止转载
  </div>
</div>

## 1\. 引入

由于 [apache](https://en.wikipedia.org/wiki/Apache_HTTP_Server) 访问实在是太慢了，同时占用服务器资源又多，我就决定将服务器内核从 apache迁移到 [nginx](https://en.wikipedia.org/wiki/Nginx)。

但是想想，（但是我见到你们这样热情，一句话不说也不好）又觉得万一哪个操作不好，把服务器搞崩了就得不偿失了。

不过有幸在谷歌上找到一个大佬写的教程。

原教程是英文，我现在将它翻译过来并且完善、增加一些我自己的部分（夹带私货（bushi

本教程适用于已经搭建好 wordpress 博客和 mysql 数据库的站长，想不动其他任何东西，无缝迁移到Nginx

> _介绍: Nginx是一款轻量级的Web 服务器/反向代理服务器及电子邮件（IMAP/POP3）代理服务器，并在一个BSD-like 协议下发行。其特点是占有内存少，并发能力强，事实上nginx的并发能力确实在同类型的网页服务器中表现较好。_

![](https://evan.beee.top/wp-content/uploads/2022/04/NGINX-logo-rgb-large-300x101.png?x-oss-process=image/auto-orient,1/format,webp)

### 1.1 FAQ

#### 1.1.1 为什么要使用 Nginx？

以下内容来自知乎：

1. 作为 Web 服务器，Nginx 效率更高
2. Nginx 配置简洁, Apache 复杂
3. **核心区别：**apache是同步多进程模型，**一个连接对应一个进程**；nginx是异步的，**多个连接（万级别）可以对应一个进程**

由此，Nginx 更稳定，所以我推荐你使用 Nginx 来代替 apache

#### 1.1.2 迁移麻烦吗？会不会又要改很多文件？

Nginx 和 Apache 有很多相似的地方，并且更改文件的步骤很少。

本次迁移预计用时 15 min，所以不必担心，放心照做就好

#### 1.1.3 会不会迁移过程中，出错然后服务器原地去世？

本教程遵循安全第一的原则，过程中遇到问题，可以随时切回 apache， 并且迁移过程中能保持网站持续运行，不会删除任何文件。

### 1.2 本人运行环境

系统硬件：树莓派 4b 4G版本  
系统版本：Ubuntu 20.04.1 LTS  
PHP版本：7.4.3

### 1.3 准备

- **备份网站**
- **在安装前先熟悉整篇文章，防止弄错**
- **更换会造成站点短暂掉线，做好说明**

---

## 2\. 安装 Nginx

\_命令可以整行复制，`#`后面的都是注释（感觉这个应该不用说吧）\_

### 2.1 让 apache 休息一会

首先，我们要先在 ubuntu 中增加 Nginx 的库

```bash
$ sudo add-apt-repository ppa:nginx/mainline #增加 Nginx 库
```

一般 Nginx 在安装以后，会自动启动。这个时候如果不关闭 apache，就会导致 80 端口冲突，情况会变得很麻烦。

保险起见，所以我们在安装的时候还是先关掉 apache ，这个过程只会持续一小会（不超过3min），所以不必担心

```bash
$ sudo systemctl stop apache2 #关闭 apache
```

apache 关闭以后，我们继续安装 Nginx

```bash
$ sudo apt update #更新软件包列表
$ sudo apt install nginx #安装 Nginx
```

安装好以后，我们就可以关掉 Nginx 再把 Apache 开起来了

```bash
$ sudo systemctl stop nginx #关闭 Nginx
$ sudo systemctl start apache2 #打开 Apache
```

你的网站现在应该已经恢复正常了

现在 Nginx 关了，那我们接下来安装依赖

### 2.2 光 PHP 不够，我还要

既然你先前已经安装过 Apache，那么你服务器上应该已经有一些基本的 Php 模块，这样 WordPress 才能运行。

但是 Nginx 并不能原生支持 PHP，所以我们需要 `php-fpm` 模块来支持运行

```bash
$ sudo apt install php-fpm #安装 php-fpm 模块
```

\*笔记：如果你对 **`/etc/php/7.x/apache2/php.ini`** 进行了更改，请将更改的内容迁移到 **`/etc/php/7.x/fpm/php.ini`**。更改以后，运行 **`sudo systemctl restart php7.x-fpm`** 重启php-fpm服务（"7.x" 填写你的 php 版本）

现在 Nginx 和它的依赖已经装好了，我们继续配置 Nginx

---

## 3\. 配置 Nginx

现在我们来创建 WordPress 全局设置

其中包含了 WordPress 的常规设定

### 3.1 创建 WordPress 全局设定

全局设定的文件位于 `/etc/nginx/wordpress.conf`

本来是没有这个文件的，所以我们要创建它

```bash
$ sudo nano /etc/nginx/wordpress.conf
```

\*笔记：Apache 和 Nginx 不同的是，在每一行结尾都会有个`分号`

以下是文件内容

```c++
# Enable PHP Processing
location ~ \.php$ {
    include snippets/fastcgi-php.conf;
    fastcgi_pass unix:/run/php/php7.x-fpm.sock;
}

# Disables Favicon Logging & Errors
location = /favicon.ico {
    log_not_found off;
    access_log off;
}

# Disables Robots.txt Logging & Errors
location = /robots.txt {
    allow all;
    log_not_found off;
    access_log off;
}

# Denies Access to Hidden Files
location ~ /\. {
    deny all;
}

# Blocks PHP files in Upload Directory
location ~* /(?:uploads|files)/.*\.php$ {
    deny all;
}

# Enable WordPress Permalinks Support (default .htaccess replacement)
location / {
    try_files $uri $uri/ /index.php?$args;
}
```

请注意：请在第四行 `fastcgi_pass unix:/run/php/php7.2-fpm.sock;` 中将 `php7.x` 改为你的 php 版本

比如我的 php 版本是 7.4.3 那么久应该改为 `php7.4`

每两个大括号括起来的是一个 `location block`，每个都对应了站点中特定目录和文件。我（原作者）在上面添加了注释方便理解

### 3.2 和 .htaccess 说再见

本段是对上一步中，最后一个 `location block` 的解释，所以无需操作任何东西，只需要了解一下即可。

即

```c++
# Enable WordPress Permalinks Support (default .htaccess replacement)
location / {
    try_files $uri $uri/ /index.php?$args;
}
```

这一个 block 非常重要，因为它解决了从 Apache 迁移到 Nginx 会遇到的一个最大的问题

**Nginx 不支持 .htaccess**

它能让 wordpress 的固定链接生效。

如果你不熟悉 `.htaccess` ，你可以前往：[WordPress固定链接介绍](https://wordpress.org/support/article/using-permalinks/ "WordPress固定链接")。当然，是生肉 XD

### 3.3 一些 FastCGI 调整

根据我的实际测试，我发现为了让 Wordpress 正常工作，要改个设置

鉴于改了这个设置对所有站点都有好处，所以我们直接修改

```bash
$ sudo nano /etc/nginx/fastcgi.conf #编辑FastCGI设置
```

在文档尾部添加

```c++
fastcgi_buffer_size 128k;
fastcgi_buffers 256 16k;
```

这两个设置能增加 FastCGI 的缓冲区，解决页面 502 Bad Gateway问题（原作者遇到过）。你可以根据你服务器的 RAM 大小来调整。（一般不用动）

### 3.4 再回头看看 Apache

接下来我们再来**看看** apache 的配置文件，位于 `/etc/apache/sites-available` 或者 `/etc/apache2/sites-available`，里面有两个文件（我这里有两个）

![apache 中的 Sites available 文件列表
](https://evan.beee.top/wp-content/uploads/2022/04/Screen-Shot-2022-04-30-at-15.34.23.png?x-oss-process=image/auto-orient,1/format,webp)

打开 ssl 那个（别跟我说你服务器没有 ssl，没有的话赶快搞一个）

以下是参考的配置文件：

```yaml
<VirtualHost *:80>
ServerName www.examplesite.com
ServerAlias examplesite.com
Redirect 301 / https://www.examplesite.com/
DocumentRoot /var/www/www.examplesite.com
DirectoryIndex index.php index.html
ErrorLog ${APACHE_LOG_DIR}/error.log
TransferLog ${APACHE_LOG_DIR}/access.log

<Directory /var/www/www.examplesite.com>
Options FollowSymLinks
Options -Indexes
AllowOverride All
Require all granted
</Directory>
</VirtualHost>
<IfModule mod_ssl.c>
<VirtualHost *:443>
ServerName www.examplesite.com
ServerAlias examplesite.com
DocumentRoot /var/www/www.examplesite.com
DirectoryIndex index.php index.html
ErrorLog ${APACHE_LOG_DIR}/error.log
TransferLog ${APACHE_LOG_DIR}/access.log

SSLEngine on
SSLCertificateFile /etc/ssl/certs/ssl-cert-snakeoil.pem
SSLCertificateKeyFile /etc/ssl/private/ssl-cert-snakeoil.key

<FilesMatch "\.(cgi|shtml|phtml|php)quot;>
SSLOptions +StdEnvVars
</FilesMatch>
<Directory /usr/lib/cgi-bin>
SSLOptions +StdEnvVars
</Directory>
BrowserMatch "MSIE [2-6]" \ nokeepalive ssl-unclean-shutdown \ downgrade-1.0 force-response-1.0 BrowserMatch "MSIE [17-9]" ssl-unclean-shutdown
<Directory /var/www/www.examplesite.com>
Options FollowSymLinks Options -Indexes AllowOverride All Require all granted
</Directory>
</VirtualHost>
</IfModule>
```

### 3.5 创建 WordPress 网站的配置文件

注意

以下的都是以网址前缀带 www 而进行的步骤  
请把 `www.你的网站.com` 改成你的网站域名，比如我的就改成 `ohevan.com`  
请把 `你的网站.com` 改成你的网站根域名，比如我的就改成 `evanluo.top`

基于之前的 Apache 配置，我们在 `/etc/nginx/sites-available/` 创建一个新的 Wordpress 配置文件 `www.你的网站.com.conf`。

和之前创建的 WordPress 全局配置文件不一样，这个配置文件只在特定网址有效

这个配置文件被拆分成一个一个一个一个 `Server Block`，作用和 `Apache Virtual Host` 一样

```bash
$ sudo nano /etc/nginx/sites-available/www.你的网站域名.com.conf  #创建 WordPress 网站配置文件，注意改名字
```

然后把下面这段粘贴进去并保存（记得改成你的域名）

SSL证书改成你的证书的路径，分别是pem和key，有两处，都要改

```c++
# 重定向 HTTP -> HTTPS
server {
    listen 80;
    server_name www.你的网站.com 你的网站根域名.com;
    return 301 https://www.你的网站.com$request_uri;
}

# 重定向根域名 -> WWW
server {
    listen 443 ssl http2;
    server_name 你的网站根域名.com;
    return 301 https://www.你的网站.com$request_uri;

    # SSL 证书配置
    ssl_certificate /etc/ssl/certs/ssl-cert-snakeoil.pem;
    ssl_certificate_key /etc/ssl/private/ssl-cert-snakeoil.key;
}

server {
    listen 443 ssl http2;
    server_name www.你的网站.com;

    root /var/www/www.你的网站.com;
    index index.php;

    # WordPress Global Config
    include wordpress.conf;

    # SSL 证书配置
    ssl_certificate /etc/ssl/certs/ssl-cert-snakeoil.pem;
    ssl_certificate_key /etc/ssl/private/ssl-cert-snakeoil.key;

    # Log存放位置
    access_log /var/log/nginx/www.你的网站.com.access.log;
    error_log /var/log/nginx/www.你的网站.com.error.log;
}
```

第一个 server 区块会将 Https 重定向到 Https。

第二个 server 区块会将根域名重定向到www

最后一个 server 区块定义了 WordPress的根目录并且链接我们之前创建的 WordPress 全局设定。

### 3.6 Nginx 的 SSL 证书

这个部分一般用不到，因为很多人用的都是免费证书，也只有部分特定证书需要进行证书合并，所以暂且略过。

如果需要的可以去原文看一下。（我才不会说是因为太难翻译了所以就不翻译了）

一般你只需要拿到 pem 和对应的证书 key，复制分别文件链接到上一步的 SSL 证书配置，就可以了（有两处，都要更改）

### 3.7 启用 WordPress 网站

现在我们已经成功完成了 WordPress 的网站配置，就可以启用了。

记住，你 Apache 还在运行，只有手动开启 Nginx 服务以后，才真正有用。

```bash
$ sudo ln -s /etc/nginx/sites-available/www.examplesite.com.conf /etc/nginx/sites-enabled/  #启用 Nginx server区块
```

如果你需要关闭一个站点，可以直接到 `/etc/nginx/sites-enabled` 删除链接。

\*笔记：你可能之前用 **`a2ensite`** 或者 **`a2dissite`** 来启用/关闭 apache 目录下的网站。可惜，Nginx原生没有这个东西，但是有插件可以实现这个功能

---

## 4\. 是时候把所有东西交给 Nginx 了

在关闭 Apache 之前，我们要确保 Nginx 的配置文件没有出错，所以运行以下命令来测试 Nginx 配置文件的语法有没有问题

```bash
$ sudo nginx -t  #测试Nginx配置文件
```

如果有错误，命令行会告诉你哪里有问题。如果没有任何错误，那么你就应该可以顺利开启服务器了

接下来是重头戏了，我们需要关闭 Apache，开启 Nginx

```bash
$ sudo systemctl stop apache2  #关闭Apache
$ sudo systemctl start nginx  #开启Nginx
```

---

## 5\. 测试你的 WordPress 网站

首先，清除你网站在浏览器里面的缓存（或者换个浏览器）

其次，如果成功访问了，你应该点击各种网站上的链接尝试一下连接是否正常。并且别忘了，登陆网站后台看看你后台是否正常。

但是，如果有问题，你可以立刻停止 Nginx 服务，并且开启 Apache 服务，然后再去排查你 Nginx 的错误。

### 5.1 和 Apache Say↑ Goodbye↓

You Know The Rules  
And SO↑ DO↓ I→

如果你的网站能正常用 Nginx 运行，你可以关闭 Apache 的开机自启，然后打开 Nginx 的开机自启

```bash
$ sudo systemctl disable apache2  #关闭Apache开机自启
$ sudo systemctl enable nginx  #开启Nginx开机自启
```

（不推荐）如果你空间不足，迫不得已，你可以删除 Apache，当然你得足够自信 Nginx 能完美运行。

```bash
$ sudo apt purge apache2*
$ sudo apt autoremove
$ sudo rm -rf /etc/apache2  #卸载Apache
```

## 6\. 结语

我还在学习中，所以有不足的地方，欢迎向我提问

感谢这位原教程大佬！

再次声明，

本文原文 [https://www.labsrc.com/migrating-from-apache-to-nginx-on-ubuntu-with-wordpress/](https://www.labsrc.com/migrating-from-apache-to-nginx-on-ubuntu-with-wordpress/)

由 Evan Luo翻译，且已经获得原作者许可，**未经授权禁止转载**

遇到问题？欢迎发送邮件到 [contact@evanluo.top](mailto:contact@evanluo.top)
