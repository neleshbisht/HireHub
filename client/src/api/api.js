import axios from "axios";

export const API_BASE = "https://hirehub-69wc.onrender.com";

const API = axios.create({
  baseURL: `${API_BASE}/api`,
});

export default API;