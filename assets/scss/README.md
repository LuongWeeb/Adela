# Kiến trúc SCSS — Ngày 3

Kế hoạch 05 bổ sung entry point `dashboard.scss` → `css/dashboard.css`, dùng partial `pages/_dashboard.scss`. Đây là giao diện quản trị độc lập, kế thừa bảng màu hiện có; font Montserrat/Roboto chỉ áp dụng cho Dashboard.

Kế hoạch 06 bổ sung `products-admin.scss` → `css/products-admin.css`, dùng chung `pages/_dashboard.scss` và ghi đè riêng trong `pages/_products-admin.scss`. Trang kho dùng Montserrat/Roboto và màu được yêu cầu: Navy `#0e1e36`, Gold `#c9a84c`, Đỏ `#e83224`. Bảng có `overflow-x: auto`; modal native hỗ trợ viewport nhỏ. Các trang bán hàng giữ bảng màu cũ.

Chỉnh sửa mã nguồn trong `scss/`, sau đó biên dịch ra `css/`. Không sửa trực tiếp CSS được sinh ra.

```sh
npm install
npm run build:css
npm run watch:css
```

Trên PowerShell nếu `npm.ps1` bị chặn bởi Execution Policy, dùng `npm.cmd` thay cho `npm`; không cần thay đổi chính sách của máy.

## Các module

- `abstracts/`: màu sắc, font, khoảng cách, breakpoint và các mixin; không tự sinh CSS.
- `base/`: reset, typography; `_layout.scss` bổ sung chứa container, bố cục chung và tiện ích form/accessibility.
- `components/`: header, navigation, footer, thẻ sản phẩm và nút bấm dùng chung.
- `pages/`: chỉ chứa nội dung riêng của home, about và product. Mỗi trang cung cấp mixin `styles` để entry point kiểm soát thứ tự xuất CSS.
- `index.scss`, `about.scss`, `product.scss`: ba entry point tương ứng với ba file trong `css/` và ba trang trong `html/`.

Các entry point dùng `@use`, không dùng `@import` đã lỗi thời. Các partial có tiền tố `_` nên Sass không sinh thêm file CSS cho chúng.

## Bảo toàn giao diện hiện tại

Giá trị màu/font trong giáo án là mẫu. Đợt chuyển đổi này giữ nguyên giá trị của CSS hiện tại: navy `#052352`, red `#e00000`, gold `#f5d58a`, font thân bài Arial và tiêu đề Times New Roman. Các khai báo Montserrat vốn có của trang sản phẩm được giữ riêng.

Kế hoạch 02 bổ sung `respond-from()` dùng `min-width` cho các lưới Mobile First. Danh mục dùng 2 cột dưới 430px, 3 cột từ 430px và 6 cột từ 1024px. Lưới sản phẩm dùng 2 cột dưới 600px, 3 cột từ 600px và 5 cột từ 1024px. Gallery/thông tin sản phẩm dùng lần lượt 1/2/3 cột tại các ngưỡng 600px và 1024px; bảng thông số/form tư vấn dùng 1/2 cột tại 600px.

Menu dùng `.nav`, `.nav-menu`: drawer đến hết 768px, menu ngang từ 769px. JavaScript dùng chung trong `js/main.js` đồng bộ `.open`, `aria-expanded`, focus, `inert` và khóa cuộn nền. Thay đổi breakpoint menu phải cập nhật cả SCSS lẫn `matchMedia` trong JavaScript.

`respond-to()` dùng `max-width` vẫn được giữ cho các điều chỉnh cỡ chữ, khoảng cách và component cũ. Ví dụ:

```scss
@use '../abstracts/variables' as *;
@use '../abstracts/mixins' as *;

.example {
  color: $color-navy;

  @include respond-to('layout-mobile') {
    font-size: 14px;
  }
}
```

Entry point xuất responsive dùng chung trước các ghi đè của trang about/product. Biến thể thẻ sản phẩm và nút của trang chi tiết được định nghĩa trong component và chỉ được gọi bởi `pages/_product.scss`. Các CSS custom properties của trang sản phẩm được giữ cho các quy tắc SCSS; Kế hoạch 04 đã chuyển toàn bộ style nội dòng trong HTML sang các class SCSS.

Đường dẫn tài nguyên trong `html/*.html` dùng `../css/`, `../js/`, `../images/`. Ảnh nền trong SCSS dùng `../images/` vì URL sẽ được trình duyệt phân giải từ file đầu ra trong `css/`.

Mở `html/index.html`, `html/about.html` hoặc `html/product.html` trực tiếp, hoặc phục vụ thư mục gốc dự án bằng một máy chủ tĩnh.
