import { chromium } from 'playwright-core';
import { writeFileSync } from 'fs';
import { pathToFileURL } from 'url';

const src = pathToFileURL('/Users/edka/www/Publius/pitch/market-landscape.html').href;
const browser = await chromium.launch({ channel: 'chrome' });
const page = await browser.newPage({ viewport: { width: 1240, height: 980 } });
await page.goto(src, { waitUntil: 'networkidle', timeout: 60000 });
await page.waitForTimeout(8000);
const html = await page.evaluate(() => {
  const el = document.querySelector('div.ui[style*="width:1280px"]')
    || document.querySelector('x-dc > div')
    || document.querySelector('x-dc');
  return el ? el.outerHTML : document.body.innerHTML;
});
const styles = await page.evaluate(() =>
  Array.from(document.querySelectorAll('style'))
    .map((s) => s.textContent)
    .join('\n')
);
const out = `<!-- rendered from market-landscape.html -->
<style>
${styles}
:root {
  --paper-50:#EFEADB; --paper-100:#EFEADB; --surface-page:#EFEADB;
  --brass-400:#A5813C; --brass-500:#A5813C; --brass-600:#8A6D33; --accent:#A5813C;
}
.market-landscape-root { background:#EFEADB; overflow:hidden; }
.market-landscape-root > div { width:100% !important; max-width:100%; height:auto !important; transform-origin:top left; }
@media (max-width:900px){
  .market-landscape-root > div { transform:scale(0.72); width:138% !important; }
}
</style>
<div class="market-landscape-root">${html}</div>`;
writeFileSync('/Users/edka/www/Publius/pitch/market-landscape-embed.html', out);
await page.screenshot({ path: '/Users/edka/www/Publius/pitch/market-landscape-preview.png', fullPage: true });
console.log('wrote embed', out.length);
await browser.close();
