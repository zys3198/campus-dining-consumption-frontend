import { describe, it, expect } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import StudentManagePage from '@/pages/admin/manage/StudentManagePage'

function renderPage() {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return render(<QueryClientProvider client={qc}><MemoryRouter><StudentManagePage /></MemoryRouter></QueryClientProvider>)
}

describe('StudentManagePage', () => {
  it('should render student management page', async () => {
    renderPage()
    await waitFor(() => { expect(screen.getByText('张三')).toBeInTheDocument() })
  })

  it('should display student department info', async () => {
    renderPage()
    await screen.findByText('张三')
    expect(screen.getByText(/计算机学院/)).toBeTruthy()
  })

  it('should show table column headers', async () => {
    renderPage()
    await screen.findByText('张三')
    const tableHeaders = document.querySelectorAll('th')
    expect(tableHeaders.length).toBeGreaterThanOrEqual(1)
  })
})
