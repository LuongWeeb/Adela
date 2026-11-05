# Nghiệm thu Kế hoạch 04 — 02/11/2026

Phạm vi: website Adela Việt Nam tại `html/index.html`, `html/about.html`, `html/product.html`, đối chiếu giáo án đến hết Ngày 5 và checklist Kế hoạch 04. Phụ lục B gốc ở trang 13 gồm năm nhóm, mỗi nhóm 20%; phần API của chương trình đầy đủ chưa được nghiệm thu trong đợt này.

## Những điểm đã sửa

- Chuyển lựa chọn màu từ `div` tĩnh thành nút có tên truy cập, trạng thái `aria-pressed` và viền active; hỗ trợ click, Enter/Space và hiển thị màu trong popup mua hàng.
- Bổ sung mô tả cho sáu ảnh danh mục trang Giới thiệu và bốn ảnh đánh giá sản phẩm; tất cả ảnh HTML có alt không rỗng.
- Bổ sung tên truy cập cho tám form và liên kết `for/id` rõ ràng cho năm ô chọn sao; mọi input/textarea có label liên kết.
- Bổ sung caption và chín tiêu đề dòng `th scope="row"` cho bảng thông số, cập nhật SCSS để giữ định dạng bảng.
- Chuyển toàn bộ CSS nội dòng trong ba file HTML sang SCSS; dùng tiện ích `visually-hidden` cho h1 trang chủ. Không còn thẻ style, style attribute hoặc event handler nội dòng trong mã HTML gốc. Thư viện có thể tự sinh style khi chạy.
- Tạo README tổng quan và bộ kiểm tra trình duyệt có thể chạy lại; cập nhật tài liệu SCSS/JavaScript.

## Phương pháp

- Google Chrome cài trên máy, chạy headless qua Playwright. Thu sự kiện `console.error`, `pageerror`, `requestfailed` và response HTTP từ 400 trở lên; không thao tác thủ công bằng F12.
- Tải SweetAlert2 11 và Swiper 11 thật từ CDN; không mock thư viện hoặc đáp ứng mạng.
- Duyệt cả HTTP localhost và `file://`; giải mã tất cả ảnh để phát hiện tài nguyên hỏng.
- Responsive: đo `documentElement.scrollWidth`, `body.scrollWidth`, CSS `overflow-x` và tọa độ phần tử con. Nội dung nằm ngoài khung slide và drawer đóng là cuộn/ẩn có chủ đích, được loại khỏi phép đo tọa độ. Không chỉ dựa vào `overflow-x: hidden`.
- Kiểm tra cấu trúc HTML bằng DOM của Chrome, kiểm tra style nội dòng từ source, đối chiếu đường dẫn file/anchor cục bộ. Chưa chạy dịch vụ W3C Validator.
- Chụp ảnh toàn trang tại năm viewport bắt buộc, xem các ảnh mobile, popup mua hàng/tư vấn, slider mobile và đối chiếu bố cục desktop với ba PNG Figma.

## Kết quả

| Hạng mục | Kết quả |
| --- | --- |
| `npm.cmd run build:css` | Thành công, Sass 1.107.1; sinh đúng ba CSS dạng expanded, không source map |
| Cú pháp JavaScript | Năm module trong `js/` qua `node --check` |
| Kiểm tra trình duyệt | 23 nhóm đạt |
| Responsive | 15/15 trường hợp đạt |
| Mở trực tiếp | 3/3 trang `file://` đạt |
| Console error / JavaScript exception | 0 / 0 |
| Request thất bại / HTTP lỗi | 0 / 0 |
| File và anchor nội bộ | 165 tham chiếu được kiểm tra, 0 lỗi |

| Trang | 375px | 430px | 768px | 1366px | 1920px |
| --- | --- | --- | --- | --- | --- |
| Trang chủ | Đạt | Đạt | Đạt | Đạt | Đạt |
| Giới thiệu | Đạt | Đạt | Đạt | Đạt | Đạt |
| Sản phẩm | Đạt | Đạt | Đạt | Đạt | Đạt |

Các luồng kiểm tra gồm menu/overlay/Esc/đổi viewport, newsletter sai và đúng, countdown chạy/giữ hạn/hết giờ, gallery click/bàn phím/chọn nhanh, chọn màu và nội dung popup, số lượng chặn ở 1 và 999, tổng tiền, hủy/xác nhận mua hàng, form tư vấn, bình luận và sao. Bình luận chứa HTML được hiển thị như văn bản. Next và Prev cùng cử chỉ cảm ứng qua Chrome DevTools Protocol đều chuyển slide ở hai slider mobile.

Ở `file://`, kiểm tra tải ảnh, menu, newsletter trên cả ba trang; countdown trang chủ; gallery, chọn màu, số lượng, mua hàng và tư vấn trang sản phẩm; Next của hai slider. Ma trận responsive và kiểm tra sâu bình luận/đầu số điện thoại chạy qua HTTP.

## Đối chiếu thiết kế và kết luận

Ba trang sử dụng đúng bộ ảnh có sẵn, palette navy/đỏ/vàng và trình tự các khối chính tương ứng mockup. Giao diện mobile hiển thị được nội dung, form và popup trong khung 375px.

**Chưa đạt mức khớp mọi chi tiết Figma:** một số icon dùng ký tự/emoji, timeline Giới thiệu khác cách bố trí mốc, trang trí Flash Sale/footer giản lược, khoảng cách và tỷ lệ chữ còn khác. Việc thêm label hiển thị giúp sử dụng form rõ ràng hơn nhưng cũng làm chiều cao form khác mockup. Chưa có phép đo hoặc kết luận khớp từng pixel; đối chiếu desktop mang tính định tính.

Kết luận tự đánh giá: các kiểm tra HTML, build/responsive, JavaScript và thư viện trong phạm vi đã chạy đều đạt; tiêu chí hoàn thiện/khớp thiết kế đạt một phần. Không công bố điểm 100/100. API/backend, thanh toán thật và toàn bộ nội dung chương trình Ngày 6–7 nằm ngoài phạm vi.

## Bằng chứng và chạy lại

- [Kết quả trình duyệt](acceptance-validation.json): trạng thái tổng thể, 23 nhóm kiểm tra, HTML, 15 bố cục, ba trang file, phản hồi CDN và lỗi.
- [Kiểm tra liên kết nội bộ](acceptance-links.json).
- [21 ảnh nghiệm thu](acceptance-screenshots/): 15 ảnh toàn trang và sáu ảnh popup/bình luận/slider.
- [Script kiểm tra](../scripts/acceptance-check.cjs); xem [hướng dẫn chạy lại](../README.md#chạy-lại-kiểm-thử-trình-duyệt).

Chưa thử điện thoại thật hoặc trình duyệt ngoài Chrome. Không lỗi Console/mạng là kết quả tại thời điểm chạy với Internet hoạt động. Dữ liệu và form vẫn là bản thực hành, chưa lưu hoặc gửi lên máy chủ. Tài liệu các Kế hoạch 01–03 giữ lại làm lịch sử; báo cáo này mô tả lần nghiệm thu cuối.
