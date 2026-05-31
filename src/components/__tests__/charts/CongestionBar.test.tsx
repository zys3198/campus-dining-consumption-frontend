import { describe, it, expect, beforeAll } from 'vitest'
import { render, screen } from '@testing-library/react'
import { CongestionBar } from '@/components/charts/CongestionBar'
import type { CongestionItem } from '@/types'

beforeAll(() => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: (query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    }),
  })
})

describe('CongestionBar', () => {
  const mockData: CongestionItem[] = [
    { window_id: 'w1', window_name: '川菜窗口', canteen_name: '一食堂', avg_wait_seconds: 300, max_queue_length: 20, sample_count: 50, level: '拥堵' },
    { window_id: 'w2', window_name: '面食窗口', canteen_name: '一食堂', avg_wait_seconds: 30, max_queue_length: 3, sample_count: 40, level: '畅通' },
  ]

  it('should render all congestion items', () => {
    render(<CongestionBar data={mockData} />)
    expect(screen.getByText('川菜窗口')).toBeInTheDocument()
    expect(screen.getByText('面食窗口')).toBeInTheDocument()
    expect(screen.getByText('拥堵')).toBeInTheDocument()
    expect(screen.getByText('畅通')).toBeInTheDocument()
  })

  it('should display wait time and queue length', () => {
    render(<CongestionBar data={mockData} />)
    expect(screen.getByText(/300s/)).toBeInTheDocument()
    expect(screen.getByText(/20人/)).toBeInTheDocument()
  })

  it('should handle empty data without crash', () => {
    render(<CongestionBar data={[]} />)
    expect(screen.queryByText('川菜窗口')).not.toBeInTheDocument()
  })
})
