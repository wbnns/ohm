// ohm — content script. No network access, by construction.
// Reads this host's rules from chrome.storage.local (saved by options.js)
// instead of a build-time constant — the one real difference from the
// content.js a generator download ships. Everything else is the same
// engine: one flat base-selector:op(argument) per procedural rule, CSS
// rules injected as a stylesheet, re-applied on DOM mutation and SPA nav.
(async () => {
  const host = location.hostname.replace(/^www\./, "");
  const { ohm_rules_by_host } = await chrome.storage.local.get("ohm_rules_by_host");
  if (!ohm_rules_by_host) return;
  const keys = Object.keys(ohm_rules_by_host).filter(h => host === h || host.endsWith("." + h));
  if (!keys.length) return;
  const css = keys.flatMap(k => ohm_rules_by_host[k].css);
  const proc = keys.flatMap(k => ohm_rules_by_host[k].proc);

  if (css.length) {
    const style = document.createElement("style");
    style.textContent = css.map(s => s + " { display: none !important; }").join("\n");
    (document.head || document.documentElement).appendChild(style);
  }

  const parseProc = (sel) => {
    const m = sel.match(/^(.*?):(has-text|upward|nth-ancestor|remove-class|remove-attr|remove|style)\((.*)\)$/);
    return m ? { base: m[1] || "*", op: m[2], arg: m[3] } : null;
  };
  const ops = proc.map(p => parseProc(p.s)).filter(Boolean);

  const apply = () => {
    for (const { base, op, arg } of ops) {
      let nodes;
      try { nodes = document.querySelectorAll(base); } catch { continue; }
      for (const el of nodes) {
        if (op === "has-text") {
          const t = el.textContent || "";
          if (t.includes(arg)) el.style.setProperty("display", "none", "important");
        } else if (op === "upward" || op === "nth-ancestor") {
          const n = parseInt(arg, 10);
          let t = el;
          if (Number.isNaN(n)) { try { t = el.closest(arg); } catch { t = null; } }
          else for (let i = 0; i < n && t; i++) t = t.parentElement;
          if (t) t.style.setProperty("display", "none", "important");
        } else if (op === "remove-class") {
          el.classList.remove(...arg.split(/[,|]/).map(s => s.trim()));
        } else if (op === "remove-attr") {
          arg.split(/[,|]/).forEach(a => el.removeAttribute(a.trim()));
        } else if (op === "remove") {
          el.remove();
        } else if (op === "style") {
          el.style.cssText += ";" + arg;
        }
      }
    }
  };

  const run = () => requestAnimationFrame(apply);
  if (ops.length) {
    run();
    new MutationObserver(run).observe(document.documentElement, { childList: true, subtree: true });
    for (const m of ["pushState", "replaceState"]) {
      const orig = history[m];
      history[m] = function () { const r = orig.apply(this, arguments); run(); return r; };
    }
    addEventListener("popstate", run);
  }
})();
