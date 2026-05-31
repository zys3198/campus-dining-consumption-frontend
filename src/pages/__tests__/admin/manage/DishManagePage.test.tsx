import { describe, it, expect } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import DishManagePage from '@/pages/admin/manage/DishManagePage'

function renderPage() {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return render(<QueryClientProvider client={qc}><MemoryRouter><DishManagePage /></MemoryRouter></QueryClientProvider>)
}

describe('DishManagePage', () => {
  it('should render dish management page', async () => {
    renderPage()
    await waitFor(() => { expect(screen.getByText('餐品管理')).toBeInTheDocument() })
  })
})
