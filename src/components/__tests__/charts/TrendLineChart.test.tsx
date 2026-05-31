import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'

vi.mock('echarts-for-react', () => ({
  default: ({ option }: any) => <div data-testid="echarts-line">{option.series[0].name}</div>,
}))

import { TrendLineChart } from '@/components/charts/TrendLineChart'

describe('TrendLineChart', () => {
  const mockData = [
    { date: '2026-05-01', count: 100, amount: 1200 },
    { date: '2026-05-02', count: 120, amount: 1500 },
  ]

  it('should default to amount series', () => {
    render(<TrendLineChart data={mockData} />)
    expect(screen.getByTestId('echarts-line').textContent).toBe('销售额')
  })

  it('should show count series when dataKey is count', () => {
    render(<TrendLineChart data={mockData} dataKey="count" />)
    expect(screen.getByTestId('echarts-line').textContent).toBe('订单数')
  })
})
