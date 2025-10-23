// src/services/httpService.ts
import axios, { type AxiosError, type AxiosResponse } from "axios"
import { log } from "@/services/logService.ts"

// create an instance (cleaner than mutating global defaults)
const http = axios.create({
  baseURL:
    (typeof import.meta !== "undefined" &&
      import.meta.env?.VITE_API_BASE_URL) ||
    "",
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
})

// Response interceptor with explicit types (fixes TS7006)
http.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    const status = error.response?.status ?? 0
    const expected = status >= 400 && status < 500
    if (!expected) log(error)
    return Promise.reject(error)
  }
)

// Use the request parameters type from the instance (works across axios v1)
type Cfg = Parameters<typeof http.request>[0]

function get<TRes = unknown>(url: string, config?: Cfg) {
  return http.get<TRes>(url, config)
}

function post<TRes = unknown, TBody = unknown>(
  url: string,
  data?: TBody,
  config?: Cfg
) {
  return http.post<TRes>(url, data, config)
}

function put<TRes = unknown, TBody = unknown>(
  url: string,
  data?: TBody,
  config?: Cfg
) {
  return http.put<TRes>(url, data, config)
}

function del<TRes = unknown, TBody = unknown>(
  url: string,
  data?: TBody,
  config?: Cfg
) {
  // axios v1 supports passing data in DELETE via config.data
  const cfg: Cfg = { ...(config ?? {}), data }
  return http.delete<TRes>(url, cfg)
}

function patch<TRes = unknown, TBody = unknown>(
  url: string,
  data?: TBody,
  config?: Cfg
) {
  return http.patch<TRes>(url, data, config)
}

function request<TRes = unknown>(config: Cfg) {
  return http.request<TRes>(config)
}

export default { get, post, put, delete: del, patch, request }
