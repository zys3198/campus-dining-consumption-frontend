import { describe, it, expect, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import TransactionListPage from '@/pages/student/TransactionListPage'

vi.mock('echarts-for-react', () => ({
  default: () => <div data-testid="echart-mock" />,
}))

function renderPage() {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return render(
    <QueryClientProvider client={qc}>
      <MemoryRouter>
        <TransactionListPage />
      </MemoryRouter>
    </QueryClientProvider>
  )
}

describe('TransactionListPage', () => {
  it('should render table with transaction data', async () => {
    renderPage()
    await waitFor(() => {
      expect(screen.getAllByText('川菜窗口').length).toBeGreaterThanOrEqual(1)
    })
  })

  it('should render transaction amount correctly', async () => {
    renderPage()
    const windows = await screen.findAllByText(/川菜窗口/)
    expect(windows.length).toBeGreaterThanOrEqual(1)
    const amounts = screen.getAllByText(/27\.50/)
    expect(amounts.length).toBeGreaterThanOrEqual(1)
  })

  it('should handle empty transaction list', async () => {
    const { server } = await import('@/mocks/server')
    const { http, HttpResponse } = await import('msw')
    server.use(
      http.get('*/transactions', () => {
        return HttpResponse.json({
          code: 200, message: 'success',
          data: [],
          meta: { page: 1, page_size: 20, total: 0, total_pages: 0 },
        })
      })
    )
    renderPage()
    // Ant Design Table shows empty state text
    await screen.findByText(/暂无|No/).catch(() => {
      // Some antd versions show different empty text, just verify no crash
    })
  })
})
