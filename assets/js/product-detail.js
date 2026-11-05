document.addEventListener('DOMContentLoaded', function () {
  var mainImage = document.getElementById('main-img');
  var thumbnails = Array.from(document.querySelectorAll('.thumbnail-item'));
  var changeId = 0;
  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  thumbnails.forEach(function (button) {
    var image = button.querySelector('img');
    if (!mainImage || !image) return;
    button.setAttribute('aria-current', String(button.classList.contains('active')));
    button.addEventListener('click', async function () {
      var currentChange = ++changeId;
      var preload = new Image();
      preload.src = image.src;
      try { await preload.decode(); } catch (_) {
        if (currentChange === changeId) mainImage.classList.remove('is-changing');
        return;
      }
      if (currentChange !== changeId) return;
      mainImage.classList.add('is-changing');
      await new Promise(function (resolve) { setTimeout(resolve, reducedMotion.matches ? 0 : 150); });
      if (currentChange !== changeId) return;
      mainImage.src = image.src;
      mainImage.alt = image.alt;
      var mainLink = mainImage.closest('a[data-lightbox]');
      if (mainLink) {
        mainLink.href = image.src;
        mainLink.setAttribute('data-title', image.alt);
        mainLink.setAttribute('data-alt', image.alt);
      }
      thumbnails.forEach(function (item) {
        item.classList.toggle('active', item === button);
        item.setAttribute('aria-current', String(item === button));
      });
      mainImage.classList.remove('is-changing');
    });
  });

  var colors = Array.from(document.querySelectorAll('.color-thumb'));
  colors.forEach(function (button) {
    button.addEventListener('click', function () {
      colors.forEach(function (option) {
        option.classList.toggle('active', option === button);
        option.setAttribute('aria-pressed', String(option === button));
      });
    });
  });

  var quantity = document.getElementById('product-qty');
  var minus = document.querySelector('[data-quantity="decrease"]');
  var plus = document.querySelector('[data-quantity="increase"]');
  function getQuantity() {
    var value = Number(quantity.value);
    return Number.isSafeInteger(value) && value >= 1 && value <= 999 ? value : 1;
  }
  function updateQuantity(value) {
    quantity.value = String(Math.max(1, Math.min(999, value)));
    minus.disabled = Number(quantity.value) === 1;
    plus.disabled = Number(quantity.value) === 999;
  }
  if (quantity && minus && plus) {
    minus.addEventListener('click', function () { updateQuantity(getQuantity() - 1); });
    plus.addEventListener('click', function () { updateQuantity(getQuantity() + 1); });
    updateQuantity(getQuantity());
  }

  var buy = document.querySelector('.btn-buy');
  if (buy && quantity) buy.addEventListener('click', async function () {
    var price = Number(document.querySelector('.current-price').dataset.price);
    var name = document.querySelector('.product-main-info h1').textContent.trim();
    var count = getQuantity();
    var selectedColor = colors.find(function (button) { return button.classList.contains('active'); });
    var colorText = selectedColor ? ' — Màu: ' + selectedColor.dataset.color : '';
    var total = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price * count);
    var result = await Adela.notify({
      title: 'Xác nhận đặt hàng',
      text: name + colorText + ' — Số lượng: ' + count + '. Tổng tiền: ' + total,
      icon: 'question',
      showCancelButton: true,
      cancelButtonText: 'Đóng',
      confirmButtonText: 'Để lại thông tin tư vấn',
      returnFocus: false
    });
    if (result.isConfirmed) {
      document.getElementById('tu-van').scrollIntoView({ behavior: reducedMotion.matches ? 'instant' : 'smooth', block: 'start' });
      document.getElementById('consult-name').focus({ preventScroll: true });
    } else buy.focus({ preventScroll: true });
  });
});
