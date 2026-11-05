# Kiểm tra Kế hoạch 03C — 03/11/2026

Đã triển khai trên `html/index.html`, `html/product.html`, `html/about.html`.

- Nhúng Font Awesome **6.5.2** và Animate.css **4.1.1** trước CSS của website.
- Rà soát lại theo kế hoạch: sửa icon mạng xã hội chuyển sang Gold `#c9a84c` khi hover; đồng bộ icon liên hệ top bar và lá thương hiệu ở footer sang cùng màu Gold. Các phần CDN, icon và module motion đã có sẵn được giữ lại và kiểm tra lại bằng trình duyệt.
- Thay icon chữ/Unicode trong header, mạng xã hội, liên hệ, menu, đánh giá, ưu đãi, giá trị Adela, chính sách, footer, breadcrumb, số lượng, mua hàng và back-to-top. FAQ và bình luận mới tạo bằng JavaScript cũng sử dụng Font Awesome.
- Module `scss/components/_animations.scss` được import và phát CSS sau các module hiện hữu trong cả ba entry point. Card nâng 8px, ảnh zoom 1.06, nút Xem nhanh trượt lên, CTA shimmer, hotline/badge pulse, mũi tên bounce và danh mục xoay nhẹ với viền Gold `#c9a84c`.
- Hiệu ứng card dùng thuộc tính `translate` riêng để phối hợp với AOS. Nút Xem nhanh hiện sẵn trên thiết bị cảm ứng và hỗ trợ focus bàn phím. `prefers-reduced-motion` tắt các chuyển động và giữ nút thao tác hiển thị.
- `npm.cmd run build:css` thành công, không lỗi Sass. Dùng `npm.cmd` vì PowerShell trên máy chặn wrapper `npm.ps1`; đây là cùng script `build:css` trong package.json.

Kiểm tra bằng Chrome headless với request CDN thực, tải font thật và chụp ảnh desktop/mobile. Kiểm tra kích thước 375, 768, 1366px; glyph/font; màu Gold; hover; chế độ giảm chuyển động; menu mobile; số lượng; FAQ; đánh giá mới. Kết quả máy đọc: [report.json](luxury-motion-check/report.json).

Ảnh đối chiếu:

- [Trang chủ desktop](luxury-motion-check/index-desktop.png), [mobile](luxury-motion-check/index-mobile.png), [hover card](luxury-motion-check/index-card-hover.png), [viền danh mục](luxury-motion-check/index-category-hover.png), [giá trị Adela](luxury-motion-check/index-values.png).
- [Sản phẩm desktop](luxury-motion-check/product-desktop.png), [mobile](luxury-motion-check/product-mobile.png), [shimmer](luxury-motion-check/product-shimmer.png).
- [Giới thiệu desktop](luxury-motion-check/about-desktop.png), [mobile](luxury-motion-check/about-mobile.png), [chính sách](luxury-motion-check/about-policies.png).
- [Hover mạng xã hội](luxury-motion-check/index-social-hover.png): kiểm tra bổ sung ở top bar và footer đều trả về màu `rgb(201, 168, 76)` sau khi hover.

Chạy lại kiểm tra bằng `node scripts/luxury-motion-check.cjs` khi Playwright và Chrome đã có trên máy. Có thể đặt biến môi trường `ADELA_PLAYWRIGHT_MODULE` tới module Playwright hiện có; không cần thêm dependency vào website.

Icon phụ thuộc kết nối tới CDN như yêu cầu kế hoạch. Các liên kết Xem nhanh mở trang chi tiết sản phẩm hiện có; giỏ hàng hiển thị số 0 của giao diện thực hành.
