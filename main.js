(function () {
  var d = document,
    L_CSS =
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css",
    L_JS =
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js",
    loading;
  function leaflet(cb) {
    if (window.L) return cb();
    if (!loading) {
      var c = d.createElement("link");
      c.rel = "stylesheet";
      c.href = L_CSS;
      d.head.appendChild(c);
      loading = [];
      var s = d.createElement("script");
      s.src = L_JS;
      s.onload = function () {
        loading.forEach(function (f) {
          f();
        });
      };
      d.head.appendChild(s);
    }
    loading.push(cb);
  }
  function initMap(det) {
    var el = det.querySelector(".map");
    if (el.dataset.ready) {
      el._m &&
        setTimeout(function () {
          el._m.invalidateSize();
        }, 50);
      return;
    }
    el.dataset.ready = 1;
    leaflet(function () {
      var la = +el.dataset.lat,
        ln = +el.dataset.lng,
        m = L.map(el, { scrollWheelZoom: false }).setView([la, ln], 16);
      el._m = m;
      L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution: "© OpenStreetMap",
      }).addTo(m);
      L.marker([la, ln]).addTo(m).bindPopup(el.dataset.label).openPopup();
      m.on("focus", function () {
        m.scrollWheelZoom.enable();
      });
      m.on("blur", function () {
        m.scrollWheelZoom.disable();
      });
      setTimeout(function () {
        m.invalidateSize();
      }, 50);
    });
  }
  d.querySelectorAll("details.address").forEach(function (det) {
    det.addEventListener("toggle", function () {
      if (det.open) initMap(det);
    });
    if (det.open) initMap(det);
  });
})