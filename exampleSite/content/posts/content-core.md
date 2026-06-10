---
title: "Content Core"
date: 2026-06-10T09:00:00+08:00
lastmod: 2026-06-10T09:30:00+08:00
categories: ["Hugo"]
tags: ["markdown", "shortcodes", "render-hooks"]
description: "A Hugo content rendering sample for Theme Redefine."
---

This article exercises the Hugo-native content layer: render hooks, search text, and Redefine shortcodes.

## Links And Headings

Internal links such as [the first post](/posts/first-post/) should stay in the same tab. External links such as [Hugo](https://gohugo.io/) should show the Redefine link icon when enabled.

### Images

![Redefine logo](/images/redefine-logo.svg "The Redefine logo rendered through Hugo's image hook.")

### Code Blocks

```js {title="hello.js"}
export function hello(name) {
  return `Hello, ${name}`;
}
```

> Blockquotes keep the Redefine article style while being rendered by Hugo's Markdown pipeline.

## Shortcodes

{{< callout type="info" title="Hugo-native callout" icon="fa-solid fa-circle-info" variant="titled" >}}
This callout is rendered by a Hugo shortcode, but it keeps Redefine's callout classes.
{{< /callout >}}

{{< folding title="Expandable section" class="blue" open="true" >}}
Folding content uses a native `details` element, so it works without extra JavaScript.
{{< /folding >}}

{{< tabs name="content-core" active="1" >}}
{{< tab title="Markdown" icon="fa-solid fa-pen-nib" >}}
Markdown inside a tab is rendered through `Page.RenderString`.

- Lists work.
- Links work.
- Inline `code` works.
{{< /tab >}}
{{< tab title="Callout" icon="fa-solid fa-note-sticky" >}}
Tab panes can contain normal Markdown content and keep Redefine spacing.

> A quote inside a tab still uses the article Markdown styles.
{{< /tab >}}
{{< /tabs >}}

{{< button text="Visit Hugo" url="https://gohugo.io/" icon="fa-solid fa-arrow-up-right-from-square" target="_blank" align="center" >}}
