import { test, expect } from '@playwright/test'

test.describe('Student Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login')
    await page.getByPlaceholder('用户名').fill('testuser')
    await page.getByPlaceholder('密码').fill('testpass')
    await page.getByRole('button', { name: /登/ }).click()
    await page.waitForURL(/\/student/)
  })

  test('should navigate to student dashboard after login', async ({ page }) => {
    await expect(page.getByText('个人看板')).toBeVisible()
  })

  test('should navigate to transactions page', async ({ page }) => {
    await page.getByText('消费记录').click()
    await expect(page).toHaveURL(/\/student\/transactions/)
  })

  test('should navigate to nutrition page', async ({ page }) => {
    await page.getByText('营养分析').click()
    await expect(page).toHaveURL(/\/student\/nutrition/)
  })

  test('should navigate to profile page', async ({ page }) => {
    await page.getByText('个人中心').click()
    await expect(page).toHaveURL(/\/student\/profile/)
  })
})
