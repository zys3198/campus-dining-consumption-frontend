import { describe, it, expect } from 'vitest'
import { canteenApi, windowApi, dishApi, studentApi } from '@/api/resources'
import { MOCK_DISH_CREATE } from '@/mocks/fixtures/resources'

describe('canteenApi', () => {
  it('should list canteens', async () => {
    const result = await canteenApi.list()
    expect(result.length).toBeGreaterThanOrEqual(1)
    expect(result[0].name).toBeTruthy()
  })

  it('should list windows for a canteen', async () => {
    const result = await canteenApi.listWindows('c001')
    expect(result.length).toBeGreaterThanOrEqual(1)
  })
})

describe('windowApi', () => {
  it('should list windows', async () => {
    const result = await windowApi.list()
    expect(result.data.length).toBeGreaterThanOrEqual(1)
  })

  it('should get window by id', async () => {
    const result = await windowApi.get('w001')
    expect(result.window_id).toBeTruthy()
  })

  it('should create window', async () => {
    const result = await windowApi.create({ window_name: '新窗口' })
    expect(result).toBeDefined()
  })

  it('should update window', async () => {
    const result = await windowApi.update('w001', { window_name: '改名窗口' })
    expect(result).toBeDefined()
  })

  it('should update window status', async () => {
    const result = await windowApi.updateStatus('w001', 0)
    expect(result.status).toBe(0)
  })
})

describe('dishApi', () => {
  it('should list dishes', async () => {
    const result = await dishApi.list()
    expect(result.data.length).toBeGreaterThanOrEqual(1)
  })

  it('should get dish by id', async () => {
    const result = await dishApi.get('d001')
    expect(result.dish_id).toBeTruthy()
  })

  it('should create dish', async () => {
    const result = await dishApi.create(MOCK_DISH_CREATE)
    expect(result).toBeDefined()
  })

  it('should update dish', async () => {
    const result = await dishApi.update('d001', { price: 18 })
    expect(result).toBeDefined()
  })

  it('should delete dish', async () => {
    await expect(dishApi.delete('d001')).resolves.toBeUndefined()
  })
})

describe('studentApi', () => {
  it('should list students', async () => {
    const result = await studentApi.list()
    expect(result.data.length).toBeGreaterThanOrEqual(1)
  })
})
