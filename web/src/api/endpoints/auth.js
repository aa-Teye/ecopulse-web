import { apiClient, USE_MOCK } from "../client.js";

export async function signIn({ email, password }) {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 500));
    if (!email || !password) throw new Error("Enter your email and password.");
    const token = `mock.${btoa(email)}.token`;
    const user = {
      email,
      fullName: email.split("@")[0],
      district: null,
      phone: null,
    };
    localStorage.setItem("ecopulse_token", token);
    localStorage.setItem("ecopulse_user", JSON.stringify(user));
    return { token, user };
  }
  const { data } = await apiClient.post("/auth/login", { email, password });
  localStorage.setItem("ecopulse_token", data.token);
  localStorage.setItem("ecopulse_user", JSON.stringify(data.user));
  return data;
}

export async function signUp({ fullName, password, username, district, phone }) {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 600));
    if (!fullName || !password || !phone)
      throw new Error("Fill in your name, password, and number.");
    const token = `mock.${btoa(fullName)}.token`;
    const user = { fullName, username, district, phone, email: null };
    localStorage.setItem("ecopulse_token", token);
    localStorage.setItem("ecopulse_user", JSON.stringify(user));
    return { token, user };
  }
  const { data } = await apiClient.post("/auth/register", {
    fullName,
    password,
    username,
    district,
    phone,
  });
  localStorage.setItem("ecopulse_token", data.token);
  localStorage.setItem("ecopulse_user", JSON.stringify(data.user));
  return data;
}

export async function forgotPassword(identifier) {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 400));
    const stored = localStorage.getItem("ecopulse_user");
    const user = stored ? JSON.parse(stored) : null;
    const found = !!user && [user.email, user.phone, user.username].includes(identifier);
    return { found };
  }
  const { data } = await apiClient.post("/auth/forgot-password", { identifier });
  return data;
}

export async function resetPassword(identifier, newPassword) {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 400));
    return { found: true };
  }
  const { data } = await apiClient.post("/auth/reset-password", { identifier, newPassword });
  return data;
}

export function signOut() {
  localStorage.removeItem("ecopulse_token");
  localStorage.removeItem("ecopulse_user");
}

export function isAuthenticated() {
  return Boolean(localStorage.getItem("ecopulse_token"));
}
