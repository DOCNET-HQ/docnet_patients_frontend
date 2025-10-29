export interface User {
  id: string
  role: string
  name: string
  email: string
  photo?: string
  profileId?: string
  kycStatus?: string
}

export interface AuthResponse {
  user: User
  access: string
  refresh: string
}

export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  name: string
  email: string
  password: string
}

export interface PaginatedResponse<T> {
  results: T[]
  count: number
  page: number
  limit: number
  totalPages: number
}

export interface ApiError {
  status: number
  message: string
  errors?: Record<string, string[]>
}
