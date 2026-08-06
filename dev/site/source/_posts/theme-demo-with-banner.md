---
title: 主题样式 Demo - With Banner
date: 2023-2-14 19:07:05
tags: "demo"
thumbnail: "https://images.unsplash.com/photo-1698725224250-afb10355c2c4?q=80&w=2971&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
sticky: 980
categories:
  - [demo123]
  - [demo456, demo789]
license: public_domain
#copyright: 本文章作者保留所有权利，禁止转载
expires: 2023-10-02 19:07:05
author:
    name: Evan
    link: https://www.ohevan.com
    avatar: https://picsum.photos/200
avatar: https://picsum.photos/200
---

# 主题样式演示 - 高级功能

本文档用于测试 Redefine 主题的高级功能，包括横幅图片、作者信息、提示块、折叠内容等。

## 🔢 数学公式测试

### 化学公式
$$H_2O$$

## 📝 文本和格式测试

### 基础文本样式
**加粗**

_斜体_

~~删除线~~

### 代码格式
`行内代码`

```
代码块
```

```python
print("代码高亮")
print("代码高亮")
print("代码高亮")
print("代码高亮")
print("代码高亮")
print("代码高亮")
print("代码高亮")
print("代码高亮")
```

## 🌍 语言和字符测试

### 中文段落
中文段落测试，中文段落测试，中文段落测试，中文段落测试，中文段落测试，中文段落测试，中文段落测试，中文段落测试，中文段落测试。中文段落测试中文段落测试中文段落测试中文段落测试中文段落测试中文段落测试中文段落测试中文段落测试中文段落测试中文段落测试中文段落测试，中文段落测试中文段落测试中文段落测试中文段落测试中文段落测试中文段落测试中文段落测试。

### 特殊字符
bruh -> nooo

左右箭头测试：<=>

### Lorem Ipsum 文本
Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.

## 📊 超长表格测试

this is a very long table

