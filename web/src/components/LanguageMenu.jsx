import { useEffect, useRef, useState } from "react";
import { Globe } from "lucide-react";
import { LANGUAGES } from "../api/endpoints/profile.js";
import { setSiteLanguage, getCurrentSiteLanguage } from "../lib/googleTranslate.js";

export default function LanguageMenu() {
  const [open, setOpen] = useState(false);
  const [language, setLanguage] = useState(getCurrentSiteLanguage());
  const containerRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    function onClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [open]);

  function handleSelect(code) {
    setLanguage(code);
    setSiteLanguage(code);
    setOpen(false);
  }

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label="Change language"
        aria-expanded={open}
        className="w-9 h-9 rounded-full bg-mint text-forest flex items-center justify-center hover:bg-mint-dark transition-colors"
      >
        <Globe size={16} strokeWidth={2} />
      </button>

      {open && (
        <div className="absolute right-0 top-11 z-50 bg-white rounded-2xl shadow-card-lg border border-hairline p-2 min-w-[140px]">
          {LANGUAGES.map((l) => (
            <button
              key={l.code}
              type="button"
              onClick={() => handleSelect(l.code)}
              className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${
                l.code === language ? "bg-mint text-forest" : "text-body hover:bg-mint/60"
              }`}
            >
              {l.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
