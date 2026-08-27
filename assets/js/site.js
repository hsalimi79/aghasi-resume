(function(){
  // scroll rail
  var railFill = document.getElementById('railFill');
  var heroPhoto = document.getElementById('heroPhoto');
  function onScroll(){
    var h = document.documentElement;
    var pct = (h.scrollTop) / (h.scrollHeight - h.clientHeight) * 100;
    if(railFill) railFill.style.height = Math.min(100,Math.max(0,pct)) + '%';
    if(heroPhoto){
      var y = Math.min(window.scrollY, 900);
      heroPhoto.style.transform = 'translateY(' + (y * 0.18) + 'px) scale(1.06)';
    }
  }
  document.addEventListener('scroll', onScroll, {passive:true});
  onScroll();

  // mobile nav toggle
  var navToggle = document.getElementById('navToggle');
  var navLinks = document.getElementById('navLinks');
  if(navToggle && navLinks){
    navToggle.addEventListener('click', function(){
      var open = navLinks.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    navLinks.querySelectorAll('a').forEach(function(a){
      a.addEventListener('click', function(){ navLinks.classList.remove('open'); navToggle.setAttribute('aria-expanded','false'); });
    });
  }

  // animated count-up for stat numbers
  var countEls = document.querySelectorAll('.np-value, .client-stat-value');
  function animateCount(el){
    var text = el.textContent.trim();
    var match = text.match(/^(\d+)/);
    if(!match) return;
    var target = parseInt(match[1], 10);
    var suffix = text.slice(match[1].length);
    var duration = 1100;
    var startTime = null;
    function step(ts){
      if(!startTime) startTime = ts;
      var progress = Math.min((ts - startTime) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(eased * target) + suffix;
      if(progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  try{
    if('IntersectionObserver' in window && countEls.length){
      var countIo = new IntersectionObserver(function(entries){
        entries.forEach(function(e){ if(e.isIntersecting){ animateCount(e.target); countIo.unobserve(e.target); } });
      }, {threshold:0.4});
      countEls.forEach(function(el){ countIo.observe(el); });
    }
  } catch(err){}

  // reveal on scroll
  var reveals = document.querySelectorAll('.reveal');
  try{
    if('IntersectionObserver' in window){
      var io = new IntersectionObserver(function(entries){
        entries.forEach(function(e){ if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); } });
      }, {threshold:0.12});
      reveals.forEach(function(r){ io.observe(r); });
    } else {
      reveals.forEach(function(r){ r.classList.add('in'); });
    }
  } catch(err){
    reveals.forEach(function(r){ r.classList.add('in'); });
  }
  // safety net: never leave content permanently invisible
  setTimeout(function(){ reveals.forEach(function(r){ r.classList.add('in'); }); }, 1800);

  // gallery filter
  var buttons = document.querySelectorAll('.filter-btn');
  var items = document.querySelectorAll('.g-item');
  buttons.forEach(function(btn){
    btn.addEventListener('click', function(){
      buttons.forEach(function(b){ b.classList.remove('active'); });
      btn.classList.add('active');
      var f = btn.getAttribute('data-filter');
      items.forEach(function(it){
        var show = (f === 'all') || (it.getAttribute('data-cat') === f);
        it.style.display = show ? '' : 'none';
      });
    });
  });

  // lightbox (only wired up on pages that actually include it, e.g. gallery.html)
  var lb = document.getElementById('lightbox');
  var lbImg = document.getElementById('lbImg');
  var lbCap = document.getElementById('lbCap');
  if(lb && lbImg && lbCap){
    var visibleItems = function(){ return Array.prototype.filter.call(items, function(it){ return it.style.display !== 'none'; }); };
    var currentIndex = 0;
    function openAt(el){
      var arr = visibleItems();
      currentIndex = arr.indexOf(el);
      show(arr);
    }
    function show(arr){
      var el = arr[currentIndex];
      if(!el) return;
      var img = el.querySelector('img');
      lbImg.src = img.src;
      lbImg.alt = img.alt;
      lbCap.textContent = img.alt;
      lb.classList.add('open');
    }
    items.forEach(function(it){
      it.addEventListener('click', function(e){ e.preventDefault(); openAt(it); });
    });
    var lbCloseBtn = document.getElementById('lbClose');
    var lbPrevBtn = document.getElementById('lbPrev');
    var lbNextBtn = document.getElementById('lbNext');
    if(lbCloseBtn) lbCloseBtn.addEventListener('click', function(){ lb.classList.remove('open'); });
    lb.addEventListener('click', function(e){ if(e.target === lb){ lb.classList.remove('open'); } });
    if(lbPrevBtn) lbPrevBtn.addEventListener('click', function(){ var arr = visibleItems(); currentIndex = (currentIndex - 1 + arr.length) % arr.length; show(arr); });
    if(lbNextBtn) lbNextBtn.addEventListener('click', function(){ var arr = visibleItems(); currentIndex = (currentIndex + 1) % arr.length; show(arr); });
    document.addEventListener('keydown', function(e){
      if(!lb.classList.contains('open')) return;
      if(e.key === 'Escape') lb.classList.remove('open');
      if(e.key === 'ArrowLeft'){ var arr=visibleItems(); currentIndex=(currentIndex+1)%arr.length; show(arr); }
      if(e.key === 'ArrowRight'){ var arr=visibleItems(); currentIndex=(currentIndex-1+arr.length)%arr.length; show(arr); }
    });
  }
})();
