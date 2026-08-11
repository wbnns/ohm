// ohm — shared cosmetic-filter-list parser.
// Canonical source. store-extension/ohm-parse.js is a checked-in copy of
// this exact file — MV3 Chrome Web Store policy forbids remotely-hosted
// code, so the extension can't load this file from ohm.wbnns.com at
// runtime. Re-copy this file there if this logic ever changes.

const PROC = /:(-abp-)?(has-text|matches-css(-before|-after)?|upward|nth-ancestor|xpath|watch-attr|min-text-length|others|matches-path|matches-media|remove|remove-class|remove-attr|style)\(/;
const PROC_OK = ["has-text", "upward", "nth-ancestor", "remove-class", "remove-attr", "remove", "style"];

function parse(text) {
  const rules = [], skipped = [], seen = new Set();
  text.split(/\r?\n/).forEach((raw, i) => {
    const line = raw.trim();
    if (!line || line[0] === "!" || line.startsWith("[Adblock") || line.startsWith("# ")) return;
    const skip = (why) => skipped.push({ line: i + 1, raw: line, why });
    if (/#@#/.test(line)) return skip("exception rule");
    let hit = null;
    for (const s of ["#?#", "##"]) { const k = line.indexOf(s); if (k > -1) { hit = [k, s]; break; } }
    if (!hit) return skip("network filter — ohm does not block requests");
    const [k, sep] = hit;
    const left = line.slice(0, k);
    const sel = line.slice(k + sep.length).trim();
    if (!sel) return skip("empty selector");
    if (sel.startsWith("+js(")) return skip("scriptlet");
    if (sel.startsWith("^")) return skip("HTML filter");
    if (!left) return skip("no host — ohm needs a host to stay scoped");
    const hosts = [];
    let badHost = null;
    for (const d0 of left.split(",")) {
      const d = d0.trim();
      if (!d) continue;
      if (d[0] === "~") { badHost = "exclusion hosts (~) not supported"; break; }
      if (d.includes("://") || d.startsWith("//")) { badHost = "host can't include a URL scheme"; break; }
      if (d.endsWith(".*") || d.startsWith("*.") || d === "*") continue;
      hosts.push(d.includes("/") ? d.split("/")[0] : d);
    }
    if (badHost) return skip(badHost);
    if (!hosts.length) return skip("wildcard domain can't be scoped");
    let procedural = null;
    if (PROC.test(sel)) {
      const ops = [...sel.matchAll(/:(-abp-)?([a-z-]+)\(/g)].map(x => x[2]).filter(o => PROC.test(":" + o + "("));
      const bad = ops.find(o => !PROC_OK.includes(o));
      if (bad) return skip(":" + bad + "() has no MV3 equivalent");
      procedural = ops;
    }
    for (const host of hosts) {
      const key = host + "|" + sel;
      if (seen.has(key)) continue;
      seen.add(key);
      rules.push({ host, selector: sel, procedural });
    }
  });
  return { rules, skipped, hosts: [...new Set(rules.map(r => r.host))].sort() };
}
