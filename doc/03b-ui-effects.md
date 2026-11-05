# Kế hoạch 03B — hiệu ứng UI Ngày 5

Áp dụng cho `html/index.html`, `html/about.html`, `html/product.html`.

- CDN trong `<head>`: jQuery **3.7.1**, AOS **2.3.4**, Lightbox2 **2.11.4**. Các script dùng `defer` theo đúng thứ tự phụ thuộc.
- `js/effects.js`: Back-To-Top xuất hiện sau 300px, cuộn lên đầu trong 600ms; sticky header sau 100px; FAQ dùng `slideToggle(300)`; tab dùng `fadeIn(350)`; AOS chạy một lần với duration 800ms, offset 120px.
- `scss/components/_effects.scss`: sticky header, FAQ, tab và hỗ trợ giảm chuyển động. Nút Navy viền Gold nằm trong `scss/components/_buttons.scss`. Ba entry SCSS đã import và include effects.
- Gallery sản phẩm gồm ảnh chính và bốn thumbnail liên kết bằng `data-lightbox="cigar-gallery"`. Chọn thumbnail vẫn cập nhật ảnh chính và đồng bộ đường dẫn phóng to trong `js/product-detail.js`.
- Ba tab: Đặc điểm công nghệ, Thông số kỹ thuật, Chính sách bảo hành 6 năm. Tab hỗ trợ phím mũi tên, Home/End. FAQ dùng button, trạng thái `aria-expanded` và icon +/−, chỉ mở một câu trả lời.
- Trang chủ chuyển từ phần nhúng `effect.js` sang `effects.js` để tránh xử lý trùng; file cũ được giữ lại nhưng không còn được nhúng.

Thông tin bảo hành sẵn có đang ghi cả 12 tháng và 6 năm. Tab mới hướng dẫn xác nhận thời hạn theo model và phiếu bảo hành, không tự suy diễn điều kiện thương mại.

Giới hạn ảnh nguồn: bốn file `thumb-1.png` đến `thumb-4.png` chỉ có kích thước 88×88px. Lightbox mở đúng ảnh nhưng cần bản gốc độ phân giải cao để xem các thumbnail ở kích thước lớn, sắc nét.

## Build và kiểm tra

```powershell
npm.cmd run build:css
node scripts/effects-check.cjs
```

Trên PowerShell chặn `npm.ps1`, dùng `npm.cmd` như trên. Script QA dùng Playwright và Chrome đã cài; nếu Playwright không nằm trong project, đặt `ADELA_PLAYWRIGHT_MODULE` đến module có sẵn.

Script mở HTTP server tạm trên loopback và Chrome headless, gọi CDN thật; kiểm tra cuộn, sticky header, AOS, Lightbox, thao tác nhanh trên FAQ/tab, bàn phím, menu di động, bố cục 375/768/1366px, mở bằng `file://` và chế độ giảm chuyển động. Server và trình duyệt được đóng sau kiểm tra.

Kết quả và ảnh: [report.json](effects-check/report.json), [tab và FAQ desktop](effects-check/product-tabs-faq-desktop.png), [FAQ mobile](effects-check/product-faq-mobile.png), [tab mobile](effects-check/product-tabs-mobile.png), [Lightbox desktop](effects-check/product-lightbox-desktop.png), [Lightbox mobile](effects-check/product-lightbox-mobile.png).

Tham khảo API: [jQuery slideToggle](https://api.jquery.com/slideToggle/), [Lightbox2](https://lokeshdhakar.com/projects/lightbox2/), [AOS v2](https://github.com/michalsnik/aos/tree/v2).
