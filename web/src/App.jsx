import { useEffect, useState } from "react";
import { Routes, Route, NavLink, useLocation } from "react-router-dom";
import { User, Home as HomeIcon, BookOpen, Camera, Bell, Menu, X, Sparkles, LayoutDashboard, Newspaper, MapPinned, Route as RouteIcon, Users2 } from "lucide-react";
import Home from "./pages/Home.jsx";
import ReportDrain from "./pages/ReportDrain.jsx";
import MyReports from "./pages/MyReports.jsx";
import Alerts from "./pages/Alerts.jsx";
import EmergencyPlan from "./pages/EmergencyPlan.jsx";
import EmergencyContacts from "./pages/EmergencyContacts.jsx";
import Learn from "./pages/Learn.jsx";
import Profile from "./pages/Profile.jsx";
import SignIn from "./pages/SignIn.jsx";
import SignUp from "./pages/SignUp.jsx";
import News from "./pages/News.jsx";
import Shelters from "./pages/Shelters.jsx";
import SafeRoutes from "./pages/SafeRoutes.jsx";
import CommunityStatus from "./pages/CommunityStatus.jsx";
import Placeholder from "./pages/Placeholder.jsx";
import Tour from "./components/Tour.jsx";
import { useTourStore } from "./store/useTourStore.js";
import { isAuthenticated } from "./api/endpoints/auth.js";

// Set once Ishaque's admin dashboard is deployed (see .env.example).
// Falls back to a relative /admin path so the link still works if the
// dashboard is deployed to the same Vercel instance.
const DASHBOARD_URL = import.meta.env.VITE_DASHBOARD_URL || "/admin";

/* ── Desktop top nav link style ── */
const desktopLinkClass = ({ isActive }) =>
  `text-[15px] font-medium transition-colors relative py-1 ${isActive
    ? "text-forest after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-gold after:rounded-full font-semibold"
    : "text-forest/60 hover:text-forest"
  }`;

/* ── Mobile bottom tab link style ── */
const tabClass = ({ isActive }) =>
  `flex flex-col items-center gap-1 text-[10px] font-semibold transition-colors ${isActive ? "text-forest font-bold" : "text-body/60"
  }`;

/* ═══════════════════════════════════════════════
   HEADER — Translucent White Glass Navbar
   ═══════════════════════════════════════════════ */

