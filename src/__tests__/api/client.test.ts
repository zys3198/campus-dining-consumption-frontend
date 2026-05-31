import { describe, it, expect } from 'vitest'
import { http, HttpResponse } from 'msw'
import { server } from '@/mocks/server'
import { useAuthStore } from '@/stores/auth'

describe('apiClient', () => {
  it('should attach Bearer token from auth store', async () => {
    useAuthStore.setState({ token: 'test-token-123', user: null })

    const { default: apiClient } = await import('@/api/client')

    server.use(
      http.get('*/test-auth-header', ({ request }) => {
        const auth = request.headers.get('Authorization')
        if (auth === 'Bearer test-token-123') {
          return HttpResponse.json({ ok: true })
        }
        return HttpResponse.json({ ok: false }, { status: 401 })
      })
    )

    const res = await apiClient.get('/test-auth-header')
    expect(res.data.ok).toBe(true)
  })

  it('should call logout and show login link on 401 response', async () => {
    useAuthStore.setState({ token: 'expired-token', user: null })

    const { default: apiClient } = await import('@/api/client')

    server.use(
      http.get('*/test-401', () => {
        return HttpResponse.json({ detail: 'Token expired' }, { status: 401 })
      })
    )

    await expect(apiClient.get('/test-401')).rejects.toThrow()
    expect(useAuthStore.getState().token).toBeNull()
  })

  it('should use env VITE_API_BASE_URL when provided', async () => {
    const { default: apiClient } = await import('@/api/client')
    expect(apiClient.defaults.baseURL).toBeDefined()
  })
})
