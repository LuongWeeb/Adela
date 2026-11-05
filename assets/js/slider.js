document.addEventListener('DOMContentLoaded', function () {
  if (typeof window.Swiper !== 'function') return;
  document.querySelectorAll('.related-swiper, .testimonial-swiper').forEach(function (element) {
    var related = element.classList.contains('related-swiper');
    new Swiper(element, {
      slidesPerView: related ? 2 : 1,
      spaceBetween: 16,
      speed: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 350,
      watchOverflow: true,
      keyboard: { enabled: true, onlyInViewport: true },
      navigation: {
        nextEl: element.querySelector('.swiper-button-next'),
        prevEl: element.querySelector('.swiper-button-prev')
      },
      pagination: { el: element.querySelector('.swiper-pagination'), clickable: true },
      a11y: {
        prevSlideMessage: 'Trang trước', nextSlideMessage: 'Trang sau',
        firstSlideMessage: 'Đang ở trang đầu', lastSlideMessage: 'Đang ở trang cuối',
        paginationBulletMessage: 'Đến trang {{index}}', slideLabelMessage: '{{index}} / {{slidesLength}}'
      },
      breakpoints: related ? {
        600: { slidesPerView: 3, spaceBetween: 20 },
        1024: { slidesPerView: 5, spaceBetween: 20 }
      } : { 1024: { slidesPerView: 2, spaceBetween: 24 } }
    });
  });
});
