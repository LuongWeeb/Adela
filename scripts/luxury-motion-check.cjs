// Optional QA: use an installed Playwright module via ADELA_PLAYWRIGHT_MODULE.
const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');
const assert = require('node:assert/strict');
const { chromium } = require(process.env.ADELA_PLAYWRIGHT_MODULE || 'playwright');
const root = path.resolve(__dirname, '..');
const output = path.join(root, 'doc/luxury-motion-check');
fs.mkdirSync(output, { recursive: true });
const report = { date: '2026-11-03', browser: 'Chrome, real CDN requests', checks: [], errors: [], status: 'failed' };
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
function pass(message) { report.checks.push(message); console.log('PASS ' + message); }
async function style(locator, property, pseudo = null) {
  return locator.evaluate((el, args) => getComputedStyle(el, args.pseudo).getPropertyValue(args.property), { property, pseudo });
}
(async () => {
  let browser;
  try {
    await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
    browser = await chromium.launch({ channel: 'chrome', headless: true });
    for (const name of ['index', 'product', 'about']) {
      const page = await browser.newPage({ viewport: { width: 1366, height: 900 } });
      page.on('pageerror', error => report.errors.push(name + ': ' + error.message));
      page.on('requestfailed', request => report.errors.push(name + ': ' + request.url() + ' ' + request.failure().errorText));
      await page.goto(`http://127.0.0.1:${server.address().port}/html/${name}.html`, { waitUntil: 'networkidle' });
      await page.evaluate(() => document.fonts.ready);
      const icons = await page.locator('i[class*="fa-"]').evaluateAll(elements => elements.map(el => {
        const css = getComputedStyle(el, '::before');
        return { classes: el.className, content: css.content, family: css.fontFamily, loaded: document.fonts.check(`${css.fontWeight} ${css.fontSize} ${css.fontFamily}`), width: el.getBoundingClientRect().width };
      }));
      assert.ok(icons.length > 20);
      assert.deepEqual(icons.filter(i => !i.loaded || !i.family.includes('Font Awesome 6') || ['none', 'normal', '""'].includes(i.content)), []);
      assert.equal(await page.locator('link[href*="animate.css/4.1.1"]').count(), 1);
      assert.equal(await style(page.locator('.hotline-link').first(), 'animation-name'), 'gold-pulse');
      await page.screenshot({ path: path.join(output, name + '-desktop.png') });
      pass(name + ': all icon glyphs/fonts loaded, Animate.css and hotline pulse');

      if (name === 'index' || name === 'product') {
        const card = page.locator('.product-card').first();
        await card.scrollIntoViewIfNeeded();
        await page.waitForTimeout(1100);
        assert.match(await style(card, 'transition-property'), /translate/);
        await card.hover();
        await page.waitForTimeout(600);
        assert.equal(await style(card, 'translate'), '0px -8px');
        assert.equal(await style(card.locator('img'), 'transform'), 'matrix(1.06, 0, 0, 1.06, 0, 0)');
        assert.equal(await style(card.locator('.card-quick-view'), 'opacity'), '1');
        assert.match(await style(card, 'box-shadow'), /16px 32px/);
        await page.screenshot({ path: path.join(output, name + '-card-hover.png') });
        pass(name + ': card elevation, zoom, shadow and quick-view reveal');
      }
      if (name === 'index') {
        await page.locator('.values').scrollIntoViewIfNeeded();
        await page.waitForTimeout(1000);
        assert.equal(await style(page.locator('.values i').first(), 'color'), 'rgb(201, 168, 76)');
        await page.screenshot({ path: path.join(output, 'index-values.png') });
        const category = page.locator('.category-grid a').first();
        await category.scrollIntoViewIfNeeded();
        await page.waitForTimeout(1100);
        await category.hover();
        await page.waitForTimeout(450);
        assert.equal(await style(category.locator('img'), 'border-top-color'), 'rgb(201, 168, 76)');
        assert.notEqual(await style(category.locator('img'), 'transform'), 'none');
        assert.equal(await style(page.locator('.stars').first(), 'color'), 'rgb(201, 168, 76)');
        await page.screenshot({ path: path.join(output, 'index-category-hover.png') });
        pass('index: gold category border/rotation and rating color');
      }
      if (name === 'about') {
        await page.locator('.policy-grid').scrollIntoViewIfNeeded();
        await page.waitForTimeout(1000);
        await page.screenshot({ path: path.join(output, 'about-policies.png') });
      }
      const cta = page.locator('.btn-buy, .button').first();
      await cta.hover();
      assert.equal(await style(cta, 'animation-name', '::before'), 'shimmer');
      await page.waitForTimeout(300);
      await page.screenshot({ path: path.join(output, name + '-shimmer.png') });
      await page.evaluate(() => window.scrollTo(0, 700));
      await page.waitForTimeout(450);
      await page.locator('#back-to-top').hover();
      assert.equal(await style(page.locator('#back-to-top i'), 'animation-name'), 'bounce-up');
      pass(name + ': CTA shimmer and back-to-top bounce');

      if (name === 'product') {
        await page.locator('[data-quantity="increase"]').click();
        assert.equal(await page.locator('#product-qty').inputValue(), '2');
        await page.locator('[data-quantity="decrease"]').click();
        assert.equal(await page.locator('#product-qty').inputValue(), '1');
        await page.locator('.faq-question').first().click();
        assert.equal(await page.locator('.faq-question .fa-minus').count(), 1);
        await page.locator('.faq-question').nth(1).click();
        assert.equal(await page.locator('.faq-question').first().locator('.fa-plus').count(), 1);
        await page.locator('label[for="rating-4"]').click();
        await page.locator('#review-name').fill('Nguyễn An');
        await page.locator('#review-content').fill('Sản phẩm đẹp và chất lượng tốt.');
        await page.locator('.btn-post-comment').click();
        await page.locator('.comment-local').waitFor();
        assert.equal(await page.locator('.comment-local .fa-solid.fa-star').count(), 4);
        assert.equal(await page.locator('.comment-local .fa-regular.fa-star').count(), 1);
        pass('product: quantity controls, FAQ icon toggles and new review icons');
      }
      for (const width of [375, 768, 1366]) {
        await page.setViewportSize({ width, height: 900 });
        await page.waitForTimeout(350);
        assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
        if (width === 375) {
          await page.evaluate(() => window.scrollTo(0, 0));
          await page.waitForTimeout(400);
          await page.screenshot({ path: path.join(output, name + '-mobile.png') });
          await page.locator('#hamburger-btn').click();
          await page.locator('#nav-close-btn').click();
          assert.equal(await page.locator('#hamburger-btn').getAttribute('aria-expanded'), 'false');
        }
      }
      pass(name + ': no overflow at 375/768/1366px; mobile menu icons work');
      await page.emulateMedia({ reducedMotion: 'reduce' });
      assert.equal(await style(page.locator('.hotline-link').first(), 'animation-name'), 'none');
      await cta.hover();
      assert.equal(await style(cta, 'animation-name', '::before'), 'none');
      if (name !== 'about') {
        const card = page.locator('.product-card').first();
        await card.hover();
        assert.equal(await style(card, 'translate'), 'none');
        assert.equal(await style(card.locator('.card-quick-view'), 'opacity'), '1');
      }
      pass(name + ': reduced-motion disables motion and keeps actions visible');
      await page.close();
    }
    assert.deepEqual(report.errors, []);
    report.status = 'passed';
  } catch (error) {
    report.failure = error.stack;
    process.exitCode = 1;
    console.error(error);
  } finally {
    fs.writeFileSync(path.join(output, 'report.json'), JSON.stringify(report, null, 2));
    if (browser) await browser.close();
    server.close();
  }
})();
