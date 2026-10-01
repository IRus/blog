---
title: "Hide the Sidebery header after a Firefox update"
date: 2026-10-01
categories:
  - Firefox
  - Tips
---

After a Firefox update, the "Sidebery" header appeared above my vertical tabs again.
I already had a `userChrome.css` file with this rule:

```css
#sidebar-header {
  display: none;
}
```

Custom stylesheets were still enabled. The problem was the selector: `#sidebar-header`
targets Firefox's older sidebar layout, while the revamped sidebar uses a different
header element.

Replacing the old rule with this hides the header again:

```css
#sidebar-panel-header,
*|sidebar-panel-header {
  display: none !important;
}
```

![Firefox on macOS with Sidebery open and its sidebar header hidden](firefox-sidebery-without-header.png)

The first selector matches the header's ID. The second matches the
`sidebar-panel-header` element in any namespace. This removes the whole header row,
including its controls, for all matching sidebars.

The header belongs to Firefox, so put this CSS in **Firefox's `userChrome.css`**.
Sidebery's built-in styles editor cannot change it.

If you haven't set up `userChrome.css` yet:

1. Open `about:config` and set `toolkit.legacyUserProfileCustomizations.stylesheets` to `true`.
2. Open `about:support` and open the **Profile Folder** (also called **Profile Directory**).
3. Create a `chrome` folder inside it, then create `userChrome.css` in that folder.
4. Add the CSS above. If the file already exists, keep your other styles.
5. Fully quit Firefox and reopen it.

If you still use the older sidebar layout, keep the `#sidebar-header` rule too.

References: [Sidebery maintainer's explanation](https://github.com/mbnuqw/sidebery/discussions/2169),
[sidebar header selectors](https://github.com/piroor/treestyletab/discussions/3762),
and [stylesheet setup](https://github.com/mbnuqw/sidebery#how-to-hide-native-tabs).
