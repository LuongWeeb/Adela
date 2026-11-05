document.addEventListener('DOMContentLoaded', function () {
  var consult = document.getElementById('consult-form');
  var review = document.getElementById('review-form');
  var ratingInputs = Array.from(document.querySelectorAll('input[name="rating"]'));
  var comments = document.getElementById('danh-sach-binh-luan');
  var phonePattern = /^0[35789]\d{8}$/;

  function paintRating() {
    var selected = ratingInputs.find(function (input) { return input.checked; });
    var value = selected ? Number(selected.value) : 0;
    ratingInputs.forEach(function (input) { input.closest('label').classList.toggle('active', Number(input.value) <= value); });
  }
  ratingInputs.forEach(function (input) { input.addEventListener('change', paintRating); });
  paintRating();

  function updateSummary() {
    if (!comments) return;
    var items = Array.from(comments.querySelectorAll('[data-rating]'));
    var average = items.reduce(function (sum, item) { return sum + Number(item.dataset.rating); }, 0) / (items.length || 1);
    var text = 'Điểm ' + new Intl.NumberFormat('vi-VN', { maximumFractionDigits: 1 }).format(average) + '/5 trên ' + items.length + ' đánh giá';
    document.querySelectorAll('.rating-summary').forEach(function (element) { element.textContent = text; });
  }
  updateSummary();

  function setup(form, rules, onValid) {
    if (!form) return;
    form.noValidate = true;
    var fields = Object.keys(rules).map(function (id) { return document.getElementById(id); });
    fields.forEach(function (field) {
      function validate() { Adela.setError(field, rules[field.id](field.value.trim())); }
      field.addEventListener('blur', validate);
      // Validate while editing so blur cannot move the submit button mid-click.
      field.addEventListener('input', validate);
    });
    form.addEventListener('submit', async function (event) {
      event.preventDefault();
      var firstError;
      fields.forEach(function (field) {
        var error = rules[field.id](field.value.trim());
        Adela.setError(field, error);
        if (error && !firstError) firstError = field;
      });
      if (firstError) {
        await Adela.notify({ icon: 'error', title: 'Vui lòng kiểm tra thông tin', text: 'Các trường cần sửa đã được đánh dấu bên dưới ô nhập.' });
        firstError.focus();
        return;
      }
      var submit = form.querySelector('[type="submit"]');
      if (submit.disabled) return;
      submit.disabled = true;
      try { await onValid(form); } finally { submit.disabled = false; }
    });
  }

  function nameRule(value) { return value.length >= 2 ? '' : 'Họ và tên phải có ít nhất 2 ký tự.'; }
  setup(consult, {
    'consult-name': nameRule,
    'consult-phone': function (value) { return phonePattern.test(value) ? '' : 'Nhập đúng 10 chữ số, bắt đầu bằng 03, 05, 07, 08 hoặc 09.'; }
  }, async function (form) {
    await Adela.notify({ icon: 'success', title: 'Đăng ký thành công!', text: 'Thông tin hợp lệ. Đây là bản thực hành; yêu cầu tư vấn chưa được gửi lên máy chủ.' });
    form.reset();
  });

  function element(tag, className, text) {
    var node = document.createElement(tag);
    node.className = className;
    node.textContent = text;
    return node;
  }
  setup(review, {
    'review-name': nameRule,
    'review-content': function (value) { return value.length >= 10 ? '' : 'Nội dung bình luận phải có ít nhất 10 ký tự.'; },
    'review-email': function (value) { return !value || Adela.isEmail(value) ? '' : 'Email chưa đúng định dạng.'; }
  }, async function (form) {
    var selected = ratingInputs.find(function (input) { return input.checked; });
    if (!selected || !comments) return;
    var rating = Number(selected.value);
    var name = document.getElementById('review-name').value.trim();
    var content = document.getElementById('review-content').value.trim();
    var item = element('article', 'comment-item comment-local', '');
    item.dataset.rating = String(rating);
    var initials = name.split(/\s+/).slice(-2).map(function (part) { return Array.from(part)[0]; }).join('').toUpperCase();
    item.append(element('div', 'comment-avatar', initials));
    var body = element('div', 'comment-body', '');
    var title = element('div', 'comment-title-bar', '');
    title.append(element('span', 'comment-author', name));
    var date = element('time', 'comment-date', new Intl.DateTimeFormat('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' }).format(new Date()));
    date.dateTime = new Date().toISOString();
    title.append(date);
    var stars = element('div', 'comment-stars', '');
    for (var index = 0; index < 5; index++) {
      var star = element('i', (index < rating ? 'fa-solid' : 'fa-regular') + ' fa-star', '');
      star.setAttribute('aria-hidden', 'true');
      stars.append(star);
    }
    stars.append(document.createTextNode(' (' + rating + '/5)'));
    stars.setAttribute('aria-label', rating + ' trên 5 sao');
    body.append(title, stars, element('p', 'comment-text', content));
    item.append(body);
    comments.prepend(item);
    updateSummary();
    form.reset();
    paintRating();
    document.getElementById('review-status').textContent = 'Đã thêm bình luận. Bình luận chỉ lưu trên trang hiện tại và sẽ mất khi tải lại.';
    item.tabIndex = -1;
    item.focus({ preventScroll: true });
    item.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth', block: 'center' });
  });
});

