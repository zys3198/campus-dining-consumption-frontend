import { test, expect } from '@playwright/test'

// Helper: login as admin
async function loginAsAdmin(page: import('@playwright/test').Page) {
  await page.goto('/login')
  await page.getByPlaceholder('用户名').fill('admin')
  await page.getByPlaceholder('密码').fill('admin123')
  await page.getByRole('button', { name: /登/ }).click()
  await page.waitForURL(/\/admin/, { timeout: 10000 })
}

test.describe('Admin Flow', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsAdmin(page)
  })

  test('should load admin dashboard with stat cards', async ({ page }) => {
    // Admin dashboard shows operations + nutrition data
    await expect(page.getByText('今日销售额')).toBeVisible({ timeout: 10000 })
    await expect(page.getByText('今日订单')).toBeVisible()
    await expect(page.getByText('平均热量')).toBeVisible()
    await expect(page.getByText('营养预警')).toBeVisible()
  })

  test('should navigate to canteen management with seed data', async ({ page }) => {
    await page.getByText('食堂管理').click()
    await expect(page).toHaveURL(/\/admin\/canteens/)

    // Wait for table and verify seed data
    await expect(page.locator('.ant-table')).toBeVisible({ timeout: 10000 })
    await expect(page.locator('.ant-table-tbody')).toContainText('第一食堂', { timeout: 10000 })
  })

  test('should navigate to dish management with seed data', async ({ page }) => {
    await page.getByText('餐品管理').click()
    await expect(page).toHaveURL(/\/admin\/dishes/)

    // Wait for table and verify seed data
    await expect(page.locator('.ant-table')).toBeVisible({ timeout: 10000 })
    await expect(page.locator('.ant-table-tbody')).toContainText('宫保鸡丁', { timeout: 10000 })
    await expect(page.locator('.ant-table-tbody')).toContainText('鱼香肉丝', { timeout: 10000 })
  })

  test('should navigate to window management', async ({ page }) => {
    await page.getByText('窗口管理').click()
    await expect(page).toHaveURL(/\/admin\/windows/)

    await expect(page.locator('.ant-table')).toBeVisible({ timeout: 10000 })
    // Seed data: w01 "自选窗口1号"
    await expect(page.locator('.ant-table-tbody')).toContainText('自选窗口1号', { timeout: 10000 })
  })

  test('should navigate to student management', async ({ page }) => {
    await page.getByText('学生管理').click()
    await expect(page).toHaveURL(/\/admin\/students/)

    await expect(page.locator('.ant-table')).toBeVisible({ timeout: 10000 })
  })

  test('should navigate to AI query page', async ({ page }) => {
    await page.getByText('AI查询').click()
    await expect(page).toHaveURL(/\/admin\/ai-query/)

    // Page should have a query input area
    await expect(page.locator('textarea, input[type="text"]').first()).toBeVisible({
      timeout: 10000,
    })
  })
})

test.describe('Admin Operations Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsAdmin(page)
    await page.getByText('运营看板').click()
    await expect(page).toHaveURL(/\/admin\/operations/)
  })

  test('should render operations dashboard tabs', async ({ page }) => {
    await expect(page.getByText('今日概览')).toBeVisible({ timeout: 10000 })
    await expect(page.getByText('窗口排行')).toBeVisible()
    await expect(page.getByText('7日趋势')).toBeVisible()
    await expect(page.getByText('餐段分解')).toBeVisible()
  })

  test('should show overview stats', async ({ page }) => {
    // Click overview tab
    await page.getByText('今日概览').click()

    await expect(page.getByText('今日销售额')).toBeVisible({ timeout: 10000 })
    await expect(page.getByText('今日订单数')).toBeVisible()
    await expect(page.getByText('就餐人数')).toBeVisible()
    await expect(page.getByText('人均消费')).toBeVisible()
  })
})

test.describe('Admin Nutrition Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsAdmin(page)
    await page.getByText('营养看板').click()
    await expect(page).toHaveURL(/\/admin\/nutrition/)
  })

  test('should load nutrition dashboard', async ({ page }) => {
    // Nutrition dashboard should show stat cards
    await expect(page.locator('.ant-statistic, .ant-card').first()).toBeVisible({
      timeout: 10000,
    })
  })
})
