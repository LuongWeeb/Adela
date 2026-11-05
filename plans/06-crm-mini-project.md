# KẾ HOẠCH 06: HỆ THỐNG QUẢN LÝ KHO SẢN PHẨM ADELA VIỆT NAM (PRODUCT CRUD)

## 1. MỤC TIÊU
Thực hiện toàn bộ kỹ thuật và tiêu chí đánh giá của **Ngày 7 (Dự án tổng hợp cuối khóa)** áp dụng trực tiếp vào nghiệp vụ cốt lõi của website thương mại điện tử Adela: **Quản lý danh mục & kho hàng sản phẩm Adela (Tủ rượu vang, Tủ cigar, Ly pha lê & Decanter)**.

* **File giao diện:** `html/products-admin.html` (được gắn liên kết trực tiếp trên Sidebar của `html/dashboard.html`).
* **Kỹ thuật trọng tâm đạt chuẩn Ngày 7:**
  1. Trọn vẹn chu trình **CRUD** (Thêm sản phẩm mới, Xem danh sách bảng, Sửa giá/tồn kho, Xóa sản phẩm có xác nhận).
  2. **Tìm kiếm thời gian thực** (Search by name / code).
  3. **Bộ lọc danh mục kép** (Lọc theo dòng Tủ vang / Tủ cigar / Ly / Decanter và Lọc theo tình trạng tồn kho).
  4. **Phân trang dữ liệu** (Pagination).
  5. **Modal Form** thêm mới/chỉnh sửa kèm validation chặt chẽ và thông báo **SweetAlert2**.
  6. Lưu trữ dữ liệu bền vững qua `localStorage` và `ApiService`.

---

## 2. ĐẶC TẢ DỮ LIỆU SẢN PHẨM ADELA

Mỗi sản phẩm trong kho Adela gồm các trường thông tin chuẩn sau:

```typescript
interface AdelaProduct {
  id: string;             // Mã sản phẩm: "ADL-SP01", "ADL-SP02",...
  name: string;           // Tên sản phẩm: "Tủ bảo quản cigar 1800 điếu GF 2180"
  category: string;       // Danh mục: "cigar-cabinet" | "wine-cabinet" | "wine-glass" | "decanter" | "accessory"
  categoryName: string;   // Tên hiển thị: "Tủ bảo quản cigar" | "Tủ rượu vang" | "Ly rượu vang" | "Decanter" | "Phụ kiện"
  price: number;          // Giá bán hiện tại (VNĐ): 40000000
  originalPrice: number;  // Giá niêm yết cũ: 48000000
  stock: number;          // Số lượng tồn kho thực tế: 15
  status: string;         // Tình trạng: "in_stock" (Còn hàng) | "low_stock" (Sắp hết) | "out_of_stock" (Hết hàng)
  image: string;          // Đường dẫn ảnh sản phẩm (lấy từ thư mục ../images/)
  createdAt: string;      // Ngày nhập kho: "2026-10-15"
}
```

---

## 3. DANH SÁCH 10 SẢN PHẨM MẪU BAN ĐẦU (SEED DATA THỰC TẾ ADELA)

Khởi tạo sẵn 10 sản phẩm chuẩn của Adela có sẵn ảnh trong thư mục `images/`:

1. **ADL-SP01** — *Tủ bảo quản cigar 1800 điếu cắm điện GF 2180*
   * Danh mục: Tủ bảo quản cigar | Giá: 40.000.000₫ (Gốc: 48.000.000₫) | Tồn kho: 8 chiếc | Trạng thái: Còn hàng | Ảnh: `../images/main-product.png`
2. **ADL-SP02** — *Tủ rượu vang nhỏ gọn Vinocave 28 chai sang trọng*
   * Danh mục: Tủ rượu vang | Giá: 6.250.000₫ (Gốc: 8.250.000₫) | Tồn kho: 22 chiếc | Trạng thái: Còn hàng | Ảnh: `../images/cabinet-1.png`
3. **ADL-SP03** — *Tủ rượu vang Vinocave 22 chai JC76A gọn gàng*
   * Danh mục: Tủ rượu vang | Giá: 13.800.000₫ (Gốc: 18.250.000₫) | Tồn kho: 5 chiếc | Trạng thái: Sắp hết | Ảnh: `../images/cabinet-2.png`
4. **ADL-SP04** — *Tủ cigar rượu vang mini Golden Fire 2 in 1 H737*
   * Danh mục: Tủ bảo quản cigar | Giá: 6.250.000₫ (Gốc: 8.250.000₫) | Tồn kho: 14 chiếc | Trạng thái: Còn hàng | Ảnh: `../images/cabinet-4.png`
