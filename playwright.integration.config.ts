import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './e2e/integration',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: 0,
  workers: 1,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:13000',
    trace: 'on-first-retry',
    actionTimeout: 10000,
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  globalSetup: './e2e/integration/global-setup',
  webServer: [
    {
      command: 'python tests/e2e/_integration_server.py',
      url: 'http://localhost:18001/health',
      reuseExistingServer: false,
      cwd: '../campus-dining-consumption-backend',
      timeout: 30000,
    },
    {
      command: 'npx vite --config vite.config.integration.ts',
      url: 'http://localhost:13000',
      reuseExistingServer: false,
      timeout: 30000,
      env: {
        VITE_API_BASE_URL: '/api/v1',
      },
    },
  ],
})
