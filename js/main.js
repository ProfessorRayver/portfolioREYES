/* ============================================================
   RAYVER S. REYES — Developer Portfolio
   JavaScript: Navigation, scroll effects, animations, modal, particles
   Theme: Glacier Blue, Navy & Lemon (Light Mode)
   ============================================================ */

// Global function to trigger certificate preview modal
function openCertModal(imageSrc, title, desc) {
  const modalEl = document.getElementById('certModal');
  if (!modalEl) return;

  const modalImg = document.getElementById('certModalImg');
  const modalTitle = document.getElementById('certModalTitle');
  const modalDesc = document.getElementById('certModalDesc');
  const modalLink = document.getElementById('certModalOpenNew');

  if (modalImg) {
    modalImg.src = imageSrc;
    modalImg.classList.remove('zoomed');
  }
  if (modalTitle) modalTitle.textContent = title;
  if (modalDesc) modalDesc.textContent = desc || '';
  if (modalLink) modalLink.href = imageSrc;

  const bsModal = bootstrap.Modal.getOrCreateInstance(modalEl);
  bsModal.show();
}

// Toggle full-screen lightbox mode
function toggleCertFullscreen() {
  const dialog = document.querySelector('.modal-cert-dialog');
  const btn = document.getElementById('certFullscreenBtn');
  if (!dialog) return;

  dialog.classList.toggle('modal-fullscreen');
  if (btn) {
    const isFull = dialog.classList.contains('modal-fullscreen');
    btn.innerHTML = isFull 
      ? '<i class="bi bi-fullscreen-exit"></i> Exit Full Screen' 
      : '<i class="bi bi-arrows-fullscreen"></i> Full Screen';
  }
}

// Toggle zoom in/out on image click
function toggleCertZoom() {
  const modalImg = document.getElementById('certModalImg');
  if (modalImg) {
    modalImg.classList.toggle('zoomed');
  }
}

document.addEventListener('DOMContentLoaded', () => {
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
