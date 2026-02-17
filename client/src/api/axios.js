import axios from "axios";

// Strip trailing slash to prevent double-slash URLs
// e.g. "https://render.com/" + "/boards" = "https://render.com//boards" (broken)
const baseURL = (import.meta.env.VITE_API_URL || "http://localhost:5000").replace(/\/$/, "");

const instance = axios.create({
  baseURL,
  withCredentials: true,
  timeout: 15000, // 15s timeout — Render free tier cold starts can be slow
});

// Auto-attach JWT token from localStorage on every request
instance.interceptors.request.use(
  (config) => {
    const userInfo = localStorage.getItem("userInfo");
    if (userInfo) {
      try {
        const parsed = JSON.parse(userInfo);
        if (parsed?.token) {
          config.headers.Authorization = `Bearer ${parsed.token}`;
        }
      } catch {
        // corrupted localStorage — ignore
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Global response error handler
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid — clear storage and redirect to login
      localStorage.removeItem("userInfo");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default instance;