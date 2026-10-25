(() => {
  const S = window.SITE;
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const store = {
    get(k, d) { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch { return d; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} }
  };
  const toast = (msg) => {
    const t = $("#toast"); t.textContent = msg; t.classList.add("is-on");
    clearTimeout(toast.t); toast.t = setTimeout(() => t.classList.remove("is-on"), 3800);
  };

  /* ---------- nav ---------- */
  const nav = $("#nav"), burger = $("#burger"), links = $("#navLinks");
  const onScroll = () => nav.classList.toggle("is-scrolled", scrollY > 30);
  addEventListener("scroll", onScroll, { passive: true }); onScroll();
  burger.addEventListener("click", () => {
    const open = links.classList.toggle("is-open");
    burger.setAttribute("aria-expanded", open);
  });
  $$("#navLinks a").forEach(a => a.addEventListener("click", () => {
    links.classList.remove("is-open"); burger.setAttribute("aria-expanded", "false");
  }));

  /* ---------- light / dark toggle ---------- */
  const root = document.documentElement, toggle = $("#themeToggle");
  const themeColor = { dark: "#0B1120", light: "#F3F8F5" };
  function applyTheme(t) {
    root.setAttribute("data-theme", t);
    $('meta[name="theme-color"]').setAttribute("content", themeColor[t]);
    toggle.setAttribute("aria-label", t === "dark" ? "Switch to light mode" : "Switch to dark mode");
  }
  applyTheme(root.getAttribute("data-theme") || "dark");
  toggle.addEventListener("click", () => {
    const t = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
    applyTheme(t);
    try { localStorage.setItem("ea-theme", t); } catch {}
  });

  /* ---------- optically centre single Arabic glyphs ---------- */
  // Arabic letters sit off-centre in their em box, so measure the ink and shift it.
  const ctx = document.createElement("canvas").getContext("2d");
  function centerGlyphs() {
    $$(".glyph").forEach(el => {
      const cs = getComputedStyle(el), size = parseFloat(cs.fontSize);
      ctx.font = `${cs.fontWeight} ${size}px ${cs.fontFamily}`;
      ctx.direction = "ltr"; ctx.textAlign = "left";
      const m = ctx.measureText(el.textContent.trim());
      const baseline = (size - (m.fontBoundingBoxAscent + m.fontBoundingBoxDescent)) / 2 + m.fontBoundingBoxAscent;
      const inkY = baseline + (m.actualBoundingBoxDescent - m.actualBoundingBoxAscent) / 2;
      const inkX = (m.actualBoundingBoxRight - m.actualBoundingBoxLeft) / 2;
      el.style.setProperty("--gy", (size / 2 - inkY).toFixed(1) + "px");
      el.style.setProperty("--gx", (m.width / 2 - inkX).toFixed(1) + "px");
    });
  }
  document.fonts.ready.then(centerGlyphs);
  addEventListener("resize", centerGlyphs);

  /* ---------- reveal + counters ---------- */
  const io = new IntersectionObserver(entries => entries.forEach(e => {
    if (!e.isIntersecting) return;
    e.target.classList.add("is-in");
    $$("[data-count]", e.target).forEach(countUp);
    io.unobserve(e.target);
  }), { threshold: .12, rootMargin: "0px 0px -40px 0px" });
  $$(".reveal").forEach((el, i) => { el.style.transitionDelay = (i % 4) * 80 + "ms"; io.observe(el); });
  function countUp(el) {
    const end = +el.dataset.count, t0 = performance.now(), dur = 1400;
    const tick = (t) => {
      const p = Math.min(1, (t - t0) / dur);
      el.textContent = Math.round(end * (1 - Math.pow(1 - p, 3)));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }

  /* ---------- hero word rotator ---------- */
  const words = $$("#rotator .rotator__word"); let wi = 0;
  setInterval(() => {
    const cur = words[wi]; cur.classList.remove("is-on"); cur.classList.add("is-out");
    setTimeout(() => cur.classList.remove("is-out"), 700);
    wi = (wi + 1) % words.length; words[wi].classList.add("is-on");
  }, 2600);

  /* ---------- magnetic button & card spotlight ---------- */
  $$(".magnetic").forEach(b => {
    b.addEventListener("mousemove", e => {
      const r = b.getBoundingClientRect();
      b.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * .18}px, ${(e.clientY - r.top - r.height / 2) * .3}px)`;
    });
    b.addEventListener("mouseleave", () => b.style.transform = "");
  });
  $$(".card").forEach(c => c.addEventListener("mousemove", e => {
    const r = c.getBoundingClientRect();
    c.style.setProperty("--mx", e.clientX - r.left + "px");
    c.style.setProperty("--my", e.clientY - r.top + "px");
  }));

  /* ---------- program filter + prices ---------- */
  $$(".tab").forEach(tab => tab.addEventListener("click", () => {
    $$(".tab").forEach(t => t.classList.toggle("is-on", t === tab));
    const f = tab.dataset.filter;
    $$("#cards .card").forEach(c => c.classList.toggle("is-hidden", f !== "all" && !c.dataset.cat.split(" ").includes(f)));
  }));
  $$("[data-price]").forEach(el => { const p = S.prices[el.dataset.price]; if (p) el.textContent = p; });

  // program buttons pre-select the booking form
  $$("[data-program]").forEach(b => b.addEventListener("click", () => {
    const sel = $("#f-program");
    [...sel.options].forEach(o => { if (o.text === b.dataset.program) sel.value = o.value; });
  }));

  /* ---------- video course ---------- */
  const vids = S.videos;
  let done = new Set(store.get("ea-watched", []));
  let current = Math.min(store.get("ea-current", 0), vids.length - 1);
  const pl = $("#playlist"), frame = $("#frame");
  const pad = n => String(n + 1).padStart(2, "0");

  pl.innerHTML = vids.map((v, i) => `
    <li data-i="${i}"><button type="button">
      <span class="pl__n">${pad(i)}</span>
      <span class="pl__t">${v.title}<small>Lesson ${i + 1}${v.mins ? " · " + v.mins + " min" : ""}</small></span>
    </button></li>`).join("");
  $$("li", pl).forEach(li => li.querySelector("button").addEventListener("click", () => load(+li.dataset.i, true)));

  function embedUrl(i) {
    const v = vids[i], q = "rel=0&modestbranding=1&autoplay=1";
    if (v.id) return `https://www.youtube-nocookie.com/embed/${v.id}?${q}`;
    if (S.youtubePlaylistId) return `https://www.youtube-nocookie.com/embed/videoseries?list=${S.youtubePlaylistId}&index=${i}&${q}`;
    return null;
  }
  function load(i, play) {
    current = i; store.set("ea-current", i);
    $("#nowNum").textContent = `Lesson ${pad(i)} of ${vids.length}`;
    $("#nowTitle").textContent = vids[i].title;
    $$("li", pl).forEach((li, k) => {
      li.classList.toggle("is-on", k === i);
      li.classList.toggle("is-done", done.has(k) && k !== i);
    });
    const url = embedUrl(i);
    if (play && url) {
      frame.innerHTML = `<iframe src="${url}" title="${vids[i].title}" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
      done.add(i); store.set("ea-watched", [...done]); progress();
    } else {
      frame.innerHTML = `<button class="player__poster" type="button">
        <span class="big-ar" lang="ar">الدرس ${(i + 1).toLocaleString("ar-EG")}</span>
        <span class="play-btn">▶</span>
        ${url ? "" : "<small>Video coming soon — add the YouTube link in js/config.js</small>"}
      </button>`;
      $(".player__poster", frame).addEventListener("click", () => url ? load(i, true) : toast("This lesson's video link hasn't been added yet."));
    }
    if (play) {
      const li = $$("li", pl)[i];
      pl.scrollTo({ top: li.offsetTop - pl.offsetTop - 8, behavior: "smooth" });
    }
  }
  function progress() {
    $("#progText").textContent = `${done.size} / ${vids.length}`;
    $("#progBar").style.width = (done.size / vids.length) * 100 + "%";
  }
  $("#prevVid").addEventListener("click", () => load((current - 1 + vids.length) % vids.length, true));
  $("#nextVid").addEventListener("click", () => load((current + 1) % vids.length, true));
  load(current, false); progress();

  /* ---------- alphabet ---------- */
  const letters = [
    ["ا","ألف","alif","a"],["ب","باء","baa","b"],["ت","تاء","taa","t"],["ث","ثاء","thaa","th (as in think)"],
    ["ج","جيم","jeem","j"],["ح","حاء","ḥaa","breathy h"],["خ","خاء","khaa","kh (as in Bach)"],["د","دال","daal","d"],
    ["ذ","ذال","dhaal","th (as in this)"],["ر","راء","raa","rolled r"],["ز","زاي","zaay","z"],["س","سين","seen","s"],
    ["ش","شين","sheen","sh"],["ص","صاد","ṣaad","heavy s"],["ض","ضاد","ḍaad","heavy d"],["ط","طاء","ṭaa","heavy t"],
    ["ظ","ظاء","ẓaa","heavy th"],["ع","عين","ʿayn","deep throat sound"],["غ","غين","ghayn","gargled g"],["ف","فاء","faa","f"],
    ["ق","قاف","qaaf","deep q"],["ك","كاف","kaaf","k"],["ل","لام","laam","l"],["م","ميم","meem","m"],
    ["ن","نون","noon","n"],["ه","هاء","haa","h"],["و","واو","waaw","w / oo"],["ي","ياء","yaa","y / ee"]
  ];
  const alpha = $("#alpha"), out = $("#alphaOut");
  alpha.innerHTML = letters.map((l, i) => `<button type="button" data-i="${i}" aria-label="${l[2]}" lang="ar">${l[0]}</button>`).join("");
  let arVoice = null;
  const pickVoice = () => { arVoice = speechSynthesis.getVoices().find(v => v.lang.startsWith("ar")) || null; };
  if ("speechSynthesis" in window) { pickVoice(); speechSynthesis.onvoiceschanged = pickVoice; }
  alpha.addEventListener("click", e => {
    const b = e.target.closest("button"); if (!b) return;
    const [ch, nameAr, name, sound] = letters[+b.dataset.i];
    $$("button", alpha).forEach(x => x.classList.toggle("is-on", x === b));
    out.innerHTML = `<span class="alpha__big" lang="ar">${ch}</span><span class="alpha__name">${name} <span lang="ar">· ${nameAr}</span><small>Sounds like: ${sound}</small></span>`;
    out.classList.remove("pop"); void out.offsetWidth; out.classList.add("pop");
    if (arVoice) {
      speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(nameAr); u.voice = arVoice; u.lang = arVoice.lang; u.rate = .8;
      speechSynthesis.speak(u);
    }
  });

  /* ---------- tajweed demo ---------- */
  const rules = {
    ghunnah:  { w: "إِ<mark>نَّ</mark> ٱللَّهَ", d: "<b>Ghunnah</b> — a nasal sound held for two counts on a noon or meem with shaddah." },
    qalqalah: { w: "ٱلْفَلَ<mark>قِ</mark>", d: "<b>Qalqalah</b> — a slight echo/bounce on ق ط ب ج د when they carry sukoon or you stop on them." },
    ikhfa:    { w: "مِ<mark>نْ</mark> شَرِّ", d: "<b>Ikhfa</b> — the noon sakinah is ‘hidden’ with a nasal sound before 15 specific letters." },
    idgham:   { w: "مَ<mark>ن يَ</mark>قُولُ", d: "<b>Idgham</b> — the noon sakinah merges into the next letter (ي ر م ل و ن)." },
    iqlab:    { w: "مِ<mark>نۢ بَ</mark>عْدِ", d: "<b>Iqlab</b> — noon sakinah or tanween before ب turns into a hidden meem sound." },
    madd:     { w: "وَلَا ٱلضَّ<mark>آ</mark>لِّينَ", d: "<b>Madd</b> — lengthening a vowel; here a necessary madd stretched for six counts." }
  };
  const showRule = (btn) => {
    $$(".rule").forEach(r => r.classList.toggle("is-on", r === btn));
    const r = rules[btn.dataset.rule], box = $("#ruleShow");
    box.style.setProperty("--c", btn.style.getPropertyValue("--c"));
    $("#ruleWord").innerHTML = r.w; $("#ruleDesc").innerHTML = r.d;
  };
  $$(".rule").forEach(b => { b.addEventListener("click", () => showRule(b)); b.addEventListener("mouseenter", () => showRule(b)); });
  showRule($(".rule"));

  /* ---------- contact helpers ---------- */
  function send(text) {
    if (S.whatsapp) return window.open(`https://wa.me/${S.whatsapp}?text=${encodeURIComponent(text)}`, "_blank", "noopener");
    if (S.email) return location.href = `mailto:${S.email}?subject=${encodeURIComponent("Easy Arabic enquiry")}&body=${encodeURIComponent(text)}`;
    toast("Almost there! Add a WhatsApp number or email in js/config.js to receive requests.");
  }
  const fab = $("#fab");
  if (S.whatsapp) { fab.href = `https://wa.me/${S.whatsapp}`; fab.target = "_blank"; fab.rel = "noopener"; }

  const contact = $("#contactList");
  const items = [];
  if (S.whatsapp) items.push(`<li><a href="https://wa.me/${S.whatsapp}" target="_blank" rel="noopener"><span>💬</span> WhatsApp +${S.whatsapp}</a></li>`);
  if (S.email) items.push(`<li><a href="mailto:${S.email}"><span>✉️</span> ${S.email}</a></li>`);
  items.push(`<li><a><span>🎥</span> Live on Zoom &amp; Google Meet</a></li>`, `<li><a><span>🌍</span> Students welcome from every time zone</a></li>`);
  contact.innerHTML = items.join("");

  /* ---------- booking form ---------- */
  $("#f-tz").value = Intl.DateTimeFormat().resolvedOptions().timeZone || "";
  $("#bookForm").addEventListener("submit", e => {
    e.preventDefault();
    const f = e.target; let ok = true;
    ["name", "contact"].forEach(n => {
      const el = f.elements[n], bad = !el.value.trim();
      el.classList.toggle("is-invalid", bad); if (bad) ok = false;
    });
    if (!ok) return toast("Please add your name and how to reach you.");
    const d = Object.fromEntries(new FormData(f));
    send(`Assalamu alaikum! I'd like to book a free trial class.

Name: ${d.name}
Contact: ${d.contact}
Program: ${d.program}
Level: ${d.level}
For: ${d.who}
Preferred times: ${d.time || "-"}
Time zone: ${d.tz || "-"}
${d.msg ? "\nMessage: " + d.msg : ""}`);
  });

  /* ---------- book buttons ---------- */
  const B = S.book;
  const setBuy = (el, url, price, label) => {
    $(el === "#buyPrint" ? "#pricePrint" : "#priceDigital").textContent = price || "";
    const a = $(el);
    if (url) { a.href = url; a.target = "_blank"; a.rel = "noopener"; }
    else a.addEventListener("click", e => { e.preventDefault(); send(`Assalamu alaikum! I'd like to order ${label} of "${B.title}".`); });
  };
  setBuy("#buyPrint", B.buyPrintUrl, B.pricePrint, "a printed copy");
  setBuy("#buyDigital", B.buyDigitalUrl, B.priceDigital, "the digital edition");

  /* ---------- book reader ---------- */
  const sample = `<span class="page__sample">Sample layout</span>`;
  const demo = [
    `<div class="page__in" style="justify-content:center;text-align:center">${sample}
      <p lang="ar" dir="rtl" style="font-size:2.6em;font-weight:700;margin:0">تعلّم العربية بسهولة</p>
      <h3 style="font-size:2.4em;margin:.3em 0">Easy Arabic Grammar</h3>
      <p style="letter-spacing:.15em;text-transform:uppercase;color:#7A6E55">A step-by-step guide for beginners</p>
      <p style="margin-top:3em;font-weight:700">Abdullah M. Khalid</p></div>`,
    `<div class="page__in">${sample}<h3>Contents</h3>
      <p>1. The Arabic Alphabet ........ 3<br>2. Letter Shapes ........ 9<br>3. Short Vowels ........ 15<br>4. Long Vowels &amp; Sukoon ........ 21<br>5. Shaddah &amp; Tanween ........ 27<br>6. Reading Words ........ 33<br>7. Nouns &amp; “Al” ........ 39<br>8. Simple Sentences ........ 45</p>
      <p style="margin-top:auto;color:#7A6E55"><i>Replace these sample pages with your real book pages in js/config.js.</i></p></div>`,
    `<div class="page__in">${sample}<h4>Lesson 1</h4><h3>The Arabic Alphabet</h3>
      <p>Arabic is written from <b>right to left</b>. It has <b>28 letters</b>, and most of them join to the letter that follows.</p>
      <p lang="ar" dir="rtl" style="font-size:2.4em;text-align:center;margin:.4em 0">ا ب ت ث ج ح خ</p>
      <p>Don't worry about memorising everything at once — we will learn a few letters at a time, with lots of practice.</p></div>`,
    `<div class="page__in">${sample}<h4>Lesson 1 · continued</h4><h3>Meet the letters</h3>
      <div class="ltr-grid">${letters.slice(0, 12).map(l => `<div><b>${l[0]}</b><small>${l[2]}</small></div>`).join("")}</div></div>`,
    `<div class="page__in">${sample}<h4>Practice</h4><h3>Your turn</h3>
      <p>1. Say each letter aloud three times.</p><p>2. Circle the letter <span lang="ar" style="font-size:1.6em">ب</span> in each word:</p>
      <p lang="ar" dir="rtl" style="font-size:2em;text-align:center">بَاب · كِتَاب · بَيْت</p>
      <p>3. Trace and write the first seven letters in your notebook.</p></div>`
  ];
  const pages = (B.previewPages.length ? B.previewPages.map(src => `<img src="${src}" alt="Book preview page" decoding="async">`) : demo)
    .map((html, i) => `<div class="page">${html}${B.previewPages.length ? "" : `<span class="page__no">${i + 1}</span>`}</div>`);
  pages.push(`<div class="page page--end"><p lang="ar" style="font-size:2.4em;color:var(--gold);margin:0">يتبع…</p>
    <h3>Enjoyed the preview?</h3><p>Continue your journey with the complete book — every lesson, exercise and answer key.</p>
    <a href="#book" class="btn btn--gold btn--sm" data-close>Get the full book</a></div>`);
  const previewCount = pages.length - 1;

  const reader = $("#reader"), spread = $("#spread");
  let pg = 0;
  const perView = () => matchMedia("(min-width: 901px)").matches ? 2 : 1;
  function render() {
    const n = perView(); pg = Math.max(0, Math.min(pg, pages.length - 1)); if (n === 2) pg -= pg % 2;
    spread.innerHTML = pages.slice(pg, pg + n).join("");
    const last = Math.min(pg + n, previewCount);
    $("#pgInfo").textContent = pg >= previewCount ? "End of free preview" : `Page ${pg + 1}${n === 2 && last > pg + 1 ? "–" + last : ""} of ${previewCount}`;
    $("#pgPrev").disabled = pg === 0; $("#pgNext").disabled = pg + n >= pages.length;
    $$("[data-close]", spread).forEach(a => a.addEventListener("click", closeReader));
  }
  function openReader() { B.previewPages.forEach(src => { new Image().src = src; }); pg = 0; reader.hidden = false; document.body.style.overflow = "hidden"; render(); $("#closeReader").focus(); }
  function closeReader() { reader.hidden = true; document.body.style.overflow = ""; }
  $("#openReader").addEventListener("click", openReader);
  $("#closeReader").addEventListener("click", closeReader);
  $("#readerBuy").addEventListener("click", closeReader);
  $("#pgPrev").addEventListener("click", () => { pg -= perView(); render(); });
  $("#pgNext").addEventListener("click", () => { pg += perView(); render(); });
  addEventListener("keydown", e => {
    if (reader.hidden) return;
    if (e.key === "Escape") closeReader();
    if (e.key === "ArrowRight") $("#pgNext").click();
    if (e.key === "ArrowLeft") $("#pgPrev").click();
  });
  addEventListener("resize", () => { if (!reader.hidden) render(); });
  let tx = 0;
  spread.addEventListener("touchstart", e => tx = e.touches[0].clientX, { passive: true });
  spread.addEventListener("touchend", e => {
    const dx = e.changedTouches[0].clientX - tx;
    if (Math.abs(dx) > 50) (dx < 0 ? $("#pgNext") : $("#pgPrev")).click();
  });

  /* ---------- social + footer ---------- */
  const icons = {
    youtube: '<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M23 7.2a3 3 0 0 0-2.1-2.1C19 4.6 12 4.6 12 4.6s-7 0-8.9.5A3 3 0 0 0 1 7.2 31 31 0 0 0 .5 12a31 31 0 0 0 .5 4.8 3 3 0 0 0 2.1 2.1c1.9.5 8.9.5 8.9.5s7 0 8.9-.5a3 3 0 0 0 2.1-2.1 31 31 0 0 0 .5-4.8 31 31 0 0 0-.5-4.8ZM9.7 15V9l5.8 3-5.8 3Z"/></svg>',
    instagram: '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor"/></svg>',
    facebook: '<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M14 8V6.5c0-.7.5-1 1-1h2V2h-3c-3 0-4 2-4 4.5V8H8v3.5h2V22h4V11.5h3l.5-3.5H14Z"/></svg>',
    tiktok: '<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M16.5 2h-3.3v13.2a2.9 2.9 0 1 1-2.1-2.8V9a6.3 6.3 0 1 0 5.4 6.2V8.6a7.6 7.6 0 0 0 4.4 1.4V6.7A4.4 4.4 0 0 1 16.5 2Z"/></svg>'
  };
  $("#social").innerHTML = Object.entries(S.social).filter(([, u]) => u)
    .map(([k, u]) => `<a href="${u}" target="_blank" rel="noopener" aria-label="${k}">${icons[k]}</a>`).join("");
  $("#year").textContent = new Date().getFullYear();
})();
