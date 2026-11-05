# Adela Việt Nam

Phần bổ sung Ngày 5: [Kế hoạch 03B — jQuery, AOS, Lightbox2 và hiệu ứng UI](doc/03b-ui-effects.md), kèm lệnh build, kiểm tra trình duyệt và ảnh nghiệm thu.

Website thương mại điện tử giới thiệu tủ bảo quản rượu vang, tủ cigar, ly rượu và phụ kiện của Adela Việt Nam. **Đã hoàn thành 100% phạm vi bài thực hành Front-End 7 ngày vào 03/11/2026**, gồm ba trang bán hàng, Dashboard và bài cuối khóa Quản lý Kho sản phẩm Adela theo Kế hoạch 06 đã điều chỉnh.

Website gồm năm trang:

| Trang | Đường dẫn | Nội dung |
| --- | --- | --- |
| Trang chủ | [html/index.html](html/index.html) | Banner, danh mục, Flash Sale, sản phẩm, phản hồi khách hàng và tin tức |
| Giới thiệu | [html/about.html](html/about.html) | Thương hiệu, lịch sử, dịch vụ, chính sách và showroom |
| Chi tiết sản phẩm | [html/product.html](html/product.html) | Tủ cigar GF 2180, gallery, chọn màu/số lượng, thông số, tư vấn, bình luận và sản phẩm liên quan |
| Tổng quan quản trị | [html/dashboard.html](html/dashboard.html) | KPI, Chart.js, bảng giao dịch, Fetch API và Mock localStorage |
| Quản lý kho Adela | [html/products-admin.html](html/products-admin.html) | 10 sản phẩm mẫu, CRUD, tìm kiếm, lọc danh mục/tồn kho, phân trang và lưu localStorage |

| Ngày | Phần thực hành | Trạng thái |
| --- | --- | --- |
| 1 | HTML5 semantic, liên kết, ảnh, bảng và form | Hoàn thành |
| 2 | CSS3, bố cục Grid/Flexbox, giao diện từ Figma | Hoàn thành |
| 3 | SCSS modular, biến, mixin, build/watch | Hoàn thành |
| 4 | Responsive, menu mobile, kiểm tra nhiều kích thước | Hoàn thành |
| 5 | JavaScript DOM, event, validation, SweetAlert2/Swiper | Hoàn thành |
| 6 | REST API, JSON, trạng thái tải/lỗi và Dashboard Chart.js | Hoàn thành |
| 7 | Bài tổng hợp Quản lý Kho sản phẩm Adela: CRUD, lọc, tìm kiếm, phân trang, lưu trữ | Hoàn thành |

Trang kho dùng **HTML5, CSS3/SCSS, JavaScript thuần và SweetAlert2**. Không dùng React, Vue, Angular, TypeScript, Tailwind, jQuery hoặc thư viện bảng/dropdown. Hoàn thành chương trình thực hành không đồng nghĩa với điểm chấm chính thức hoặc khớp Figma tuyệt đối.

Đây là bản thực hành giao diện. Các thao tác mua hàng, tìm kiếm và gửi form chưa kết nối backend, chưa tạo đơn hàng hoặc gửi email thực tế.

## Công nghệ và thư viện

| Công nghệ | Vai trò |
| --- | --- |
| HTML5 Semantic | Cấu trúc trang, điều hướng, form có nhãn, bảng thông số có tiêu đề dòng, mô tả ảnh |
| CSS3 Grid / Flexbox | Bố cục responsive, lưới sản phẩm, menu di động và các thành phần giao diện |
| SCSS / Dart Sass | Module dùng `@use`, biến thiết kế, mixin và năm entry point tương ứng năm trang |
| JavaScript / DOM | Sự kiện, countdown, gallery, chọn màu, số lượng, validate và cập nhật bình luận |
| SweetAlert2 11 | Popup xác nhận mua hàng, thông báo lỗi và đăng ký thành công |
| Swiper JS 11 | Slider phản hồi/sản phẩm liên quan, vuốt cảm ứng, Next/Prev và pagination |
| Chart.js 4.4.3 | Biểu đồ doanh thu và cơ cấu sản phẩm trên Dashboard |
| Fetch / localStorage | ApiService cho Dashboard; lưu CRUD kho sản phẩm bền vững trên trình duyệt |
| Node.js / npm | Cài công cụ và biên dịch SCSS; không cần máy chủ Node để xem website |

