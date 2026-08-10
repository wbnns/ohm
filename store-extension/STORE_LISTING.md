# Chrome Web Store listing — copy to paste into the Developer Dashboard

Reference material only — not part of the built extension, not deployed
to the site. Everything below is a draft; edit freely before submitting.

## Title

```
ohm
```

## Short description (≤132 characters)

```
Hide anything on a page with your own rules. Compatible with uBlock Origin-style filters.
```
(89 chars.)

## Long description

```
ohm hides things on a page using rules you write yourself — no waiting
on someone else's list, no account, nothing tracked.

It understands the same rule format uBlock Origin used for its custom
filters, the kind that stopped working when Chrome dropped support for
uBlock Origin's old extension format. If you've got a list of those,
paste it in and it'll work again.

What it does: hides whatever you tell it to, on whatever site you tell
it to, using rules like "on this website, hide this thing."

What it doesn't do: block ads, block network requests, track what you
do, or send anything anywhere. It has no permission to use the internet
at all, so there's no way for it to send your rules or your browsing
anywhere. Everything stays saved on your own computer.

Want it to ask for less up front? There's a version of ohm that builds
a personal copy with permission for only the exact sites your own rules
mention, no Chrome Web Store install needed: https://ohm.wbnns.com
```

## Category

```
Productivity
```

## Single-purpose description (for the review form)

```
Applies the user's own cosmetic CSS/DOM rules to hide page elements,
based on filter rules the user writes and saves themselves on the
extension's settings page. Does not block ads, does not block or
inspect network requests, and has no network permission of any kind.
```

## Permission justifications (Dashboard → Privacy practices tab)

**`storage`:**
```
Stores the user's own filter rules (and nothing else) in this browser's
local extension storage, so they persist between sessions. Never
transmitted anywhere — there is no network permission in this
extension.
```

**`host_permissions: <all_urls>`:**
```
Declared because this is a single shared extension installed before the
user has written any rules, so it cannot know in advance which
websites those rules will eventually name — unlike ohm's alternative
"build your own" distribution (see https://ohm.wbnns.com), which
generates a personal extension scoped only to the exact hosts its
rules mention, at the cost of needing a manual "Load unpacked" install.
This Store version's content script checks the current page's hostname
against the user's own saved rules before doing anything at all — it
does not act on pages that have no matching rule. Source is public and
short enough to audit directly: https://github.com/wbnns/ohm/tree/main/store-extension
```

## Privacy policy URL

```
https://ohm.wbnns.com/privacy/
```

## Icon

```
assets/icon-128.png (also copied to store-extension/icons/icon-128.png)
```

## Screenshots

Two ready to upload, in `store-extension/screenshots/`, both 1280×800:

- `1-settings.png` — the real settings page (actual `options.html` +
  `options.js` + `ohm-parse.js`, unmodified), rendered with a realistic
  saved list so the summary/skipped-lines panel show real output: "9
  rules · 6 hosts · 1 skipped."
- `2-before-after.png` — a neutral demo card (not a scrape of any real
  site, deliberately, both for reliability and to avoid imitating a
  specific site's UI) showing an engagement-counts row before and after
  a `:remove()` rule, applied via the same DOM-removal mechanism
  `content.js` actually uses in production.

Google's current minimum is 1 screenshot, up to 5, 1280×800 recommended
(640×400 also accepted) — confirm in the Dashboard at submission time,
these numbers have shifted before.

## What's left — only you can do these

1. Register a Chrome Web Store developer account (one-time $5 fee, your
   Google account) at https://chrome.google.com/webstore/devconsole/.
2. Zip only the actual extension files — `manifest.json`, `options.html`,
   `options.js`, `ohm-parse.js`, `content.js`, `background.js`, and
   `icons/` — at the zip root, not nested inside an extra folder.
   `README.md`, `STORE_LISTING.md`, and `screenshots/` are reference
   material for this submission, not part of the extension; leave them
   out of the zip.
3. Paste the copy above into the matching Dashboard fields.
4. Enter the privacy policy URL once `/privacy/` is live on the site.
5. Upload the two screenshots from `screenshots/`.
6. Submit for review, then watch email/Dashboard for the review result.
