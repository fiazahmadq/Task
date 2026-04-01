export interface ApiResponse<T = unknown> {
  data?: T
  error?: {
    message: string
    code: string
    fields?: Record<string, string[]>
  }
  meta?: {
    page?: number
    limit?: number
    total?: number
    nextCursor?: string
    hasNextPage?: boolean
  }
}

export function successResponse<T>(data: T, meta?: ApiResponse['meta']): ApiResponse<T> {
  return { data, ...(meta ? { meta } : {}) }
}

export function errorResponse(message: string, code: string, status?: number): ApiResponse {
  return { error: { message, code } }
}
