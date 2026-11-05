# KẾ HOẠCH 02: TỐI ƯU GIAO DIỆN RESPONSIVE MOBILE FIRST (NGÀY 4)

## 1. MỤC TIÊU
Đảm bảo 03 trang web hoạt động hoàn hảo và tương thích trên mọi kích thước màn hình theo chuẩn **Ngày 4 trong giáo án**, với trọng tâm là thiết kế thích ứng **Mobile First**, tích hợp **Menu Hamburger di động** và xử lý triệt để lỗi tràn viền ngang.

---

## 2. KÍCH THƯỚC KIỂM THỬ BẮT BUỘC
Codex cần kiểm thử trên Chrome DevTools Device Mode ở 5 kích thước tiêu chuẩn:
1. **375px:** iPhone SE / Mobile nhỏ
2. **430px:** iPhone 14/15 Pro Max / Mobile hiện đại
3. **768px:** iPad Mini / Tablet dọc
4. **1366px:** Laptop phổ thông
5. **1920px:** Màn hình Desktop Full HD

---

## 3. NHIỆM VỤ CHI TIẾT DÀNH CHO CODEX

### Bước 1: Triển khai Mobile Hamburger Navigation
1. **Bổ sung HTML trong thẻ `<nav class="nav">`:**
   ```html
   <div class="container nav-container">
     <button class="hamburger-btn" id="hamburger-btn" aria-label="Mở menu điều hướng" aria-expanded="false">
       <span class="bar"></span>
       <span class="bar"></span>
       <span class="bar"></span>
     </button>
     
     <ul class="nav-menu" id="nav-menu">
       <li class="nav-close-wrapper">
         <span class="nav-logo">Adela<sup>VN</sup></span>
         <button class="nav-close-btn" id="nav-close-btn" aria-label="Đóng menu">✕</button>
       </li>
       <!-- Các mục menu -->
       <li><a href="index.html">Trang chủ</a></li>
       <li><a href="about.html">Về Adela</a></li>
       <li class="has-dropdown">
         <a href="product.html">Sản phẩm <span class="arrow">▾</span></a>
         <ul class="dropdown">...</ul>
       </li>
       <li><a href="#">Tin tức</a></li>
       <li><a href="#">Liên hệ</a></li>
     </ul>
     <div class="nav-overlay" id="nav-overlay"></div>
   </div>
   ```

2. **Viết SCSS trong `scss/components/_nav.scss`:**
   * Mặc định trên Desktop (`> 768px`):
     * `.hamburger-btn`, `.nav-close-wrapper`, `.nav-overlay`: `display: none;`
     * Menu hiển thị ngang bình thường.
   * Trên Mobile & Tablet (`<= 768px`):
     * Hiển thị nút `.hamburger-btn`.
     * `.nav-menu` chuyển thành dạng **Drawer**:
       * `position: fixed; top: 0; left: -280px; width: 280px; height: 100vh; background: #0e1e36; z-index: 9999;`
       * `transition: left 0.3s ease;`
       * Khi có class `.open`: `left: 0;`
     * `.nav-overlay`: Phủ mờ toàn màn hình khi menu mở (`background: rgba(0,0,0,0.5)`).

---

### Bước 2: Tối ưu Bố cục Responsive theo từng trang

#### 1. Trang chủ (`index.html` & `_home.scss`):
* **Top-bar:** Ẩn bớt hotline phụ và social trên mobile nhỏ (`< 430px`), chỉ giữ text ưu đãi rút gọn.
* **Header:** Ô tìm kiếm thu gọn dạng icon hoặc giãn 100% khi màn hình nhỏ.
* **Danh mục sản phẩm tròn:**
  * Desktop: 6 cột (`grid-template-columns: repeat(6, 1fr)`)
  * Tablet: 3 cột
  * Mobile: 2 hoặc 3 cột gọn gàng, ảnh bo tròn cân đối.
* **Flash sale & Grid sản phẩm:**
  * Desktop: 5 cột (`repeat(5, 1fr)`)
  * Tablet (`768px`): 3 cột
  * Mobile (`< 600px`): 2 cột (mỗi card hiển thị rõ tên, giá đỏ, badge giảm giá, không bị chồng chữ).
* **Feedback khách hàng:** Desktop 2 cột -> Mobile 1 cột xếp dọc.
* **Khối Tin tức:** Desktop 3 cột -> Mobile 1 cột.

#### 2. Trang giới thiệu (`about.html` & `_about.scss`):
* **Hero giới thiệu:** Khối text và ảnh lớn chuyển từ 2 cột sang 1 cột trên mobile.
* **Timeline lịch sử (2009 - Hiện tại):**
  * Trên desktop: Thanh ngang nối các mốc thời gian.
  * Trên mobile: Chuyển sang dạng dọc (Vertical Timeline) để người dùng dễ cuộn đọc.
* **Bản đồ & Showroom:** Bản đồ Việt Nam hiển thị gọn gàng, 2 thẻ Showroom Hà Nội / TP.HCM xếp dọc.

#### 3. Trang chi tiết sản phẩm (`product.html` & `_product.scss`):
* **Khối sản phẩm trên cùng:**
  * Desktop: 3 cột (Gallery 460px | Thông tin sản phẩm 1fr | Chính sách dịch vụ 240px).
  * Tablet: 2 cột (Gallery + Thông tin), chính sách đưa xuống dưới.
  * Mobile: 1 cột tuần tự (Ảnh đại diện -> Thumbnails -> Tiêu đề & Giá -> Nút Mua ngay -> Chính sách).
* **Bảng thông số & Form tư vấn:**
  * Desktop: Bảng thông số (trái) và Form tư vấn (phải).
  * Mobile: Xếp dọc, bảng thông số co giãn `width: 100%`, form tư vấn đầy đủ input.

---

### Bước 3: Khắc phục triệt để lỗi tràn ngang (Overflow Inspection)
1. Thêm vào `scss/base/_reset.scss`:
   ```scss
   html, body {
     max-width: 100%;
     overflow-x: hidden;
   }
   img {
     max-width: 100%;
     height: auto;
   }
   ```
2. Rà soát tất cả các phần tử có `width` cố định bằng `px` lớn (như `1200px`, `600px`), chuyển sang `max-width: 100%` hoặc dùng `clamp() / %`.

---

## 4. DEFINITION OF DONE (TIÊU CHÍ HOÀN THÀNH)
* [x] Kiểm tra trên 375px, 430px, 768px, 1366px, 1920px: Không có bất kỳ thanh cuộn ngang nào ở chân trang.
* [x] Nút Hamburger mở được menu mượt mà, bấm dấu ✕ hoặc bấm ra ngoài nền mờ đóng được menu.
* [x] Chữ, hình ảnh, thẻ card sản phẩm hiển thị ngay ngắn, không bị méo ảnh hay vỡ hàng.

Hoàn thành ngày 02/11/2026. Kiểm thử tự động bằng Chrome headless với viewport giả lập (không thao tác trực tiếp giao diện DevTools), bổ sung kiểm tra các breakpoint và bàn phím. Xem [báo cáo và ảnh kiểm tra](../doc/responsive-validation.md).

