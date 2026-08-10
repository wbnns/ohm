# ohm — product requirements

**Status:** v1.0 shipped (personal use) · v1.1 defined · public launch undecided **Owner:** @wbnns **Last updated:** August 2026

---

## 1\. Problem

Chrome removed the Manifest V2 code paths. MV2 extensions no longer load — not from the store, not sideloaded, not unpacked in developer mode. The `ExtensionManifestV2Availability` enterprise policy that kept them alive stopped working in mid-2025.

uBlock Origin was MV2. It is gone from Chrome.

For most people this is an ad-blocking story, and uBlock Origin Lite covers it. But a smaller group used uBO for something else: hand-written **cosmetic filters**. Rules like `x.com##div[data-testid=metadata]`, accumulated one annoyance at a time over years, tuned to a specific person's specific irritations. Those lists are personal infrastructure. They are also now dead weight in a text file.

The people in this group have three options and none of them fit:

| Option | Why it fails |
| :---- | :---- |
| uBlock Origin Lite | Deliberately declarative. No custom filters, no dashboard, no element picker. Working as designed. |
| AdGuard extension | Works, but wants read-and-modify on all sites, and it's a vendor with an attached VPN/DNS business. |
| Switch to Firefox | Correct answer, but not available to people who need Chrome for work. |

The gap: **nothing lets you keep your own list, on Chrome, without trusting a third party.**

## 2\. Insight

The MV3 migration is widely understood as "custom filtering is dead." It isn't. What MV3 removed was `webRequestBlocking` — the ability to decide at request time whether a network fetch goes through. That killed *network* filtering as uBO did it.

Cosmetic filtering was never network filtering. It is CSS injected by a content script, and MV3 supports content scripts fine. `chrome.scripting.insertCSS` accepts arbitrary CSS at runtime. uBOL lacks custom filters because Raymond Hill chose to be entirely declarative, not because the platform forbids it.

So: a large fraction of any given cosmetic filter list ports to MV3 unchanged. The rest — `:has-text()`, `:upward()`, `:nth-ancestor()` — needs a small procedural pass, which is also permitted.

**ohm exists because the thing everyone assumes is impossible is mostly a find-and-replace.**

## 3\. What ohm is

A Chrome extension that runs your cosmetic filter rules, scoped to only the sites your rules mention, with no network access and no vendor.

The name: an ohm is the unit of electrical resistance. Noise is current. You are raising impedance.

### Non-goals

Stating these plainly because the category invites scope creep:

- **Not an ad blocker.** No network filtering, no `declarativeNetRequest`, no filter list subscriptions, no EasyList. If you want ads blocked, run uBOL alongside it. They don't conflict.  
- **Not a uBO fork.** Forking uBO-classic is dead on arrival — Chrome won't load the manifest regardless of the source. ohm is a new, much smaller thing that happens to read the same filter syntax.  
- **Not a full uBO syntax implementation.** Cosmetic filters only. No `$redirect`, no HTML filtering, no dynamic filtering, no scriptlets beyond what a content script can trivially do.  
- **Not a wellness product.** No streaks, no time tracking, no shaming, no "screen time" framing. It hides elements. That's the whole contract.

## 4\. Users

**Primary — the stranded curator.** Has a `.txt` file of cosmetic filters going back years. Technical enough to have written them, not interested in maintaining an extension. Wants the list to work again with minimum ceremony. Population is small but the need is acute and undersupplied.

**Secondary — the borrower.** Doesn't have a list, wants someone else's. Arrives via the landing page, wants a preset that hides like counts on X and installs in a minute.

**Tertiary — the privacy-motivated.** Would use AdGuard but balks at all-sites permissions. Cares that the manifest is 40 lines and readable in one sitting.

## 5\. Principles

1. **Scope to the sites in the rules.** The manifest declares only the hosts your rules actually target. No `<all_urls>`, ever. This is the differentiator and it's non-negotiable. *(Caveat added when the Chrome Web Store listing shipped: that single shared package can't know your hosts in advance, so it declares broad `host_permissions` at install — the one deliberate, clearly-labeled exception. It still only **acts** on hosts your own saved rules name; see `docs/index.html#trust-but-verify`. The generator's output remains the zero-permission option this principle describes.)*  
2. **No network.** No service worker, no fetch, no telemetry, no update channel. The extension cannot phone anywhere because it has no code that could.  
3. **Readable in one sitting.** If a motivated user can't audit the whole thing in fifteen minutes, the trust story is gone. Cap the source at a size where that stays true.  
4. **The rules file is the product surface.** One file, plain data, edit it in any editor. No proprietary format, no database, no export flow — the export is `cat rules.js`.  
5. **Degrade loudly, not silently.** When a selector rots because X redeployed, the user should be able to tell. A rule that quietly matches nothing is worse than one that errors.

