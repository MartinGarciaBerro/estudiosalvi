import { chromium } from 'playwright';
import fs from 'node:fs';

const PREVIEW_DIR = './_previews';
if (!fs.existsSync(PREVIEW_DIR)) fs.mkdirSync(PREVIEW_DIR);

const url = process.env.PREVIEW_URL || 'file://' + process.cwd().replace(/\\/g,'/') + '/index.html';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto(url);
  const hero = await page.locator('#hero');
  await hero.scrollIntoViewIfNeeded();
  await hero.screenshot({ path: `${PREVIEW_DIR}/hero_desktop.png` });

  await page.setViewportSize({ width: 390, height: 844 });
  await page.reload();
  await page.waitForSelector('#hero');
  const heroMobile = await page.locator('#hero');
  await heroMobile.scrollIntoViewIfNeeded();
  await heroMobile.screenshot({ path: `${PREVIEW_DIR}/hero_mobile.png` });

  await browser.close();
})();
