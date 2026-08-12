import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Award, Lock, User, LogOut, Globe } from "lucide-react";
import Card from "../../../shared-components/Card/Card.jsx";
import Button from "../../../shared-components/Button/Button.jsx";
import LoadingSpinner from "../../../shared-components/LoadingSpinner/LoadingSpinner.jsx";
import RadarField from "../../../shared-components/RadarField/RadarField.jsx";
import {
  fetchProfile,
  setLanguage,
  LANGUAGES,
} from "../api/endpoints/profile.js";
import { signOut, isAuthenticated } from "../api/endpoints/auth.js";

function initials(name) {
  return name
    ? name
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((p) => p[0].toUpperCase())
        .join("")
    : null;
}

export default function Profile() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [savingLang, setSavingLang] = useState(false);

  useEffect(() => {
    fetchProfile().then(setProfile);
  }, []);

  async function handleLanguageChange(code) {
    setSavingLang(true);
    try {
      await setLanguage(code);
      setProfile((p) => ({ ...p, language: code }));
    } finally {
      setSavingLang(false);
    }
  }

  function handleSignOut() {
    signOut();
    navigate("/sign-in");
  }

  if (!isAuthenticated()) {
    return (
      <div className="section-pad max-w-md mx-auto py-16 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-mint flex items-center justify-center mx-auto text-forest/40">
          <User size={28} />
        </div>
        <h1 className="text-xl sm:text-2xl font-bold">You're not signed in</h1>
        <p className="text-body text-xs sm:text-sm">
          Sign in to view your member profile, Eco-Tokens, and community badges.
        </p>
        <Link to="/sign-in" className="inline-block pt-2">
          <Button variant="primary">Sign In</Button>
        </Link>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="section-pad py-16 w-full">
        <LoadingSpinner label="Loading your profile…" />
      </div>
    );
  }

  const { user, ecoTokens, rank, badges, language } = profile;
  const displayName = user?.fullName || user?.email || "Neighbour";

  return (
    <div className="section-pad py-4 sm:py-5 lg:py-7 space-y-4 sm:space-y-5 w-full">
      <div className="border-b border-hairline pb-3">
        <div className="eyebrow mb-1.5">MEMBER ACCOUNT</div>
        <h1 className="text-xl sm:text-2xl lg:text-3xl">Profile &amp; Community Settings</h1>
      </div>

      <div className="grid md:grid-cols-12 gap-4 sm:gap-5">
        <div className="md:col-span-5 space-y-4">
          <div className="relative rounded-2xl bg-forest text-white p-4 sm:p-5 overflow-hidden shadow-card-lg">
            <RadarField />
            <div className="relative z-10 flex items-center gap-3 sm:gap-4">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gold text-forest flex items-center justify-center font-display font-extrabold text-lg shrink-0 shadow-md">
                {initials(displayName) || <User size={26} strokeWidth={2.5} />}
              </div>
              <div className="min-w-0 flex-1">
                <div className="eyebrow !text-white/80 before:!bg-gold mb-0.5">MEMBER PROFILE</div>
                <h2 className="text-base sm:text-lg text-white truncate">{displayName}</h2>
                <p className="text-xs font-mono text-white/80 truncate mt-0.5">
                  {user?.email || user?.phone || "No contact info"}
                  {user?.district ? ` · ${user.district}` : ""}
                </p>
              </div>
            </div>
          </div>

          <Card className="!bg-gold-soft !border-0 flex items-center justify-between !p-4">
            <div>
              <p className="text-[11px] font-mono text-body uppercase tracking-wider">Total Eco-Tokens</p>
              <p className="font-display font-extrabold text-2xl text-forest mt-0.5">{ecoTokens}</p>
            </div>
            <div className="text-right">
              <p className="text-[11px] font-mono text-body uppercase tracking-wider">Community Rank</p>
              <p className="font-display font-extrabold text-xl text-forest mt-0.5">#{rank}</p>
            </div>
          </Card>

          <Button variant="ghost" className="w-full justify-center gap-2 py-3 text-xs sm:text-sm font-semibold" onClick={handleSignOut}>
            <LogOut size={16} /> Sign out of account
          </Button>
        </div>

        <div className="md:col-span-7 space-y-4">
          <div>
            <div className="eyebrow mb-2">COMMUNITY BADGES</div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {badges.map((b) => (
                <Card key={b.id} className={`!p-3 sm:!p-4 text-center ${b.earned ? '' : 'opacity-40'}`}>
                  <div className={`mx-auto mb-2 w-9 h-9 rounded-xl flex items-center justify-center ${b.earned ? 'bg-gold-soft text-sim-text' : 'bg-mint text-body/40'}`}>
                    {b.earned ? (
                      <Award size={20} strokeWidth={2} />
                    ) : (
                      <Lock size={16} strokeWidth={2} />
                    )}
                  </div>
                  <p className="text-xs font-bold text-forest">{b.label}</p>
                </Card>
              ))}
            </div>
          </div>

          <div>
            <div className="eyebrow mb-3">
              <Globe size={13} className="inline mr-1" />
              PREFERRED LANGUAGE
            </div>
            <Card className="!p-4 space-y-3">
              <div className="flex flex-wrap gap-2.5">
                {LANGUAGES.map((l) => {
                  const active = l.code === language;
                  return (
                    <button
                      key={l.code}
                      type="button"
                      onClick={() => handleLanguageChange(l.code)}
                      disabled={savingLang}
                      className={`px-4 py-2 sm:px-5 sm:py-2.5 rounded-full text-xs font-semibold transition-all duration-200 ${
                        active
                          ? "bg-forest text-white shadow-sm"
                          : "bg-mint text-forest hover:bg-mint-dark"
                      }`}
                    >
                      {l.label}
                    </button>
                  );
                })}
              </div>
              <p className="text-xs text-body leading-relaxed border-t border-hairline pt-3">
                Select your preferred language for community flood alerts, shelter broadcasts, and climate literacy modules.
              </p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
