import { describe, it, expect, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import OperationsDashboardPage from '@/pages/manager/OperationsDashboardPage'

vi.mock('echarts-for-react', () => ({ default: () => <div data-testid="echart" /> }))
vi.mock('@/hooks/useRealtimeSSE', () => ({
  useRealtimeSSE: () => ({ data: null, error: null }),
}))

function renderPage() {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return render(<QueryClientProvider client={qc}><MemoryRouter><OperationsDashboardPage /></MemoryRouter></QueryClientProvider>)
}

describe('OperationsDashboardPage', () => {
  it('should render tab titles', async () => {
    renderPage()
    await waitFor(() => { expect(screen.getByText('概览')).toBeInTheDocument() })
    expect(screen.getByText('窗口排行')).toBeInTheDocument()
    expect(screen.getByText('7日趋势')).toBeInTheDocument()
    expect(screen.getByText('餐段分解')).toBeInTheDocument()
    expect(screen.getByText('实时拥堵')).toBeInTheDocument()
  })

  it('should display overview stats', async () => {
    renderPage()
    await waitFor(() => {
      expect(screen.getByText('销售额')).toBeInTheDocument()
      expect(screen.getByText('订单数')).toBeInTheDocument()
    })
  })

  it('should switch between tabs and render content', async () => {
    renderPage()
    await screen.findByText('概览')
    const windowTab = screen.getByText('窗口排行')
    await userEvent.click(windowTab)
    await waitFor(() => {
      expect(screen.getByText('窗口名')).toBeInTheDocument()
    })
  })

  it('should render window ranking table in windows tab', async () => {
    renderPage()
    await screen.findByText('概览')
    const windowTab = screen.getByText('窗口排行')
    await userEvent.click(windowTab)
    await waitFor(() => {
      expect(screen.getByText('川菜窗口')).toBeInTheDocument()
    })
  })

  it('should render congestion tab with heatmap and bar', async () => {
    renderPage()
    await screen.findByText('概览')
    const congestionTab = screen.getByText('实时拥堵')
    await userEvent.click(congestionTab)
    await waitFor(() => {
      expect(screen.getByText('拥堵窗口')).toBeInTheDocument()
      expect(screen.getByText('实时窗口状态')).toBeInTheDocument()
      expect(screen.getByText('全天拥堵热力图（15分钟分段）')).toBeInTheDocument()
    })
  })

  it('should handle empty dashboard data', async () => {
    const { server } = await import('@/mocks/server')
    const { http, HttpResponse } = await import('msw')
    const { createMockOperationsDashboard } = await import('@/mocks/fixtures/dashboard')
    server.use(
      http.get('*/dashboards/operations', () => {
        return HttpResponse.json({
          code: 200, message: 'success',
          data: createMockOperationsDashboard({
            today: { total_amount: 0, total_count: 0, avg_per_person: 0, student_count: 0 },
            top_windows: [],
            meal_breakdown: [],
            trend_7d: [],
            congestion: [],
          }),
        })
      })
    )
    renderPage()
    await screen.findByText('概览')
    expect(screen.getByText('销售额')).toBeInTheDocument()
  })
})
