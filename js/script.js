/*
  Portfolio interactions — vanilla ES6, deliberately small.

  1. Project accordion: native <details> rows, enhanced so only one
     project is open at a time and the disclosure animates its
     height. Without JavaScript the rows still open and close.
  2. Screenshot stage: thumbnail links swap the large frame; the
     like toggle persists per browser.
  3. Full-size screenshot viewer: the large frame is a plain link;
     this upgrades a click into an accessible dialog (Escape, arrow
     keys, focus return, scroll lock). Without JavaScript the link
     opens the image file directly.
  4. Back-to-top: visible after the hero, hidden again at the page
     end where the footer links are cheaper to use.
  5. Reveal-on-scroll: one signature animation per section, skipped
     entirely under prefers-reduced-motion and without JavaScript.
  6. Skills motion: stagger indexes for the cascade entrance, plus a
     cursor-proximity ripple across the rows (pointer-fine devices
     only, never under reduced motion).
  7. Page motion: one signature per section — character-mask titles,
     hero kicker decode, project row indexes, experience slide +
     scroll-grown timeline, education stamps, about word cascade,
     contact magnetism, header reading progress.
  8. Preloader: five bars + bouncing ball with an English/Tamil/
     Hindi introduction; dismissed on load with a hard cap, static
     under reduced motion, hidden entirely without JavaScript.
  9. WhatsApp shortcut: builds the wa.me link from a data attribute;
     stays hidden until a number is configured.
 10. Refresh Experience: footer switch pops visible letters at random,
     hands over to the existing preloader, then resets the page to its
     initial state — no browser reload, one restart at a time.

  Every behaviour here is an enhancement: with this file missing the
  page remains complete, readable and navigable.
*/

