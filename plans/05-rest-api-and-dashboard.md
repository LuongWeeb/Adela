# KẾ HOẠCH 05: REST API VÀ XÂY DỰNG DASHBOARD QUẢN TRỊ (NGÀY 6)

## 1. MỤC TIÊU
Thực hiện toàn bộ nội dung lý thuyết và thực hành của **Ngày 6 trong giáo án đào tạo Front-End**:
1. Hiểu quy trình HTTP Request / Response (Headers, Body, Status Code: 200, 201, 400, 404, 500).
2. Xây dựng giao diện **Dashboard Quản trị Adela** (`html/dashboard.html`) với bố cục Admin hiện đại (Sidebar điều hướng, Header quản trị, Thẻ thống kê KPI).
3. Tích hợp thư viện biểu đồ trực quan **Chart.js** (v4) để hiển thị báo cáo doanh thu và cơ cấu sản phẩm.
4. Xây dựng tầng dịch vụ kết nối **REST API** bằng Fetch API / async-await, xử lý đồng bộ dữ liệu, loading spinner và bắt lỗi (Error Handling / CORS).

---

## 2. KIẾN TRÚC VÀ CÁC THÀNH PHẦN CẦN XÂY DỰNG

### 2.1. File giao diện: `html/dashboard.html`
* **Sidebar điều hướng trái:**
  * Logo thương hiệu `Adela Admin`.
  * Menu quản trị: *Tổng quan (Dashboard)*, *Khách hàng (CRM)*, *Sản phẩm*, *Đơn hàng*, *Cài đặt*.
  * Nút thu nhỏ / mở rộng Sidebar (Toggle Sidebar) trên mobile/desktop.
* **Header quản trị:**
  * Ô tìm kiếm nhanh toàn hệ thống.
  * Thông báo (Notification bell), avatar thông tin quản trị viên.
  * Nút chuyển nhanh về trang bán hàng (`index.html`).
* **Khu vực thống kê KPI (Stat Cards - 4 thẻ):**
  1. *Tổng doanh thu tháng:* `1.280.000.000₫` (+12.5% so với tháng trước).
  2. *Đơn hàng mới:* `148 đơn` (85% đã giao thành công).
  3. *Khách hàng mới:* `326 khách hàng` (+18%).
  4. *Tủ rượu & Cigar tồn kho:* `42 chiếc` (Cần nhập thêm 3 mẫu).
* **Khu vực biểu đồ phân tích (Chart.js):**
  * *Biểu đồ cột/đường:* Doanh thu 12 tháng gần nhất (Line/Bar chart).
  * *Biểu đồ tròn/vành khăn:* Cơ cấu doanh số theo danh mục: Tủ rượu vang (45%), Tủ cigar (30%), Ly & Decanter (15%), Phụ kiện (10%) (Doughnut chart).
* **Bảng giao dịch gần đây:** Danh sách 5 đơn hàng mới nhất với trạng thái (Đã giao, Đang xử lý, Chờ duyệt).

---

### 2.2. SCSS Quản trị:
* Tạo file `scss/pages/_dashboard.scss`.
* Tạo entry point `scss/dashboard.scss` (kế thừa variables, mixins, reset, typography) và biên dịch ra `css/dashboard.css`.
* Responsive: Sidebar tự động ẩn dạng Offcanvas Drawer trên màn hình Tablet/Mobile (`<= 1024px`), có nút Hamburger mở menu.

---

### 2.3. Tầng kết nối REST API & Dịch vụ Mock (`js/api-service.js`):
* Cung cấp các hàm gọi HTTP tiêu chuẩn:
  ```javascript
  const API_BASE_URL = 'http://localhost:5000/api'; // Hoặc endpoint ASP.NET Core

  export const ApiService = {
    // 1. GET - Lấy dữ liệu với Query params
    async get(endpoint, params = {}) { ... },

    // 2. POST - Thêm mới bản ghi
    async post(endpoint, data) { ... },

    // 3. PUT - Cập nhật thông tin
    async put(endpoint, id, data) { ... },

    // 4. DELETE - Xóa bản ghi
    async delete(endpoint, id) { ... }
  };
  ```
* **Cơ chế Fallback thông minh (Mock Data & LocalStorage):**
  * Khi Backend API đang chạy: Kết nối trực tiếp.
  * Khi chưa có Backend hoặc gặp lỗi mạng / CORS: Tự động chuyển sang Mock Data chuẩn lưu trữ trong `localStorage` để giao diện luôn chạy mượt mà, không bị màn hình trắng.

