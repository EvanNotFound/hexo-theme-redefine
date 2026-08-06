---
title: Markdown
date: 2007-01-09 9:41:05
tags:
    - "Demo"
    - "Hexo Theme"
    - "Markdown"
    - "Hexo Theme Redefine"
    - "Hexo"
categories:
    - "Start"
    - "Markdown"
---

## Overview

### Philosophy

Markdown is designed to be easy-to-read and easy-to-write, prioritizing readability above all. A Markdown-formatted document should be publishable as-is, in plain text, without appearing cluttered with tags or formatting instructions. Its syntax is inspired by various text-to-HTML filters like [Setext](http://docutils.sourceforge.net/mirror/setext.html), [atx](http://www.aaronsw.com/2002/atx/), [Textile](http://textism.com/tools/textile/), [reStructuredText](http://docutils.sourceforge.net/rst.html), [Grutatext](http://www.triptico.com/software/grutatxt.html), and [EtText](http://ettext.taint.org/doc/), with a significant influence from plain text email formatting.

## Block Elements

### Paragraphs and Line Breaks

A paragraph is one or more consecutive lines of text, separated by one or more blank lines. Normal paragraphs should not be indented with spaces or tabs.

Markdown supports "hard-wrapped" text paragraphs, differing from other text-to-HTML formatters that convert every line break character in a paragraph into a `<br />` tag. To insert a `<br />` break tag, end a line with two or more spaces, then press return.

### Headers

Markdown supports two styles of headers: [Setext](http://docutils.sourceforge.net/mirror/setext.html) and [atx](http://www.aaronsw.com/2002/atx/). Optionally, you may "close" atx-style headers with trailing hashes, purely for cosmetic purposes.

### Blockquotes

Markdown uses email-style `>` characters for blockquoting. Hard wrap the text and put a `>` before every line:

> This is a blockquote with two paragraphs. Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aliquam hendrerit mi posuere lectus Vestibulum enim wisi, viverra nec, fringilla in, laoreet vitae, risus. Donec sit amet nisl. Aliquam semper ipsum sit amet velit. Suspendisse id sem consectetuer libero luctus adipiscing.

Markdown allows lazy blockquotes, where you only need to put the `>` before the first line:

> This is a blockquote with two paragraphs. Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aliquam hendrerit mi posuere lectus. Vestibulum enim wisi, viverra nec, fringilla in, laoreet vitae, risus.
>
> Donec sit amet nisl. Aliquam semper ipsum sit amet velit. Suspendisse id sem consectetuer libero luctus adipiscing.

Blockquotes can be nested by adding additional levels of `>`:

> This is the first level of quoting.
>
> > This is nested blockquote.
>
> Back to the first level.

Blockquotes can contain other Markdown elements like headers, lists, and code blocks:

> ## This is a header.
>
> 1. This is the first list item.
> 2. This is the second list item.
>
> Here's some example code:
>
> ```shell
> return shell_exec("echo $input | $markdown_script");
> ```

### Lists

Markdown supports ordered (numbered) and unordered (bulleted) lists.

Unordered lists use asterisks, pluses, and hyphens interchangeably:

* Red
* Green
* Blue

Equivalent to:

+ Red
+ Green
+ Blue

And:

- Red
- Green
- Blue

Ordered lists use numbers followed by periods:

1. Bird
2. McHale
3. Parish

The actual numbers you use to mark the list have no effect on the HTML output. For example:

1. Bird
1. McHale
1. Parish

Produces the same HTML as:

3. Bird
1. McHale
8. Parish

To make lists look nice, you can wrap items with hanging indents:

* Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aliquam hendrerit mi posuere lectus. Vestibulum enim wisi, viverra nec, fringilla in, laoreet vitae, risus.
* Donec sit amet nisl. Aliquam semper ipsum sit amet velit. Suspendisse id sem consectetuer libero luctus adipiscing.

List items may consist of multiple paragraphs. Each subsequent paragraph in a list item must be indented by either 4 spaces or one tab:

1. This is a list item with two paragraphs. Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aliquam hendrerit mi posuere lectus.

   Vestibulum enim wisi, viverra nec, fringilla in, laoreet vitae, risus. Donec sit amet nisl. Aliquam semper ipsum sit amet velit.

2. Suspendisse id sem consectetuer libero luctus adipiscing.

To put a blockquote within a list item, the blockquote's `>` delimiters need to be indented:

* A list item with a blockquote:

  > This is a blockquote inside a list item.

To put a code block within a list item, the code block needs to be indented *twice* -- 8 spaces or two tabs:

* A list item with a code block:

    ```html
    <code goes here>
    ```

### Code Blocks

Pre-formatted code blocks are used for writing about programming or markup source code. Lines of a code block are interpreted literally and wrapped in both `<pre>` and `<code>` tags. To produce a code block in Markdown, indent every line of the block by at least 4 spaces or 1 tab.

This is a normal paragraph:

    This is a code block.

Here is an example of AppleScript:

```applescript
tell application "Foo"
    beep
end tell
```

A code block continues until it reaches a line that is not indented (or the end of the article). Within a code block, ampersands (`&`) and angle brackets (`<` and `>`) are automatically converted into HTML entities.

For example, this:

```html
<div class="footer">
    &copy; 2004 Foo Corporation
</div>
```

Regular Markdown syntax is not processed within code blocks. Asterisks are just literal asterisks within a code block, making it easy to write about Markdown's own syntax.

## Span Elements

### Links

Markdown supports two styles of links: *inline* and *reference*. In both styles, the link text is delimited by [square brackets].

To create an inline link, use a set of regular parentheses immediately after the link text's closing square bracket. Inside the parentheses, put the URL where you want the link to point, along with an *optional* title for the link, surrounded in quotes. For example:

This is [an example](http://example.com/) inline link.

[This link](http://example.net/) has no title attribute.

### Emphasis

Markdown treats asterisks (`*`) and underscores (`_`) as indicators of emphasis. Text wrapped with one `*` or `_` will be wrapped with an HTML `<em>` tag; double `*`'s or `_`'s will be wrapped with an HTML `<strong>` tag. For example:

*single asterisks*

_single underscores_

**double asterisks**

__double underscores__

### Code

To indicate a span of code, wrap it with backtick quotes (`` ` ``). Unlike a pre-formatted code block, a code span indicates code within a normal paragraph. For example:

Use the `printf()` function.