const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const args = process.argv.slice(2);
const env = args.find(a => a.startsWith('--env='))?.replace('--env=', '') || 'production';
const url = process.env.SCREENSHOT_URL || 'https://camiloavila.dev';

const SCREENSHOTS_DIR = path.join(__dirname, 'screenshots', env);

if (!fs.existsSync(SCREENSHOTS_DIR)) {
  fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });
}

const viewports = [
  { name: 'desktop', width: 1920, height: 1080 },
  { name: 'mobile', width: 375, height: 667 }
];

async function takeScreenshots() {
  console.log(`Starting screenshots for ${env} environment...`);
  console.log(`URL: ${url}`);

  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  for (const viewport of viewports) {
    console.log(`\n📸 Taking ${viewport.name} screenshot (${viewport.width}x${viewport.height})...`);
    
    await page.setViewportSize({ width: viewport.width, height: viewport.height });
    
    console.log(`  → Navigating to ${url}...`);
    await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 });
    
    console.log('  → Waiting for SPA hydration...');
    await page.waitForTimeout(2000);
    
    const screenshotPath = path.join(SCREENSHOTS_DIR, `${env}-${viewport.name}.png`);
    await page.screenshot({ path: screenshotPath, fullPage: true });
    
    console.log(`  ✅ Saved: ${screenshotPath}`);
  }

  await browser.close();
  console.log('\n✅ All screenshots complete!');
}

takeScreenshots().catch(err => {
  console.error('Error:', err.message);
  process.exit(1);
});