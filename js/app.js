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
  var html = document.documentElement;
  var themeToggle = document.getElementById('theme-toggle');
  var iconDark = document.getElementById('theme-icon-dark');
  var iconLight = document.getElementById('theme-icon-light');

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
    setTheme(html.classList.contains('light'));
  });

  // ---- Sticky Navbar ----
  var navbar = document.getElementById('navbar');
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
  var sections = document.querySelectorAll('section[id]');
  var navLinks = document.querySelectorAll('.nav-link');

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
  var mobileMenuBtn = document.getElementById('mobile-menu-btn');
  var mobileMenu = document.getElementById('mobile-menu');
  var menuIconOpen = document.getElementById('menu-icon-open');
  var menuIconClose = document.getElementById('menu-icon-close');

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
  var filterBtns = document.querySelectorAll('.portfolio-filter');
  var portfolioItems = document.querySelectorAll('.portfolio-item');

  filterBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      filterBtns.forEach(function (b) { b.classList.remove('active'); });
      btn.classList.add('active');

      var filter = btn.getAttribute('data-filter');

      portfolioItems.forEach(function (item) {
        var category = item.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          item.classList.remove('hidden');
        } else {
          item.classList.add('hidden');
        }
      });
    });
  });

  // ---- Counter Animation ----
  var counters = document.querySelectorAll('.counter');
  var countersAnimated = false;

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
  var slides = document.querySelectorAll('.testimonial-slide');
  var dotsContainer = document.getElementById('testimonial-dots');
  var prevBtn = document.getElementById('testimonial-prev');
  var nextBtn = document.getElementById('testimonial-next');
  var currentSlide = 0;
  var slideInterval;

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
  var contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var name = document.getElementById('name').value.trim();
      var email = document.getElementById('email').value.trim();
      var message = document.getElementById('message').value.trim();

      if (!name || !email || !message) {
        showToast('Mohon isi semua field yang wajib diisi.');
        return;
      }

      var subject = document.getElementById('subject').value || 'Portfolio Contact';
      var body = 'Hi John Doe,%0D%0A%0D%0AName: ' + name + '%0AEmail: ' + email + '%0A%0A' + message;
      window.location.href = 'mailto:john@example.com?subject=' + encodeURIComponent(subject) + '&body=' + body;

      contactForm.reset();
      showToast('Pesan berhasil dikirim! Terima kasih, ' + name + '.');
    });
  }

  // ---- Back to Top ----
  const backToTop = document.getElementById('back-to-top');
  if (backToTop) {
    backToTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  function handleBackToTop() {
    if (!backToTop) return;
    if (window.scrollY > 400) {
      backToTop.classList.remove('opacity-0', 'invisible', 'translate-y-4');
      backToTop.classList.add('opacity-100', 'visible', 'translate-y-0');
    } else {
      backToTop.classList.remove('opacity-100', 'visible', 'translate-y-0');
      backToTop.classList.add('opacity-0', 'invisible', 'translate-y-4');
    }
  }
  window.addEventListener('scroll', handleBackToTop, { passive: true });
  handleBackToTop();

  // ---- Dynamic Copyright Year ----
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // ---- Mobile Menu: Close on Outside Click ----
  document.addEventListener('click', function (e) {
    if (!mobileMenu.classList.contains('open')) return;
    if (!mobileMenu.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
      mobileMenu.classList.remove('open');
      menuIconOpen.classList.remove('hidden');
      menuIconClose.classList.add('hidden');
    }
  });

  // ---- Contact Form Toast ----
  var toast = document.getElementById('toast');
  var toastMessage = document.getElementById('toast-message');
  function showToast(msg) {
    if (!toast || !toastMessage) return;
    toastMessage.textContent = msg;
    toast.classList.remove('translate-y-20', 'opacity-0');
    toast.classList.add('translate-y-0', 'opacity-100');
    setTimeout(function () {
      toast.classList.remove('translate-y-0', 'opacity-100');
      toast.classList.add('translate-y-20', 'opacity-0');
    }, 3000);
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
