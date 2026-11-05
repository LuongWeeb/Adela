(() => {
  'use strict';
  const byId = id => document.getElementById(id);
  function initSidebar() {
    const sidebar = byId('admin-sidebar');
    const toggle = byId('sidebar-toggle');
    const main = byId('admin-main');
    const overlay = byId('sidebar-overlay');
    const desktop = window.matchMedia('(min-width: 1025px)');
    let open = false;
    let collapsed = false;
    function sync() {
      document.body.classList.toggle('drawer-open', !desktop.matches && open);
      document.body.classList.toggle('sidebar-collapsed', desktop.matches && collapsed);
      overlay.hidden = desktop.matches || !open;
      sidebar.inert = !desktop.matches && !open;
      main.inert = !desktop.matches && open;
      toggle.setAttribute('aria-expanded', String(desktop.matches ? !collapsed : open));
      toggle.setAttribute('aria-label', desktop.matches ? (collapsed ? 'Mở rộng thanh điều hướng' : 'Thu gọn thanh điều hướng') : 'Mở menu điều hướng');
      if (!desktop.matches && open) { sidebar.setAttribute('role', 'dialog'); sidebar.setAttribute('aria-modal', 'true'); }
      else { sidebar.removeAttribute('role'); sidebar.removeAttribute('aria-modal'); }
    }
    function close(returnFocus = true) { open = false; sync(); if (returnFocus) toggle.focus(); }
    toggle.addEventListener('click', () => {
      if (desktop.matches) collapsed = !collapsed;
      else open = !open;
      sync();
      if (open) byId('sidebar-close').focus();
    });
    byId('sidebar-close').addEventListener('click', () => close());
    overlay.addEventListener('click', () => close());
    sidebar.querySelectorAll('a, [data-notice]').forEach(link => link.addEventListener('click', () => {
      if (!desktop.matches) close();
    }));
    document.addEventListener('keydown', event => {
      if (!open || desktop.matches) return;
      if (event.key === 'Escape') { event.preventDefault(); close(); }
      if (event.key === 'Tab') {
        const focusable = [...sidebar.querySelectorAll('a, button')].filter(el => el.getClientRects().length);
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (!sidebar.contains(document.activeElement)) { event.preventDefault(); first.focus(); }
        else if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
      }
    });
    desktop.addEventListener('change', () => {
      const focusWasInSidebar = sidebar.contains(document.activeElement);
      open = false; sync();
      if (focusWasInSidebar) toggle.focus();
    });
    sync();
  }

  document.addEventListener('DOMContentLoaded', initSidebar);
})();
