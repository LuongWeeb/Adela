window.Adela = {
  isEmail: function (value) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value); },
  notify: function (options) {
    if (window.Swal) return window.Swal.fire(Object.assign({ confirmButtonColor: '#0e1e36', confirmButtonText: 'Đóng' }, options));
    var message = options.title + '\n' + (options.text || '');
    if (options.showCancelButton) return Promise.resolve({ isConfirmed: window.confirm(message) });
    window.alert(message);
    return Promise.resolve({ isConfirmed: true });
  },
  setError: function (field, message) {
    var id = field.id + '-error';
    var error = document.getElementById(id);
    if (!error) {
      error = document.createElement('p');
      error.id = id;
      error.className = 'field-error';
      error.setAttribute('aria-live', 'polite');
      var newsletter = field.closest('.newsletter');
      if (newsletter) newsletter.after(error);
      else field.after(error);
      var describedBy = field.getAttribute('aria-describedby') || '';
      field.setAttribute('aria-describedby', (describedBy + ' ' + id).trim());
    }
    error.textContent = message;
    error.hidden = !message;
    field.setAttribute('aria-invalid', String(Boolean(message)));
  }
};

document.addEventListener('DOMContentLoaded', function () {
  var hamburger = document.getElementById('hamburger-btn');
  var menu = document.getElementById('nav-menu');
  var closeButton = document.getElementById('nav-close-btn');
  var overlay = document.getElementById('nav-overlay');

  if (hamburger && menu && closeButton && overlay) {
    var mobile = window.matchMedia('(max-width: 768px)');
    var menuOpen = false;
    var background = [];

    // Disable branches outside the drawer while keeping its ancestors active.
    function lockBackground() {
      var branch = menu;
      while (branch.parentElement && branch !== document.body) {
        Array.from(branch.parentElement.children).forEach(function (element) {
          if (element !== branch && element !== overlay) {
            background.push({ element: element, inert: element.inert });
            element.inert = true;
          }
        });
        branch = branch.parentElement;
      }
    }

    function setMenuOpen(open, restoreFocus) {
      open = open && mobile.matches;
      background.forEach(function (entry) { entry.element.inert = entry.inert; });
      background = [];
      menuOpen = open;
      menu.classList.toggle('open', open);
      overlay.classList.toggle('active', open);
      hamburger.setAttribute('aria-expanded', String(open));
      document.documentElement.classList.toggle('nav-open', open);
      document.body.classList.toggle('nav-open', open);
      if (open) {
        menu.inert = false;
        menu.removeAttribute('aria-hidden');
        lockBackground();
        closeButton.focus({ preventScroll: true });
      } else {
        if (restoreFocus && mobile.matches) hamburger.focus({ preventScroll: true });
        menu.inert = mobile.matches;
        if (mobile.matches) menu.setAttribute('aria-hidden', 'true');
        else menu.removeAttribute('aria-hidden');
      }
    }

    hamburger.addEventListener('click', function () { setMenuOpen(!menuOpen, true); });
    closeButton.addEventListener('click', function () { setMenuOpen(false, true); });
    overlay.addEventListener('click', function () { setMenuOpen(false, true); });
    menu.addEventListener('click', function (event) {
      if (event.target.closest('a')) setMenuOpen(false, true);
    });
    document.addEventListener('keydown', function (event) {
      if (!menuOpen) return;
      if (event.key === 'Escape') {
        event.preventDefault();
        setMenuOpen(false, true);
      } else if (event.key === 'Tab') {
        var items = Array.from(menu.querySelectorAll('a[href], button:not([disabled])'));
        var first = items[0];
        var last = items[items.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    });
    mobile.addEventListener('change', function () {
      var focusInMenu = menu.contains(document.activeElement);
      setMenuOpen(false, focusInMenu);
      if (!mobile.matches && document.activeElement === closeButton) {
        menu.querySelector('a').focus({ preventScroll: true });
      }
    });
    setMenuOpen(false, false);
  }

  document.querySelectorAll('.newsletter').forEach(function (form) {
    var input = form.querySelector('input[type="email"]');
    if (!input) return;
    form.noValidate = true;
    input.addEventListener('input', function () { Adela.setError(input, ''); });
    form.addEventListener('submit', async function (event) {
      event.preventDefault();
      var valid = Adela.isEmail(input.value.trim());
      Adela.setError(input, valid ? '' : 'Vui lòng nhập email hợp lệ, ví dụ ten@example.com.');
      if (!valid) {
        await Adela.notify({ icon: 'error', title: 'Email chưa hợp lệ', text: 'Vui lòng kiểm tra địa chỉ email.' });
        input.focus();
        return;
      }
      await Adela.notify({ icon: 'success', title: 'Đăng ký nhận tin thành công!', text: 'Email hợp lệ. Đây là bản thực hành; thông tin chưa được gửi lên máy chủ.' });
      form.reset();
    });
  });

  // Search remains a demo; newsletter and product forms own their submit handlers.
  document.querySelectorAll('.search.demo-form').forEach(function (form) {
    form.addEventListener('submit', function (event) {
      event.preventDefault();
      var message = form.nextElementSibling;
      if (!message || !message.classList.contains('form-status')) {
        message = document.createElement('p');
        message.className = 'form-status';
        message.setAttribute('role', 'status');
        form.after(message);
      }
      message.textContent = 'Đây là form thực hành giao diện, chưa kết nối máy chủ.';
    });
  });
});
