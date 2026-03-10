

(function () {
  'use strict';

  
  const stickyBar    = document.getElementById('stickyBar');
  const mainNavbar   = document.getElementById('mainNavbar');
  const carousel     = document.getElementById('carousel');
  const prevBtn      = document.getElementById('prevBtn');
  const nextBtn      = document.getElementById('nextBtn');
  const thumbsWrap   = document.getElementById('thumbs');
  const zoomLens     = document.getElementById('zoomLens');
  const zoomPreview  = document.getElementById('zoomPreview');
  const zoomCanvas   = document.getElementById('zoomCanvas');
  const hamburger    = document.getElementById('hamburger');
  const mobileMenu   = document.getElementById('mobileMenu');
  const productsBtn  = document.getElementById('productsBtn');
  const productsDD   = document.getElementById('productsDD');
  const contactBtn   = document.getElementById('contactBtn');
  const contactDD    = document.getElementById('contactDD');

  const slides = Array.from(document.querySelectorAll('.carousel__slide'));
  const thumbs = Array.from(document.querySelectorAll('.thumb'));

  
  const LENS_W      = 130;   
  const LENS_H      = 110;   
  const ZOOM_FACTOR = 2.5;   

  
  let currentIdx  = 0;
  let isZooming   = false;
  let touchStartX = 0;
  let touchStartY = 0;

  
  const imageSrcs = slides.map(s => s.querySelector('.carousel__img').src);


  
  (function initStickyHeader() {
    if (!stickyBar || !mainNavbar) return;

    function update() {
      const bottom = mainNavbar.getBoundingClientRect().bottom;
      if (bottom <= 0) {
        stickyBar.classList.add('is-visible');
        stickyBar.removeAttribute('aria-hidden');
      } else {
        stickyBar.classList.remove('is-visible');
        stickyBar.setAttribute('aria-hidden', 'true');
      }
    }

    window.addEventListener('scroll', update, { passive: true });
    update(); 
  })();


  

  
  function goTo(idx) {
    if (idx < 0)              idx = slides.length - 1;
    if (idx >= slides.length) idx = 0;

    
    slides[currentIdx].classList.remove('carousel__slide--active');
    if (thumbs[currentIdx]) {
      thumbs[currentIdx].classList.remove('thumb--active');
      thumbs[currentIdx].setAttribute('aria-selected', 'false');
    }

    currentIdx = idx;

    
    slides[currentIdx].classList.add('carousel__slide--active');
    if (thumbs[currentIdx]) {
      thumbs[currentIdx].classList.add('thumb--active');
      thumbs[currentIdx].setAttribute('aria-selected', 'true');
    }

    
    if (zoomCanvas) {
      zoomCanvas.style.backgroundImage = `url('${imageSrcs[currentIdx]}')`;
    }

    
    hideZoom();
  }

  
  if (prevBtn) prevBtn.addEventListener('click', e => { e.stopPropagation(); goTo(currentIdx - 1); });
  if (nextBtn) nextBtn.addEventListener('click', e => { e.stopPropagation(); goTo(currentIdx + 1); });

  
  thumbs.forEach(thumb => {
    thumb.addEventListener('click', () => {
      goTo(parseInt(thumb.dataset.idx, 10));
    });
  });

  
  if (carousel) {
    carousel.setAttribute('tabindex', '0');
    carousel.setAttribute('aria-label', 'Product image viewer. Arrow keys to navigate.');
    carousel.addEventListener('keydown', e => {
      if (e.key === 'ArrowLeft')  { e.preventDefault(); goTo(currentIdx - 1); }
      if (e.key === 'ArrowRight') { e.preventDefault(); goTo(currentIdx + 1); }
    });
  }

  
  if (carousel) {
    carousel.addEventListener('touchstart', e => {
      touchStartX = e.changedTouches[0].clientX;
      touchStartY = e.changedTouches[0].clientY;
    }, { passive: true });

    carousel.addEventListener('touchend', e => {
      const dx = e.changedTouches[0].clientX - touchStartX;
      const dy = e.changedTouches[0].clientY - touchStartY;
      
      if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 40) {
        dx < 0 ? goTo(currentIdx + 1) : goTo(currentIdx - 1);
      }
    }, { passive: true });
  }


  

  function zoomEnabled() {
    return window.innerWidth > 1100;
  }

  function showZoom() {
    if (!zoomEnabled()) return;
    zoomLens.style.display = 'block';
    zoomPreview.classList.add('is-visible');
    zoomCanvas.style.backgroundImage = `url('${imageSrcs[currentIdx]}')`;
    isZooming = true;
  }

  function hideZoom() {
    if (zoomLens)    zoomLens.style.display = 'none';
    if (zoomPreview) zoomPreview.classList.remove('is-visible');
    isZooming = false;
  }

  function onZoomMove(e) {
    if (!isZooming || !zoomEnabled()) return;

    const rect = carousel.getBoundingClientRect();

    
    const cx = e.clientX - rect.left;
    const cy = e.clientY - rect.top;

    
    let lensX = cx - LENS_W / 2;
    let lensY = cy - LENS_H / 2;
    lensX = Math.max(0, Math.min(lensX, rect.width  - LENS_W));
    lensY = Math.max(0, Math.min(lensY, rect.height - LENS_H));

    zoomLens.style.left = lensX + 'px';
    zoomLens.style.top  = lensY + 'px';

    
    const pvW = zoomPreview.offsetWidth;
    const pvH = zoomPreview.offsetHeight;

    
    const bgW = rect.width  * ZOOM_FACTOR;
    const bgH = rect.height * ZOOM_FACTOR;

    
    const lensCX = (lensX + LENS_W / 2) * ZOOM_FACTOR;
    const lensCY = (lensY + LENS_H / 2) * ZOOM_FACTOR;

    
    let bgX = pvW / 2 - lensCX;
    let bgY = pvH / 2 - lensCY;

    
    bgX = Math.min(0, Math.max(bgX, pvW  - bgW));
    bgY = Math.min(0, Math.max(bgY, pvH - bgH));

    zoomCanvas.style.backgroundSize     = `${bgW}px ${bgH}px`;
    zoomCanvas.style.backgroundPosition = `${bgX}px ${bgY}px`;
  }

  if (carousel) {
    carousel.addEventListener('mouseenter', showZoom);
    carousel.addEventListener('mouseleave', hideZoom);
    carousel.addEventListener('mousemove',  onZoomMove);
  }

  
  window.addEventListener('resize', () => {
    if (!zoomEnabled()) hideZoom();
  }, { passive: true });

  
  if (zoomCanvas) zoomCanvas.style.backgroundImage = `url('${imageSrcs[0]}')`;


  
  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      const open = hamburger.classList.toggle('is-open');
      hamburger.setAttribute('aria-expanded', String(open));
      mobileMenu.classList.toggle('is-open', open);
      mobileMenu.setAttribute('aria-hidden', String(!open));
    });

    
    document.addEventListener('click', e => {
      if (
        mobileMenu.classList.contains('is-open') &&
        !mainNavbar.contains(e.target)
      ) {
        hamburger.classList.remove('is-open');
        hamburger.setAttribute('aria-expanded', 'false');
        mobileMenu.classList.remove('is-open');
        mobileMenu.setAttribute('aria-hidden', 'true');
      }
    });
  }


  
  function setupDropdown(btn, dd) {
    if (!btn || !dd) return;

    btn.addEventListener('click', e => {
      e.stopPropagation();
      const open = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', String(!open));
      dd.setAttribute('aria-hidden', String(open));
    });

    
    dd.addEventListener('keydown', e => {
      if (e.key === 'Escape') {
        btn.setAttribute('aria-expanded', 'false');
        dd.setAttribute('aria-hidden', 'true');
        btn.focus();
      }
    });

    
    document.addEventListener('click', e => {
      if (!btn.closest('.nav-dd-wrap').contains(e.target)) {
        btn.setAttribute('aria-expanded', 'false');
        dd.setAttribute('aria-hidden', 'true');
      }
    });
  }

  setupDropdown(productsBtn, productsDD);
  setupDropdown(contactBtn,  contactDD);


  
  goTo(0);

})();


