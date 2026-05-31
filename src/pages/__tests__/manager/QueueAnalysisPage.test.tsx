import { describe, it, expect } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import QueueAnalysisPage from '@/pages/manager/QueueAnalysisPage'

function renderPage() {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return render(<QueryClientProvider client={qc}><MemoryRouter><QueueAnalysisPage /></MemoryRouter></QueryClientProvider>)
}

describe('QueueAnalysisPage', () => {
  it('should render queue analysis page', async () => {
    renderPage()
    await waitFor(() => {
      expect(screen.getByText('窗口排队分析')).toBeInTheDocument()
    })
  })

  it('should display wait time statistics', async () => {
    renderPage()
    await waitFor(() => {
      expect(screen.getByText('平均等待(s)')).toBeInTheDocument()
    })
  })
})