SweetAlert2 và Swiper được tải từ CDN jsDelivr qua URL `@11` trong HTML; cần Internet để sử dụng đầy đủ. JavaScript nội bộ dùng `defer`. Dự án không sử dụng jQuery hoặc framework giao diện.

## Cấu trúc thư mục

```text
Adela/
├── html/                   # index, about, product, dashboard, products-admin
├── scss/
│   ├── abstracts/          # Biến màu/font/breakpoint và mixin
│   ├── base/               # Reset, typography, layout và accessibility
│   ├── components/         # Header, menu, footer, nút, card và slider
│   ├── pages/              # Giao diện riêng của từng trang
│   ├── index.scss
│   ├── about.scss
│   ├── product.scss
│   ├── dashboard.scss
│   └── products-admin.scss
├── css/                    # CSS đầu ra được biên dịch từ SCSS
├── js/                     # Script bán hàng, api-service, admin-layout, dashboard-charts, products-admin
├── images/                 # Logo, banner, ảnh sản phẩm và nội dung
├── figma-designs/          # Ba mockup PNG gốc dùng đối chiếu
├── plans/                  # Kế hoạch thực hiện 01–06 và checklist
├── doc/                    # Giáo án, báo cáo kiểm thử, JSON và ảnh nghiệm thu
├── scripts/                # Bộ kiểm tra nghiệm thu bằng trình duyệt
├── package.json
├── package-lock.json
└── README.md
```

## Cài đặt và chạy

### 1. Cài công cụ và biên dịch SCSS

Cần **Node.js từ 20.19.0** và npm theo yêu cầu của phiên bản Sass đã khóa trong dự án. Môi trường nghiệm thu dùng Node.js 24.13.0, npm 11.6.2 và Sass 1.107.1.

Mở terminal tại thư mục dự án:

```powershell
cd D:\Adela
npm install
npm run build:css
```

Lệnh build sinh `css/index.css`, `css/about.css`, `css/product.css`, `css/dashboard.css`, `css/products-admin.css` ở định dạng dễ đọc (`expanded`), không sinh source map. Có thể dùng `npm ci` thay cho `npm install` khi cần cài đúng `package-lock.json`.

Để tự biên dịch khi chỉnh SCSS:

```sh
npm run watch:css
```

Nếu PowerShell chặn `npm.ps1`, dùng `npm.cmd install`, `npm.cmd run build:css` hoặc `npm.cmd run watch:css` tương ứng; không cần đổi Execution Policy.

### 2. Xem bằng Live Server

1. Mở thư mục `D:\Adela` bằng Visual Studio Code.
2. Cài extension **Live Server** nếu chưa có.
3. Nhấp phải `html/index.html` → **Open with Live Server**.
4. Dùng menu để chuyển sang Giới thiệu hoặc Chi tiết sản phẩm. URL thường có dạng `http://127.0.0.1:5500/html/index.html`; cổng có thể khác theo cấu hình.

### 3. Mở trực tiếp

Mở `D:\Adela\html\index.html` hoặc `D:\Adela\html\products-admin.html` bằng trình duyệt. Cả năm trang đều có thể mở trực tiếp từ thư mục `html/`. Giữ nguyên cấu trúc thư mục để các đường dẫn `../css/`, `../js/`, `../images/` hoạt động. Dùng Live Server để các trang dùng chung một origin lưu trữ ổn định.

