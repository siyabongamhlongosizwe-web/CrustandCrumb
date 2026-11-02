/* Crust & Crumb Artisan Bakery - WEDO5020 Part 3 - Siyabonga Mhlongo
   Shared interactivity: animations, product filter, open-now badge, form validation */
(function () {
  'use strict';
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* 1. Scroll progress bar, sticky-header shadow, back-to-top button */
  var bar = document.createElement('div');
  bar.className = 'scroll-progress';
  bar.setAttribute('aria-hidden', 'true');
  var top = document.createElement('button');
  top.className = 'back-to-top';
  top.type = 'button';
  top.setAttribute('aria-label', 'Back to top');
  top.innerHTML = '&uarr;';
  document.body.append(bar, top);
  var header = $('.site-header');
  function onScroll() {
    var h = document.documentElement;
    var max = h.scrollHeight - h.clientHeight;
    bar.style.transform = 'scaleX(' + (max > 0 ? h.scrollTop / max : 0) + ')';
    header.classList.toggle('scrolled', h.scrollTop > 10);
    top.classList.toggle('show', h.scrollTop > 500);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  top.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' }); });
  onScroll();

  /* 2. Mobile menu: close on link click or Escape */
  var toggle = $('#nav-toggle');
  $$('.nav-links a').forEach(function (a) { a.addEventListener('click', function () { toggle.checked = false; }); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') toggle.checked = false; });

  /* 3. Scroll-reveal with staggered delays */
  var targets = $$('.section-head, .value-card, .split > *, .product-card, .category-heading, .info-card, .map-frame, .contact-grid form, .section-dark .container, .product-note');
  if ('IntersectionObserver' in window && !reduce) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
      });
    }, { threshold: 0.12 });
    targets.forEach(function (el, i) {
      el.classList.add('reveal');
      el.style.transitionDelay = (i % 3) * 90 + 'ms';
      io.observe(el);
    });
  }

  /* 4. Animated counters (hero stats) */
  $$('[data-count]').forEach(function (el) {
    var end = +el.dataset.count, suffix = el.dataset.suffix || '';
    if (reduce) return;
    var started = false;
    new IntersectionObserver(function (en, obs) {
      if (!en[0].isIntersecting || started) return;
      started = true; obs.disconnect();
      var t0 = performance.now(), dur = 1600;
      (function tick(t) {
        var p = Math.min((t - t0) / dur, 1);
        el.textContent = Math.round(end * (1 - Math.pow(1 - p, 3))) + suffix;
        if (p < 1) requestAnimationFrame(tick);
      })(t0);
    }).observe(el);
  });

  /* 5. Live "Open now / Closed" badge (Tue-Sun, 7am-3pm, South African time) */
  var status = $('#open-status');
  if (status) {
    var parts = new Intl.DateTimeFormat('en-ZA', { timeZone: 'Africa/Johannesburg', weekday: 'long', hour: 'numeric', hour12: false }).formatToParts(new Date());
    var day = parts.find(function (p) { return p.type === 'weekday'; }).value;
    var hour = parseInt(parts.find(function (p) { return p.type === 'hour'; }).value, 10) % 24;
    var open = day !== 'Monday' && hour >= 7 && hour < 15;
    status.classList.add(open ? 'is-open' : 'is-closed');
    status.innerHTML = '<span class="dot"></span>' + (open ? 'Open now - baking until 3 pm' : (day === 'Monday' ? 'Closed today - back Tuesday at 7 am' : 'Closed now - open 7 am to 3 pm'));
  }

  /* 6. Hero 3D tilt that follows the mouse */
  var fig = $('.hero-figure svg');
  if (fig && !reduce) {
    var hero = $('.hero');
    hero.addEventListener('mousemove', function (e) {
      var r = hero.getBoundingClientRect();
      var x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
      fig.style.transform = 'perspective(800px) rotateY(' + x * 14 + 'deg) rotateX(' + -y * 14 + 'deg)';
    });
    hero.addEventListener('mouseleave', function () { fig.style.transform = ''; });
  }

  /* 7. Button ripple */
  $$('.btn').forEach(function (b) {
    b.addEventListener('click', function (e) {
      if (reduce) return;
      var r = b.getBoundingClientRect(), s = document.createElement('span');
      s.className = 'ripple';
      s.style.left = e.clientX - r.left + 'px';
      s.style.top = e.clientY - r.top + 'px';
      b.appendChild(s);
      setTimeout(function () { s.remove(); }, 600);
    });
  });

  /* 8. Product category filter (about page) */
  var cards = $$('.product-card');
  if (cards.length) {
    var cats = ['All'].concat($$('.category-heading').map(function (h) { return h.textContent.trim(); }));
    var wrap = document.createElement('div');
    wrap.className = 'filter-bar';
    wrap.setAttribute('role', 'group');
    wrap.setAttribute('aria-label', 'Filter products by category');
    cats.forEach(function (c, i) {
      var b = document.createElement('button');
      b.type = 'button'; b.textContent = c;
      b.setAttribute('aria-pressed', i === 0 ? 'true' : 'false');
      b.addEventListener('click', function () {
        $$('button', wrap).forEach(function (x) { x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); });
        $$('.product-grid').forEach(function (g) {
          var head = g.previousElementSibling, show = c === 'All' || head.textContent.trim() === c;
          g.hidden = head.hidden = !show;
          if (show) $$('.product-card', g).forEach(function (card, n) {
            card.classList.remove('pop'); void card.offsetWidth;
            card.style.animationDelay = n * 70 + 'ms'; card.classList.add('pop');
          });
        });
      });
      wrap.appendChild(b);
    });
    $('.category-heading').before(wrap);
  }

  /* 9. Enquiry form: client-side validation */
  var form = $('#enquiry-form');
  if (!form) return;
  var today = new Date(); today.setMinutes(today.getMinutes() - today.getTimezoneOffset());
  var todayISO = today.toISOString().slice(0, 10);
  form.elements['date-needed'].min = todayISO;
  var msg = form.elements.message;
  msg.maxLength = 1000;
  var counter = document.createElement('p');
  counter.className = 'form-note counter';
  msg.parentNode.appendChild(counter);
  function count() { counter.textContent = msg.value.length + ' / 1000 characters (minimum 10)'; }
  msg.addEventListener('input', count); count();

  var rules = {
    name: function (v) { return /^[\p{L}][\p{L}\s'.-]{1,59}$/u.test(v.trim()) || 'Please enter your full name (letters only, at least 2 characters).'; },
    email: function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) || 'Please enter a valid email address, e.g. name@example.com.'; },
    phone: function (v) { return !v.trim() || /^(\+27|0)[1-9]\d{8}$/.test(v.replace(/[\s()-]/g, '')) || 'Enter a valid South African number, e.g. 021 555 1234 or 082 123 4567.'; },
    'enquiry-type': function (v) { return !!v || 'Please choose an enquiry type.'; },
    'date-needed': function (v, f) {
      var needs = ['custom-cake', 'catering'].indexOf(f.elements['enquiry-type'].value) > -1;
      if (!v) return !needs || 'Please tell us the date you need your order.';
      return v >= todayISO || 'The date cannot be in the past.';
    },
    message: function (v) { var n = v.trim().length; return (n >= 10 && n <= 1000) || 'Please write at least 10 characters so we can help you properly.'; }
  };

  function validate(el) {
    var field = el.closest('.field'), err = $('.error', field);
    if (!err) {
      err = document.createElement('p');
      err.className = 'error'; err.id = el.id + '-error'; err.setAttribute('role', 'alert');
      field.appendChild(err);
    }
    var res = rules[el.name](el.value, form), ok = res === true;
    field.classList.toggle('invalid', !ok);
    field.classList.toggle('valid', ok && !!el.value.trim());
    el.setAttribute('aria-invalid', ok ? 'false' : 'true');
    if (ok) el.removeAttribute('aria-describedby'); else el.setAttribute('aria-describedby', err.id);
    err.textContent = ok ? '' : res;
    return ok;
  }

  var fields = Object.keys(rules).map(function (n) { return form.elements[n]; });
  fields.forEach(function (el) {
    el.addEventListener('blur', function () { if (el.value || el.closest('.field').classList.contains('invalid')) validate(el); });
    el.addEventListener('input', function () { if (el.closest('.field').classList.contains('invalid')) validate(el); });
  });
  form.elements['enquiry-type'].addEventListener('change', function () {
    var d = form.elements['date-needed'], needs = this.value !== 'general';
    d.required = needs;
    if (d.value || needs) validate(d);
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var bad = fields.filter(function (el) { return !validate(el); });
    if (bad.length) {
      bad[0].focus();
      form.classList.remove('shake'); void form.offsetWidth; form.classList.add('shake');
      return;
    }
    var btn = $('button[type="submit"]', form);
    btn.disabled = true; btn.textContent = 'Sending...';
    setTimeout(function () {
      var box = document.createElement('div');
      box.className = 'success'; box.setAttribute('role', 'status'); box.tabIndex = -1;
      box.innerHTML = '<svg viewBox="0 0 52 52" aria-hidden="true"><circle cx="26" cy="26" r="24"/><path d="M14 27l8 8 16-17"/></svg><h3></h3><p></p><button type="button" class="btn btn-outline-dark again">Send another enquiry</button>';
      $('h3', box).textContent = 'Thank you, ' + form.elements.name.value.trim().split(/\s+/)[0] + '!';
      $('p', box).textContent = 'Your enquiry has been received. We will reply to ' + form.elements.email.value.trim() + ' within two business days.';
      form.hidden = true; form.after(box); box.focus();
      $('.again', box).addEventListener('click', function () {
        box.remove(); form.reset(); count();
        $$('.field', form).forEach(function (f) { f.classList.remove('valid', 'invalid'); });
        btn.disabled = false; btn.textContent = 'Send Enquiry'; form.hidden = false;
        form.elements.name.focus();
      });
    }, 900);
  });
})();
