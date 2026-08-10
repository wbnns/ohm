// ohm — background service worker. No network access, by construction.
// The whole job: clicking the toolbar icon opens the settings page in a
// tab (a popup would close the moment you alt-tab to paste your list in).
chrome.action.onClicked.addListener(() => {
  chrome.runtime.openOptionsPage();
});
