/* Riskfold — nav, language and theme controls */
(function () {
  'use strict';

  var mem = {};
  function get(k){ try { return localStorage.getItem(k); } catch(e){ return mem[k] || null; } }
  function set(k,v){ try { localStorage.setItem(k,v); } catch(e){ mem[k]=v; } }

  function applyTheme(t){
    document.documentElement.setAttribute('data-theme', t);
    var b = document.querySelector('.theme-btn');
    if (b) b.setAttribute('aria-label', t === 'dark' ? 'Bytt til lyst tema' : 'Bytt til mørkt tema');
  }

  function applyLang(lang){
    var root = document.documentElement;
    root.setAttribute('lang', lang === 'en' ? 'en' : 'nb');
    root.setAttribute('data-lang', lang);

    document.querySelectorAll('[data-en]').forEach(function (el) {
      if (!el.hasAttribute('data-no')) el.setAttribute('data-no', el.innerHTML);
      el.innerHTML = lang === 'en' ? el.getAttribute('data-en') : el.getAttribute('data-no');
    });

    document.querySelectorAll('[data-en-placeholder]').forEach(function (el) {
      if (!el.hasAttribute('data-no-placeholder')) el.setAttribute('data-no-placeholder', el.getAttribute('placeholder') || '');
      el.setAttribute('placeholder', lang === 'en' ? el.getAttribute('data-en-placeholder') : el.getAttribute('data-no-placeholder'));
    });

    var t = document.querySelector('title');
    if (t) {
      if (!t.hasAttribute('data-no')) t.setAttribute('data-no', t.textContent);
      t.textContent = (lang === 'en' && t.getAttribute('data-en')) ? t.getAttribute('data-en') : t.getAttribute('data-no');
    }
    var d = document.querySelector('meta[name="description"]');
    if (d && d.getAttribute('data-en')) {
      if (!d.hasAttribute('data-no')) d.setAttribute('data-no', d.getAttribute('content'));
      d.setAttribute('content', lang === 'en' ? d.getAttribute('data-en') : d.getAttribute('data-no'));
    }

    document.querySelectorAll('.lang-switch button').forEach(function (b) {
      b.setAttribute('aria-pressed', String(b.dataset.lang === lang));
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    applyTheme(get('rf-theme') || 'light');
    applyLang(get('rf-lang') || 'no');

    var themeBtn = document.querySelector('.theme-btn');
    if (themeBtn) themeBtn.addEventListener('click', function () {
      var next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      applyTheme(next); set('rf-theme', next);
    });

    document.querySelectorAll('.lang-switch button').forEach(function (b) {
      b.addEventListener('click', function () {
        applyLang(b.dataset.lang); set('rf-lang', b.dataset.lang);
      });
    });

    var toggle = document.querySelector('.nav-toggle');
    var menu = document.getElementById('mobileMenu');
    if (toggle && menu) {
      toggle.addEventListener('click', function () {
        var open = menu.classList.toggle('open');
        toggle.classList.toggle('open', open);
        toggle.setAttribute('aria-expanded', String(open));
      });
      menu.querySelectorAll('a').forEach(function (a) {
        a.addEventListener('click', function () {
          menu.classList.remove('open');
          toggle.classList.remove('open');
          toggle.setAttribute('aria-expanded', 'false');
        });
      });
    }
  });
})();
