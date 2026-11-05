# Kiểm tra Kế hoạch 02 — 02/11/2026

Đã cập nhật ba trang trong `html/`, các partial SCSS và JavaScript menu dùng chung. CSS được sinh bằng `npm.cmd run build:css` (script `build:css` của npm trên Windows).

## Bố cục và menu

- Menu drawer rộng 280px ở màn hình ≤768px; menu ngang từ 769px. Drawer có overlay, nút đóng, hiệu ứng trượt và hỗ trợ giảm chuyển động.
- Đóng menu bằng nút ✕, overlay, Esc hoặc liên kết. `aria-expanded` được đồng bộ; focus nằm trong drawer khi mở và quay về hamburger khi đóng bằng nút/overlay/Esc. Nền bị khóa tương tác và cuộn; trạng thái được dọn khi chuyển sang desktop.
- Danh mục: 2 cột dưới 430px, 3 cột từ 430px, 6 cột từ 1024px. Ảnh danh mục giữ khung tròn và tỷ lệ.
- Flash sale, sản phẩm và sản phẩm liên quan: 2 cột dưới 600px, 3 cột từ 600px, 5 cột từ 1024px. Giá cũ được phép xuống dòng, ảnh dùng `object-fit: contain`.
- Feedback, tin tức, giới thiệu, showroom và bản đồ xếp một cột trên mobile. Timeline có đường nối dọc và các mốc trên mobile, đường nối ngang ở màn hình rộng hơn.
- Gallery/thông tin/chính sách: 1 cột dưới 600px; 2 cột từ 600px, chính sách nằm dưới; 3 cột từ 1024px. Gallery co giãn và đạt 460px khi container đạt 1200px. Bảng thông số/form tư vấn xếp dọc dưới 600px.
- `html, body` có `overflow-x: hidden`; đồng thời đã kiểm tra phần tử thực tế để tránh chỉ che lỗi tràn.

## Phương pháp và kết quả

Google Chrome cài trên máy, chạy headless qua Playwright với viewport giả lập, device scale factor 1. Đây là kiểm tra tự động bằng Chrome, không phải thao tác thủ công trong giao diện DevTools hoặc kiểm tra trên điện thoại thật.

| Trang | 375px | 430px | 768px | 1366px | 1920px |
| --- | --- | --- | --- | --- | --- |
| Trang chủ | Đạt | Đạt | Đạt | Đạt | Đạt |
| Giới thiệu | Đạt | Đạt | Đạt | Đạt | Đạt |
| Sản phẩm | Đạt | Đạt | Đạt | Đạt | Đạt |

Kiểm tra bổ sung tại 599, 600, 769, 1001 và 1024px: tổng cộng 30 trường hợp bố cục. Kiểm tra `scrollWidth`, tọa độ phần tử so với viewport, số cột và phần tử có nội dung tràn khỏi khung. Không phát hiện tràn ngang toàn trang hoặc tràn bên trong nội dung chính ở các kích thước này. Drawer nằm ngoài màn hình khi đóng được loại khỏi phép kiểm tra tọa độ theo chủ đích.

9 nhóm kiểm tra menu (3 trang × 375/430/768px) đạt: mở, nút đóng, overlay, Esc, liên kết, vòng Tab/Shift+Tab, trả focus, khóa nền, khóa cuộn và chuyển sang desktop. Không có lỗi JavaScript hoặc request thất bại; mọi ảnh HTML tải và giải mã thành công.

Đã lưu ảnh toàn trang tại 5 kích thước bắt buộc, ảnh drawer của mỗi trang và ảnh đầu trang sản phẩm ở 1024px. Đã xem trực tiếp các ảnh mobile của cả ba trang, drawer, trang sản phẩm desktop và trang giới thiệu tablet.

- [Kết quả bố cục và tương tác](responsive-validation.json)
- [Kiểm tra tràn bên trong phần tử](responsive-inner-overflow.json)
- [Ảnh chụp giao diện](responsive-screenshots/)

Script kiểm tra dùng môi trường Playwright có sẵn trên máy, lưu tại `.tmp-scss/responsive-check.cjs` và `.tmp-scss/check-inner-overflow.cjs`. Không thêm dependency vào dự án.
