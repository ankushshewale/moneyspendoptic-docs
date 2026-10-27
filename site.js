/* Money SpendOptic home page: carousel, hero tilt, count-up, questions, computer-view demo.
   Plain JS, no framework. Spec: docs/website-design/WEBSITE_SPEC.md */
(function () {
  'use strict';
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Carousel + feature cards ---------- */
  var FEAT = [
    ['Daily transactions', 'Every entry by day, with the month’s income, expense and total on top.'],
    ['Insights', 'Spending by category or month bars, a six-month trend and compare with last month.'],
    ['Notes that fill themselves', 'Start typing a note and pick a past entry - category and account fill in for you.'],
    ['Add several', 'One account, many rows: enter a whole bill or a trip in one go. They show as one group you can name and rename.'],
    ['Tags', 'Tag entries across categories - a trip, a person, a project - and find them again.'],
    ['Repeat', 'Rent, subscriptions and salary add themselves on schedule, and you see what’s coming up next.'],
    ['Installments', 'Split a big buy into parts: see how many are paid and when the next one is due.'],
    ['Budgets', 'A limit per category with clear over and under bars.'],
    ['Accounts and cards', 'Groups, balances that add up, a summary card on every account, card statements, loans, investments and transfers.'],
    ['Card statements', 'Each card shows what you owe against its limit, every statement billed and unpaid, and a Mark paid button for when you have paid it. Add the card anniversary for an annual fee reminder and a fee-waiver spend tracker.'],
    ['Accounts and groups', 'Cash, bank, cards and more in groups: add, hide, reorder and edit.'],
    ['Categories', 'Categories with subcategories for expense and income, each with its own icon to pick, and your own to add.'],
    ['Notes', 'Memos for any day, like a shopping list or a trip plan, as coloured notes you can pin.'],
    ['Search and filters', 'Search notes and descriptions, with results under day headings and their notes; filter by type, account, category, amount and period.'],
    ['Backup and privacy', 'Backup file, your own Google Drive, Excel import - your data stays yours.'],
    ['Reminders', 'A bell on the Trans tab lists what needs a look: card bills, overdue bills, loan EMIs, budgets and accounts that may run short for the payments coming. Switch on only the reminders you want, account by account.']
  ];
  var N = FEAT.length;
  var slides = $$('#stage .slide');
  var cards = $$('#cards .card');
  var dotsBox = $('#dots');
  var title = $('#scrTitle');
  var desc = $('#scrDesc');
  var cur = 0, paused = reduce, hover = false;

  var dots = FEAT.map(function (f, i) {
    var b = document.createElement('button');
    b.type = 'button';
    b.setAttribute('aria-label', 'Show ' + f[0]);
    b.appendChild(document.createElement('i'));
    b.addEventListener('click', function () { go(i); });
    dotsBox.appendChild(b);
    return b;
  });

  function go(i) { paused = true; show(i); }

  function show(i) {
    cur = ((i % N) + N) % N;
    slides.forEach(function (el, k) {
      var off = k - cur;
      if (off > N / 2) off -= N;
      if (off < -N / 2) off += N;
      var ab = Math.abs(off), vis = ab <= 2;
      el.style.transform = 'translateX(' + off * 250 + 'px) scale(' + (1 - ab * 0.14) + ') rotateY(' + off * -8 + 'deg)';
      el.style.zIndex = 10 - ab;
      el.style.opacity = vis ? (ab === 0 ? 1 : ab === 1 ? 0.75 : 0.35) : 0;
      el.style.filter = ab === 0 ? 'none' : 'saturate(.6)';
      el.style.pointerEvents = vis ? 'auto' : 'none';
      el.classList.toggle('show', vis);
      el.classList.toggle('cur', off === 0);
      el.setAttribute('aria-hidden', ab === 0 ? 'false' : 'true');
      if (vis) { var img = el.querySelector('img'); if (img && img.loading === 'lazy') img.loading = 'eager'; }
    });
    cards.forEach(function (c, k) {
      c.classList.toggle('on', k === cur);
      if (k === cur) c.setAttribute('aria-current', 'true'); else c.removeAttribute('aria-current');
    });
    dots.forEach(function (d, k) { d.setAttribute('aria-current', k === cur ? 'true' : 'false'); });
    title.textContent = FEAT[cur][0];
    desc.textContent = FEAT[cur][1];
  }

  slides.forEach(function (el, k) { el.addEventListener('click', function () { if (k === cur) openLb(k); else go(k); }); });
  cards.forEach(function (c, k) { c.addEventListener('click', function () { go(k); }); });
  $('#prev').addEventListener('click', function () { go(cur - 1); });
  $('#next').addEventListener('click', function () { go(cur + 1); });
  var stage = $('#stage');
  stage.addEventListener('mouseenter', function () { hover = true; });
  stage.addEventListener('mouseleave', function () { hover = false; });
  show(0);

  /* ---------- Zoom view (lightbox) for screenshots ---------- */
  var lb = $('#lb'), lbImg = $('#lbImg'), lbPrev = $('#lbPrev'), lbNext = $('#lbNext'), lbCap = $('#lbCap');
  var lbIdx = -1, lbFrom = null;
  function lbShow(i, src, alt) {
    lbImg.src = src; lbImg.alt = alt || '';
    lbCap.textContent = alt || '';
    lbPrev.hidden = lbNext.hidden = i < 0;
  }
  function openLb(i) {
    var img = $('img', slides[i]);
    lbIdx = i; lbFrom = document.activeElement;
    lbShow(i, img.currentSrc || img.src, FEAT[i][0]);
    lbOpen();
  }
  function openLbImg(img) {
    lbIdx = -1; lbFrom = document.activeElement;
    lbShow(-1, img.currentSrc || img.src, img.alt);
    lbOpen();
  }
  function lbOpen() {
    lb.hidden = false;
    void lb.offsetWidth;
    lb.classList.add('open');
    document.documentElement.style.overflow = 'hidden';
    $('.lb-x', lb).focus();
  }
  function lbClose() {
    if (lb.hidden) return;
    lb.classList.remove('open');
    document.documentElement.style.overflow = '';
    setTimeout(function () { lb.hidden = true; lbImg.removeAttribute('src'); }, reduce ? 0 : 250);
    if (lbFrom && lbFrom.focus) lbFrom.focus();
  }
  function lbStep(d) {
    if (lbIdx < 0) return;
    lbIdx = ((lbIdx + d) % N + N) % N;
    var img = $('img', slides[lbIdx]);
    img.loading = 'eager';
    lbImg.classList.remove('swap'); void lbImg.offsetWidth; lbImg.classList.add('swap');
    lbShow(lbIdx, img.currentSrc || img.src, FEAT[lbIdx][0]);
    go(lbIdx);
  }
  $('.lb-x', lb).addEventListener('click', lbClose);
  lbPrev.addEventListener('click', function () { lbStep(-1); });
  lbNext.addEventListener('click', function () { lbStep(1); });
  lb.addEventListener('click', function (e) { if (e.target === lb || e.target.classList.contains('lb-stage')) lbClose(); });
  document.addEventListener('keydown', function (e) {
    if (lb.hidden) return;
    if (e.key === 'Escape') lbClose();
    else if (e.key === 'ArrowLeft') lbStep(-1);
    else if (e.key === 'ArrowRight') lbStep(1);
    else if (e.key === 'Tab') { e.preventDefault(); var b = [$('.lb-x', lb), lbPrev, lbNext].filter(function (x) { return !x.hidden; }); var k = b.indexOf(document.activeElement); b[(k + (e.shiftKey ? -1 : 1) + b.length) % b.length].focus(); }
  });
  $$('.demo-phone .phone img, #deskView img').forEach(function (im) {
    im.classList.add('zoomable');
    im.addEventListener('click', function () { openLbImg(im); });
  });
  var swipeX = null;
  lb.addEventListener('touchstart', function (e) { swipeX = e.touches[0].clientX; }, { passive: true });
  lb.addEventListener('touchend', function (e) {
    if (swipeX === null) return;
    var dx = e.changedTouches[0].clientX - swipeX; swipeX = null;
    if (Math.abs(dx) > 60) lbStep(dx < 0 ? 1 : -1);
  }, { passive: true });

  var timer = setInterval(function () { if (!paused && !hover) show(cur + 1); }, 3800);

  /* ---------- Hero tilt ---------- */
  var hero = $('#top'), tilt = $('#tilt');
  if (!reduce && tilt) {
    hero.addEventListener('mousemove', function (e) {
      var r = hero.getBoundingClientRect();
      var x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
      tilt.style.transform = 'rotateY(' + x * 14 + 'deg) rotateX(' + y * -10 + 'deg)';
    });
    hero.addEventListener('mouseleave', function () { tilt.style.transform = ''; });
  }

  /* ---------- Count-up facts ---------- */
  var nums = $$('.facts b');
  function countUp() {
    var t0 = performance.now();
    requestAnimationFrame(function step(now) {
      var p = Math.min((now - t0) / 1600, 1), e = 1 - Math.pow(1 - p, 3);
      nums.forEach(function (b) { b.textContent = String(Math.round(+b.dataset.n * e)); });
      if (p < 1) requestAnimationFrame(step);
    });
  }
  if (!reduce && nums.length) {
    nums.forEach(function (b) { b.textContent = '0'; });
    var facts = $('.facts');
    if ('IntersectionObserver' in window && facts) {
      // start when the numbers scroll into view, so the visitor sees them count
      var seen = new IntersectionObserver(function (es) {
        if (es[0].isIntersecting) { seen.disconnect(); countUp(); }
      }, { threshold: 0.35 });
      seen.observe(facts);
    } else countUp();
  }

  /* ---------- Questions: one open at a time ---------- */
  var qs = $$('#faq .q');
  qs.forEach(function (q) {
    var btn = $('button', q), panel = $('.a', q);
    btn.addEventListener('click', function () {
      var open = btn.getAttribute('aria-expanded') === 'true';
      qs.forEach(function (o) {
        $('button', o).setAttribute('aria-expanded', 'false');
        $('.a', o).hidden = true;
      });
      if (!open) {
        btn.setAttribute('aria-expanded', 'true');
        panel.hidden = false;
        panel.classList.remove('pop'); void panel.offsetWidth; panel.classList.add('pop');
      }
    });
  });

  /* ---------- Computer view demo ---------- */
  var screen = $('#screen'), lock = $('#lock'), deskView = $('#deskView');
  var code = $('#code'), err = $('#err'), go1 = $('#go'), done = $('#done'), form = $('#lockForm');
  var top = $('#deskTop'), st = $('#deskSt'), hint = $('#deskHint');
  var desk = false, ok = false, busy = false, tries = 0;

  function sizeScreen() {
    var w = screen.clientWidth;
    var h = desk ? w * 900 / 1280 : (w <= 560 ? 660 : w * 1010 / 1280);
    screen.style.height = Math.round(h) + 'px';
  }
  if (window.ResizeObserver) new ResizeObserver(sizeScreen).observe(screen);
  window.addEventListener('resize', sizeScreen);

  function resetLock() {
    ok = false; busy = false; tries = 0;
    code.value = ''; code.className = ''; err.textContent = '';
    go1.textContent = 'Connect'; done.hidden = true;
  }
  function setDesk(on) {
    desk = on;
    lock.hidden = on; deskView.hidden = !on;
    if (!on) resetLock();
    top.textContent = on ? 'Disconnect and lock' : 'Copy code: 696399';
    st.textContent = on ? 'Connected' : 'Locked · waiting for the code';
    hint.textContent = on
      ? 'Connected. It works like the real thing: search, filter, open Add. Disconnect locks it again.'
      : 'The computer page is locked until you type the code shown on your phone.';
    sizeScreen();
    if (on) { var im = $('img', deskView); im.loading = 'eager'; im.classList.remove('pop'); void im.offsetWidth; im.classList.add('pop'); }
  }
  code.addEventListener('input', function () {
    code.value = code.value.replace(/\D/g, '').slice(0, 6);
    err.textContent = ''; code.className = ''; ok = false; done.hidden = true; go1.textContent = 'Connect';
  });
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (busy) return;
    if (code.value.length < 6) { err.textContent = 'Type all 6 digits from your phone.'; code.className = 'bad'; return; }
    busy = true; go1.textContent = 'Checking…';
    setTimeout(function () {
      busy = false;
      if (code.value === '696399') {
        ok = true; code.className = 'good'; err.textContent = ''; go1.textContent = 'Connected'; done.hidden = false;
      } else {
        tries++; code.className = 'bad'; go1.textContent = 'Connect';
        err.textContent = tries >= 3 ? 'Wrong code three times. Create a new code on your phone.' : 'That code is not right. Check your phone and try again.';
      }
    }, 600);
  });
  done.addEventListener('click', function () { setDesk(true); });
  var topTimer;
  top.addEventListener('click', function () {
    if (desk) { setDesk(false); return; }
    // Locked: copy the demo code, put it in the box too, and say so for a moment.
    try { if (navigator.clipboard) navigator.clipboard.writeText('696399').catch(function () {}); } catch (e) { /* the box below still gets the code */ }
    code.value = '696399'; err.textContent = ''; code.className = ''; ok = false; done.hidden = true; go1.textContent = 'Connect';
    top.textContent = 'Copied: 696399';
    clearTimeout(topTimer);
    topTimer = setTimeout(function () { if (!desk) top.textContent = 'Copy code: 696399'; }, 1800);
  });
  $('#deskOut').addEventListener('click', function () { setDesk(false); });
  sizeScreen();

  window.addEventListener('pagehide', function () { clearInterval(timer); if (typeof raf !== 'undefined') cancelAnimationFrame(raf); });
})();
