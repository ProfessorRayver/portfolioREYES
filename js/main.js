/* ============================================================
   RAYVER S. REYES — Developer Portfolio
   JavaScript: Navigation, scroll effects, animations, modal, particles
   Theme: Glacier Blue, Navy & Lemon (Light Mode)
   ============================================================ */

/* ── CERTIFICATE LIGHTBOX ──────────────────────────────────
   Opens maximized by default and is navigable as a gallery.    */
const CertLightbox = (() => {
  let items = [];        // every certificate card, in document order
  let index = 0;         // which one is on screen
  let maximized = true;  // full-viewport by default

  const $ = id => document.getElementById(id);

  function collect() {
    items = Array.from(document.querySelectorAll('.cert-trigger')).map(el => ({
      src:   el.getAttribute('data-cert-src'),
      title: el.getAttribute('data-cert-title') || '',
      desc:  el.getAttribute('data-cert-desc') || ''
    }));
  }

  // Zoom to 2.5x the fitted size (and never below native resolution) so
  // low-resolution scans still visibly magnify; the stage then scrolls to pan.
  const ZOOM_FACTOR = 2.5;

  function setZoom(on) {
    const img = $('certModalImg'), btn = $('certZoomBtn'), body = $('certModalBody');
    if (!img) return;

    if (on) {
      const fittedW = img.getBoundingClientRect().width;
      const target = Math.max(fittedW * ZOOM_FACTOR, img.naturalWidth || 0);
      img.classList.add('zoomed');
      img.style.width = target + 'px';
      img.style.height = 'auto';
    } else {
      img.classList.remove('zoomed');
      img.style.width = '';
      img.style.height = '';
    }

    if (btn) btn.innerHTML = on
      ? '<i class="bi bi-zoom-out"></i> <span>Zoom Out</span>'
      : '<i class="bi bi-zoom-in"></i> <span>Zoom In</span>';

    if (body) {
      // centre the zoomed image rather than parking it at the top-left
      body.scrollLeft = on ? (body.scrollWidth - body.clientWidth) / 2 : 0;
      body.scrollTop  = on ? (body.scrollHeight - body.clientHeight) / 2 : 0;
    }
  }

  function setMaximized(on) {
    maximized = on;
    const dialog = document.querySelector('.modal-cert-dialog');
    const btn = $('certFullscreenBtn');
    if (dialog) dialog.classList.toggle('cert-windowed', !on);
    if (btn) btn.innerHTML = on
      ? '<i class="bi bi-fullscreen-exit"></i> <span>Exit Full Screen</span>'
      : '<i class="bi bi-arrows-fullscreen"></i> <span>Full Screen</span>';
  }

  // Paint certificate `i` into the already-open lightbox.
  function render(i) {
    if (!items.length) return;
    index = (i + items.length) % items.length;      // wrap around
    const it = items[index];

    const img = $('certModalImg');
    if (img) { setZoom(false); img.src = it.src; img.alt = it.title; }

    const t = $('certModalTitle'); if (t) t.textContent = it.title;
    const d = $('certModalDesc');  if (d) d.textContent = it.desc;
    const a = $('certModalOpenNew'); if (a) a.href = it.src;
    const c = $('certCounter'); if (c) c.textContent = `${index + 1} / ${items.length}`;

    const multi = items.length > 1;
    ['certPrevBtn', 'certNextBtn'].forEach(id => {
      const b = $(id); if (b) b.style.display = multi ? '' : 'none';
    });
  }

  function open(i) {
    const modalEl = $('certModal');
    if (!modalEl || typeof bootstrap === 'undefined') return;
    if (!items.length) collect();
    setMaximized(true);   // always start maximized, never inherit stale state
    render(i);
    bootstrap.Modal.getOrCreateInstance(modalEl).show();
  }

  function isOpen() {
    const m = $('certModal');
    return !!m && m.classList.contains('show');
  }

  function init() {
    collect();
    if (!items.length) return;

    // Open on click / Enter / Space from any card
    document.querySelectorAll('.cert-trigger').forEach((el, i) => {
      el.addEventListener('click', () => open(i));
      el.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(i); }
      });
    });

    $('certPrevBtn') && $('certPrevBtn').addEventListener('click', e => { e.stopPropagation(); render(index - 1); });
    $('certNextBtn') && $('certNextBtn').addEventListener('click', e => { e.stopPropagation(); render(index + 1); });
    $('certZoomBtn') && $('certZoomBtn').addEventListener('click', () => setZoom(!$('certModalImg').classList.contains('zoomed')));
    $('certFullscreenBtn') && $('certFullscreenBtn').addEventListener('click', () => setMaximized(!maximized));

    const img = $('certModalImg');
    img && img.addEventListener('click', () => setZoom(!img.classList.contains('zoomed')));

    document.addEventListener('keydown', e => {
      if (!isOpen()) return;
      if (e.key === 'ArrowLeft')  { e.preventDefault(); render(index - 1); }
      if (e.key === 'ArrowRight') { e.preventDefault(); render(index + 1); }
      if (e.key === 'f' || e.key === 'F') { e.preventDefault(); setMaximized(!maximized); }
      if (e.key === 'z' || e.key === 'Z') { e.preventDefault(); setZoom(!$('certModalImg').classList.contains('zoomed')); }
    });

    const modalEl = $('certModal');
    modalEl && modalEl.addEventListener('hidden.bs.modal', () => setZoom(false));
  }

  return { init, open };
})();

