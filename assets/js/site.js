/* معرض الفردوس للرخام والجرانيت — كود مشترك لكل الصفحات */

/* فيديوهات يوتيوب — حط لينك الفيديو كامل بين علامتين تنصيص في القايمة دي،
   مثال: "https://www.youtube.com/watch?v=XXXXXXXXXXX" */
var YOUTUBE_VIDEOS = [
  // "https://www.youtube.com/watch?v=XXXXXXXXXXX",
];

function extractYoutubeId(url) {
  var match = String(url).match(/(?:v=|youtu\.be\/|embed\/|shorts\/)([A-Za-z0-9_-]{6,})/);
  return match ? match[1] : null;
}

/* 1) عرض فيديوهات يوتيوب تلقائياً عند إضافتها */
(function initVideos() {
  var box = document.getElementById('videosBox');
  var fallback = document.getElementById('videosFallback');
  if (!box) return;

  var validIds = YOUTUBE_VIDEOS.map(extractYoutubeId).filter(Boolean);
  if (validIds.length === 0) {
    box.style.display = 'none';
    if (fallback) fallback.style.display = '';
    return;
  }

  if (fallback) fallback.style.display = 'none';
  box.style.display = '';
  validIds.forEach(function (id) {
    var col = document.createElement('div');
    col.className = 'col-md-6';
    col.innerHTML =
      '<div class="video-embed-card"><div class="ratio-box">' +
      '<iframe src="https://www.youtube.com/embed/' + id + '" ' +
      'title="فيديو من أعمال معرض الفردوس للرخام والجرانيت" ' +
      'allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" ' +
      'allowfullscreen loading="lazy"></iframe></div></div>';
    box.appendChild(col);
  });
})();

/* 2) فورم التواصل -> رسالة منظمة على واتساب */
(function initContactForm() {
  var form = document.getElementById('contactForm');
  if (!form) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var fullName = (document.getElementById('fName')?.value || '').trim();
    var phone = (document.getElementById('fPhone')?.value || '').trim();
    var service = (document.getElementById('fService')?.value || '').trim();
    var material = (document.getElementById('fMaterial')?.value || '').trim();
    var msg = (document.getElementById('fMsg')?.value || '').trim();

    var lines = [
      'السلام عليكم معرض الفردوس،',
      'الاسم: ' + fullName,
      'الموبايل: ' + phone,
    ];
    if (service) lines.push('نوع الشغل المطلوب: ' + service);
    if (material) lines.push('الخامة المفضلة: ' + material);
    if (msg) lines.push('التفاصيل والمقاسات:\n' + msg);

    var waUrl = 'https://wa.me/201121466648?text=' + encodeURIComponent(lines.join('\n'));
    window.open(waUrl, '_blank', 'noopener');
  });
})();

/* 3) فلترة معرض الأعمال + دعم ?cat= في الرابط */
(function initGalleryFilter() {
  var filterBar = document.querySelector('.filter-bar');
  var items = Array.prototype.slice.call(document.querySelectorAll('.gallery-item[data-category]'));
  if (!filterBar || items.length === 0) return;

  var buttons = Array.prototype.slice.call(filterBar.querySelectorAll('.filter-btn'));

  function applyFilter(cat) {
    buttons.forEach(function (btn) {
      var active = btn.getAttribute('data-filter') === cat;
      btn.classList.toggle('active', active);
      btn.setAttribute('aria-pressed', active ? 'true' : 'false');
    });

    items.forEach(function (card) {
      var cardCat = card.getAttribute('data-category');
      var show = cat === 'all' || cardCat === cat;
      card.classList.toggle('is-hidden', !show);
      if (show) {
        card.classList.remove('is-shown');
        void card.offsetWidth;
        card.classList.add('is-shown');
      } else {
        card.classList.remove('is-shown');
      }
    });
  }

  filterBar.addEventListener('click', function (e) {
    var btn = e.target.closest('.filter-btn');
    if (!btn) return;
    applyFilter(btn.getAttribute('data-filter') || 'all');
  });

  var params = new URLSearchParams(window.location.search);
  var initialCat = params.get('cat');
  if (initialCat && filterBar.querySelector('[data-filter="' + initialCat + '"]')) {
    applyFilter(initialCat);
  }
})();