(function () {
  const items = document.querySelectorAll('.faq__item');
  if (!items.length) return;

  items.forEach(function (item) {
    item.addEventListener('click', function () {
      const isOpen = item.classList.contains('faq__item--open');
      const chevron = item.querySelector('.faq__chevron');

      // Close all
      items.forEach(function (el) {
        el.classList.remove('faq__item--open');
        const ch = el.querySelector('.faq__chevron');
        if (ch) {
          ch.classList.remove('faq__chevron--open');
          // restore closed chevron stroke color
          const path = ch.querySelector('path');
          if (path) path.setAttribute('stroke', '#535A61');
        }
      });

      // Open clicked if it was closed
      if (!isOpen) {
        item.classList.add('faq__item--open');
        if (chevron) {
          chevron.classList.add('faq__chevron--open');
          // open chevron stroke = #2B3990
          const path = chevron.querySelector('path');
          if (path) path.setAttribute('stroke', '#2B3990');
        }
      }
    });
  });

  // Keyboard accessibility
  items.forEach(function (item) {
    item.setAttribute('tabindex', '0');
    item.setAttribute('role', 'button');
    item.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        item.click();
      }
    });
  });
})();


(function () {
  var track   = document.getElementById('indTrack');
  var btnPrev = document.getElementById('indPrev');
  var btnNext = document.getElementById('indNext');
  if (!track || !btnPrev || !btnNext) return;

  var CARD_W   = 420;   
  var GAP      = 16;    
  var VISIBLE  = 3;     
  var TOTAL    = track.querySelectorAll('.ind-card').length;  
  var MAX_IDX  = TOTAL - VISIBLE;  
  var currentIdx = 0;

  function updateCarousel() {
    var offset = currentIdx * (CARD_W + GAP);
    track.style.transform = 'translateX(-' + offset + 'px)';
    btnPrev.disabled = (currentIdx === 0);
    btnNext.disabled = (currentIdx >= MAX_IDX);
  }

  btnPrev.addEventListener('click', function () {
    if (currentIdx > 0) {
      currentIdx -= 1;
      updateCarousel();
    }
  });

  btnNext.addEventListener('click', function () {
    if (currentIdx < MAX_IDX) {
      currentIdx += 1;
      updateCarousel();
    }
  });

  
  var touchStartX = 0;
  track.addEventListener('touchstart', function (e) {
    touchStartX = e.changedTouches[0].clientX;
  }, { passive: true });
  track.addEventListener('touchend', function (e) {
    var dx = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(dx) > 40) {
      if (dx < 0 && currentIdx < MAX_IDX) { currentIdx += 1; updateCarousel(); }
      if (dx > 0 && currentIdx > 0)       { currentIdx -= 1; updateCarousel(); }
    }
  }, { passive: true });

  
  updateCarousel();
})();
document.querySelector(".primary-btn").onclick = function(){

alert("Our expert will contact you soon!");

};


