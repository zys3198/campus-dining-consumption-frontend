import { useAuthStore } from '@/stores/auth'
import { authApi } from '@/api/auth'
import { getErrorDetail } from '@/api/error'
import { message } from 'antd'

export const useLogin = () => {
  const { setAuth } = useAuthStore()

  const login = async (username: string, password: string) => {
    try {
      const res = await authApi.login({ username, password })
      setAuth(res.access_token, res.user)
      message.success('登录成功')
      return true
    } catch (err: any) {
      message.error(getErrorDetail(err, '登录失败'))
      return false
    }
  }

  const logout = () => {
    useAuthStore.getState().logout()
    window.location.href = '/login'
  }

  return { login, logout }
}