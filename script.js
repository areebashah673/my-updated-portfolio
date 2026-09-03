/* ===== Areeba Shah - Portfolio Interactions ===== */
(function () {
  'use strict';

  /* ---------- 1. Typing effect (hero role) ---------- */
  var roles = [
    'responsive websites.',
    'WordPress themes.',
    'Shopify stores.',
    'custom plugins.',
    'beautiful UIs.'
  ];
  var typedEl = document.getElementById('typed');
  var roleIndex = 0;
  var charIndex = 0;
  var deleting = false;

  function typeLoop() {
    if (!typedEl) return;

    var current = roles[roleIndex];

    if (!deleting) {
      charIndex++;
      typedEl.textContent = current.slice(0, charIndex);
      if (charIndex === current.length) {
        deleting = true;
        setTimeout(typeLoop, 2200); // pause at full word
        return;
      }
      setTimeout(typeLoop, 60 + Math.random() * 50);
    } else {
      charIndex--;
      typedEl.textContent = current.slice(0, charIndex);
      if (charIndex === 0) {
        deleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        setTimeout(typeLoop, 400);
        return;
      }
      setTimeout(typeLoop, 30);
    }
  }

  typeLoop();

  /* ---------- 2. Mobile menu ---------- */
  var navToggle = document.getElementById('navToggle');
  var navLinks = document.getElementById('navLinks');

  function closeMenu() {
    if (!navToggle || !navLinks) return;
    navLinks.classList.remove('open');
    navToggle.classList.remove('active');
    navToggle.setAttribute('aria-expanded', 'false');
  }

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', function () {
      var isOpen = navLinks.classList.toggle('open');
      navToggle.classList.toggle('active', isOpen);
      navToggle.setAttribute('aria-expanded', String(isOpen));
    });

    navLinks.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', closeMenu);
    });
  }

  /* ---------- 3. Theme toggle (dark/light) ---------- */
  var themeToggle = document.getElementById('themeToggle');

  function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    try {
      localStorage.setItem('theme', theme);
    } catch (e) { /* storage unavailable, ignore */ }
    if (themeToggle) {
      themeToggle.setAttribute('aria-label', theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
    }
  }

  if (themeToggle) {
    themeToggle.addEventListener('click', function () {
      var current = document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
      setTheme(current === 'light' ? 'dark' : 'light');
    });
  }

  /* ---------- 4. Sticky navbar on scroll ---------- */
  var nav = document.getElementById('nav');

  function onScrollNav() {
    if (!nav) return;
    if (window.scrollY > 20) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', onScrollNav, { passive: true });
  onScrollNav();

  /* ---------- 5. Active nav link highlighting ---------- */
  var sections = document.querySelectorAll('section[id]');
  var navAnchors = document.querySelectorAll('.nav-link');

  function onScrollSpy() {
    var pos = window.scrollY + 120;
    var currentId = 'home';

    sections.forEach(function (section) {
      if (pos >= section.offsetTop) {
        currentId = section.id;
      }
    });

    navAnchors.forEach(function (link) {
      link.classList.toggle('active', link.getAttribute('href') === '#' + currentId);
    });
  }

  window.addEventListener('scroll', onScrollSpy, { passive: true });
  onScrollSpy();

  /* ---------- 6. Reveal-on-scroll animations ---------- */
  var revealEls = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    var revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    revealEls.forEach(function (el) {
      revealObserver.observe(el);
    });
  } else {
    // Fallback: show everything immediately
    revealEls.forEach(function (el) {
      el.classList.add('visible');
    });
  }

  /* ---------- 7. Smooth scrolling ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var targetId = this.getAttribute('href');
      if (targetId === '#') return;
      var target = document.querySelector(targetId);
      if (!target) return;

      e.preventDefault();
      var headerOffset = nav ? nav.offsetHeight : 0;
      var top = target.getBoundingClientRect().top + window.scrollY - headerOffset;
      window.scrollTo({ top: top, behavior: 'smooth' });
    });
  });

  /* ---------- 8. Contact form (client-side) ---------- */
  var form = document.getElementById('contactForm');
  var formNote = document.getElementById('formNote');

  function isValidEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value);
  }

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var name = document.getElementById('name').value.trim();
      var email = document.getElementById('email').value.trim();
      var message = document.getElementById('message').value.trim();

      if (!name || !email || !message) {
        formNote.textContent = 'Please fill in your name, email and message.';
        formNote.className = 'form-note error';
        return;
      }
      if (!isValidEmail(email)) {
        formNote.textContent = 'Please enter a valid email address.';
        formNote.className = 'form-note error';
        return;
      }

      // No backend attached - build a mailto link as a graceful fallback.
      var subject = encodeURIComponent(document.getElementById('subject').value.trim() || 'Project inquiry');
      var body = encodeURIComponent('Hi Areeba,\n\n' + message + '\n\n- ' + name + ' (' + email + ')');
      window.location.href = 'mailto:areebashah673@gmail.com?subject=' + subject + '&body=' + body;

      formNote.textContent = 'Opening your email app… thanks for reaching out! 💌';
      formNote.className = 'form-note success';
      form.reset();
    });

    // Clear error state as the user types
    ['name', 'email', 'message'].forEach(function (id) {
      document.getElementById(id).addEventListener('input', function () {
        if (formNote) {
          formNote.textContent = '';
          formNote.className = 'form-note';
        }
      });
    });
  }

  /* ---------- 9. Desktop-view site previews ---------- */
  // iframes are laid out at a fixed 1280 x 800 desktop canvas, then scaled
  // to the card width so sites show their real desktop layout.
  var desktopWraps = document.querySelectorAll('.site-desktop');

  function fitDesktopFrames() {
    desktopWraps.forEach(function (wrap) {
      var frame = wrap.querySelector('iframe');
      var width = wrap.clientWidth;
      if (!frame || !width) return;
      var scale = width / 1280;
      frame.style.transform = 'scale(' + scale + ')';
      wrap.style.height = Math.round(800 * scale) + 'px';
    });
  }

  if (desktopWraps.length) {
    fitDesktopFrames();
    window.addEventListener('resize', fitDesktopFrames, { passive: true });
    window.addEventListener('load', fitDesktopFrames);
  }

  /* ---------- 10. Footer year ---------- */
  var yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
})();