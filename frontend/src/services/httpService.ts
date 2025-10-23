import axios, { type AxiosRequestConfig } from "axios"
import { log } from "@/services/logService.ts"

axios.defaults.withCredentials = true

axios.interceptors.response.use(
  (response) => response,
  (error) => {
    const expected =
      error.response &&
      error.response.status >= 400 &&
      error.response.status < 500

    if (!expected) {
      log(error)
    }

    return Promise.reject(error)
  }
)

type Cfg = AxiosRequestConfig

function get<TRes = unknown>(url: string, config?: Cfg) {
  return axios.get<TRes>(url, config)
}

function post<TRes = unknown, TBody = unknown>(
  url: string,
  data?: TBody,
  config?: Cfg
) {
  return axios.post<TRes>(url, data, config)
}

function put<TRes = unknown, TBody = unknown>(
  url: string,
  data?: TBody,
  config?: Cfg
) {
  return axios.put<TRes>(url, data, config)
}

function del<TRes = unknown, TBody = unknown>(
  url: string,
  data?: TBody,
  config?: Cfg
) {
  const cfg: Cfg = { ...(config || {}), data }
  return axios.delete<TRes>(url, cfg)
}

function patch<TRes = unknown, TBody = unknown>(
  url: string,
  data?: TBody,
  config?: Cfg
) {
  return axios.patch<TRes>(url, data, config)
}

function request<TRes = unknown>(config: Cfg) {
  return axios.request<TRes>(config)
}

export default { get, post, put, delete: del, patch, request }