---

## 3. NHIỆM VỤ CHI TIẾT DÀNH CHO CODEX

### Bước 1: Tạo cấu trúc HTML & Nhúng thư viện
1. Tạo file `html/dashboard.html`.
2. Nhúng thư viện vào `<head>`:
   * **Font Google:** Montserrat & Roboto.
   * **CSS:** `../css/dashboard.css`.
   * **Chart.js (v4):**
     ```html
     <script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.3/dist/chart.umd.min.js" defer></script>
     ```
   * **SweetAlert2 (v11):**
     ```html
     <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/sweetalert2@11/dist/sweetalert2.min.css" />
     <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11/dist/sweetalert2.all.min.js" defer></script>
     ```

### Bước 2: Viết SCSS cho Dashboard
1. Tạo `scss/pages/_dashboard.scss` với bố cục CSS Grid / Flexbox:
   * `.admin-layout`: Gồm `.admin-sidebar` cố định bên trái (rộng 260px) và `.admin-main` bên phải (`flex: 1`).
   * `.kpi-grid`: Grid 4 cột trên desktop, 2 cột trên tablet, 1 cột trên mobile.
   * `.charts-grid`: Grid 2 cột (Biểu đồ doanh thu 2/3 chiều rộng, Biểu đồ cơ cấu 1/3 chiều rộng).
2. Tạo `scss/dashboard.scss`:
   ```scss
   @use 'abstracts/variables' as *;
   @use 'abstracts/mixins' as *;
   @use 'base/reset';
   @use 'base/typography';
   @use 'pages/dashboard';
   ```
3. Chạy `npm run build:css` để sinh ra `css/dashboard.css`.

### Bước 3: Khởi tạo biểu đồ với Chart.js (`js/dashboard-charts.js`)
1. **Biểu đồ doanh thu 12 tháng (Revenue Chart):**
   * Loại: Line chart kết hợp Gradient background màu xanh navy và đường viền gold.
   * Trục X: Từ Tháng 1 đến Tháng 12.
   * Dữ liệu: Doanh thu theo từng tháng (đơn vị: triệu VNĐ).
   * Tooltip: Tự động format tiền tệ định dạng `xxx.000.000₫`.
2. **Biểu đồ phân loại sản phẩm (Category Share Chart):**
   * Loại: Doughnut chart.
   * Dữ liệu 4 phần: Tủ rượu (45%), Tủ cigar (30%), Ly rượu vang (15%), Decanter & Khác (10%).
   * Màu sắc chủ đạo: Navy `#0e1e36`, Đỏ `#e83224`, Vàng gold `#c9a84c`, Xám đậm `#4b5563`.

### Bước 4: Xây dựng Module API & Loading State (`js/api-service.js`)
* Tạo hiệu ứng Loading Skeleton hoặc Spinner khi nạp dữ liệu vào bảng giao dịch gần đây.
* Hiển thị trạng thái kết nối API (Xanh: Đang kết nối REST API; Vàng: Đang dùng LocalStorage Mock).

---

## 4. DEFINITION OF DONE (TIÊU CHÍ HOÀN THÀNH)
* [x] Mở `html/dashboard.html` hiển thị đầy đủ giao diện Quản trị viên sang trọng, đồng bộ tông màu thương hiệu Adela.
* [x] 4 thẻ KPI hiển thị số liệu nổi bật.
* [x] Cả 2 biểu đồ Chart.js (Line chart và Doughnut chart) vẽ mượt mà, hover xem được tooltip chi tiết.
* [x] Sidebar có nút thu/phóng và ẩn hiện mượt mà trên thiết bị di động.
* [x] Không có lỗi runtime trên Console trình duyệt (F12).

Hoàn thành ngày 03/11/2026. Đã kiểm tra Chrome headless qua HTTP và mở file trực tiếp: 13 nhóm kiểm thử, 7 kích thước responsive; không có runtime exception. Xem [báo cáo nghiệm thu](../doc/dashboard-validation.md) và [cấu hình REST API / Mock](../doc/dashboard-api.md). Lỗi mạng/HTTP do cố ý mô phỏng được ghi riêng, không che log trình duyệt. Trang chưa cấu hình URL backend tự chạy Mock; điền meta `adela-api-base-url` để bật Fetch và fallback tự động.