// Back-compat: any leftover inline onclick still works.
function openCertModal(imageSrc) {
  CertLightbox.open(0);
  const img = document.getElementById('certModalImg');
  if (img && imageSrc) img.src = imageSrc;
}

document.addEventListener('DOMContentLoaded', () => {
  CertLightbox.init();

  // ── NAVBAR SCROLL EFFECT ────────────────────────────────
  const navbar = document.getElementById('mainNavbar');
  const navLinks = document.querySelectorAll('.nav-link[data-section]');

  function handleNavbarScroll() {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', handleNavbarScroll);
  handleNavbarScroll();

  // ── ACTIVE NAV LINK HIGHLIGHTING ────────────────────────
  const sections = document.querySelectorAll('section[id]');

  function updateActiveLink() {
    const scrollPos = window.scrollY + 120;

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');

      if (scrollPos >= top && scrollPos < top + height) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('data-section') === id) {
            link.classList.add('active');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', updateActiveLink);
  updateActiveLink();

  // ── CLOSE MOBILE NAV ON LINK CLICK ──────────────────────
  const navCollapse = document.getElementById('navbarContent');
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      const bsCollapse = bootstrap.Collapse.getInstance(navCollapse);
      if (bsCollapse) bsCollapse.hide();
    });
  });

  // ── SCROLL REVEAL ANIMATION ─────────────────────────────
  const revealElements = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.08,
      rootMargin: '0px 0px -40px 0px'
    }
  );

  revealElements.forEach(el => revealObserver.observe(el));

  // ── HERO PARTICLE ANIMATION (Light Mode Optimized) ───────────────
  const canvas = document.getElementById('particles-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let particles = [];
    let animFrameId;

    function resizeCanvas() {
      canvas.width = canvas.parentElement.offsetWidth;
      canvas.height = canvas.parentElement.offsetHeight;
    }

    function createParticles() {
      particles = [];
      const count = Math.min(Math.floor((canvas.width * canvas.height) / 15000), 70);
      for (let i = 0; i < count; i++) {
        const isLemon = Math.random() < 0.25; // 25% Lemon particles
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 2 + 1,
          speedX: (Math.random() - 0.5) * 0.35,
          speedY: (Math.random() - 0.5) * 0.35,
          opacity: Math.random() * 0.45 + 0.25,
          isLemon: isLemon
        });
      }
    }

    function drawParticles() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p, i) => {
        p.x += p.speedX;
        p.y += p.speedY;

        // Wrap around edges
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        if (p.isLemon) {
          ctx.fillStyle = `rgba(215, 195, 10, ${p.opacity * 0.85})`;
        } else {
          ctx.fillStyle = `rgba(110, 167, 234, ${p.opacity * 0.9})`;
        }
        ctx.fill();

        // Draw connections to nearby particles
        for (let j = i + 1; j < particles.length; j++) {
          const dx = p.x - particles[j].x;
          const dy = p.y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 115) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(110, 167, 234, ${0.18 * (1 - dist / 115)})`;
            ctx.lineWidth = 0.65;
            ctx.stroke();
          }
        }
      });

      animFrameId = requestAnimationFrame(drawParticles);
    }

    resizeCanvas();
    createParticles();
    drawParticles();

    // Debounced resize
    let resizeTimeout;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        resizeCanvas();
        createParticles();
      }, 200);
    });

    // Pause when hero is out of view for performance
    const heroSection = document.getElementById('hero');
    const heroObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            if (!animFrameId) drawParticles();
          } else {
            cancelAnimationFrame(animFrameId);
            animFrameId = null;
          }
        });
      },
      { threshold: 0 }
    );
    heroObserver.observe(heroSection);
  }


  // ── SMOOTH SCROLL FOR BUTTONS ────────────────────────────
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // ── TYPED EFFECT FOR HERO TITLE ──────────────────────────
  const typedElement = document.getElementById('typed-title');
  if (typedElement) {
    const titles = [
      'Full-Stack Web & Mobile Developer',
      'DevOps & Cloud Environment Engineer',
      'Backend API & AI/ML Integration',
      'Certified Scrum & Agile Practitioner',
      'AWS Hackathon National Finalist'
    ];
    let titleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typeSpeed = 75;

    function typeEffect() {
      const current = titles[titleIndex];

      if (isDeleting) {
        typedElement.textContent = current.substring(0, charIndex - 1);
        charIndex--;
        typeSpeed = 35;
      } else {
        typedElement.textContent = current.substring(0, charIndex + 1);
        charIndex++;
        typeSpeed = 70;
      }

      if (!isDeleting && charIndex === current.length) {
        typeSpeed = 2200; // Pause at end
        isDeleting = true;
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        titleIndex = (titleIndex + 1) % titles.length;
        typeSpeed = 350; // Brief pause before next word
      }

      setTimeout(typeEffect, typeSpeed);
    }

    setTimeout(typeEffect, 1200);
  }
});
