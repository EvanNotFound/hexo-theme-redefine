---
title: Tab Folding Nesting Test
tags:
  - "tabs"
  - "folding"
  - "nesting"
categories:
  - "test"
excerpt: false
---

## Tabs/Folding Regression Test

Text BEFORE tabs. If this disappears into a tab, your parsing is broken.

{% notel blue Tabs Notel Title %}
Line 1
Line 2
Line 3  
(This line above ends with two spaces -> should create a hard line break)
{% endnotel %}

{% tabs qa-tabs,1 %}

<!-- tab Notel Inside Tabs -->

This tab must render a `notel` block as a real note box (NOT as a code block).

{% notel blue Tabs Notel Title %}
Line 1
Line 2
Line 3  
(This line above ends with two spaces -> should create a hard line break)
{% endnotel %}

{% callout info::Tabs Notel Title %}
Line 1
Line 2
Line 3  
(This line above ends with two spaces -> should create a hard line break)
{% endcallout %}

Nested list indentation must survive:
- item 1
  - nested item
- item 2

Fenced code must stay literal (no tag execution inside):
```txt
{% notel red SHOULD-NOT-RUN %}
this must remain literal text
{% endnotel %}
```

<!-- endtab -->

<!-- tab Folding Nested In Tabs -->

Folding block inside a tab must render correctly:

{% folding yellow::Folding Title (inside tab) %}
Inside folding:

{% note danger %}
This is a `note` tag inside folding.
{% endnote %}

And this fenced code must stay literal:
```txt
{{ site.title }}
{% note %}
literal, do not execute
{% endnote %}
```
{% endfolding %}

Text AFTER folding, still inside this tab.

<!-- endtab -->

{% endtabs %}

## After Tabs Marker

If you see this section *inside* a tab pane, the tabs closing/rendering is broken.

Second tabs instance (multiple tabs blocks on one page must work):

{% tabs qa-tabs-2,2 %}

<!-- tab Tab A -->
Tab A content.
<!-- endtab -->

<!-- tab Tab B -->
Tab B content. This should be the initially active tab for qa-tabs-2.
<!-- endtab -->

{% endtabs %}