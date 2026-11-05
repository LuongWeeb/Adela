# Dashboard và REST API — Ngày 6

Mở `html/dashboard.html` trực tiếp hoặc qua máy chủ HTTP phục vụ thư mục `D:\Adela`. Trang dùng script `defer` thông thường và `window.ApiService` để tương thích cả `file://`; không dùng ES module bắt buộc HTTP. Chart.js 4.4.3, SweetAlert2 v11 và font Google cần kết nối mạng.

## Chế độ dữ liệu

Khi thẻ `<meta name="adela-api-base-url" content="">` trong HTML chưa có URL, trang tự dùng dữ liệu mẫu trong localStorage. Đây là cấu hình chạy độc lập khi chưa có backend, không gửi request đến một máy chủ chưa được cấu hình. Mẫu báo cáo cố định tháng 12/2025, biểu đồ từ tháng 1 đến tháng 12/2025, được ghi rõ trên giao diện.

Để kết nối backend, sửa thẻ meta thành:

```html
<meta name="adela-api-base-url" content="http://localhost:5000/api">
```

Hoặc cấu hình lúc chạy:

```js
ApiService.configure({ baseUrl: 'http://localhost:5000/api', timeout: 5000 });
// Nhấn “Làm mới dữ liệu” để tải lại Dashboard bằng cấu hình này.
```

Khi đã cấu hình, Fetch gọi API trước. Lỗi mạng, CORS hoặc timeout 5 giây tự chuyển sang dữ liệu mẫu; các request tiếp theo dùng mẫu trong 30 giây. Sau thời gian đó, request mới thử API trở lại; nút Làm mới bỏ thời gian chờ và thử ngay. Chấm xanh chỉ xuất hiện sau response API thành công. Chấm vàng cho biết dữ liệu Mock. Nếu localStorage bị chặn hoặc hết dung lượng, dữ liệu chuyển sang bộ nhớ phiên và giao diện báo rõ giới hạn lưu trữ.

Các nguồn API và Mock độc lập. Dữ liệu mẫu không phải bản sao dữ liệu thật, không có hàng đợi đồng bộ lên backend. CRUD trong lúc fallback chỉ thay đổi dữ liệu mẫu; không tự gửi lại lên máy chủ. Nếu request ghi mất kết nối sau khi máy chủ đã nhận, frontend không thể xác định chắc chắn thao tác trên server đã hoàn tất; cần kiểm tra dữ liệu máy chủ trước khi thực hiện lại.

## Hợp đồng API

Tất cả giá trị tiền đơn hàng và KPI là **VND**; mảng `revenue` là **triệu VND**. Dashboard gọi lần lượt `GET /dashboard` rồi `GET /orders?limit=5`. Nếu nguồn dữ liệu thay đổi giữa hai request, dashboard được đọc lại để tránh ghép KPI thật với đơn hàng mẫu.

`GET /dashboard` trả trực tiếp đối tượng:

```json
{
  "period": "Tháng 12/2025",
  "year": 2025,
  "kpis": {
    "revenue": 1280000000,
    "revenueGrowth": 12.5,
    "orders": 148,
    "deliveredRate": 85,
    "customers": 326,
    "customerGrowth": 18,
    "inventory": 42,
    "restockModels": 3
  },
  "revenue": [620, 710, 780, 840, 920, 1020, 960, 1080, 1190, 1320, 1380, 1280],
  "categories": [
    { "label": "Tủ rượu vang", "value": 45 },
    { "label": "Tủ cigar", "value": 30 },
    { "label": "Ly rượu vang", "value": 15 },
    { "label": "Decanter & Phụ kiện", "value": 10 }
  ]
}
```

`GET /orders` trả `{ "items": [...], "total": 5, "page": 1, "limit": 5 }`; giao diện cũng nhận mảng trực tiếp. Backend phải sắp xếp mới nhất trước rồi phân trang. Mỗi đơn có cấu trúc:

