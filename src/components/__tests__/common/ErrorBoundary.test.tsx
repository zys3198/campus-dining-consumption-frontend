import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import ErrorBoundary from '@/components/common/ErrorBoundary'

function ThrowError({ shouldThrow }: { shouldThrow: boolean }) {
  if (shouldThrow) throw new Error('Test explosion')
  return <div>OK</div>
}

describe('ErrorBoundary', () => {
  it('should render children when no error', () => {
    render(
      <ErrorBoundary>
        <div>Hello World</div>
      </ErrorBoundary>,
    )
    expect(screen.getByText('Hello World')).toBeInTheDocument()
  })

  it('should render error UI when child throws', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {})
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>,
    )
    expect(screen.getByText('页面渲染异常')).toBeInTheDocument()
    expect(screen.getByText('Test explosion')).toBeInTheDocument()
    spy.mockRestore()
  })

  it('should reset error state on retry click', async () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {})

    let shouldThrow = true
    function ControlledThrow() {
      if (shouldThrow) throw new Error('Test explosion')
      return <div>OK</div>
    }

    render(
      <ErrorBoundary>
        <ControlledThrow />
      </ErrorBoundary>,
    )
    expect(screen.getByText('页面渲染异常')).toBeInTheDocument()

    shouldThrow = false
    fireEvent.click(screen.getByRole('button', { name: /重/ }))

    await waitFor(() => {
      expect(screen.getByText('OK')).toBeInTheDocument()
    })
    spy.mockRestore()
  })
})
