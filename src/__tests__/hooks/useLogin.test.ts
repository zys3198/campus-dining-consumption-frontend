import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import { server } from '@/mocks/server'
import { useAuthStore } from '@/stores/auth'
import { useLogin } from '@/hooks/useLogin'
import { createMockLoginResponse } from '@/mocks/fixtures/auth'

vi.mock('antd', async () => {
  const actual = await vi.importActual('antd')
  return {
    ...actual,
    message: { success: vi.fn(), error: vi.fn(), warning: vi.fn(), info: vi.fn() },
  }
})

describe('useLogin', () => {
  beforeEach(() => {
    useAuthStore.setState({ token: null, user: null })
    server.resetHandlers()
  })

  it('should login successfully and set auth state', async () => {
    const { result } = renderHook(() => useLogin())
    let success = false

    await act(async () => {
      success = await result.current.login('testuser', 'testpass')
    })

    expect(success).toBe(true)
    const authState = useAuthStore.getState()
    expect(authState.token).toBe('mock-jwt-token-xyz')
    expect(authState.user?.role).toBe('student')
  })

  it('should return false on login failure', async () => {
    server.use(
      http.post('*/auth/login', () => {
        return HttpResponse.json({ detail: 'Invalid credentials' }, { status: 401 })
      })
    )

    const { result } = renderHook(() => useLogin())
    let success = true

    await act(async () => {
      success = await result.current.login('wrong', 'wrong')
    })

    expect(success).toBe(false)
    expect(useAuthStore.getState().token).toBeNull()
  })

  it('should logout and redirect to login page', () => {
    useAuthStore.getState().setAuth('test-token', createMockLoginResponse().user)

    // Mock window.location
    const locationMock = { href: '' }
    Object.defineProperty(window, 'location', {
      value: locationMock,
      writable: true,
      configurable: true,
    })

    const { result } = renderHook(() => useLogin())
    act(() => {
      result.current.logout()
    })

    expect(useAuthStore.getState().token).toBeNull()
    expect(window.location.href).toBe('/login')
  })
})
