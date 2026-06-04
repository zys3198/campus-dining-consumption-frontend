import { execFile } from 'child_process'
import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs/promises'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

async function globalSetup() {
  const backendRoot = path.resolve(__dirname, '../../../campus-dining-consumption-backend')
  const setupScript = path.join(backendRoot, 'tests/e2e/playwright/_setup_db.py')

  // Initialize SQLite test database with seed data
  await new Promise<void>((resolve, reject) => {
    execFile('python', [setupScript], { cwd: backendRoot, timeout: 30_000 }, (err, stdout, stderr) => {
      if (err) {
        console.error('DB setup failed:', stderr || stdout)
        reject(err)
      } else {
        resolve()
      }
    })
  })

  // Teardown: clean up test database after all tests
  return async () => {
    const dbPath = path.join(backendRoot, 'test_playwright.db')
    try {
      await fs.unlink(dbPath)
    } catch {
      // File may already be gone — ignore
    }
  }
}

export default globalSetup
