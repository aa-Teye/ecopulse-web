import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { isAuthenticated } from "../api/endpoints/auth.js";

// Wraps a route element that needs a real account to do anything useful
// (submit a report, play a game that awards tokens, etc). Informational
// pages (News, Shelters, Alerts, Learn, Community Status) deliberately
// don't use this — those stay browsable without an account.
export default function RequireAuth({ children }) {
  const navigate = useNavigate();
  const authed = isAuthenticated();

  useEffect(() => {
    if (!authed) navigate("/sign-in", { replace: true });
  }, [authed, navigate]);

  if (!authed) return null;
  return children;
}
