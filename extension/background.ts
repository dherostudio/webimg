/**
 * webimg extension service worker.
 *
 * Two entry points into the editor:
 *  1. Toolbar icon → open (or focus) the editor tab.
 *  2. Right-click an image → "Edit image in webimg" → open the editor with
 *     that image pre-loaded.
 *
 * The extension installs with no host access. When the user picks an image
 * from a page, we ask for permission to that image's origin only, so the
 * editor tab can fetch the bytes itself. Everything after that stays local.
 */

const MENU_ID = 'webimg-edit-image';
const EDITOR_PATH = 'extension/editor.html';

function editorUrl(params?: Record<string, string>): string {
  const url = new URL(chrome.runtime.getURL(EDITOR_PATH));
  if (params) {
    for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);
  }
  return url.toString();
}

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: MENU_ID,
    title: 'Edit image in webimg',
    contexts: ['image'],
  });
});

// Toolbar icon: focus an already-open empty editor tab when there is one.
// runtime.getContexts sees the extension's own pages without the "tabs"
// permission (tabs.query's url filter is silently ignored without it).
chrome.action.onClicked.addListener(async () => {
  const bare = editorUrl();
  const contexts = await chrome.runtime.getContexts({
    contextTypes: [chrome.runtime.ContextType.TAB],
    documentUrls: [bare],
  });
  const open = contexts.find((c) => c.tabId >= 0);
  if (open) {
    await chrome.tabs.update(open.tabId, { active: true });
    await chrome.windows.update(open.windowId, { focused: true });
    return;
  }
  await chrome.tabs.create({ url: bare });
});

chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId !== MENU_ID || !info.srcUrl) return;
  const src = info.srcUrl;

  // Ask for access to the image's origin (http/https only; data: needs none).
  // permissions.request must run inside the user gesture, so call it first
  // and without awaiting anything else. It resolves without a prompt when
  // the origin was already granted.
  let origin: string | null = null;
  try {
    const u = new URL(src);
    if (u.protocol === 'http:' || u.protocol === 'https:') origin = `${u.origin}/*`;
  } catch {
    // Not a URL we can reason about; the editor will report the failure.
  }
  if (origin) {
    try {
      await chrome.permissions.request({ origins: [origin] });
    } catch {
      // Denied or unavailable: still open the editor so the user sees why.
    }
  }

  await chrome.tabs.create({
    url: editorUrl({ src }),
    index: tab?.index !== undefined ? tab.index + 1 : undefined,
    openerTabId: tab?.id,
  });
});
