import { describe, it, expect } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import AdminDashboardPage from '@/pages/admin/AdminDashboardPage'

function renderPage() {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return render(<QueryClientProvider client={qc}><MemoryRouter><AdminDashboardPage /></MemoryRouter></QueryClientProvider>)
}

describe('AdminDashboardPage', () => {
  it('should render stat cards', async () => {
    renderPage()
    await waitFor(() => { expect(screen.getByText('今日销售额')).toBeInTheDocument() })
    expect(screen.getByText('今日订单')).toBeInTheDocument()
    expect(screen.getByText('平均热量')).toBeInTheDocument()
    expect(screen.getByText('营养预警')).toBeInTheDocument()
  })
})
