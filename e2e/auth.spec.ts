import { test, expect } from '@playwright/test'
import { EXPECTED_TEXTS } from './fixtures/test-data'

test.describe('Authentication', () => {
  test('should display login page', async ({ page }) => {
    await page.goto('/login')
    await expect(page.getByText(EXPECTED_TEXTS.loginTitle)).toBeVisible()
    await expect(page.getByPlaceholder('用户名')).toBeVisible()
    await expect(page.getByPlaceholder('密码')).toBeVisible()
  })

  test('should redirect to login when not authenticated', async ({ page }) => {
    await page.goto('/student/dashboard')
    await expect(page).toHaveURL(/\/login/)
  })

  test('should stay on login page for wrong credentials', async ({ page }) => {
    await page.goto('/login')
    await page.getByPlaceholder('用户名').fill('wrong')
    await page.getByPlaceholder('密码').fill('wrong')
    await page.getByRole('button', { name: /登/ }).click()
    await expect(page).toHaveURL(/\/login/)
  })
})
