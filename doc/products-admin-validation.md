# Nghiệm thu Kế hoạch 06 — Quản lý Kho sản phẩm Adela

Ngày nghiệm thu: **03/11/2026**. Phạm vi: bài cuối khóa Ngày 7 chuyển từ CRM khách hàng sang kho sản phẩm theo yêu cầu người dùng và bản Kế hoạch 06 hiện tại.

## Kết quả

- `npm.cmd run build:css`: thành công; sinh `css/products-admin.css` từ SCSS.
- Kiểm tra cú pháp Node cho `products-admin.js`, `api-service.js`, `admin-layout.js`, `dashboard-charts.js`: đạt.
- **13/13 nhóm kiểm tra kho sản phẩm đạt**, **7/7 kích thước responsive đạt**, **0 lỗi Console/JavaScript** trong luồng online đã kiểm tra.
- Kiểm tra hồi quy Dashboard: **13/13 nhóm đạt**, gồm API/Mock CRUD, biểu đồ, tìm kiếm, drawer, HTTP/error/fallback và mở file trực tiếp.
- Các liên kết/tài nguyên nội bộ trong hai trang quản trị tồn tại. Đã xem ảnh desktop 1366px, mobile 375px và modal 375px.

Chi tiết máy đọc: [JSON kho](products-admin-validation.json), [JSON Dashboard](dashboard-validation.json). Bộ chạy: [products-admin-check.cjs](../scripts/products-admin-check.cjs).

## Các tình huống đã kiểm tra

| Nhóm | Kiểm tra |
| --- | --- |
| Seed & thư viện | Đúng 10 sản phẩm, giá/ảnh Kế hoạch 06, tồn kho 118, 1 sản phẩm hết hàng; SweetAlert2 thật; không nạp jQuery/framework |
| Tìm kiếm & lọc | Tên/mã, không dấu, kết hợp danh mục và trạng thái, kết quả trống |
| Phân trang | 5 dòng/trang, số trang, Trước/Sau, nút biên bị vô hiệu hóa |
| Responsive & accessibility | 375, 430, 768, 1024, 1025, 1366, 1920px; cuộn bảng trong khung; drawer, Esc, inert, thu gọn sidebar; modal không tràn ngang |
| Validation | Tên dưới 5 ký tự, giá 0, tồn kho thập phân, giá niêm yết thấp hơn giá bán đều bị chặn |
| Thêm | Chọn ảnh/xem trước, tạo mã, cập nhật DOM, toast, dữ liệu giữ nguyên sau reload |
| Sửa | Giữ ID/ngày tạo; sửa giá/tồn kho; kiểm tra ngưỡng 0/5/6; tên chứa HTML hiển thị như văn bản |
| Xóa | Hủy giữ dữ liệu; xác nhận mới xóa; xóa dòng cuối trang tự quay về trang hợp lệ |
| Nhiều tab | Danh sách nhận cập nhật; form cũ không ghi đè dữ liệu đã thay đổi ở tab khác |
| Lỗi ghi storage | Giả lập hết dung lượng; không báo thành công, giữ form và dữ liệu trước đó |
| Rỗng/lỗi đọc | `[]` không tự seed lại; JSON hỏng được giữ nguyên, hiển thị lỗi và khóa chỉnh sửa |
| Điều hướng | Dashboard → Kho → Dashboard; về `index.html`; active sidebar đúng trang |
| Mở trực tiếp/offline | `file://` chạy được; chặn CDN vẫn thêm sản phẩm, có toast nội bộ, hủy xác nhận xóa vẫn giữ dữ liệu |

## Dữ liệu và phạm vi

Seed lấy đúng Kế hoạch 06 theo lựa chọn của người dùng. Đã đối chiếu [website Adela](https://adelavietnam.com.vn/) ngày 03/11/2026: tên/giá công khai hiện khác bộ seed trong giáo án. Không coi dữ liệu giá/tồn kho thực hành là dữ liệu kinh doanh trực tuyến. Ảnh lấy từ `images/`, không tải thêm ảnh ngoài.

Kho chỉ lưu `localStorage['adela_products_data']` qua `ApiService.getProducts()` và `saveProducts()`. Các endpoint REST Ngày 6 vẫn hoạt động độc lập trên Dashboard. Trang kho không gửi thay đổi lên website Adela, không thay đổi số liệu KPI mẫu và không yêu cầu backend.

Nguồn SCSS trang kho dùng Navy `#0e1e36`, Gold `#c9a84c`, Đỏ `#e83224`. HTML sử dụng bảng semantic, nhãn form và dialog native; tương tác dùng JavaScript thuần, `filter()`, `slice()`, DOM và SweetAlert2. Không có React/Vue/Angular/TypeScript/Tailwind/Select2.

## Chạy lại

```powershell
npm.cmd run build:css
# Nếu chưa có Playwright phục vụ QA:
npm.cmd install --no-save --package-lock=false playwright
node scripts/products-admin-check.cjs
node scripts/dashboard-check.cjs
```

Có thể đặt `ADELA_PLAYWRIGHT_MODULE` trỏ tới Playwright có sẵn và `ADELA_CHROME_PATH` trỏ tới Chrome. Script dùng server loopback với cổng trống, context kiểm thử riêng, tự đóng browser/server và ghi lại JSON/ảnh; không sửa kho đang mở của người dùng.

Giới hạn nghiệm thu: Chrome headless và viewport mô phỏng, chưa chạy Safari/Firefox hoặc thiết bị thật. CDN cần Internet để hiển thị SweetAlert2 đầy đủ; trường hợp cố ý chặn CDN được kiểm tra riêng với fallback. Kết quả không thay thế điểm chấm chính thức hoặc chứng nhận W3C.

Ảnh: [desktop](products-admin-screenshots/products-1366.png), [mobile](products-admin-screenshots/products-375.png), [modal mobile](products-admin-screenshots/modal-375.png).