(function () {
  'use strict';

  document.documentElement.classList.add('js');

  var reduceMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

  function prefersReducedMotion() {
    return reduceMotionQuery.matches;
  }

  // Reset hooks: modules register how to re-arm their entry state so
  // the Refresh Experience switch can start the page over cleanly.
  var resetHooks = [];
  var preloaderBridge = null;   // filled by the preloader module
  var resetAccordion = null;    // filled by the accordion module
  var closeViewer = null;       // filled by the viewer module

  /* 1. Project accordion -------------------------------------------- */

  var projectItems = Array.prototype.slice.call(document.querySelectorAll('.project-item'));

  // Back to the shipped state: first row open, rest closed, no
  // leftover animation heights.
  resetAccordion = function () {
    projectItems.forEach(function (item, i) {
      var body = item.querySelector('.project-body');
      if (body && body.getAnimations) {
        body.getAnimations().forEach(function (a) { a.cancel(); });
      }
      item.open = (i === 0);
      if (body) {
        body.removeAttribute('style');
      }
    });
  };
  var ROW_CLEARANCE = 84;   // breathing room under the viewport top

  function animateBody(body, from, to, done) {
    if (prefersReducedMotion() || typeof body.animate !== 'function') {
      done();
      return null;
    }
    return body.animate(
      [{ height: from + 'px' }, { height: to + 'px' }],
      { duration: 320, easing: 'cubic-bezier(0.22, 0.61, 0.36, 1)' }
    );
  }

  function openItem(item) {
    var body = item.querySelector('.project-body');

    if (item.pendingAnim) {
      item.pendingAnim.cancel();
      item.pendingAnim = null;
    }

    item.open = true;
    body.style.overflow = 'hidden';
    body.style.height = '0px';
    var target = body.scrollHeight;

    var anim = animateBody(body, 0, target, function () {
      item.pendingAnim = null;
      body.style.overflow = '';
      body.style.height = '';
    });

    if (anim) {
      item.pendingAnim = anim;
      anim.addEventListener('finish', function () {
        item.pendingAnim = null;
        body.style.overflow = '';
        body.style.height = '';
      });
    }
  }

  function closeItem(item) {
    var body = item.querySelector('.project-body');

    if (!item.open) {
      return;
    }
    if (item.pendingAnim) {
      item.pendingAnim.cancel();
      item.pendingAnim = null;
    }

    var from = body.offsetHeight;
    body.style.overflow = 'hidden';

    var anim = animateBody(body, from, 0, function () {
      item.open = false;
      body.style.overflow = '';
      body.style.height = '';
    });

    if (anim) {
      item.pendingAnim = anim;
      anim.addEventListener('finish', function () {
        item.pendingAnim = null;
        item.open = false;
        body.style.overflow = '';
        body.style.height = '';
      });
    } else {
      item.open = false;
      body.style.overflow = '';
      body.style.height = '';
    }
  }

  projectItems.forEach(function (item) {
    item.querySelector('.project-row').addEventListener('click', function (event) {
      // The native toggle is replaced so one project stays open at a
      // time and the height can animate; Enter/Space arrive as clicks.
      event.preventDefault();

      if (item.open) {
        closeItem(item);
        return;
      }

      projectItems.forEach(function (other) {
        if (other !== item && other.open) {
          closeItem(other);
        }
      });
      openItem(item);

      // Keep the opened row's header in view.
      window.requestAnimationFrame(function () {
        var top = item.getBoundingClientRect().top;
        if (top < ROW_CLEARANCE) {
          window.scrollTo({
            top: window.scrollY + top - ROW_CLEARANCE,
            behavior: prefersReducedMotion() ? 'auto' : 'smooth'
          });
        }
      });
    });
  });

  /* 2. Screenshot stage: switcher + like ---------------------------- */

  function projectShortName(stage) {
    if (!stage) {
      return '';   // non-project groups (certificates) have no stage
    }
    var item = stage.closest('.project-item');
    var name = item && item.querySelector('.project-name');
    return name ? name.textContent.split('—')[0].trim() : '';
  }

  Array.prototype.forEach.call(document.querySelectorAll('.project-stage'), function (stage) {
    var frame = stage.querySelector('.stage-frame');
    var frameImg = frame.querySelector('img');
    var thumbs = Array.prototype.slice.call(stage.querySelectorAll('.stage-thumb'));

    function showThumb(index) {
      var thumb = thumbs[index];

      if (!thumb) {
        return;
      }

      thumbs.forEach(function (other, i) {
        other.classList.toggle('is-active', i === index);
        if (i === index) {
          other.setAttribute('aria-current', 'true');
        } else {
          other.removeAttribute('aria-current');
        }
      });

      var caption = thumb.getAttribute('data-caption') || '';
      frame.setAttribute('href', thumb.getAttribute('href'));
      frame.setAttribute('data-caption', caption);
      frameImg.src = thumb.getAttribute('href');
      frameImg.alt = projectShortName(stage) + ' — ' + caption;
    }

    thumbs.forEach(function (thumb, index) {
      thumb.addEventListener('click', function (event) {
        // With JavaScript the thumb swaps the big frame; without it
        // the anchor opens the image file, which is the same evidence.
        event.preventDefault();
        showThumb(index);
      });
    });
  });

  Array.prototype.forEach.call(document.querySelectorAll('.like-btn'), function (btn) {
    var key = 'pf-like-' + btn.getAttribute('data-like');
    var label = btn.querySelector('[data-like-label]');
    var liked = false;

    try {
      liked = window.localStorage.getItem(key) === '1';
    } catch (err) {
      liked = false;   // storage blocked (private mode): still toggles
    }

    function paint() {
      btn.setAttribute('aria-pressed', liked ? 'true' : 'false');
      label.textContent = liked ? 'Liked' : 'Like';
    }

    paint();

    btn.addEventListener('click', function () {
      liked = !liked;
      try {
        window.localStorage.setItem(key, liked ? '1' : '0');
      } catch (err) { /* toggle stays for the session */ }
      paint();
    });
  });

  /* 3. Full-size screenshot viewer ---------------------------------- */

  (function () {
    var lightbox = document.getElementById('lightbox');

    if (!lightbox) {
      return;
    }

    var image = lightbox.querySelector('.lightbox-img');
    var captionEl = lightbox.querySelector('[data-lightbox-caption]');
    var countEl = lightbox.querySelector('[data-lightbox-count]');
    var closeBtn = lightbox.querySelector('.lightbox-close');
    var prevBtn = lightbox.querySelector('.lightbox-prev');
    var nextBtn = lightbox.querySelector('.lightbox-next');

    // One group per project, in page order.
    var groups = Array.prototype.map.call(
      document.querySelectorAll('.stage-thumbs'),
      function (group) {
        return Array.prototype.slice.call(group.querySelectorAll('.stage-thumb'));
      }
    );

    var current = null;   // { group, index }
    var opener = null;    // element to return focus to on close

    function show(groupIndex, index) {
      var thumbs = groups[groupIndex];

      if (!thumbs || !thumbs.length) {
        return;
      }

      index = ((index % thumbs.length) + thumbs.length) % thumbs.length;
      current = { group: groupIndex, index: index };

      var thumb = thumbs[index];
      var stage = thumb.closest('.project-stage');
      var caption = thumb.getAttribute('data-caption') || '';

      var shortName = projectShortName(stage);
      image.src = thumb.getAttribute('href');
      image.alt = (shortName ? shortName + ' — ' : '') + caption;
      captionEl.textContent = caption;
      countEl.textContent = (index + 1) + ' / ' + thumbs.length;
    }

    function open(groupIndex, index, openerEl) {
      opener = openerEl || null;
      show(groupIndex, index);
      lightbox.hidden = false;
      document.body.classList.add('no-scroll');

      window.requestAnimationFrame(function () {
        lightbox.classList.add('is-open');
      });

      closeBtn.focus();
    }

    function close() {
      lightbox.classList.remove('is-open');
      lightbox.hidden = true;
      document.body.classList.remove('no-scroll');

      if (opener) {
        opener.focus();
        opener = null;
      }
    }

    // The large frame of each stage opens the viewer at whichever
    // screen is currently shown.
    Array.prototype.forEach.call(document.querySelectorAll('.stage-frame'), function (frame, groupIndex) {
      frame.addEventListener('click', function (event) {
        event.preventDefault();
        var stage = frame.closest('.project-stage');
        var thumbs = Array.prototype.slice.call(stage.querySelectorAll('.stage-thumb'));
        var active = thumbs.findIndex(function (t) { return t.classList.contains('is-active'); });
        open(groupIndex, active < 0 ? 0 : active, frame);
      });
    });

    // The certification gallery joins as its own group: clicking a
    // certificate opens the viewer instead of switching a frame.
    var certThumbs = Array.prototype.slice.call(document.querySelectorAll('.cert-thumb'));

    if (certThumbs.length) {
      groups.push(certThumbs);
      var certGroup = groups.length - 1;

      certThumbs.forEach(function (thumb, index) {
        thumb.addEventListener('click', function (event) {
          event.preventDefault();
          open(certGroup, index, thumb);
        });
      });
    }

    closeViewer = close;
    closeBtn.addEventListener('click', close);
    prevBtn.addEventListener('click', function () { show(current.group, current.index - 1); });
    nextBtn.addEventListener('click', function () { show(current.group, current.index + 1); });

    // Clicking the scrim (but not the photo or the controls) closes.
    lightbox.addEventListener('click', function (event) {
      if (event.target === lightbox) {
        close();
      }
    });

    document.addEventListener('keydown', function (event) {
      if (lightbox.hidden) {
        return;
      }

      if (event.key === 'Escape') {
        close();
      } else if (event.key === 'ArrowLeft') {
        show(current.group, current.index - 1);
      } else if (event.key === 'ArrowRight') {
        show(current.group, current.index + 1);
      } else if (event.key === 'Tab') {
        // Keep focus inside the dialog: three controls, cycling.
        var stops = [closeBtn, prevBtn, nextBtn];
        var active = document.activeElement;
        var at = stops.indexOf(active);

        if (at === -1) {
          event.preventDefault();
          closeBtn.focus();
        } else if (event.shiftKey && at === 0) {
          event.preventDefault();
          stops[stops.length - 1].focus();
        } else if (!event.shiftKey && at === stops.length - 1) {
          event.preventDefault();
          stops[0].focus();
        }
      }
    });
  })();

  /* 4. Back to top --------------------------------------------------- */

  var backToTop = document.getElementById('backToTop');
  var hero = document.querySelector('.hero');

  if (backToTop && hero) {
    var pageEnd = document.querySelectorAll('#contact, .footer');
    var nearPageEnd = false;
    var bttFrame = null;

    function toggleBackToTop() {
      bttFrame = null;
      backToTop.classList.toggle('is-visible', window.scrollY > hero.offsetHeight && !nearPageEnd);
    }

    function requestBackToTop() {
      if (bttFrame === null) {
        bttFrame = window.requestAnimationFrame(toggleBackToTop);
      }
    }

    if (pageEnd.length && 'IntersectionObserver' in window) {
      var endObserver = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            entry.target.dataset.nearEnd = entry.isIntersecting ? '1' : '0';
          });

          nearPageEnd = Array.prototype.some.call(pageEnd, function (el) {
            return el.dataset.nearEnd === '1';
          });

          requestBackToTop();
        },
        { rootMargin: '0px 0px -40% 0px' }
      );

      Array.prototype.forEach.call(pageEnd, function (el) { endObserver.observe(el); });
    }

    window.addEventListener('scroll', requestBackToTop, { passive: true });
    toggleBackToTop();

    backToTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
    });
  }

  /* 5. Reveal on scroll ---------------------------------------------- */

  var revealElements = document.querySelectorAll('.reveal');
  var revealObserver = null;
  var heroArrived = false;
  var playKickerDecode = null;

  function triggerHeroArrival(force) {
    if (heroArrived && !force) {
      return;
    }
    heroArrived = true;
    var hero = document.querySelector('.hero');
    if (hero) {
      hero.classList.add('in');
      Array.prototype.forEach.call(hero.querySelectorAll('.reveal'), function (element) {
        var line = element.parentElement && element.parentElement.classList.contains('mask')
          ? element.parentElement.querySelector('.reveal-mask')
          : element;
        (line || element).classList.add('in');
        if (revealObserver) {
          var obsTarget = element.parentElement && element.parentElement.classList.contains('mask')
            ? element.parentElement
            : element;
          revealObserver.unobserve(obsTarget);
        }
      });
    }
    if (typeof playKickerDecode === 'function') {
      playKickerDecode();
    }
  }

  if (revealElements.length && 'IntersectionObserver' in window && !prefersReducedMotion()) {
    // A masked line starts translated outside its clipping parent, so
    // its own intersection ratio stays 0; observe the wrapper instead.
    function revealTargetFor(element) {
      return element.parentElement && element.parentElement.classList.contains('mask')
        ? element.parentElement
        : element;
    }

    revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) {
            return;
          }

          var target = entry.target;
          var preloader = document.getElementById('preloader');
          var isPreloaderActive = preloader && !preloader.hidden && !preloader.classList.contains('is-leaving');
          if (target.closest('.hero') && isPreloaderActive) {
            return;
          }

          var line = target.classList.contains('mask') ? target.querySelector('.reveal-mask') : null;

          (line || target).classList.add('in');
          revealObserver.unobserve(target);
        });
      },
      { threshold: 0, rootMargin: '0px 0px -48px 0px' }
    );

    function observeReveals() {
      Array.prototype.forEach.call(revealElements, function (element) {
        revealObserver.observe(revealTargetFor(element));
      });
    }

    observeReveals();

    // Refresh Experience: clear entry state, watch again.
    resetHooks.push(function () {
      heroArrived = false;
      var hero = document.querySelector('.hero');
      if (hero) {
        hero.classList.remove('in');
      }
      Array.prototype.forEach.call(revealElements, function (element) {
        var target = revealTargetFor(element);
        var line = target.classList.contains('mask') ? target.querySelector('.reveal-mask') : null;
        (line || target).classList.remove('in');
      });
      observeReveals();
    });
  }

  /* 6. Skills motion: stagger, spotlight + cursor ripple ----------- */

  (function () {
    var skillsSection = document.getElementById('skills');
    var skillsGrid = skillsSection && skillsSection.querySelector('.skills-grid');

    if (!skillsSection || !skillsGrid) {
      return;
    }

    var categories = Array.prototype.slice.call(skillsGrid.querySelectorAll('.skill-category'));
    var allRows = [];

    // Assign category index (--c) and item index (--idx)
    categories.forEach(function (cat, c) {
      cat.style.setProperty('--c', c);
      var rows = Array.prototype.slice.call(cat.querySelectorAll('li'));
      rows.forEach(function (row, idx) {
        row.style.setProperty('--idx', idx);
        allRows.push(row);
      });

      // Mouse tracking for dynamic spotlight glow
      cat.addEventListener('pointermove', function (e) {
        if (prefersReducedMotion()) return;
        var rect = cat.getBoundingClientRect();
        cat.style.setProperty('--mx', Math.round(e.clientX - rect.left) + 'px');
        cat.style.setProperty('--my', Math.round(e.clientY - rect.top) + 'px');
      });
    });

    // One shared counter so the cascade runs in reading order across
    // all four columns
    allRows.forEach(function (row, i) {
      row.style.setProperty('--i', i);
    });

    if ('IntersectionObserver' in window) {
      var skillsObserver = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              skillsSection.classList.add('in');
              skillsObserver.unobserve(skillsSection);
            }
          });
        },
        { threshold: 0.12 }
      );
      skillsObserver.observe(skillsSection);

      resetHooks.push(function () {
        skillsSection.classList.remove('in');
        skillsObserver.observe(skillsSection);
      });
    } else {
      skillsSection.classList.add('in');
      resetHooks.push(function () {
        skillsSection.classList.add('in');
      });
    }

    // Cursor-proximity ripple: rows within 140px of the pointer lift
    // and slide smoothly. Pointer-fine devices only; reduced motion opts out.
    if (!window.matchMedia('(pointer: fine)').matches) {
      return;
    }

    var centers = [];
    var centersDirty = true;
    var rippleFrame = null;
    var pointer = null;

    function measureCenters() {
      centers = allRows.map(function (row) {
        var rect = row.getBoundingClientRect();
        return { el: row, x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
      });
      centersDirty = false;
    }

    function applyRipple() {
      rippleFrame = null;

      if (centersDirty) {
        measureCenters();
      }
      if (!pointer) {
        return;
      }

      centers.forEach(function (center) {
        var distance = Math.hypot(pointer.x - center.x, pointer.y - center.y);
        var lift = Math.round(Math.max(0, 1 - distance / 140) * 100) / 100;
        var now = parseFloat(center.el.style.getPropertyValue('--lift')) || 0;

        if (Math.abs(lift - now) > 0.01) {
          center.el.style.setProperty('--lift', lift);
        }
      });
    }

    skillsGrid.addEventListener('pointermove', function (event) {
      if (prefersReducedMotion()) {
        return;
      }
      pointer = { x: event.clientX, y: event.clientY };
      if (rippleFrame === null) {
        rippleFrame = window.requestAnimationFrame(applyRipple);
      }
    });

    skillsGrid.addEventListener('pointerleave', function () {
      pointer = null;
      allRows.forEach(function (row) {
        row.style.setProperty('--lift', 0);
      });
    });

    window.addEventListener('scroll', function () { centersDirty = true; }, { passive: true });
    window.addEventListener('resize', function () { centersDirty = true; });
  })();

  /* 7. Page motion: one signature per section ---------------------- */

  (function () {
    var motionTargets = ['projects', 'experience', 'education', 'about', 'contact']
      .map(function (id) { return document.getElementById(id); })
      .filter(Boolean);
    var footer = document.querySelector('.footer');

    if (footer) {
      motionTargets.push(footer);
    }

    // One observer flips each section into its animated state once.
    if ('IntersectionObserver' in window) {
      var inObserver = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              entry.target.classList.add('in');
              inObserver.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.12 }
      );
      motionTargets.forEach(function (target) { inObserver.observe(target); });

      // Refresh Experience: drop the animated-in state, re-watch so
      // every section signature replays from the top.
      resetHooks.push(function () {
        motionTargets.forEach(function (target) {
          target.classList.remove('in');
          inObserver.observe(target);
        });
      });
    } else {
      motionTargets.forEach(function (target) { target.classList.add('in'); });
      resetHooks.push(function () {
        motionTargets.forEach(function (target) { target.classList.add('in'); });
      });
    }

    // Stagger indexes the CSS delays read.
    Array.prototype.forEach.call(document.querySelectorAll('#projects .project-item'), function (row, i) {
      row.style.setProperty('--r', i);
      Array.prototype.forEach.call(row.querySelectorAll('.project-points li'), function (li, j) {
        li.style.setProperty('--li-i', j);
      });
    });
    Array.prototype.forEach.call(document.querySelectorAll('#skills .skill-category'), function (cat, i) {
      cat.style.setProperty('--c', i);
    });
    Array.prototype.forEach.call(document.querySelectorAll('#skills .skills-learning .learn-item'), function (item, i) {
      item.style.setProperty('--li', i);
    });
    Array.prototype.forEach.call(document.querySelectorAll('#experience .experience-entry'), function (entry, i) {
      entry.style.setProperty('--i', i);
      entry.style.setProperty('--sx', (i % 2 === 0 ? -26 : 26) + 'px');
    });
    Array.prototype.forEach.call(document.querySelectorAll('#education .education-entry, #education .certifications'), function (block, i) {
      block.style.setProperty('--i', i);
    });
    Array.prototype.forEach.call(document.querySelectorAll('#education .cert-item'), function (item, i) {
      item.style.setProperty('--ci', i);
    });
    Array.prototype.forEach.call(document.querySelectorAll('#contact .contact-actions > *'), function (action, i) {
      action.style.setProperty('--a', i);
    });
    Array.prototype.forEach.call(document.querySelectorAll('.footer .footer-detail'), function (det, i) {
      det.style.setProperty('--f', i);
    });
    Array.prototype.forEach.call(document.querySelectorAll('.footer .footer-list li'), function (li, i) {
      li.style.setProperty('--l', i);
    });

    // Section titles: split into masked characters. The h2 keeps an
    // aria-label with the full text; the spans are aria-hidden.
    Array.prototype.forEach.call(document.querySelectorAll('.section-title'), function (title) {
      var text = title.textContent;

      title.setAttribute('aria-label', text);
      var wrap = document.createElement('span');
      wrap.setAttribute('aria-hidden', 'true');
      var i = 0;

      text.split('').forEach(function (ch) {
        if (ch === ' ') {
          wrap.appendChild(document.createTextNode(' '));
          return;
        }
        var mask = document.createElement('span');
        mask.className = 'cm';
        var char = document.createElement('span');
        char.className = 'cc';
        char.textContent = ch;
        char.style.setProperty('--i', i++);
        mask.appendChild(char);
        wrap.appendChild(mask);
      });

      title.textContent = '';
      title.appendChild(wrap);
    });

    // About: word-by-word cascade across both paragraphs.
    var wordIndex = 0;
    Array.prototype.forEach.call(document.querySelectorAll('.about-text p'), function (p) {
      var words = p.textContent.split(/\s+/).filter(Boolean);

      p.textContent = '';
      words.forEach(function (word, idx) {
        var span = document.createElement('span');
        span.className = 'about-word';
        span.textContent = word;
        span.style.setProperty('--i', wordIndex++);
        p.appendChild(span);
        if (idx < words.length - 1) {
          p.appendChild(document.createTextNode(' '));
        }
      });
    });

    // Hero kicker: decode scramble. The real text stays available to
    // assistive tech in a visually-hidden span while the visible copy
    // decodes; reduced motion skips straight to the final string.
    var kicker = document.querySelector('.hero .kicker');

    if (kicker) {
      var finalText = kicker.textContent;
      var srText = document.createElement('span');
      srText.className = 'visually-hidden';
      srText.textContent = finalText;
      var decode = document.createElement('span');
      decode.setAttribute('aria-hidden', 'true');
      decode.textContent = finalText;
      kicker.textContent = '';
      kicker.appendChild(srText);
      kicker.appendChild(decode);

      playKickerDecode = function () {
        if (prefersReducedMotion()) {
          decode.textContent = finalText;
          return;
        }
        var glyphs = '01<>#/\\*+';
        var step = 0;

        var tick = function () {
          step += 1;
          var revealed = Math.floor(step / 2);
          var out = '';

          for (var i = 0; i < finalText.length; i++) {
            var ch = finalText[i];
            out += (i < revealed || ch === ' ')
              ? ch
              : glyphs[(Math.random() * glyphs.length) | 0];
          }
          decode.textContent = out;

          if (revealed <= finalText.length) {
            window.setTimeout(tick, 28);
          } else {
            decode.textContent = finalText;
          }
        };

        decode.textContent = '';
        window.setTimeout(tick, 100);
      };
    }

    // Contact: magnetic pull toward the cursor (pointer-fine only).
    if (window.matchMedia('(pointer: fine)').matches) {
      Array.prototype.forEach.call(document.querySelectorAll('.contact-actions > *'), function (action) {
        action.addEventListener('pointermove', function (event) {
          if (prefersReducedMotion()) {
            return;
          }
          var rect = action.getBoundingClientRect();
          var dx = (event.clientX - (rect.left + rect.width / 2)) / rect.width;
          var dy = (event.clientY - (rect.top + rect.height / 2)) / rect.height;
          action.style.transform = 'translate(' + (dx * 10).toFixed(1) + 'px, ' + (dy * 8).toFixed(1) + 'px)';
        });
        action.addEventListener('pointerleave', function () {
          action.style.transform = '';
        });
      });
    }

    // Experience timeline: one faint line behind the entries that
    // grows with reading; static and full under reduced motion.
    var expSection = document.getElementById('experience');
    var expLine = null;

    if (expSection) {
      var entries = expSection.querySelectorAll('.experience-entry');

      if (entries.length) {
        expLine = document.createElement('span');
        expLine.className = 'exp-line';
        expLine.setAttribute('aria-hidden', 'true');
        expLine.style.top = entries[0].offsetTop + 'px';
        expLine.style.height =
          (entries[entries.length - 1].offsetTop + entries[entries.length - 1].offsetHeight - entries[0].offsetTop) + 'px';
        expSection.querySelector('.container').appendChild(expLine);
      }
    }

    // Timeline growth, one rAF per scroll.
    var motionFrame = null;

    function pageMotion() {
      motionFrame = null;

      if (expLine) {
        if (prefersReducedMotion()) {
          expLine.style.setProperty('--tp', '1');
        } else {
          // Grows while the section travels through the viewport:
          // 0 as its top enters, 1 as its bottom leaves.
          var rect = expSection.getBoundingClientRect();
          var progress = (window.innerHeight - rect.top) / (window.innerHeight + rect.height);
          expLine.style.setProperty('--tp', Math.max(0, Math.min(1, progress)).toFixed(4));
        }
      }
    }

    function requestPageMotion() {
      if (motionFrame === null) {
        motionFrame = window.requestAnimationFrame(pageMotion);
      }
    }

    window.addEventListener('scroll', requestPageMotion, { passive: true });
    window.addEventListener('resize', requestPageMotion);
    pageMotion();
  })();

  /* 8. Preloader: one-pass three-language intro + dismissal ------- */

  (function () {
    var preloader = document.getElementById('preloader');
    var line = preloader && preloader.querySelector('.preloader__line');

    if (!preloader || !line) {
      return;
    }

    // English → Tamil → Hindi — shown exactly once each, then dismissed.
    var INTRO = [
      "Hi, I'm Balakrishnan.",
      "வணக்கம், நான் பாலகிருஷ்ணன்.",
      "नमस्ते, मैं बालकृष्णन हूँ।"
    ];
    var HOLD_MS     = 1200;  // ms each sentence is visible
    var FADE_MS     = 250;   // ms for the cross-fade (matches CSS transition)
    var HARD_CAP_MS = 7000;  // safety net — clears even if something stalls

    var stepTimer = null;
    var swapTimer = null;
    var capTimer  = null;
    var dismissed = false;
    var hideListeners = [];

    function stopIntro() {
      if (stepTimer !== null) { window.clearTimeout(stepTimer); stepTimer = null; }
      if (swapTimer !== null) { window.clearTimeout(swapTimer); swapTimer = null; }
    }

    function dismiss() {
      if (dismissed) { return; }
      dismissed = true;
      stopIntro();
      if (capTimer !== null) { window.clearTimeout(capTimer); capTimer = null; }

      preloader.classList.add('is-leaving');
      document.body.classList.remove('no-scroll');
      triggerHeroArrival();

      var hide = function () {
        preloader.hidden = true;
        hideListeners.forEach(function (fn) { fn(); });
      };

      if (prefersReducedMotion()) {
        hide();
      } else {
        window.setTimeout(hide, 500);   // matches the CSS exit transition
      }
    }

    // Hold the language at langIndex for HOLD_MS, then fade to the next
    // one (or call dismiss if this was the last).
    function runSequence(langIndex) {
      stepTimer = window.setTimeout(function () {
        stepTimer = null;

        var next = langIndex + 1;

        if (next >= INTRO.length) {
          // All three languages shown exactly once — auto-dismiss.
          dismiss();
          return;
        }

        // Fade out the current sentence.
        line.classList.add('is-out');

        swapTimer = window.setTimeout(function () {
          swapTimer = null;
          // Swap text while invisible, then animate the next one in.
          line.textContent = INTRO[next];
          line.classList.add('is-in');      // entry position: opacity 0, below
          line.classList.remove('is-out');  // remove exit class
          void line.offsetWidth;            // force reflow → entry anim starts
          line.classList.remove('is-in');   // trigger CSS fade-in

          runSequence(next);
        }, FADE_MS);
      }, HOLD_MS);
    }

    document.body.classList.add('no-scroll');

    // Kick off immediately — no load-event dependency.
    if (prefersReducedMotion()) {
      // Static English only; dismiss after a single hold.
      stepTimer = window.setTimeout(dismiss, HOLD_MS);
    } else {
      runSequence(0);   // English already in the DOM; start holding it
    }

    // Hard cap: dismiss unconditionally if the sequence stalls.
    capTimer = window.setTimeout(dismiss, HARD_CAP_MS);

    if (preloader.hidden) {
      triggerHeroArrival();
    }

    // Re-show for the Refresh Experience switch.
    function showAgain() {
      if (!dismissed || !preloader.hidden) {
        return false;   // never stack restarts
      }
      dismissed = false;
      stopIntro();
      line.textContent = INTRO[0];
      line.classList.remove('is-out', 'is-in');
      preloader.hidden = false;
      preloader.classList.remove('is-leaving');
      document.body.classList.add('no-scroll');

      if (prefersReducedMotion()) {
        stepTimer = window.setTimeout(dismiss, HOLD_MS);
      } else {
        runSequence(0);
      }
      return true;
    }

    preloaderBridge = {
      showAgain: showAgain,
      onHide: function (fn) { hideListeners.push(fn); }
    };
  })();

  /* 9. WhatsApp shortcut ------------------------------------------- */

  (function () {
    var fab = document.getElementById('whatsapp-fab');

    if (!fab) {
      return;
    }

    // The number ships empty: the button stays hidden until the
    // client drops their digits into data-number (one edit, no code).
    var number = (fab.getAttribute('data-number') || '').replace(/[^\d]/g, '');

    if (!number) {
      fab.remove();
      return;
    }

    fab.href = 'https://wa.me/' + number +
      '?text=' + encodeURIComponent(fab.getAttribute('data-invite') || 'hi balakrishnan');
  })();

  /* 10. Refresh Experience switch ---------------------------------- */

  (function () {
    var switchBtn = document.getElementById('refreshSwitch');

    if (!switchBtn || !preloaderBridge) {
      return;
    }

    var locked = false;
    var saved = [];   // [element, original text, had aria-label] while burst runs

    // Client v9.11: the pop phase lasts 3 s. Delays spread across the
    // window minus one char animation; the overlay rises near the end
    // so the handoff still catches letters mid-pop.
    var BURST_MS = 3000;
    var CHAR_MS = 700;
    var OVERLAY_AT = BURST_MS - 600;
    var RESTORE_AT = BURST_MS + 400;

    // Leaf text nodes in view: popping these reads as "the page
    // dissolves" without touching structure, links or layout.
    function visibleLeaves() {
      var vh = window.innerHeight;
      return Array.prototype.filter.call(
        document.querySelectorAll('main *, .footer *'),
        function (el) {
          if (el.children.length || !el.textContent.trim()) {
            return false;
          }
          if (el.closest('.preloader, .lightbox, .refresh-switch')) {
            return false;
          }
          var r = el.getBoundingClientRect();
          return r.bottom > 0 && r.top < vh && r.width > 0;
        }
      );
    }

    // Wrap each word (nowrap) in char spans with random delay, drift
    // and tilt; the keyframe pops them out and leaves them gone.
    function burst() {
      visibleLeaves().forEach(function (el) {
        var text = el.textContent;
        saved.push([el, text, el.hasAttribute('aria-label')]);
        el.setAttribute('aria-label', text);   // AT keeps the sentence

        var frag = document.createDocumentFragment();
        text.split(/(\s+)/).forEach(function (part) {
          if (!part) {
            return;
          }
          if (/^\s+$/.test(part)) {
            frag.appendChild(document.createTextNode(part));
            return;
          }
          var word = document.createElement('span');
          word.className = 'pop-word';
          word.setAttribute('aria-hidden', 'true');
          part.split('').forEach(function (ch) {
            var s = document.createElement('span');
            s.className = 'pop-ch';
            s.textContent = ch;
            s.style.setProperty('--d', Math.round(Math.random() * (BURST_MS - CHAR_MS)) + 'ms');
            s.style.setProperty('--tx', Math.round(Math.random() * 28 - 14) + 'px');
            s.style.setProperty('--ty', Math.round(Math.random() * 28 - 16) + 'px');
            s.style.setProperty('--rr', Math.round(Math.random() * 24 - 12) + 'deg');
            word.appendChild(s);
          });
          frag.appendChild(word);
        });

        el.textContent = '';
        el.appendChild(frag);
      });
    }

    function restoreText() {
      saved.forEach(function (entry) {
        entry[0].textContent = entry[1];
        if (!entry[2]) {
          entry[0].removeAttribute('aria-label');
        }
      });
      saved.length = 0;
    }

    // Everything back to the shipped initial state, behind the scenes.
    function finishReset() {
      window.scrollTo({ top: 0, behavior: 'instant' });
      restoreText();                       // safety net if timers raced
      if (resetAccordion) {
        resetAccordion();
      }
      if (closeViewer && !document.getElementById('lightbox').hidden) {
        closeViewer();
      }
      Array.prototype.forEach.call(document.querySelectorAll('.contact-actions a'), function (a) {
        a.style.transform = '';
      });
      Array.prototype.forEach.call(document.querySelectorAll('.skill-category li'), function (li) {
        li.style.removeProperty('--lift');
      });
      resetHooks.forEach(function (fn) { fn(); });   // replays entry motion
      window.dispatchEvent(new Event('scroll'));     // re-read scroll-linked vars
    }

    // Fires once per hidden; only acts while a refresh is in flight.
    preloaderBridge.onHide(function () {
      if (locked) {
        switchBtn.setAttribute('aria-checked', 'false');
        locked = false;
        triggerHeroArrival(true);            // Guarantee hero text arrives and is visible
      }
    });

    switchBtn.addEventListener('click', function () {
      if (locked) {
        return;                          // one restart at a time, always
      }
      locked = true;
      switchBtn.setAttribute('aria-checked', 'true');

      // Reduced motion: skip the burst, take the short path home.
      if (prefersReducedMotion()) {
        finishReset();
        preloaderBridge.showAgain(400);
        return;
      }

      burst();

      // Overlay rises while the last letters are mid-pop: connected.
      window.setTimeout(function () {
        preloaderBridge.showAgain();
      }, OVERLAY_AT);

      // By now the overlay is opaque: jump home and reset everything cleanly BEHIND the overlay!
      window.setTimeout(function () {
        finishReset();
      }, RESTORE_AT);
    });
  })();

  /* 11. Email options & safe webmail dispatch ---------------------- */

  (function () {
    var modal = document.getElementById('emailModal');
    var copyBtn = document.getElementById('emailCopyBtn');
    var addressEl = document.getElementById('emailCopyAddress');
    var toast = document.getElementById('toastFeedback');
    var defaultBtn = document.getElementById('openDefaultMailBtn');
    var toastTimer = null;
    var copyTimer = null;
    var emailAddress = (addressEl ? addressEl.textContent.trim() : 'balakrishnan.code@email.com');

    if (!modal) {
      return;
    }

    function showToast(msg) {
      if (!toast) return;
      if (toastTimer) clearTimeout(toastTimer);
      var msgEl = toast.querySelector('.toast-msg');
      if (msgEl && msg) msgEl.textContent = msg;
      toast.classList.add('show');
      toastTimer = setTimeout(function () {
        toast.classList.remove('show');
        toastTimer = null;
      }, 2400);
    }

    function handleCopiedUI() {
      showToast('Email copied: ' + emailAddress);
      if (copyBtn) {
        copyBtn.classList.add('copied');
        var textSpan = copyBtn.querySelector('.copy-text');
        if (textSpan) textSpan.textContent = 'Copied!';
        if (copyTimer) clearTimeout(copyTimer);
        copyTimer = setTimeout(function () {
          copyBtn.classList.remove('copied');
          if (textSpan) textSpan.textContent = 'Copy';
          copyTimer = null;
        }, 2000);
      }
    }

    function fallbackCopy() {
      try {
        var textarea = document.createElement('textarea');
        textarea.value = emailAddress;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      } catch (err) {
        // clipboard permission restricted in some environments
      }
      handleCopiedUI();
    }

    function copyEmail() {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(emailAddress).then(function () {
          handleCopiedUI();
        }).catch(function () {
          fallbackCopy();
        });
      } else {
        fallbackCopy();
      }
    }

    function openModal() {
      modal.hidden = false;
      document.body.classList.add('no-scroll');
      copyEmail();
    }

    function closeModal() {
      modal.hidden = true;
      document.body.classList.remove('no-scroll');
    }

    // Close on backdrop or close button
    Array.prototype.forEach.call(modal.querySelectorAll('[data-close-email]'), function (el) {
      el.addEventListener('click', closeModal);
    });

    // Close on Escape key
    window.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !modal.hidden) {
        closeModal();
      }
    });

    if (copyBtn) {
      copyBtn.addEventListener('click', function (e) {
        e.preventDefault();
        copyEmail();
      });
    }

    // Safe dispatch for native mail client (prevents 360 Extreme Browser from unloading tab to empty home page)
    if (defaultBtn) {
      defaultBtn.addEventListener('click', function (e) {
        e.preventDefault();
        var mailtoUrl = defaultBtn.getAttribute('href');
        var iframe = document.createElement('iframe');
        iframe.style.display = 'none';
        iframe.src = mailtoUrl;
        document.body.appendChild(iframe);
        setTimeout(function () { iframe.remove(); }, 2000);
        showToast('Opening default email app...');
      });
    }

    // Intercept all email links across the page so 360 Browser NEVER navigates away
    document.addEventListener('click', function (e) {
      var link = e.target.closest('a[href^="mailto:"]');
      if (link && !link.closest('#emailModal')) {
        e.preventDefault();
        openModal();
      }
    });

    // Register with resetHooks so closing modal is clean
    resetHooks.push(function () {
      if (!modal.hidden) {
        closeModal();
      }
    });
  })();
})();
