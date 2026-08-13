// Drives the hidden Google Translate widget (loaded in index.html) from our
// own language buttons instead of Google's default banner UI.
//
// How it works: the widget injects a hidden <select class="goog-te-combo">
// with one <option> per language in `includedLanguages`. Setting its value
// and firing a change event is Google's own documented trigger mechanism —
// there's no public JS API for this, so we simulate the user picking it.
//
// Language codes matter here in ways that aren't obvious: "ga" is Google's
// code for Irish, NOT the Ghanaian Ga language — that collision is why Twi
// and Ga use "ak" (Akan, which Twi is coded under) and "gaa" respectively.
// Verified directly against https://translate.google.com/translate_a/l
// (the same endpoint the widget itself calls), not just docs.

const COMBO_SELECTOR = "select.goog-te-combo";
const COOKIE_LANGS = "/en/";
const MAX_WAIT_MS = 4000;
const POLL_INTERVAL_MS = 150;

function findCombo() {
  return document.querySelector(COMBO_SELECTOR);
}

// The widget script loads asynchronously and can lag page load by a second
// or two, so the combo box — or the option for a given language within it —
// may not exist yet the instant someone clicks. Only report success if the
// option genuinely exists; a value set with no matching option silently
// no-ops, which is what "clicking Twi does nothing" almost always is.
function applyToCombo(combo, langCode) {
  const hasOption = Array.from(combo.options).some((o) => o.value === langCode);
  if (!hasOption) return false;
  combo.value = langCode;
  combo.dispatchEvent(new Event("change"));
  return true;
}

export function setSiteLanguage(langCode) {
  if (langCode === "en") {
    // Google's own reset path: clear its cookie and reload untranslated.
    document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${window.location.hostname}`;
    window.location.reload();
    return;
  }

  const existing = findCombo();
  if (existing && applyToCombo(existing, langCode)) return;

  const startedAt = Date.now();
  const interval = setInterval(() => {
    const combo = findCombo();
    if (combo && applyToCombo(combo, langCode)) {
      clearInterval(interval);
      return;
    }
    if (Date.now() - startedAt > MAX_WAIT_MS) {
      clearInterval(interval);
      // Last resort: set the cookie Google reads on boot, then reload —
      // works even if the widget never finished initializing in time.
      document.cookie = `googtrans=${COOKIE_LANGS}${langCode}; path=/;`;
      window.location.reload();
    }
  }, POLL_INTERVAL_MS);
}

export function getCurrentSiteLanguage() {
  const match = document.cookie.match(/googtrans=\/en\/([\w-]+)/);
  return match ? match[1] : "en";
}
