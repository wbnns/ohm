# ohm

Adds uBlock Origin custom cosmetic filters back to Chrome.

Chrome's Manifest V2 removal killed uBlock Origin, and with it, hand-written
cosmetic filter lists (`host##selector`) that people built up over years.
ohm parses a uBO cosmetic filter list entirely in your browser and generates
a scoped Manifest V3 Chrome extension that runs it — no network access, no
vendor, only the hosts your rules actually name.

Live: https://wbnns.github.io/ohm/

See [PRD.md](./PRD.md) for the full product rationale and scope.

## How it works

Paste your filter list into the page. It's parsed client-side, grouped by
host, and translated into a `manifest.json` + `content.js` + `rules.js`
extension, packaged into a zip you download and load unpacked via
`chrome://extensions`. Nothing you paste ever leaves the tab.

## License

MIT — see [LICENSE](./LICENSE).
