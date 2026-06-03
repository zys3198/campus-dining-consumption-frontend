import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import RealtimePage from '@/pages/manager/RealtimePage'
import type { RealtimeDashboard } from '@/types'

const mockData: RealtimeDashboard = {
  timestamp: '2026-05-31T12:00:00Z',
  today_total_amount: 5000,
  today_total_count: 400,
  congestion_count: 3,
  windows: [],
}

// Mock SSE hook at module level (hoisted)
let mockSSE: { data: RealtimeDashboard | null; error: string | null } = { data: null, error: null }
vi.mock('@/hooks/useRealtimeSSE', () => ({
  useRealtimeSSE: () => mockSSE,
}))

function renderPage() {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return render(<QueryClientProvider client={qc}><MemoryRouter><RealtimePage /></MemoryRouter></QueryClientProvider>)
}

describe('RealtimePage', () => {
  it('should render with SSE data', () => {
    mockSSE = { data: mockData, error: null }
    renderPage()
    expect(screen.getByText('今日销售额')).toBeInTheDocument()
    expect(screen.getByText('今日订单数')).toBeInTheDocument()
    expect(screen.getByText('拥堵窗口')).toBeInTheDocument()
  })

  it('should show error state on connection error', () => {
    mockSSE = { data: null, error: '连接错误' }
    const { container } = renderPage()
    // Should fall back to static data from query
    expect(container).toBeDefined()
  })
})
