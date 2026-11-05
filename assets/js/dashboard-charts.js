(() => {
  'use strict';

  const money = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 });
  const number = new Intl.NumberFormat('vi-VN', { maximumFractionDigits: 1 });
  const byId = id => document.getElementById(id);
  const setText = (id, value) => { byId(id).textContent = value; };
  let orders = [];
  let charts = [];
  let loading = false;

  function notify(title, text) {
    if (window.Swal) return window.Swal.fire({ title, text, icon: 'info', confirmButtonText: 'Đã hiểu', confirmButtonColor: '#052352' });
    window.alert(`${title}\n${text}`);
  }


  function showStatus(state) {
    const status = byId('connection-status');
    status.dataset.mode = state.mode;
    status.textContent = state.mode === 'api' ? 'Đang kết nối REST API' : state.mode === 'error' ? 'Không tải được dữ liệu · Hãy thử làm mới' : state.storage === 'memory' ? 'Dữ liệu mẫu · Chỉ lưu trong phiên này' : 'Đang dùng LocalStorage Mock';
    status.title = state.reason === 'network' ? 'API không phản hồi hoặc bị chặn CORS. Đang sử dụng dữ liệu mẫu riêng biệt.' : '';
    setText('table-footer', state.mode === 'api' ? 'Dữ liệu được tải từ hệ thống REST API.' : state.storage === 'memory' ? 'Trình duyệt không cho phép lưu dữ liệu. Thay đổi mẫu sẽ mất khi tải lại trang.' : 'Dữ liệu minh họa phục vụ đào tạo. Không phải giao dịch thực tế.');
  }

  function renderDashboard(data, isMock) {
    if (!window.ApiService.validateDashboard(data)) throw new Error('Dữ liệu dashboard không đúng cấu trúc. Vui lòng kiểm tra API.');
    const k = data.kpis;
    setText('kpi-revenue', money.format(k.revenue).replace(/\s/g, ''));
    setText('kpi-orders', number.format(k.orders));
    setText('kpi-customers', number.format(k.customers));
    setText('kpi-inventory', number.format(k.inventory));
    setText('kpi-growth', `${k.revenueGrowth > 0 ? '+' : ''}${number.format(k.revenueGrowth)}%`);
    setText('kpi-customer-growth', `${k.customerGrowth > 0 ? '+' : ''}${number.format(k.customerGrowth)}%`);
    setText('kpi-delivered', `${number.format(k.deliveredRate)}%`);
    setText('kpi-stock-note', `Cần nhập thêm ${k.restockModels} mẫu`);
    setText('report-period', `${isMock ? 'Báo cáo mẫu' : 'Báo cáo'} · ${data.period}`);
    setText('chart-year', data.year);
    setText('annual-revenue', `${new Intl.NumberFormat('vi-VN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(data.revenue.reduce((sum, value) => sum + value, 0) / 1000)} tỷ ₫`);
    const rows = data.revenue.map((value, index) => {
      const row = document.createElement('tr');
      const month = document.createElement('th'); month.scope = 'row'; month.textContent = `Tháng ${index + 1}`;
      const amount = document.createElement('td'); amount.textContent = money.format(value * 1000000);
      row.append(month, amount); return row;
    });
    byId('revenue-data').replaceChildren(...rows);
    const total = data.categories.reduce((sum, item) => sum + item.value, 0);
    byId('category-legend').replaceChildren(...data.categories.map((item, index) => {
      const li = document.createElement('li');
      const dot = document.createElement('span'); dot.className = `legend-dot category-${index}`; dot.setAttribute('aria-hidden', 'true');
      const label = document.createElement('span'); label.textContent = item.label;
      const value = document.createElement('strong'); value.textContent = `${number.format(item.value / total * 100)}%`;
      li.append(dot, label, value); return li;
    }));
    renderCharts(data);
  }

  function renderCharts(data) {
    charts.forEach(chart => chart.destroy()); charts = [];
    if (!window.Chart) {
      byId('dashboard-error').hidden = false;
      setText('dashboard-error', 'Không tải được Chart.js. Bạn vẫn có thể xem bảng số liệu doanh thu và tỷ lệ sản phẩm. Hãy kiểm tra kết nối mạng rồi tải lại trang.');
      return;
    }
    const palette = getComputedStyle(document.body);
    const navy = palette.getPropertyValue('--dashboard-navy').trim();
    const gold = palette.getPropertyValue('--dashboard-gold').trim();
    const red = palette.getPropertyValue('--dashboard-red').trim();
    const animation = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? false : { duration: 650 };
    const tooltip = { backgroundColor: navy, padding: 12, cornerRadius: 6, titleFont: { family: 'Roboto', size: 12 }, bodyFont: { family: 'Roboto', size: 12 }, displayColors: false };
    charts.push(new window.Chart(byId('revenue-chart'), {
      type: 'line',
      data: { labels: data.revenue.map((_, index) => `Tháng ${index + 1}`), datasets: [{
        label: 'Doanh thu', data: data.revenue, borderColor: gold, borderWidth: 3, tension: .35, fill: true,
        pointRadius: 3, pointHoverRadius: 6, pointBackgroundColor: 'white', pointBorderColor: gold,
        backgroundColor(context) {
          const { ctx, chartArea } = context.chart;
          if (!chartArea) return 'transparent';
          const gradient = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
          gradient.addColorStop(0, `${navy}45`); gradient.addColorStop(1, `${navy}02`); return gradient;
        }
      }] },
      options: {
        responsive: true, maintainAspectRatio: false, animation,
        interaction: { intersect: false, mode: 'index' },
        plugins: { legend: { display: false }, tooltip: { ...tooltip, callbacks: { label: context => `Doanh thu: ${money.format(context.parsed.y * 1000000)}` } } },
        scales: {
          x: { grid: { display: false }, border: { display: false }, ticks: { color: '#8490a2', font: { size: 10 }, maxRotation: 0, callback: (_, index) => `T${index + 1}` } },
          y: { beginAtZero: true, border: { display: false }, grid: { color: '#eef1f6' }, ticks: { color: '#8490a2', font: { size: 10 }, maxTicksLimit: 5, callback: value => `${number.format(value)} tr` } }
        }
      }
    }));
    charts.push(new window.Chart(byId('category-chart'), {
      type: 'doughnut',
      data: { labels: data.categories.map(item => item.label), datasets: [{ data: data.categories.map(item => item.value), backgroundColor: [navy, red, gold, '#4b5563'], borderColor: 'white', borderWidth: 4, hoverOffset: 5, borderRadius: 3 }] },
      options: { responsive: true, maintainAspectRatio: false, animation, cutout: '76%', layout: { padding: 6 }, plugins: { legend: { display: false }, tooltip: { ...tooltip, callbacks: { label: context => `${context.label}: ${number.format(context.parsed / data.categories.reduce((sum, item) => sum + item.value, 0) * 100)}%` } } } }
    }));
  }

  function tableMessage(message, busy = false) {
    const row = document.createElement('tr'); const cell = document.createElement('td');
    cell.colSpan = 6; cell.className = 'table-message';
    if (busy) { const spinner = document.createElement('span'); spinner.className = 'loading-spinner'; spinner.setAttribute('aria-hidden', 'true'); cell.append(spinner, ' '); }
    cell.append(document.createTextNode(message)); row.append(cell); byId('orders-body').replaceChildren(row);
  }

  function renderOrders() {
    const q = byId('search-input').value.trim().toLocaleLowerCase('vi');
    const filtered = orders.filter(order => [order.id, order.customer, order.product].some(value => String(value).toLocaleLowerCase('vi').includes(q)));
    setText('order-count', `${filtered.length} / ${orders.length} đơn hàng`);
    if (!filtered.length) { tableMessage(q ? 'Không tìm thấy đơn hàng phù hợp trong các giao dịch gần đây.' : 'Chưa có giao dịch nào.'); return; }
    const statuses = { delivered: 'Đã giao', processing: 'Đang xử lý', pending: 'Chờ duyệt' };
    byId('orders-body').replaceChildren(...filtered.map(order => {
      const row = document.createElement('tr');
      const customer = document.createElement('div'); customer.className = 'customer-cell';
      const avatar = document.createElement('span'); avatar.className = 'avatar'; avatar.setAttribute('aria-hidden', 'true'); avatar.textContent = order.customer.trim().split(/\s+/).slice(-2).map(word => word[0] || '').join('');
      const name = document.createElement('span'); name.textContent = order.customer; customer.append(avatar, name);
      const badge = document.createElement('span'); badge.className = `status-badge ${Object.hasOwn(statuses, order.status) ? order.status : 'unknown'}`; badge.textContent = statuses[order.status] || 'Chưa xác định';
      const values = [order.id, customer, order.product, new Intl.DateTimeFormat('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' }).format(new Date(order.createdAt)), money.format(order.total), badge];
      values.forEach(value => { const cell = document.createElement('td'); if (value instanceof Node) cell.append(value); else cell.textContent = value; row.append(cell); });
      return row;
    }));
  }

  async function loadData() {
    if (loading) return;
    loading = true;
    byId('refresh-data').disabled = true;
    byId('orders-body').setAttribute('aria-busy', 'true');
    byId('dashboard-error').hidden = true;
    setText('order-count', 'Đang tải…');
    tableMessage('Đang tải giao dịch…', true);
    try {
      const service = window.ApiService;
      // Tuần tự để lỗi mạng đầu tiên chuyển cả đợt tải sang cùng nguồn dữ liệu.
      let dashboard = await service.get('/dashboard');
      let dashboardMode = service.getStatus().mode;
      const result = await service.get('/orders', { limit: 5 });
      if (dashboardMode !== service.getStatus().mode) {
        dashboard = await service.get('/dashboard'); dashboardMode = service.getStatus().mode;
      }
      const items = Array.isArray(result) ? result : result?.items;
      if (!Array.isArray(items) || !items.every(order => order && typeof order.id === 'string' && typeof order.customer === 'string' && typeof order.product === 'string' && Number.isFinite(order.total) && !Number.isNaN(Date.parse(order.createdAt)))) throw new Error('Danh sách đơn hàng không đúng cấu trúc.');
      orders = [...items].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5);
      renderDashboard(dashboard, dashboardMode === 'mock');
      renderOrders();
      showStatus(service.getStatus());
    } catch (error) {
      orders = [];
      byId('dashboard-error').hidden = false;
      setText('dashboard-error', `${error.message} Nhấn “Làm mới dữ liệu” để thử lại. Các chỉ số đang hiển thị chưa được cập nhật.`);
      tableMessage('Không tải được giao dịch. Vui lòng thử lại.');
      setText('order-count', 'Chưa tải được');
      showStatus({ mode: 'error' });
    } finally {
      loading = false;
      byId('orders-body').setAttribute('aria-busy', 'false');
      byId('refresh-data').disabled = false;
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    window.addEventListener('adela:api-status', event => showStatus(event.detail));
    byId('search-input').addEventListener('input', () => { if (!loading) renderOrders(); });
    byId('order-search').addEventListener('submit', event => { event.preventDefault(); if (!loading) renderOrders(); byId('recent-orders').scrollIntoView({ behavior: 'smooth', block: 'start' }); });
    byId('refresh-data').addEventListener('click', () => { window.ApiService.retry(); loadData(); });
    document.querySelectorAll('[data-notice]').forEach(button => button.addEventListener('click', () => {
      const notices = {
        settings: ['Cài đặt quản trị', 'Dashboard đang ở phiên bản thực hành Ngày 6. Chưa có chức năng cấu hình tài khoản.'],
        notifications: ['Thông báo', 'Đây là bản thực hành. Thông báo vận hành chưa được kết nối với máy chủ.']
      };
      notify(...notices[button.dataset.notice]);
    }));
    loadData();
  });
})();