Các file CSS đầu ra đã có sẵn nên có thể xem giao diện ngay. Cần build lại sau khi sửa SCSS; cả Live Server và `file://` đều cần Internet để tải thư viện CDN.

## Chức năng đã hoàn thiện

- Menu di động có overlay, khóa cuộn, điều hướng bàn phím và đóng bằng Esc.
- Flash Sale đếm ngược theo thời gian thực; giữ hạn trong cùng phiên tab và dừng tại `00 : 00 : 00` khi hết giờ.
- Gallery đổi ảnh bằng thumbnail; màu đang chọn có viền và trạng thái `aria-pressed`; số lượng giới hạn từ 1 đến 999.
- “MUA NGAY” mở popup hiển thị màu, số lượng và tổng tiền; xác nhận chuyển tới form tư vấn.
- Form tư vấn kiểm tra họ tên và số điện thoại đúng 10 chữ số, bắt đầu bằng 03, 05, 07, 08 hoặc 09. Newsletter kiểm tra định dạng email.
- Bình luận hỗ trợ chọn sao, validate, thêm nội dung vào DOM an toàn và cập nhật điểm trung bình.
- Swiper hỗ trợ vuốt cảm ứng và Next/Prev. Nút tự ẩn khi toàn bộ slide đã vừa khung ở desktop.

## Tự đánh giá nghiệm thu — Phụ lục B, phạm vi Ngày 1–5

Đối chiếu **Phụ lục B, trang 13** của [giáo án Front-End](doc/Giao_an_Front_End_7_ngay.pdf) và [Kế hoạch 04](plans/04-testing-and-checklist.md). Mỗi nhóm có trọng số 20%. Đây là kết quả tự kiểm tra ngày **02/11/2026**, không phải điểm chấm chính thức.

| Tiêu chí theo giáo án | Trọng số | Kết quả trong phạm vi Ngày 1–5 | Bằng chứng |
| --- | --- | --- | --- |
| HTML5 | 20% | **Đạt các kiểm tra đã thực hiện**: semantic, metadata, nhãn `label for/id`, tên form, alt ảnh, bảng có caption và `th scope="row"` | Kiểm tra cấu trúc cả 3 trang; không trùng ID, không còn CSS/event nội dòng trong mã HTML |
| CSS/SCSS/Responsive | 20% | **Đạt**: SCSS modular, token/mixin, Grid/Flexbox; build thành công; không tràn ngang tại 5 kích thước bắt buộc | 15/15 trường hợp: 3 trang × 375, 430, 768, 1366, 1920px |
| JavaScript/jQuery | 20% | **Đạt bằng JavaScript thuần**: DOM/event, countdown, gallery, chọn màu, số lượng, form, bình luận | Kiểm tra tương tác và `file://`; 0 lỗi Console/JavaScript trong lần chạy |
| API và thư viện | 20% | **Đạt phần thư viện của Ngày 5**: SweetAlert2 và Swiper hoạt động với tài nguyên CDN thật | Popup mua hàng/tư vấn, dữ liệu sai, Next/Prev và cử chỉ cảm ứng mô phỏng; API/JSON chưa thuộc phạm vi nghiệm thu này |
| Hoàn thiện sản phẩm | 20% | **Đạt một phần**: đủ 3 trang, tổ chức source, README, báo cáo và ảnh đối chiếu; chưa khớp mọi chi tiết Figma | Bố cục chính, palette và ảnh tương ứng; còn khác icon, timeline, khoảng cách, tỷ lệ chữ và trang trí Flash Sale/footer |

Bảng trên lưu kết quả lịch sử đến Ngày 5. Phần API/JSON được hoàn thành trong Kế hoạch 05; bài tổng hợp CRUD được hoàn thành trong Kế hoạch 06 bên dưới.

