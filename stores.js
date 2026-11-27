// =====================================================================
// CỬA HÀNG — bật nút tải game ở đây, không cần sửa HTML.
//   live: false  => nút hiện "COMING SOON ON ..." + nhãn "Soon!", không bấm được
//   live: true   => nút "GET IT ON / Download on the ..." mở link url
// Khi game lên store: đổi live thành true (và điền url cho App Store).
// Nút nổi "Play" trên điện thoại chỉ hiện khi có ít nhất 1 store live;
// máy iPhone/iPad ưu tiên App Store, máy khác ưu tiên Google Play.
// =====================================================================
window.TSIO_STORES = [
  { id: "googleplay", name: "Google Play", liveTop: "GET IT ON", live: false,
    url: "https://play.google.com/store/apps/details?id=com.storknstork.tinkersurvivalio" },
  { id: "appstore", name: "App Store", liveTop: "Download on the", live: false,
    url: "" } // PLACEHOLDER: điền link App Store khi có
];

// ---- Hiển thị (không cần sửa) ----
// [data-stores] : hàng nút cửa hàng (thêm class "lg" cho nút to)
(function () {
  var ICON = {
    // Tam giác 4 màu tự vẽ (không phải logo chính thức)
    googleplay: '<svg viewBox="0 0 24 26" aria-hidden="true"><path d="M2 1.5v23L14 13z" fill="#00d2ff"/><path d="M2 1.5 17.5 10 14 13z" fill="#00f076"/><path d="M2 24.5 17.5 16 14 13z" fill="#ff3a44"/><path d="M17.5 10 22 12.5c.8.5.8 1.5 0 2L17.5 16 14 13z" fill="#ffd400"/></svg>',
    // Logo Apple từ Simple Icons v13.0.0 (CC0)
    appstore: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="#fff" d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701"/></svg>'
  };
  var stores = window.TSIO_STORES || [];
  function esc(t) { return String(t).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function isLive(s) { return s.live && s.url; }
  function badge(s, lg) {
    var cls = 'gp-badge store-' + esc(s.id) + (lg ? ' gp-badge-lg' : '');
    var inner = (ICON[s.id] || '') + '<span><small>' + (isLive(s) ? esc(s.liveTop) : 'COMING SOON ON') + '</small><b>' + esc(s.name) + '</b></span>';
    if (isLive(s)) {
      return '<a class="' + cls + '" href="' + esc(s.url) + '" target="_blank" rel="noopener" aria-label="' + esc(s.liveTop + ' ' + s.name) + '">' + inner + '</a>';
    }
    return '<span class="' + cls + ' is-soon" role="img" aria-label="' + esc(s.name) + ' — coming soon">' + inner + '<em class="soon-tag" aria-hidden="true">Soon!</em></span>';
  }
  document.querySelectorAll('[data-stores]').forEach(function (el) {
    var lg = el.classList.contains('lg');
    el.innerHTML = stores.map(function (s) { return badge(s, lg); }).join('');
  });
  // Nút nổi "Play" (điện thoại)
  var fab = document.getElementById('fab');
  if (fab) {
    var live = stores.filter(isLive);
    var ios = /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    var pick = live.filter(function (s) { return s.id === (ios ? 'appstore' : 'googleplay'); })[0] || live[0];
    if (pick) fab.href = pick.url; else fab.remove();
  }
})();
