import { describe, it, expect, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import NutritionAnalysisPage from '@/pages/student/NutritionAnalysisPage'

vi.mock('echarts-for-react', () => ({
  default: () => <div data-testid="echart-mock" />,
}))

function renderPage() {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return render(
    <QueryClientProvider client={qc}>
      <MemoryRouter>
        <NutritionAnalysisPage />
      </MemoryRouter>
    </QueryClientProvider>
  )
}

describe('NutritionAnalysisPage', () => {
  it('should render nutrition analysis page', async () => {
    renderPage()
    await waitFor(() => {
      expect(screen.getByText('营养摄入趋势（30天）')).toBeInTheDocument()
    })
  })

  it('should render DRI comparison chart', async () => {
    renderPage()
    await screen.findByText(/营养摄入趋势/)
    const charts = screen.getAllByTestId('echart-mock')
    expect(charts.length).toBeGreaterThanOrEqual(1)
  })

  it('should render daily nutrition cards', async () => {
    renderPage()
    await screen.findByText(/营养摄入趋势/)
    expect(screen.getByText(/热量/)).toBeTruthy()
    expect(screen.getByText(/蛋白质\(g\)/)).toBeTruthy()
  })
})
