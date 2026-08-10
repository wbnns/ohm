const input = document.getElementById("rules-input");
const summaryEl = document.getElementById("summary");
const saveBtn = document.getElementById("save-btn");
const statusEl = document.getElementById("status");
const skippedList = document.getElementById("skipped-list");

let parsed = null;

function renderSummary() {
  const p = parsed;
  summaryEl.textContent = p
    ? p.rules.length + " rule" + (p.rules.length === 1 ? "" : "s") + " · " + p.hosts.length + " site" + (p.hosts.length === 1 ? "" : "s") + (p.skipped.length ? " · " + p.skipped.length + " skipped" : "")
    : "waiting for input";
}

function renderSkipped(skipped) {
  skippedList.innerHTML = "";
  if (!skipped || !skipped.length) {
    const li = document.createElement("li");
    li.className = "empty";
    li.textContent = "(none)";
    skippedList.appendChild(li);
    return;
  }
  for (const s of skipped) {
    const li = document.createElement("li");
    const code = document.createElement("code");
    code.textContent = s.raw;
    li.append("L" + s.line + " ", code, " — " + s.why);
    skippedList.appendChild(li);
  }
}

function update() {
  parsed = parse(input.value);
  renderSummary();
}

function byHostGroups(p) {
  const byHost = {};
  for (const r of p.rules) {
    byHost[r.host] = byHost[r.host] || { css: [], proc: [] };
    if (r.procedural) byHost[r.host].proc.push({ s: r.selector });
    else byHost[r.host].css.push(r.selector);
  }
  return byHost;
}

input.addEventListener("input", update);

saveBtn.addEventListener("click", async () => {
  const p = parse(input.value);
  parsed = p;
  renderSummary();
  const ohm_rules_by_host = byHostGroups(p);
  await chrome.storage.local.set({
    ohm_rules_by_host,
    ohm_raw_text: input.value,
    ohm_meta: { updatedAt: Date.now(), skipped: p.skipped }
  });
  renderSkipped(p.skipped);
  statusEl.textContent = "Saved — reload open tabs to apply.";
  statusEl.classList.add("ok");
  setTimeout(() => { statusEl.textContent = ""; statusEl.classList.remove("ok"); }, 4000);
});

(async () => {
  const { ohm_raw_text, ohm_meta } = await chrome.storage.local.get(["ohm_raw_text", "ohm_meta"]);
  if (ohm_raw_text) {
    input.value = ohm_raw_text;
    update();
  }
  if (ohm_meta && ohm_meta.skipped) renderSkipped(ohm_meta.skipped);
})();
