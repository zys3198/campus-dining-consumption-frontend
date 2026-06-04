import { test, expect } from '@playwright/test'

// Seed data credentials (from _setup_db.py)
const USERS = {
  student: { username: '2021001', password: 'student123' },
  manager: { username: 'manager1', password: 'manager123' },
  admin: { username: 'admin', password: 'admin123' },
  disabled: { username: 'disabled_user', password: 'disabled123' },
} as const

test.describe('Authentication Flow', () => {
  test('should display login page correctly', async ({ page }) => {
    await page.goto('/login')
    await expect(page.getByText('校园食堂系统')).toBeVisible()
    await expect(page.getByPlaceholder('用户名')).toBeVisible()
    await expect(page.getByPlaceholder('密码')).toBeVisible()
    await expect(page.getByRole('button', { name: /登/ })).toBeVisible()
  })

  test('should login as student and redirect to student dashboard', async ({ page }) => {
    await page.goto('/login')
    await page.getByPlaceholder('用户名').fill(USERS.student.username)
    await page.getByPlaceholder('密码').fill(USERS.student.password)
    await page.getByRole('button', { name: /登/ }).click()

    await page.waitForURL(/\/student\/dashboard/, { timeout: 10000 })
    await expect(page).toHaveURL(/\/student\/dashboard/)
    await expect(page.getByText('个人看板')).toBeVisible()
  })

  test('should login as manager and redirect to operations dashboard', async ({ page }) => {
    await page.goto('/login')
    await page.getByPlaceholder('用户名').fill(USERS.manager.username)
    await page.getByPlaceholder('密码').fill(USERS.manager.password)
    await page.getByRole('button', { name: /登/ }).click()

    await page.waitForURL(/\/manager\/operations/, { timeout: 10000 })
    await expect(page).toHaveURL(/\/manager\/operations/)
    await expect(page.getByText('运营看板')).toBeVisible()
  })

  test('should login as admin and redirect to admin dashboard', async ({ page }) => {
    await page.goto('/login')
    await page.getByPlaceholder('用户名').fill(USERS.admin.username)
    await page.getByPlaceholder('密码').fill(USERS.admin.password)
    await page.getByRole('button', { name: /登/ }).click()

    await page.waitForURL(/\/admin\/dashboard/, { timeout: 10000 })
    await expect(page).toHaveURL(/\/admin\/dashboard/)
    await expect(page.getByText('管理后台')).toBeVisible()
  })

  test('should show error for wrong password', async ({ page }) => {
    await page.goto('/login')
    await page.getByPlaceholder('用户名').fill(USERS.student.username)
    await page.getByPlaceholder('密码').fill('wrong_password')
    await page.getByRole('button', { name: /登/ }).click()

    // Should stay on login page with error message
    await expect(page).toHaveURL(/\/login/)
    await expect(page.getByText(/失败|错误/)).toBeVisible({ timeout: 5000 })
  })

  test('should show error for disabled user', async ({ page }) => {
    await page.goto('/login')
    await page.getByPlaceholder('用户名').fill(USERS.disabled.username)
    await page.getByPlaceholder('密码').fill(USERS.disabled.password)
    await page.getByRole('button', { name: /登/ }).click()

    await expect(page).toHaveURL(/\/login/)
    await expect(page.getByText(/失败|错误/)).toBeVisible({ timeout: 5000 })
  })

  test('should redirect to login when not authenticated', async ({ page }) => {
    await page.goto('/student/dashboard')
    await expect(page).toHaveURL(/\/login/, { timeout: 10000 })
  })

  test('should logout and redirect to login', async ({ page }) => {
    // Login first
    await page.goto('/login')
    await page.getByPlaceholder('用户名').fill(USERS.student.username)
    await page.getByPlaceholder('密码').fill(USERS.student.password)
    await page.getByRole('button', { name: /登/ }).click()
    await page.waitForURL(/\/student/, { timeout: 10000 })

    // Click avatar dropdown to trigger logout
    await page.locator('.ant-avatar').click()
    await page.getByText('退出登录').click()

    await expect(page).toHaveURL(/\/login/, { timeout: 5000 })
  })
})

test.describe('Token Persistence', () => {
  test('should persist auth token across page reload', async ({ page }) => {
    // Login
    await page.goto('/login')
    await page.getByPlaceholder('用户名').fill(USERS.admin.username)
    await page.getByPlaceholder('密码').fill(USERS.admin.password)
    await page.getByRole('button', { name: /登/ }).click()
    await page.waitForURL(/\/admin/, { timeout: 10000 })

    // Verify token stored in localStorage
    const authData = await page.evaluate(() => localStorage.getItem('auth'))
    expect(authData).toBeTruthy()
    const parsed = JSON.parse(authData!)
    expect(parsed.state.token).toBeTruthy()

    // Reload page — should stay authenticated
    await page.reload()
    await expect(page).toHaveURL(/\/admin/, { timeout: 10000 })
    await expect(page.getByText('管理后台')).toBeVisible()
  })
})
