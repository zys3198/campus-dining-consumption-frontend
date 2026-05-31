import { test, expect } from '@playwright/test'

test.describe('Manager Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login')
    await page.getByPlaceholder('用户名').fill('manager1')
    await page.getByPlaceholder('密码').fill('manager1')
    await page.getByRole('button', { name: /登/ }).click()
    await page.waitForURL(/\/manager/)
  })

  test('should land on operations dashboard', async ({ page }) => {
    await expect(page.getByText('运营看板')).toBeVisible()
  })

  test('should navigate to queue analysis', async ({ page }) => {
    await page.getByText('排队分析').click()
    await expect(page).toHaveURL(/\/manager\/queue/)
  })

  test('should navigate to realtime screen', async ({ page }) => {
    await page.getByText('实时大屏').click()
    await expect(page).toHaveURL(/\/manager\/realtime/)
  })
})
