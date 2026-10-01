---
title: "My Firefox + Sidebery setup"
date: 2026-10-01
categories:
  - Firefox
  - Tips
---

I use Firefox on macOS with [Sidebery](https://github.com/mbnuqw/sidebery) for vertical
tabs. I hide Firefox's horizontal tab bar and the sidebar header, and leave space
between the macOS window controls and the sidebar button. This is my setup with
Firefox 157.

![Firefox on macOS with Sidebery, a hidden horizontal tab bar and sidebar header, and space beside the window controls](firefox-sidebery-setup.png)

## Enable custom stylesheets

These styles change Firefox's interface, so they belong in `userChrome.css`.
Sidebery's built-in styles editor only changes the extension's own interface.

1. Install Sidebery and open its sidebar.
2. Open `about:config` and set `toolkit.legacyUserProfileCustomizations.stylesheets` to `true`.
3. Open `about:support` and open the **Profile Folder** (also called **Profile Directory**).
4. Create a `chrome` folder inside your profile and arrange the files as shown below.

```text
<Firefox profile>/
└── chrome/
    ├── userChrome.css
    └── chrome/
        └── hide_tabs_toolbar_v2.css
```

Download the files I use:

- [userChrome.css](userChrome.css)
- [hide_tabs_toolbar_v2.css](chrome/hide_tabs_toolbar_v2.css)

The nested `chrome` directory matches the relative paths in the imports. If you
already have a `userChrome.css`, merge the rules into it and keep all `@import`
statements at the top.

## My userChrome configuration

```css
@import url(chrome/hide_tabs_toolbar_v2.css);

/* Hide Firefox revamped sidebar headers. */
#sidebar-panel-header,
*|sidebar-panel-header {
  display: none !important;
}

/* Keep a gap beside the macOS window controls, including fullscreen. */
@media (-moz-platform: macos) {
  #nav-bar > .titlebar-spacer[type="pre-tabs"] {
    display: flex !important;
    width: 16px !important;
  }
}
```

The imported stylesheet comes from
[MrOtherGuy's firefox-csshacks](https://github.com/MrOtherGuy/firefox-csshacks/blob/master/chrome/hide_tabs_toolbar_v2.css).
The download above is the copy I use, with its source and Mozilla Public License
2.0 notice preserved.

## Hide the native tab bar

`hide_tabs_toolbar_v2.css` is designed for Firefox 133 and later. It collapses the
horizontal tab toolbar and makes Firefox's window controls available in the
navigation toolbar. This lets Firefox lay out the controls alongside the toolbar
buttons, without the old negative top margin.

It handles the window controls itself, so it doesn't need the separate
`window_control_placeholder_support.css` helper. The
[maintainer describes that helper as legacy support for ESR 128](https://github.com/MrOtherGuy/firefox-csshacks/issues/489).

## Hide the sidebar header

After a Firefox update, the "Sidebery" header appeared above my tabs again.
My old rule targeted `#sidebar-header`, which belongs to Firefox's older sidebar
layout. Custom stylesheets were still enabled, but that selector no longer
matched the revamped header.

The replacement in my configuration uses `#sidebar-panel-header` for the header's
ID and `*|sidebar-panel-header` for the element in any namespace. It removes the
whole header row, including its controls, for all matching sidebars. The
[Sidebery maintainer's explanation](https://github.com/mbnuqw/sidebery/discussions/2169)
and [header selector discussion](https://github.com/piroor/treestyletab/discussions/3762)
cover the difference. If you still use the older layout, keep your
`#sidebar-header` rule too.

## Leave room for the window controls

I also want the sidebar button to stay clear of the red, yellow and green macOS
buttons. Firefox now reserves space for the controls themselves. My final rule
keeps its spacer before the toolbar buttons visible and sets it to 16 pixels.

The rule also applies in fullscreen. Adjust `16px` to change the gap. There is no
need to reserve another 72 pixels for the controls with a left border on the
navigation toolbar; that would count their space twice.

After saving the files, fully quit Firefox and reopen it to apply the styles.
