# KẾ HOẠCH BỔ SUNG: TÍCH HỢP JQUERY, HIỆU ỨNG CUỘN TRANG (SCROLL ANIMATION) VÀ UI TƯƠNG TÁC (NGÀY 5)

## 1. MỤC TIÊU
Thực hiện trọn vẹn và chuyên sâu phần **jQuery, Hiệu ứng chuyển động (Animation/Effects) và Thư viện UI tương tác** theo đúng nội dung **Ngày 5 trong giáo án**:
1. Nhúng thư viện **jQuery (v3.7.1)** chính thức.
2. Tích hợp thư viện **AOS (Animate On Scroll)** và **Animate.css** (trang 9 giáo án): Tạo hiệu ứng sang trọng khi người dùng cuộn chuột, các thẻ card tủ rượu, tủ cigar, tiêu đề và khối hình ảnh sẽ **tự động trượt từ dưới lên, từ trái sang phải hoặc zoom nhẹ vào đúng vị trí**.
3. Tích hợp thư viện phóng to bộ sưu tập ảnh **Lightbox2** (trang 10 giáo án).
4. Triển khai các hiệu ứng jQuery tương tác:
   * **Nút Back-To-Top:** Ẩn/hiện bằng `fadeIn()` / `fadeOut()` và cuộn mượt `animate({ scrollTop: 0 })`.
   * **Accordion (Hỏi đáp FAQ chuyên ngành Adela):** Mở/đóng nội dung bằng `slideToggle()`.
   * **Tab chuyển đổi nội dung chi tiết tủ:** Chuyển đổi tab mượt mà bằng `fadeIn()`.
   * **Hiệu ứng Sticky Header:** Co gọn header và thêm bóng đổ khi cuộn trang bằng `$(window).scroll()`.

---

## 2. DANH MỤC THƯ VIỆN CẦN BỔ SUNG (THEO BẢNG NGÀY 5 GIÁO ÁN)

Thêm vào `<head>` của các file HTML (`html/index.html`, `html/product.html`, `html/about.html`):

```html
<!-- 1. jQuery Core (v3.7.1) -->
<script src="https://code.jquery.com/jquery-3.7.1.min.js"></script>

<!-- 2. AOS (Animate On Scroll - Hiệu ứng cuộn chuột trượt vào vị trí) -->
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/aos/2.3.4/aos.css" />
<script src="https://cdnjs.cloudflare.com/ajax/libs/aos/2.3.4/aos.js"></script>

<!-- 3. Lightbox2 (Phóng to duyệt bộ sưu tập ảnh - Trang 10 giáo án) -->
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/lightbox2/2.11.4/css/lightbox.min.css" />
<script src="https://cdnjs.cloudflare.com/ajax/libs/lightbox2/2.11.4/js/lightbox.min.js"></script>
```

---

## 3. CÁC HIỆU ỨNG CHI TIẾT CẦN TRIỂN KHAI

### Hiệu ứng 1: Hiệu ứng Cuộn Chuột Xuất Hiện Nội Dung (Scroll Reveal với AOS)
* **Khởi tạo trong `js/effects.js`:**
  ```javascript
  $(document).ready(function () {
    AOS.init({
      duration: 800,      // Thời gian chạy hiệu ứng (800ms mượt mà)
      offset: 120,        // Cách mép dưới màn hình 120px thì bắt đầu kích hoạt
      easing: 'ease-in-out',
      once: true          // Chỉ chạy 1 lần khi cuộn tới để giao diện không bị giật
    });
  });
  ```
* **Gắn thuộc tính chuyển động vào các phần tử HTML:**
  * **Tiêu đề các mục (Section Titles):**
    `<div class="section-title" data-aos="fade-down">` -> Trượt nhẹ từ trên xuống.
  * **Danh mục sản phẩm tròn:**
    Mỗi mục gắn `data-aos="fade-up"` kèm độ trễ so le:
    * Thẻ 1: `data-aos="fade-up" data-aos-delay="50"`
    * Thẻ 2: `data-aos="fade-up" data-aos-delay="100"`
    * Thẻ 3: `data-aos="fade-up" data-aos-delay="150"`... -> Tạo hiệu ứng các vòng tròn nối đuôi nhau trượt lên rất đẹp mắt.
  * **Khối Giới thiệu Adela (`index.html`):**
    * Khối ảnh tủ rượu bên trái: `data-aos="fade-right"` (Trượt từ trái vào).
    * Khối bài viết chữ bên phải: `data-aos="fade-left"` (Trượt từ phải vào).
  * **Lưới thẻ sản phẩm (Tủ rượu, Tủ cigar, Ly vang):**
    Gắn `data-aos="fade-up"` cho các card sản phẩm.
  * **Timeline lịch sử (`about.html`):**
    Mỗi mốc thời gian 2009, 2012, 2015, 2020 gắn `data-aos="zoom-in"`.

---

### Hiệu ứng 2: Nút "Cuộn lên đầu trang" (Back-To-Top) với `fadeIn()` & `animate()`
* **HTML bổ sung trước `</body>`:**
  ```html
  <button id="back-to-top" class="back-to-top" title="Cuộn lên đầu trang">▲</button>
  ```
