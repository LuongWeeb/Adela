(() => {
  'use strict';

  const categories = {
    'wine-cabinet': 'Tủ rượu vang', 'cigar-cabinet': 'Tủ bảo quản cigar',
    'wine-glass': 'Ly rượu vang', decanter: 'Decanter', accessory: 'Phụ kiện rượu vang'
  };
  const statuses = { in_stock: 'Còn hàng', low_stock: 'Sắp hết hàng', out_of_stock: 'Hết hàng' };
  const stockStatus = stock => stock === 0 ? 'out_of_stock' : stock <= 5 ? 'low_stock' : 'in_stock';
  const images = [
    ['main-product.png', 'Tủ cigar GF 2180'], ['cabinet-1.png', 'Tủ vang Vinocave 28 chai'],
    ['cabinet-2.png', 'Tủ vang Vinocave JC76A'], ['cabinet-3.png', 'Tủ rượu vang mẫu 3'],
    ['cabinet-4.png', 'Tủ Golden Fire H737'], ['cabinet-5.png', 'Tủ Golden Fire 85 chai'],
    ['glass-1.png', 'Ly vang Riedel Cabernet'], ['glass-2.png', 'Ly Champagne Riedel'],
    ['glass-3.png', 'Ly rượu mẫu 3'], ['glass-4.png', 'Ly rượu mẫu 4'], ['glass-5.png', 'Ly rượu mẫu 5'],
    ['accessory-1.png', 'Decanter Riedel Amadeo'], ['accessory-2.png', 'Decanter Zalto Axium'],
    ['accessory-3.png', 'Coravin Model Six'], ['accessory-4.png', 'Phụ kiện mẫu 4'], ['accessory-5.png', 'Phụ kiện mẫu 5']
  ].map(([file, label]) => ({ path: `../assets/images/${file}`, label }));
  const seed = [
    ['Tủ bảo quản cigar 1800 điếu cắm điện GF 2180', 'cigar-cabinet', 40000000, 48000000, 8, 'main-product.png'],
    ['Tủ rượu vang nhỏ gọn Vinocave 28 chai sang trọng', 'wine-cabinet', 6250000, 8250000, 22, 'cabinet-1.png'],
    ['Tủ rượu vang Vinocave 22 chai JC76A gọn gàng', 'wine-cabinet', 13800000, 18250000, 5, 'cabinet-2.png'],
    ['Tủ cigar rượu vang mini Golden Fire 2 in 1 H737', 'cigar-cabinet', 6250000, 8250000, 14, 'cabinet-4.png'],
    ['Tủ bảo quản rượu vang lớn Golden Fire 85 chai', 'wine-cabinet', 40000000, 48250000, 3, 'cabinet-5.png'],
    ['Ly rượu vang đỏ RIEDEL Performance OP Cabernet', 'wine-glass', 4200000, 5250000, 45, 'glass-1.png'],
    ['Ly rượu Champagne RIEDEL Performance OP', 'wine-glass', 4200000, 5250000, 0, 'glass-2.png'],
    ['Bình chiết rượu vang cao cấp Riedel Decanter Amadeo', 'decanter', 6200000, 8250000, 12, 'accessory-1.png'],
    ['Bình chiết rượu vang Zalto Decanter Axium', 'decanter', 5450000, 8250000, 7, 'accessory-2.png'],
    ['Máy chiết rượu vang Coravin Model Six màu đỏ vang', 'accessory', 11545200, 16250000, 2, 'accessory-3.png']
  ].map(([name, category, price, originalPrice, stock, file], index) => ({
    id: `ADL-SP${String(index + 1).padStart(2, '0')}`, name, category, categoryName: categories[category],
    price, originalPrice, stock, status: stockStatus(stock), image: `../assets/images/${file}`, createdAt: '2026-10-15'
  }));
  const $ = id => document.getElementById(id);
  const currency = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 });
  const money = value => currency.format(value).replace(/\s/g, '');
  const normalized = value => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/gi, 'd').toLowerCase();
  const fields = ['name', 'category', 'price', 'originalPrice', 'stock', 'image'];
  let products = [], page = 1, editingId = null, formSnapshot = [], returnFocus = null, deleting = false;
  let toastTimer;

  function element(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  }

  function validProducts(value) {
    return Array.isArray(value) && new Set(value.map(p => p?.id)).size === value.length && value.every(p => p &&
      typeof p.id === 'string' && /^ADL-SP\d+$/.test(p.id) && typeof p.name === 'string' && p.name.trim().length >= 5 &&
      Object.hasOwn(categories, p.category) && Number.isSafeInteger(p.price) && p.price > 0 && p.price <= 999999999999 &&
      Number.isSafeInteger(p.originalPrice) && (p.originalPrice === 0 || p.originalPrice >= p.price) && p.originalPrice <= 999999999999 &&
      Number.isSafeInteger(p.stock) && p.stock >= 0 && p.stock <= 999999 && images.some(img => img.path === p.image) &&
      p.status === stockStatus(p.stock) && p.categoryName === categories[p.category] && !Number.isNaN(Date.parse(p.createdAt)));
  }

  function showError(message) { $('products-error').textContent = message; $('products-error').hidden = false; }
  function success(title) {
    if (window.Swal) {
      window.Swal.fire({ toast: true, position: 'top-end', icon: 'success', title, showConfirmButton: false, timer: 2400, timerProgressBar: true });
    } else {
      clearTimeout(toastTimer); $('fallback-toast').textContent = `✓ ${title}`; $('fallback-toast').hidden = false;
      toastTimer = setTimeout(() => { $('fallback-toast').hidden = true; }, 3000);
    }
  }

  function render() {
    const query = normalized($('product-search').value.trim());
    const category = $('category-filter').value;
    const status = $('stock-filter').value;
    const filtered = products.filter(product =>
      (!query || normalized(`${product.name} ${product.id}`).includes(query)) &&
      (!category || product.category === category) && (!status || product.status === status));
    const totalPages = Math.max(1, Math.ceil(filtered.length / 5));
    page = Math.min(page, totalPages);
    const visible = filtered.slice((page - 1) * 5, page * 5);
    $('inventory-summary').textContent = `Tổng sản phẩm: ${products.length} | Tồn kho: ${products.reduce((sum, p) => sum + p.stock, 0)} | Hết hàng: ${products.filter(p => p.stock === 0).length}`;
    $('product-count').textContent = `${filtered.length} sản phẩm`;
    $('products-body').replaceChildren(...visible.map(product => {
      const row = element('tr'); row.dataset.id = product.id;
      const code = element('th', 'product-code', product.id); code.scope = 'row'; row.append(code);
      const photoCell = element('td');
      const photo = element('img', 'product-thumbnail'); photo.src = product.image; photo.alt = product.name; photo.width = 50; photo.height = 50;
      photoCell.append(photo); row.append(photoCell);
      const name = element('td', 'product-name'); name.append(element('strong', '', product.name), element('small', '', product.categoryName)); row.append(name);
      row.append(element('td', 'product-price', money(product.price)));
      const oldPrice = element('td', 'product-original-price'); oldPrice.append(element(product.originalPrice ? 's' : 'span', '', product.originalPrice ? money(product.originalPrice) : '—')); row.append(oldPrice);
      row.append(element('td', 'product-stock', `${product.stock} ${product.category === 'wine-glass' ? 'bộ' : 'chiếc'}`));
      const badgeCell = element('td'); badgeCell.append(element('span', `status-badge ${product.status}`, statuses[product.status])); row.append(badgeCell);
      const actionsCell = element('td'); const actions = element('div', 'row-actions');
      for (const [action, label] of [['edit', 'Sửa'], ['delete', 'Xóa']]) {
        const button = element('button', '', label); button.type = 'button'; button.dataset.action = action;
        button.setAttribute('aria-label', `${label} ${product.name}`); actions.append(button);
      }
      actionsCell.append(actions); row.append(actionsCell); return row;
    }));
    if (!visible.length) {
      const row = element('tr'); const cell = element('td', 'table-message'); cell.colSpan = 8;
      cell.append(element('span', 'empty-mark', '◇'), element('strong', '', products.length ? 'Không tìm thấy sản phẩm phù hợp' : 'Kho sản phẩm đang trống'), element('p', '', products.length ? 'Thử từ khóa khác hoặc bỏ bộ lọc để xem thêm sản phẩm.' : 'Chọn “Thêm sản phẩm mới” để bắt đầu.'));
      row.append(cell); $('products-body').append(row);
    }
    $('pagination-summary').textContent = `Hiển thị ${filtered.length ? (page - 1) * 5 + 1 : 0}–${Math.min(page * 5, filtered.length)} của ${filtered.length} sản phẩm`;
    const navigation = $('pagination'); navigation.replaceChildren();
    function pageButton(label, target, disabled, current = false) {
      const button = element('button', '', label); button.type = 'button'; button.disabled = disabled;
      button.dataset.page = target;
      if (current) button.setAttribute('aria-current', 'page');
      if (/^\d+$/.test(String(label))) button.setAttribute('aria-label', `Trang ${target}`);
      button.addEventListener('click', () => { page = target; render(); $('pagination').querySelector(`[data-page="${page}"][aria-current]`)?.focus(); });
      navigation.append(button);
    }
    pageButton('Trước', page - 1, page === 1);
    const pages = [...new Set([1, page - 1, page, page + 1, totalPages])].filter(n => n >= 1 && n <= totalPages).sort((a, b) => a - b);
    pages.forEach((n, i) => { if (i && n - pages[i - 1] > 1) navigation.append(element('span', '', '…')); pageButton(String(n), n, false, n === page); });
    pageButton('Sau', page + 1, page === totalPages);
  }

  function load() {
    try {
      const data = window.ApiService.getProducts(seed);
      if (!validProducts(data)) throw new Error('Dữ liệu kho không đúng cấu trúc. Dữ liệu đã lưu được giữ nguyên; vui lòng kiểm tra khóa adela_products_data rồi tải lại.');
      products = data; render(); $('products-error').hidden = true;
      ['add-product', 'product-search', 'category-filter', 'stock-filter'].forEach(id => { $(id).disabled = false; });
      $('storage-status').textContent = 'Đã lưu trên trình duyệt'; $('storage-status').dataset.mode = 'api';
    } catch (error) {
      showError(error.message);
      ['add-product', 'product-search', 'category-filter', 'stock-filter'].forEach(id => { $(id).disabled = true; });
      $('storage-status').textContent = 'Không đọc được kho sản phẩm'; $('storage-status').dataset.mode = 'error';
      $('products-body').replaceChildren(); const row = element('tr'); const cell = element('td', 'table-message', 'Không tải được dữ liệu. Kiểm tra lưu trữ và tải lại trang để thử lại.'); cell.colSpan = 8; row.append(cell); $('products-body').append(row);
      $('pagination').replaceChildren(); $('pagination-summary').textContent = ''; $('product-count').textContent = 'Chưa tải được'; $('inventory-summary').textContent = 'Kho sản phẩm chưa sẵn sàng';
    } finally { $('products-body').setAttribute('aria-busy', 'false'); }
  }

  function openForm(id = null) {
    editingId = id; formSnapshot = products; returnFocus = document.activeElement;
    $('product-form').reset(); $('form-error').hidden = true;
    fields.forEach(key => { $(`${key}-error`).textContent = ''; $(`product-${key}`).removeAttribute('aria-invalid'); });
    const product = id ? products.find(p => p.id === id) : { name: '', category: 'wine-cabinet', price: '', originalPrice: '', stock: 0, image: '../assets/images/cabinet-1.png' };
    if (!product) return;
    fields.forEach(key => { $(`product-${key}`).value = product[key]; });
    $('modal-title').textContent = id ? `Sửa sản phẩm · ${id}` : 'Thêm sản phẩm mới';
    $('image-preview').src = product.image;
    $('product-modal').showModal(); document.body.classList.add('product-modal-open'); $('product-name').focus();
  }
  function closeForm() { $('product-modal').close(); }

  function validateForm() {
    const values = Object.fromEntries(new FormData($('product-form')));
    values.name = values.name.trim().replace(/\s+/g, ' ');
    const errors = {};
    if (values.name.length < 5 || values.name.length > 180) errors.name = 'Tên sản phẩm cần từ 5 đến 180 ký tự.';
    if (!Object.hasOwn(categories, values.category)) errors.category = 'Vui lòng chọn dòng sản phẩm hợp lệ.';
    if (!/^\d+$/.test(values.price) || !Number.isSafeInteger(Number(values.price)) || Number(values.price) <= 0 || Number(values.price) > 999999999999) errors.price = 'Giá bán phải là số nguyên dương, tối đa 999.999.999.999₫.';
    if (values.originalPrice && (!/^\d+$/.test(values.originalPrice) || !Number.isSafeInteger(Number(values.originalPrice)) || Number(values.originalPrice) > 999999999999 || (Number(values.originalPrice) !== 0 && Number(values.originalPrice) < Number(values.price)))) errors.originalPrice = 'Giá cũ phải bằng hoặc cao hơn giá bán; bỏ trống hoặc nhập 0 nếu không có.';
    if (!/^\d+$/.test(values.stock) || !Number.isSafeInteger(Number(values.stock)) || Number(values.stock) > 999999) errors.stock = 'Tồn kho phải là số nguyên từ 0 đến 999.999.';
    if (!images.some(image => image.path === values.image)) errors.image = 'Vui lòng chọn ảnh trong danh sách.';
    fields.forEach(key => { $(`${key}-error`).textContent = errors[key] || ''; $(`product-${key}`).setAttribute('aria-invalid', String(Boolean(errors[key]))); });
    if (Object.keys(errors).length) { $(`product-${Object.keys(errors)[0]}`).focus(); return null; }
    return { ...values, price: Number(values.price), originalPrice: Number(values.originalPrice), stock: Number(values.stock), status: stockStatus(Number(values.stock)), categoryName: categories[values.category] };
  }

  function saveForm(event) {
    event.preventDefault(); const values = validateForm(); if (!values) return;
    $('save-product').disabled = true; $('form-error').hidden = true;
    try {
      const old = editingId ? formSnapshot.find(p => p.id === editingId) : null;
      const nextId = Math.max(0, ...formSnapshot.map(p => Number(p.id.slice(6)))) + 1;
      const record = { ...values, id: old?.id || `ADL-SP${String(nextId).padStart(2, '0')}`, createdAt: old?.createdAt || new Date().toISOString() };
      const next = old ? formSnapshot.map(p => p.id === editingId ? record : p) : [record, ...formSnapshot];
      window.ApiService.saveProducts(next, formSnapshot);
      products = next; $('product-search').value = ''; $('category-filter').value = ''; $('stock-filter').value = '';
      page = old ? Math.floor(next.findIndex(p => p.id === old.id) / 5) + 1 : 1;
      closeForm(); render(); $('products-error').hidden = true; success(old ? 'Đã cập nhật sản phẩm' : 'Đã thêm sản phẩm mới');
    } catch (error) { $('form-error').textContent = error.message; $('form-error').hidden = false; }
    finally { $('save-product').disabled = false; }
  }

  async function deleteProduct(id) {
    if (deleting) return;
    const snapshot = products; const product = snapshot.find(p => p.id === id); if (!product) return;
    deleting = true;
    try {
      const text = `Bạn có chắc muốn xóa sản phẩm ${product.name} (Mã: ${product.id})? Thao tác này sẽ gỡ sản phẩm khỏi danh sách!`;
      const confirmed = window.Swal ? (await window.Swal.fire({ title: 'Xóa sản phẩm khỏi kho?', text, icon: 'warning', showCancelButton: true, confirmButtonColor: '#e83224', cancelButtonColor: '#0e1e36', confirmButtonText: 'Đồng ý xóa', cancelButtonText: 'Giữ lại', focusCancel: true })).isConfirmed : window.confirm(text);
      if (!confirmed) return;
      const next = snapshot.filter(p => p.id !== id); window.ApiService.saveProducts(next, snapshot);
      products = next; render(); $('products-error').hidden = true; $('add-product').focus(); success('Đã xóa sản phẩm khỏi kho');
    } catch (error) { showError(error.message); }
    finally { deleting = false; }
  }

  document.addEventListener('DOMContentLoaded', () => {
    images.forEach(image => { const option = element('option', '', image.label); option.value = image.path; $('product-image').append(option); });
    $('add-product').addEventListener('click', () => openForm());
    $('product-form').addEventListener('submit', saveForm);
    ['modal-close', 'modal-cancel'].forEach(id => $(id).addEventListener('click', closeForm));
    $('product-modal').addEventListener('click', event => { if (event.target === $('product-modal')) { const rect = $('product-modal').getBoundingClientRect(); if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) closeForm(); } });
    $('product-modal').addEventListener('close', () => { document.body.classList.remove('product-modal-open'); (returnFocus?.isConnected ? returnFocus : $('add-product')).focus(); });
    $('product-image').addEventListener('change', () => { $('image-preview').src = $('product-image').value; });
    ['product-search', 'category-filter', 'stock-filter'].forEach(id => $(id).addEventListener(id === 'product-search' ? 'input' : 'change', () => { page = 1; render(); }));
    $('products-body').addEventListener('click', event => { const button = event.target.closest('button[data-action]'); if (!button) return; const id = button.closest('tr').dataset.id; if (button.dataset.action === 'edit') openForm(id); else deleteProduct(id); });
    document.querySelectorAll('[data-notice]').forEach(button => button.addEventListener('click', () => {
      const text = button.dataset.notice === 'settings' ? 'Kho sản phẩm đang lưu trên trình duyệt. Chưa có chức năng cấu hình tài khoản.' : 'Chưa có thông báo vận hành mới.';
      if (window.Swal) window.Swal.fire({ title: button.dataset.notice === 'settings' ? 'Cài đặt' : 'Thông báo', text, icon: 'info', confirmButtonColor: '#0e1e36' }); else window.alert(text);
    }));
    window.addEventListener('storage', event => { if (event.key === 'adela_products_data' || event.key === null) { load(); if ($('product-modal').open) { $('form-error').textContent = 'Kho đã cập nhật từ tab khác. Đóng và mở lại biểu mẫu trước khi lưu.'; $('form-error').hidden = false; } } });
    load();
  });
})();
