import { describe, it, expect, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import OperationsDashboardPage from '@/pages/manager/OperationsDashboardPage'

vi.mock('echarts-for-react', () => ({ default: () => <div data-testid="echart" /> }))

function renderPage() {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return render(<QueryClientProvider client={qc}><MemoryRouter><OperationsDashboardPage /></MemoryRouter></QueryClientProvider>)
}

describe('OperationsDashboardPage', () => {
  it('should render tab titles', async () => {
    renderPage()
    await waitFor(() => { expect(screen.getByText('今日概览')).toBeInTheDocument() })
    expect(screen.getByText('窗口排行')).toBeInTheDocument()
    expect(screen.getByText('7日趋势')).toBeInTheDocument()
    expect(screen.getByText('餐段分解')).toBeInTheDocument()
    expect(screen.getByText('实时拥堵')).toBeInTheDocument()
  })

  it('should display sales stats', async () => {
    renderPage()
    await waitFor(() => {
      expect(screen.getByText('今日销售额')).toBeInTheDocument()
      expect(screen.getByText('今日订单数')).toBeInTheDocument()
    })
  })
})
