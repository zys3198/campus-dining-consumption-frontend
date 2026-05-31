import { describe, it, expect, beforeEach, beforeAll } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { useAuthStore } from '@/stores/auth'
import { MainLayout } from '@/components/layout/MainLayout'
import { createMockUserInfo } from '@/mocks/fixtures/auth'

beforeAll(() => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: (query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    }),
  })
})

function renderWithRouter(initialRoute = '/student/dashboard') {
  return render(
    <MemoryRouter initialEntries={[initialRoute]}>
      <MainLayout />
    </MemoryRouter>
  )
}

describe('MainLayout', () => {
  beforeEach(() => {
    useAuthStore.setState({ token: null, user: null })
  })

  it('should show student menu items for student role', () => {
    useAuthStore.setState({ token: 'token', user: createMockUserInfo({ role: 'student' }) })
    renderWithRouter()
    expect(screen.getByText('个人看板')).toBeInTheDocument()
    expect(screen.getByText('消费记录')).toBeInTheDocument()
    expect(screen.getByText('营养分析')).toBeInTheDocument()
  })

  it('should show manager menu items for manager role', () => {
    useAuthStore.setState({ token: 'token', user: createMockUserInfo({ role: 'manager' }) })
    renderWithRouter('/manager/operations')
    expect(screen.getByText('运营看板')).toBeInTheDocument()
    expect(screen.getByText('排队分析')).toBeInTheDocument()
  })

  it('should show admin menu items for admin role', () => {
    useAuthStore.setState({ token: 'token', user: createMockUserInfo({ role: 'admin' }) })
    renderWithRouter('/admin/dashboard')
    expect(screen.getByText('管理后台')).toBeInTheDocument()
    expect(screen.getByText('食堂管理')).toBeInTheDocument()
  })

  it('should display user name in header', () => {
    useAuthStore.setState({ token: 'token', user: createMockUserInfo({ name: '测试用户', role: 'student' }) })
    renderWithRouter()
    expect(screen.getByText('测试用户')).toBeInTheDocument()
  })

  it('should display role tag', () => {
    useAuthStore.setState({ token: 'token', user: createMockUserInfo({ role: 'student' }) })
    renderWithRouter()
    expect(screen.getByText('学生')).toBeInTheDocument()
  })

  it('should render brand title', () => {
    useAuthStore.setState({ token: 'token', user: createMockUserInfo({ role: 'student' }) })
    renderWithRouter()
    expect(screen.getByText('🍜 校园食堂')).toBeInTheDocument()
  })
})
