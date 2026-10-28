/* Money SpendOptic home page: highlights gallery, hero tilt, count-up, questions, computer-view demo.
   Plain JS, no framework. Spec: docs/website-design/WEBSITE_SPEC.md */
(function () {
  'use strict';
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Highlights gallery ---------- */
  var N = $$('#gal li').length;

  /* ---------- Zoom view (lightbox): one picture, or every feature to swipe through ---------- */
  var lb = $('#lb'), lbImg = $('#lbImg'), lbPrev = $('#lbPrev'), lbNext = $('#lbNext'), lbCap = $('#lbCap');
  var lbStage = $('.lb-stage', lb), lbTrack = $('#lbTrack'), lbCount = $('#lbCount');
  var lbIdx = -1, lbFrom = null, lbBuilt = false, lbRaf = 0;
  var galItems = $$('#gal li');

  function lbBuild() {
    if (lbBuilt) return;
    lbBuilt = true;
    galItems.forEach(function (li) {
      var im = $('img', li), slide = document.createElement('div');
      slide.className = 'lb-slide';
      var big = document.createElement('img');
      big.src = im.currentSrc || im.src; big.alt = im.alt; big.loading = 'lazy'; big.decoding = 'async';
      var cap = document.createElement('div');
      cap.className = 'lb-use';
      var t = document.createElement('b'); t.textContent = $('h3', li).textContent;
      var p = document.createElement('span'); p.textContent = $('p', li).textContent;
      cap.appendChild(t); cap.appendChild(p);
      slide.appendChild(big); slide.appendChild(cap);
      lbTrack.appendChild(slide);
    });
  }
  function lbOpen() {
    lb.hidden = false;
    void lb.offsetWidth;
    lb.classList.add('open');
    document.documentElement.style.overflow = 'hidden';
    $('.lb-x', lb).focus();
  }
  function lbSync() {
    var w = lbTrack.clientWidth || 1;
    lbIdx = Math.max(0, Math.min(N - 1, Math.round(lbTrack.scrollLeft / w)));
    lbCount.textContent = (lbIdx + 1) + ' / ' + N;
    lbPrev.disabled = lbIdx === 0; lbNext.disabled = lbIdx === N - 1;
  }
  function openLb(i) {
    lbBuild();
    lbFrom = document.activeElement;
    lbStage.hidden = true; lbTrack.hidden = false; lbCount.hidden = false;
    lbPrev.hidden = lbNext.hidden = false;
    lbOpen();
    lbTrack.style.scrollBehavior = 'auto';
    lbTrack.scrollLeft = i * lbTrack.clientWidth;
    lbTrack.style.scrollBehavior = '';
    lbSync();
  }
  function openLbImg(img) {
    lbIdx = -1; lbFrom = document.activeElement;
    lbStage.hidden = false; lbTrack.hidden = true; lbCount.hidden = true;
    lbPrev.hidden = lbNext.hidden = true;
    lbImg.src = img.currentSrc || img.src; lbImg.alt = img.alt || '';
    lbCap.textContent = img.alt || '';
    lbOpen();
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
    lbTrack.scrollBy({ left: d * lbTrack.clientWidth, behavior: reduce ? 'auto' : 'smooth' });
  }
  lbTrack.addEventListener('scroll', function () {
    if (lbRaf) return;
    lbRaf = requestAnimationFrame(function () { lbRaf = 0; lbSync(); });
  }, { passive: true });
  $('.lb-x', lb).addEventListener('click', lbClose);
  lbPrev.addEventListener('click', function () { lbStep(-1); });
  lbNext.addEventListener('click', function () { lbStep(1); });
  lb.addEventListener('click', function (e) {
    if (e.target === lb || e.target.classList.contains('lb-stage') || e.target.classList.contains('lb-slide')) lbClose();
  });
  document.addEventListener('keydown', function (e) {
    if (lb.hidden) return;
    if (e.key === 'Escape') lbClose();
    else if (e.key === 'ArrowLeft') lbStep(-1);
    else if (e.key === 'ArrowRight') lbStep(1);
    else if (e.key === 'Tab') {
      e.preventDefault();
      var b = [$('.lb-x', lb), lbPrev, lbNext].filter(function (x) { return !x.hidden && !x.disabled; });
      var k = b.indexOf(document.activeElement);
      b[(k + (e.shiftKey ? b.length - 1 : 1)) % b.length].focus();
    }
  });
  $$('.demo-phone .phone img, #deskView img').forEach(function (im) {
    im.classList.add('zoomable');
    im.addEventListener('click', function () { openLbImg(im); });
  });
  galItems.forEach(function (li, k) {
    var im = $('img', li);
    im.classList.add('zoomable');
    im.addEventListener('click', function () { openLb(k); });
  });
  var gal = $('#gal');
  function galStep(d) { gal.scrollBy({ left: d * 320, behavior: reduce ? 'auto' : 'smooth' }); }
  $('#galPrev').addEventListener('click', function () { galStep(-1); });
  $('#galNext').addEventListener('click', function () { galStep(1); });

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