/* 4) لايت بوكس احترافي لعرض الصور بدون أي مكتبات قديمة */
(function initStoneLightbox() {
  var triggers = Array.prototype.slice.call(document.querySelectorAll('a[data-gallery-item]'));
  if (triggers.length === 0) return;

  var modal = document.createElement('div');
  modal.className = 'stone-lightbox';
  modal.setAttribute('role', 'dialog');
  modal.setAttribute('aria-modal', 'true');
  modal.setAttribute('aria-label', 'معاينة الصورة');
  modal.innerHTML =
    '<div class="lb-dialog">' +
      '<div class="lb-top">' +
        '<span class="lb-counter" id="lbCounter">1 / 1</span>' +
        '<button type="button" class="lb-close" id="lbClose" aria-label="إغلاق"><i class="fa-solid fa-xmark"></i></button>' +
      '</div>' +
      '<div class="lb-stage">' +
        '<img id="lbImage" src="" alt="">' +
        '<button type="button" class="lb-nav-btn lb-prev" id="lbPrev" aria-label="السابق"><i class="fa-solid fa-chevron-right"></i></button>' +
        '<button type="button" class="lb-nav-btn lb-next" id="lbNext" aria-label="التالي"><i class="fa-solid fa-chevron-left"></i></button>' +
      '</div>' +
      '<div class="lb-bottom">' +
        '<span class="lb-caption" id="lbCaption"></span>' +
        '<a class="btn btn-wa btn-sm" id="lbWaBtn" href="#" target="_blank" rel="noopener">' +
          '<i class="fa-brands fa-whatsapp"></i> استفسر عن شغل مماثل' +
        '</a>' +
      '</div>' +
    '</div>';
  document.body.appendChild(modal);

  var lbImg = modal.querySelector('#lbImage');
  var lbCap = modal.querySelector('#lbCaption');
  var lbCnt = modal.querySelector('#lbCounter');
  var lbWa = modal.querySelector('#lbWaBtn');
  var lbClose = modal.querySelector('#lbClose');
  var lbPrev = modal.querySelector('#lbPrev');
  var lbNext = modal.querySelector('#lbNext');

  var currentList = [];
  var currentIndex = 0;

  function visibleTriggers() {
    return triggers.filter(function (el) {
      return !el.classList.contains('is-hidden');
    });
  }

  function renderSlide(idx) {
    if (currentList.length === 0) return;
    currentIndex = (idx + currentList.length) % currentList.length;
    var el = currentList[currentIndex];
    var src = el.getAttribute('href');
    var title = el.getAttribute('data-title') || el.querySelector('img')?.alt || 'من أعمال معرض الفردوس';

    lbImg.src = src;
    lbImg.alt = title;
    lbCap.textContent = title;
    lbCnt.textContent = (currentIndex + 1) + ' / ' + currentList.length;

    var waText = 'السلام عليكم معرض الفردوس، أعجبني هذا العمل (' + title + ') وعايز استفسر عن التفاصيل والسعر.';
    lbWa.href = 'https://wa.me/201121466648?text=' + encodeURIComponent(waText);

    var showArrows = currentList.length > 1;
    lbPrev.style.display = showArrows ? '' : 'none';
    lbNext.style.display = showArrows ? '' : 'none';
  }

  function openModal(clickedEl) {
    currentList = visibleTriggers();
    var idx = currentList.indexOf(clickedEl);
    if (idx === -1) {
      currentList = triggers;
      idx = Math.max(0, currentList.indexOf(clickedEl));
    }
    renderSlide(idx);
    modal.classList.add('is-open');
    document.body.style.overflow = 'hidden';
    lbClose.focus();
  }

  function closeModal() {
    modal.classList.remove('is-open');
    document.body.style.overflow = '';
  }

  triggers.forEach(function (el) {
    el.addEventListener('click', function (e) {
      e.preventDefault();
      openModal(el);
    });
  });

  lbClose.addEventListener('click', closeModal);
  lbPrev.addEventListener('click', function () { renderSlide(currentIndex - 1); });
  lbNext.addEventListener('click', function () { renderSlide(currentIndex + 1); });

  modal.addEventListener('click', function (e) {
    if (e.target === modal) closeModal();
  });

  document.addEventListener('keydown', function (e) {
    if (!modal.classList.contains('is-open')) return;
    if (e.key === 'Escape') closeModal();
    if (e.key === 'ArrowRight') renderSlide(currentIndex - 1);
    if (e.key === 'ArrowLeft') renderSlide(currentIndex + 1);
  });

  var touchStartX = 0;
  modal.addEventListener('touchstart', function (e) {
    touchStartX = e.changedTouches[0]?.screenX || 0;
  }, { passive: true });
  modal.addEventListener('touchend', function (e) {
    var diff = (e.changedTouches[0]?.screenX || 0) - touchStartX;
    if (Math.abs(diff) > 45) {
      renderSlide(diff > 0 ? currentIndex - 1 : currentIndex + 1);
    }
  }, { passive: true });
})();
