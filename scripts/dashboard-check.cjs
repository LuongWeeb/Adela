// ADELA_PLAYWRIGHT_MODULE can point to an existing Playwright installation.
const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');
const assert = require('node:assert/strict');
const { chromium } = require(process.env.ADELA_PLAYWRIGHT_MODULE || 'playwright');
const root = path.resolve(__dirname, '..');
const out = path.join(root, 'doc/dashboard-screenshots');
fs.mkdirSync(out, { recursive: true });
const report = { date: '2026-11-03', status: 'failed', browser: 'Installed Chrome headless; real Chart.js and SweetAlert2 CDN', checks: [], layouts: [], errors: [], expectedErrors: [], cdn: [] };
let fixture = {};
let requests = [];
let failure = '';
let deliberateFailure = false;
const server = http.createServer((req, res) => {
  const url = new URL(req.url, 'http://localhost');
  if (url.pathname.startsWith('/test-api/')) {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      requests.push({ method: req.method, path: url.pathname, query: Object.fromEntries(url.searchParams), headers: req.headers, body });
      res.setHeader('Content-Type', 'application/json');
      if (failure === 'timeout') { setTimeout(() => { if (!res.destroyed) res.end('{}'); }, 200); return; }
      if (failure === 'invalid') { res.end('not-json'); return; }
      if (failure === 'schema') { res.end('{}'); return; }
      if (/^\d+$/.test(failure)) { res.writeHead(Number(failure)).end(JSON.stringify({ message: 'Fixture HTTP error' })); return; }
      if (req.method === 'DELETE') { res.writeHead(204).end(); return; }
      if (req.method === 'POST' || req.method === 'PUT') { res.writeHead(req.method === 'POST' ? 201 : 200).end(body); return; }
      res.end(JSON.stringify(url.pathname.endsWith('/dashboard') ? fixture.dashboard : fixture.orders));
    });
    return;
  }
  if (url.pathname === '/favicon.ico') { res.writeHead(204).end(); return; }
  const file = path.resolve(root, '.' + decodeURIComponent(url.pathname));
  if (!file.startsWith(root + path.sep)) { res.writeHead(403).end(); return; }
  fs.readFile(file, (error, data) => {
    if (error) { res.writeHead(404).end(); return; }
    res.setHeader('Content-Type', { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css' }[path.extname(file)] || 'application/octet-stream');
    res.end(data);
  });
});
function captureErrors(page) {
  const record = value => (deliberateFailure ? report.expectedErrors : report.errors).push(value);
  page.on('pageerror', error => report.errors.push({ type: 'pageerror', message: error.message }));
  page.on('console', message => { if (message.type() === 'error') record({ type: 'console', message: message.text() }); });
  page.on('requestfailed', request => record({ type: 'requestfailed', url: request.url(), message: request.failure().errorText }));
  page.on('response', response => {
    if (response.status() >= 400) record({ type: 'http', status: response.status(), url: response.url() });
    if (response.url().includes('cdn.jsdelivr.net')) report.cdn.push({ url: response.url(), status: response.status() });
  });
}
async function check(name, fn) { await fn(); report.checks.push({ name, result: 'pass' }); console.log('PASS ' + name); }
async function ready(page) { await page.waitForFunction(() => document.getElementById('orders-body')?.getAttribute('aria-busy') === 'false'); }
async function refresh(page) { await page.locator('#refresh-data').click(); await ready(page); }
(async () => {
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const origin = 'http://127.0.0.1:' + server.address().port;
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  try {
    const page = await browser.newPage({ viewport: { width: 1440, height: 1080 } }); captureErrors(page);
    await page.goto(origin + '/html/dashboard.html', { waitUntil: 'networkidle' }); await ready(page);
    await check('Real CDN libraries, KPI, charts, five orders and accessible data', async () => {
      assert.equal(await page.evaluate(() => Chart.version), '4.4.3');
      assert.match(await page.evaluate(() => Swal.version), /^11\./);
      assert.equal(await page.locator('#kpi-revenue').textContent(), '1.280.000.000₫');
      assert.equal(await page.locator('#orders-body tr').count(), 5);
      assert.equal(await page.locator('#category-legend li').count(), 4);
      assert.equal(await page.locator('#revenue-data tr').count(), 12);
      assert.deepEqual(await page.evaluate(() => ['revenue-chart', 'category-chart'].map(id => Chart.getChart(id).config.type)), ['line', 'doughnut']);
      assert.equal(await page.locator('#dashboard-error').isVisible(), false);
      assert.deepEqual(await page.evaluate(() => { const ids = [...document.querySelectorAll('[id]')].map(el => el.id); return ids.filter((id, i) => ids.indexOf(id) !== i); }), []);
      fixture = await page.evaluate(async () => ({ dashboard: await ApiService.get('/dashboard'), orders: await ApiService.get('/orders', { limit: 5 }) }));
    });
    await check('Revenue hover tooltip formats VND', async () => {
      const point = await page.evaluate(() => { const chart = Chart.getChart('revenue-chart'); const p = chart.getDatasetMeta(0).data[5]; const rect = chart.canvas.getBoundingClientRect(); return { x: rect.x + p.x, y: rect.y + p.y }; });
      await page.mouse.move(point.x, point.y); await page.waitForTimeout(150);
      assert.match(await page.evaluate(() => Chart.getChart('revenue-chart').tooltip.body[0].lines[0]), /1\.020\.000\.000/);
    });
    await check('Responsive layouts and desktop collapse', async () => {
      for (const width of [375, 430, 768, 1024, 1025, 1366, 1920]) {
        await page.setViewportSize({ width, height: 1000 }); await page.waitForTimeout(350);
        const layout = await page.evaluate(() => ({ width: innerWidth, scrollWidth: document.documentElement.scrollWidth, kpiClipped: [...document.querySelectorAll('.kpi-value')].some(el => el.scrollWidth > el.clientWidth), columns: getComputedStyle(document.querySelector('.kpi-grid')).gridTemplateColumns.split(' ').length, sidebarInert: document.getElementById('admin-sidebar').inert }));
        report.layouts.push(layout);
        assert.equal(layout.scrollWidth, width); assert.equal(layout.kpiClipped, false);
        assert.equal(layout.sidebarInert, width <= 1024);
        assert.equal(layout.columns, width < 600 ? 1 : width < 1366 ? 2 : 4);
        await page.screenshot({ path: path.join(out, `dashboard-${width}.png`), fullPage: true });
      }
      await page.locator('#sidebar-toggle').click();
      assert.equal(await page.locator('body').evaluate(el => el.classList.contains('sidebar-collapsed')), true);
      await page.locator('#sidebar-toggle').click();
    });
    await check('Mobile drawer: focus trap, Escape, overlay, navigation and breakpoint', async () => {
      await page.setViewportSize({ width: 375, height: 850 });
      await page.locator('#sidebar-toggle').click();
      assert.equal(await page.locator('#admin-main').evaluate(el => el.inert), true);
      assert.equal(await page.evaluate(() => document.activeElement.id), 'sidebar-close');
      await page.locator('#admin-sidebar a').last().focus(); await page.keyboard.press('Tab');
      assert.equal(await page.evaluate(() => document.activeElement.classList.contains('admin-brand')), true, JSON.stringify(await page.evaluate(() => ({ active: document.activeElement.outerHTML, open: document.body.className, inert: document.getElementById('admin-sidebar').inert }))));
      await page.keyboard.press('Shift+Tab');
      assert.equal(await page.evaluate(() => document.activeElement.getAttribute('href')), 'index.html');
      await page.keyboard.press('Escape');
      assert.equal(await page.evaluate(() => document.activeElement.id), 'sidebar-toggle');
      await page.locator('#sidebar-toggle').click();
      await page.locator('#sidebar-overlay').click({ position: { x: 350, y: 400 } });
      assert.equal(await page.locator('#admin-main').evaluate(el => el.inert), false);
      await page.locator('#sidebar-toggle').click(); await page.locator('.nav-item[href="#recent-orders"]').click();
      assert.equal(await page.locator('#sidebar-toggle').getAttribute('aria-expanded'), 'false');
      await page.locator('#sidebar-toggle').click(); await page.setViewportSize({ width: 1366, height: 1000 });
      assert.equal(await page.locator('#admin-main').evaluate(el => el.inert), false);
    });
    await check('Search, empty state, refresh and SweetAlert notification', async () => {
      await page.locator('#search-input').fill('Hoàng Nam'); assert.equal(await page.locator('#orders-body tr').count(), 1);
      assert.match(await page.locator('#orders-body').textContent(), /AD-1027/);
      await page.locator('#search-input').fill('no-such-order'); assert.match(await page.locator('#orders-body').textContent(), /Không tìm thấy/);
      await page.locator('#search-input').fill(''); await refresh(page); assert.equal(await page.locator('#orders-body tr').count(), 5);
      assert.equal(await page.locator('a[href="products-admin.html"]').count(), 1);
    });
    await check('Mock CRUD, query, immutable IDs, conflict/not-found and persistence', async () => {
      const result = await page.evaluate(async () => {
        await ApiService.post('/customers', { id: 'TEST-05', fullName: 'Khách kiểm thử', status: 'new' });
        const found = await ApiService.get('/customers', { q: 'KIỂM THỬ', status: 'new', page: 1, limit: 1 });
        const updated = await ApiService.put('/customers', 'TEST-05', { fullName: 'Đã cập nhật', id: 'tampered' });
        const statuses = [];
        try { await ApiService.post('/customers', { id: 'TEST-05' }); } catch (error) { statuses.push(error.status); }
        try { await ApiService.delete('/customers', 'missing'); } catch (error) { statuses.push(error.status); }
        return { found, updated, statuses };
      });
      assert.equal(result.found.total, 1); assert.equal(result.updated.id, 'TEST-05'); assert.deepEqual(result.statuses, [409, 404]);
      await page.reload({ waitUntil: 'networkidle' }); await ready(page);
      assert.equal(await page.evaluate(async () => (await ApiService.get('/customers/TEST-05')).fullName), 'Đã cập nhật');
      assert.equal(await page.evaluate(() => ApiService.delete('/customers', 'TEST-05')), null);
      assert.equal(await page.evaluate(async () => (await ApiService.get('/customers')).total), 0);
    });
    await check('REST API GET/POST/PUT/DELETE, query encoding, headers, 201 and 204', async () => {
      await page.evaluate(baseUrl => ApiService.configure({ baseUrl }), origin + '/test-api'); await refresh(page);
      assert.match(await page.locator('#connection-status').textContent(), /REST API/);
      assert.equal(await page.locator('#orders-body tr').count(), 5);
      requests = [];
      const result = await page.evaluate(async () => {
        await ApiService.get('/customers', { q: 'Hà & Nam', page: 2, limit: 5 });
        const created = await ApiService.post('/customers', { fullName: 'Thử nghiệm' });
        const updated = await ApiService.put('/customers', 'id with space', { fullName: 'Đổi tên' });
        const deleted = await ApiService.delete('/customers', 'id with space');
        return { created, updated, deleted };
      });
      assert.deepEqual(requests.map(req => req.method), ['GET', 'POST', 'PUT', 'DELETE']);
      assert.equal(requests[0].query.q, 'Hà & Nam'); assert.equal(requests[1].headers['content-type'], 'application/json');
      assert.equal(requests[2].path, '/test-api/customers/id%20with%20space');
      assert.equal(result.created.fullName, 'Thử nghiệm'); assert.equal(result.updated.fullName, 'Đổi tên'); assert.equal(result.deleted, null);
    });
    await check('HTTP 400/404/500 and invalid JSON reject without mutating mock data', async () => {
      deliberateFailure = true;
      const before = await page.evaluate(() => localStorage.getItem('adela_crm_customers'));
      for (const status of [400, 404, 500]) {
        failure = String(status);
        assert.equal(await page.evaluate(async () => { try { await ApiService.post('/customers', { id: 'SHOULD-NOT-EXIST' }); } catch (error) { return error.status; } }), status);
      }
      await refresh(page); assert.equal(await page.locator('#dashboard-error').isVisible(), true);
      assert.match(await page.locator('#dashboard-error').textContent(), /500/);
      assert.equal(await page.evaluate(() => localStorage.getItem('adela_crm_customers')), before);
      failure = 'invalid';
      assert.match(await page.evaluate(async () => { try { await ApiService.get('/dashboard'); } catch (error) { return error.message; } }), /JSON/);
      failure = 'schema'; await refresh(page); assert.equal(await page.locator('#dashboard-error').isVisible(), true);
      failure = ''; deliberateFailure = false;
    });
    await check('Network fallback, retry recovery and request timeout', async () => {
      deliberateFailure = true;
      await page.route('**/test-api/**', route => route.abort('failed'));
      await refresh(page); assert.match(await page.locator('#connection-status').textContent(), /LocalStorage Mock/);
      assert.equal(await page.locator('#orders-body tr').count(), 5);
      await page.unroute('**/test-api/**'); await refresh(page); assert.match(await page.locator('#connection-status').textContent(), /REST API/);
      failure = 'timeout'; await page.evaluate(() => ApiService.configure({ timeout: 30 }));
      await refresh(page); assert.match(await page.locator('#connection-status').textContent(), /LocalStorage Mock/);
      failure = ''; await page.evaluate(() => ApiService.configure({ baseUrl: '', timeout: 5000 })); await refresh(page);
      deliberateFailure = false;
    });
    await check('Corrupt storage recovery and safe rendering of untrusted order text', async () => {
      await page.evaluate(() => { localStorage.setItem('adela_orders_v1', '{broken'); localStorage.setItem('adela_dashboard_v1', '{}'); });
      await page.reload({ waitUntil: 'networkidle' }); await ready(page); assert.equal(await page.locator('#orders-body tr').count(), 5);
      await page.evaluate(() => ApiService.post('/orders', { id: 'XSS-TEST', customer: '<img src=x onerror=alert(1)>', product: '<script>evil()</script>', createdAt: '2026-11-03', total: 5000, status: 'pending' }));
      await refresh(page); assert.equal(await page.locator('#orders-body img, #orders-body script').count(), 0);
      assert.match(await page.locator('#orders-body').textContent(), /<img/);
      await page.evaluate(() => ApiService.delete('/orders', 'XSS-TEST')); await refresh(page);
    });
    await check('Storage disabled: memory fallback remains usable', async () => {
      const blocked = await browser.newPage(); captureErrors(blocked);
      await blocked.addInitScript(() => { Object.defineProperty(window, 'localStorage', { get() { throw new DOMException('Blocked', 'SecurityError'); } }); });
      await blocked.goto(origin + '/html/dashboard.html', { waitUntil: 'networkidle' }); await ready(blocked);
      assert.match(await blocked.locator('#connection-status').textContent(), /Chỉ lưu trong phiên/);
      assert.equal(await blocked.locator('#orders-body tr').count(), 5); await blocked.close();
    });
    await check('Missing Chart.js degrades to accessible data without runtime exception', async () => {
      const offline = await browser.newPage(); captureErrors(offline);
      await offline.route('**/chart.umd.min.js', route => route.fulfill({ status: 200, contentType: 'text/javascript', body: '' }));
      await offline.goto(origin + '/html/dashboard.html', { waitUntil: 'networkidle' }); await ready(offline);
      assert.match(await offline.locator('#dashboard-error').textContent(), /Không tải được Chart.js/);
      assert.equal(await offline.locator('#orders-body tr').count(), 5); await offline.close();
    });
    await check('Direct file opening', async () => {
      const file = await browser.newPage(); captureErrors(file);
      await file.goto('file:///' + path.join(root, 'html/dashboard.html').replace(/\\/g, '/'), { waitUntil: 'networkidle' }); await ready(file);
      assert.equal(await file.locator('#orders-body tr').count(), 5);
      assert.equal(await file.evaluate(() => Chart.getChart('category-chart').config.type), 'doughnut'); await file.close();
    });
    assert.deepEqual(report.errors, []);
    report.status = 'passed';
  } finally {
    await browser.close(); await new Promise(resolve => server.close(resolve));
    fs.writeFileSync(path.join(root, 'doc/dashboard-validation.json'), JSON.stringify(report, null, 2));
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