**Kết quả kỹ thuật:** 23 nhóm kiểm tra đạt; 15/15 bố cục responsive đạt; 3/3 trang mở trực tiếp đạt; 0 lỗi Console, 0 lỗi JavaScript chưa xử lý, 0 request thất bại và 0 HTTP lỗi trong lần chạy. Kiểm tra 165 tham chiếu nội bộ không phát hiện file hoặc anchor bị thiếu.

Xem [báo cáo nghiệm thu chi tiết](doc/acceptance-validation.md), [kết quả JSON](doc/acceptance-validation.json) và [ảnh chụp](doc/acceptance-screenshots/).

## Chạy lại kiểm thử trình duyệt

Bộ kiểm tra ở [scripts/acceptance-check.cjs](scripts/acceptance-check.cjs) dùng Google Chrome cài trên máy và Playwright. Đây là công cụ QA tùy chọn, không cần để xem website.

```sh
npm install --no-save --package-lock=false playwright
node scripts/acceptance-check.cjs
```

Script tự mở HTTP server chỉ trên `127.0.0.1` với cổng trống, kiểm tra cả HTTP và `file://`, xuất lại JSON/ảnh trong `doc/`, rồi đóng server và trình duyệt. Khi lỗi, lệnh trả mã thoát khác 0 và ghi trạng thái `failed` vào báo cáo nếu trình duyệt đã khởi chạy. Có thể đặt biến môi trường `ADELA_PLAYWRIGHT_MODULE` trỏ tới module Playwright có sẵn hoặc `ADELA_CHROME_PATH` trỏ tới Chrome nếu dùng vị trí cài tùy chỉnh.

## Phạm vi và lưu ý bảo trì

- Sửa giao diện trong `scss/`, sau đó build; không sửa trực tiếp CSS đầu ra. Lưới dùng `respond-from()` với `min-width`; `respond-to()` với `max-width` được giữ cho các điều chỉnh component cũ.
- Thông tin tư vấn/newsletter chưa được gửi lên máy chủ. Bình luận chỉ lưu trên trang hiện tại và mất khi tải lại. Tìm kiếm, giỏ hàng, tài khoản và thanh toán chưa phải chức năng thương mại thực tế.
- Nội dung minh họa và một số số liệu sản phẩm vẫn theo bản thiết kế; cần biên tập và xác minh trước khi dùng kinh doanh.
- Đã kiểm tra Chrome headless và mô phỏng cảm ứng, chưa kiểm tra điện thoại thật, Safari hoặc Firefox. Kiểm tra cấu trúc HTML cục bộ không thay thế chứng nhận W3C Validator.
- Kết quả không lỗi mạng phản ánh lần chạy với CDN truy cập được. Khi mất mạng, popup có fallback trình duyệt và slider giữ bố cục tĩnh; trải nghiệm thư viện đầy đủ cần CDN.

Tài liệu bảo trì: [SCSS](scss/README.md), [JavaScript](js/README.md), [các kế hoạch thực hiện](plans/README.md).

## Kế hoạch 05 — Dashboard quản trị / Ngày 6

Đã hoàn thành ngày 03/11/2026 tại [html/dashboard.html](html/dashboard.html): sidebar responsive và thu gọn desktop, header quản trị, 4 KPI, biểu đồ doanh thu Line gradient và cơ cấu sản phẩm Doughnut bằng Chart.js 4.4.3, bảng 5 giao dịch với tìm kiếm và badge trạng thái.

`js/api-service.js` cung cấp Fetch GET/POST/PUT/DELETE, query params, xử lý HTTP/JSON, timeout và fallback Mock localStorage. Mặc định chưa có URL backend nên dùng dữ liệu mẫu; điền meta `adela-api-base-url` trong Dashboard để kết nối API. Chấm trạng thái và thông báo lỗi cho biết nguồn dữ liệu. Sidebar chuyển trực tiếp tới Kho sản phẩm, Dashboard và trang chủ; `js/admin-layout.js` dùng chung hành vi sidebar.

