# Nghiệm thu Kế hoạch 05 — 03/11/2026

Đã mở `html/dashboard.html` bằng Google Chrome headless qua Playwright, kiểm tra cả HTTP localhost và `file://`. Chart.js **4.4.3**, SweetAlert2 **11** và Google Fonts được tải thật từ mạng trong luồng bình thường. Sự kiện Console error, pageerror, requestfailed và HTTP ≥400 được thu thập tự động; không thao tác F12 thủ công.

## Kết quả

- **13/13 nhóm kiểm tra đạt**, **7/7 kích thước responsive đạt**: 375, 430, 768, 1024, 1025, 1366, 1920px.
- Không tràn ngang toàn trang, không cắt giá trị KPI. Bảng đơn hàng có vùng cuộn ngang riêng trên mobile.
- **0 lỗi runtime chưa xử lý; 0 lỗi Console/network ngoài dự kiến**. Những luồng cố ý tạo HTTP 400/404/500, ngắt mạng và timeout có 12 bản ghi Console/Network dự kiến, được tách riêng trong JSON. Không chặn hoặc ghi đè `console.error`.
- `npm.cmd run build:css` thành công, sinh `css/dashboard.css`; `node --check` đạt cho hai file JavaScript ứng dụng và script kiểm thử.
- Đã xem ảnh đầy đủ của trang desktop 1366px và mobile 375px để kiểm tra bố cục, KPI, biểu đồ và bảng giao dịch.

## Phạm vi đã kiểm tra

| Nhóm | Kết quả |
| --- | --- |
| Khởi tạo | Đúng phiên bản CDN, 4 KPI, 2 Chart instance, 5 đơn hàng, 4 nhóm sản phẩm, 12 dòng doanh thu truy cập được bằng bàn phím |
| Tooltip | Hover trên biểu đồ doanh thu cho giá trị VND có dấu phân cách hàng nghìn |
| Responsive | KPI 1/2/4 cột, drawer đến 1024px, sidebar desktop từ 1025px, thu/mở rộng desktop |
| Drawer | Focus vào nút đóng ngay khi mở, Tab/Shift+Tab giữ trong menu, Escape/overlay/link đóng menu, trả focus, đổi breakpoint mở lại tương tác nền |
| Tìm kiếm | Lọc khách hàng, trạng thái rỗng khi không có kết quả, làm mới bảng, SweetAlert2 ở mục CRM |
| Mock CRUD | GET query, POST, PUT giữ ID, DELETE, lỗi ID trùng/không tồn tại, dữ liệu được giữ sau reload |
| HTTP CRUD | Request thật tới fixture HTTP, query encode đúng, JSON headers/body, đủ GET/POST/PUT/DELETE, xử lý 201 và 204 |
| Lỗi API | 400/404/500 không bị che bằng thành công Mock; lỗi JSON và schema báo trên giao diện, không sửa dữ liệu mẫu |
| Lỗi kết nối | Ngắt request và timeout chuyển sang Mock; làm mới khôi phục REST API khi kết nối hoạt động |
| Dữ liệu không tin cậy | Storage JSON hỏng được phục hồi; chuỗi có thẻ HTML trong đơn hàng hiển thị dạng text, không tạo DOM thực thi |
| Storage bị chặn | Dùng bộ nhớ phiên, hiện thông báo đúng, vẫn tải đủ 5 đơn |
| Chart.js không có | Mô phỏng script rỗng: hiện cảnh báo, giữ bảng số liệu và giao dịch, không có runtime exception |
| Mở file trực tiếp | Tải đủ dữ liệu và biểu đồ trên `file:///D:/Adela/html/dashboard.html` |

## Bằng chứng và chạy lại

- [Kết quả JSON](dashboard-validation.json)
- [Ảnh desktop](dashboard-screenshots/dashboard-1366.png) · [Ảnh mobile](dashboard-screenshots/dashboard-375.png)
- [Script kiểm tra](../scripts/dashboard-check.cjs)
- [Hướng dẫn API và schema dữ liệu](dashboard-api.md)

```powershell
$env:ADELA_PLAYWRIGHT_MODULE='C:/Users/LUONG/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright'
node scripts/dashboard-check.cjs
```

Trên máy khác, dùng module Playwright sẵn có hoặc cài công cụ QA tùy chọn rồi đặt đường dẫn phù hợp; script mặc định `require('playwright')` và sử dụng Chrome cài trên máy. Script tự tạo server trên loopback với cổng trống và đóng server/trình duyệt sau kiểm tra. Không bổ sung dependency QA vào package của website.

Chưa có backend kinh doanh thực tế: phần REST được kiểm tra bằng server fixture HTTP cục bộ. Chưa kiểm tra điện thoại vật lý, Safari/Firefox hoặc CORS của backend thực. Kết quả không lỗi khi sử dụng bình thường phụ thuộc CDN truy cập được. CRM, xác thực và đồng bộ dữ liệu offline lên server thuộc phạm vi khác.
