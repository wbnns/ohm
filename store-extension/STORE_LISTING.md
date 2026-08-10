# Chrome Web Store listing — copy to paste into the Developer Dashboard

Reference material only — not part of the built extension, not deployed
to the site. Everything below is a draft; edit freely before submitting.

## Title

```
ohm — custom cosmetic filters
```

## Short description (≤132 characters)

```
Run your own uBlock Origin cosmetic filters in Chrome. Paste a list, it hides what you tell it to. No ad blocking, no network access.
```
(132 chars exactly — trim if the Dashboard counts differently.)

## Long description

```
ohm runs your own hand-written cosmetic filters — rules like
x.com##div[data-testid="metadata"] — as a Chrome extension. It exists
because Chrome's Manifest V2 removal broke uBlock Origin, and with it,
years of personal cosmetic-filter lists that had nowhere left to run.

What it does: hides page elements matching CSS selectors and a small set
of procedural operators (has-text, upward, nth-ancestor, remove-class,
remove-attr, remove, style) — the same syntax uBlock Origin's cosmetic
filters used. Paste your list on the settings page, save, done.

What it doesn't do: block ads, block network requests, track your
browsing, or send anything anywhere. There is no analytics code, no
telemetry, and no network permission in this extension — it has no way
to reach the internet even if it wanted to. Your rules live in this
browser's local extension storage only.

Full source, docs, and a zero-permission alternative (build a personal
extension scoped to only your own hosts, no Chrome Web Store install
required) at https://ohm.wbnns.com.
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

Not yet captured — needs the built extension loaded in a real browser.
Plan: one screenshot of the settings page with a sample list saved, one
before/after of a rule actually hiding something on a real page.
Recommended size 1280×800 (Google also accepts 640×400; confirm current
requirements in the Dashboard at submission time, they've changed
before).

## What's left — only you can do these

1. Register a Chrome Web Store developer account (one-time $5 fee, your
   Google account) at https://chrome.google.com/webstore/devconsole/.
2. Zip `store-extension/` (folder contents at the zip root, not nested
   inside an extra folder) and upload it as a new item.
3. Paste the copy above into the matching Dashboard fields.
4. Enter the privacy policy URL once `/privacy/` is live on the site.
5. Add screenshots.
6. Submit for review, then watch email/Dashboard for the review result.
