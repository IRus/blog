---
title: "No more accidental tab detaches in Firefox 74"
date: 2020-03-14
categories:
  - Firefox
---

In `about:config` added new configuration option:

```
browser.tabs.allowTabDetach
```

I immediately set this property to `false`, so no more false detaches happens when I'm just reordering tabs with the drag and drop. You can still detach a tab using "Move Tab -> Move to New Window".