```json
{
  "id": "AD-1028",
  "customer": "Nguyễn Minh Anh",
  "product": "Tủ rượu Adela 168 chai",
  "createdAt": "2025-12-28T09:45:00+07:00",
  "total": 68500000,
  "status": "delivered"
}
```

Trạng thái: `delivered` (Đã giao), `processing` (Đang xử lý), `pending` (Chờ duyệt). Trạng thái khác hiện “Chưa xác định”. Tìm kiếm trên header lọc mã đơn, khách hàng, sản phẩm trong 5 giao dịch đang tải, không giả lập tìm kiếm toàn hệ thống.

```js
const result = await ApiService.get('/customers', { q: 'An', status: 'new', page: 1, limit: 5 });
const customer = await ApiService.post('/customers', { fullName: 'Khách mẫu', status: 'new' });
await ApiService.put('/customers', customer.id, { status: 'consulting' });
await ApiService.delete('/customers', customer.id);
```

Mock hỗ trợ `/dashboard` chỉ đọc và CRUD `/orders`, `/customers`, gồm GET chi tiết `/{id}`. Danh sách Mock trả `{ items, total, page, limit }`, hỗ trợ `q`, `status`, `page`, `limit` (1–100). POST sinh ID khi chưa có, PUT giữ ID gốc, DELETE trả `null`. Khóa lưu trữ: `adela_dashboard_v1`, `adela_orders_v1`, `adela_crm_customers`. Seed chỉ khởi tạo khi chưa có dữ liệu hợp lệ; một danh sách rỗng vẫn được giữ sau reload.

## HTTP, lỗi và CORS

- Request dùng `Accept: application/json`; POST/PUT thêm `Content-Type: application/json` và body `JSON.stringify(data)`. Query và ID được URL encode.
- `200 OK`: đọc/cập nhật; `201 Created`: tạo mới; `204 No Content`: không đọc JSON, trả `null`.
- `400`, `404`, `500` và mọi HTTP không thành công ném `ApiError` với `status`, `details`. Không chuyển một lỗi nghiệp vụ thành thao tác Mock thành công.
- JSON không hợp lệ cũng báo lỗi. Dashboard có loading spinner, thông báo lỗi và nút thử lại; số liệu cũ được ghi rõ là chưa cập nhật khi tải lỗi.
- Backend khác origin cần cấu hình CORS cho origin frontend, các method GET/POST/PUT/DELETE và header Content-Type. Không dùng `mode: 'no-cors'` vì response opaque không đọc được JSON. Khi kết nối thật nên chạy frontend qua HTTP thay vì origin `null` của `file://`.
- Console trình duyệt vẫn có thể ghi lỗi mạng/CORS/HTTP do trình duyệt phát sinh khi cố ý làm server lỗi; JavaScript bắt lỗi và không tạo exception chưa xử lý. Không che log trình duyệt.

## Giao diện và mã nguồn

`scss/dashboard.scss` kế thừa reset, typography, mixins và bảng màu hiện tại, xuất `css/dashboard.css` bằng `npm.cmd run build:css`. Drawer dùng cùng breakpoint 1025px trong SCSS và JavaScript, hỗ trợ Escape, overlay, vòng focus, `inert` và trả focus. KPI xếp 1/2/4 cột; bảng được cuộn ngang trên điện thoại. Có bảng số liệu doanh thu cho bàn phím/trình đọc màn hình và giảm chuyển động theo hệ điều hành.

CRM là mục thông báo chờ Kế hoạch 06; Sản phẩm mở trang sản phẩm hiện hữu, Đơn hàng dẫn đến bảng giao dịch, Trang chủ mở `index.html`. Cài đặt và thông báo hiển thị phạm vi bản thực hành qua SweetAlert2.

Tài liệu tham khảo chính thức: [Chart.js Line](https://www.chartjs.org/docs/latest/charts/line.html), [Chart.js Doughnut](https://www.chartjs.org/docs/latest/charts/doughnut.html), [MDN Fetch](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch). Runtime giữ đúng Chart.js **4.4.3** theo kế hoạch.
