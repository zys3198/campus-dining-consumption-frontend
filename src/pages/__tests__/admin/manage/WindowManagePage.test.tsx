import { describe, it, expect } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import WindowManagePage from '@/pages/admin/manage/WindowManagePage'

function renderPage() {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return render(<QueryClientProvider client={qc}><MemoryRouter><WindowManagePage /></MemoryRouter></QueryClientProvider>)
}

describe('WindowManagePage', () => {
  it('should render window management page', async () => {
    renderPage()
    await waitFor(() => { expect(screen.getByText('窗口管理')).toBeInTheDocument() })
  })
})
