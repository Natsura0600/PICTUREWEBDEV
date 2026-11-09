import { defineConfig, devices } from '@playwright/test';

const PORT = 3100;

/**
 * Prueba el flujo de contacto contra el build de producción.
 * E2E_FAKE_STORAGE=1 guarda las consultas en memoria: no toca R2 ni manda mails.
 */
export default defineConfig({
  testDir: 'tests/e2e',
  timeout: 30_000,
  retries: process.env.CI ? 1 : 0,
  use: { baseURL: `http://localhost:${PORT}`, trace: 'retain-on-failure' },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'] } },
    { name: 'mobile', use: { ...devices['Pixel 7'] } },
  ],
  webServer: {
    command: `npm run start -- -p ${PORT}`,
    url: `http://localhost:${PORT}`,
    reuseExistingServer: !process.env.CI,
    env: {
      E2E_FAKE_STORAGE: '1',
      CONTACT_RATE_LIMIT: '100',
      NEXT_PUBLIC_SITE_URL: `http://localhost:${PORT}`,
    },
    timeout: 60_000,
  },
});
