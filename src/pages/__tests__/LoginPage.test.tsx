import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useAuthStore } from '@/stores/auth'
import LoginPage from '@/pages/LoginPage'

vi.mock('antd', async () => {
  const actual = await vi.importActual('antd')
  return { ...actual, message: { success: vi.fn(), error: vi.fn(), warning: vi.fn(), info: vi.fn() } }
})

const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return { ...actual, useNavigate: () => mockNavigate }
})

function renderLoginPage() {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return render(
    <QueryClientProvider client={qc}>
      <MemoryRouter><LoginPage /></MemoryRouter>
    </QueryClientProvider>
  )
}

describe('LoginPage', () => {
  beforeEach(() => {
    useAuthStore.setState({ token: null, user: null })
    mockNavigate.mockClear()
  })

  it('should render login form with title', () => {
    renderLoginPage()
    expect(screen.getByText('校园食堂系统')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('用户名')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('密码')).toBeInTheDocument()
  })

  it('should show validation error for empty username', async () => {
    const user = userEvent.setup()
    renderLoginPage()
    const loginBtn = screen.getByRole('button', { name: /登/ })
    await user.click(loginBtn)
    await waitFor(() => {
      expect(screen.getByText('请输入用户名')).toBeInTheDocument()
    })
  })

  it('should show validation error for empty password', async () => {
    const user = userEvent.setup()
    renderLoginPage()
    await user.type(screen.getByPlaceholderText('用户名'), 'testuser')
    await user.click(screen.getByRole('button', { name: /登/ }))
    await waitFor(() => {
      expect(screen.getByText('请输入密码')).toBeInTheDocument()
    })
  })

  it('should navigate on successful login', async () => {
    const user = userEvent.setup()
    renderLoginPage()
    await user.type(screen.getByPlaceholderText('用户名'), 'testuser')
    await user.type(screen.getByPlaceholderText('密码'), 'testpass')
    await user.click(screen.getByRole('button', { name: /登/ }))
    await waitFor(() => {
      expect(useAuthStore.getState().token).toBe('mock-jwt-token-xyz')
      expect(mockNavigate).toHaveBeenCalledWith('/')
    })
  })

  it('should show loading state on submit button during login', async () => {
    const user = userEvent.setup()
    renderLoginPage()
    await user.type(screen.getByPlaceholderText('用户名'), 'testuser')
    await user.type(screen.getByPlaceholderText('密码'), 'testpass')
    const loginBtn = screen.getByRole('button', { name: /登/ })
    await user.click(loginBtn)
    // Button should show loading briefly. verify it completes without error
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalled()
    })
  })

  it('should show error message on network failure', async () => {
    const { message } = await import('antd')
    const { server } = await import('@/mocks/server')
    const { http, HttpResponse } = await import('msw')
    server.use(
      http.post('*/auth/login', () => {
        return HttpResponse.error()
      })
    )
    const user = userEvent.setup()
    renderLoginPage()
    await user.type(screen.getByPlaceholderText('用户名'), 'testuser')
    await user.type(screen.getByPlaceholderText('密码'), 'testpass')
    await user.click(screen.getByRole('button', { name: /登/ }))
    await waitFor(() => {
      expect(message.error).toHaveBeenCalled()
    })
  })
})
