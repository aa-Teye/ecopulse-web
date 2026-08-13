import { apiClient, USE_MOCK } from "../client.js";
import mockLeaderboard from "../mockData/leaderboard.json";

export const LANGUAGES = [
  { code: "en", label: "English" },
  { code: "fr", label: "French" },
  { code: "tw", label: "Twi" },
  { code: "ga", label: "Ga" },
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
