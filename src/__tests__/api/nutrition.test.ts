import { describe, it, expect } from 'vitest'
import { nutritionApi } from '@/api/nutrition'

describe('nutritionApi', () => {
  it('should fetch personal nutrition report', async () => {
    const result = await nutritionApi.getPersonal()
    expect(result.student_hash).toBe('hash-abc123')
    expect(result.daily.length).toBeGreaterThanOrEqual(1)
  })

  it('should fetch nutrition trend', async () => {
    const result = await nutritionApi.getTrend({ days: 7 })
    expect(result.length).toBeGreaterThanOrEqual(1)
  })

  it('should fetch group nutrition', async () => {
    const result = await nutritionApi.getGroup({ group_by: 'department' })
    expect(result.group_by).toBe('department')
    expect(result.groups.length).toBeGreaterThanOrEqual(1)
  })

  it('should fetch nutrition alerts', async () => {
    const result = await nutritionApi.getAlerts()
    expect(result.length).toBeGreaterThanOrEqual(1)
  })

  it('should fetch DRI standards', async () => {
    const result = await nutritionApi.getDRIs()
    expect(result.length).toBeGreaterThanOrEqual(1)
  })
})
