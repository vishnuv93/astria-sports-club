/* ============================================
   ASTRIA SPORTS CLUB — Premium Javascript
   GSAP, Lenis Smooth Scroll, Custom Cursor
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  gsap.registerPlugin(ScrollTrigger);

  // ---- 1. LENIS SMOOTH SCROLL ----
  const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    orientation: 'vertical',
    gestureOrientation: 'vertical',
    smoothWheel: true,
    wheelMultiplier: 1,
    touchMultiplier: 2,
  });

  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);

  // Connect Lenis to ScrollTrigger
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => { lenis.raf(time * 1000); });
  gsap.ticker.lagSmoothing(0, 0);

  // ---- 2. CUSTOM CURSOR & MAGNETIC HOVER EFFECT ----
  const cursorDot = document.getElementById('cursor-dot');
  const cursorFollower = document.getElementById('cursor-follower');
  const hoverTargets = document.querySelectorAll('.hover-target, a, button, input, textarea');

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let followerX = window.innerWidth / 2;
  let followerY = window.innerHeight / 2;

  // Use GSAP ticker for smooth cursor follow interpolation
  gsap.ticker.add(() => {
    followerX += (mouseX - followerX) * 0.15;
    followerY += (mouseY - followerY) * 0.15;
    gsap.set(cursorDot, { x: mouseX, y: mouseY });
    gsap.set(cursorFollower, { x: followerX, y: followerY });
  });

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  // Magnetic Hover states on all interactive elements
  hoverTargets.forEach((el) => {
    el.addEventListener('mouseenter', () => {
      document.body.classList.add('hover-target');
    });
    el.addEventListener('mouseleave', () => {
      document.body.classList.remove('hover-target');
      // Reset transform if magnetic
      gsap.to(el, { x: 0, y: 0, duration: 0.4, ease: "power2.out" });
    });

    // Magnetic pull (mainly for small links/buttons)
    if (el.tagName.toLowerCase() === 'a' || el.classList.contains('nav-item')) {
      el.addEventListener('mousemove', (e) => {
        if (window.innerWidth < 768) return; // Prevent GSAP overrides on mobile
        const rect = el.getBoundingClientRect();
        const relX = e.clientX - rect.left - rect.width / 2;
        const relY = e.clientY - rect.top - rect.height / 2;
        gsap.to(el, { x: relX * 0.3, y: relY * 0.3, duration: 0.3, ease: "power2.out" });
      });
    }
  });

  // ---- 3. SPLIT PAGE LOADER ----
  const loader = document.getElementById('loader');
  window.addEventListener('load', () => {
    setTimeout(() => {
      gsap.to(loader, {
        yPercent: -100,
        duration: 1.2,
        ease: "expo.inOut",
        onComplete: () => {
          loader.style.display = 'none';
          initPageAnimations();
        }
      });
    }, 2000);
  });

  // ---- 4. NAVIGATION LOGIC & MOBILE MENU ----
  const navbar = document.getElementById('navbar');
  const hamburger = document.querySelector('.hamburger');
  const mobileMenu = document.querySelector('.mobile-menu');
  const mobileLinks = mobileMenu.querySelectorAll('a');

  // Scrolled state
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) navbar.classList.add('scrolled');
    else navbar.classList.remove('scrolled');
  });

  // Hamburger logic
  hamburger.addEventListener('click', () => {
    const isActive = hamburger.classList.toggle('active');
    mobileMenu.classList.toggle('active');
    if (isActive) lenis.stop();
    else lenis.start();
  });

  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      mobileMenu.classList.remove('active');
      lenis.start();
    });
  });

  // Smooth scroll for anchor links via Lenis
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = this.getAttribute('href');
      if (target !== '#') {
        lenis.scrollTo(target, { offset: -80, duration: 1.2 });
      }
    });
  });

  // ---- 5. MARQUEE INFINITE SCROLL ----
  gsap.to('.marquee-content', {
    xPercent: -50,
    ease: "none",
    duration: 15,
    repeat: -1
  });

  // ---- 6. SCROLL TO TOP ----
  const scrollTopBtn = document.getElementById('scrollTop');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 800) scrollTopBtn.classList.add('visible');
    else scrollTopBtn.classList.remove('visible');
  });
  scrollTopBtn.addEventListener('click', () => {
    lenis.scrollTo(0, { duration: 1.5, ease: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
  });

  // ---- 7. GSAP SCROLLTRIGGER ANIMATIONS ----
  function initPageAnimations() {

    // Hero Entrance
    const tl = gsap.timeline();
    tl.fromTo('.hero-subtitle', { opacity: 0, x: -30 }, { opacity: 1, x: 0, duration: 1, ease: "power3.out" })
      .fromTo('.hero-title', { opacity: 0, y: 50, scale: 0.95 }, { opacity: 1, y: 0, scale: 1, duration: 1.2, ease: "power3.out" }, "-=0.8")
      .fromTo('.hero-desc', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 1, ease: "power3.out" }, "-=0.9");

    // Section Headers Reveal
    gsap.utils.toArray('.sec-header').forEach(header => {
      gsap.fromTo(header,
        { opacity: 0, y: 50 },
        { scrollTrigger: { trigger: header, start: "top 80%" }, opacity: 1, y: 0, duration: 1, ease: "expo.out" }
      );
    });

    // Program Cards Stagger
    gsap.fromTo('.prog-card',
      { opacity: 0, y: 100 },
      { scrollTrigger: { trigger: '.programs-grid', start: "top 75%" }, opacity: 1, y: 0, duration: 1, stagger: 0.15, ease: "expo.out" }
    );

    // Parallax Images
    gsap.utils.toArray('.img-wrap img').forEach(img => {
      gsap.to(img, {
        yPercent: 15,
        ease: "none",
        scrollTrigger: {
          trigger: img.parentElement,
          start: "top bottom",
          end: "bottom top",
          scrub: true
        }
      });
    });

    // Rec Boxes Stagger
    gsap.fromTo('.rec-box',
      { opacity: 0, x: 50 },
      { scrollTrigger: { trigger: '.rec-layout', start: "top 75%" }, opacity: 1, x: 0, duration: 1, stagger: 0.2, ease: "power3.out" }
    );

    // Instructors Stagger
    gsap.fromTo('.inst-card',
      { opacity: 0, y: 50, scale: 0.95 },
      { scrollTrigger: { trigger: '.inst-grid', start: "top 80%" }, opacity: 1, y: 0, scale: 1, duration: 1, stagger: 0.2, ease: "expo.out" }
    );

    // Contact Details Stagger
    gsap.fromTo('.c-item',
      { opacity: 0, x: -30 },
      { scrollTrigger: { trigger: '.contact-details', start: "top 85%" }, opacity: 1, x: 0, duration: 0.8, stagger: 0.15, ease: "power2.out" }
    );

    // Form Controls Stagger
    gsap.fromTo('.form-control',
      { opacity: 0, y: 30 },
      { scrollTrigger: { trigger: '#contactForm', start: "top 85%" }, opacity: 1, y: 0, duration: 0.8, stagger: 0.15, ease: "power2.out" }
    );
  }

  // ---- 8. FORM SUBMISSION ----
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = contactForm.querySelector('button');
      const originalText = btn.textContent;
      btn.innerHTML = 'SENDING...';
      btn.style.color = 'var(--red)';
      setTimeout(() => {
        btn.innerHTML = '✓ DELIVERED';
        btn.style.color = 'var(--white)';
        btn.style.borderColor = '#22c55e';
        contactForm.reset();
        setTimeout(() => {
          btn.innerHTML = originalText;
          btn.style.borderColor = 'var(--gray-dark)';
        }, 3000);
      }, 1500);
    });
  }
});
