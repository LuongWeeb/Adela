# JavaScript — Kế hoạch 03 / Ngày 5

Kế hoạch 05 bổ sung `api-service.js` (Fetch CRUD và Mock localStorage) cùng `dashboard-charts.js` (biểu đồ, KPI, bảng giao dịch, tìm kiếm và trạng thái tải) cho `html/dashboard.html`. Xem [cấu hình và hợp đồng API Ngày 6](../doc/dashboard-api.md).

Kế hoạch 06 bổ sung `products-admin.js`: 10 sản phẩm mẫu, DOM an toàn qua `textContent`, validation, SweetAlert2, tìm kiếm/lọc bằng `filter()`, phân trang bằng `slice()`. `api-service.js` cung cấp `getProducts(seed)` / `saveProducts(next, previous)` dùng khóa `adela_products_data`; không ghi đè dữ liệu hỏng hoặc báo thành công khi ghi storage thất bại. `admin-layout.js` dùng chung sidebar responsive cho hai trang quản trị. Không sử dụng jQuery hoặc framework. Xem [kiểm thử kho sản phẩm](../doc/products-admin-validation.md).

Các script dùng `defer` và khởi tạo sau `DOMContentLoaded`. SweetAlert2 v11 và Swiper v11 được tải từ CDN trong `<head>` trước các script nội bộ ở cuối `<body>`.

| Module | Trang | Chức năng |
| --- | --- | --- |
| `main.js` | Cả ba trang | Menu, newsletter, tiện ích `Adela.notify`, `Adela.isEmail`, `Adela.setError`; giữ tìm kiếm ở chế độ demo |
| `countdown.js` | Trang chủ | Đếm ngược theo thời gian thực, lưu hạn kết thúc trong `sessionStorage` |
| `product-detail.js` | Sản phẩm | Gallery, bàn phím, chọn màu, số lượng, xác nhận màu/tổng tiền và chuyển tới form tư vấn |
| `form-validation.js` | Sản phẩm | Validate tư vấn/bình luận, chọn sao, thêm bình luận vào DOM và cập nhật điểm trung bình |
| `slider.js` | Trang chủ, sản phẩm | Swiper cho feedback và sản phẩm liên quan, nút điều hướng, pagination, vuốt và bàn phím |

`product-detail.js` thay thế `product.js`; không nhúng đồng thời hai phiên bản. Các form chuyên biệt có handler riêng, không dùng handler tìm kiếm demo.

## Cấu hình

- Countdown: `data-duration-seconds="19800"` trên `#flash-countdown` tương ứng 5 giờ 30 phút. Reload cùng tab giữ hạn kết thúc; hết giờ dừng tại `00 : 00 : 00` và báo kết thúc. Xóa khóa `adela-flash-sale-end` trong Session Storage để bắt đầu lại phiên thực hành.
- Giá sản phẩm: thuộc tính `data-price` trên `.current-price`, đơn vị VND. Tổng tiền lấy giá nhân số lượng, định dạng bằng `Intl.NumberFormat('vi-VN')`. Số lượng từ 1 đến 999.
- Điện thoại: `/^0[35789]\d{8}$/`, đúng 10 chữ số. Mẫu này loại bỏ dấu `|` và phép lặp tiền tố ngoài ý muốn của regex minh họa trong kế hoạch.
- Sản phẩm liên quan: 2 slide dưới 600px, 3 slide từ 600px, 5 slide từ 1024px, đồng bộ breakpoint Kế hoạch 02. Feedback: 1 slide trên mobile/tablet, 2 slide từ 1024px. Không bật loop vì số slide hiện tại ít; nút điều hướng tự ẩn khi tất cả slide đã vừa khung.
- Drawer dùng `.open` cho menu, `.active` cho overlay; lớp `nav-open` trên `html/body` khóa cuộn. Tiếp tục hỗ trợ Esc, Tab/Shift+Tab, `inert`, trả focus và đổi breakpoint.

## Dữ liệu và thông báo

Newsletter/tư vấn chỉ validate phía trình duyệt; thông báo thành công ghi rõ bản thực hành chưa gửi lên máy chủ. Bình luận mới chỉ tồn tại trong DOM của trang hiện tại, mất khi reload. Không lưu tên, email, số điện thoại hoặc nội dung bình luận vào storage. Nội dung do người dùng nhập được gán bằng `textContent`, không chèn thành HTML.

Nếu thư viện không có sẵn, thông báo dùng hộp thoại trình duyệt và slider giữ lưới tĩnh. CDN vẫn cần kết nối mạng để có SweetAlert2/Swiper đầy đủ; không che lỗi tải mạng khỏi Console.

SCSS bổ sung ở `components/_slider.scss`, `pages/_product.scss`, `base/_layout.scss`; chạy `npm.cmd run build:css` sau khi chỉnh. Xem [báo cáo kiểm thử](../doc/javascript-validation.md).

Tài liệu API tham khảo: [SweetAlert2](https://sweetalert2.github.io/), [Swiper](https://swiperjs.com/swiper-api). Runtime dùng nhánh v11 theo URL CDN trong HTML, không nâng lên phiên bản major hiện tại của trang tài liệu.