## 6\. Scope

### v1.0 — shipped

Personal build, running locally.

- 47 rules across x.com, pro.x.com, reddit.com, zora.co  
- Five toggleable categories: Counts, Discovery, Upsells, Badges, Actions  
- CSS pass via injected stylesheet; procedural pass for the 8 rules CSS can't express (`:has-text`, `:upward`, `:nth-ancestor`, `remove-class`)  
- MutationObserver \+ history-API patching for SPA route changes  
- Permissions: `storage` \+ four content-script hosts. Nothing else.

### v1.1 — the actual product

This is what makes it worth a website.

**Filter list import.** Paste a uBO cosmetic filter list, get a working extension. Parses `host##selector`, groups by host, translates the procedural syntax, and generates a scoped manifest containing only the hosts the list mentions. Runs entirely client-side — the list never leaves the browser, which is both the privacy story and the reason it can be a static site.

Two delivery modes — shipped as both, not one or the other:

- *Generator* — the landing page emits a downloadable folder, user loads it unpacked. Zero permissions problem, zero store review, but "load unpacked" is a real drop-off cliff.  
- *Runtime* — one installed extension with a paste box, storing rules in `chrome.storage`. Far better UX, but it must declare broad host permissions up front, which forfeits Principle 1 in the letter (not the spirit — see the Principle 1 caveat above).

Resolution: the open question below (§10.1) got decided directly rather than by the planned user test — ship both, simple/broad permissions for the Runtime version (`store-extension/`), generator kept as the lower-trust default. The generator remains what's linked first on the homepage.

**Import report.** The port surfaced four real findings in a 47-rule list: a rule scoped with a path that had silently never fired, a `:has-text` that matched every ancestor, a redundant pair, and a set of fragile generated-class selectors. Show this. "Your list had 3 dead rules and 11 fragile ones" is the moment the tool proves it did something a copy-paste couldn't.

**Durability grading.** Flag selectors built on generated atomic classes (`r-*`, `css-*`) as fragile, and `[data-testid]` / `[aria-label]` as durable. This is the single highest-value piece of advice the tool can give, because it's the difference between a list that survives a year and one that breaks monthly.

### v1.2 — maintenance

- Element picker (click a thing, get a durable selector, appended to rules)  
- Per-site toggles alongside per-category  
- Rule health: count matches per rule, mark zero-match rules as suspect  
- Firefox packaging (works today, needs signing to be non-temporary)

### Explicitly deferred

Sync, cloud anything, accounts, filter list subscriptions, network blocking, mobile, a rule marketplace. Each of these breaks a principle above.

## 7\. Distribution

**Recommendation: free, open source, MIT, GitHub \+ landing page.**

Rationale: the audience is small and technical, monetizing an ad-blocker-adjacent tool is a bad business, and Chrome Web Store review for extensions touching social sites is slow and capricious. The value here is as a credibility artifact and a build-in-public piece, not revenue.

Store listing is optional and can come later. The generator flow doesn't need it.

## 8\. Success

Honest metrics for a tool this size:

- **Primary:** the author stops seeing counts. Already met.  
- **Adoption:** people paste lists into the generator. Instrument nothing — measure via GitHub traffic and issues, not analytics.  
- **The real signal:** someone opens an issue with a rule that broke. That means they're using it on their own list, which is the entire thesis.

Vanity metrics are declined on principle, which is funny given the product.

## 9\. Risks

| Risk | Severity | Mitigation |
| :---- | :---- | :---- |
| X redeploys and generated-class selectors rot | High, ongoing | Durability grading; push users toward attribute selectors; accept it as maintenance |
| "Load unpacked" kills conversion | High | Measured, not assumed. Runtime mode is the fallback, at the cost of Principle 1 |
| Chrome further restricts content scripts | Medium | Would affect everyone including AdGuard; no specific mitigation |
| Audience is too small to matter | Medium | Accepted. Personal tool first, product second |
| Name collision with Ohm-JS (parsing toolkit) | Low | Different category entirely. No trademark exposure for an MIT tool |

## 10\. Open questions

1. ~~Generator or runtime for v1.1? Decide by testing the unpacked-install cliff with five real users before building either.~~ Resolved: both, without the planned user test — see §6.  
2. Ship presets (an "X, quieted" starter list) or stay import-only? Presets serve the secondary user but pull toward being a filter-list vendor, which is a different product with a different maintenance burden.  
3. Does the import report justify the landing page on its own — i.e. is "audit my uBO list" a reason to visit even for people staying on Firefox?

