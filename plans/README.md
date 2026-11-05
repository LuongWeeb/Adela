# HƯỚNG DẪN THỰC HIỆN DỰ ÁN ADELA VIỆT NAM (DÀNH CHO CODEX)

> **Tài liệu đào tạo đối chiếu:** Giáo án đào tạo Front-End cơ bản trong 07 ngày  
> **Phạm vi hoàn thành:** **Toàn bộ 07 ngày**  
> **Thư mục dự án:** `d:\Adela\`

---

## 1. LỘ TRÌNH CHI TIẾT TỪNG KẾ HOẠCH

| Thứ tự | File Kế Hoạch | Chủ Đề Giáo Án | Nội Dung & Mục Tiêu Trọng Tâm |
| :---: | :--- | :--- :--- | :--- |
| **01** | [`01-scss-architecture.md`](./01-scss-architecture.md) | **Ngày 3 (SCSS)** | Thiết lập kiến trúc SCSS modular, token biến màu sắc/font, mixin, cấu hình npm build `sass`. *(Đã hoàn thành)* |
| **02** | [`02-responsive-mobile-first.md`](./02-responsive-mobile-first.md) | **Ngày 4 (Responsive)** | Chuẩn hóa Responsive Mobile First, tối ưu 5 kích thước (375px - 1920px), menu Hamburger di động. *(Đã hoàn thành)* |
| **03** | [`03-javascript-and-libraries.md`](./03-javascript-and-libraries.md) | **Ngày 5 (JS & Thư viện)** | DOM & Event, đồng hồ đếm ngược Flash Sale, gallery thumbnail, validate form và tích hợp **SweetAlert2**, **Swiper**. *(Đã hoàn thành)* |
| **03B**| [`03b-jquery-and-ui-effects.md`](./03b-jquery-and-ui-effects.md) | **Ngày 5 (jQuery & Hiệu ứng)** | Tích hợp **jQuery (v3.7.1)**, **AOS** và **Lightbox2**: Nút cuộn mượt Back-to-Top (`fadeIn`/`animate`), Accordion hỏi đáp (`slideToggle`), Tab chuyển đổi (`fadeIn`), Sticky Header. *(Đã thực hiện)* |
| **03C**| [`03c-luxury-icons-and-motion.md`](./03c-luxury-icons-and-motion.md) | **Ngày 4 & 5 (Icon & Motion)** | Nâng cấp toàn bộ icon thành **Font Awesome 6** chuẩn thương hiệu Adela, hiệu ứng ánh kim nút bấm (Luxury Shimmer), hover card nổi khối 3D, pulse hotline, micro-interactions. *(Sẵn sàng thực hiện)* |
| **04** | [`04-testing-and-checklist.md`](./04-testing-and-checklist.md) | **Tổng duyệt Giai đoạn 1** | Bảng kiểm tra nghiệm thu chất lượng theo Phụ lục B của giáo án cho 3 trang bán hàng. *(Đã hoàn thành)* |
| **05** | [`05-rest-api-and-dashboard.md`](./05-rest-api-and-dashboard.md) | **Ngày 6 (API & Dashboard)** | Xây dựng màn hình Tổng quan Dashboard quản trị (`html/dashboard.html`), thẻ KPI, biểu đồ **Chart.js** và tầng dịch vụ kết nối REST API / LocalStorage. *(Đã hoàn thành)* |
| **06** | [`06-crm-mini-project.md`](./06-crm-mini-project.md) | **Ngày 7 (Quản lý kho sản phẩm)** | Hoàn thiện hệ thống Quản lý Kho sản phẩm Adela (`html/products-admin.html`): CRUD đầy đủ (Thêm/Sửa/Xóa tủ rượu, tủ cigar, ly vang), Tìm kiếm, Lọc danh mục, Phân trang và SweetAlert2. *(Sẵn sàng thực hiện)* |

---

## 2. HIỆN TRẠNG DỰ ÁN
* **Trang bán hàng (E-Commerce):**
  * `html/index.html`: Trang chủ (Banner, flash sale thời gian thực, sản phẩm, tin tức, footer, hiệu ứng AOS & Back-to-Top).
  * `html/about.html`: Trang giới thiệu (Timeline lịch sử, sản phẩm dịch vụ, showroom, bản đồ).
  * `html/product.html`: Trang chi tiết sản phẩm Tủ cigar GF 2180 (Gallery đổi ảnh, tăng giảm số lượng, form tư vấn, review).
* **Trang quản trị (Admin Portal):**
  * `html/dashboard.html`: Tổng quan KPI, biểu đồ doanh thu 12 tháng & cơ cấu sản phẩm bằng **Chart.js**.
  * `html/products-admin.html`: Màn hình Quản lý Kho sản phẩm Adela (CRUD đầy đủ theo Kế hoạch 06).
* **Kiến trúc SCSS & JavaScript:**
  * SCSS modular trong `scss/`, biên dịch tự động ra `css/` qua lệnh `npm run build:css`.
  * Module JS đầy đủ trong `js/`, tích hợp sẵn SweetAlert2, Swiper, Chart.js, jQuery 3.7.1, AOS.
