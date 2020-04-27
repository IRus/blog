---
title: "Fix code block after hugo update"
date: 2020-04-27
categories:
  - Hugo
---

I update this blog from Hugo 0.55 to 0.68 and this broke how code blocks is rendering. Ugly black appears:

```html
<pre style="color:#f8f8f2;background-color:#272822;-moz-tab-size:4;-o-tab-size:4;tab-size:4"><code class="language-kotlin" data-lang="kotlin">...</code></pre>
```

Before it was much clear markup:

```html
<pre><code class="language-kotlin">...</code></pre>
```

It's very unfortunate, that renderer adds some inline styles, because it's hacky to override them from css. Fortunately there are option exists, that disables that behaviour:

```yaml
# config.yml
markup:
  highlight:
    noClasses: false
```

It still adds class to markup, and additional `div` around, but hey, that's much better, and I wonder why this is not default behaviour.

I think I need to continue my work on [kpress](https://github.com/Heapy/kpress) to not dealing with such issues.
