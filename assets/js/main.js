(() => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ============ PRELOADER ============ */
  const plLog = document.getElementById('plLog');
  const plBar = document.getElementById('plBar');
  const bootLines = [
    'booting <b>genta_1207</b>…',
    'linking modules…',
    'ready.'
  ];
  let bootStep = 0;
  const bootTimer = setInterval(() => {
    bootStep++;
    if (bootStep < bootLines.length) plLog.innerHTML = bootLines[bootStep];
    else clearInterval(bootTimer);
  }, 380);
  requestAnimationFrame(() => plBar.classList.add('go'));

  window.addEventListener('load', () => {
    const pre = document.getElementById('preloader');
    setTimeout(() => {
      pre.classList.add('hide');
      startHero();
    }, 1100);
  });
  document.getElementById('year').textContent = new Date().getFullYear();

  /* ============ HEADER SHOW / SCROLL ============ */
  const header = document.getElementById('siteHeader');
  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 30);
  });

  /* ============ MOBILE NAV ============ */
  const burger = document.getElementById('burgerBtn');
  const mnav = document.getElementById('mnav');
  burger.addEventListener('click', () => mnav.classList.toggle('open'));
  mnav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => mnav.classList.remove('open')));

  /* ============ CURSOR GLOW ============ */
  const glow = document.getElementById('cursor-glow');
  window.addEventListener('mousemove', e => {
    glow.style.left = e.clientX + 'px';
    glow.style.top = e.clientY + 'px';
  });

  /* ============ CLICK RIPPLE ============ */
  function spawnRipple(x, y) {
    const r = document.createElement('span');
    r.className = 'ripple';
    r.style.left = x + 'px';
    r.style.top = y + 'px';
    document.body.appendChild(r);
    setTimeout(() => r.remove(), 650);
  }
  document.addEventListener('click', e => spawnRipple(e.clientX, e.clientY));
  document.addEventListener('touchstart', e => {
    const t = e.touches[0];
    if (t) spawnRipple(t.clientX, t.clientY);
  }, { passive: true });

  /* ============ LOGO PRESS EFFECT ============ */
  document.querySelectorAll('.logo-badge').forEach(badge => {
    const press = () => badge.classList.add('pressed');
    const release = () => badge.classList.remove('pressed');
    badge.addEventListener('mousedown', press);
    badge.addEventListener('touchstart', press, { passive: true });
    ['mouseup', 'mouseleave', 'touchend', 'touchcancel'].forEach(ev => badge.addEventListener(ev, release));
  });

  /* ============ MAGNETIC BUTTONS ============ */
  if (!reduceMotion && window.matchMedia('(hover:hover) and (pointer:fine)').matches) {
    document.querySelectorAll('.magnetic').forEach(btn => {
      btn.addEventListener('mousemove', e => {
        const r = btn.getBoundingClientRect();
        const x = e.clientX - (r.left + r.width / 2);
        const y = e.clientY - (r.top + r.height / 2);
        btn.style.transform = `translate(${x * 0.18}px, ${y * 0.28}px)`;
      });
      btn.addEventListener('mouseleave', () => { btn.style.transform = ''; });
    });
  }

  /* ============ CARD TILT ============ */
  if (!reduceMotion && window.matchMedia('(hover:hover) and (pointer:fine)').matches) {
    document.querySelectorAll('.skill-card, .project-card').forEach(card => {
      card.addEventListener('mousemove', e => {
        const r = card.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        card.style.transform = `perspective(600px) rotateX(${py * -5}deg) rotateY(${px * 5}deg) translateY(-4px)`;
      });
      card.addEventListener('mouseleave', () => { card.style.transform = ''; });
    });
  }

  /* ============ HERO CINEMATIC SEQUENCE ============ */
  const typedTarget = 'Rekayasa perangkat lunak yang presisi, bukan tebakan.';
  const typedEl = document.getElementById('typedText');

  function typeLine(text, el, speed, done) {
    let i = 0;
    (function step() {
      if (i <= text.length) {
        el.textContent = text.slice(0, i);
        i++;
        setTimeout(step, speed);
      } else if (done) { done(); }
    })();
  }

  function startHero() {
    document.getElementById('particles').classList.add('show');
    const rail = document.getElementById('addrRail');
    rail.classList.add('show');
    document.getElementById('heroEyebrow').classList.add('play');
    const stage = document.getElementById('logoStage');
    stage.classList.add('play');

    setTimeout(() => { stage.classList.add('scan'); }, 900);

    setTimeout(() => {
      typeLine(typedTarget, typedEl, 26, () => {
        document.getElementById('heroRoles').classList.add('play');
        document.getElementById('heroActions').classList.add('play');
        document.getElementById('scrollCue').classList.add('play');
      });
    }, 1500);
  }

  /* ============ SCROLL REVEAL ============ */
  const revealEls = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      entry.target.classList.toggle('in-view', entry.isIntersecting);
    });
  }, { threshold: 0.16 });
  revealEls.forEach(el => revealObserver.observe(el));

  /* ============ SKILL BARS ============ */
  const skillTimers = new Map();
  const skillCards = document.querySelectorAll('.skill-card');
  const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const card = entry.target;
      const pct = parseInt(card.dataset.pct, 10);
      const fill = card.querySelector('.skill-bar-fill');
      const numEl = card.querySelector('.pct-num');

      if (skillTimers.has(card)) clearInterval(skillTimers.get(card));

      if (entry.isIntersecting) {
        fill.style.width = '0%';
        numEl.textContent = '0';
        requestAnimationFrame(() => {
          requestAnimationFrame(() => { fill.style.width = pct + '%'; });
        });
        let cur = 0;
        const stepTime = 16;
        const steps = 1100 / stepTime;
        const inc = pct / steps;
        const timer = setInterval(() => {
          cur += inc;
          if (cur >= pct) { cur = pct; clearInterval(timer); }
          numEl.textContent = Math.round(cur);
        }, stepTime);
        skillTimers.set(card, timer);
      } else {
        fill.style.width = '0%';
        numEl.textContent = '0';
      }
    });
  }, { threshold: 0.3 });
  skillCards.forEach(c => skillObserver.observe(c));

  /* ============ STAGGERED REVEAL INDEX (CSS var) ============ */
  document.querySelectorAll('.skills-grid, .projects-grid, .expertise-list').forEach(group => {
    Array.from(group.children).forEach((child, i) => child.style.setProperty('--i', i));
  });

  /* ============ FAQ ACCORDION ============ */
  document.querySelectorAll('.faq-item').forEach(item => {
    const q = item.querySelector('.faq-q');
    q.addEventListener('click', () => {
      const wasOpen = item.classList.contains('open');
      item.parentElement.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
      if (!wasOpen) item.classList.add('open');
    });
  });

  /* ============ HEX ADDRESS RAIL TICKER ============ */
  const rail = document.getElementById('addrRail');
  function hex4() { return (Math.floor(Math.random() * 0xffff)).toString(16).padStart(4, '0'); }
  function buildRail() {
    rail.innerHTML = '';
    const count = Math.floor((window.innerHeight - 120) / 26);
    for (let i = 0; i < count; i++) {
      const s = document.createElement('span');
      s.textContent = '0x' + hex4();
      rail.appendChild(s);
    }
  }
  buildRail();
  window.addEventListener('resize', buildRail);
  if (!reduceMotion) {
    setInterval(() => {
      const spans = rail.querySelectorAll('span');
      if (!spans.length) return;
      const idx = Math.floor(Math.random() * spans.length);
      spans[idx].textContent = '0x' + hex4();
    }, 900);
  }

  /* ============ AMBIENT PARTICLE BACKGROUND ============ */
  const canvas = document.getElementById('particles');
  const ctx = canvas.getContext('2d');
  let particles = [];

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = document.documentElement.scrollHeight;
  }
  function initParticles() {
    const count = Math.min(70, Math.floor(window.innerWidth / 20));
    particles = Array.from({ length: count }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * window.innerHeight,
      vx: (Math.random() - 0.5) * 0.2,
      vy: (Math.random() - 0.5) * 0.2,
      r: Math.random() * 1.4 + 0.5
    }));
  }
  function drawParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const viewTop = window.scrollY;
    const viewBottom = viewTop + window.innerHeight;

    particles.forEach(p => {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0) p.x = canvas.width;
      if (p.x > canvas.width) p.x = 0;
      if (p.y < viewTop) p.y = viewBottom;
      if (p.y > viewBottom) p.y = viewTop;
    });

    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const a = particles[i], b = particles[j];
        if (a.y < viewTop - 50 || a.y > viewBottom + 50) continue;
        const dx = a.x - b.x, dy = a.y - b.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          ctx.strokeStyle = `rgba(124,255,196,${0.08 * (1 - dist / 120)})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
    }
    particles.forEach(p => {
      if (p.y < viewTop - 20 || p.y > viewBottom + 20) return;
      ctx.beginPath();
      ctx.fillStyle = 'rgba(232,237,233,0.5)';
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
    });

    if (!reduceMotion) requestAnimationFrame(drawParticles);
  }
  resizeCanvas();
  initParticles();
  drawParticles();
  window.addEventListener('resize', () => { resizeCanvas(); initParticles(); });
  window.addEventListener('load', resizeCanvas);
  setTimeout(resizeCanvas, 1200);
})();
