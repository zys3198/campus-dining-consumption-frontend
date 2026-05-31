import { describe, it, expect } from 'vitest'
import { aiApi } from '@/api/ai'

describe('aiApi', () => {
  it('should execute AI SQL query', async () => {
    const result = await aiApi.query({ question: '宫保鸡丁' })
    expect(result.sql).toContain('SELECT')
    expect(result.results.length).toBeGreaterThanOrEqual(1)
    expect(result.execution_time_ms).toBeGreaterThan(0)
  })

  it('should return columns', async () => {
    const result = await aiApi.query({ question: 'test' })
    expect(result.columns).toEqual(['dish_name', 'price'])
  })
})
