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
    smoothTouch: true, // Enable smooth scrolling on touch devices entirely
    touchMultiplier: 2,
    syncTouch: true, // Let native touch events run to prevent ScrollTrigger bugs
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
    if (isActive) {
      lenis.stop();
      gsap.fromTo(mobileLinks, 
        { y: 40, opacity: 0 }, 
        { y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: "expo.out", delay: 0.2 }
      );
    } else {
      lenis.start();
    }
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

    // Refresh ScrollTriggers strictly for mobile after Lenis init
    setTimeout(() => {
      ScrollTrigger.refresh();
    }, 500);

    // Hero Entrance (Dual Layer)
    const tl = gsap.timeline();
    
    // Zoom both backgrounds slightly
    gsap.fromTo('.hero-bg', 
      { scale: 1.15 }, 
      { scale: 1, duration: 3, ease: "power3.out" }
    );

    // Calm layer entrance
    tl.fromTo('.calm-title', { opacity: 0, scale: 0.9 }, { opacity: 1, scale: 1, duration: 2, ease: "power2.out" }, 0)
      .fromTo('.layer-bottom .line', { width: 0 }, { width: 40, duration: 1, ease: "power4.out" }, 0.5)
      .fromTo('.layer-bottom .text', { opacity: 0 }, { opacity: 0.8, duration: 1 }, 0.8)

    // Strong layer entrance (Mask Expansion)
      .to('.layer-top', { '--mask-size': window.innerWidth < 768 ? '60vw' : '25vw', duration: 2, ease: "power3.inOut" }, 1.5)
      .fromTo('.layer-top .line', { width: 0 }, { width: 40, duration: 1, ease: "power4.out" }, 2)
      .fromTo('.layer-top .text', { opacity: 0, y: 10 }, { opacity: 0.8, y: 0, duration: 0.8, ease: "power2.out" }, 2.2)
      
    // Scroll indicator reveal
      .fromTo('.scroll-indicator', 
        { opacity: 0, y: -20 }, 
        { opacity: 1, y: 0, duration: 1, ease: "power2.out" }, 
        "-=0.5"
      );

    // ---- HERO MASK INTERACTION ----
    const topLayer = document.querySelector('.layer-top');
    const heroSection = document.querySelector('.dual-hero');
    let targetX = window.innerWidth / 2;
    let targetY = window.innerHeight / 2;
    let currentX = window.innerWidth / 2;
    let currentY = window.innerHeight / 2;
    let isInteracting = false;
    let driftTime = 0;

    if (topLayer && heroSection) {
      // Interactive tracking
      const updateTarget = (clientX, clientY) => {
        isInteracting = true;
        targetX = clientX;
        targetY = clientY;
      };

      heroSection.addEventListener('mousemove', (e) => updateTarget(e.clientX, e.clientY));
      heroSection.addEventListener('touchmove', (e) => updateTarget(e.touches[0].clientX, e.touches[0].clientY), { passive: true });
      
      // Auto-drift if user leaves or stops interacting
      heroSection.addEventListener('mouseleave', () => isInteracting = false);
      heroSection.addEventListener('touchend', () => { setTimeout(() => isInteracting = false, 1000); });

      // Smooth Animation Loop
      gsap.ticker.add(() => {
        if (!isInteracting) {
          // Autonomous slow drifting
          driftTime += 0.01;
          const radiusX = window.innerWidth * 0.3;
          const radiusY = window.innerHeight * 0.3;
          targetX = window.innerWidth / 2 + Math.cos(driftTime) * radiusX;
          targetY = window.innerHeight / 2 + Math.sin(driftTime * 0.8) * radiusY;
        }

        // Interpolate current to target for smoothness
        currentX += (targetX - currentX) * 0.1;
        currentY += (targetY - currentY) * 0.1;

        topLayer.style.setProperty('--x', `${currentX}px`);
        topLayer.style.setProperty('--y', `${currentY}px`);
      });
    }

    // Section Headers Reveal
    gsap.utils.toArray('.sec-header').forEach(header => {
      const number = header.querySelector('.sec-number');
      const title = header.querySelector('.sec-title');
      
      const tl = gsap.timeline({
        scrollTrigger: { trigger: header, start: "top 85%" }
      });
      
      if (number) tl.fromTo(number, { opacity: 0, x: -20 }, { opacity: 1, x: 0, duration: 0.8, ease: "power2.out" });
      if (title) tl.fromTo(title, { yPercent: 100 }, { yPercent: 0, duration: 1.2, ease: "expo.out" }, "-=0.4");
    });

    // Program Cards Stagger
    gsap.fromTo('.prog-card',
      { opacity: 0, y: 50 },
      { scrollTrigger: { trigger: '.programs-grid', start: "top 95%", toggleActions: "restart none none reverse", invalidateOnRefresh: true }, opacity: 1, y: 0, duration: 1, stagger: 0.15, ease: "expo.out" }
    );

    // Parallax Images (Enabled on all devices)
    gsap.utils.toArray('.img-wrap img').forEach(img => {
      gsap.to(img, {
        yPercent: 15,
        ease: "none",
        scrollTrigger: {
          trigger: img.closest('.img-wrap'),
          start: "top bottom",
          end: "bottom top",
          scrub: 1, // Add slight scrub smoothing for mobile
          invalidateOnRefresh: true
        }
      });
    });

    // Rec Boxes Stagger
    gsap.fromTo('.rec-box',
      { opacity: 0, x: window.innerWidth < 768 ? 20 : 50 },
      { scrollTrigger: { trigger: '.rec-layout', start: "top 95%", toggleActions: "restart none none reverse", invalidateOnRefresh: true }, opacity: 1, x: 0, duration: 1, stagger: window.innerWidth < 768 ? 0.1 : 0.2, ease: "power3.out" }
    );

    // Instructors Stagger
    gsap.fromTo('.inst-card',
      { opacity: 0, y: 30, scale: 0.95 },
      { scrollTrigger: { trigger: '.inst-grid', start: "top 95%", toggleActions: "restart none none reverse", invalidateOnRefresh: true }, opacity: 1, y: 0, scale: 1, duration: 1, stagger: 0.15, ease: "expo.out" }
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

  // ---- 9. 3D TILT EFFECT (Desktop Only) ----
  if (window.innerWidth >= 768) {
    const tiltCards = document.querySelectorAll('.prog-card, .inst-card, .rec-box, .img-wrap');
    tiltCards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = ((y - centerY) / centerY) * -12; // Max 12 deg
        const rotateY = ((x - centerX) / centerX) * 12;
        
        gsap.to(card, {
          rotateX: rotateX,
          rotateY: rotateY,
          transformPerspective: 1000,
          ease: "power2.out",
          duration: 0.4
        });
      });
      card.addEventListener('mouseleave', () => {
        gsap.to(card, {
          rotateX: 0,
          rotateY: 0,
          ease: "power3.out",
          duration: 0.8
        });
      });
    });
  }
});
