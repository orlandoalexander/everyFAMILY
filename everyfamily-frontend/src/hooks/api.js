import axios from "axios";

const baseURL = import.meta.env.VITE_BACKEND_BASE_URL;

const api = axios.create({
  baseURL: baseURL,
  withCredentials: true,
});

export default api;
