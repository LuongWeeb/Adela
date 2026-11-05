# KẾ HOẠCH 03: JAVASCRIPT, DOM VÀ TÍCH HỢP THƯ VIỆN FRONT-END (NGÀY 5)

## 1. MỤC TIÊU
Thực hiện toàn diện các bài thực hành và kỹ năng của **Ngày 5 trong giáo án**:
1. Thao tác DOM, xử lý sự kiện (click, change, submit, keyboard).
2. Kiểm tra dữ liệu (Form validation) với regex cho điện thoại & email.
3. Tích hợp thư viện thông báo hiện đại **SweetAlert2**.
4. Tích hợp thư viện cảm ứng vuốt trượt **Swiper JS** cho banner / sản phẩm liên quan.
5. Xây dựng đồng hồ đếm ngược Flash Sale chạy thời gian thực.

---

## 2. DANH MỤC THƯ VIỆN CẦN TÍCH HỢP (CDN CHUẨN)

Thêm vào `<head>` của cả 3 trang HTML:
```html
<!-- SweetAlert2 (Popup thông báo & xác nhận) -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/sweetalert2@11/dist/sweetalert2.min.css" />
<script src="https://cdn.jsdelivr.net/npm/sweetalert2@11/dist/sweetalert2.all.min.js" defer></script>

<!-- Swiper JS (Slider / Carousel cảm ứng mượt mà) -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css" />
<script src="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js" defer></script>
```

---

## 3. NHIỆM VỤ CHI TIẾT DÀNH CHO CODEX

### File 1: `js/main.js` (Quản lý chung & Menu Hamburger)
* **Xử lý Mobile Navigation:**
  ```javascript
  const hamburgerBtn = document.getElementById('hamburger-btn');
  const closeBtn = document.getElementById('nav-close-btn');
  const navMenu = document.getElementById('nav-menu');
  const navOverlay = document.getElementById('nav-overlay');

  function openMenu() {
    navMenu?.classList.add('open');
    navOverlay?.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    navMenu?.classList.remove('open');
    navOverlay?.classList.remove('active');
    document.body.style.overflow = '';
  }

  hamburgerBtn?.addEventListener('click', openMenu);
  closeBtn?.addEventListener('click', closeMenu);
  navOverlay?.addEventListener('click', closeMenu);
  ```

* **Xử lý Newsletter Form:**
  Lắng nghe submit của form đăng ký email ở footer. Kiểm tra định dạng email và hiển thị thông báo SweetAlert2.

---

### File 2: `js/countdown.js` (Đồng hồ đếm ngược Flash Sale trên `index.html`)
* **Yêu cầu:**
  * Lấy các phần tử hiển thị giờ (`#hours`), phút (`#minutes`), giây (`#seconds`).
  * Khởi tạo mốc kết thúc (ví dụ: kết thúc sau 5 giờ 30 phút).
  * Chạy `setInterval` mỗi 1000ms:
    * Tính toán chênh lệch thời gian, định dạng 2 chữ số (`05 : 24 : 12`).
    * Cập nhật trực tiếp lên giao diện.
    * Khi đếm về 0, tự động reset hoặc hiển thị thông báo "Phiên flash sale mới bắt đầu".

---

### File 3: `js/product-detail.js` (Tương tác trên `product.html`)
* **1. Đổi ảnh chính từ thumbnails:**
  * Lắng nghe click trên từng `.thumbnail-item`.
  * Thay đổi thuộc tính `src` của `#main-img` kèm hiệu ứng mờ dần (opacity fade-in).
  * Cập nhật class `.active` cho thumbnail đang chọn.
  * Hỗ trợ bàn phím (Enter / Space) khi người dùng tab tới thumbnail.

* **2. Bộ tăng giảm số lượng:**
  * Nút `-`: giảm số lượng nhưng không nhỏ hơn 1.
  * Nút `+`: tăng số lượng.
  * Ô input: `readonly` hoặc ngăn người dùng nhập số âm / ký tự chữ.

