/* Kebapino Schwetzingen – kleine Helfer, keine Abhängigkeiten */
(() => {
  'use strict';

  /* ── Öffnungszeiten (täglich gleich). Hier zentral anpassen. ── */
  const OPEN = { h: 10, m: 45 };
  const CLOSE = { h: 23, m: 30 };
  const pad = n => String(n).padStart(2, '0');
  const fmt = t => `${pad(t.h)}:${pad(t.m)}`;

  function berlinNow() {
    const parts = new Intl.DateTimeFormat('en-GB', {
      timeZone: 'Europe/Berlin', weekday: 'short', hour: '2-digit', minute: '2-digit', hour12: false
    }).formatToParts(new Date());
    const get = type => parts.find(p => p.type === type).value;
    const days = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
    return { day: days[get('weekday')], minutes: (parseInt(get('hour'), 10) % 24) * 60 + parseInt(get('minute'), 10) };
  }

  function updateStatus() {
    const now = berlinNow();
    const open = OPEN.h * 60 + OPEN.m;
    const close = CLOSE.h * 60 + CLOSE.m;
    let state, text;
    if (now.minutes >= open && now.minutes < close) {
      const left = close - now.minutes;
      state = left <= 45 ? 'soon' : 'open';
      text = left <= 45 ? `Schließt bald · bis ${fmt(CLOSE)} Uhr` : `Jetzt geöffnet · bis ${fmt(CLOSE)} Uhr`;
    } else if (now.minutes < open) {
      state = 'closed';
      text = `Öffnet heute um ${fmt(OPEN)} Uhr`;
    } else {
      state = 'closed';
      text = `Geschlossen · morgen ab ${fmt(OPEN)} Uhr`;
    }
    document.querySelectorAll('[data-status]').forEach(el => {
      el.dataset.state = state;
      const t = el.querySelector('[data-status-text]');
      if (t) t.textContent = text;
    });
    document.querySelectorAll('.hours tr').forEach(tr => {
      tr.classList.toggle('is-today', Number(tr.dataset.day) === now.day);
    });
  }
  updateStatus();
  setInterval(updateStatus, 60 * 1000);

  /* ── Header: Hintergrund beim Scrollen, mobile Leiste einblenden ── */
  const header = document.getElementById('header');
  const mobileBar = document.querySelector('.mobile-bar');
  const onScroll = () => {
    const y = window.scrollY;
    header.classList.toggle('is-stuck', y > 24);
    if (mobileBar) mobileBar.classList.toggle('is-visible', y > 420);
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ── Mobile Navigation ── */
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.getElementById('nav');
  const setNav = open => {
    document.body.classList.toggle('nav-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Menü schließen' : 'Menü öffnen');
  };
  toggle.addEventListener('click', () => setNav(!document.body.classList.contains('nav-open')));
  nav.addEventListener('click', e => { if (e.target.closest('a')) setNav(false); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') setNav(false); });
  window.matchMedia('(min-width: 901px)').addEventListener('change', () => setNav(false));

  /* ── Aktiven Menüpunkt markieren ── */
  const links = [...nav.querySelectorAll(':scope > a[href^="#"]')];
  if ('IntersectionObserver' in window) {
    const spy = new IntersectionObserver(entries => {
      entries.forEach(en => {
        if (!en.isIntersecting) return;
        links.forEach(a => a.classList.toggle('is-active', a.getAttribute('href') === `#${en.target.id}`));
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    links.forEach(a => { const s = document.querySelector(a.getAttribute('href')); if (s) spy.observe(s); });
  }

  /* ── Speisekarte: Tabs ── */
  const tabs = [...document.querySelectorAll('.menu-tabs [role="tab"]')];
  const selectTab = (tab, focus) => {
    tabs.forEach(t => {
      const on = t === tab;
      t.setAttribute('aria-selected', String(on));
      t.tabIndex = on ? 0 : -1;
      document.getElementById(t.getAttribute('aria-controls')).hidden = !on;
    });
    if (focus) tab.focus();
    tab.scrollIntoView({ block: 'nearest', inline: 'center', behavior: 'smooth' });
  };
  tabs.forEach((tab, i) => {
    tab.addEventListener('click', () => selectTab(tab));
    tab.addEventListener('keydown', e => {
      const dir = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
      if (!dir) return;
      e.preventDefault();
      selectTab(tabs[(i + dir + tabs.length) % tabs.length], true);
    });
  });

  /* ── Sanftes Einblenden ── */
  const reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(entries => {
      entries.forEach(en => {
        if (!en.isIntersecting) return;
        en.target.classList.add('is-in');
        io.unobserve(en.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    reveals.forEach(el => {
      const group = el.parentElement.querySelectorAll(':scope > .reveal');
      if (group.length > 1) el.style.setProperty('--d', `${[...group].indexOf(el) * 0.08}s`);
      io.observe(el);
    });
  } else {
    reveals.forEach(el => el.classList.add('is-in'));
  }

  /* ── Karte erst nach Klick laden (Datenschutz) ── */
  const mapBtn = document.querySelector('[data-load-map]');
  if (mapBtn) mapBtn.addEventListener('click', () => {
    const map = document.getElementById('map');
    const frame = document.createElement('iframe');
    frame.title = 'Karte: Kebapino Döner & Pizza, Rudolf-Diesel-Str. 5, Schwetzingen';
    frame.loading = 'lazy';
    frame.referrerPolicy = 'no-referrer-when-downgrade';
    frame.src = 'https://www.google.com/maps?q=' + encodeURIComponent('Kebapino Döner & Pizza, Rudolf-Diesel-Str. 5, 68723 Schwetzingen') + '&z=16&output=embed';
    map.appendChild(frame);
    map.classList.add('is-loaded');
  });

  /* ── Impressum / Datenschutz (Platzhalter) ── */
  const legal = document.getElementById('legal');
  const legalText = {
    impressum: ['Impressum', 'Hier stehen künftig die Pflichtangaben des Inhabers: Name, Anschrift, Kontakt und Steuernummer.'],
    datenschutz: ['Datenschutz', 'Diese Seite lädt keine externen Schriften, Tracker oder Cookies. Die Karte wird erst nach deinem Klick von Google geladen. Die vollständige Datenschutzerklärung wird zum Livegang ergänzt.']
  };
  document.querySelectorAll('[data-legal]').forEach(btn => btn.addEventListener('click', () => {
    const [title, text] = legalText[btn.dataset.legal];
    legal.querySelector('[data-legal-title]').textContent = title;
    legal.querySelector('[data-legal-text]').textContent = text;
    if (legal.showModal) legal.showModal();
  }));
  if (legal) legal.addEventListener('click', e => { if (e.target === legal) legal.close(); });

  const year = document.querySelector('[data-year]');
  if (year) year.textContent = new Date().getFullYear();
})();
