import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'

vi.mock('echarts-for-react', () => ({
  default: ({ option }: any) => <div data-testid="echarts-radar">{option.radar?.indicator?.length ?? 0}</div>,
}))

import { NutritionRadar } from '@/components/charts/NutritionRadar'

describe('NutritionRadar', () => {
  const values = { energy: 2200, protein: 60, fat: 55, carbs: 280, fiber: 15 }
  const dri = { energy: 2400, protein: 65, fat: 70, carbs: 300, fiber: 25 }

  it('should render radar with 5 indicators (with fiber)', () => {
    render(<NutritionRadar values={values} dri={dri} />)
    expect(screen.getByTestId('echarts-radar').textContent).toBe('5')
  })

  it('should render 4 indicators without fiber', () => {
    const noFiberValues = { energy: 2200, protein: 60, fat: 55, carbs: 280 }
    const noFiberDRI = { energy: 2400, protein: 65, fat: 70, carbs: 300 }
    render(<NutritionRadar values={noFiberValues} dri={noFiberDRI} />)
    expect(screen.getByTestId('echarts-radar').textContent).toBe('4')
  })
})
