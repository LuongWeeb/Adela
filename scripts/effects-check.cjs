// Run with Playwright installed, or set ADELA_PLAYWRIGHT_MODULE to an existing module.
const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');
const assert = require('node:assert/strict');
const { pathToFileURL } = require('node:url');
const { chromium } = require(process.env.ADELA_PLAYWRIGHT_MODULE || 'playwright');
const root = path.resolve(__dirname, '..');
const output = path.join(root, 'doc', 'effects-check');
fs.mkdirSync(output, { recursive: true });
const report = { date: '2026-11-03', browser: 'Installed Chrome, headless, actual CDN requests', status: 'failed', checks: [], errors: [] };
const server = http.createServer((req, res) => {
  const pathname = new URL(req.url, 'http://localhost').pathname;
  if (pathname === '/favicon.ico') return res.writeHead(204).end();
  const file = path.resolve(root, '.' + decodeURIComponent(pathname));
  if (!file.startsWith(root + path.sep)) return res.writeHead(403).end();
  fs.readFile(file, (error, data) => {
    if (error) return res.writeHead(404).end();
    res.setHeader('Content-Type', { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'application/javascript', '.png': 'image/png' }[path.extname(file)] || 'application/octet-stream');
    res.end(data);
  });
});
function pass(name) { report.checks.push(name); console.log('PASS ' + name); }
function observe(page, name) {
  page.on('pageerror', error => report.errors.push({ page: name, error: error.message }));
  page.on('console', message => { if (message.type() === 'error') report.errors.push({ page: name, error: message.text() }); });
  page.on('requestfailed', request => report.errors.push({ page: name, url: request.url(), error: request.failure().errorText }));
}
async function idle(page) { await page.waitForFunction(() => !jQuery(':animated').length); }
async function scroll(page, y) {
  await page.evaluate(y => window.scrollTo(0, y), y);
  await page.waitForTimeout(450);
}
(async () => {
  let browser;
  try {
    await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
    const origin = 'http://127.0.0.1:' + server.address().port;
    browser = await chromium.launch({ channel: 'chrome', headless: true });
    for (const name of ['index', 'about', 'product']) {
      const page = await browser.newPage({ viewport: { width: 1366, height: 900 } });
      observe(page, name);
      await page.goto(origin + '/html/' + name + '.html', { waitUntil: 'networkidle' });
      assert.equal(await page.evaluate(() => jQuery.fn.jquery), '3.7.1');
      assert.equal(await page.evaluate(() => typeof lightbox.start), 'function');
      assert.equal(await page.evaluate(() => typeof AOS.init), 'function');
      assert.equal(await page.locator('#back-to-top').count(), 1);
      assert.equal(await page.locator('#back-to-top').isVisible(), false);
      assert.equal(await page.evaluate(() => {
        const ids = [...document.querySelectorAll('[id]')].map(el => el.id);
        return ids.length === new Set(ids).size;
      }), true);
      pass(name + ': libraries, unique IDs and initial hidden button');
      await scroll(page, 101);
      assert.equal(await page.locator('.site-header').evaluate(el => el.classList.contains('is-sticky')), true);
      assert.equal(await page.locator('#back-to-top').isVisible(), false);
      await scroll(page, 650);
      assert.equal(await page.locator('#back-to-top').isVisible(), true);
      assert.ok(Math.abs(await page.locator('.site-header').evaluate(el => el.getBoundingClientRect().top)) < 2);
      await page.locator('#back-to-top').click();
      await idle(page);
      assert.equal(await page.evaluate(() => window.scrollY), 0);
      assert.equal(await page.locator('.site-header').evaluate(el => el.classList.contains('is-sticky')), false);
      assert.equal(await page.locator('#back-to-top').isVisible(), false);
      pass(name + ': sticky threshold, fixed position, fade and animated scroll to zero');

      const reveal = page.locator('[data-aos]').last();
      await reveal.scrollIntoViewIfNeeded();
      await page.waitForTimeout(1000);
      assert.equal(await reveal.evaluate(el => el.classList.contains('aos-animate')), true);
      pass(name + ': scroll reveal initialized and triggered');
      for (const width of [375, 768, 1366]) {
        await page.setViewportSize({ width, height: 900 });
        await page.waitForTimeout(400);
        assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
      }
      pass(name + ': no horizontal overflow at 375, 768, 1366px');
      await page.setViewportSize({ width: 375, height: 900 });
      await scroll(page, 500);
      await page.locator('#hamburger-btn').click();
      assert.equal(await page.locator('#hamburger-btn').getAttribute('aria-expanded'), 'true');
      await page.keyboard.press('Escape');
      assert.equal(await page.locator('#hamburger-btn').getAttribute('aria-expanded'), 'false');
      pass(name + ': mobile menu still works while header is sticky');
      await page.setViewportSize({ width: 1366, height: 900 });

      if (name === 'product') {
        await scroll(page, 0);
        assert.equal(await page.locator('[data-lightbox="cigar-gallery"]').count(), 5);
        await page.locator('.main-image a').click();
        await page.waitForFunction(() => $('.lb-image').is(':visible') && document.querySelector('.lb-image').naturalWidth > 0);
        await idle(page);
        assert.match(await page.locator('.lb-image').getAttribute('src'), /main-product.png$/);
        await page.screenshot({ path: path.join(output, 'product-lightbox-desktop.png') });
        await page.locator('.lb-next').click();
        await idle(page);
        assert.match(await page.locator('.lb-image').getAttribute('src'), /thumb-1.png$/);
        await page.keyboard.press('Escape');
        await idle(page);
        assert.equal(await page.locator('#lightbox').isVisible(), false);
        await page.locator('.thumbnail-item').nth(2).click();
        await idle(page);
        await page.waitForFunction(() => document.querySelector('#main-img').src.endsWith('thumb-3.png'));
        assert.match(await page.locator('.lb-image').getAttribute('src'), /thumb-3.png$/);
        await page.keyboard.press('Escape');
        await idle(page);
        await page.locator('.main-image a').click();
        await idle(page);
        assert.match(await page.locator('.lb-image').getAttribute('src'), /thumb-3.png$/);
        await page.keyboard.press('Escape');
        await idle(page);
        pass('product: main image, thumbnail, gallery navigation, Escape and synchronized preview');

        await page.locator('#tab-specifications').click();
        await idle(page);
        assert.equal(await page.locator('.tab-pane:visible').count(), 1);
        assert.equal(await page.locator('#pane-specifications').isVisible(), true);
        await page.keyboard.press('ArrowRight');
        await idle(page);
        assert.equal(await page.locator('#pane-warranty').isVisible(), true);
        await page.keyboard.press('Home');
        await idle(page);
        assert.equal(await page.locator('#pane-technology').isVisible(), true);
        await page.evaluate(() => {
          for (let i = 0; i < 15; i++) document.querySelectorAll('.tab-btn')[i % 3].click();
        });
        await idle(page);
        assert.equal(await page.locator('.tab-pane:visible').count(), 1);
        assert.equal(await page.locator('#pane-warranty').isVisible(), true);
        pass('product: tab fades, keyboard navigation and rapid switching');

        await page.locator('#faq-question-1').click();
        await idle(page);
        assert.equal(await page.locator('#faq-question-1').getAttribute('aria-expanded'), 'true');
        assert.equal(await page.locator('#faq-question-1 .faq-icon').textContent(), '−');
        await page.locator('#faq-question-2').click();
        await idle(page);
        assert.equal(await page.locator('.faq-answer:visible').count(), 1);
        assert.equal(await page.locator('#faq-question-1').getAttribute('aria-expanded'), 'false');
        await page.locator('#faq-question-2').click();
        await idle(page);
        assert.equal(await page.locator('.faq-answer:visible').count(), 0);
        await page.evaluate(() => {
          for (let i = 0; i < 9; i++) document.querySelector('#faq-question-3').click();
        });
        await idle(page);
        assert.equal(await page.locator('.faq-answer:visible').count(), 1);
        assert.equal(await page.locator('#faq-question-3').getAttribute('aria-expanded'), 'true');
        pass('product: accordion toggle, exclusive opening, icons and rapid clicks');
        await page.locator('#thong-tin').scrollIntoViewIfNeeded();
        await page.waitForTimeout(1000);
        await page.screenshot({ path: path.join(output, 'product-tabs-faq-desktop.png') });
        await page.setViewportSize({ width: 375, height: 900 });
        await page.locator('.faq-section').scrollIntoViewIfNeeded();
        await page.waitForTimeout(1000);
        await page.screenshot({ path: path.join(output, 'product-faq-mobile.png') });
        await page.locator('#tab-specifications').click();
        await idle(page);
        assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
        await page.screenshot({ path: path.join(output, 'product-tabs-mobile.png') });
        pass('product: mobile tabs and FAQ layout');
        await scroll(page, 0);
        await page.locator('.main-image a').click();
        await idle(page);
        assert.equal(await page.locator('#lightbox').isVisible(), true);
        assert.ok(await page.locator('.lb-image').evaluate(el => el.getBoundingClientRect().right <= innerWidth));
        await page.screenshot({ path: path.join(output, 'product-lightbox-mobile.png') });
        await page.keyboard.press('Escape');
        await idle(page);
        pass('product: mobile Lightbox fits viewport and closes');
      }
      await page.close();
    }
    const reduced = await browser.newPage({ reducedMotion: 'reduce', viewport: { width: 375, height: 900 } });
    observe(reduced, 'reduced-motion/file');
    await reduced.goto(pathToFileURL(path.join(root, 'html/product.html')).href, { waitUntil: 'networkidle' });
    await reduced.locator('#tab-warranty').click();
    assert.equal(await reduced.locator('#pane-warranty').isVisible(), true);
    await reduced.locator('#faq-question-1').click();
    assert.equal(await reduced.locator('#faq-answer-1').isVisible(), true);
    await reduced.locator('#back-to-top').click();
    assert.equal(await reduced.evaluate(() => window.scrollY), 0);
    pass('product: file:// loading and reduced-motion interactions');
    assert.deepEqual(report.errors, []);
    pass('all pages: no console errors, JavaScript errors or failed network requests');
    report.status = 'passed';
  } catch (error) {
    report.failure = error.stack;
    console.error(error);
    process.exitCode = 1;
  } finally {
    if (browser) await browser.close();
    server.close();
    fs.writeFileSync(path.join(output, 'report.json'), JSON.stringify(report, null, 2));
  }
})();
