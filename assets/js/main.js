/* معرض الفردوس — حركات الظهور وتفاعل الهيدر */

(function () {
  var header = document.querySelector('.site-header');
  function syncHeaderState() {
    if (!header) return;
    header.classList.toggle('is-scrolled', window.scrollY > 24);
  }
  syncHeaderState();
  window.addEventListener('scroll', syncHeaderState, { passive: true });

  var reveals = Array.prototype.slice.call(document.querySelectorAll('.reveal'));
  if (reveals.length === 0) return;

  if (!('IntersectionObserver' in window) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    reveals.forEach(function (el) { el.classList.add('is-visible'); });
    return;
  }

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });

  reveals.forEach(function (el) {
    var rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.92) {
      el.classList.add('is-visible');
    } else {
      observer.observe(el);
    }
  });
})();
