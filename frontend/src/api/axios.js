import axios from "axios";

const api = axios.create({
  // Use relative path so Netlify proxy (netlify.toml) routes to Render backend
  baseURL: "/api",
  headers: { 
    "Content-Type": "application/json",
    "Accept": "application/json"
  },
});

export default api;
