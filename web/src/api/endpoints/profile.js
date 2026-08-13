import { apiClient, USE_MOCK } from "../client.js";
import mockLeaderboard from "../mockData/leaderboard.json";

// Codes here are Google Translate's, not the "obvious" ones: "ga" is Irish,
// not Ghanaian Ga, so Twi and Ga use "ak" (Akan, which Twi is coded under)
// and "gaa" instead. Verify these actually translate correctly once live —
// Ga's support in the free website widget specifically hasn't been directly
// confirmed, only in Google Cloud's Translation API docs.
export const LANGUAGES = [
  { code: "en", label: "English" },
  { code: "fr", label: "French" },
  { code: "ak", label: "Twi" },
  { code: "gaa", label: "Ga" },
  { code: "ha", label: "Hausa" },
];

const BADGES = [
  { id: "first-report", label: "First Report", earned: true },
  { id: "flood-scout", label: "Flood Scout", earned: true },
  { id: "drain-guardian", label: "Drain Guardian", earned: false },
  { id: "streak-7", label: "7-Day Streak", earned: false },
];

export async function fetchProfile() {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 250));
    const storedUser = localStorage.getItem("ecopulse_user");
    const user = storedUser ? JSON.parse(storedUser) : null;
    const language = localStorage.getItem("ecopulse_language") || "en";
    return {
      user,
      ecoTokens: mockLeaderboard.youPoints,
      rank: mockLeaderboard.youRank,
      badges: BADGES,
      language,
    };
  }
  const { data } = await apiClient.get("/profile");
  return data;
}

export async function setLanguage(code) {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 150));
    localStorage.setItem("ecopulse_language", code);
    return { language: code };
  }
  const { data } = await apiClient.post("/profile/language", {
    language: code,
  });
  return data;
}
