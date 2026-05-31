import { describe, it, expect } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import StudentDashboardPage from '@/pages/student/StudentDashboardPage'

function renderPage() {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return render(
    <QueryClientProvider client={qc}>
      <MemoryRouter>
        <StudentDashboardPage />
      </MemoryRouter>
    </QueryClientProvider>
  )
}

describe('StudentDashboardPage', () => {
  it('should render stat cards after loading', async () => {
    renderPage()
    await waitFor(() => {
      expect(screen.getByText('本月消费')).toBeInTheDocument()
    })
    expect(screen.getByText('营养评分')).toBeInTheDocument()
  })

  it('should display student info card', async () => {
    renderPage()
    // The rendered text is "姓名：测试学生" so use findByText with regex
    const nameEl = await screen.findByText(/测试学生/)
    expect(nameEl).toBeInTheDocument()
    const deptEl = await screen.findByText(/计算机学院/)
    expect(deptEl).toBeInTheDocument()
  })

  it('should handle empty data gracefully', async () => {
    const { server } = await import('@/mocks/server')
    const { http, HttpResponse } = await import('msw')
    const { createMockStudentDashboard } = await import('@/mocks/fixtures/dashboard')
    server.use(
      http.get('*/dashboards/student', () => {
        return HttpResponse.json({
          code: 200, message: 'success',
          data: createMockStudentDashboard({ student_name: '', department: '', nutrition_score: null }),
        })
      })
    )
    renderPage()
    await waitFor(() => {
      expect(screen.getByText('暂无')).toBeInTheDocument()
    })
  })

  it('should display all four stat cards', async () => {
    renderPage()
    await screen.findByText('本月消费')
    expect(screen.getByText('消费次数')).toBeInTheDocument()
    expect(screen.getByText('次均消费')).toBeInTheDocument()
    expect(screen.getByText('营养评分')).toBeInTheDocument()
  })

  it('should show time preference and favorite canteen', async () => {
    renderPage()
    await screen.findByText(/测试学生/)
    expect(screen.getByText(/午餐/)).toBeInTheDocument()
    expect(screen.getByText(/一食堂/)).toBeInTheDocument()
  })

  it('should show fallback text when fields are empty', async () => {
    const { server } = await import('@/mocks/server')
    const { http, HttpResponse } = await import('msw')
    const { createMockStudentDashboard } = await import('@/mocks/fixtures/dashboard')
    server.use(
      http.get('*/dashboards/student', () => {
        return HttpResponse.json({
          code: 200, message: 'success',
          data: createMockStudentDashboard({
            student_name: '', department: '', time_preference: null,
            favorite_canteen: null, nutrition_score: null,
          }),
        })
      })
    )
    renderPage()
    const noDataElements = await screen.findAllByText(/暂无/)
    expect(noDataElements.length).toBeGreaterThanOrEqual(3)
  })
})
