// Drives the hidden Google Translate widget (loaded in index.html) from our
// own language buttons instead of Google's default banner UI.
//
// How it works: the widget injects a hidden <select class="goog-te-combo">
// with one <option> per language in `includedLanguages`. Setting its value
// and firing a change event is Google's own documented trigger mechanism —
// there's no public JS API for this, so we simulate the user picking it.

const COMBO_SELECTOR = "select.goog-te-combo";
const COOKIE_LANGS = "/en/";

function findCombo() {
  return document.querySelector(COMBO_SELECTOR);
}

export function setSiteLanguage(langCode) {
  if (langCode === "en") {
    // Google's own reset path: clear its cookie and reload untranslated.
    document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${window.location.hostname}`;
    window.location.reload();
    return;
  }

  const combo = findCombo();
  if (!combo) {
    // Widget hasn't finished loading yet — fall back to the cookie Google
    // reads on boot, then reload so it picks it up from a clean start.
    document.cookie = `googtrans=${COOKIE_LANGS}${langCode}; path=/;`;
    window.location.reload();
    return;
  }

  combo.value = langCode;
  combo.dispatchEvent(new Event("change"));
}

export function getCurrentSiteLanguage() {
  const match = document.cookie.match(/googtrans=\/en\/(\w+)/);
  return match ? match[1] : "en";
}