Chạy `npm.cmd run build:css` để biên dịch SCSS. Kiểm tra bằng `node scripts/dashboard-check.cjs` với Playwright và Chrome có sẵn như phần hướng dẫn QA phía trên. Kết quả: **13 nhóm kiểm tra và 7 kích thước đạt, không có lỗi runtime chưa xử lý**, có kiểm tra HTTP thật qua fixture và mở `file://`.

Xem [hướng dẫn kết nối và schema API](doc/dashboard-api.md), [báo cáo nghiệm thu](doc/dashboard-validation.md), [kết quả JSON](doc/dashboard-validation.json) và [ảnh Dashboard](doc/dashboard-screenshots/dashboard-1366.png).

## Kế hoạch 06 — Quản lý Kho sản phẩm / Ngày 7

Mở [html/products-admin.html](html/products-admin.html). Trang dùng Navy `#0e1e36`, Gold `#c9a84c`, Đỏ `#e83224`, kế thừa sidebar/header quản trị. Tìm kiếm tên/mã tức thì, hỗ trợ không dấu; kết hợp hai bộ lọc danh mục và tình trạng, phân trang 5 dòng bằng `filter()`/`slice()`. Bảng có thumbnail 50×50, giá VNĐ, giá cũ gạch ngang, số lượng và badge.

Form thêm/sửa kiểm tra tên ít nhất 5 ký tự, giá bán nguyên dương, giá cũ không thấp hơn giá bán (hoặc bỏ trống/0), tồn kho nguyên không âm và ảnh có sẵn. Trạng thái được tính tự động: 0 = hết hàng, 1–5 = sắp hết, >5 = còn hàng. Xóa cần xác nhận SweetAlert2; thêm/sửa/xóa thành công có thông báo. Modal hỗ trợ Esc, focus và khóa cuộn nền; bảng cuộn ngang trong khung trên mobile.

Theo lựa chọn nghiệm thu của người dùng, seed giữ **đúng 10 sản phẩm, giá, tồn kho và ảnh trong [Kế hoạch 06](plans/06-crm-mini-project.md)**. Tổng tồn kho khởi tạo là **118 đơn vị** (chiếc/bộ), một sản phẩm hết hàng. Website [Adela Việt Nam](https://adelavietnam.com.vn/) được đối chiếu ngày 03/11/2026 và hiện có danh mục/giá khác; seed là bộ dữ liệu đào tạo, không phải bản đồng bộ kho hoặc giá trực tuyến.

`ApiService.getProducts(seed)` chỉ khởi tạo khóa `adela_products_data` khi chưa tồn tại; mảng rỗng được giữ nguyên. `ApiService.saveProducts(next, previous)` ghi localStorage trước khi cập nhật DOM, báo lỗi khi bộ nhớ bị chặn/đầy hoặc dữ liệu đã thay đổi ở tab khác. Dữ liệu lỗi không bị ghi đè tự động. Sự kiện `storage` cập nhật danh sách giữa các tab cùng origin; mở lại form nếu một tab khác đã sửa dữ liệu. Kho thực hành không gọi backend và chưa liên kết số liệu KPI mẫu của Dashboard.

Các file chính: [HTML](html/products-admin.html), [SCSS](scss/pages/_products-admin.scss), [entry SCSS](scss/products-admin.scss), [JavaScript](js/products-admin.js), [ApiService](js/api-service.js). CSS đã được build; `npm run watch:css` tự biên dịch khi sửa SCSS.

Kiểm tra lại bằng `node scripts/products-admin-check.cjs` (Playwright/Chrome và biến môi trường như hướng dẫn QA phía trên). Xem [báo cáo Ngày 7](doc/products-admin-validation.md), [JSON](doc/products-admin-validation.json) và [ảnh responsive](doc/products-admin-screenshots/). Khi CDN không truy cập được, chức năng CRUD vẫn dùng dropdown native, thông báo nội bộ và hộp thoại xác nhận trình duyệt.
