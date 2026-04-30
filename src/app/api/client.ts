import { API } from "@/config/const/api.const"

type HttpMethod = "GET" | "POST" | "PUT" | "DELETE"

type ApiRequestOptions = {
  data?: unknown
  headers?: Record<string, string>
}

export function removeNullish<T extends Record<string, unknown>>(payload: T) {
  return Object.fromEntries(
    Object.entries(payload).filter(([, value]) => value !== null && value !== undefined)
  ) as Partial<T>
}

export async function apiRequest<T>(
  method: HttpMethod,
  url: string,
  options: ApiRequestOptions = {}
): Promise<T | null> {
  try {
    const response = await API.request<T>({
      method,
      url,
      data: options.data,
      headers: options.headers,
    })

    return response.data
  } catch {
    return null
  }
}

export function apiGet<T>(url: string): Promise<T | null> {
  return apiRequest<T>("GET", url)
}

export function apiPost<T>(url: string, data?: unknown, options?: ApiRequestOptions): Promise<T | null> {
  return apiRequest<T>("POST", url, { ...options, data })
}

export function apiPut<T>(url: string, data?: unknown): Promise<T | null> {
  return apiRequest<T>("PUT", url, { data })
}

export function apiDelete<T>(url: string, data?: unknown): Promise<T | null> {
  return apiRequest<T>("DELETE", url, { data })
}

export function withApiBaseUrl(path: string) {
  return `${API.defaults.baseURL ?? ""}${path}`
}
