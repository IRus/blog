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
        ├── hide_tabs_toolbar_osx.css
        └── window_control_placeholder_support.css
```

Download the files I use:

- [userChrome.css](userChrome.css)
- [hide_tabs_toolbar_osx.css](chrome/hide_tabs_toolbar_osx.css)
- [window_control_placeholder_support.css](chrome/window_control_placeholder_support.css)

The nested `chrome` directory matches the relative paths in the imports. If you
already have a `userChrome.css`, merge the rules into it and keep all `@import`
statements at the top.

## My userChrome configuration

```css
@import url(chrome/hide_tabs_toolbar_osx.css);
@import url(chrome/window_control_placeholder_support.css);

/* Hide Firefox revamped sidebar headers. */
#sidebar-panel-header,
*|sidebar-panel-header {
  display: none !important;
}

/* Always reserve space for macOS window controls, including fullscreen. */
@media (-moz-platform: macos) {
  #nav-bar {
    /* 72px for the traffic lights plus a 16px gap before toolbar buttons. */
    border-left: 88px solid transparent !important;
  }
}
```

The two imported stylesheets come from
[MrOtherGuy's firefox-csshacks](https://github.com/MrOtherGuy/firefox-csshacks).
The downloads above are copies from my current setup, with their source and
Mozilla Public License 2.0 notices preserved.

## Hide the native tab bar

`hide_tabs_toolbar_osx.css` hides the contents of Firefox's tab toolbar while
keeping its window controls visible. It then moves the navigation toolbar up
into the freed space. `window_control_placeholder_support.css` supplies the
supporting spacing rules.

The main rules in the macOS stylesheet are:

```css
:root {
  --uc-toolbar-height: 32px;
}

:root:not([uidensity="compact"]) {
  --uc-toolbar-height: 34px;
}

#TabsToolbar > * {
  visibility: collapse !important;
}

#TabsToolbar > .titlebar-buttonbox-container {
  visibility: visible !important;
  height: var(--uc-toolbar-height) !important;
}

#nav-bar {
  margin-top: calc(0px - var(--uc-toolbar-height));
}
```

Use both downloaded helper files; the excerpt above isn't the complete setup.

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
buttons. The final rule reserves 88 pixels on the left of the navigation toolbar:
72 for the window controls plus a 16-pixel gap.

This override doesn't depend on the old helper's `tabsintitlebar` selectors,
and it remains active in fullscreen. Change `88px` if you prefer more or less
space.

After saving the files, fully quit Firefox and reopen it to apply the styles.