* **3. Nút "MUA NGAY":**
  * Khi click:
    * Lấy thông tin sản phẩm (Tên: Tủ cigar GF 2180, Số lượng, Giá tiền).
    * Hiển thị popup SweetAlert2 xác nhận đặt hàng:
      ```javascript
      Swal.fire({
        title: 'Xác nhận đặt hàng',
        html: `Bạn đang chọn mua <b>${qty}</b> sản phẩm <b>Tủ cigar GF 2180</b><br>Tổng tiền: <b style="color:#e83224">${totalFormatted}</b>`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#0e1e36',
        cancelButtonColor: '#6c757d',
        confirmButtonText: 'Để lại thông tin tư vấn',
        cancelButtonText: 'Đóng'
      }).then((result) => {
        if (result.isConfirmed) {
          document.getElementById('tu-van')?.scrollIntoView({ behavior: 'smooth' });
        }
      });
      ```

---

### File 4: `js/form-validation.js` (Kiểm tra dữ liệu Form & Thông báo)
* **1. Form Đăng ký tư vấn (`product.html`):**
  * Kiểm tra các trường:
    * Họ và tên: Bắt buộc, tối thiểu 2 ký tự.
    * Số điện thoại: Bắt buộc, phải đúng chuẩn Việt Nam (`/^(0[3|5|7|8|9])+([0-9]{8})$/`).
    * Địa chỉ và Lời nhắn: Tùy chọn.
  * Nếu không hợp lệ: Hiển thị thông báo lỗi ngay dưới ô nhập hoặc bằng SweetAlert2.
  * Nếu hợp lệ:
    ```javascript
    Swal.fire({
      title: 'Đăng ký thành công!',
      text: 'Chuyên viên tư vấn Adela sẽ liên hệ lại với quý khách trong vòng 15 phút.',
      icon: 'success',
      confirmButtonColor: '#0e1e36'
    });
    form.reset();
    ```

* **2. Form Đăng bình luận (`product.html`):**
  * Cho phép người dùng click chọn số sao đánh giá (1 đến 5 sao) và đổi màu vàng tương ứng.
  * Validate nội dung bình luận (tối thiểu 10 ký tự) và họ tên người gửi.
  * Thêm bình luận mới vào danh sách review ngay lập tức (DOM manipulation) mà không cần reload trang.

---

### File 5: `js/slider.js` (Tích hợp Swiper Carousel)
* Tích hợp Swiper cho phần **"Sản phẩm liên quan"** trên `product.html` và **"Khách hàng nói về chúng tôi"** trên `index.html`:
  ```javascript
  const relatedSwiper = new Swiper('.related-swiper', {
    slidesPerView: 2,
    spaceBetween: 16,
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
    breakpoints: {
      640: { slidesPerView: 3, spaceBetween: 20 },
      1024: { slidesPerView: 5, spaceBetween: 20 }
    }
  });
  ```

---

## 4. DEFINITION OF DONE (TIÊU CHÍ HOÀN THÀNH)
* [x] Nút Hamburger mở menu trượt mượt mà trên mobile, overlay click tắt menu.
* [x] Đồng hồ đếm ngược Flash sale nhảy giây đều đặn, không bị lag hay lỗi NaN.
* [x] Click thumbnails đổi ảnh sắc nét, có viền đỏ active.
* [x] Form tư vấn báo lỗi ngay khi nhập sai số điện thoại và báo thành công với SweetAlert2 khi đúng.
* [x] Không xuất hiện bất kỳ lỗi đỏ nào trong Console ở lần kiểm thử.

Hoàn thành ngày 02/11/2026. Kiểm thử tự động qua Chrome headless với thư viện CDN thật, ghi nhận Console/pageerror/Network thay cho thao tác F12 thủ công: 16 nhóm tương tác, 15 trường hợp responsive, 0 lỗi. Xem [báo cáo kiểm thử](../doc/javascript-validation.md) và [hướng dẫn module](../js/README.md).

Regex điện thoại triển khai là `/^0[35789]\d{8}$/` để loại dấu `|` và việc lặp tiền tố trong mẫu minh họa. Thông báo thành công nêu rõ bản thực hành chưa gửi dữ liệu lên máy chủ; bình luận mới được thêm vào DOM, không lưu sau reload.

