import axios from "axios";

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "https://backend-linkhub-ukd0.onrender.com/api"
});

API.interceptors.request.use((req) => {
  const token =
    localStorage.getItem("adminToken") ||
    sessionStorage.getItem("adminToken");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export default API;