import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'

vi.mock('echarts-for-react', () => ({
  default: ({ option }: any) => <div data-testid="echarts-pie">{option.series?.[0]?.type ?? 'no-type'}</div>,
}))

import { MealBreakdownPie } from '@/components/charts/MealBreakdownPie'
import type { MealTypeBreakdown } from '@/types'

describe('MealBreakdownPie', () => {
  const mockData: MealTypeBreakdown[] = [
    { meal_type: 1, meal_name: '早餐', count: 100, amount: 800, percentage: 20 },
    { meal_type: 2, meal_name: '午餐', count: 200, amount: 2400, percentage: 60 },
  ]

  it('should render ECharts pie component', () => {
    render(<MealBreakdownPie data={mockData} />)
    expect(screen.getByTestId('echarts-pie')).toBeInTheDocument()
  })

  it('should pass pie chart type to ECharts', () => {
    render(<MealBreakdownPie data={mockData} />)
    expect(screen.getByTestId('echarts-pie').textContent).toBe('pie')
  })
})
