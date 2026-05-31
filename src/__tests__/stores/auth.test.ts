import { describe, it, expect, beforeEach } from 'vitest'
import { useAuthStore } from '@/stores/auth'
import { createMockUserInfo } from '@/mocks/fixtures/auth'

describe('useAuthStore', () => {
  beforeEach(() => {
    useAuthStore.setState({ token: null, user: null })
  })

  it('should start with null token and user', () => {
    const state = useAuthStore.getState()
    expect(state.token).toBeNull()
    expect(state.user).toBeNull()
  })

  it('should set auth with token and user', () => {
    const user = createMockUserInfo()
    useAuthStore.getState().setAuth('test-token', user)
    const state = useAuthStore.getState()
    expect(state.token).toBe('test-token')
    expect(state.user).toEqual(user)
  })

  it('should clear auth on logout', () => {
    useAuthStore.getState().setAuth('test-token', createMockUserInfo())
    useAuthStore.getState().logout()
    const state = useAuthStore.getState()
    expect(state.token).toBeNull()
    expect(state.user).toBeNull()
  })

  it('should persist auth state', () => {
    useAuthStore.getState().setAuth('token-persist', createMockUserInfo({ role: 'admin' }))
    expect(useAuthStore.getState().user?.role).toBe('admin')
    expect(useAuthStore.getState().token).toBe('token-persist')
  })
})
