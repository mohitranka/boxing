import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  timeout: 30000,
  use: { baseURL: 'http://127.0.0.1:8123', viewport: { width: 1280, height: 800 } },
  webServer: {
    command: 'python3 tools/serve.py 8123',
    url: 'http://127.0.0.1:8123/',
    reuseExistingServer: true,
  },
});
