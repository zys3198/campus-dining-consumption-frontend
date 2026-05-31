import { describe, it, expect } from 'vitest'
import { dashboardApi, transactionApi } from '@/api/dashboard'

describe('dashboardApi', () => {
  it('should fetch operations dashboard', async () => {
    const result = await dashboardApi.operations()
    expect(result.today.total_amount).toBe(15680.50)
    expect(result.top_windows.length).toBeGreaterThanOrEqual(1)
    expect(result.meal_breakdown.length).toBeGreaterThanOrEqual(1)
  })

  it('should fetch nutrition dashboard', async () => {
    const result = await dashboardApi.nutrition()
    expect(result.avg_energy_kcal).toBe(680)
    expect(result.alert_count).toBe(3)
  })

  it('should fetch student dashboard', async () => {
    const result = await dashboardApi.student()
    expect(result.student_name).toBeTruthy()
  })

  it('should fetch realtime dashboard', async () => {
    const result = await dashboardApi.realtime()
    expect(result.today_total_amount).toBe(8900)
  })
})

describe('transactionApi', () => {
  it('should list transactions with meta', async () => {
    const result = await transactionApi.list({ page: 1, page_size: 20 })
    expect(result.data.length).toBeGreaterThanOrEqual(1)
    expect(result.meta.total).toBe(45)
  })

  it('should get transaction stats', async () => {
    const result = await transactionApi.stats()
    expect(result.total_count).toBe(500)
  })
})