(function () {
  var tabs   = document.querySelectorAll('.mfg__tab');
  var panels = document.querySelectorAll('.mfg__panel');
  if (!tabs.length || !panels.length) return;

  function activateTab(targetTab) {
    var targetId = 'panel-' + targetTab.dataset.tab;

    
    tabs.forEach(function (t) {
      var isActive = (t === targetTab);
      t.classList.toggle('mfg__tab--active', isActive);
      t.setAttribute('aria-selected', isActive ? 'true' : 'false');
    });

    
    panels.forEach(function (p) {
      var isTarget = (p.id === targetId);
      if (isTarget) {
        p.removeAttribute('hidden');
        p.classList.add('mfg__panel--active');
      } else {
        p.setAttribute('hidden', '');
        p.classList.remove('mfg__panel--active');
      }
    });
  }

  tabs.forEach(function (tab) {
    tab.addEventListener('click', function () { activateTab(tab); });
    
    tab.addEventListener('keydown', function (e) {
      var idx = Array.from(tabs).indexOf(tab);
      if (e.key === 'ArrowRight' && idx < tabs.length - 1) {
        tabs[idx + 1].focus(); activateTab(tabs[idx + 1]);
      }
      if (e.key === 'ArrowLeft' && idx > 0) {
        tabs[idx - 1].focus(); activateTab(tabs[idx - 1]);
      }
    });
  });

  
  document.querySelectorAll('.mfg__panel-img').forEach(function (imgDiv) {
    var imgs = [
      'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=1200&q=80',
      'https://images.unsplash.com/photo-1581091226033-d5c48150dbaa?w=1200&q=80',
      'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=1200&q=80'
    ];
    var cur = 0;

    var btnL = imgDiv.querySelector('.mfg__img-arrow--left');
    var btnR = imgDiv.querySelector('.mfg__img-arrow--right');

    function setImg(idx) {
      cur = (idx + imgs.length) % imgs.length;
      imgDiv.style.backgroundImage = "url('" + imgs[cur] + "')";
    }

    if (btnL) btnL.addEventListener('click', function (e) { e.stopPropagation(); setImg(cur - 1); });
    if (btnR) btnR.addEventListener('click', function (e) { e.stopPropagation(); setImg(cur + 1); });
  });
})();