5. **ADL-SP05** — *Tủ bảo quản rượu vang lớn Golden Fire 85 chai*
   * Danh mục: Tủ rượu vang | Giá: 40.000.000₫ (Gốc: 48.250.000₫) | Tồn kho: 3 chiếc | Trạng thái: Sắp hết | Ảnh: `../images/cabinet-5.png`
6. **ADL-SP06** — *Ly rượu vang đỏ RIEDEL Performance OP Cabernet*
   * Danh mục: Ly rượu vang | Giá: 4.200.000₫ (Gốc: 5.250.000₫) | Tồn kho: 45 bộ | Trạng thái: Còn hàng | Ảnh: `../images/glass-1.png`
7. **ADL-SP07** — *Ly rượu Champagne RIEDEL Performance OP*
   * Danh mục: Ly rượu vang | Giá: 4.200.000₫ (Gốc: 5.250.000₫) | Tồn kho: 0 bộ | Trạng thái: Hết hàng | Ảnh: `../images/glass-2.png`
8. **ADL-SP08** — *Bình chiết rượu vang cao cấp Riedel Decanter Amadeo*
   * Danh mục: Decanter | Giá: 6.200.000₫ (Gốc: 8.250.000₫) | Tồn kho: 12 chiếc | Trạng thái: Còn hàng | Ảnh: `../images/accessory-1.png`
9. **ADL-SP09** — *Bình chiết rượu vang Zalto Decanter Axium*
   * Danh mục: Decanter | Giá: 5.450.000₫ (Gốc: 8.250.000₫) | Tồn kho: 7 chiếc | Trạng thái: Còn hàng | Ảnh: `../images/accessory-2.png`
10. **ADL-SP10** — *Máy chiết rượu vang Coravin Model Six màu đỏ vang*
    * Danh mục: Phụ kiện | Giá: 11.545.200₫ (Gốc: 16.250.000₫) | Tồn kho: 2 chiếc | Trạng thái: Sắp hết | Ảnh: `../images/accessory-3.png`

---

## 4. CẤU TRÚC GIAO DIỆN VÀ TÍNH NĂNG TRÊN TRANG `html/products-admin.html`

### 4.1. Bố cục Quản trị Adela (Admin Products Layout):
* **Sidebar thương hiệu Adela:**
  * Logo vàng gold `Adela Admin`.
  * Menu điều hướng:
    * 📊 **Tổng quan (Dashboard)** — chuyển tới `dashboard.html`.
    * 🍷 **Quản lý sản phẩm Adela** — trang hiện tại (`products-admin.html`).
    * 🛒 **Đơn hàng & Giao dịch**.
    * 🌐 **Xem trang bán hàng** — chuyển về `index.html`.
* **Header quản trị:**
  * Thống kê nhanh: *"Tổng sản phẩm: 10 | Tồn kho: 118 chiếc | Hết hàng: 1"*.
  * Nút chuyển nhanh giữa các trang.

---

### 4.2. Thanh công cụ (Toolbar):
1. **Ô tìm kiếm tức thì:** Tìm kiếm theo Tên sản phẩm hoặc Mã sản phẩm (`ADL-SPxx`).
2. **Bộ lọc Danh mục:** Dropdown chọn xem:
   * *Tất cả danh mục*
   * *Tủ bảo quản cigar*
   * *Tủ rượu vang*
   * *Ly rượu vang*
   * *Bình Decanter*
   * *Phụ kiện rượu vang*
3. **Bộ lọc Tình trạng kho:**
   * *Tất cả tình trạng*
   * 🟢 *Còn hàng (> 5 chiếc)*
   * 🟡 *Sắp hết hàng (1 - 5 chiếc)*
   * 🔴 *Hết hàng (0 chiếc)*
4. **Nút `+ Thêm sản phẩm mới`:** Mở Modal popup nhập thông tin sản phẩm mới vào kho Adela.

---

### 4.3. Bảng dữ liệu sản phẩm (Products Data Table):
* **Các cột hiển thị:**
  1. `Mã SP` (in đậm, ví dụ `ADL-SP01`)
  2. `Hình ảnh` (Ảnh thumbnail vuông 50x50 bo góc viền nhẹ)
  3. `Tên sản phẩm` (Hiển thị tên đầy đủ và danh mục phụ bên dưới)
  4. `Giá bán` (Format tiền tệ đỏ nổi bật `40.000.000₫`)
  5. `Giá gốc` (Gạch ngang mờ `48.000.000₫`)
  6. `Tồn kho` (Số lượng số kèm nhãn chiếc/bộ)
  7. `Trạng thái` (Badge màu sang trọng: Xanh lá: Còn hàng, Vàng: Sắp hết, Đỏ: Hết hàng)
  8. `Thao tác` (Nút **Sửa** màu xanh/navy và nút **Xóa** màu đỏ)

