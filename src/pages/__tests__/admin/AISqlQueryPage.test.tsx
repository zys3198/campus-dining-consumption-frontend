import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import AISqlQueryPage from '@/pages/admin/AISqlQueryPage'

function renderPage() {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return render(<QueryClientProvider client={qc}><MemoryRouter><AISqlQueryPage /></MemoryRouter></QueryClientProvider>)
}

describe('AISqlQueryPage', () => {
  it('should render AI query page', () => {
    renderPage()
    expect(screen.getByText(/AI|查询/)).toBeTruthy()
  })

  it('should render input and button', () => {
    renderPage()
    expect(screen.getByPlaceholderText(/自然语言/)).toBeInTheDocument()
    expect(screen.getByText('自然语言查询')).toBeInTheDocument()
  })

  it('should have an input area for SQL questions', async () => {
    renderPage()
    const textarea = document.querySelector('textarea') || screen.getByRole('textbox')
    expect(textarea).toBeTruthy()
  })

  it('should have a submit/query button', async () => {
    renderPage()
    const buttons = screen.getAllByRole('button')
    expect(buttons.length).toBeGreaterThanOrEqual(1)
  })
})
