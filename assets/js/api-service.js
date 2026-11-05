(() => {
  'use strict';

  const clone = value => JSON.parse(JSON.stringify(value));
  const seed = {
    dashboard: {
      period: 'Tháng 12/2025', year: 2025,
      kpis: { revenue: 1280000000, revenueGrowth: 12.5, orders: 148, deliveredRate: 85, customers: 326, customerGrowth: 18, inventory: 42, restockModels: 3 },
      revenue: [620, 710, 780, 840, 920, 1020, 960, 1080, 1190, 1320, 1380, 1280],
      categories: [
        { label: 'Tủ rượu vang', value: 45 }, { label: 'Tủ cigar', value: 30 },
        { label: 'Ly rượu vang', value: 15 }, { label: 'Decanter & Phụ kiện', value: 10 }
      ]
    },
    orders: [
      { id: 'AD-1028', customer: 'Nguyễn Minh Anh', product: 'Tủ rượu Adela 168 chai', createdAt: '2025-12-28T09:45:00+07:00', total: 68500000, status: 'delivered' },
      { id: 'AD-1027', customer: 'Trần Hoàng Nam', product: 'Tủ cigar GF 2180', createdAt: '2025-12-28T08:30:00+07:00', total: 80000000, status: 'processing' },
      { id: 'AD-1026', customer: 'Lê Thu Hà', product: 'Bộ ly rượu vang pha lê', createdAt: '2025-12-27T14:20:00+07:00', total: 4800000, status: 'delivered' },
      { id: 'AD-1025', customer: 'Phạm Đức Long', product: 'Tủ rượu Adela 46 chai', createdAt: '2025-12-27T10:15:00+07:00', total: 32500000, status: 'pending' },
      { id: 'AD-1024', customer: 'Vũ Bảo Ngọc', product: 'Decanter pha lê cao cấp', createdAt: '2025-12-26T16:40:00+07:00', total: 3200000, status: 'delivered' }
    ],
    customers: []
  };
  const keys = { dashboard: 'adela_dashboard_v1', orders: 'adela_orders_v1', customers: 'adela_crm_customers' };
  const memory = new Map();
  let persistent = true;
  let config = { baseUrl: document.querySelector('meta[name="adela-api-base-url"]')?.content.trim().replace(/\/+$/, '') || '', timeout: 5000, retryDelay: 30000 };
  let retryAt = 0;
  let state = { mode: 'mock', storage: 'localStorage', reason: 'unconfigured' };

  class ApiError extends Error {
    constructor(message, status = 0, details = null) {
      super(message);
      this.name = 'ApiError';
      this.status = status;
      this.details = details;
    }
  }

  function setState(mode, reason = '') {
    state = { mode, reason, storage: persistent ? 'localStorage' : 'memory' };
    window.dispatchEvent(new CustomEvent('adela:api-status', { detail: { ...state } }));
  }

  function read(resource) {
    let value = memory.get(resource);
    if (persistent) {
      try {
        const raw = localStorage.getItem(keys[resource]);
        if (raw !== null) {
          const parsed = JSON.parse(raw);
          if (resource === 'dashboard' ? validDashboard(parsed) : Array.isArray(parsed) && parsed.every(row => row && typeof row === 'object' && row.id != null)) value = parsed;
        }
      } catch (error) {
        // JSON hỏng được phục hồi bằng seed; storage bị chặn dùng bộ nhớ phiên.
        if (!(error instanceof SyntaxError)) persistent = false;
      }
    }
    if (value === undefined) value = clone(seed[resource]);
    write(resource, value);
    return clone(value);
  }

  function write(resource, value) {
    memory.set(resource, clone(value));
    if (persistent) {
      try { localStorage.setItem(keys[resource], JSON.stringify(value)); }
      catch { persistent = false; }
    }
  }

  function validDashboard(value) {
    return value && Number.isInteger(value.year) && typeof value.period === 'string' &&
      value.kpis && Object.keys(seed.dashboard.kpis).every(key => Number.isFinite(value.kpis[key])) &&
      Array.isArray(value.revenue) && value.revenue.length === 12 && value.revenue.every(item => Number.isFinite(item) && item >= 0) &&
      Array.isArray(value.categories) && value.categories.length === 4 && value.categories.every(item => item && typeof item.label === 'string' && Number.isFinite(item.value) && item.value >= 0) &&
      value.categories.reduce((sum, item) => sum + item.value, 0) > 0;
  }

  function parseEndpoint(endpoint, params = {}) {
    if (typeof endpoint !== 'string' || !/^\/?[a-zA-Z0-9_-]+(?:\/[^/?#]+)?(?:\?[^#]*)?$/.test(endpoint)) throw new ApiError('Endpoint không hợp lệ.', 400);
    const url = new URL(endpoint.replace(/^\//, ''), 'https://mock.invalid/');
    Object.entries(params).forEach(([key, value]) => { if (value != null) url.searchParams.set(key, String(value)); });
    const [resource, id] = url.pathname.slice(1).split('/').map(decodeURIComponent);
    return { resource, id, path: url.pathname + url.search, params: url.searchParams };
  }

  function mockRequest(method, route, data) {
    const { resource, id, params } = route;
    if (!Object.hasOwn(keys, resource)) throw new ApiError('Không tìm thấy endpoint dữ liệu mẫu.', 404);
    let records = read(resource);
    if (resource === 'dashboard') {
      if (method !== 'GET' || id) throw new ApiError('Dashboard mẫu chỉ hỗ trợ GET /dashboard.', 405);
      return records;
    }
    const index = id == null ? -1 : records.findIndex(row => String(row.id) === id);
    if (id != null && index < 0) throw new ApiError('Không tìm thấy bản ghi.', 404);
    if (method === 'GET') {
      if (id != null) return records[index];
      const q = (params.get('q') || '').trim().toLocaleLowerCase('vi');
      const status = params.get('status');
      records = records.filter(row => (!q || Object.values(row).some(value => String(value).toLocaleLowerCase('vi').includes(q))) && (!status || row.status === status));
      if (resource === 'orders') records.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      const total = records.length;
      const page = Math.max(1, parseInt(params.get('page'), 10) || 1);
      const limit = Math.min(100, Math.max(1, parseInt(params.get('limit'), 10) || 10));
      return { items: records.slice((page - 1) * limit, page * limit), total, page, limit };
    }
    if (method !== 'DELETE' && (!data || typeof data !== 'object' || Array.isArray(data))) throw new ApiError('Body phải là một đối tượng JSON.', 400);
    let result = null;
    if (method === 'POST') {
      if (id) throw new ApiError('POST cần endpoint danh sách.', 400);
      const newId = data.id == null ? `${resource === 'customers' ? 'KH' : 'AD'}-${globalThis.crypto?.randomUUID?.() || Date.now().toString(36) + Math.random().toString(36).slice(2)}` : String(data.id);
      if (!newId.trim()) throw new ApiError('ID không được để trống.', 400);
      if (records.some(row => String(row.id) === newId)) throw new ApiError('Mã bản ghi đã tồn tại.', 409);
      result = { ...data, id: newId, createdAt: data.createdAt || new Date().toISOString() };
      records.push(result);
    } else if (method === 'PUT') {
      if (index < 0) throw new ApiError('Cần ID để cập nhật.', 400);
      result = { ...records[index], ...data, id: records[index].id };
      records[index] = result;
    } else if (method === 'DELETE') {
      if (index < 0) throw new ApiError('Cần ID để xóa.', 400);
      records.splice(index, 1);
    }
    write(resource, records);
    return clone(result);
  }

  async function request(method, endpoint, data, params) {
    const route = parseEndpoint(endpoint, params);
    if (config.baseUrl && Date.now() >= retryAt) {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), config.timeout);
      try {
        const response = await fetch(config.baseUrl + route.path, {
          method, headers: { Accept: 'application/json', ...(data !== undefined ? { 'Content-Type': 'application/json' } : {}) },
          ...(data !== undefined ? { body: JSON.stringify(data) } : {}), signal: controller.signal
        });
        if (!response.ok) {
          let detail = null;
          try { detail = await response.json(); } catch { /* Có thể là HTML lỗi của proxy. */ }
          throw new ApiError(`API trả lỗi HTTP ${response.status}.`, response.status, detail);
        }
        let result = null;
        if (response.status !== 204) {
          const body = await response.text();
          if (body) {
            try { result = JSON.parse(body); }
            catch { throw new ApiError('API trả dữ liệu không phải JSON hợp lệ.', response.status); }
          }
        }
        setState('api');
        return result;
      } catch (error) {
        if (error instanceof ApiError || !(error instanceof TypeError || error.name === 'AbortError')) {
          setState('error', 'http-or-data');
          throw error;
        }
        retryAt = Date.now() + config.retryDelay;
        // Chỉ fallback lỗi kết nối/CORS/timeout. Không che lỗi HTTP 400/404/500.
      } finally { clearTimeout(timer); }
    }
    try {
      const result = mockRequest(method, route, data);
      setState('mock', config.baseUrl ? 'network' : 'unconfigured');
      return result;
    } catch (error) { setState('error', 'mock'); throw error; }
  }

  function configure(options = {}) {
    const next = { ...config, ...options };
    if (typeof next.baseUrl !== 'string') throw new ApiError('baseUrl phải là chuỗi.', 400);
    next.baseUrl = next.baseUrl.trim().replace(/\/+$/, '');
    if (next.baseUrl) {
      const url = new URL(next.baseUrl, location.href);
      if (!['http:', 'https:'].includes(url.protocol) || url.search || url.hash || url.username || url.password) throw new ApiError('URL API phải là HTTP(S), không chứa query hoặc tài khoản.', 400);
      next.baseUrl = url.href.replace(/\/+$/, '');
    }
    if (!Number.isFinite(next.timeout) || next.timeout <= 0 || !Number.isFinite(next.retryDelay) || next.retryDelay < 0) throw new ApiError('Thời gian timeout/retry không hợp lệ.', 400);
    config = next;
    retryAt = 0;
  }

  window.ApiService = Object.freeze({
    getProducts: initial => {
      try {
        const raw = localStorage.getItem('adela_products_data');
        if (raw !== null) return JSON.parse(raw);
        localStorage.setItem('adela_products_data', JSON.stringify(initial));
        return clone(initial);
      } catch { throw new ApiError('Không đọc được kho sản phẩm. Kiểm tra quyền lưu trữ hoặc dữ liệu localStorage; dữ liệu hiện có chưa bị ghi đè.'); }
    },
    saveProducts: (products, previous) => {
      try {
        const raw = localStorage.getItem('adela_products_data');
        if (raw === null || JSON.stringify(JSON.parse(raw)) !== JSON.stringify(previous)) {
          throw new ApiError('Kho đã thay đổi ở tab khác. Hãy đóng biểu mẫu và tải lại trang trước khi thử lại.', 409);
        }
        localStorage.setItem('adela_products_data', JSON.stringify(products));
      } catch (error) {
        if (error instanceof ApiError) throw error;
        throw new ApiError('Không lưu được dữ liệu. Bộ nhớ có thể đã đầy hoặc bị chặn. Thay đổi chưa được lưu; vui lòng thử lại.');
      }
    },
    get: (endpoint, params = {}) => request('GET', endpoint, undefined, params),
    post: (endpoint, data) => request('POST', endpoint, data),
    put: (endpoint, id, data) => request('PUT', `${endpoint.replace(/\/$/, '')}/${encodeURIComponent(id)}`, data),
    delete: (endpoint, id) => request('DELETE', `${endpoint.replace(/\/$/, '')}/${encodeURIComponent(id)}`),
    configure, retry: () => { retryAt = 0; },
    getStatus: () => ({ ...state }), validateDashboard: validDashboard, ApiError
  });
})();
