import apiClient from './client'
import type { LoginRequest, LoginResponse, UserInfo } from '@/types'

export const authApi = {
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    const res = await apiClient.post<LoginResponse>('/auth/login', data)
    return res.data
  },

  getMe: async (): Promise<UserInfo> => {
    const res = await apiClient.get<{ code: number; message: string; data: UserInfo }>('/auth/me')
    return res.data.data
  },
}