const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');
const assert = require('node:assert/strict');
const { pathToFileURL } = require('node:url');
const { chromium } = require(process.env.ADELA_PLAYWRIGHT_MODULE || 'playwright');
const root = path.resolve(__dirname, '..');
const output = path.join(root, 'doc/products-admin-screenshots');
fs.mkdirSync(output, { recursive: true });
const report = { date: '2026-11-03', status: 'failed', checks: [], layouts: [], errors: [] };
const server = http.createServer((req, res) => {
  if (new URL(req.url, 'http://localhost').pathname === '/favicon.ico') { res.writeHead(204).end(); return; }
  const file = path.resolve(root, '.' + decodeURIComponent(new URL(req.url, 'http://localhost').pathname));
  if (!file.startsWith(root + path.sep)) { res.writeHead(403).end(); return; }
  fs.readFile(file, (error, data) => {
    if (error) { res.writeHead(404).end(); return; }
    res.setHeader('Content-Type', { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.png': 'image/png' }[path.extname(file)] || 'application/octet-stream');
    res.end(data);
  });
});
async function check(name, fn) { await fn(); report.checks.push({ name, result: 'pass' }); console.log('PASS ' + name); }
async function ready(page) { await page.waitForFunction(() => document.getElementById('products-body').getAttribute('aria-busy') === 'false'); }
const records = page => page.evaluate(() => JSON.parse(localStorage.getItem('adela_products_data')));
async function fill(page, values) { for (const [key, value] of Object.entries(values)) await page.locator('#product-' + key).fill(String(value)); }
async function clearFilters(page) { await page.locator('#product-search').fill(''); await page.locator('#category-filter').selectOption(''); await page.locator('#stock-filter').selectOption(''); }
(async () => {
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const origin = 'http://127.0.0.1:' + server.address().port;
  const browser = await chromium.launch({ ...(process.env.ADELA_CHROME_PATH ? { executablePath: process.env.ADELA_CHROME_PATH } : { channel: 'chrome' }), headless: true });
  try {
    const context = await browser.newContext({ viewport: { width: 1440, height: 1050 } });
    const page = await context.newPage();
    page.on('pageerror', error => report.errors.push(error.message));
    page.on('console', msg => { if (msg.type() === 'error') report.errors.push(msg.text()); });
    page.on('response', response => { if (response.status() >= 400) report.errors.push(`${response.status()} ${response.url()}`); });
    await page.goto(origin + '/html/products-admin.html', { waitUntil: 'networkidle' }); await ready(page);
    const initial = await records(page);
    await check('Ten exact seed products, images, totals, SweetAlert2; no framework or jQuery', async () => {
      assert.equal(initial.length, 10); assert.equal(initial[0].price, 40000000); assert.equal(initial[9].stock, 2);
      assert.equal(initial.reduce((sum, p) => sum + p.stock, 0), 118);
      assert.equal(await page.locator('#products-body tr').count(), 5);
      assert.match(await page.locator('#inventory-summary').textContent(), /10.*118.*1/);
      assert.match(await page.evaluate(() => Swal.version), /^11\./);
      assert.equal(await page.evaluate(() => Boolean(window.jQuery || window.React || window.Vue)), false);
      assert.equal(await page.locator('.product-price').first().textContent(), '40.000.000₫');
      const thumbnails = await page.evaluate(() => [...document.querySelectorAll('.product-thumbnail')].map(i => ({ src: i.src, complete: i.complete, naturalWidth: i.naturalWidth, width: i.getBoundingClientRect().width, height: i.getBoundingClientRect().height })));
      assert.equal(thumbnails.every(i => i.complete && i.naturalWidth > 0 && i.width === 50 && i.height === 50), true, JSON.stringify(thumbnails));
      assert.deepEqual(await page.evaluate(() => { const ids = [...document.querySelectorAll('[id]')].map(e => e.id); return ids.filter((id, i) => ids.indexOf(id) !== i); }), []);
    });
    await check('Instant name/code search, accent-insensitive search, combined category/stock filters and empty state', async () => {
      await page.locator('#product-search').fill('ADL-SP03'); assert.equal(await page.locator('#products-body tr').count(), 1);
      assert.match(await page.locator('#products-body').textContent(), /JC76A/);
      await page.locator('#product-search').fill('ruou vang'); assert.match(await page.locator('#product-count').textContent(), /8/);
      await page.locator('#product-search').fill(''); await page.locator('#category-filter').selectOption('wine-cabinet'); await page.locator('#stock-filter').selectOption('low_stock');
      assert.equal(await page.locator('#products-body tr').count(), 2);
      await page.locator('#product-search').fill('không có sản phẩm này'); assert.match(await page.locator('#products-body').textContent(), /Không tìm thấy/);
      await clearFilters(page);
    });
    await check('Five rows per page, numeric and previous/next navigation', async () => {
      await page.getByRole('button', { name: 'Trang 2', exact: true }).click();
      assert.match(await page.locator('#products-body tr').first().textContent(), /ADL-SP06/);
      assert.equal(await page.getByRole('button', { name: 'Sau', exact: true }).isDisabled(), true);
      await page.getByRole('button', { name: 'Trước', exact: true }).click();
      assert.match(await page.locator('#products-body tr').first().textContent(), /ADL-SP01/);
    });
    await check('Responsive table scrolling, sidebar drawer/collapse, modal and screenshots', async () => {
      for (const width of [375, 430, 768, 1024, 1025, 1366, 1920]) {
        await page.setViewportSize({ width, height: 1000 }); await page.waitForTimeout(300);
        const layout = await page.evaluate(() => ({ width: innerWidth, scrollWidth: document.documentElement.scrollWidth, tableWidth: document.querySelector('.table-scroll').clientWidth, tableScrollWidth: document.querySelector('.table-scroll').scrollWidth }));
        report.layouts.push(layout); assert.equal(layout.scrollWidth, width); if (width < 1366) assert.ok(layout.tableScrollWidth > layout.tableWidth); else assert.equal(layout.tableScrollWidth, layout.tableWidth);
        await page.screenshot({ path: path.join(output, `products-${width}.png`), fullPage: true });
        if (width === 375 || width === 430) {
          await page.locator('#sidebar-toggle').click(); assert.equal(await page.locator('#admin-main').evaluate(e => e.inert), true);
          await page.keyboard.press('Escape'); assert.equal(await page.locator('#admin-main').evaluate(e => e.inert), false);
          await page.locator('#add-product').click();
          assert.equal(await page.locator('#product-modal').evaluate(e => e.scrollWidth <= e.clientWidth), true);
          await page.screenshot({ path: path.join(output, `modal-${width}.png`), fullPage: true });
          await page.keyboard.press('Escape'); assert.equal(await page.locator('#product-modal').isVisible(), false);
        }
      }
      await page.setViewportSize({ width: 1440, height: 1050 });
      await page.locator('#sidebar-toggle').click(); assert.equal(await page.locator('body').evaluate(e => e.classList.contains('sidebar-collapsed')), true); await page.locator('#sidebar-toggle').click();
    });
    await check('Form validation rejects short names, zero price, fractional stock and invalid old price', async () => {
      await page.locator('#add-product').click(); await fill(page, { name: 'abc', price: 0, stock: 1.5 }); await page.locator('#save-product').click();
      assert.equal(await page.locator('[aria-invalid="true"]').count(), 3); assert.equal((await records(page)).length, 10);
      await fill(page, { name: 'Sản phẩm kiểm thử', price: 1000000, stock: 6, originalPrice: 500000 }); await page.locator('#save-product').click();
      assert.match(await page.locator('#originalPrice-error').textContent(), /cao hơn/);
    });
    await check('Create, photo preview, success toast and persistence across reload', async () => {
      await fill(page, { originalPrice: 1500000 }); await page.locator('#product-category').selectOption('decanter'); await page.locator('#product-image').selectOption('../assets/images/accessory-2.png');
      assert.match(await page.locator('#image-preview').getAttribute('src'), /accessory-2/);
      await page.locator('#save-product').click(); assert.equal(await page.locator('#product-modal').isVisible(), false);
      assert.match(await page.locator('.swal2-toast').textContent(), /Đã thêm/);
      let saved = await records(page); assert.equal(saved.length, 11); assert.equal(saved[0].id, 'ADL-SP11'); assert.equal(saved[0].status, 'in_stock');
      await page.reload({ waitUntil: 'networkidle' }); await ready(page); saved = await records(page); assert.equal(saved[0].name, 'Sản phẩm kiểm thử');
    });
    await check('Edit preserves ID/date, updates price and all stock thresholds, safely renders HTML text', async () => {
      const created = (await records(page))[0];
      for (const [stock, status] of [[5, 'low_stock'], [0, 'out_of_stock'], [6, 'in_stock']]) {
        await page.locator('[data-id="ADL-SP11"] [data-action="edit"]').click();
        assert.equal(await page.locator('#product-name').inputValue(), stock === 5 ? 'Sản phẩm kiểm thử' : '<img src=x onerror=alert(1)>');
        await fill(page, { name: '<img src=x onerror=alert(1)>', stock, price: 1200000 }); await page.locator('#save-product').click();
        const edited = (await records(page)).find(p => p.id === created.id); assert.equal(edited.status, status); assert.equal(edited.createdAt, created.createdAt);
      }
      assert.equal(await page.locator('.product-name img').count(), 0);
    });
    await check('Deletion requires confirmation, cancel keeps data, delete last row clamps page', async () => {
      await page.locator('[data-id="ADL-SP11"] [data-action="delete"]').click(); await page.locator('.swal2-cancel').click(); assert.equal((await records(page)).length, 11);
      await page.getByRole('button', { name: 'Trang 3', exact: true }).click();
      await page.locator('#products-body [data-action="delete"]').click(); await page.locator('.swal2-confirm').click();
      assert.equal((await records(page)).length, 10); assert.match(await page.locator('#pagination [aria-current]').textContent(), /2/); assert.equal(await page.locator('#products-body tr').count(), 5);
    });
    await check('Two tabs refresh inventory and prevent stale form from overwriting changes', async () => {
      await page.getByRole('button', { name: 'Trang 1', exact: true }).click(); await page.locator('#products-body [data-action="edit"]').first().click();
      const other = await context.newPage(); await other.goto(origin + '/html/products-admin.html', { waitUntil: 'networkidle' }); await ready(other);
      await other.locator('#products-body [data-action="edit"]').first().click(); await fill(other, { stock: 23 }); await other.locator('#save-product').click();
      await page.waitForFunction(() => !document.getElementById('form-error').hidden); await fill(page, { stock: 44 }); await page.locator('#save-product').click();
      assert.match(await page.locator('#form-error').textContent(), /tab khác/); assert.equal((await records(page))[0].stock, 23);
      await page.locator('#modal-cancel').click(); await other.close();
    });
    await check('Storage write failure keeps form and existing data intact', async () => {
      const before = await records(page);
      await page.locator('#add-product').click(); await fill(page, { name: 'Không thể lưu', price: 1000, stock: 1 });
      await page.evaluate(() => { window.originalSetItem = Storage.prototype.setItem; Storage.prototype.setItem = function() { throw new DOMException('Full', 'QuotaExceededError'); }; });
      await page.locator('#save-product').click(); assert.match(await page.locator('#form-error').textContent(), /Không lưu được/); assert.deepEqual(await records(page), before);
      await page.evaluate(() => { Storage.prototype.setItem = window.originalSetItem; }); await page.locator('#modal-cancel').click();
    });
    await check('Empty storage array remains empty after reload; malformed data is preserved with error', async () => {
      await page.evaluate(() => localStorage.setItem('adela_products_data', '[]')); await page.reload({ waitUntil: 'networkidle' }); await ready(page);
      assert.match(await page.locator('#products-body').textContent(), /Kho sản phẩm đang trống/); assert.deepEqual(await records(page), []);
      await page.evaluate(() => localStorage.setItem('adela_products_data', '{broken')); await page.reload({ waitUntil: 'networkidle' }); await ready(page);
      assert.equal(await page.locator('#products-error').isVisible(), true); assert.equal(await page.locator('#add-product').isDisabled(), true);
      assert.equal(await page.evaluate(() => localStorage.getItem('adela_products_data')), '{broken');
      await page.evaluate(data => localStorage.setItem('adela_products_data', JSON.stringify(data)), initial); await page.reload({ waitUntil: 'networkidle' }); await ready(page);
    });
    await check('Dashboard, inventory and storefront links work with shared sidebar', async () => {
      await page.locator('.nav-item[href="dashboard.html"]').click(); await page.waitForFunction(() => document.getElementById('orders-body')?.getAttribute('aria-busy') === 'false');
      await page.locator('.nav-item[href="products-admin.html"]').click(); await ready(page);
      assert.equal(await page.locator('.nav-item[aria-current="page"]').getAttribute('href'), 'products-admin.html');
      await page.locator('.sidebar-bottom a[href="index.html"]').click(); await page.waitForURL('**/html/index.html');
    });
    await check('Direct file:// opening and operation without SweetAlert CDN', async () => {
      const offline = await browser.newContext(); await offline.route('https://**/*', route => route.abort());
      const local = await offline.newPage(); local.on('pageerror', error => report.errors.push(error.message));
      await local.goto(pathToFileURL(path.join(root, 'html/products-admin.html')).href); await ready(local);
      assert.equal(await local.locator('#products-body tr').count(), 5);
      await local.locator('#add-product').click(); await fill(local, { name: 'Sản phẩm offline', price: 2000, stock: 2 }); await local.locator('#save-product').click();
      assert.match(await local.locator('#fallback-toast').textContent(), /Đã thêm/);
      local.once('dialog', dialog => dialog.dismiss()); await local.locator('#products-body [data-action="delete"]').first().click(); assert.equal((await records(local)).length, 11);
      await offline.close();
    });
    assert.deepEqual(report.errors, []); report.status = 'passed';
  } catch (error) { report.failure = error.stack; console.error(error); process.exitCode = 1; }
  finally {
    fs.writeFileSync(path.join(root, 'doc/products-admin-validation.json'), JSON.stringify(report, null, 2));
    await browser.close(); await new Promise(resolve => server.close(resolve));
  }
})().catch(error => { console.error(error); server.close(); process.exitCode = 1; });