* **Logic jQuery (`js/effects.js`):**
  ```javascript
  $(window).on('scroll', function () {
    if ($(this).scrollTop() > 300) {
      $('#back-to-top').fadeIn(300);
    } else {
      $('#back-to-top').fadeOut(300);
    }
  });

  $('#back-to-top').on('click', function (e) {
    e.preventDefault();
    $('html, body').animate({ scrollTop: 0 }, 600);
  });
  ```

---

### Hiệu ứng 3: Accordion Hỏi đáp chuyên gia Adela với `slideToggle()`
* **Vị trí:** Cuối trang `html/product.html` hoặc `html/about.html`.
* **Logic jQuery (`js/effects.js`):**
  ```javascript
  $('.faq-question').on('click', function () {
    var $answer = $(this).next('.faq-answer');
    var $item = $(this).closest('.faq-item');
    
    // Đóng các câu hỏi khác
    $('.faq-answer').not($answer).slideUp(300);
    $('.faq-item').not($item).removeClass('active').find('.faq-icon').text('+');
    
    // Mở hoặc đóng câu hỏi hiện tại
    $answer.slideToggle(300, function () {
      if ($(this).is(':visible')) {
        $item.addClass('active');
        $item.find('.faq-icon').text('−');
      } else {
        $item.removeClass('active');
        $item.find('.faq-icon').text('+');
      }
    });
  });
  ```

---

### Hiệu ứng 4: Tích hợp Lightbox2 phóng to chi tiết Tủ rượu & Cigar
* Bọc ảnh chính và thumbnail bằng thẻ `<a>` có thuộc tính `data-lightbox="adela-gallery"`:
  ```html
  <a href="../images/main-product.png" data-lightbox="cigar-gallery" data-title="Tủ bảo quản cigar Adela GF 2180">
    <img id="main-img" src="../images/main-product.png" alt="Tủ bảo quản cigar GF 2180" />
  </a>
  ```

---

### Hiệu ứng 5: Tab chuyển đổi mượt mà bằng jQuery `fadeIn()` trên `product.html`
* Chia bài viết chi tiết thành 3 tab: *Đặc điểm công nghệ*, *Thông số kỹ thuật*, *Chính sách bảo hành 6 năm*.
* **Logic jQuery:**
  ```javascript
  $('.tab-btn').on('click', function () {
    var target = $(this).data('tab');
    $('.tab-btn').removeClass('active');
    $(this).addClass('active');

    $('.tab-pane').hide();
    $('#' + target).fadeIn(350);
  });
  ```

---

### Hiệu ứng 6: Sticky Header đổi bóng đổ khi cuộn trang
```javascript
$(window).on('scroll', function () {
  if ($(this).scrollTop() > 100) {
    $('.header').addClass('is-sticky');
  } else {
    $('.header').removeClass('is-sticky');
  }
});
```

---

## 4. BƯỚC THỰC HIỆN CHI TIẾT DÀNH CHO CODEX

1. **Nhúng thư viện:** Thêm CDN của **jQuery 3.7.1**, **AOS 2.3.4**, **Lightbox2** vào `<head>` của cả 3 trang trong `html/`.
2. **Gắn thuộc tính animation:** Bổ sung `data-aos="fade-up"`, `data-aos="fade-right"`, `data-aos="fade-left"` vào các khối card, ảnh, tiêu đề theo danh sách ở Mục 3.
3. **Tạo `js/effects.js`:** Chứa lệnh `AOS.init()` và toàn bộ logic jQuery (Back-to-Top, Accordion, Tab, Sticky Header).
4. **Nhúng script vào HTML:** Thêm `<script src="../js/effects.js" defer></script>` trước thẻ `</body>`.
5. **Cập nhật SCSS & Build CSS:** Viết style cho nút `#back-to-top`, khối FAQ, Tab và `.header.is-sticky`. Chạy `npm run build:css`.
6. **Kiểm tra thực tế:** Mở trình duyệt và cuộn chuột từ từ từ trên xuống dưới: kiểm tra các khối nội dung có trượt êm ái vào vị trí hay không.

---

## 5. DEFINITION OF DONE (TIÊU CHÍ HOÀN THÀNH)
* [ ] Khi cuộn trang từ từ xuống dưới, các khối nội dung (thẻ sản phẩm, khối ảnh, bài viết giới thiệu) tự động lướt nhẹ nhàng vào vị trí (`fade-up`, `fade-right`, `fade-left`).
* [ ] Nhúng thành công thư viện jQuery 3.7.1, AOS và Lightbox2.
* [ ] Nút Back-To-Top xuất hiện khi cuộn qua 300px, click cuộn mượt lên đỉnh.
* [ ] Accordion câu hỏi thường gặp đóng mở trơn tru bằng `slideToggle()`.
* [ ] Click ảnh sản phẩm phóng to Lightbox sắc nét.
* [ ] Chuyển tab thông tin sản phẩm bằng hiệu ứng `fadeIn()` mượt mà.
* [ ] Console không có bất kỳ lỗi đỏ nào.
