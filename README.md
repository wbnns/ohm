# ohm

**Adds uBlock Origin custom filters back to Chrome.**

Chrome's Manifest V2 removal killed uBlock Origin outright — including years
of hand-written cosmetic filters (`host##selector`) that people had tuned to
their own specific annoyances. uBlock Origin Lite, Google's sanctioned MV3
replacement, is deliberately declarative: no custom filters, no element
picker, nothing you can edit yourself.

The "MV3 killed custom filtering" story is mostly wrong, though. What MV3
actually removed was `webRequestBlocking` — the ability to intercept and
cancel network requests. Cosmetic filtering was never network filtering; it's
just CSS, injected by a content script after the page loads, and MV3 still
supports content scripts fine. ohm parses uBlock Origin's cosmetic filter
syntax entirely client-side and turns it into a real Manifest V3 extension.
No network access, no vendor, no account.

**[ohm.wbnns.com](https://ohm.wbnns.com)** · [docs](https://ohm.wbnns.com/docs/) · [support](https://ohm.wbnns.com/support/)

## Two ways to run it

| | Chrome Web Store | Build your own |
| --- | --- | --- |
| Install | One click | Paste a list at [ohm.wbnns.com](https://ohm.wbnns.com), download a zip, Load unpacked |
| Permissions | All sites, granted once — this shared install can't know your hosts in advance | Only the exact hosts your rules name, nothing else |
| Updates | Edit anytime from the settings page | Re-paste your list, download again |

Neither path blocks ads, tracks you, or has any code capable of a network
request. Full comparison, including exactly why the Store version needs
broader permissions and how to verify that claim against the source:
[docs → Two ways to install](https://ohm.wbnns.com/docs/#install-paths).

## How it works

1. **Paste.** A uBlock Origin cosmetic filter list — the same one you were
   already using.
2. **Parse.** Runs entirely in your browser tab via
   [`assets/ohm-parse.js`](./assets/ohm-parse.js) — nothing you paste is ever
   sent anywhere.
3. **Build.** Either saved to this browser's local extension storage (Store
   version), or packaged into a `manifest.json` + `content.js` + `rules.js`
   zip scoped to exactly the hosts your rules mention (generator version).
4. **Apply.** The content script hides whatever your rules target, using
   plain CSS selectors plus a small procedural set: `:has-text()`,
   `:upward()`, `:nth-ancestor()`, `:remove-class()`, `:remove-attr()`,
   `:remove()`, `:style()`. One flat `selector:op(argument)` per rule — no
   chaining, no nesting. Full syntax reference:
   [docs → Filter syntax](https://ohm.wbnns.com/docs/#syntax).

Deliberately **not** a full uBlock Origin reimplementation: no scriptlets, no
network filtering, no HTML filtering. Cosmetic filters only.

## Repo structure

```
index.html              the generator (homepage) — self-contained, no build step
assets/ohm-parse.js     shared filter-list parser, used by both surfaces below
store-extension/        the Chrome Web Store extension source
docs/                   syntax reference, durability guidance, troubleshooting, FAQ
privacy/                privacy policy
support/                contact + FAQ
```

## Local development

No build step, no dependencies, nothing to install.

```bash
git clone https://github.com/wbnns/ohm.git
cd ohm
python3 -m http.server 8080   # http://localhost:8080/
```

To test the Chrome Web Store extension source: `chrome://extensions` →
Developer mode → Load unpacked → select `store-extension/`.

## Contributing

Issues and PRs welcome. The whole codebase is small enough to read in one
sitting — that's a design goal, not an accident. Found a selector that
broke, or a bug in ohm itself? [Open an issue](https://github.com/wbnns/ohm/issues).

## License

MIT — see [LICENSE](./LICENSE).

## A note from the creator

Hey, it's wbnns :) just wanted to reach out and say hi!

If a rule silently doesn't work, the docs are confusing, or something's
just rough — please tell me. It genuinely helps. Say hi on
**[Telegram](https://t.me/wbnns)** or **[X](https://x.com/wbnns)** — I'd
love to know what's on your filter list.
