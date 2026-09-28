const { defineConfig } = require("@playwright/test");

module.exports = defineConfig({
  testDir: "./tests",
  timeout: 30000,
  fullyParallel: true,
  use: {
    baseURL: "http://127.0.0.1:4173",
    trace: "retain-on-failure"
  },
  webServer: {
    command: "python3 -m http.server 4173 --bind 127.0.0.1",
    url: "http://127.0.0.1:4173",
    reuseExistingServer: false,
    timeout: 10000
  },
  projects: [
    {
      name: "desktop",
      use: { viewport: { width: 1280, height: 800 } }
    },
    {
      name: "mobile-landscape",
      use: {
        viewport: { width: 844, height: 390 },
        hasTouch: true,
        isMobile: true
      }
    }
  ]
});
