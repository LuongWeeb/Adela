# KẾ HOẠCH 01: THIẾT LẬP KIẾN TRÚC SCSS VÀ BUILD TOOL (NGÀY 3)

## 1. MỤC TIÊU
Chuyển đổi toàn bộ mã CSS hiện có trong thư mục `css/` sang kiến trúc module **SCSS (Sass)** chuyên nghiệp, có thể tái sử dụng, dễ bảo trì và có công cụ biên dịch tự động theo chuẩn **Ngày 3 trong giáo án**.

---

## 2. NHIỆM VỤ CHI TIẾT DÀNH CHO CODEX

### Bước 1: Khởi tạo môi trường biên dịch Sass
1. Kiểm tra hoặc tạo file `package.json` ở thư mục gốc `d:\Adela\`:
   ```json
   {
     "name": "adela-vietnam-frontend",
     "version": "1.0.0",
     "description": "Website Adela Việt Nam theo chuẩn Giáo án Front-End 7 ngày",
     "scripts": {
       "build:css": "sass scss:css --no-source-map --style=expanded",
       "watch:css": "sass scss:css --watch --no-source-map"
     },
     "devDependencies": {
       "sass": "^1.77.0"
     }
   }
   ```
2. Chạy lệnh cài đặt:
   ```bash
   npm install
   ```

---

### Bước 2: Tạo cấu trúc thư mục SCSS
Tạo cấu trúc thư mục theo chuẩn modular 7-1 pattern thu gọn:

```text
d:\Adela\scss\
├── abstracts\
│   ├── _variables.scss      # Biến màu sắc, font chữ, khoảng cách, breakpoints
│   └── _mixins.scss         # Mixin media queries (respond-to), flex-center, button-reset
├── base\
│   ├── _reset.scss          # Reset box-sizing, margin, padding, list-style
│   └── _typography.scss     # Font family, font weight, heading styles
├── components\
│   ├── _header.scss         # Top bar, Logo, Search bar, Quick actions
│   ├── _nav.scss            # Navigation bar chính & Dropdown menu
│   ├── _footer.scss         # Footer 4 cột, newsletter input, copyright
│   ├── _product-card.scss   # Thẻ sản phẩm dùng chung (ảnh, badge, giá, sao đánh giá)
│   └── _buttons.scss        # Nút Mua ngay, Xem thêm, Đăng ký tư vấn
├── pages\
│   ├── _home.scss           # Bố cục trang chủ (Flash sale, Riedel banner, danh mục tròn, feedback, tin tức)
│   ├── _about.scss          # Bố cục trang giới thiệu (Timeline lịch sử 2009-Hiện tại, chính sách, bản đồ, showroom)
│   └── _product.scss        # Bố cục trang chi tiết (Gallery ảnh, bảng thông số kỹ thuật, form tư vấn, reviews)
├── index.scss               # File tổng hợp trang chủ: import abstracts, base, components, pages/home
├── about.scss               # File tổng hợp trang giới thiệu: import abstracts, base, components, pages/about
└── product.scss             # File tổng hợp trang sản phẩm: import abstracts, base, components, pages/product
```

---

### Bước 3: Định nghĩa nội dung các file Core

#### 1. `scss/abstracts/_variables.scss`:
```scss
// Brand Colors (Lấy theo thiết kế Figma)
$color-navy: #0e1e36;
$color-navy-dark: #091322;
$color-navy-light: #1a2d4d;
$color-red: #e83224;
$color-red-dark: #c0271b;
$color-orange: #f5a623;
$color-gold: #c9a84c;
$color-gold-light: #e5b358;

// Neutral Colors
$color-white: #ffffff;
$color-gray-bg: #f7f8fa;
$color-gray-light: #f0f2f5;
$color-gray-border: #e2e5eb;
$color-text-dark: #1f2937;
$color-text-mid: #4b5563;
$color-text-light: #9ca3af;

// Typography
$font-heading: 'Montserrat', sans-serif;
$font-body: 'Roboto', sans-serif;

// Breakpoints
$bp-mobile-sm: 375px;
$bp-mobile: 430px;
$bp-tablet: 768px;
$bp-desktop-sm: 1024px;
$bp-desktop: 1366px;
$bp-desktop-lg: 1920px;
```

#### 2. `scss/abstracts/_mixins.scss`:
```scss
@use 'variables' as *;

// Media query mixin Mobile First
@mixin respond-to($breakpoint) {
  @if $breakpoint == 'mobile-sm' {
    @media (max-width: $bp-mobile-sm) { @content; }
  } @else if $breakpoint == 'mobile' {
    @media (max-width: $bp-mobile) { @content; }
  } @else if $breakpoint == 'tablet' {
    @media (max-width: $bp-tablet) { @content; }
  } @else if $breakpoint == 'desktop-sm' {
    @media (max-width: $bp-desktop-sm) { @content; }
  } @else if $breakpoint == 'desktop' {
    @media (max-width: $bp-desktop) { @content; }
  }
}

@mixin flex-center {
  display: flex;
  align-items: center;
  justify-content: center;
}

@mixin text-truncate($lines: 2) {
  display: -webkit-box;
  -webkit-line-clamp: $lines;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
```

---

### Bước 4: Chuyển đổi mã CSS hiện tại vào các Partials
1. Lấy phần dùng chung (reset, typography, header, top-bar, nav, footer) đưa vào các partials tương ứng trong `components/` và `base/`.
2. Lấy phần style riêng của từng trang đưa vào `pages/_home.scss`, `pages/_about.scss`, `pages/_product.scss`.
3. Biên dịch thử nghiệm:
   ```bash
   npm run build:css
   ```
4. Kiểm tra file xuất ra tại `css/index.css`, `css/about.css`, `css/product.css`, đối chiếu trực tiếp trên trình duyệt đảm bảo 100% giao diện không bị lệch hay mất style.

---

## 3. DEFINITION OF DONE (TIÊU CHÍ HOÀN THÀNH)
* [x] Có thư mục `scss/` được tổ chức ngăn nắp theo cấu trúc trên.
* [x] Chạy `npm run build:css` thành công không có warning hay syntax error.
* [x] Các file `css/index.css`, `css/about.css`, `css/product.css` được sinh ra tự động từ SCSS.
* [x] 3 trang HTML hiển thị chính xác như trước, không bị hỏng giao diện.

Kết quả kiểm tra ngày 02/11/2026: xem [báo cáo SCSS](../doc/scss-validation.md).

