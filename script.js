/* ==========================================================
   GENTA 1207 PORTFOLIO — SCRIPT
   ========================================================== */
document.addEventListener('DOMContentLoaded', () => {

  /* ---------------- Loader: particles ---------------- */
  const loaderParticles = document.getElementById('loaderParticles');
  const LOADER_PARTICLE_COUNT = 26;
  for (let i = 0; i < LOADER_PARTICLE_COUNT; i++) {
    const p = document.createElement('span');
    p.style.left = Math.random() * 100 + '%';
    p.style.animationDuration = (5 + Math.random() * 6) + 's';
    p.style.animationDelay = (Math.random() * 5) + 's';
    p.style.opacity = (0.3 + Math.random() * 0.5).toFixed(2);
    loaderParticles.appendChild(p);
  }

  /* ---------------- Loader: typing + glitch ---------------- */
  const loaderText = document.getElementById('loaderText');
  const loader = document.getElementById('loader');
  const message = 'WELCOME BROTHER';
  let charIndex = 0;

  function typeChar() {
    if (charIndex <= message.length) {
      loaderText.textContent = message.slice(0, charIndex);
      charIndex++;
      setTimeout(typeChar, 75);
    } else {
      // small glitch flicker once typing completes
      loaderText.classList.add('glitch');
      setTimeout(() => {
        loaderText.classList.remove('glitch');
        finishLoading();
      }, 260);
    }
  }

  function finishLoading() {
    setTimeout(() => {
      loader.classList.add('loader-hide');
      document.body.classList.add('loaded');
      revealOnLoad();
    }, 450);
  }

  // start typing after the logo reveal animation has had time to play
  setTimeout(typeChar, 900);

  /* ---------------- Custom cursor ---------------- */
  const cursorDot = document.getElementById('cursorDot');
  const cursorRing = document.getElementById('cursorRing');
  if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    let ringX = 0, ringY = 0, mouseX = 0, mouseY = 0;
    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX; mouseY = e.clientY;
      cursorDot.style.left = mouseX + 'px';
      cursorDot.style.top = mouseY + 'px';
    });
    function animateRing() {
      ringX += (mouseX - ringX) * 0.18;
      ringY += (mouseY - ringY) * 0.18;
      cursorRing.style.left = ringX + 'px';
      cursorRing.style.top = ringY + 'px';
      requestAnimationFrame(animateRing);
    }
    animateRing();

    document.querySelectorAll('a, button, .project-card, .skill-card').forEach(el => {
      el.addEventListener('mouseenter', () => cursorRing.classList.add('ring-active'));
      el.addEventListener('mouseleave', () => cursorRing.classList.remove('ring-active'));
    });
  }

  /* ---------------- Background particle canvas ---------------- */
  const canvas = document.getElementById('bgParticles');
  const ctx = canvas.getContext('2d');
  let particles = [];

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = document.documentElement.scrollHeight;
  }

  function initParticles() {
    const count = Math.floor((canvas.width * canvas.height) / 90000);
    particles = Array.from({ length: Math.min(count, 90) }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.6 + 0.4,
      vy: -(Math.random() * 0.25 + 0.05),
      vx: (Math.random() - 0.5) * 0.15,
      alpha: Math.random() * 0.5 + 0.15
    }));
  }

  function drawParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      p.y += p.vy;
      p.x += p.vx;
      if (p.y < -10) p.y = canvas.height + 10;
      if (p.x < -10) p.x = canvas.width + 10;
      if (p.x > canvas.width + 10) p.x = -10;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 36, 54, ${p.alpha})`;
      ctx.fill();
    });
    requestAnimationFrame(drawParticles);
  }

  resizeCanvas();
  initParticles();
  drawParticles();
  window.addEventListener('resize', () => { resizeCanvas(); initParticles(); });

  /* ---------------- Navbar: scroll state + mobile toggle ---------------- */
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
    updateActiveNav();
  });

  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');
  navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('open');
  });
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => navLinks.classList.remove('open'));
  });

  function updateActiveNav() {
    const sections = document.querySelectorAll('main > section[id]');
    let current = 'home';
    sections.forEach(sec => {
      const top = sec.offsetTop - 140;
      if (window.scrollY >= top) current = sec.id;
    });
    navLinks.querySelectorAll('.nav-link').forEach(link => {
      link.classList.toggle('active-link', link.getAttribute('href') === '#' + current);
    });
  }

  /* ---------------- Scroll reveal ---------------- */
  const revealEls = document.querySelectorAll('[data-reveal]');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  revealEls.forEach(el => revealObserver.observe(el));

  function revealOnLoad() {
    // re-check hero elements immediately once the loader clears
    revealEls.forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight) {
        el.classList.add('is-visible');
      }
    });
  }

  /* ---------------- Build skill cards + animate progress bars ---------------- */
  document.querySelectorAll('.skill-card').forEach(card => {
    const name = card.dataset.skill;
    const percent = card.dataset.percent;
    card.innerHTML = `
      <div class="skill-card-head">
        <span>${name}</span>
        <span class="pct">${percent}%</span>
      </div>
      <div class="skill-track">
        <div class="skill-fill" data-target="${percent}"></div>
      </div>
    `;
  });

  const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const fill = entry.target.querySelector('.skill-fill');
        requestAnimationFrame(() => {
          fill.style.width = fill.dataset.target + '%';
        });
        skillObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });
  document.querySelectorAll('.skill-card').forEach(card => skillObserver.observe(card));

  /* ---------------- Project card 3D tilt ---------------- */
  document.querySelectorAll('[data-tilt]').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const rotateX = ((y / rect.height) - 0.5) * -10;
      const rotateY = ((x / rect.width) - 0.5) * 10;
      card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(800px) rotateX(0) rotateY(0) translateY(0)';
    });
  });

  /* ---------------- Footer year ---------------- */
  document.getElementById('year').textContent = new Date().getFullYear();

});
