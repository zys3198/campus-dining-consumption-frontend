import { type Locator, type Page } from '@playwright/test'

export class LoginPage {
  readonly page: Page
  readonly usernameInput: Locator
  readonly passwordInput: Locator
  readonly loginButton: Locator

  constructor(page: Page) {
    this.page = page
    this.usernameInput = page.getByPlaceholder('用户名')
    this.passwordInput = page.getByPlaceholder('密码')
    this.loginButton = page.getByRole('button', { name: /登/ })
  }

  async goto() {
    await this.page.goto('/login')
  }

  async login(username: string, password: string) {
    await this.usernameInput.fill(username)
    await this.passwordInput.fill(password)
    await this.loginButton.click()
  }
}
