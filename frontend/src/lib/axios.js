import axios from "axios";

export const axiosInstance = axios.create({
  baseURL:
    import.meta.env.VITE_API_BASE_URL ||
    (import.meta.env.MODE === "development"
      ? "http://localhost:3000/api"
      : "/api/node"),
  withCredentials: true,
  timeout: 30000,
});