function Header() {
  const location = useLocation();
  const authed = isAuthenticated();
  const [mobileOpen, setMobileOpen] = useState(false);
  const onAuthPage =
    location.pathname === "/sign-in" || location.pathname === "/sign-up";

  if (onAuthPage) return null;

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-xl border-b border-hairline">
      <div className="section-pad h-[68px] flex items-center justify-between">
        {/* Logo */}
        <NavLink
          to="/"
          className="flex items-center gap-2 font-display font-bold text-xl sm:text-[22px] tracking-tight text-forest shrink-0"
        >
          Wɔnɔ
        </NavLink>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-7">
          <NavLink to="/" end className={desktopLinkClass}>Home</NavLink>
          <NavLink to="/learn" className={desktopLinkClass}>Learn</NavLink>
          <NavLink to="/report-drain" className={desktopLinkClass}>Report</NavLink>
          <NavLink to="/my-reports" className={desktopLinkClass}>My Reports</NavLink>
          <NavLink to="/emergency-plan" className={desktopLinkClass}>Plan</NavLink>
          <NavLink to="/alerts" className={desktopLinkClass}>Alerts</NavLink>
          <NavLink to="/emergency-contacts" className={desktopLinkClass}>Contacts</NavLink>
        </nav>
        {/* Right side controls */}
        <div className="flex items-center gap-3">
          {authed ? (
            <NavLink
              to="/profile"
              className="w-9 h-9 rounded-full bg-forest text-white flex items-center justify-center hover:bg-forest-light transition-colors shadow-sm"
              aria-label="Profile"
            >
              <User size={16} strokeWidth={2} />
            </NavLink>
          ) : (
            <NavLink
              to="/sign-in"
              className="inline-flex items-center rounded-full bg-forest text-white text-xs sm:text-[15px] font-semibold px-4 sm:px-6 py-2 hover:bg-forest-light transition-colors"
            >
              Sign In
            </NavLink>
          )}

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-1.5 text-forest"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {mobileOpen && (
        <div className="md:hidden border-t border-hairline bg-white px-6 py-4 flex flex-col gap-3 animate-fade-up">
          <NavLink to="/" end onClick={() => setMobileOpen(false)} className="text-[15px] font-medium text-forest/80 py-1">Home</NavLink>
          <NavLink to="/learn" onClick={() => setMobileOpen(false)} className="text-[15px] font-medium text-forest/80 py-1">Learn</NavLink>
          <NavLink to="/report-drain" onClick={() => setMobileOpen(false)} className="text-[15px] font-medium text-forest/80 py-1">Report Drain</NavLink>
          <NavLink to="/my-reports" onClick={() => setMobileOpen(false)} className="text-[15px] font-medium text-forest/80 py-1">My Reports</NavLink>
          <NavLink to="/emergency-plan" onClick={() => setMobileOpen(false)} className="text-[15px] font-medium text-forest/80 py-1">Emergency Plan</NavLink>
          <NavLink to="/alerts" onClick={() => setMobileOpen(false)} className="text-[15px] font-medium text-forest/80 py-1">Alerts</NavLink>
          <NavLink to="/emergency-contacts" onClick={() => setMobileOpen(false)} className="text-[15px] font-medium text-forest/80 py-1">Contacts</NavLink>
          <NavLink to="/news" onClick={() => setMobileOpen(false)} className="text-[15px] font-medium text-forest/80 py-1">News Hub</NavLink>
          <NavLink to="/shelters" onClick={() => setMobileOpen(false)} className="text-[15px] font-medium text-forest/80 py-1">Shelters</NavLink>
          <NavLink to="/safe-routes" onClick={() => setMobileOpen(false)} className="text-[15px] font-medium text-forest/80 py-1">Safe Routes</NavLink>
          <NavLink to="/community-status" onClick={() => setMobileOpen(false)} className="text-[15px] font-medium text-forest/80 py-1">Community Status</NavLink>
          <NavLink to="/profile" onClick={() => setMobileOpen(false)} className="text-[15px] font-bold text-forest py-1 flex items-center gap-2">
            <User size={16} /> My Profile
          </NavLink>
          <a
            href={DASHBOARD_URL}
            target="_blank"
            rel="noreferrer"
            onClick={() => setMobileOpen(false)}
            className="text-[13px] font-semibold text-body/60 py-1 flex items-center gap-2 border-t border-hairline mt-1 pt-3"
          >
            <LayoutDashboard size={14} /> Admin Dashboard
          </a>
          {!authed && (
            <NavLink
              to="/sign-in"
              onClick={() => setMobileOpen(false)}
              className="inline-flex items-center justify-center rounded-full bg-forest text-white text-[15px] font-semibold px-6 py-3 mt-2"
            >
              Sign In
            </NavLink>
          )}
        </div>
      )}
    </header>
  );
}

/* ═══════════════════════════════════════════════
   MOBILE BOTTOM TAB BAR — Translucent White Glass
   ═══════════════════════════════════════════════ */

function BottomTabBar() {
  const location = useLocation();
  const onAuthPage =
    location.pathname === "/sign-in" || location.pathname === "/sign-up";

  if (onAuthPage) return null;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-white/95 backdrop-blur-xl border-t border-hairline safe-bottom shadow-card-lg">
      <div className="flex items-center justify-around py-2 px-2">
        <NavLink to="/" end className={tabClass}>
          <HomeIcon size={20} strokeWidth={1.8} />
          <span>Home</span>
        </NavLink>
        <NavLink to="/learn" className={tabClass}>
          <BookOpen size={20} strokeWidth={1.8} />
          <span>Learn</span>
        </NavLink>
        <NavLink to="/report-drain" className={tabClass}>
          <span className="w-11 h-11 -mt-4 rounded-full bg-forest text-white flex items-center justify-center shadow-card">
            <Camera size={20} strokeWidth={2} />
          </span>
          <span className="-mt-0.5">Report</span>
        </NavLink>
        <NavLink to="/alerts" className={tabClass}>
          <Bell size={20} strokeWidth={1.8} />
          <span>Alerts</span>
        </NavLink>
        <NavLink to="/profile" className={tabClass}>
          <User size={20} strokeWidth={1.8} />
          <span>Profile</span>
        </NavLink>
      </div>
    </nav>
  );
}

