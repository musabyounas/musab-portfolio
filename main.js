/* =========================================================
   Muhammad Musab — Portfolio
   Vanilla JS: theme switching, mobile nav, scroll reveal,
   animated skill bars & counters, active nav highlighting.
   ========================================================= */
(function () {
  'use strict';

  var body = document.body;
  var THEME_KEY = 'mm-portfolio-theme';
  var MODE_KEY = 'mm-portfolio-mode';
  var DEFAULT_THEME = 'royal-blue';
  var DEFAULT_MODE = 'dark';

  /* ---------------- Theme persistence ---------------- */
  function applyTheme(theme, mode) {
    body.setAttribute('data-theme', theme);
    body.setAttribute('data-mode', mode);
    try {
      localStorage.setItem(THEME_KEY, theme);
      localStorage.setItem(MODE_KEY, mode);
    } catch (e) { /* localStorage unavailable — theme still applies for this session */ }
    updateActiveSwatch(theme);
  }

  function updateActiveSwatch(theme) {
    var swatches = document.querySelectorAll('.theme-swatch');
    swatches.forEach(function (btn) {
      btn.classList.toggle('is-active', btn.getAttribute('data-theme') === theme);
    });
  }

  function initTheme() {
    var savedTheme = DEFAULT_THEME;
    var savedMode = DEFAULT_MODE;
    try {
      savedTheme = localStorage.getItem(THEME_KEY) || DEFAULT_THEME;
      savedMode = localStorage.getItem(MODE_KEY) || DEFAULT_MODE;
    } catch (e) { /* ignore */ }
    applyTheme(savedTheme, savedMode);
  }

  /* ---------------- Theme switcher panel ---------------- */
  function initThemeSwitcher() {
    var fab = document.getElementById('themeFab');
    var panel = document.getElementById('themePanel');
    var modeToggle = document.getElementById('modeToggle');
    var grid = document.getElementById('themeGrid');

    function closePanel() {
      panel.classList.remove('is-open');
      fab.setAttribute('aria-expanded', 'false');
    }
    function togglePanel() {
      var open = panel.classList.toggle('is-open');
      fab.setAttribute('aria-expanded', String(open));
    }

    fab.addEventListener('click', function (e) {
      e.stopPropagation();
      togglePanel();
    });

    document.addEventListener('click', function (e) {
      if (!panel.contains(e.target) && e.target !== fab) closePanel();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closePanel();
    });

    grid.addEventListener('click', function (e) {
      var btn = e.target.closest('.theme-swatch');
      if (!btn) return;
      var theme = btn.getAttribute('data-theme');
      applyTheme(theme, body.getAttribute('data-mode') || DEFAULT_MODE);
    });

    modeToggle.addEventListener('click', function () {
      var current = body.getAttribute('data-mode') === 'dark' ? 'light' : 'dark';
      applyTheme(body.getAttribute('data-theme') || DEFAULT_THEME, current);
    });
  }

  /* ---------------- Mobile nav ---------------- */
  function initNav() {
    var toggle = document.getElementById('navToggle');
    var menu = document.getElementById('navMenu');

    toggle.addEventListener('click', function () {
      var open = menu.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', String(open));
    });

    menu.querySelectorAll('.nav__link').forEach(function (link) {
      link.addEventListener('click', function () {
        menu.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });

    /* Active link highlighting via scroll position */
    var sections = Array.prototype.slice.call(document.querySelectorAll('main section[id]'));
    var links = Array.prototype.slice.call(menu.querySelectorAll('.nav__link'));

    function onScroll() {
      var scrollPos = window.scrollY + 140;
      var current = sections[0];
      sections.forEach(function (sec) {
        if (sec.offsetTop <= scrollPos) current = sec;
      });
      links.forEach(function (link) {
        var match = current && link.getAttribute('href') === '#' + current.id;
        link.classList.toggle('is-active', !!match);
      });

      var header = document.getElementById('site-header');
      header.style.boxShadow = window.scrollY > 12 ? '0 8px 24px -18px rgba(0,0,0,.6)' : 'none';
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ---------------- Scroll reveal ---------------- */
  function initReveal() {
    var items = document.querySelectorAll('[data-reveal]');
    if (!('IntersectionObserver' in window)) {
      items.forEach(function (el) { el.classList.add('is-visible'); });
      return;
    }
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

    items.forEach(function (el) { observer.observe(el); });
  }

  /* ---------------- Skill bar fill animation ---------------- */
  function initSkillBars() {
    var bars = document.querySelectorAll('.skill-bar__fill');
    if (!bars.length) return;
    if (!('IntersectionObserver' in window)) {
      bars.forEach(function (b) { b.style.width = b.getAttribute('data-fill') + '%'; });
      return;
    }
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var el = entry.target;
          el.style.width = el.getAttribute('data-fill') + '%';
          observer.unobserve(el);
        }
      });
    }, { threshold: 0.4 });
    bars.forEach(function (b) { observer.observe(b); });
  }

  /* ---------------- Animated counters ---------------- */
  function initCounters() {
    var counters = document.querySelectorAll('[data-counter]');
    if (!counters.length) return;

    function animateCounter(el) {
      var target = parseInt(el.getAttribute('data-counter'), 10) || 0;
      var duration = 1200;
      var start = null;
      function step(ts) {
        if (start === null) start = ts;
        var progress = Math.min((ts - start) / duration, 1);
        var eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.round(eased * target);
        if (progress < 1) requestAnimationFrame(step);
        else el.textContent = target;
      }
      requestAnimationFrame(step);
    }

    if (!('IntersectionObserver' in window)) {
      counters.forEach(animateCounter);
      return;
    }
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    counters.forEach(function (c) { observer.observe(c); });
  }

  /* ---------------- Footer year ---------------- */
  function initFooterYear() {
    var el = document.getElementById('year');
    if (el) el.textContent = new Date().getFullYear();
  }

  /* ---------------- Scroll progress bar ---------------- */
  function initScrollProgress() {
    var bar = document.getElementById('scrollProgress');
    if (!bar) return;
    function update() {
      var doc = document.documentElement;
      var scrollTop = doc.scrollTop || document.body.scrollTop;
      var height = doc.scrollHeight - doc.clientHeight;
      var pct = height > 0 ? (scrollTop / height) * 100 : 0;
      bar.style.width = pct + '%';
    }
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    update();
  }

  /* ---------------- Cursor-follow glow (desktop only) ---------------- */
  function initCursorGlow() {
    var hero = document.getElementById('hero');
    var glow = document.getElementById('cursorGlow');
    if (!hero || !glow) return;
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    hero.addEventListener('mousemove', function (e) {
      var rect = hero.getBoundingClientRect();
      glow.style.setProperty('--x', (e.clientX - rect.left) + 'px');
      glow.style.setProperty('--y', (e.clientY - rect.top) + 'px');
    });
  }

  /* ---------------- Hero typing / rotating role text ---------------- */
  function initTyping() {
    var el = document.getElementById('typingText');
    if (!el) return;
    var roles = [
      'MERN Stack Trainee @ Qalam.IT',
      'Ex Frappe / ERPNext Developer',
      'Aspiring Full-Stack Developer'
    ];
    var roleIndex = 0, charIndex = 0, deleting = false;

    function tick() {
      var current = roles[roleIndex];
      if (!deleting) {
        charIndex++;
        el.textContent = current.slice(0, charIndex);
        if (charIndex === current.length) {
          deleting = true;
          setTimeout(tick, 1600);
          return;
        }
        setTimeout(tick, 55);
      } else {
        charIndex--;
        el.textContent = current.slice(0, charIndex);
        if (charIndex === 0) {
          deleting = false;
          roleIndex = (roleIndex + 1) % roles.length;
          setTimeout(tick, 300);
          return;
        }
        setTimeout(tick, 28);
      }
    }
    tick();
  }

  /* ---------------- Project filter tabs ---------------- */
  function initProjectFilter() {
    var filterBar = document.querySelector('.project-filter');
    var grid = document.getElementById('projectGrid');
    if (!filterBar || !grid) return;
    var buttons = filterBar.querySelectorAll('.filter-btn');
    var cards = grid.querySelectorAll('.project-card');

    filterBar.addEventListener('click', function (e) {
      var btn = e.target.closest('.filter-btn');
      if (!btn) return;
      var filter = btn.getAttribute('data-filter');

      buttons.forEach(function (b) {
        var active = b === btn;
        b.classList.toggle('is-active', active);
        b.setAttribute('aria-selected', String(active));
      });

      cards.forEach(function (card) {
        var matches = filter === 'all' || card.getAttribute('data-category') === filter;
        if (matches) {
          card.classList.remove('is-filtered-out');
          card.classList.add('is-filtering-in');
        } else {
          card.classList.add('is-filtered-out');
          card.classList.remove('is-filtering-in');
        }
      });
    });
  }

  /* ---------------- Certificate modal ---------------- */
  function initCertModal() {
    var modal = document.getElementById('certModal');
    var img = document.getElementById('certModalImage');
    var caption = document.getElementById('certModalTitle');
    if (!modal || !img) return;

    var lastFocused = null;

    function openModal(src, title) {
      lastFocused = document.activeElement;
      img.src = src;
      img.alt = title || 'Certificate';
      caption.textContent = title || '';
      modal.classList.add('is-open');
      modal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    }

    function closeModal() {
      modal.classList.remove('is-open');
      modal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
      img.src = '';
      if (lastFocused) lastFocused.focus();
    }

    document.querySelectorAll('.cert-view-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        openModal(btn.getAttribute('data-cert-src'), btn.getAttribute('data-cert-title'));
      });
    });

    modal.querySelectorAll('[data-cert-close]').forEach(function (el) {
      el.addEventListener('click', closeModal);
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && modal.classList.contains('is-open')) closeModal();
    });
  }

  /* ---------------- Init ---------------- */
  document.addEventListener('DOMContentLoaded', function () {
    initTheme();
    initThemeSwitcher();
    initNav();
    initReveal();
    initSkillBars();
    initCounters();
    initFooterYear();
    initScrollProgress();
    initCursorGlow();
    initTyping();
    initProjectFilter();
    initCertModal();
  });
})();