[//]: # (| 1   | 2   | 3   | 4   | 5   | 6   | 7   | 8   | 9   | 10  | 11  | 12  | 13  | 14  | 15  | 16  | 17  | 18  | 19  | 20  |)

[//]: # (| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |)

[//]: # (| 1   | 2   | 3   | 4   | 5   | 6   | 7   | 8   | 9   | 10  | 11  | 12  | 13  | 14  | 15  | 16  | 17  | 18  | 19  | 20  |)

[//]: # (| 1   | 2   | 3   | 4   | 5   | 6   | 7   | 8   | 9   | 10  | 11  | 12  | 13  | 14  | 15  | 16  | 17  | 18  | 19  | 20  |)

## 🔔 提示块样式测试

{% callout type="info" title="提 示" class="custom-class" %}
命名参数让配置更清晰。
{% endcallout %}

### 基础提示块
{% callout type="default" %}
默认 提示块标签
{% endcallout %}

### 彩色提示块
{% callout type="default" %}
default 提示块标签
{% endcallout %}

{% callout type="primary" %}
primary 提示块标签
{% endcallout %}

{% callout type="success" %}
success 提示块标签
{% endcallout %}

{% callout type="info" %}
info 提示块标签
{% endcallout %}

{% callout type="warning" %}
warning 提示块标签
{% endcallout %}

{% callout type="danger" %}
danger 提示块标签
{% endcallout %}

{% callout type="tip" %}
tip 提示块标签
{% endcallout %}

{% callout type="question" %}
question 提示块标签
{% endcallout %}

### 自定义提示块
{% callout type="red" icon="fa-solid fa-bolt" %}
自定义提示块标签
{% endcallout %}

## 📋 增强提示块测试

### 图标提示块
{% callout type="default" title="信息" icon="fa-solid fa-bolt" %}
带有图标的提示块测试
{% endcallout %}

{% callout type="blue" title="提示" %}
蓝色提示块测试
{% endcallout %}

### 自定义标题提示块
{% callout type="red" title="自定义标题" %}
Certainly! Here's an example of a 2x2 matrix using MathJax. If you input this into a platform that supports MathJax, such as a Jupyter notebook or many online math forums, it should render the matrix properly.
{% endcallout %}

## 📂 折叠内容测试

### 黄色折叠块
{% folding yellow::Folding 测试： 点击查看更多 %}
{% callout type="danger" %}
danger 提示块标签
{% endcallout %}

{% callout type="tip" %}
tip 提示块标签
{% endcallout %}
{% endfolding %}

### 绿色折叠块
{% folding green::Folding 测试： 点击查看更多 %}
{% callout type="danger" %}
danger 提示块标签
{% endcallout %}

{% callout type="tip" %}
tip 提示块标签
{% endcallout %}
{% endfolding %}

### 蓝色折叠块
{% folding blue::Folding 测试： 点击查看更多 %}
不设置任何参数的 {% button text="按钮" url="/" %} 适合融入段落中。

regular 按钮适合独立于段落之外：

> 换行测试
>
> aaa

换行测试

换行测试
{% endfolding %}

## 写作模块嵌套测试

{% tabs test tabs %}

<!-- tab norm1 -->

内容1

{% callout type="blue" title="提示" %}
换行测试1
换行测试2
换行测试3
{% endcallout %}

<!-- endtab -->
<!-- tab norm2 -->

内容2

{% callout type="blue" title="提示" %}
换行测试4
换行测试5
换行测试6
{% endcallout %}

<!-- endtab -->

{% endtabs %}

{% tabs %}

<!-- tab First Tab-->

**This is Tab 1.**

Lorem ipsum dolor sit amet, *consectetur* adipiscing elit.  
Integer nec odio. Praesent libero. Sed cursus ante dapibus diam.

{% callout type="success" %}
成功提示：这是第一个标签页中的一个 note 组件演示。
{% endcallout %}

- 清单项一
- 清单项二 `inline code`
- 清单项三

> 引用内容：Tabs 支持嵌套写作组件和 Markdown。

---

```js
// 示例代码块
console.log('Hello from Tab 1');
```

<!-- tab Second Tab-->

**This is Tab 2.**

> “Lorem ipsum dolor sit amet, consectetur adipiscing elit.”

{% folding blue::点击展开更多内容 %}
隐藏内容演示：Vivamus sagittis lacus vel augue laoreet rutrum faucibus dolor auctor.
{% endfolding %}

| 列1      | 列2      |
|----------|----------|
| 内容 A   | Lorem    |
| 内容 B   | Ipsum    |

```
$ pnpm run build
```

{% callout type="warning" title="注意" %}
这里有一个 warning note 组件，带图标。
{% endcallout %}

<!-- tab Third Tab -->

**This is Tab 3.**

1. 有序列表项一
2. 有序列表项二
3. 有序列表项三

{% callout type="info" %}
Tab 3 可以包含更多内容，比如图片、链接等。
{% endcallout %}

![一张图片演示](https://picsum.photos/320/120)

[跳转到 Redefine Docs](https://redefine-docs.ohevan.com)

---

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non risus. Suspendisse lectus tortor, dignissim sit amet, adipiscing nec, ultricies sed, dolor.

<!-- endtab -->

{% endtabs %}
## 🔘 按钮样式测试

### 内联按钮
不设置任何参数的 {% button text="按钮" url="/" %} 适合融入段落中。

### 常规按钮
{% button text="示例博客" url="https://www.ohevan.com" icon="fa-solid fa-play-circle" %}

{% button text="示例博客" url="https://www.ohevan.com" icon="fa-solid fa-play-circle" %}

### 大按钮（居中）
{% button text="开始使用" url="https://redefine-docs.ohevan.com." icon="fa-solid fa-download" size="lg" align="center" %}

## 📑 选项卡测试

{% tabs First unique name %}

<!-- tab First Tab-->

**This is Tab 1.**

```
wdasdwasdwasdwasdwa
```

> 换行测试
>
> Edward

aaa

<!-- endtab -->

<!-- tab Second Tab-->

**This is Tab 2.**

This is Tab 2.

<!-- endtab -->

<!-- tab Third Tab-->

| Header 1 | Header 2 | Header 3 |
|----------|----------|----------|
| Row 1, Col 1 | Row 1, Col 2 | Row 1, Col 3 |
| Row 2, Col 1 | Row 2, Col 2 | Row 2, Col 3 |
| Row 3, Col 1 | Row 3, Col 2 | Row 3, Col 3 |

this is some `code` and more `code` `code` this is some `code` and more `code` `code` this is some `code` and more `code` `code` this is some `code` and more `code` `code`



<!-- endtab -->



{% endtabs %}

## 💻 代码块测试

### 自定义代码块
{% codeblock 标题 lang:python first_line:2 %}
print("this is a codeblock")

if input("this is a ") == "codeblock"
    print("Yeah")
{% endcodeblock %}

## 🎨 图标字体测试

## Font Awesome 6.1.0

**Solid:** <i class="fa-solid fa-house"></i> <i class="fa-solid fa-envelope"></i>

**Regular:** <i class="fa-regular fa-house"></i> <i class="fa-regular fa-envelope"></i>

**Light:** <i class="fa-light fa-house"></i> <i class="fa-light fa-envelope"></i>

**Thin:** <i class="fa-thin fa-house"></i> <i class="fa-thin fa-envelope"></i>

**Duotone:** <i class="fa-duotone fa-house"></i> <i class="fa-duotone fa-envelope"></i>

## 🔘 HTML 按钮测试

<a class="btn">aaa</a>

## 🌏 中英混合文本测试

这是一个测试段落hello你好world中文English混合paragraph测试没有spaces之间的文字testing测试pangu.js的functionality以及它的效果how它会处理这种情况when中英文混合的时候。

## HTML Tab 测试
<div class="tabs relative my-4 bg-third-background-color border border-border-color rounded-md" id="tab-first-unique-name">
  <div role="tablist" aria-orientation="horizontal" class="flex gap-3.5 overflow-x-auto px-4 not-markdown scrollbar-hide" tabindex="0">
    <button type="button" role="tab" aria-selected="true" data-state="active" data-tab="first-unique-name-1" class="inline-flex items-center gap-2 whitespace-nowrap text-third-text-color border-b-2 border-transparent py-2 text-sm font-medium transition-colors hover:text-second-text-color data-[state=active]:border-primary data-[state=active]:text-primary" tabindex="0">
      First Tab
    </button>
    <button type="button" role="tab" aria-selected="false" data-state="inactive" data-tab="first-unique-name-2" class="inline-flex items-center gap-2 whitespace-nowrap text-third-text-color border-b-2 border-transparent py-2 text-sm font-medium transition-colors hover:text-second-text-color data-[state=active]:border-primary data-[state=active]:text-primary" tabindex="-1">
      Second Tab
    </button>
    <button type="button" role="tab" aria-selected="false" data-state="inactive" data-tab="first-unique-name-3" class="inline-flex items-center gap-2 whitespace-nowrap text-third-text-color border-b-2 border-transparent py-2 text-sm font-medium transition-colors hover:text-second-text-color data-[state=active]:border-primary data-[state=active]:text-primary" tabindex="-1">
      Third Tab
    </button>
  </div>
  <div class="tab-content p-4 bg-background-color/70 rounded-md shadow-[0_0_2px_0_var(--shadow-color-1)]">
    <div class="tab-pane active" id="first-unique-name-1">
      <p><strong>This is Tab 1.</strong></p>
      <div class="code-container" data-rel="Plaintext">
        <div class="highlight-container">
          <figure class="iseeu highlight plaintext" data-code-block-ready="true">
            <table>
              <tbody>
                <tr>
                  <td class="gutter">
                    <pre><span class="line">1</span><br></pre>
                  </td>
                  <td class="code">
                    <pre><span class="line">wdasdwasdwasdwasdwa</span><br></pre>
                  </td>
                </tr>
              </tbody>
            </table>
          </figure>
          <div class="copy-button">
            <i class="fa-regular fa-copy"></i>
          </div>
          <div class="fold-button">
            <i class="fa-solid fa-chevron-down"></i>
          </div>
        </div>
      </div>
      <blockquote>
        <p>换行测试</p>
        <p>Edward</p>
      </blockquote>
      <p>aaa</p>
    </div>
    <div class="tab-pane" id="first-unique-name-2">
      <p><strong>This is Tab 2.</strong></p>
      <p>This is Tab 2.</p>
    </div>
    <div class="tab-pane" id="first-unique-name-3">
      <table>
        <thead>
          <tr>
            <th>Header 1</th>
            <th>Header 2</th>
            <th>Header 3</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Row 1, Col 1</td>
            <td>Row 1, Col 2</td>
            <td>Row 1, Col 3</td>
          </tr>
          <tr>
            <td>Row 2, Col 1</td>
            <td>Row 2, Col 2</td>
            <td>Row 2, Col 3</td>
          </tr>
          <tr>
            <td>Row 3, Col 1</td>
            <td>Row 3, Col 2</td>
            <td>Row 3, Col 3</td>
          </tr>
        </tbody>
      </table>
      <p>this is some <code>code</code> and more <code>code</code> <code>code</code> this is some <code>code</code> and more <code>code</code> <code>code</code> this is some <code>code</code> and more <code>code</code> <code>code</code> this is some <code>code</code> and more <code>code</code> <code>code</code></p>
    </div>
  </div>
</div>
