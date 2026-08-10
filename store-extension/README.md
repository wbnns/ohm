# ohm — Chrome Web Store extension

The installable version of ohm: one shared extension, versus the homepage
generator's per-user scoped download. See `/docs/#two-ways-to-install` on
[ohm.wbnns.com](https://ohm.wbnns.com/docs/) for the full trade-off between
the two.

Requests `host_permissions: ["<all_urls>"]` at install — broader than the
generator's per-user zero-permission build — because a single shared
package can't know in advance which hosts any given installer's rules will
target. It only ever *acts* on a page when that page's hostname has a
matching rule in this extension's own local storage, which you write
yourself on the settings page. No network permission, no fetch, no
telemetry — every file here is plain and short enough to read directly.

- `manifest.json` — permissions, the one static content script, the
  settings page.
- `options.html` / `options.js` — the settings page: paste a filter list,
  it's parsed in the page (via `ohm-parse.js`) and saved to
  `chrome.storage.local`.
- `content.js` — applies the current host's saved rules. Same engine as
  the generator's `content.js`, reading from storage instead of a
  build-time constant.
- `background.js` — one listener: toolbar click opens the settings page
  in a tab.
- `ohm-parse.js` — a checked-in copy of `assets/ohm-parse.js` (Chrome Web
  Store policy forbids loading remotely-hosted code, so this can't be
  fetched from the site at runtime).

## Load unpacked for local testing

1. `chrome://extensions` → enable Developer mode.
2. Load unpacked → select this `store-extension/` folder.
3. Click the toolbar icon to open settings, paste a list, save, reload
   any open tab you want it to apply to.
