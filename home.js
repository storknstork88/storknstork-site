// Băng chuyền ảnh + nút Play nổi (JS thuần)
(function () {
  var track = document.querySelector('.track');
  if (track) {
    var step = function (dir) {
      var li = track.querySelector('li');
      var gap = parseFloat(getComputedStyle(track).columnGap) || 16;
      var w = li ? li.getBoundingClientRect().width + gap : 240;
      track.scrollBy({ left: dir * w, behavior: 'smooth' });
    };
    document.querySelector('.car-btn.prev').addEventListener('click', function () { step(-1); });
    document.querySelector('.car-btn.next').addEventListener('click', function () { step(1); });
    track.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight') step(1);
      if (e.key === 'ArrowLeft') step(-1);
    });
  }
  var fab = document.getElementById('fab');
  var hero = document.querySelector('.hero');
  if (fab && hero) {
    var update = function () {
      fab.classList.toggle('show', hero.getBoundingClientRect().bottom < 0);
    };
    window.addEventListener('scroll', update, { passive: true });
    update();
  }
})();

// Nhân vật theo section: hiện ra khi cuộn tới (một lần)
(function () {
  var casts = document.querySelectorAll('.cast');
  if (!('IntersectionObserver' in window)) {
    casts.forEach(function (c) { c.classList.add('in'); });
    return;
  }
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
    });
  }, { threshold: 0.2 });
  casts.forEach(function (c) { io.observe(c); });
})();

// Video gameplay: mỗi clip chỉ phát khi đang thấy trên màn hình; giảm chuyển động => chỉ hiện poster + nút điều khiển
(function () {
  var vids = document.querySelectorAll('.gp-video');
  if (!vids.length) return;
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var play = function (v) { var p = v.play(); if (p && p.catch) p.catch(function () {}); };
  vids.forEach(function (v) {
    if (reduce) { v.controls = true; return; }
    if (!('IntersectionObserver' in window)) { v.preload = 'auto'; play(v); return; }
    new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { v.preload = 'auto'; play(v); } else { v.pause(); }
      });
    }, { threshold: 0.25 }).observe(v);
  });
})();

// Hiện dần khi cuộn tới: tiêu đề, thẻ, khung video... trượt nhẹ lên + rõ dần (một lần).
// - Không sửa HTML: chọn phần tử bằng danh sách SEL bên dưới.
// - Phần tử đã nằm trong màn hình lúc tải trang thì để yên (tránh nháy).
// - Các phần tử cùng cha xuất hiện lần lượt (so le ~90ms).
// - Dùng thuộc tính CSS "translate" (không phải transform) nên không đụng hiệu ứng hover/nghiêng sẵn có.
(function () {
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce || !('IntersectionObserver' in window)) return;
  var SEL = '.section-title, .card.row, .show-frame, .show-card, .showcase-cta, .updates-latest, .see-all, ' +
            '.card.plain.about, .value, .community, .about-cta, .legal-tabs, .legal-doc, .updates-intro, .updates-all .update';
  var all = Array.prototype.slice.call(document.querySelectorAll(SEL));
  // Bỏ phần tử nằm trong một phần tử khác cũng được chọn (tránh hiện 2 lần)
  var els = all.filter(function (el) {
    for (var p = el.parentElement; p; p = p.parentElement) { if (all.indexOf(p) !== -1) return false; }
    return true;
  });
  var vh = window.innerHeight || 800;
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (!e.isIntersecting) return;
      var el = e.target; el.classList.add('rv-in'); io.unobserve(el);
      // Xong hiệu ứng thì gỡ class để trả lại transition hover gốc của thẻ
      setTimeout(function () { el.classList.remove('rv', 'rv-in'); el.style.removeProperty('--rv-delay'); },
        700 + (parseInt(el.style.getPropertyValue('--rv-delay'), 10) || 0));
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
  var order = new Map();
  els.forEach(function (el) {
    if (el.getBoundingClientRect().top < vh * 0.9) return; // đang thấy sẵn => giữ nguyên
    var n = order.get(el.parentElement) || 0;
    order.set(el.parentElement, n + 1);
    el.style.setProperty('--rv-delay', Math.min(n, 4) * 90 + 'ms');
    el.classList.add('rv');
    io.observe(el);
  });
})();
