import { test, expect } from '@playwright/test'

test.describe('Admin Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login')
    await page.getByPlaceholder('用户名').fill('admin')
    await page.getByPlaceholder('密码').fill('admin123')
    await page.getByRole('button', { name: /登/ }).click()
    await page.waitForURL(/\/admin/)
  })

  test('should land on admin dashboard', async ({ page }) => {
    await expect(page.getByText('管理后台')).toBeVisible()
  })

  test('should navigate to nutrition dashboard', async ({ page }) => {
    await page.getByText('营养看板').click()
    await expect(page).toHaveURL(/\/admin\/nutrition/)
  })

  test('should navigate to AI query', async ({ page }) => {
    await page.getByText('AI查询').click()
    await expect(page).toHaveURL(/\/admin\/ai-query/)
  })

  test('should navigate to canteen management', async ({ page }) => {
    await page.getByText('食堂管理').click()
    await expect(page).toHaveURL(/\/admin\/canteens/)
  })

  test('should navigate to window management', async ({ page }) => {
    await page.getByText('窗口管理').click()
    await expect(page).toHaveURL(/\/admin\/windows/)
  })

  test('should navigate to dish management', async ({ page }) => {
    await page.getByText('餐品管理').click()
    await expect(page).toHaveURL(/\/admin\/dishes/)
  })

  test('should navigate to student management', async ({ page }) => {
    await page.getByText('学生管理').click()
    await expect(page).toHaveURL(/\/admin\/students/)
  })
})
