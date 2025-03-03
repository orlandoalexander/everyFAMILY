import axios from "axios";

const baseUrl = import.meta.env.VITE_BACKEND_BASE_URL;

console.log(baseUrl);

const api = axios.create({
  baseURL: baseUrl,
});

export default api;
