document.addEventListener('DOMContentLoaded', function () {
  var timer = document.getElementById('flash-countdown');
  var hours = document.getElementById('hours');
  var minutes = document.getElementById('minutes');
  var seconds = document.getElementById('seconds');
  if (!timer || !hours || !minutes || !seconds) return;

  var duration = Number(timer.dataset.durationSeconds) || 19800;
  var key = 'adela-flash-sale-end';
  var end = 0;
  try { end = Number(sessionStorage.getItem(key)); } catch (_) { /* Storage can be unavailable. */ }
  if (!Number.isFinite(end) || end <= 0 || end > Date.now() + duration * 1000) {
    end = Date.now() + duration * 1000;
    try { sessionStorage.setItem(key, String(end)); } catch (_) { /* In-memory countdown still works. */ }
  }
  var interval;
  function render() {
    var remaining = Math.max(0, Math.ceil((end - Date.now()) / 1000));
    hours.textContent = String(Math.floor(remaining / 3600)).padStart(2, '0');
    minutes.textContent = String(Math.floor(remaining % 3600 / 60)).padStart(2, '0');
    seconds.textContent = String(remaining % 60).padStart(2, '0');
    if (remaining === 0) {
      clearInterval(interval);
      document.getElementById('flash-sale-status').textContent = 'Phiên flash sale đã kết thúc';
    }
  }
  interval = setInterval(render, 1000);
  render();
  document.addEventListener('visibilitychange', function () { if (!document.hidden) render(); });
});
