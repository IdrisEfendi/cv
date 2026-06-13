/* ============================
   App.js — Portfolio CV
   ============================ */

(function () {
  'use strict';

  // ---- Loading Screen ----
  window.addEventListener('load', function () {
    const loader = document.getElementById('loader');
    if (loader) {
      setTimeout(function () { loader.classList.add('hidden'); }, 400);
    }
  });

  // ---- AOS Init ----
  AOS.init({
    duration: 800,
    easing: 'ease-out-cubic',
    once: true,
    offset: 80,
  });

  // ---- Dark Mode Toggle ----
  const html = document.documentElement;
  const themeToggle = document.getElementById('theme-toggle');
  const iconDark = document.getElementById('theme-icon-dark');
  const iconLight = document.getElementById('theme-icon-light');

  function setTheme(dark) {
    html.classList.add('transitioning');
    if (dark) {
      html.classList.remove('light');
      iconDark.classList.remove('hidden');
      iconLight.classList.add('hidden');
    } else {
      html.classList.add('light');
      iconDark.classList.add('hidden');
      iconLight.classList.remove('hidden');
    }
    localStorage.setItem('theme', dark ? 'dark' : 'light');
    setTimeout(function () { html.classList.remove('transitioning'); }, 350);
  }

  // Init theme
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'light') {
    setTheme(false);
  }

  themeToggle.addEventListener('click', function () {
    setTheme(!html.classList.contains('light'));
  });

  // ---- Sticky Navbar ----
  const navbar = document.getElementById('navbar');
  function handleScroll() {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }
  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  // ---- Active Nav Link ----
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  function updateActiveNav() {
    let current = '';
    sections.forEach(function (section) {
      const sectionTop = section.offsetTop - 120;
      if (window.scrollY >= sectionTop) {
        current = section.getAttribute('id');
      }
    });
    navLinks.forEach(function (link) {
      link.classList.remove('active');
      if (link.getAttribute('href') === '#' + current) {
        link.classList.add('active');
      }
    });
  }
  window.addEventListener('scroll', updateActiveNav, { passive: true });

  // ---- Mobile Menu ----
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  const menuIconOpen = document.getElementById('menu-icon-open');
  const menuIconClose = document.getElementById('menu-icon-close');

  mobileMenuBtn.addEventListener('click', function () {
    mobileMenu.classList.toggle('open');
    menuIconOpen.classList.toggle('hidden');
    menuIconClose.classList.toggle('hidden');
  });

  // Close mobile menu on link click
  document.querySelectorAll('.mobile-nav-link').forEach(function (link) {
    link.addEventListener('click', function () {
      mobileMenu.classList.remove('open');
      menuIconOpen.classList.remove('hidden');
      menuIconClose.classList.add('hidden');
    });
  });

  // ---- Skill Bar Animation ----
  function animateSkillBars() {
    document.querySelectorAll('.skill-bar').forEach(function (bar) {
      const width = bar.getAttribute('data-width');
      bar.style.setProperty('--skill-width', width + '%');
      if (!bar.classList.contains('animated')) {
        const rect = bar.getBoundingClientRect();
        if (rect.top < window.innerHeight - 50) {
          bar.classList.add('animated');
        }
      }
    });
  }
  window.addEventListener('scroll', animateSkillBars, { passive: true });
  animateSkillBars();

  // ---- Portfolio Filter ----
  const filterBtns = document.querySelectorAll('.portfolio-filter');
  const portfolioItems = document.querySelectorAll('.portfolio-item');

  filterBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      filterBtns.forEach(function (b) { b.classList.remove('active'); });
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      portfolioItems.forEach(function (item) {
        const category = item.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          item.classList.remove('hidden');
          item.style.opacity = '1';
          item.style.transform = 'scale(1)';
          item.style.position = 'relative';
          item.style.pointerEvents = 'auto';
        } else {
          item.style.opacity = '0';
          item.style.transform = 'scale(0.8)';
          setTimeout(function () {
            item.classList.add('hidden');
          }, 300);
        }
      });
    });
  });

  // ---- Counter Animation ----
  const counters = document.querySelectorAll('.counter');
  let countersAnimated = false;

  function animateCounters() {
    if (countersAnimated) return;
    const statsSection = document.getElementById('statistics');
    if (!statsSection) return;

    const rect = statsSection.getBoundingClientRect();
    if (rect.top < window.innerHeight - 100) {
      countersAnimated = true;
      counters.forEach(function (counter) {
        const target = parseInt(counter.getAttribute('data-target'));
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;

        function updateCounter() {
          current += step;
          if (current < target) {
            counter.textContent = Math.floor(current);
            requestAnimationFrame(updateCounter);
          } else {
            counter.textContent = target;
          }
        }
        updateCounter();
      });
    }
  }
  window.addEventListener('scroll', animateCounters, { passive: true });

  // ---- Testimonial Slider ----
  const slides = document.querySelectorAll('.testimonial-slide');
  const dotsContainer = document.getElementById('testimonial-dots');
  const prevBtn = document.getElementById('testimonial-prev');
  const nextBtn = document.getElementById('testimonial-next');
  let currentSlide = 0;
  let slideInterval;

  if (slides.length > 0) {
    // Create dots
    slides.forEach(function (_, i) {
      const dot = document.createElement('button');
      dot.classList.add('testimonial-dot');
      if (i === 0) dot.classList.add('active');
      dot.addEventListener('click', function () { goToSlide(i); });
      dotsContainer.appendChild(dot);
    });

    function goToSlide(index) {
      slides[currentSlide].classList.remove('active');
      dotsContainer.children[currentSlide].classList.remove('active');
      currentSlide = index;
      slides[currentSlide].classList.add('active');
      dotsContainer.children[currentSlide].classList.add('active');
    }

    function nextSlide() {
      goToSlide((currentSlide + 1) % slides.length);
    }

    function prevSlide() {
      goToSlide((currentSlide - 1 + slides.length) % slides.length);
    }

    prevBtn.addEventListener('click', function () {
      prevSlide();
      resetSlideInterval();
    });

    nextBtn.addEventListener('click', function () {
      nextSlide();
      resetSlideInterval();
    });

    function resetSlideInterval() {
      clearInterval(slideInterval);
      slideInterval = setInterval(nextSlide, 5000);
    }

    // Init
    slides[0].classList.add('active');
    slideInterval = setInterval(nextSlide, 5000);
  }

  // ---- Contact Form ----
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const name = document.getElementById('name').value.trim();
      const email = document.getElementById('email').value.trim();
      const message = document.getElementById('message').value.trim();

      if (!name || !email || !message) return;

      // Construct mailto
      const subject = document.getElementById('subject').value || 'Portfolio Contact';
      const body = 'Hi John Doe,%0D%0A%0D%0AName: ' + name + '%0AEmail: ' + email + '%0A%0A' + message;
      window.location.href = 'mailto:john@example.com?subject=' + encodeURIComponent(subject) + '&body=' + body;

      contactForm.reset();
    });
  }

  // ---- Back to Top ----
  const backToTop = document.getElementById('back-to-top');
  if (backToTop) {
    backToTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ---- Smooth Scroll for anchor links ----
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

})();
