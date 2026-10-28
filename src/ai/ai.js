/* Carlink AI — immersive chat (Figma 1141:577). Routes: #ai (new chat) · #ai/<threadId> */
(function () {
  "use strict";
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var root = $("[data-cai]");
  if (!root) return;

  /* ---------- Icons (Lucide, 24 grid) ---------- */
  var P = {
    pen: '<path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"/>',
    search: '<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>',
    left: '<path d="m12 19-7-7 7-7"/><path d="M19 12H5"/>',
    plus: '<path d="M5 12h14"/><path d="M12 5v14"/>',
    more: '<circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/>',
    mic: '<path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" x2="12" y1="19" y2="22"/>',
    clip: '<path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48"/>',
    up: '<path d="m5 12 7-7 7 7"/><path d="M12 19V5"/>',
    stop: '<rect x="7" y="7" width="10" height="10" rx="2" fill="currentColor" stroke="none"/>',
    tup: '<path d="M7 10v12"/><path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2a3.13 3.13 0 0 1 3 3.88Z"/>',
    tdown: '<path d="M17 14V2"/><path d="M9 18.12 10 14H4.17a2 2 0 0 1-1.92-2.56l2.33-8A2 2 0 0 1 6.5 2H20a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-2.76a2 2 0 0 0-1.79 1.11L12 22a3.13 3.13 0 0 1-3-3.88Z"/>',
    copy: '<rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>',
    share: '<path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" x2="12" y1="2" y2="15"/>',
    refresh: '<path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M8 16H3v5"/>',
    bulb: '<path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/><path d="M9 18h6"/><path d="M10 22h4"/>',
    chev: '<path d="m9 18 6-6-6-6"/>',
    send: '<path d="M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z"/><path d="m21.854 2.147-10.94 10.939"/>',
    file: '<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M10 9H8"/><path d="M16 13H8"/><path d="M16 17H8"/>',
    cloud: '<path d="M12 13v8"/><path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"/><path d="m8 17 4-4 4 4"/>',
    x: '<path d="M18 6 6 18"/><path d="m6 6 12 12"/>',
    pause: '<rect x="14" y="4" width="4" height="16" rx="1"/><rect x="6" y="4" width="4" height="16" rx="1"/>',
    play: '<polygon points="6 3 20 12 6 21 6 3"/>',
    check: '<path d="M20 6 9 17l-5-5"/>',
    ext: '<path d="M7 7h10v10"/><path d="M7 17 17 7"/>',
    reply: '<polyline points="15 17 20 12 15 7"/><path d="M4 18v-2a4 4 0 0 1 4-4h12"/>',
    orders: '<rect width="8" height="4" x="8" y="2" rx="1" ry="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><path d="M12 11h4"/><path d="M12 16h4"/><path d="M8 11h.01"/><path d="M8 16h.01"/>',
    truck: '<path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"/><path d="M15 18H9"/><path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14"/><circle cx="17" cy="18" r="2"/><circle cx="7" cy="18" r="2"/>',
    msg: '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>',
    users: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
    chart: '<path d="M3 3v16a2 2 0 0 0 2 2h16"/><path d="M18 17V9"/><path d="M13 17V5"/><path d="M8 17v-3"/>',
    trash: '<path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>',
    check2: '<circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/>'
  };
  function svg(name) { return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + (P[name] || "") + "</svg>"; }
  function hydrate(scope) { $$("i[data-ico]", scope).forEach(function (i) { i.outerHTML = svg(i.dataset.ico); }); }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function el(html) { var t = document.createElement("template"); t.innerHTML = html.trim(); return t.content.firstChild; }
  var reduce = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;


  /* ---------- Orb (glass sphere with swirling light, Figma "AI orb") ---------- */
  var orbN = 0;
  function orbSVG(rich) {
    var k = "o" + (++orbN);
    return '<svg viewBox="0 0 100 100" aria-hidden="true"><defs>' +
      '<radialGradient id="' + k + 'b" cx="40%" cy="32%" r="72%"><stop offset="0" stop-color="#b9dcff"/><stop offset=".3" stop-color="#4b8fff"/><stop offset=".68" stop-color="#1450f0"/><stop offset="1" stop-color="#0a238f"/></radialGradient>' +
      '<linearGradient id="' + k + 'r" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#e3d9ff"/><stop offset=".5" stop-color="#bfe8ff"/><stop offset="1" stop-color="#d9d2ff"/></linearGradient>' +
      '<clipPath id="' + k + 'c"><circle cx="50" cy="50" r="48"/></clipPath>' +
      '<filter id="' + k + 'f" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="2.2"/></filter>' +
      '<filter id="' + k + 'g" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation=".7"/></filter></defs>' +
      '<circle cx="50" cy="50" r="48" fill="url(#' + k + 'b)"/>' +
      '<g clip-path="url(#' + k + 'c)">' +
        '<g class="o-swirl" style="mix-blend-mode:screen">' +
          '<path d="M-2 66C20 30 54 86 102 34" stroke="#8fdcff" stroke-width="18" fill="none" opacity=".32" filter="url(#' + k + 'f)"/>' +
          '<path d="M0 62C24 34 54 80 100 38" stroke="#e8fbff" stroke-width="6" fill="none" opacity=".55" filter="url(#' + k + 'f)"/>' +
          '<path d="M2 60C26 36 54 76 98 40" stroke="#fff" stroke-width="1.6" fill="none" opacity=".85" filter="url(#' + k + 'g)"/>' +
          '<path d="M8 80C32 50 66 92 96 58" stroke="#7fd8ff" stroke-width="7" fill="none" opacity=".3" filter="url(#' + k + 'f)"/>' +
        '</g>' +
        (rich ? '<g class="o-swirl2" style="mix-blend-mode:screen"><path d="M4 30C30 56 62 8 98 28" stroke="#cdeeff" stroke-width="5" fill="none" opacity=".4" filter="url(#' + k + 'f)"/>' +
          '<path d="M6 31C31 54 62 11 96 29" stroke="#fff" stroke-width="1.6" fill="none" filter="url(#' + k + 'g)"/>' +
          '<path d="M16 88C40 64 70 70 90 84" stroke="#c9b6ff" stroke-width="5" fill="none" opacity=".25" filter="url(#' + k + 'f)"/></g>' : '') +
        '<ellipse cx="34" cy="24" rx="16" ry="8" transform="rotate(-24 34 24)" fill="#fff" opacity=".55" filter="url(#' + k + 'f)"/>' +
        '<g class="o-rim"><circle cx="50" cy="50" r="46.5" fill="none" stroke="url(#' + k + 'r)" stroke-width="2" opacity=".35" filter="url(#' + k + 'g)"/></g>' +
      '</g>' +
      (rich ? '<circle class="o-spark" cx="70" cy="30" r="1.6" fill="#fff"/><circle class="o-spark" cx="28" cy="62" r="1.2" fill="#fff"/>' : '') +
      "</svg>";
  }
  var PEARL = '<span class="o-core"><i></i><i></i><i></i></span><span class="o-gloss"></span>';
  /* ribbons around the hero sphere: 3 bands × 9 echo strands, each strand a softly
     wavy ellipse; staggered delays make the strands fan out like a light trail */
  function ribbonPath(rx, ry, amp, ph) {
    var d = "", n = 96;
    for (var j = 0; j <= n; j++) {
      var t = j / n * Math.PI * 2, k = 1 + amp * Math.sin(2 * t + ph);
      d += (j ? "L" : "M") + (rx * k * Math.cos(t)).toFixed(2) + " " + (ry * k * Math.sin(t)).toFixed(2);
    }
    return d + "Z";
  }
  function buildRibbons() {
    var svgs = $$("[data-cai-rib]"); if (!svgs.length) return;
    var defs = '<defs>' +
      '<linearGradient id="cai-rg1" gradientUnits="userSpaceOnUse" x1="-70" y1="0" x2="70" y2="0"><stop offset="0" style="stop-color:var(--rc-a);stop-opacity:0"/><stop offset=".35" style="stop-color:var(--rc-b)"/><stop offset=".6" style="stop-color:var(--rc-c)"/><stop offset="1" style="stop-color:var(--rc-a);stop-opacity:.1"/></linearGradient>' +
      '<linearGradient id="cai-rg2" gradientUnits="userSpaceOnUse" x1="0" y1="-70" x2="0" y2="70"><stop offset="0" style="stop-color:var(--rc-d);stop-opacity:.15"/><stop offset=".5" style="stop-color:var(--rc-b)"/><stop offset="1" style="stop-color:var(--rc-c);stop-opacity:.2"/></linearGradient></defs>';
    var bands = [["rb1", 56, 0.05, 0], ["rb2", 61, 0.07, 1.4], ["rb3", 52, 0.04, 2.6]];
    var body = bands.map(function (b, bi) {
      var paths = "";
      for (var i = 0; i < 9; i++) {
        paths += '<path d="' + ribbonPath(b[1] + i * 0.7, b[1] + i * 0.7, b[2], b[3] + i * 0.22) +
          '" style="--d:' + (-(bi * 3.7) - i * 0.11).toFixed(2) + 's;opacity:' + (1 - i * 0.08).toFixed(2) + '"/>';
      }
      return '<g class="' + b[0] + '">' + paths + "</g>";
    }).join("");
    svgs.forEach(function (s, i) { s.innerHTML = (i ? "" : defs) + body; });
  }
  buildRibbons();
  function fillOrbs(scope) {
    $$(".cai-orb:not([data-o])", scope).forEach(function (n) { n.setAttribute("data-o", ""); n.innerHTML = PEARL; });
    $$(".cai-av:not([data-o])", scope).forEach(function (n) { n.setAttribute("data-o", ""); n.innerHTML = PEARL; });
  }

  /* ---------- Data (from the Carlink prototype / Figma) ---------- */
  var ORDERS = [
    ["1011-CDA", "Barbara Davis", "2017 Mercedes-Benz C300", "Las Vegas, NV", "Atlanta, GA"],
    ["6145-CDA", "Donald Perez", "2018 Subaru Outback", "Philadelphia, PA", "Tampa, FL"],
    ["6148-CDA", "Elizabeth Clark", "2018 Kia Sorento", "Portland, OR", "St. Louis, MO"]
  ];
  var LOADS = [["Northgate Vehicle Transport", "$1,000"], ["Sunrise Vehicle Logistics", "$975"], ["Silverline Auto Shipping", "$825"]];

  var Q = {
    unsigned: "Which orders are not signed yet?",
    sms: "Write an SMS asking these shippers to sign their contracts",
    price: "Price lead #6193-CDA",
    loads: "What do carriers pay on Nashville, TN → Chandler, AZ right now?"
  };
  var PROMPTS = [
    ["orders", "Which orders are not signed yet?", Q.unsigned],
    ["truck", "Price a lead", Q.price],
    ["msg", "Write an SMS to a shipper", Q.sms],
    ["search", "Find similar loads", Q.loads],
    ["users", "Summarize new leads", "Summarize new leads"],
    ["chart", "Analyze a CSV file", "Analyze a CSV file"]
  ];

  /* An answer = meta + ordered blocks; each block streams in turn */
  function answer(q, files) {
    var s = (q || "").toLowerCase();
    if (files && files.length) return {
      meta: ["bulb", 2], chip: ["file", files.length + (files.length > 1 ? " files" : " file")],
      blocks: [
        { t: "p", text: "Got " + files.map(function (f) { return f.name; }).join(", ") + ". What should I do with " + (files.length > 1 ? "them" : "it") + "?" },
        { t: "follow", items: [["orders", "Attach to an order"], ["truck", "Check carriers in the file"], ["users", "Import as leads"]] }
      ]
    };
    if (/not signed|unsigned|signature|sign yet/.test(s)) return {
      meta: ["bulb", 4], chip: ["orders", "3 orders found"],
      blocks: [
        { t: "h", text: "3 orders are waiting for the customer’s signature:" },
        { t: "orders" },
        { t: "p", text: "All three came from Website Lead Form." }
      ]
    };
    if (/\bsms\b|text message|message to|write an? sms/.test(s)) return {
      meta: ["bulb", 3], chip: ["users", "3 recipients"],
      blocks: [
        { t: "h", text: "Here’s an SMS you can send to the shippers:" },
        { t: "sms" }
      ]
    };
    if (/price|pricing|6193|tariff/.test(s)) return {
      meta: ["bulb", 2], chip: ["file", "Lead #6193-CDA"],
      blocks: [
        { t: "p", text: "Here is the price for lead #6193-CDA, based on the route and vehicle:" },
        { t: "price" }
      ]
    };
    if (/carriers pay|similar|loads|central dispatch|nashville|chandler/.test(s)) return {
      meta: ["search", 0, "Analysis complete"], chip: ["truck", "4 loads reviewed"],
      blocks: [
        { t: "p", text: "Similar open-trailer loads on Central Dispatch pay $700 – $1,000 on this 1,690 mi route. Your carrier pay of $950 is in the upper part of that range." },
        { t: "sources" }
      ]
    };
    return {
      meta: ["bulb", 1],
      blocks: [
        { t: "p", text: "In this preview I can answer questions about your orders, leads, pricing and carriers. Try one of these:" },
        { t: "follow", items: [["orders", Q.unsigned], ["truck", Q.price], ["search", "Find similar loads", Q.loads]] }
      ]
    };
  }

  /* ---------- State ---------- */
  var uid = 0;
  function mkThread(id, title, q) { return { id: id, title: title, msgs: q ? [{ role: "user", text: q }, { role: "ai", a: answer(q), q: q }] : [] }; }
  var threads = [
    mkThread("not-signed", "Not signed orders", Q.unsigned),
    mkThread("sms", "SMS to shippers", Q.sms),
    mkThread("price-6193", "Price lead #6193-CDA", Q.price),
    mkThread("similar-loads", "Similar loads · Nashville → Chandler", Q.loads)
  ];
  var tabs = threads.map(function (t) { return t.id; });
  var current = null;      // thread id or null for a new chat
  var files = [];          // pending attachments
  var replyTo = null;
  var busy = null;         // { cancel: fn }
  var newTabId = null;
  var lastOutside = "";

  function byId(id) { return threads.filter(function (t) { return t.id === id; })[0]; }
  function short(t) { return t.title.split(" · ")[0]; }

  /* ---------- DOM refs ---------- */
  hydrate(root); fillOrbs(root);

  /* ---------- Waves behind the orb: seamless sine ribbons, each drawn two periods wide and slid by half ---------- */
  function buildWaves() {
    var host = $("[data-cai-waves]"); if (!host) return;
    var W = 1200, H = 220, mid = H / 2;
    var layers = [
      // [amplitude, wavelength, phase, stroke, width, opacity, duration(s), yOffset]
      [12, 600, 0, "#3b7bff", 1, .22, 34, 0],
      [16, 1200, 1.8, "#7c8cff", 1, .16, 46, 4],
      [9, 400, 3.2, "#5aa9ff", 1, .14, 28, -4]
    ];
    function path(a, l, ph, dy) {
      var d = "", step = 8;
      for (var x = 0; x <= W * 2; x += step) {
        var y = mid + dy + a * Math.sin((x / l) * Math.PI * 2 + ph);
        d += (x ? "L" : "M") + x + " " + y.toFixed(1);
      }
      return d;
    }
    var svgs = '<svg viewBox="0 0 ' + W + " " + H + '" preserveAspectRatio="none"><defs><linearGradient id="caiWaveFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5a8dff" stop-opacity=".16"/><stop offset="1" stop-color="#5a8dff" stop-opacity="0"/></linearGradient></defs>' +
      layers.map(function (L) {
        return '<path style="--d:' + L[6] + "s;animation-duration:" + L[6] + 's" stroke="' + L[3] + '" stroke-width="' + L[4] + '" opacity="' + L[5] + '" vector-effect="non-scaling-stroke" d="' + path(L[0], L[1], L[2], L[7]) + '"/>';
      }).join("") + "</svg>";
    host.innerHTML = svgs;
  }
  buildWaves();
  var main = $("[data-cai-main]"), thread = $("[data-cai-thread]"), scroll = $("[data-cai-scroll]");
  var tabsEl = $("[data-cai-tabs]"), pill = $("[data-cai-pill]"), titleEl = $("[data-cai-title]");
  var recentEl = $("[data-cai-recent]"), searchEl = $("[data-cai-search]");
  var text = $("[data-cai-text]"), send = $("[data-cai-send]"), input = $("[data-cai-input]");
  var rec = $("[data-cai-rec]"), drop = $("[data-cai-drop]"), fileIn = $("[data-cai-file]");
  var filesEl = $("[data-cai-files]"), replyEl = $("[data-cai-reply]");
  var orb = $("[data-cai-orb]");

  $("[data-cai-prompts]").innerHTML = PROMPTS.map(function (p, i) {
    return '<button class="cai-prompt" type="button" style="--i:' + i + '" data-cai-ask="' + esc(p[2]) + '">' + svg(p[0]) + esc(p[1]) + "</button>";
  }).join("");
  var wave = $("[data-cai-wave]");
  wave.innerHTML = Array.apply(null, Array(22)).map(function (_, i) { return '<i style="--i:' + i + ";height:" + (8 + ((i * 7) % 18)) + 'px"></i>'; }).join("");

  /* ---------- Sidebar ---------- */
  function renderRecent() {
    var f = (searchEl.value || "").trim().toLowerCase();
    var list = threads.filter(function (t) { return !f || t.title.toLowerCase().indexOf(f) > -1; });
    recentEl.innerHTML = list.length ? list.map(function (t, i) {
      return '<button class="cai-recent__item' + (t.id === current ? " is-active" : "") + '" type="button" style="animation-delay:' + (i * 0.03) + 's" data-cai-open="' + t.id + '"><span>' + esc(t.title) + "</span>" +
        '<span class="cai-recent__more" role="button" tabindex="-1" aria-label="Delete chat" title="Delete chat" data-cai-del="' + t.id + '">' + svg("more") + "</span></button>";
    }).join("") : '<div class="cai-recent__empty">' + (f ? "No chats found" : "No chats yet") + "</div>";
  }
  searchEl.addEventListener("input", renderRecent);

  /* ---------- Tabs ---------- */
  function renderTabs() {
    $$(".cai-tab, .cai-tab-add", tabsEl).forEach(function (n) { n.remove(); });
    tabs.forEach(function (id) {
      var t = byId(id); if (!t) return;
      var b = el('<button class="cai-tab' + (id === current ? " is-active" : "") + (id === newTabId ? " is-new" : "") + '" type="button" role="tab" aria-selected="' + (id === current) + '" data-cai-open="' + id + '">' + esc(short(t)) + "</button>");
      tabsEl.appendChild(b);
    });
    var hadNew = !!newTabId; newTabId = null;
    if (hadNew) setTimeout(movePill, 480);
    tabsEl.appendChild(el('<button class="cai-tab-add" type="button" aria-label="New chat" data-cai-new>' + svg("plus") + "</button>"));
    requestAnimationFrame(movePill);
  }
  function movePill() {
    var a = $(".cai-tab.is-active", tabsEl);
    if (!a) { pill.style.opacity = "0"; return; }
    pill.style.opacity = "1";
    pill.style.width = a.offsetWidth + "px";
    pill.style.transform = "translateX(" + a.offsetLeft + "px)";
    var l = a.offsetLeft, r = l + a.offsetWidth;
    if (l < tabsEl.scrollLeft || r > tabsEl.scrollLeft + tabsEl.clientWidth) tabsEl.scrollTo({ left: l - 24, behavior: "smooth" });
  }
  window.addEventListener("resize", movePill);

  /* ---------- Rendering messages ---------- */
  function userNode(m) {
    var f = (m.files || []).map(fileChip).join("");
    return el('<div class="cai-msg cai-user">' + (f ? '<div class="cai-user__files">' + f + "</div>" : "") + '<div class="cai-bubble">' + esc(m.text) + "</div></div>");
  }
  function fileChip(f, removable) {
    var ext = (f.name.split(".").pop() || "file").slice(0, 4);
    return '<div class="cai-file" data-name="' + esc(f.name) + '"><span class="cai-file__ico">' + svg("file") + '</span><span class="cai-file__t"><b>' + esc(f.name) + "</b><span>" + esc(ext) + (f.size ? " · " + size(f.size) : "") + "</span></span>" +
      (removable ? '<button class="cai-file__x" type="button" aria-label="Remove file" data-cai-unfile="' + esc(f.name) + '">' + svg("x") + "</button>" : "") + "</div>";
  }
  function size(b) { return b > 1048576 ? (b / 1048576).toFixed(1) + " MB" : Math.max(1, Math.round(b / 1024)) + " KB"; }

  function aiShell() {
    return withOrb(el('<div class="cai-msg cai-ai"><div class="cai-ai__who"><span class="cai-av"></span>Carlink AI</div>' +
      '<div class="cai-ai__body"><div class="cai-meta"><span data-meta-ico>' + svg("bulb") + '</span><span class="cai-meta__txt" data-meta-txt></span>' + svg("chev").replace("<svg", '<svg class="cai-meta__chev"') + "</div></div></div>"));
  }
  function withOrb(n) { fillOrbs(n); return n; }
  function metaText(a, secs) { return a.meta[2] || ("Reasoned for " + (secs || a.meta[1] || 1) + " sec"); }
  function chipNode(a) { return a.chip ? el('<span class="cai-chip">' + svg(a.chip[0]) + esc(a.chip[1]) + "</span>") : null; }

  /* block builders: return { node, words: [targets to stream] } */
  function blockNode(b) {
    switch (b.t) {
      case "h": return el('<h3 class="cai-h" data-stream="' + esc(b.text) + '"></h3>');
      case "p": return el('<p class="cai-p" data-stream="' + esc(b.text) + '"></p>');
      case "orders": return el('<ol class="cai-list">' + ORDERS.map(function (o, i) {
        return '<li><b>' + (i + 1) + '. <a class="cai-link" href="#order/' + o[0] + '">#' + o[0] + "</a> — " + esc(o[1]) + "</b><small>" + esc(o[2]) + " · " + esc(o[3]) + " → " + esc(o[4]) + "</small></li>";
      }).join("") + "</ol>");
      case "sms": return el('<div class="cai-card"><div class="cai-card__row"><span class="muted">To:</span><span class="grow" style="font-size:13px;font-weight:500">' + ORDERS.map(function (o) { return o[1]; }).join(", ") +
        '</span><button class="cai-mini" type="button" title="Copy" data-cai-copy>' + svg("copy") + '</button><button class="cai-mini" type="button" title="Send" data-cai-sms>' + svg("send") + "</button></div>" +
        '<div class="cai-card__sep"></div><div class="cai-card__body" data-copy-src>Hi {Shipper name},\n\nYour Carlink transport contract for order #{Order ID} is ready. Please sign it so we can dispatch your vehicle.\n\nReply to this message if you have any questions.</div></div>');
      case "price": return el('<div class="cai-card"><div class="cai-card__row"><span class="grow strong">2021 Ford F150</span><span class="cai-tag">Open</span><button class="cai-mini" type="button" title="Copy" data-cai-copy>' + svg("copy") + "</button></div>" +
        '<div data-copy-src style="display:flex;flex-direction:column;gap:12px"><div style="display:flex;flex-direction:column;gap:2px"><span style="font-size:13px">Nashville, TN 37211 &nbsp;→&nbsp; Chandler, AZ 85224</span><span class="muted">≈ 1,690 mi · 4–6 days</span></div>' +
        '<div class="cai-card__sep"></div><div class="cai-kv cai-kv--total"><span>Total tariff</span><b>$1,150</b></div><div class="cai-kv"><span>Deposit</span><b>$200</b></div><div class="cai-kv"><span>Carrier pay</span><b>$950</b></div></div>' +
        '<a class="cai-link" href="#lead/6193-CDA" style="align-self:flex-start;font-size:13px">Open lead #6193-CDA</a></div>');
      case "sources": return el('<div class="cai-srcs">' + LOADS.map(function (l, i) {
        return '<a class="cai-src" style="--i:' + i + '" href="#lead/6193-CDA"><span class="cai-src__ico">' + svg("truck") + "</span><b>" + esc(l[0]) + "</b><span>· " + l[1] + "</span>" + svg("ext") + "</a>";
      }).join("") + "</div>");
      case "follow": return el('<div class="cai-follow">' + b.items.map(function (it) {
        return '<button class="cai-prompt" type="button" data-cai-ask="' + esc(it[2] || it[1]) + '">' + svg(it[0]) + esc(it[1]) + "</button>";
      }).join("") + "</div>");
    }
  }
  function actsNode() {
    return el('<div class="cai-acts">' + [["tup", "Good response", "like"], ["tdown", "Bad response", "dislike"], ["copy", "Copy", "copy"], ["share", "Share", "share"], ["refresh", "Regenerate", "regen"], ["more", "More", "more"]].map(function (a) {
      return '<button class="cai-act" type="button" aria-label="' + a[1] + '" title="' + a[1] + '" data-cai-act="' + a[2] + '">' + svg(a[0]) + "</button>";
    }).join("") + "</div>");
  }

  /* render a finished AI message instantly */
  function aiNodeStatic(m) {
    var n = aiShell(), body = $(".cai-ai__body", n);
    $("[data-meta-ico]", n).innerHTML = svg(m.a.meta[0]);
    $("[data-meta-txt]", n).textContent = metaText(m.a);
    var c = chipNode(m.a); if (c) { c.style.animation = "none"; $(".cai-meta", n).appendChild(c); }
    m.a.blocks.forEach(function (b) { var bn = blockNode(b); if (bn.dataset.stream) bn.textContent = bn.dataset.stream; body.appendChild(bn); });
    n.appendChild(actsNode());
    n._msg = m;
    return n;
  }

  /* stream an AI message: thinking → meta → blocks word-by-word */
  function streamAI(m, node) {
    var cancelled = false, timers = [];
    function later(fn, ms) { var t = setTimeout(function () { if (!cancelled) fn(); }, reduce ? 0 : ms); timers.push(t); }
    var body = $(".cai-ai__body", node), av = $(".cai-av", node), txt = $("[data-meta-txt]", node);
    $("[data-meta-ico]", node).innerHTML = svg(m.a.meta[0]);
    av.classList.add("is-busy"); orb.classList.add("is-busy");
    txt.textContent = m.a.meta[2] ? "Analyzing…" : "Thinking…"; txt.classList.add("is-thinking");
    var think = 900 + Math.random() * 700, t0 = Date.now();
    setBusy(true);
    later(function () {
      txt.classList.remove("is-thinking");
      txt.textContent = metaText(m.a, Math.max(1, Math.round((Date.now() - t0) / 1000) + (m.a.meta[1] > 2 ? 2 : 0)));
      var c = chipNode(m.a); if (c) $(".cai-meta", node).appendChild(c);
      var i = 0;
      (function next() {
        if (cancelled) return;
        if (i >= m.a.blocks.length) return done();
        var b = m.a.blocks[i++], bn = blockNode(b);
        body.appendChild(bn);
        if (bn.dataset.stream) streamWords(bn, bn.dataset.stream, next);
        else { bn.classList.add("cai-reveal"); stick(); later(next, b.t === "sources" ? 420 : 260); }
      })();
    }, think);
    function streamWords(target, s, cb) {
      var words = s.split(/(\s+)/), k = 0;
      target.classList.add("cai-caret");
      (function tick() {
        if (cancelled) return;
        if (k >= words.length) { target.classList.remove("cai-caret"); return later(cb, 120); }
        var chunk = words.slice(k, k + 2).join(""); k += 2;
        var sp = document.createElement("span"); sp.className = "cai-w"; sp.textContent = chunk; target.appendChild(sp);
        stick();
        later(tick, 34 + Math.random() * 30);
      })();
    }
    function done() {
      av.classList.remove("is-busy"); orb.classList.remove("is-busy");
      $$("[data-stream]", body).forEach(function (e) { e.classList.remove("cai-caret"); });
      node.appendChild(actsNode()); stick();
      setBusy(false); busy = null;
    }
    busy = {
      cancel: function () {
        cancelled = true; timers.forEach(clearTimeout);
        txt.classList.remove("is-thinking"); if (!txt.textContent || /…$/.test(txt.textContent)) txt.textContent = "Stopped";
        $$("[data-stream]", body).forEach(function (e) { e.classList.remove("cai-caret"); });
        av.classList.remove("is-busy"); orb.classList.remove("is-busy");
        if (!$(".cai-acts", node)) node.appendChild(actsNode());
        setBusy(false); busy = null;
      }
    };
  }

  var pinned = true;
  scroll.addEventListener("scroll", function () { pinned = scroll.scrollHeight - scroll.scrollTop - scroll.clientHeight < 80; }, { passive: true });
  function stick(force) { if (force || pinned) { scroll.style.scrollBehavior = "auto"; scroll.scrollTop = scroll.scrollHeight; scroll.style.scrollBehavior = ""; } }

  /* ---------- View state ---------- */
  function render(id, opts) {
    opts = opts || {};
    if (busy) busy.cancel();
    var t = id && byId(id);
    current = t ? t.id : null;
    var wasEmpty = main.classList.contains("is-empty");
    main.classList.toggle("is-empty", !t);
    if (t && tabs.indexOf(t.id) < 0) { tabs.push(t.id); newTabId = t.id; }
    renderTabs(); renderRecent();
    if (t) {
      if (titleEl.textContent !== t.title) { titleEl.textContent = t.title; titleEl.classList.remove("is-swap"); void titleEl.offsetWidth; titleEl.classList.add("is-swap"); }
      if (!opts.keep) {
        thread.innerHTML = "";
        t.msgs.forEach(function (m) { thread.appendChild(m.role === "user" ? userNode(m) : aiNodeStatic(m)); });
        $$(".cai-msg", thread).forEach(function (n, i) { n.style.animationDelay = Math.min(i, 6) * 0.05 + "s"; });
        pinned = true; requestAnimationFrame(function () { stick(true); });
      }
    } else {
      thread.innerHTML = "";
      if (!wasEmpty) { $$(".cai-hero > *, .cai-prompt", main).forEach(function (n) { n.style.animation = "none"; void n.offsetWidth; n.style.animation = ""; }); }
    }
    setReply(null);
    if (!opts.noFocus && window.innerWidth > 767) setTimeout(function () { text.focus({ preventScroll: true }); }, 60);
  }

  function go(id) {
    var h = id ? "ai/" + id : "ai";
    if (location.hash.replace(/^#/, "") === h) render(id); else location.hash = h;
  }

  /* ---------- Sending ---------- */
  function submit(q) {
    q = (q != null ? q : text.value).trim();
    if (busy) { busy.cancel(); return; }
    if (!q && !files.length) { input.animate && input.animate([{ transform: "translateX(0)" }, { transform: "translateX(-5px)" }, { transform: "translateX(5px)" }, { transform: "translateX(0)" }], { duration: 260 }); return; }
    var sentFiles = files.slice();
    var t = current && byId(current);
    var startNew = !t;
    if (startNew) {
      t = { id: "chat-" + Date.now().toString(36) + (++uid), title: titleFor(q, sentFiles), msgs: [] };
      threads.unshift(t);
    }
    var um = { role: "user", text: q || "Sent " + sentFiles.length + " file" + (sentFiles.length > 1 ? "s" : ""), files: sentFiles };
    var am = { role: "ai", a: answer(q, sentFiles.length && !q ? sentFiles : (sentFiles.length && !/sign|sms|price|loads|similar|pay/.test(q.toLowerCase()) ? sentFiles : null)), q: q };
    t.msgs.push(um, am);
    text.value = ""; autosize(); clearFiles(); setReply(null);
    send.classList.remove("is-fly"); void send.offsetWidth; send.classList.add("is-fly");

    function append() {
      thread.appendChild(userNode(um));
      var n = aiShell(); n._msg = am; thread.appendChild(n);
      pinned = true; stick(true);
      streamAI(am, n);
    }
    if (startNew) {
      var swap = function () {
        current = t.id; main.classList.remove("is-empty"); newTabId = t.id; tabs.push(t.id);
        renderTabs(); renderRecent(); titleEl.textContent = t.title; titleEl.classList.add("is-swap");
        history.replaceState(null, "", "#ai/" + t.id);
        thread.innerHTML = ""; append();
      };
      if (document.startViewTransition && !reduce) document.startViewTransition(swap); else swap();
    } else append();
  }
  function titleFor(q, fs) {
    if (!q && fs.length) return fs[0].name;
    var s = q.replace(/\s+/g, " ").trim();
    return s.length > 42 ? s.slice(0, 40).replace(/\s+\S*$/, "") + "…" : s;
  }
  function setBusy(on) {
    send.classList.toggle("is-stop", on);
    send.innerHTML = svg(on ? "stop" : "up");
    send.setAttribute("aria-label", on ? "Stop generating" : "Send");
    updateSend();
  }
  function updateSend() { send.classList.toggle("is-ready", !busy); }
  function autosize() { text.style.height = ""; if (text.value) { text.style.height = "auto"; text.style.height = Math.min(200, text.scrollHeight) + "px"; } updateSend(); }
  function fitHeight() { var v = root.closest("[data-view]"); if (v.hidden) return; var top = root.getBoundingClientRect().top + window.scrollY; root.style.setProperty("--cai-off", Math.round(top + (window.innerWidth > 767 ? 16 : 0)) + "px"); movePill(); }
  window.addEventListener("resize", fitHeight);
  text.addEventListener("input", autosize);
  text.addEventListener("keydown", function (e) { if (e.key === "Enter" && !e.shiftKey && !e.isComposing) { e.preventDefault(); submit(); } });
  send.addEventListener("click", function () { submit(); });

  /* ---------- Reply ---------- */
  function setReply(q) {
    replyTo = q;
    replyEl.hidden = !q;
    if (q) { $("span", replyEl).textContent = "Replying to: " + q; text.placeholder = "Follow up on this response…"; text.focus(); }
    else text.placeholder = "Ask anything or drop a file…";
  }
  $("[data-cai-reply-x]").addEventListener("click", function () { setReply(null); });

  /* ---------- Files ---------- */
  function addFiles(list) {
    Array.prototype.slice.call(list || []).forEach(function (f) {
      if (files.some(function (x) { return x.name === f.name; })) return;
      files.push({ name: f.name, size: f.size });
    });
    renderFiles(); updateSend(); text.focus();
  }
  function renderFiles() {
    filesEl.hidden = !files.length;
    filesEl.innerHTML = files.map(function (f) { return fileChip(f, true); }).join("");
    $$(".cai-file", filesEl).forEach(function (n) { n.style.position = "relative"; n.insertAdjacentHTML("beforeend", '<span class="cai-file__bar"></span>'); });
  }
  function clearFiles() { files = []; renderFiles(); }
  $("[data-cai-attach]").addEventListener("click", function () { fileIn.click(); });
  fileIn.addEventListener("change", function () { addFiles(fileIn.files); fileIn.value = ""; });
  filesEl.addEventListener("click", function (e) {
    var x = e.target.closest("[data-cai-unfile]"); if (!x) return;
    var chip = x.closest(".cai-file"); chip.classList.add("is-out");
    setTimeout(function () { files = files.filter(function (f) { return f.name !== x.dataset.caiUnfile; }); renderFiles(); updateSend(); }, 180);
  });

  var dragDepth = 0;
  function aiVisible() { return !root.closest("[data-view]").hidden; }
  function hasFiles(e) { return e.dataTransfer && Array.prototype.indexOf.call(e.dataTransfer.types || [], "Files") > -1; }
  window.addEventListener("dragenter", function (e) { if (!aiVisible() || !hasFiles(e)) return; e.preventDefault(); dragDepth++; showDrop(true); });
  window.addEventListener("dragover", function (e) { if (aiVisible() && hasFiles(e)) e.preventDefault(); });
  window.addEventListener("dragleave", function (e) { if (!aiVisible() || !hasFiles(e)) return; dragDepth = Math.max(0, dragDepth - 1); if (!dragDepth) showDrop(false); });
  window.addEventListener("drop", function (e) { if (!aiVisible() || !hasFiles(e)) return; e.preventDefault(); dragDepth = 0; showDrop(false); addFiles(e.dataTransfer.files); });
  function showDrop(on) { if (!rec.hidden) return; drop.hidden = !on; input.hidden = on; }

  /* ---------- Voice ---------- */
  var recT = null, recS = 0, recPaused = false;
  function fmt(s) { return Math.floor(s / 60) + ":" + ("0" + (s % 60)).slice(-2); }
  function startRec() {
    if (busy) return;
    input.hidden = true; rec.hidden = false; recS = 0; recPaused = false; rec.classList.remove("is-paused");
    $("[data-cai-time]").textContent = "0:00";
    $("[data-cai-rec-pause]").innerHTML = svg("pause");
    clearInterval(recT); recT = setInterval(function () { if (!recPaused) $("[data-cai-time]").textContent = fmt(++recS); }, 1000);
  }
  function stopRec(keep) {
    clearInterval(recT); rec.hidden = true; input.hidden = false;
    if (keep) {
      var s = Q.price, i = 0; text.value = ""; text.focus();
      (function typeIt() { if (i <= s.length) { text.value = s.slice(0, i); autosize(); i += 2; setTimeout(typeIt, reduce ? 0 : 18); } })();
    }
  }
  $("[data-cai-mic]").addEventListener("click", startRec);
  $("[data-cai-rec-cancel]").addEventListener("click", function () { stopRec(false); });
  $("[data-cai-rec-done]").addEventListener("click", function () { stopRec(true); });
  $("[data-cai-rec-pause]").addEventListener("click", function (e) {
    recPaused = !recPaused; rec.classList.toggle("is-paused", recPaused);
    e.currentTarget.innerHTML = svg(recPaused ? "play" : "pause");
    e.currentTarget.setAttribute("aria-label", recPaused ? "Resume recording" : "Pause recording");
  });

  /* ---------- Toast ---------- */
  function toast(msg) {
    $$(".cai-toast", main).forEach(function (n) { n.remove(); });
    var n = el('<div class="cai-toast" role="status">' + svg("check2") + esc(msg) + "</div>");
    main.appendChild(n); setTimeout(function () { n.remove(); }, 2300);
  }
  function copyText(s) { try { navigator.clipboard.writeText(s); } catch (e) { /* preview */ } }

  /* ---------- Delegated clicks ---------- */
  root.addEventListener("click", function (e) {
    var t;
    if ((t = e.target.closest("[data-cai-del]"))) {
      e.stopPropagation(); e.preventDefault();
      var id = t.dataset.caiDel, item = t.closest(".cai-recent__item");
      item.animate && item.animate([{ opacity: 1, transform: "none" }, { opacity: 0, transform: "translateX(-12px)" }], { duration: 200, easing: "ease-in" });
      setTimeout(function () {
        threads = threads.filter(function (x) { return x.id !== id; }); tabs = tabs.filter(function (x) { return x !== id; });
        if (current === id) go(null); else { renderTabs(); renderRecent(); }
        toast("Chat deleted");
      }, 190);
      return;
    }
    if ((t = e.target.closest("[data-cai-open]"))) { go(t.dataset.caiOpen); return; }
    if ((t = e.target.closest("[data-cai-new]"))) { go(null); return; }
    if ((t = e.target.closest("[data-cai-back]"))) { go(null); return; }
    if ((t = e.target.closest("[data-cai-ask]"))) {
      var q = t.dataset.caiAsk;
      if (/csv|summarize/i.test(q) && !current) { text.value = q; autosize(); text.focus(); return; }
      submit(q); return;
    }
    if ((t = e.target.closest("[data-cai-copy]"))) {
      var src = $("[data-copy-src]", t.closest(".cai-card")); copyText(src ? src.innerText : "");
      t.innerHTML = svg("check"); setTimeout(function () { t.innerHTML = svg("copy"); }, 1400); toast("Copied"); return;
    }
    if ((t = e.target.closest("[data-cai-sms]"))) { toast("SMS sent to 3 shippers"); return; }
    if ((t = e.target.closest("[data-cai-tmore]"))) { toolMenu(t); return; }
    if ((t = e.target.closest("[data-cai-tool-item]"))) { toolItem(t.dataset.caiToolItem); return; }
    if ((t = e.target.closest("[data-cai-act]"))) { act(t); return; }
    if ((t = e.target.closest("[data-cai-menu-item]"))) { menuItem(t); return; }
  });
  document.addEventListener("click", function (e) { if (!e.target.closest(".cai-menu, [data-cai-act='more'], [data-cai-tmore]")) $$(".cai-menu", root).forEach(function (m) { m.remove(); }); });

  function act(b) {
    var kind = b.dataset.caiAct, msg = b.closest(".cai-ai"), acts = b.parentNode;
    if (kind === "like" || kind === "dislike") {
      var other = $('[data-cai-act="' + (kind === "like" ? "dislike" : "like") + '"]', acts);
      other.classList.remove("is-on");
      b.classList.toggle("is-on"); b.classList.remove("is-pop"); void b.offsetWidth; b.classList.add("is-pop");
      if (b.classList.contains("is-on")) toast(kind === "like" ? "Thanks for the feedback" : "Feedback noted");
    } else if (kind === "copy") {
      copyText($(".cai-ai__body", msg).innerText.replace(/^.*\n/, "")); toast("Copied");
    } else if (kind === "share") {
      copyText(location.href); toast("Link copied");
    } else if (kind === "regen") {
      if (busy) return;
      b.classList.remove("is-spin"); void b.offsetWidth; b.classList.add("is-spin");
      var m = msg._msg; if (!m) return;
      var fresh = aiShell(); fresh._msg = m; msg.replaceWith(fresh); streamAI(m, fresh);
    } else if (kind === "more") {
      $$(".cai-menu", root).forEach(function (x) { x.remove(); });
      var menu = el('<div class="cai-menu" role="menu"><button type="button" role="menuitem" data-cai-menu-item="reply">' + svg("reply") + 'Reply</button><button type="button" role="menuitem" class="is-danger" data-cai-menu-item="delete">' + svg("trash") + "Delete</button></div>");
      acts.appendChild(menu); menu.style.left = b.offsetLeft + "px";
    }
  }
  function toolMenu(b) {
    var open = $(".cai-menu", b.parentNode); $$(".cai-menu", root).forEach(function (x) { x.remove(); }); if (open) return;
    var items = [["pen", "New chat", "new"], ["share", "Copy chat link", "link"]];
    if (current) items.push(["trash", "Delete chat", "delete"]);
    b.parentNode.appendChild(el('<div class="cai-menu" role="menu">' + items.map(function (it) {
      return '<button type="button" role="menuitem"' + (it[2] === "delete" ? ' class="is-danger"' : "") + ' data-cai-tool-item="' + it[2] + '">' + svg(it[0]) + it[1] + "</button>";
    }).join("") + "</div>"));
  }
  function toolItem(kind) {
    $$(".cai-menu", root).forEach(function (x) { x.remove(); });
    if (kind === "new") go(null);
    else if (kind === "link") { copyText(location.href); toast("Link copied"); }
    else if (kind === "delete" && current) { var id = current; threads = threads.filter(function (x) { return x.id !== id; }); tabs = tabs.filter(function (x) { return x !== id; }); go(null); toast("Chat deleted"); }
  }
  function menuItem(b) {
    var msg = b.closest(".cai-ai"), m = msg && msg._msg; b.closest(".cai-menu").remove();
    if (!m) return;
    if (b.dataset.caiMenuItem === "reply") setReply(m.q || "previous answer");
    else {
      var t = byId(current); var user = msg.previousElementSibling;
      [user, msg].forEach(function (n) { if (n && n.animate) n.animate([{ opacity: 1 }, { opacity: 0, transform: "scale(.98)" }], { duration: 200 }); });
      setTimeout(function () {
        if (t) { var i = t.msgs.indexOf(m); if (i > 0) t.msgs.splice(i - 1, 2); }
        if (user && user.classList.contains("cai-user")) user.remove(); msg.remove();
      }, 190);
    }
  }

  /* ---------- Header button, shortcut, route ---------- */
  document.addEventListener("click", function (e) {
    var b = e.target.closest("[data-cai-go]"); if (!b) return;
    e.preventDefault();
    location.hash = current ? "ai/" + current : "ai";
  });
  document.addEventListener("keydown", function (e) {
    if ((e.metaKey || e.ctrlKey) && (e.key === "j" || e.key === "J")) { e.preventDefault(); if (aiVisible()) location.hash = lastOutside || "home"; else location.hash = current ? "ai/" + current : "ai"; }
    if (e.key === "Escape" && aiVisible() && !rec.hidden) stopRec(false);
  });
  document.addEventListener("carlink:route", function (e) {
    var r = e.detail || {};
    $$(".cai-ask").forEach(function (b) { b.classList.toggle("is-active", r.view === "ai"); });
    if (r.view !== "ai") { lastOutside = location.hash.replace(/^#/, ""); if (busy) busy.cancel(); return; }
    var id = r.id && byId(r.id) ? r.id : null;
    render(id); requestAnimationFrame(fitHeight); setTimeout(fitHeight, 300);
  });
  setReply(null);
  renderTabs(); renderRecent();
  if (window.Carlink && window.Carlink.route && window.Carlink.route.view === "ai") { $$(".cai-ask").forEach(function (b) { b.classList.add("is-active"); }); requestAnimationFrame(fitHeight); }
  if (window.Carlink && window.Carlink.route && window.Carlink.route.view === "ai") render(window.Carlink.route.id && byId(window.Carlink.route.id) ? window.Carlink.route.id : null);
})();
