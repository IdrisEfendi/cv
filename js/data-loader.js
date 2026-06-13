/* ============================
   Data Loader — loads cv-data.json
   and populates HTML content
   ============================ */

(function () {
  'use strict';

  var CV_DATA = null;

  function setText(el, text) {
    if (el && text !== undefined && text !== null) el.textContent = text;
  }

  function setHTML(el, html) {
    if (el && html !== undefined && html !== null) el.innerHTML = html;
  }

  function setAttr(el, attr, val) {
    if (el && val !== undefined && val !== null) el.setAttribute(attr, val);
  }

  function loadCV() {
    fetch('data/cv-data.json')
      .then(function (r) {
        if (!r.ok) throw new Error('Not found');
        return r.json();
      })
      .then(function (data) {
        CV_DATA = data;
        applyData(data);
      })
      .catch(function () {
        // JSON not found, keep static HTML as fallback
      });
  }

  function applyData(d) {
    // --- SEO ---
    if (d.seo) {
      document.title = d.seo.title || document.title;
      var metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) metaDesc.setAttribute('content', d.seo.description);
      var ogTitle = document.querySelector('meta[property="og:title"]');
      if (ogTitle) ogTitle.setAttribute('content', d.seo.title);
      var ogDesc = document.querySelector('meta[property="og:description"]');
      if (ogDesc) ogDesc.setAttribute('content', d.seo.description);
      var ogImg = document.querySelector('meta[property="og:image"]');
      if (ogImg) ogImg.setAttribute('content', d.seo.ogImage);
      var jsonLd = document.querySelector('script[type="application/ld+json"]');
      if (jsonLd && d.seo.jsonLd) jsonLd.textContent = JSON.stringify(d.seo.jsonLd);
    }

    // --- Profile ---
    if (d.profile) {
      var p = d.profile;
      // Hero
      setText(document.querySelector('#hero h1 span'), p.name);
      setText(document.querySelector('#hero h2'), p.title);
      setText(document.querySelector('#hero p.max-w-xl'), p.tagline);
      setText(document.querySelector('.inline-flex .text-primary-300'), p.statusText);
      var heroImg = document.querySelector('#hero img[alt]');
      if (heroImg) setAttr(heroImg, 'src', p.profileImage);
      var cvLink = document.querySelector('a[href*="cv.pdf"]');
      if (cvLink) setAttr(cvLink, 'href', p.cvFile);

      // Social links
      var socialLinks = document.querySelectorAll('#hero .flex.items-center.gap-4 a');
      var socialUrls = [p.socials.github, p.socials.linkedin, p.socials.instagram, p.socials.whatsapp];
      socialLinks.forEach(function (a, i) { if (socialUrls[i]) setAttr(a, 'href', socialUrls[i]); });

      // Navbar logo
      var logo = document.querySelector('#navbar a[href="#hero"]');
      if (logo) setHTML(logo, p.initials + '<span class="text-primary-500">.</span>');
      logo.classList.add('text-xl', 'font-bold', 'bg-gradient-to-r', 'from-primary-400', 'to-purple-400', 'bg-clip-text', 'text-transparent');

      // About image
      var aboutImg = document.querySelector('#about img');
      if (aboutImg) setAttr(aboutImg, 'src', p.aboutImage);
    }

    // --- About ---
    if (d.about) {
      var a = d.about;
      setText(document.querySelector('#about h4'), a.headline);
      var aboutDescs = document.querySelectorAll('#about .text-gray-400.leading-relaxed');
      if (aboutDescs[0] && a.description[0]) setText(aboutDescs[0], a.description[0]);
      if (aboutDescs[1] && a.description[1]) setText(aboutDescs[1], a.description[1]);

      var expBadge = document.querySelector('#about .text-3xl.font-bold');
      if (expBadge) setText(expBadge, a.yearsExperience + '+');

      // Features
      var featureEls = document.querySelectorAll('#about .grid.grid-cols-2 > div');
      a.features.forEach(function (f, i) {
        if (featureEls[i]) {
          var icon = featureEls[i].querySelector('i');
          var title = featureEls[i].querySelector('h5');
          var desc = featureEls[i].querySelector('p');
          if (icon) { icon.className = f.icon + ' text-primary-400 text-xl mb-2'; }
          if (title) setText(title, f.title);
          if (desc) setText(desc, f.desc);
        }
      });
    }

    // --- Skills ---
    if (d.skills) {
      var skillCards = document.querySelectorAll('#skills .grid > div');
      d.skills.forEach(function (cat, ci) {
        if (skillCards[ci]) {
          var icon = skillCards[ci].querySelector('i');
          var title = skillCards[ci].querySelector('h4');
          if (icon) { icon.className = cat.icon + ' text-primary-400 text-xl'; }
          if (title) setText(title, cat.title);

          var items = skillCards[ci].querySelectorAll('.skill-item');
          cat.items.forEach(function (s, si) {
            if (items[si]) {
              var spans = items[si].querySelectorAll('span');
              if (spans[0]) {
                // Render icon + name
                var iconHtml = s.icon ? '<i class="' + s.icon + ' mr-2" style="color:' + (s.color||'#818cf8') + ';font-size:0.9em"></i>' : '';
                spans[0].innerHTML = iconHtml + s.name;
              }
              if (spans[1]) setText(spans[1], s.level + '%');
              var bar = items[si].querySelector('.skill-bar');
              if (bar) setAttr(bar, 'data-width', s.level);
            }
          });
        }
      });
    }

    // --- Experience ---
    if (d.experience) {
      var expCards = document.querySelectorAll('#experience .space-y-12 > div');
      d.experience.forEach(function (e, i) {
        if (expCards[i]) {
          var card = expCards[i].querySelector('.bg-dark-800\\/50');
          if (card) {
            setText(card.querySelector('h4'), e.position);
            setText(card.querySelector('.text-primary-400'), e.company);
            setText(card.querySelector('.text-gray-500 i')?.parentElement, e.period);
            setText(card.querySelector('.text-gray-400.text-sm.mt-3'), e.description);

            var techContainer = card.querySelector('.flex.flex-wrap.gap-2');
            if (techContainer) {
              techContainer.innerHTML = e.tech.map(function (t) {
                return '<span class="px-2 py-1 text-xs bg-primary-500/10 text-primary-300 rounded-md border border-primary-500/20">' + t + '</span>';
              }).join('');
            }
          }
        }
      });
    }

    // --- Portfolio ---
    if (d.portfolio) {
      var grid = document.getElementById('portfolio-grid');
      if (grid) {
        grid.innerHTML = d.portfolio.map(function (proj, i) {
          return '<div class="portfolio-item group" data-category="' + proj.category + '" data-aos="fade-up" data-aos-delay="' + (i % 3) * 100 + '">' +
            '<div class="bg-dark-800/50 backdrop-blur-sm border border-gray-700/30 rounded-2xl overflow-hidden hover:border-primary-500/30 transition-all duration-300 hover:-translate-y-2">' +
            '<div class="relative overflow-hidden h-48">' +
            '<img src="' + proj.image + '" alt="' + proj.title + '" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" loading="lazy">' +
            '<div class="absolute inset-0 bg-gradient-to-t from-dark-950/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4 gap-3">' +
            '<a href="' + proj.demo + '" class="px-4 py-2 bg-primary-500 text-white text-sm rounded-lg hover:bg-primary-600 transition-colors"><i class="fas fa-external-link-alt mr-1"></i> Demo</a>' +
            '<a href="' + proj.github + '" class="px-4 py-2 bg-dark-800 text-white text-sm rounded-lg border border-gray-600 hover:border-primary-500 transition-colors"><i class="fab fa-github mr-1"></i> GitHub</a>' +
            '</div></div>' +
            '<div class="p-5">' +
            '<h4 class="font-bold text-lg mb-2">' + proj.title + '</h4>' +
            '<p class="text-gray-400 text-sm leading-relaxed mb-3">' + proj.description + '</p>' +
            '<div class="flex flex-wrap gap-2">' +
            proj.tech.map(function (t) { return '<span class="px-2 py-1 text-xs bg-primary-500/10 text-primary-300 rounded-md">' + t + '</span>'; }).join('') +
            '</div></div></div></div>';
        }).join('');

        // Re-init portfolio filter
        initPortfolioFilter();
      }
    }

    // --- Statistics ---
    if (d.statistics) {
      var statCards = document.querySelectorAll('#statistics .grid > div');
      d.statistics.forEach(function (s, i) {
        if (statCards[i]) {
          var icon = statCards[i].querySelector('i');
          var counter = statCards[i].querySelector('.counter');
          var label = statCards[i].querySelector('.text-gray-400');
          if (icon) { icon.className = s.icon + ' text-primary-400 text-2xl'; }
          if (counter) setAttr(counter, 'data-target', s.target);
          if (label) setText(label, s.label);
        }
      });
    }

    // --- Certificates ---
    if (d.certificates) {
      var certCards = document.querySelectorAll('#certificates .grid > div');
      d.certificates.forEach(function (cert, i) {
        if (certCards[i]) {
          var colorMap = {yellow:'yellow',blue:'blue',green:'green',purple:'purple',red:'red',orange:'orange'};
          var iconEl = certCards[i].querySelector('i');
          var iconWrap = certCards[i].querySelector('.rounded-xl');
          if (iconEl) { iconEl.className = 'fas fa-award text-' + (cert.color||'yellow') + '-400 text-xl'; }
          if (iconWrap) { iconWrap.className = 'w-12 h-12 bg-' + (cert.color||'yellow') + '-500/10 rounded-xl flex items-center justify-center mb-4'; }
          setText(certCards[i].querySelector('h4'), cert.title);
          setText(certCards[i].querySelector('.text-primary-400'), cert.issuer);
          setText(certCards[i].querySelector('.text-gray-500'), cert.year);
          var link = certCards[i].querySelector('a');
          if (link) setAttr(link, 'href', cert.link);
        }
      });
    }

    // --- Testimonials ---
    if (d.testimonials) {
      var slider = document.getElementById('testimonial-slider');
      if (slider) {
        slider.innerHTML = d.testimonials.map(function (t, i) {
          return '<div class="testimonial-slide absolute inset-0 opacity-0 transition-all duration-500' + (i === 0 ? ' active' : '') + '">' +
            '<div class="bg-dark-800/50 backdrop-blur-sm border border-gray-700/30 rounded-3xl p-8 lg:p-12 text-center">' +
            '<div class="w-20 h-20 rounded-full overflow-hidden mx-auto mb-6 border-2 border-primary-500/30">' +
            '<img src="' + t.image + '" alt="' + t.name + '" class="w-full h-full object-cover" loading="lazy"></div>' +
            '<i class="fas fa-quote-left text-primary-500/30 text-4xl mb-4"></i>' +
            '<p class="text-gray-300 text-lg leading-relaxed mb-6 max-w-2xl mx-auto">"' + t.text + '"</p>' +
            '<h4 class="font-bold text-lg">' + t.name + '</h4>' +
            '<p class="text-primary-400 text-sm">' + t.role + '</p></div></div>';
        }).join('');
        // Re-init slider
        initTestimonialSlider();
      }
    }

    // --- Contact ---
    if (d.contact) {
      var ct = d.contact;
      setText(document.querySelector('#contact h4'), ct.headline);
      setText(document.querySelector('#contact .lg\\:col-span-2 p.text-gray-400'), ct.description);

      var contactLinks = document.querySelectorAll('#contact .lg\\:col-span-2 .space-y-4 > a');
      if (contactLinks[0]) setAttr(contactLinks[0], 'href', 'mailto:' + ct.email);
      if (contactLinks[0]) setText(contactLinks[0].querySelector('.font-medium'), ct.email);
      if (contactLinks[1]) setAttr(contactLinks[1], 'href', 'https://wa.me/' + (d.profile ? d.profile.phone : ''));
      if (contactLinks[1]) setText(contactLinks[1].querySelector('.font-medium'), ct.whatsapp);
      if (contactLinks[2]) setAttr(contactLinks[2], 'href', 'https://' + ct.github);
      if (contactLinks[2]) setText(contactLinks[2].querySelector('.font-medium'), ct.github);
      if (contactLinks[3]) setAttr(contactLinks[3], 'href', 'https://' + ct.linkedin);
      if (contactLinks[3]) setText(contactLinks[3].querySelector('.font-medium'), ct.linkedin);
      if (contactLinks[4]) setAttr(contactLinks[4], 'href', 'https://' + ct.instagram);
      if (contactLinks[4]) setText(contactLinks[4].querySelector('.font-medium'), ct.instagram);
    }

    // --- Footer ---
    if (d.footer) {
      var footerTagline = document.querySelector('footer p.text-gray-400');
      if (footerTagline) setText(footerTagline, d.footer.tagline);

      var footerLinks = document.querySelectorAll('footer .space-y-2');
      if (footerLinks[1]) {
        footerLinks[1].innerHTML = d.footer.services.map(function (s) {
          return '<li>' + s + '</li>';
        }).join('');
      }

      // Social links in footer
      if (d.profile && d.profile.socials) {
        var footerSocials = document.querySelectorAll('footer .flex.gap-3 a');
        var fUrls = [d.profile.socials.github, d.profile.socials.linkedin, d.profile.socials.instagram, d.profile.socials.whatsapp];
        footerSocials.forEach(function (a, i) { if (fUrls[i]) setAttr(a, 'href', fUrls[i]); });
      }
    }
  }

  function initPortfolioFilter() {
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
  }

  function initTestimonialSlider() {
    var slides = document.querySelectorAll('.testimonial-slide');
    var dotsContainer = document.getElementById('testimonial-dots');
    var prevBtn = document.getElementById('testimonial-prev');
    var nextBtn = document.getElementById('testimonial-next');
    var currentSlide = 0;
    var slideInterval;

    if (!dotsContainer || slides.length === 0) return;
    dotsContainer.innerHTML = '';

    slides.forEach(function (_, i) {
      var dot = document.createElement('button');
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

    function nextSlide() { goToSlide((currentSlide + 1) % slides.length); }

    function resetSlideInterval() {
      clearInterval(slideInterval);
      slideInterval = setInterval(nextSlide, 5000);
    }

    prevBtn.addEventListener('click', function () { nextSlide(); resetSlideInterval(); });
    nextBtn.addEventListener('click', function () { nextSlide(); resetSlideInterval(); });
    slideInterval = setInterval(nextSlide, 5000);
  }

  // --- Skill bar re-init after data load ---
  function reinitSkillBars() {
    document.querySelectorAll('.skill-bar').forEach(function (bar) {
      var width = bar.getAttribute('data-width');
      if (width) bar.style.setProperty('--skill-width', width + '%');
    });
  }

  // --- Load on DOM ready ---
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      loadCV();
      setTimeout(reinitSkillBars, 500);
    });
  } else {
    loadCV();
    setTimeout(reinitSkillBars, 500);
  }

})();
