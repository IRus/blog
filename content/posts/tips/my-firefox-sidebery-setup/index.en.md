---
title: "My Firefox + Sidebery setup"
date: 2026-10-01
categories:
  - Firefox
  - Tips
---

I use Firefox on macOS with [Sidebery](https://github.com/mbnuqw/sidebery) for vertical
tabs. Here is my configuration, tested with Firefox 157 in normal and fullscreen
modes.

![Firefox on macOS with Sidebery, a hidden horizontal tab bar and sidebar header, and space beside the window controls](firefox-sidebery-setup.png)

## What it changes

- Hides Firefox's horizontal tab bar, leaving tab management to Sidebery.
- Hides Firefox's sidebar header, including its title and controls.
- Keeps the macOS traffic-light buttons in the navigation toolbar, with a 16-pixel
  gap before the toolbar buttons, including in fullscreen.

## How to apply it

1. Install Sidebery and open its sidebar.
2. Open `about:config` and set `toolkit.legacyUserProfileCustomizations.stylesheets` to `true`.
3. Open `about:support` and open the **Profile Folder** (also called **Profile Directory**).
4. Download [userChrome.css](userChrome.css) and
   [hide_tabs_toolbar_v2.css](chrome/hide_tabs_toolbar_v2.css), then save them inside
   your profile with this directory structure:

```text
<Firefox profile>/
└── chrome/
    ├── userChrome.css
    └── chrome/
        └── hide_tabs_toolbar_v2.css
```

If you already have a `userChrome.css`, merge the configuration below into it and
keep all `@import` statements at the top. These styles belong in Firefox's profile,
not Sidebery's styles editor.

Fully quit Firefox and reopen it to apply the changes.

## Configuration

```css
@import url(chrome/hide_tabs_toolbar_v2.css);

/* Hide Firefox revamped sidebar headers. */
#sidebar-panel-header,
*|sidebar-panel-header {
  display: none !important;
}

/* Keep a gap beside the macOS window controls, including fullscreen. */
@media (-moz-platform: macos) {
  /* Show the macOS window controls in the navigation toolbar. */
  #nav-bar > .titlebar-buttonbox-container,
  #nav-bar > .titlebar-buttonbox-container > .titlebar-buttonbox {
    display: flex !important;
  }

  #nav-bar > .titlebar-spacer[type="pre-tabs"] {
    display: flex !important;
    width: 16px !important;
  }
}
```

Change `16px` to adjust the gap beside the window controls.

The imported tab-bar stylesheet comes from
[MrOtherGuy's firefox-csshacks](https://github.com/MrOtherGuy/firefox-csshacks/blob/master/chrome/hide_tabs_toolbar_v2.css).
Its source and Mozilla Public License 2.0 notice are preserved in the download.
