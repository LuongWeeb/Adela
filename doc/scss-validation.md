# Kiểm tra kiến trúc SCSS — 02/11/2026

Đã hoàn thành `plans/01-scss-architecture.md`. Sass được cài trong `devDependencies`, có `package-lock.json`, hai script build/watch đúng yêu cầu và đủ ba entry point cùng các partial đã chỉ định. Có thêm `base/_layout.scss` cho bố cục và tiện ích dùng chung.

## Build và mã nguồn

- `npm.cmd run build:css` thành công; không có warning hoặc syntax error của Sass.
- Kiểm tra trực tiếp bằng Sass API: nội dung cả ba file CSS trên đĩa khớp kết quả biên dịch SCSS.
- Thư mục `css/` chỉ có `index.css`, `about.css`, `product.css`; không sinh source map hoặc CSS riêng cho partial.
- Chế độ watch khởi động thành công và đã được dừng sau kiểm tra.
- HTML chỉ thay đổi đường dẫn tài nguyên: thêm `../` trước `css/`, `js/`, `images/`. Ảnh nền trang about cũng được sửa đường dẫn tương đối từ thư mục CSS.

## Đối chiếu giao diện

Trình duyệt: Google Chrome cài trên máy, chạy headless, device scale factor 1.

Bản đối chiếu sử dụng CSS gốc trước chuyển đổi, với đường dẫn tài nguyên đã sửa để tải đầy đủ CSS/JS/ảnh. Hai bản dùng cùng HTML. Việc sửa đường dẫn được tách khỏi phép so sánh nhằm kiểm tra chính xác tác động của chuyển đổi SCSS.

Mỗi trang được kiểm tra tại 375, 430, 600, 601, 768, 1000, 1001, 1366 và 1920px, bao gồm cả hai phía của breakpoint đang sử dụng.

| Trang | Số kích thước | Phần tử mỗi lần kiểm tra | Sai khác computed style/bố cục | Pixel khác biệt ở 375 / 768 / 1366px |
| --- | ---: | ---: | ---: | --- |
| `index.html` | 9 | 452 | 0 | 0 / 0 / 0 |
| `about.html` | 9 | 206 | 0 | 0 / 0 / 0 |
| `product.html` | 9 | 327 | 0 | 0 / 0 / 0 |

Đã so sánh toàn bộ computed style của mỗi phần tử và pseudo-element `::before`, `::after`, cùng tọa độ/kích thước. Các ảnh đối chiếu là ảnh toàn trang sau khi tải đầy đủ ảnh, kể cả ảnh lazy loading. Tổng cộng 27 trường hợp bố cục và 9 cặp ảnh đều đạt.

Đã xem ảnh chụp desktop của cả ba trang và ảnh mobile trang sản phẩm. Kết quả phản ánh các trường hợp Chrome được kiểm tra, không phải kiểm chứng mọi trình duyệt hoặc mọi thiết bị.

## Tương tác và tài nguyên

- 12 trường hợp hover/focus trên ba trang: không khác biệt sau khi hiệu ứng chuyển động hoàn tất.
- Form newsletter hiển thị thông báo demo trên cả ba trang.
- Trang sản phẩm: tăng/giảm số lượng hoạt động, giới hạn tối thiểu là 1; chọn thumbnail thay đổi ảnh chính.
- Không có lỗi JavaScript, request thất bại hoặc HTTP lỗi trong các lần kiểm tra.
- Tất cả ảnh HTML tải và giải mã thành công.

Chi tiết máy đọc được: [scss-validation.json](scss-validation.json). Bản CSS/HTML gốc, script kiểm tra tạm và ảnh before/after nằm trong `.tmp-scss/` (đã được loại khỏi Git).

Hướng dẫn bảo trì và các quyết định giữ nguyên màu/font/breakpoint: [scss/README.md](../scss/README.md).
