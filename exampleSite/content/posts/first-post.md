---
title: "First Hugo Post"
date: 2026-06-08T09:00:00+08:00
lastmod: 2026-06-08T10:30:00+08:00
cover: "/images/wallhaven-wqery6-light.webp"
categories: ["Hugo"]
tags: ["port", "sample"]
description: "A sample article with a cover image."
sticky: true
---

This article checks the main Redefine article view in Hugo. It includes a cover image, metadata, taxonomy links, a table of contents, and copyright information.

## Visual Rhythm

The port keeps the rounded article container, soft shadows, restrained text color, and a wide cover image. These are the most important first-pass signals for matching the original theme.

## Markdown Content

The content area uses the `markdown-body` class so blockquotes, links, images, lists, and tables can be styled consistently.

> A short blockquote gives the markdown treatment something visible to render.

### Lists

- Hugo templates replace Hexo helpers.
- Theme parameters live under `params.redefine`.
- Browser configuration is exported for existing Redefine scripts.

### Table

| Area | Status |
| --- | --- |
| Layout | First pass |
| Styles | First pass |
| Plugins | Later phase |

## Closing

The next migration phases can fill in search, comments, galleries, bookmarks, and richer plugin support.
