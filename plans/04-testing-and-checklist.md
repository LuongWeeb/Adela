# KẾ HOẠCH 04: KIỂM THỬ VÀ CHECKLIST NGHIỆM THU (PHỤ LỤC B GIÁO ÁN)

## 1. MỤC TIÊU
Thực hiện đánh giá tổng thể toàn bộ dự án website Adela Việt Nam theo các tiêu chí kiểm tra của **Phụ lục B (Tiêu chí đánh giá cuối khóa - Trọng số đến Ngày 5)**.

---

## 2. BẢNG CHECKLIST CHI TIẾT DÀNH CHO CODEX

### Tiêu chí 1: HTML5 & Ngữ nghĩa (Trọng số 20%)
- [x] Cấu trúc tài liệu chuẩn `<!DOCTYPE html>`, có `lang="vi"`, `<meta charset="UTF-8">`, `<meta name="viewport">`.
- [x] Phân chia vùng trang rõ ràng: dùng `<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<aside>`, `<footer>`.
- [x] Không dùng thẻ `<div>` bừa bãi cho các tiêu đề hoặc nút bấm (dùng đúng `<h1>` - `<h6>`, `<button>`, `<a>`).
- [x] Tất cả thẻ `<img>` đều có thuộc tính `alt` mô tả nội dung ảnh có nghĩa.
- [x] Tất cả các ô nhập liệu (`<input>`, `<select>`, `<textarea>`) đều có nhãn `<label for="...">` liên kết tương ứng bằng `id`.
- [x] Bảng thông số kỹ thuật sản phẩm có cấu trúc chuẩn: `<table>`, `<tbody>`, `<tr>`, `<td>`.

---

### Tiêu chí 2: CSS / SCSS / Responsive (Trọng số 20%)
- [x] Mã nguồn được tổ chức hoàn toàn bằng **SCSS modular** trong thư mục `scss/`.
- [x] Có hệ thống biến token rõ ràng trong `_variables.scss` (màu sắc thương hiệu, typography, breakpoints).
- [x] Có mixin responsive: `respond-from(...)` dùng `min-width` cho lưới Mobile First; `respond-to(...)` dùng `max-width` cho các điều chỉnh component cũ.
- [x] Biên dịch `npm run build:css` xuất ra các file CSS nén/sạch sẽ trong `css/`.
- [x] Bố cục giao diện dùng **Flexbox** và **CSS Grid** linh hoạt, đúng tỷ lệ như Figma.
- [x] Kiểm tra 5 kích thước màn hình không bị thanh cuộn ngang (`overflow-x: hidden`):
  - [x] Mobile nhỏ (375px)
  - [x] Mobile tiêu chuẩn (430px)
  - [x] Tablet (768px)
  - [x] Laptop (1366px)
  - [x] Desktop Full HD (1920px)

---

### Tiêu chí 3: JavaScript & DOM (Trọng số 20%)
- [x] Phân chia file JavaScript ngăn nắp trong thư mục `js/` (`main.js`, `countdown.js`, `product-detail.js`, `form-validation.js`).
- [x] Thao tác DOM bằng JavaScript hiện đại (`querySelector`, `addEventListener`, `classList`).
- [x] Đồng hồ đếm ngược Flash Sale trên trang chủ hoạt động chính xác theo thời gian thực (giây, phút, giờ).
- [x] Tương tác trang chi tiết sản phẩm:
  - [x] Click thumbnail đổi ảnh chính mượt mà.
  - [x] Tăng / giảm số lượng sản phẩm chính xác, không cho về 0 hoặc số âm.
  - [x] Đổi trạng thái viền chọn màu sắc.
- [x] Mở tab Console trình duyệt (`F12`), duyệt cả 3 trang: **0 lỗi đỏ (Zero Console Errors)**.

---

### Tiêu chí 4: Thư viện Front-end (Trọng số 20%)
- [x] Tích hợp thành công **SweetAlert2**:
  - [x] Bấm nút "MUA NGAY" hiển thị popup xác nhận đẹp mắt.
  - [x] Gửi Form Đăng ký tư vấn hiển thị thông báo thành công có icon tích xanh.
  - [x] Báo lỗi rõ ràng khi số điện thoại không đúng 10 số.
- [x] Tích hợp thành công **Swiper JS**:
  - [x] Danh sách sản phẩm liên quan vuốt trượt được trên màn hình cảm ứng điện thoại.
  - [x] Nút Next/Prev chuyển slide hoạt động trơn tru.

---

### Tiêu chí 5: Hoàn thiện sản phẩm & Khớp thiết kế Figma (Trọng số 20%)
- [x] Đầy đủ 3 trang: `index.html`, `about.html`, `product.html`.
- [ ] Màu sắc, font chữ và hình ảnh khớp với 3 mockup gốc trong `figma-designs/`:
  - `1-trang-chu.png`
  - `2-gioi-thieu.png`
  - `3-chi-tiet-san-pham.png`
- [x] Có file `README.md` hướng dẫn cách cài đặt và chạy dự án ngắn gọn, dễ hiểu.

---

## 3. LỆNH KIỂM TRA NHANH BẰNG DÒNG LỆNH
Codex có thể chạy các lệnh sau để tự kiểm tra mã nguồn:

```bash
# 1. Kiểm tra build SCSS
npm run build:css

# 2. Kiểm tra các file HTML không còn thẻ style/script nội dòng bừa bãi
python -c "import re; [print(fn, len(re.findall(r'<style', open(fn, encoding='utf-8').read()))) for fn in ['html/index.html', 'html/about.html', 'html/product.html']]"
```


## 4. KẾT QUẢ THỰC HIỆN — 02/11/2026

- Đã chạy build SCSS, kiểm tra cú pháp JavaScript, 23 nhóm kiểm tra trình duyệt và 15 trường hợp responsive; không ghi nhận lỗi Console/JavaScript hoặc tải tài nguyên trong lần chạy.
- Đã kiểm tra mở trực tiếp cả ba trang bằng `file://`; có README và script nghiệm thu chạy lại.
- Đã sửa chọn màu, mô tả ảnh, label/form, cấu trúc bảng thông số và chuyển style nội dòng sang SCSS.
- Mục khớp Figma giữ chưa đánh dấu: bố cục chính và bộ ảnh tương ứng, nhưng icon, timeline, một số khoảng cách, tỷ lệ chữ và trang trí còn khác mockup. Đây là kết quả rà soát thực tế, không xác nhận khớp tuyệt đối.
- Kiểm tra HTML bằng DOM/source cục bộ; Console bằng sự kiện Chrome headless; cảm ứng bằng mô phỏng CDP. Chưa kiểm tra W3C Validator, trình duyệt khác hoặc điện thoại thật.
- Phụ lục B gốc có nhóm “API và thư viện”; trong phạm vi Ngày 1–5 chỉ nghiệm thu tích hợp thư viện theo kế hoạch này.

Chi tiết: [README](../README.md), [báo cáo nghiệm thu](../doc/acceptance-validation.md), [JSON kết quả](../doc/acceptance-validation.json), [ảnh kiểm tra](../doc/acceptance-screenshots/).
