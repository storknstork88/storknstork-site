// Icon nền trôi nổi theo từng section.
// Section khai báo bộ icon bằng data-deco="🧠 🪦 🌙" và (tùy chọn) data-deco-count="12".
// Vị trí rải theo lưới có lệch ngẫu nhiên, dùng hạt giống cố định => mỗi lần tải trang giống nhau.
(function () {
  var secs = document.querySelectorAll('[data-deco]');
  if (!secs.length) return;
  var narrow = window.matchMedia && window.matchMedia('(max-width: 719px)').matches;

  function rng(seed) { // Mulberry32: ngẫu nhiên có hạt giống
    return function () {
      seed |= 0; seed = seed + 0x6D2B79F5 | 0;
      var t = Math.imul(seed ^ seed >>> 15, 1 | seed);
      t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
  }

  secs.forEach(function (sec, si) {
    var icons = sec.getAttribute('data-deco').split(/\s+/).filter(Boolean);
    var count = parseInt(sec.getAttribute('data-deco-count') || '12', 10);
    if (narrow) count = Math.ceil(count * 0.5);
    var r = rng(1000 + si * 97);
    var layer = document.createElement('div');
    layer.className = 'deco-layer';
    layer.setAttribute('aria-hidden', 'true');
    // Lưới cols x rows, mỗi icon một ô, lệch ngẫu nhiên trong ô => phủ đều nền
    var cols = Math.ceil(Math.sqrt(count * 2)), rows = Math.ceil(count / cols);
    for (var i = 0; i < count; i++) {
      var cx = i % cols, cy = Math.floor(i / cols);
      var s = document.createElement('span');
      s.className = 'deco-item';
      s.textContent = icons[i % icons.length];
      s.style.left = ((cx + 0.15 + r() * 0.7) / cols * 100).toFixed(1) + '%';
      s.style.top = ((cy + 0.15 + r() * 0.7) / rows * 100).toFixed(1) + '%';
      s.style.fontSize = (1.3 + r() * 1.4).toFixed(2) + 'rem';
      s.style.setProperty('--rot', Math.round(r() * 50 - 25) + 'deg');
      s.style.animationDuration = (6 + r() * 6).toFixed(1) + 's';
      s.style.animationDelay = (-r() * 8).toFixed(1) + 's';
      layer.appendChild(s);
    }
    sec.insertBefore(layer, sec.firstChild);
  });
})();
