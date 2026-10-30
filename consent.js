/* Money SpendOptic website: cookie banner and Google Analytics.
   Google's script loads only after the visitor taps Accept; the choice is kept in this browser.
   "Cookie settings" in the footer shows the banner again. Plain JS, no framework. */
(function () {
  'use strict';
  var GA_ID = 'G-HXTBZX5WKX';
  var KEY = 'mso-analytics';
  // Count only the live site, not local previews.
  var live = /(^|\.)moneyspendoptic\.com$/.test(location.hostname);
  var loaded = false;

  function get() { try { return localStorage.getItem(KEY); } catch (e) { return null; } }
  function set(v) { try { localStorage.setItem(KEY, v); } catch (e) {} }

  function loadGa() {
    if (loaded || !live) return;
    loaded = true;
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { dataLayer.push(arguments); };
    gtag('js', new Date());
    gtag('config', GA_ID);
    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
    document.head.appendChild(s);
  }

  // Removes the _ga cookies after a visitor switches from Accept to Decline.
  function clearGa() {
    window['ga-disable-' + GA_ID] = true;
    var host = location.hostname.replace(/^www\./, '');
    document.cookie.split(';').forEach(function (c) {
      var name = c.split('=')[0].trim();
      if (name.indexOf('_ga') !== 0) return;
      ['', '; domain=' + host, '; domain=.' + host].forEach(function (d) {
        document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/' + d;
      });
    });
  }

  var css = '.ck{position:fixed;left:16px;right:16px;bottom:16px;z-index:90;max-width:560px;margin:0 auto;background:#0B0B0B;color:#fff;border-radius:24px;padding:20px 22px;' +
    'display:flex;flex-wrap:wrap;gap:14px 18px;align-items:center;box-shadow:0 20px 50px rgba(0,0,0,.25);font-family:Outfit,system-ui,sans-serif;font-weight:300;font-size:15px;line-height:1.5;' +
    'transform:translateY(24px);opacity:0;transition:transform .35s cubic-bezier(.2,.7,.2,1),opacity .35s ease}' +
    '.ck.show{transform:none;opacity:1}' +
    '.ck p{margin:0;flex:1 1 260px}.ck a{color:#fff}' +
    '.ck-b{display:flex;gap:10px;flex:0 0 auto}' +
    '.ck button{font:inherit;font-weight:500;border-radius:999px;padding:10px 18px;cursor:pointer;border:1px solid rgba(255,255,255,.35);background:transparent;color:#fff}' +
    '.ck button.yes{background:#fff;color:#0B0B0B;border-color:#fff}' +
    '.ck :focus-visible{outline:2px solid #fff;outline-offset:3px}' +
    '.ck-link{font:inherit;color:inherit;background:none;border:0;padding:0;cursor:pointer;text-decoration:underline}' +
    '@media (prefers-reduced-motion:reduce){.ck{transition:none}}';

  var box = null;

  function hide() {
    if (!box) return;
    var b = box;
    box = null;
    b.classList.remove('show');
    setTimeout(function () { b.remove(); }, 350);
  }

  function choose(v) {
    set(v);
    if (v === 'yes') loadGa(); else if (loaded) clearGa();
    hide();
  }

  function show() {
    if (box) return;
    box = document.createElement('div');
    box.className = 'ck';
    box.setAttribute('role', 'region');
    box.setAttribute('aria-label', 'Cookie choice');
    box.innerHTML = '<p>We use Google Analytics cookies to count visits to this website, only if you accept. ' +
      '<a href="privacy.html#this-website-and-fonts">Learn more</a></p>' +
      '<div class="ck-b"><button type="button" class="no">Decline</button><button type="button" class="yes">Accept</button></div>';
    box.querySelector('.yes').addEventListener('click', function () { choose('yes'); });
    box.querySelector('.no').addEventListener('click', function () { choose('no'); });
    document.body.appendChild(box);
    requestAnimationFrame(function () { requestAnimationFrame(function () { box && box.classList.add('show'); }); });
  }

  var st = document.createElement('style');
  st.textContent = css;
  document.head.appendChild(st);

  var c = get();
  if (c === 'yes') loadGa();

  function init() {
    if (c !== 'yes' && c !== 'no') show();
    var links = document.querySelectorAll('[data-cookie-settings]');
    for (var i = 0; i < links.length; i++) {
      links[i].addEventListener('click', function (e) { e.preventDefault(); show(); });
    }
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
