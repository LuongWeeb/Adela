# KẾ HOẠCH 03C: NÂNG CẤP BỘ ICON CHUẨN ADELA (FONT AWESOME 6) VÀ HIỆU ỨNG MOTION CAO CẤP

> **Căn cứ giáo án Front-End 7 ngày:**
> * **Trang 9 giáo án:** Thư viện Icon chuẩn **Font Awesome** (`https://docs.fontawesome.com/`) - Mức độ: **Ưu tiên**.
> * **Trang 9 giáo án:** Thư viện chuyển động **Animate.css** (`https://animate.style/`) - Mức độ: **Tham khảo**.
> * **Trang 4 giáo án:** Kỹ thuật CSS3 chuyên sâu: `transform`, `transition`, `@keyframes`, `box-shadow`, pseudo-element (`::before`, `::after`).
> * **Mục tiêu:** Thay thế toàn bộ ký tự Unicode thô sơ (`f`, `▶`, `☎`, `✉`, `★`, `▲`) bằng bộ icon vector sắc nét của thương hiệu Adela, đồng thời thêm các chuyển động vi mô (Micro-interactions) tinh tế chuẩn giao diện website luxury [adelavietnam.com.vn](https://adelavietnam.com.vn/).

---

## 1. MỤC TIÊU CHI TIẾT

1. **Bộ Icon vector sắc sảo (Font Awesome 6 Pro/Free CDN):**
   * Đồng bộ hệ thống icon thương hiệu trên cả 3 trang (`index.html`, `product.html`, `about.html`).
   * Thay thế các ký tự text Unicode thô sơ thành vector SVG/Font rõ nét, có màu sắc thương hiệu (Navy `#052352`, Gold `#c9a84c`, Red `#e00000`).
2. **Hiệu ứng Motion (Chuyển động vi mô & Tương tác cao cấp):**
   * **Hover thẻ sản phẩm (Product Card Elevation & Zoom):** Ảnh tủ rượu/cigar phóng to nhẹ nhàng (`scale(1.06)`), bóng đổ nổi khối 3D mềm mại, nút "Xem nhanh / Thêm giỏ" trượt lên êm ái.
   * **Ánh kim quét qua nút bấm (Luxury Shimmer Sweep):** Dải sáng vàng lướt qua các nút CTA chính (`.btn-buy`, `.button`, `.btn-submit-consult`) tạo cảm giác sản phẩm cao cấp, xa xỉ.
   * **Hiệu ứng nhịp thở / sóng âm (Pulse Animation):** Cho hotline tư vấn, badge "Giảm 30%" và nút Zalo/Chat.
   * **Back-to-Top động:** Mũi tên nhấp nháy chuyển động (`bounce-up`) khi hover.
   * **Chuyển động xoay & sáng viền danh mục:** Các vòng tròn danh mục sản phẩm sáng viền vàng kim khi rê chuột vào.

---

## 2. THƯ VIỆN CẦN BỔ SUNG VÀO `<head>`

Thêm vào `<head>` của các file HTML (`html/index.html`, `html/product.html`, `html/about.html`):

```html
<!-- Font Awesome 6 (Bản chuẩn giáo trình Ngày 5 - Ưu tiên) -->
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css" />

<!-- Animate.css (Hiệu ứng chuyển động bổ trợ - Giáo trình Ngày 5) -->
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css" />
```

---

## 3. BẢNG QUY ĐỔI ICON CHI TIẾT THEO CHUẨN ADELA

| Vị trí | Hiện tại (Ký tự text thô) | Thay thế bằng Font Awesome 6 | Ghi chú & Màu sắc |
| :--- | :--- | :--- | :--- |
| **Top bar Mạng xã hội** | `<span>f</span><span>▶</span><span>◎</span><span>♪</span>` | `<i class="fa-brands fa-facebook-f"></i>`<br>`<i class="fa-brands fa-youtube"></i>`<br>`<i class="fa-brands fa-instagram"></i>`<br>`<i class="fa-brands fa-tiktok"></i>` | Hover chuyển màu Gold `$color-gold` |
| **Top bar Liên hệ** | `☎ 0321...` & `✉ info...` | `<i class="fa-solid fa-phone"></i> 0321...`<br>`<i class="fa-solid fa-envelope"></i> info...` | Thêm icon nhỏ nhắn, tinh tế |
| **Header Tìm kiếm** | `Nút submit tìm kiếm` | `<i class="fa-solid fa-magnifying-glass"></i>` | Nằm gọn trong ô search |
| **Header Tiện ích** | `Chọn cửa hàng`, `Báo giá` | `<i class="fa-solid fa-store"></i>`<br>`<i class="fa-solid fa-truck-fast"></i>` | Icon chỉ đường và giao vận |
| **Header Icon Actions** | Giỏ hàng, Yêu thích, Tài khoản | `<i class="fa-solid fa-cart-shopping"></i>`<br>`<i class="fa-regular fa-heart"></i>`<br>`<i class="fa-regular fa-user"></i>` | Có badge số lượng giỏ hàng |
| **Menu Điều hướng** | `⌄` | `<i class="fa-solid fa-chevron-down"></i>` | Mũi tên trỏ xuống thanh mảnh |
| **Flash Sale** | `⚡ SĂN THẦN TỐC`, `◷ 12H - 17H` | `<i class="fa-solid fa-bolt text-gold"></i>`<br>`<i class="fa-regular fa-clock"></i>` | Tia chớp phát sáng pulse |
| **Thẻ sản phẩm (Rating)** | `★★★★★` | `<i class="fa-solid fa-star"></i>` (5 sao) | Màu vàng Gold `#c9a84c` |
| **Thẻ sản phẩm (Ưu đãi)** | `♔ Ưu đãi 5%...` | `<i class="fa-solid fa-crown"></i> Ưu đãi 5%...` | Vương miện hoàng gia |
| **Khối Giá trị Adela** | `♧ Vật liệu`, `☼ Công nghệ`, `★ Chất lượng`, `♟ Đội ngũ` | `<i class="fa-solid fa-shield-halved"></i> Vật liệu an toàn`<br>`<i class="fa-solid fa-temperature-arrow-down"></i> Công nghệ hiện đại`<br>`<i class="fa-solid fa-award"></i> Chất lượng hàng đầu`<br>`<i class="fa-solid fa-user-tie"></i> Đội ngũ chuyên nghiệp` | Nổi bật đẳng cấp thương hiệu |
| **Khối Hỗ trợ chân trang** | `♧ Bảo hành`, `♧ Mua hàng`, `✉ Khiếu nại`, `☏ Hỗ trợ` | `<i class="fa-solid fa-screwdriver-wrench"></i> Bảo hành`<br>`<i class="fa-solid fa-phone-volume"></i> Mua hàng`<br>`<i class="fa-solid fa-envelope-open-text"></i> Khiếu nại`<br>`<i class="fa-solid fa-headset"></i> Chăm sóc 24/7` | Biểu tượng trực quan sinh động |
| **Nút Back-To-Top** | `▲` | `<i class="fa-solid fa-arrow-up"></i>` | Hover nhún nhảy nhẹ |
| **Trang Chi tiết (product.html)** | Breadcrumb `>` | `<i class="fa-solid fa-chevron-right"></i>` | Phân cách đường dẫn |
| **Nút số lượng (+ / -)** | `+`, `-` | `<i class="fa-solid fa-plus"></i>`, `<i class="fa-solid fa-minus"></i>` | Cân đối trong input |
| **Nút Mua / Tư vấn** | Nút mua hàng | `<i class="fa-solid fa-cart-arrow-down"></i> Mua ngay` | Icon hành động rõ ràng |

---

## 4. CHI TIẾT CÁC HIỆU ỨNG MOTION CẦN TRIỂN KHAI TRONG SCSS

Tạo file mới `scss/components/_animations.scss` và `@use` vào `scss/index.scss`, `scss/product.scss`, `scss/about.scss`:

### 1. Hiệu ứng Hover Card Sản Phẩm Nổi Khối 3D
```scss
// Hover thẻ sản phẩm mượt mà
.product-card {
  transition: transform 0.35s cubic-bezier(0.165, 0.84, 0.44, 1),
              box-shadow 0.35s cubic-bezier(0.165, 0.84, 0.44, 1);
  overflow: hidden;

  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 16px 32px rgba(5, 35, 82, 0.12);

    img {
      transform: scale(1.07);
    }
  }

  img {
    transition: transform 0.5s cubic-bezier(0.165, 0.84, 0.44, 1);
  }
}
```

### 2. Hiệu ứng Ánh Kim Quét Qua Nút Bấm (Luxury Shimmer)
```scss
// Quét sáng ánh kim lướt qua nút vàng / navy
.btn-shimmer,
.btn-buy,
.button {
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 60%;
    height: 100%;
    background: linear-gradient(
      120deg,
      rgba(255, 255, 255, 0) 0%,
      rgba(255, 255, 255, 0.35) 50%,
      rgba(255, 255, 255, 0) 100%
    );
    transform: skewX(-25deg);
    transition: all 0.75s ease;
  }

  &:hover::before {
    left: 150%;
  }
}
```

### 3. Hiệu ứng Sóng Âm / Nhịp Thở Hotline & Flash Badge (Pulse)
```scss
@keyframes gold-pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(201, 168, 76, 0.6);
  }
  70% {
    box-shadow: 0 0 0 12px rgba(201, 168, 76, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(201, 168, 76, 0);
  }
}

.flash-badge,
.top-contact strong,
.sale-dates .current {
  animation: gold-pulse 2s infinite;
}
```

### 4. Hiệu ứng Nút Back-To-Top Nhấp Nhô Khi Hover
```scss
@keyframes bounce-up {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-5px);
  }
}

.back-to-top:hover i {
  animation: bounce-up 0.8s infinite ease-in-out;
}
```

### 5. Hiệu ứng Xoay & Viền Sáng Vòng Tròn Danh Mục
```scss
.category-grid a {
  transition: transform 0.3s ease;

  img {
    transition: transform 0.4s ease, border-color 0.4s ease, box-shadow 0.4s ease;
    border: 2px solid transparent;
  }

  &:hover {
    color: $color-gold;

    img {
      transform: scale(1.08) rotate(2deg);
      border-color: $color-gold;
      box-shadow: 0 8px 20px rgba(201, 168, 76, 0.3);
    }
  }
}
```

---

## 5. BƯỚC THỰC HIỆN DÀNH CHO CODEX

1. **Bước 1: Nhúng CDN vào cả 3 trang HTML (`index.html`, `product.html`, `about.html`)**:
   * Thêm Font Awesome 6.5.2 và Animate.css vào `<head>`.
2. **Bước 2: Thay thế toàn bộ icon text thành thẻ `<i>` Font Awesome**:
   * Rà soát và thay thế các ký tự Unicode theo đúng Bảng quy đổi ở Mục 3.
3. **Bước 3: Tạo module `scss/components/_animations.scss`**:
   * Viết đầy đủ các keyframes và class chuyển động vi mô (Shimmer, Pulse, Hover elevation, Bounce-up).
   * Import file này vào `scss/components/_buttons.scss` hoặc entry points SCSS.
4. **Bước 4: Chạy `npm run build:css`**:
   * Đảm bảo SCSS biên dịch thành công 100%, không bị lỗi biến hay mixin.
5. **Bước 5: Kiểm tra giao diện trực quan**:
   * Hover chuột vào các nút bấm để thấy ánh kim lướt qua.
   * Hover vào card sản phẩm để thấy ảnh zoom mượt và bóng đổ nổi lên.
   * Quan sát các icon mạng xã hội, hotline, star rating sắc sảo, đúng chất thương hiệu Adela.

---

## 6. TIÊU CHÍ HOÀN THÀNH (DEFINITION OF DONE)
* [x] 100% ký tự thô sơ (`f`, `▶`, `☎`, `✉`, `★`, `▲`, `♧`) được thay bằng Font Awesome 6 vector sắc nét.
* [x] Không còn icon nào bị méo hoặc sai màu thương hiệu (Navy / Gold / Red).
* [x] Nút bấm có hiệu ứng ánh kim lướt qua khi hover (`shimmer effect`).
* [x] Card sản phẩm có hiệu ứng zoom ảnh nhẹ và nâng độ cao bóng đổ (`card elevation`).
* [x] Nút Back-to-Top có icon mũi tên và hiệu ứng nhún nhảy khi hover.
* [x] Lệnh `npm run build:css` chạy thành công không báo lỗi.

Kết quả kiểm tra và ảnh trình duyệt: [03c-validation.md](../doc/03c-validation.md).

