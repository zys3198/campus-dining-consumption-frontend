import { describe, it, expect } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import CanteenManagePage from '@/pages/admin/manage/CanteenManagePage'

function renderPage() {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return render(<QueryClientProvider client={qc}><MemoryRouter><CanteenManagePage /></MemoryRouter></QueryClientProvider>)
}

describe('CanteenManagePage', () => {
  it('should render table with canteen data', async () => {
    renderPage()
    await waitFor(() => { expect(screen.getByText('一食堂')).toBeInTheDocument() })
    expect(screen.getByText('食堂ID')).toBeInTheDocument()
    expect(screen.getByText('名称')).toBeInTheDocument()
  })
})
