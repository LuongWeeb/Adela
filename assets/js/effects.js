(function ($) {
  'use strict';
  if (!$) return;

  $(document).ready(function () {
    var motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    function duration(ms) { return motion.matches ? 0 : ms; }
    function refreshReveal() { if (window.AOS) window.AOS.refresh(); }

    if (window.AOS) {
      window.AOS.init({ duration: 800, offset: 120, easing: 'ease-in-out', once: true, disable: motion.matches });
      document.documentElement.classList.add('aos-ready');
      $('img').on('load.adelaEffects', refreshReveal);
    }

    if (window.lightbox) {
      window.lightbox.option({
        albumLabel: 'Ảnh %1 / %2',
        alwaysShowNavOnTouchDevices: true,
        fadeDuration: duration(300),
        imageFadeDuration: duration(300),
        resizeDuration: duration(300),
        disableScrolling: true,
        wrapAround: true
      });
    }

    var $top = $('#back-to-top');
    var topVisible = false;
    function updateScroll() {
      var position = $(window).scrollTop();
      $('.site-header').toggleClass('is-sticky', position > 100);
      var visible = position > 300;
      if (visible === topVisible) return;
      topVisible = visible;
      $top.stop(true, true);
      if (visible) $top.fadeIn(duration(300));
      else $top.fadeOut(duration(300));
    }
    $(window).on('scroll.adelaEffects pageshow.adelaEffects', updateScroll);
    updateScroll();

    $top.on('click', function () {
      $('html, body').stop(true).animate({ scrollTop: 0 }, duration(600));
    });

    $('.faq-question').on('click', function () {
      var $question = $(this);
      var $item = $question.closest('.faq-item');
      var $answer = $question.next('.faq-answer');
      var open = $question.attr('aria-expanded') !== 'true';
      var $others = $item.siblings('.faq-item');
      $others.removeClass('active').find('.faq-question').attr('aria-expanded', 'false');
      $others.find('.faq-icon').removeClass('fa-minus').addClass('fa-plus');
      $others.find('.faq-answer').stop(true, true).slideUp(duration(300));
      $answer.stop(true, true).slideToggle(duration(300), refreshReveal);
      $item.toggleClass('active', open);
      $question.attr('aria-expanded', String(open)).find('.faq-icon').toggleClass('fa-minus', open).toggleClass('fa-plus', !open);
    });

    $('.product-tabs').each(function () {
      var $tabs = $(this);
      var $buttons = $tabs.find('.tab-btn');
      var $panels = $tabs.find('.tab-pane');
      function activate(button) {
        var $button = $(button);
        if ($button.attr('aria-selected') === 'true') return;
        var panel = document.getElementById($button.attr('data-tab'));
        if (!panel || !$tabs[0].contains(panel)) return;
        $buttons.removeClass('active').attr({ 'aria-selected': 'false', tabindex: '-1' });
        $button.addClass('active').attr({ 'aria-selected': 'true', tabindex: '0' });
        $panels.stop(true, true).hide().attr('hidden', '');
        $(panel).removeAttr('hidden').fadeIn(duration(350), refreshReveal);
      }
      $buttons.on('click', function () { activate(this); });
      $buttons.on('keydown', function (event) {
        var index = $buttons.index(this);
        if (event.key === 'ArrowRight') index = (index + 1) % $buttons.length;
        else if (event.key === 'ArrowLeft') index = (index + $buttons.length - 1) % $buttons.length;
        else if (event.key === 'Home') index = 0;
        else if (event.key === 'End') index = $buttons.length - 1;
        else return;
        event.preventDefault();
        $buttons[index].focus();
        activate($buttons[index]);
      });
    });

    $('.has-dropdown > a').on('click', function (e) {
      if ($(window).width() <= 768) {
        e.preventDefault();
        var $item = $(this).closest('.has-dropdown');
        var $sub = $item.find('> .dropdown-menu');
        $sub.stop(true, true).slideToggle(duration(250), function () {
          $item.toggleClass('active', $(this).is(':visible'));
          refreshReveal();
        });
      }
    });

    $('#btn-toggle-desc, .btn-collapse').on('click', function (e) {
      e.preventDefault();
      var $btn = $(this);
      var $extra = $('#extra-product-desc');
      if (!$extra.length) return;

      $extra.stop(true, true).slideToggle(duration(350), function () {
        var visible = $(this).is(':visible');
        $btn.attr('aria-expanded', String(visible));
        $btn.find('span').text(visible ? 'Thu gọn' : 'Đọc thêm');
        var $icon = $btn.find('.dropdown-arrow, i');
        $icon.toggleClass('fa-chevron-up', visible).toggleClass('fa-chevron-down', !visible);
        refreshReveal();
      });
    });

    $('.nav-note-dropdown > .nav-note').on('click', function (e) {
      if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
        var $drop = $(this).closest('.nav-note-dropdown');
        var wasActive = $drop.hasClass('active');
        $('.nav-note-dropdown').not($drop).removeClass('active');
        if (!wasActive) {
          e.preventDefault();
          $drop.addClass('active');
        }
      }
    });

    $(document).on('click', function (e) {
      if (!$(e.target).closest('.nav-note-dropdown').length) {
        $('.nav-note-dropdown').removeClass('active');
      }
    });
  });
})(window.jQuery);
