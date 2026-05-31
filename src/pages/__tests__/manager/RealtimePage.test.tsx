import { describe, it, expect, vi } from 'vitest'
import { render } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import RealtimePage from '@/pages/manager/RealtimePage'

vi.mock('@/hooks/useRealtimeSSE', () => ({ useRealtimeSSE: () => ({ data: null, error: null }) }))

function renderPage() {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return render(<QueryClientProvider client={qc}><MemoryRouter><RealtimePage /></MemoryRouter></QueryClientProvider>)
}

describe('RealtimePage', () => {
  it('should render without crashing', () => {
    const { container } = renderPage()
    expect(container).toBeDefined()
  })
})
