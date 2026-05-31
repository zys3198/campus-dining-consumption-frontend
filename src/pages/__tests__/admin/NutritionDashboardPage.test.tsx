import { describe, it, expect } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import NutritionDashboardPage from '@/pages/admin/NutritionDashboardPage'

function renderPage() {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return render(<QueryClientProvider client={qc}><MemoryRouter><NutritionDashboardPage /></MemoryRouter></QueryClientProvider>)
}

describe('NutritionDashboardPage', () => {
  it('should render stat cards', async () => {
    renderPage()
    await waitFor(() => {
      const cards = screen.getAllByText('平均热量')
      expect(cards.length).toBeGreaterThanOrEqual(1)
    })
    expect(screen.getAllByText('平均蛋白质').length).toBeGreaterThanOrEqual(1)
    expect(screen.getAllByText('平均脂肪').length).toBeGreaterThanOrEqual(1)
    expect(screen.getByText('预警人数')).toBeInTheDocument()
  })

  it('should render tabs', async () => {
    renderPage()
    await waitFor(() => { expect(screen.getByText('群体对比')).toBeInTheDocument() })
    expect(screen.getByText('异常预警')).toBeInTheDocument()
    expect(screen.getByText('按院系')).toBeInTheDocument()
    expect(screen.getByText('按年级')).toBeInTheDocument()
  })

  it('should display alert count card', async () => {
    renderPage()
    await screen.findByText('预警人数')
    await screen.findByText('3')
  })
})
