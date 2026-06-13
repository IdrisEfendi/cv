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

  // ---- Contact Form (Web3Forms) ----
  var contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var name = document.getElementById('name').value.trim();
      var email = document.getElementById('email').value.trim();
      var message = document.getElementById('message').value.trim();
      var submitBtn = contactForm.querySelector('button[type="submit"]');

      if (!name || !email || !message) {
        showToast('Mohon isi semua field yang wajib diisi.');
        return;
      }

      // Check if Web3Forms key is configured
      var accessKey = contactForm.querySelector('input[name="access_key"]').value;
      if (accessKey === 'YOUR_ACCESS_KEY_HERE') {
        // Fallback: open email client
        var subject = document.getElementById('subject').value || 'Portfolio Contact';
        var body = 'Hi,%0D%0A%0D%0AName: ' + name + '%0AEmail: ' + email + '%0A%0A' + message;
        window.location.href = 'mailto:idrisefendi171@gmail.com?subject=' + encodeURIComponent(subject) + '&body=' + body;
        contactForm.reset();
        showToast('Membuka email client...');
        return;
      }

      // Submit via Web3Forms API
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';

      var formData = new FormData(contactForm);
      fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: formData
      }).then(function (r) { return r.json(); }).then(function (res) {
        if (res.success) {
          contactForm.reset();
          showToast('Pesan berhasil dikirim! Terima kasih, ' + name + '.');
        } else {
          showToast('Gagal mengirim. Silakan coba lagi.');
        }
      }).catch(function () {
        showToast('Error jaringan. Silakan coba lagi.');
      }).finally(function () {
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message';
      });
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
      var target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // ---- Image Error Fallback ----
  document.querySelectorAll('img').forEach(function (img) {
    img.addEventListener('error', function () {
      this.style.display = 'none';
      var placeholder = document.createElement('div');
      placeholder.className = this.className;
      placeholder.style.cssText = 'background:linear-gradient(135deg,#1e1e2e,#312e81);display:flex;align-items:center;justify-content:center;color:#6366f1;font-size:2rem;';
      placeholder.innerHTML = '<i class="fas fa-image"></i>';
      if (this.parentNode) this.parentNode.replaceChild(placeholder, this);
    });
  });

  // ---- Cursor Particle Effect (desktop only) ----
  if (window.matchMedia('(pointer: fine)').matches && window.innerWidth > 768) {
    var canvas = document.createElement('canvas');
    canvas.id = 'cursor-particles';
    canvas.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:9998;';
    document.body.appendChild(canvas);
    var ctx = canvas.getContext('2d');
    var particles = [];
    var mouse = { x: -100, y: -100 };
    var maxParticles = 25;

    function resizeCanvas() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    document.addEventListener('mousemove', function (e) {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      for (var i = 0; i < 2; i++) {
        particles.push({
          x: mouse.x,
          y: mouse.y,
          vx: (Math.random() - 0.5) * 1.5,
          vy: (Math.random() - 0.5) * 1.5,
          life: 1,
          size: Math.random() * 3 + 1.5,
          hue: Math.random() * 40 + 230
        });
      }
      if (particles.length > maxParticles) particles.splice(0, particles.length - maxParticles);
    });

    function animateParticles() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (var i = particles.length - 1; i >= 0; i--) {
        var p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.life -= 0.025;
        if (p.life <= 0) { particles.splice(i, 1); continue; }
        ctx.globalAlpha = p.life * 0.6;
        ctx.fillStyle = 'hsl(' + p.hue + ',80%,65%)';
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      requestAnimationFrame(animateParticles);
    }
    animateParticles();
  }

})();
