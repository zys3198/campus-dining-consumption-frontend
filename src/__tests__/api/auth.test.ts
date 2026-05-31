import { describe, it, expect, beforeEach } from 'vitest'
import { http, HttpResponse } from 'msw'
import { server } from '@/mocks/server'
import { authApi } from '@/api/auth'
import { useAuthStore } from '@/stores/auth'
import { MOCK_LOGIN_REQUEST } from '@/mocks/fixtures/auth'

describe('authApi', () => {
  beforeEach(() => {
    server.resetHandlers()
    useAuthStore.setState({ token: null, user: null })
  })

  describe('login', () => {
    it('should return LoginResponse on successful login', async () => {
      const result = await authApi.login(MOCK_LOGIN_REQUEST)
      expect(result.access_token).toBe('mock-jwt-token-xyz')
      expect(result.user.role).toBe('student')
      expect(result.user.name).toBe('测试学生')
    })

    it('should throw on invalid credentials', async () => {
      server.use(
        http.post('*/auth/login', () => {
          return HttpResponse.json({ code: 401, message: '用户名或密码错误' }, { status: 401 })
        })
      )
      await expect(authApi.login({ username: 'wrong', password: 'wrong' })).rejects.toThrow()
    })
  })

  describe('getMe', () => {
    it('should return UserInfo when authenticated', async () => {
      useAuthStore.setState({ token: 'test-token', user: null })
      const result = await authApi.getMe()
      expect(result.role).toBe('student')
      expect(result.user_id).toBe('test-user-001')
    })

    it('should throw when not authenticated', async () => {
      server.use(
        http.get('*/auth/me', () => {
          return HttpResponse.json({ code: 401, message: '未授权' }, { status: 401 })
        })
      )
      await expect(authApi.getMe()).rejects.toThrow()
    })
  })
})