function UtilityBar() {
  const location = useLocation();
  const onAuthPage =
    location.pathname === "/sign-in" || location.pathname === "/sign-up";

  if (onAuthPage) return null;

  const links = [
    { to: "/news", label: "News", Icon: Newspaper },
    { to: "/shelters", label: "Shelters", Icon: MapPinned },
    { to: "/safe-routes", label: "Safe Routes", Icon: RouteIcon },
    { to: "/community-status", label: "Community Status", Icon: Users2 },
    { to: "/leaderboard", label: "Leaderboard", Icon: Sparkles },
  ];

  const utilLinkClass = ({ isActive }) =>
    `inline-flex items-center gap-1.5 text-xs sm:text-[13px] font-semibold whitespace-nowrap transition-colors ${
      isActive ? "text-forest" : "text-forest/60 hover:text-forest"
    }`;

  return (
    <div className="sticky top-[68px] z-40 bg-mint/80 backdrop-blur-md border-b border-hairline w-full overflow-hidden">
      <div className="section-pad h-11 flex items-center justify-between gap-3 sm:gap-6">
        <div className="flex items-center gap-3.5 sm:gap-6 overflow-x-auto no-scrollbar py-1 shrink min-w-0">
          {links.map(({ to, label, Icon }) => (
            <NavLink key={to} to={to} className={utilLinkClass}>
              <Icon size={13} /> {label}
            </NavLink>
          ))}
        </div>

        <a
          href={DASHBOARD_URL}
          target="_blank"
          rel="noreferrer"
          className="hidden sm:inline-flex items-center gap-1.5 text-xs sm:text-[13px] font-bold text-forest bg-white border border-hairline rounded-full px-3 py-1 shadow-card hover:shadow-card-hover transition-shadow shrink-0"
          title="Opens the responder/admin dashboard"
        >
          <LayoutDashboard size={13} /> Admin Dashboard
        </a>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   APP SHELL
   ═══════════════════════════════════════════════ */

function PageBackground() {
  const location = useLocation();
  if (location.pathname === "/alerts") return null;
  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none select-none z-0 overflow-hidden"
    >
      <img
        src="/assets/bg-rings.png"
        alt=""
        className="w-full h-full object-cover object-center opacity-40"
      />
    </div>
  );
}

export default function App() {
  const maybeAutoStart = useTourStore((s) => s.maybeAutoStart);

  useEffect(() => {
    maybeAutoStart();
  }, [maybeAutoStart]);

  return (
    <div className="min-h-screen bg-mint/30 flex flex-col font-sans antialiased text-forest selection:bg-gold selection:text-forest relative">
      <PageBackground />
      <Header />
      <UtilityBar />
      <Tour />

      <main className="flex-1 pb-24 md:pb-8 relative z-10">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/report-drain" element={<ReportDrain />} />
          <Route path="/my-reports" element={<MyReports />} />
          <Route path="/alerts" element={<Alerts />} />
          <Route path="/emergency-plan" element={<EmergencyPlan />} />
          <Route path="/learn" element={<Learn />} />
          <Route path="/leaderboard" element={<Learn initialTab="leaderboard" />} />
          <Route path="/sign-in" element={<SignIn />} />
          <Route path="/sign-up" element={<SignUp />} />
          <Route path="/shelters" element={<Shelters />} />
          <Route path="/emergency-contacts" element={<EmergencyContacts />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/news" element={<News />} />
          <Route path="/safe-routes" element={<SafeRoutes />} />
          <Route path="/community-status" element={<CommunityStatus />} />
          <Route path="*" element={<Placeholder title="Not found" />} />
        </Routes>
      </main>

      <BottomTabBar />
    </div>
  );
}

