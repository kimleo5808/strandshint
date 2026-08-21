import puppeteer from 'puppeteer';
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const htmlPath = path.resolve(__dirname, './covers/og-generator.html');
const outPath = path.resolve(__dirname, '../public/og.png');

async function run() {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.setViewport({ width: 1200, height: 630, deviceScaleFactor: 2 });
  await page.goto(`file://${htmlPath}`, { waitUntil: 'networkidle0' });

  const el = await page.$('#og');
  await el.screenshot({ path: outPath, type: 'png' });
  console.log(`Saved: ${outPath}`);

  await browser.close();
  console.log('Done!');
}

run().catch(console.error);