---

### 4.4. Modal Thêm mới & Chỉnh sửa sản phẩm:
* Form popup hiện đại trên lớp phủ mờ:
  * **Tên sản phẩm:** Bắt buộc nhập, tối thiểu 5 ký tự.
  * **Danh mục:** Dropdown chọn 1 trong 5 dòng sản phẩm Adela.
  * **Giá bán ưu đãi (VNĐ):** Bắt buộc số dương.
  * **Giá niêm yết cũ (VNĐ):** Giá gốc trước khi giảm.
  * **Số lượng nhập kho:** Số nguyên >= 0. Tự động tính trạng thái (nếu = 0 là Hết hàng, 1-5 là Sắp hết, > 5 là Còn hàng).
  * **Hình ảnh sản phẩm:** Cho phép chọn nhanh 1 trong các ảnh có sẵn trong thư mục `images/` hoặc dán link ảnh.
* Nút `Hủy bỏ` và nút `Lưu sản phẩm`.

---

### 4.5. Phân trang & Xóa có xác nhận SweetAlert2:
* **Phân trang:** Mặc định 5 sản phẩm/trang, có nút *Trước*, các số trang *1, 2*, nút *Sau*.
* **Xác nhận xóa bằng SweetAlert2:**
  ```javascript
  Swal.fire({
    title: 'Xóa sản phẩm khỏi kho?',
    html: `Bạn có chắc muốn xóa sản phẩm <b>${product.name}</b> (Mã: <i>${product.id}</i>)?<br>Thao tác này sẽ gỡ sản phẩm khỏi danh sách!`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#e83224',
    cancelButtonColor: '#0e1e36',
    confirmButtonText: 'Đồng ý xóa',
    cancelButtonText: 'Giữ lại'
  }).then((res) => {
    if (res.isConfirmed) {
      // Xóa khỏi mảng dữ liệu và cập nhật localStorage
      Swal.fire('Đã xóa!', 'Sản phẩm đã được xóa khỏi hệ thống.', 'success');
    }
  });
  ```

---

## 5. BƯỚC THỰC HIỆN CHI TIẾT DÀNH CHO CODEX

1. **File giao diện:** Tạo `html/products-admin.html` kế thừa Sidebar và Header từ `html/dashboard.html`.
2. **File SCSS:** Tạo `scss/pages/_products-admin.scss` và `scss/products-admin.scss` (hoặc tích hợp trong `scss/dashboard.scss`) với style bảng sản phẩm, badge, modal form. Biên dịch ra `css/products-admin.css` qua lệnh `npm run build:css`.
3. **File JavaScript:** Tạo `js/products-admin.js`:
   * Nạp sẵn mảng 10 sản phẩm mẫu vào `localStorage['adela_products_data']`.
   * Render bảng sản phẩm động kèm thumbnail ảnh.
   * Xử lý Tìm kiếm thời gian thực.
   * Xử lý Lọc theo danh mục và tình trạng kho.
   * Xử lý Phân trang.
   * Xử lý Thêm mới / Chỉnh sửa / Xóa kèm popup SweetAlert2.
4. **Cập nhật liên kết Sidebar:**
   * Trong Sidebar của cả `html/dashboard.html` và `html/products-admin.html`:
     * Menu "Tổng quan": link tới `dashboard.html`.
     * Menu "Sản phẩm Adela": link tới `products-admin.html`.
     * Menu "Xem website": link về `index.html`.
5. **Cập nhật README:** Cập nhật file `README.md` ở thư mục gốc để đánh dấu hoàn tất 100% toàn bộ 7 ngày của dự án Adela.

---

## 6. DEFINITION OF DONE (TIÊU CHÍ HOÀN THÀNH)
* [x] Mở `html/products-admin.html` hiển thị danh sách 10 sản phẩm Adela kèm ảnh thumbnail rõ nét.
* [x] Tìm kiếm tên hoặc mã sản phẩm lọc kết quả tức thì.
* [x] Lọc theo danh mục (Tủ cigar, Tủ vang, Ly, Decanter) và tình trạng kho hoạt động chính xác.
* [x] Thêm mới sản phẩm: form có validation, thêm xong hiển thị ngay trên bảng và lưu vào `localStorage`.
* [x] Sửa giá / số lượng tồn kho cập nhật mượt mà.
* [x] Xóa sản phẩm có popup cảnh báo SweetAlert2.
* [x] Phân trang chuyển đổi giữa các trang mượt mà.
* [x] Console trình duyệt (F12) hoàn toàn sạch sẽ, không có lỗi runtime.
