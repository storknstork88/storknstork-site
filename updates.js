// Hiển thị What's new từ window.TSIO_UPDATES (updates-data.js).
// - Phần tử [data-updates="latest"]: chỉ bản mới nhất (trang chủ).
// - Phần tử [data-updates="all"]: toàn bộ lịch sử (trang updates.html).
(function () {
  var list = window.TSIO_UPDATES || [];
  var LABEL = { "new": "NEW", "improved": "IMPROVED", "fixed": "FIXED", "event": "EVENT" };

  function esc(t) {
    return String(t).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function fmtDate(d) {
    if (!d) return "";
    var dt = new Date(d + "T00:00:00");
    if (isNaN(dt)) return esc(d);
    return dt.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  }
  function card(u) {
    var items = (u.items || []).map(function (it) {
      var kind = LABEL[it[0]] ? it[0] : "new";
      return '<li><span class="tag tag-' + kind + '">' + LABEL[kind] + "</span><span>" + esc(it[1]) + "</span></li>";
    }).join("");
    var id = "v" + String(u.version).replace(/[^0-9a-z]+/gi, "-");
    var date = fmtDate(u.date);
    return '<article class="card plain update" id="' + id + '">' +
      '<div class="update-head"><span class="badge">v' + esc(u.version) + "</span>" +
      (date ? '<time datetime="' + esc(u.date) + '">' + date + "</time>" : "") + "</div>" +
      "<h3>" + esc(u.title || "") + "</h3>" +
      '<ul class="update-list">' + items + "</ul></article>";
  }

  document.querySelectorAll("[data-updates]").forEach(function (el) {
    if (!list.length) return;
    var html = el.getAttribute("data-updates") === "all"
      ? list.map(card).join("")
      : card(list[0]);
    el.innerHTML = html;
  });
})();
