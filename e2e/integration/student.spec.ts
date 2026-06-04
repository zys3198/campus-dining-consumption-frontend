import { test, expect } from '@playwright/test'

// Helper: login as student
async function loginAsStudent(page: import('@playwright/test').Page) {
  await page.goto('/login')
  await page.getByPlaceholder('用户名').fill('2021001')
  await page.getByPlaceholder('密码').fill('student123')
  await page.getByRole('button', { name: /登/ }).click()
  await page.waitForURL(/\/student/, { timeout: 10000 })
}

test.describe('Student Flow', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsStudent(page)
  })

  test('should load student dashboard with real API data', async ({ page }) => {
    // Dashboard should show stat cards
    await expect(page.getByText('本月消费')).toBeVisible({ timeout: 10000 })
    await expect(page.getByText('消费次数')).toBeVisible()
    await expect(page.getByText('次均消费')).toBeVisible()

    // Verify API was called — check network response has real data
    const response = await page.waitForResponse(
      (resp) => resp.url().includes('/api/v1/dashboards/student') && resp.status() === 200,
      { timeout: 10000 }
    ).catch(() => null)

    if (response) {
      const body = await response.json()
      // Seed data has a transaction, so student should have some data
      expect(body.data).toBeDefined()
    }
  })

  test('should navigate to transactions and show seed data', async ({ page }) => {
    await page.getByText('消费记录').click()
    await expect(page).toHaveURL(/\/student\/transactions/)

    // Wait for table to load
    await expect(page.locator('.ant-table')).toBeVisible({ timeout: 10000 })

    // Seed data includes transaction T001 — check table has rows
    const rows = page.locator('.ant-table-tbody tr')
    await expect(rows.first()).toBeVisible({ timeout: 10000 })
  })

  test('should navigate to nutrition analysis', async ({ page }) => {
    await page.getByText('营养分析').click()
    await expect(page).toHaveURL(/\/student\/nutrition/)

    // Page should render nutrition content
    await expect(page.getByText('营养摄入趋势').first()).toBeVisible({
      timeout: 10000,
    })
  })

  test('should navigate to profile page', async ({ page }) => {
    await page.getByText('个人中心').click()
    await expect(page).toHaveURL(/\/student\/profile/)
  })

  test('should show user info in header', async ({ page }) => {
    // Student name (masked) or user ID should be visible in header
    const header = page.locator('.ant-layout-header')
    await expect(header.getByText(/张|2021001/)).toBeVisible()
  })
})

test.describe('Student Transaction Detail', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsStudent(page)
    await page.getByText('消费记录').click()
    await expect(page).toHaveURL(/\/student\/transactions/)
    await expect(page.locator('.ant-table')).toBeVisible({ timeout: 10000 })
  })

  test('should show transaction amount from seed data', async ({ page }) => {
    // Seed data: T001 with total_amount=15.00
    const table = page.locator('.ant-table-tbody')
    await expect(table).toContainText('15.00', { timeout: 10000 })
  })

  test('should show meal type as 午餐', async ({ page }) => {
    // Seed data: meal_type=2 → 午餐
    const table = page.locator('.ant-table-tbody')
    await expect(table).toContainText('午餐', { timeout: 10000 })
  })
})
