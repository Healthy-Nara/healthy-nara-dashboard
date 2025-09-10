import axios from "axios";

const baseURL = import.meta.env.VITE_API_BASE_URL || "";

export const api = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Helper wrappers
export const get = <T = any>(url: string, params?: any) =>
  api.get<T>(url, { params });
export const post = <T = any>(url: string, data?: any) =>
  api.post<T>(url, data);
