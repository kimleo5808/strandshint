import puppeteer from 'puppeteer';
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const htmlPath = path.resolve(__dirname, './covers/cover-generator.html');
const outDir = path.resolve(__dirname, '../public/images');

async function run() {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 2400, deviceScaleFactor: 2 });
  await page.goto(`file://${htmlPath}`, { waitUntil: 'networkidle0' });

  // Remove labels
  await page.evaluate(() => {
    document.querySelectorAll('h2.label').forEach(el => el.remove());
  });

  const covers = [
    { id: 'cover1', file: 'strands-strategies-guide-cover.webp' },
    { id: 'cover2', file: 'common-strands-patterns.webp' },
    { id: 'cover3', file: 'beginners-guide-strands.webp' },
  ];

  for (const cover of covers) {
    const el = await page.$(`#${cover.id}`);
    const outPath = path.join(outDir, cover.file);
    await el.screenshot({ path: outPath, type: 'webp', quality: 90 });
    console.log(`Saved: ${outPath}`);
  }

  await browser.close();
  console.log('Done!');
}

run().catch(console.error);
