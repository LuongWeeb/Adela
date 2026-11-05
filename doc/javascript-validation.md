# Kiểm thử Kế hoạch 03 — 02/11/2026

Thực hiện trên Google Chrome cài tại máy, chạy headless qua Playwright, phục vụ dự án bằng HTTP localhost. Các thư viện được tải thật từ CDN jsDelivr; không mock SweetAlert2 hoặc Swiper. Bắt sự kiện Console error, pageerror, requestfailed và HTTP ≥400 để kiểm tra tương đương luồng lỗi trong Console/Network; không thao tác thủ công bằng F12.

## Kết quả

- 16 nhóm kiểm thử tương tác đạt, bao gồm cả ba trang.
- 15 trường hợp responsive đạt: 3 trang × 375, 430, 768, 1366, 1920px. Không có tràn ngang toàn trang; phần slide nằm ngoài khung Swiper được loại khỏi phép đo tọa độ vì đó là nội dung cuộn có chủ đích.
- **0 lỗi Console, 0 lỗi JavaScript chưa xử lý, 0 request thất bại, 0 HTTP lỗi** trong lần kiểm tra.
- SweetAlert2 thuộc major 11; script/CSS CDN của cả hai thư viện tải thành công trên ba trang.
- `npm.cmd run build:css` thành công; các file JavaScript qua kiểm tra cú pháp của Node.

## Các trường hợp đã kiểm tra

| Chức năng | Kiểm tra |
| --- | --- |
| Menu trên ba trang | Mở drawer, overlay `.active`, khóa cuộn, đóng bằng overlay/Esc, chuyển về desktop và mở lại tương tác nền |
| Newsletter trên ba trang | Email sai báo lỗi, email đúng hiện SweetAlert2 success và reset form |
| Countdown | Giá trị thay đổi sau một giây, định dạng 2 chữ số, reload giữ hạn, hết giờ dừng ở 0 |
| Gallery | Click/Enter đổi ảnh, chọn nhanh nhiều ảnh không bị ảnh cũ ghi đè, chỉ một thumbnail active, viền 2px và opacity trở về 1 |
| Số lượng và mua hàng | Tối thiểu 1, tăng lên 2, tổng tiền 80.000.000đ, hủy popup, xác nhận cuộn tới tư vấn và focus họ tên |
| Tư vấn | Tên quá ngắn; điện thoại sai độ dài, đầu số, chữ, dấu `|`, tiền tố lặp; chấp nhận đủ nhóm đầu số 03/05/07/08/09; success reset form |
| Bình luận | Chọn sao bằng click/phím mũi tên; nội dung quá ngắn/email sai bị chặn; thêm đúng một bình luận, số sao và điểm trung bình cập nhật; reset form; không reload |
| Nội dung bình luận | Chuỗi chứa thẻ HTML hiển thị như văn bản, không tạo ảnh/script từ dữ liệu người dùng |
| Swiper | Số slide đúng breakpoint, nút tiếp theo hoạt động, mô phỏng cử chỉ cảm ứng qua Chrome DevTools Protocol trên mobile cho cả hai slider |

Đã xem ảnh popup mua hàng, popup tư vấn, feedback mobile, sản phẩm liên quan mobile và bình luận mới. Sau kiểm tra hình ảnh, phần giữ xuống dòng được giới hạn cho bình luận người dùng nhập để không hiển thị khoảng trắng thụt dòng của HTML mẫu.

## Bằng chứng và giới hạn

- [Kết quả chi tiết JSON](javascript-validation.json)
- [Ảnh chụp giao diện](javascript-screenshots/)
- Script kiểm tra tại `.tmp-scss/javascript-check.cjs`, dùng Playwright có sẵn trong môi trường; không thêm dependency vào dự án.
- Chưa kiểm thử trên điện thoại thật hoặc các trình duyệt khác Chrome. Kết quả 0 lỗi phản ánh lần chạy với CDN hoạt động, không phải cam kết về tình trạng mạng trong tương lai.
- Không có backend: form chỉ validate và thông báo demo; bình luận chỉ lưu trong DOM hiện tại.
