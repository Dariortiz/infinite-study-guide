/* Motion shared by generated and copied pages: element-only page entry/exit, the typed header path, theme
   crossfade, sticky top-bar state, below-the-fold settling, and course-map tracking. */
(function(){
  var root=document.documentElement, reduce=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)');
  /* Theme toggles on the copied guides originally swapped every colour in one frame. Handle the button
     in capture phase for every page, preserving the shared preference while crossfading old and new. */
  document.addEventListener('click',function(e){
    var button=e.target&&e.target.closest?e.target.closest('#theme'):null;
    if(!button)return;
    e.preventDefault();
    e.stopImmediatePropagation();
    var next=root.getAttribute('data-theme')==='light'?'dark':'light';
    var update=function(){
      root.setAttribute('data-theme',next);
      try{localStorage.setItem('mooc-theme',next)}catch(ignore){}
      document.querySelectorAll('a[href]').forEach(function(a){
        var raw=a.getAttribute('href');
        if(!raw||/^(https?:|mailto:|javascript:|data:|#)/i.test(raw))return;
        var m=raw.match(/^([^?#]+\.html)(\?[^#]*)?(#.*)?$/i);
        if(!m)return;
        var params=new URLSearchParams((m[2]||'').replace(/^\?/,''));
        params.set('theme',next);
        a.setAttribute('href',m[1]+'?'+params.toString()+(m[3]||''));
      });
    };
    if(!(reduce&&reduce.matches)&&document.startViewTransition)document.startViewTransition(update);
    else update();
    if(!(reduce&&reduce.matches)){
      button.classList.remove('theme-flip');
      void button.offsetWidth;
      button.classList.add('theme-flip');
      setTimeout(function(){button.classList.remove('theme-flip')},450);
    }
  },true);
  /* Internal page links get a short element fade before navigation. No overlay or background colour is
     involved. Modified clicks, downloads, anchors, and external links retain their native behaviour. */
  var leaving=false;
  document.addEventListener('click',function(e){
    if(leaving||e.defaultPrevented||e.button||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey)return;
    var link=e.target&&e.target.closest?e.target.closest('a[href]'):null;
    if(!link||link.hasAttribute('download')||(link.target&&link.target!=='_self'))return;
    var raw=link.getAttribute('href');
    if(!raw||/^(https?:|mailto:|javascript:|data:|#)/i.test(raw))return;
    var target;
    try{target=new URL(link.href)}catch(ignore){return}
    if(!/\.html$/i.test(target.pathname)||target.pathname===location.pathname)return;
    if(reduce&&reduce.matches)return;
    e.preventDefault();
    leaving=true;
    document.body.classList.add('is-leaving');
    setTimeout(function(){location.href=target.href},125);
  });
  function visible(el){
    var box=el.getBoundingClientRect();
    return box.bottom>-10&&box.top<innerHeight*1.06;
  }
  /* Reading order, not document order: elements are banded by their top edge so one row is ordered left to
     right and rows run top to bottom. Document order agrees on most pages, but a grid is free to place its
     items in another sequence, and reading order is the one the eye follows. */
  function byReadingOrder(els){
    var rows=[];
    els.forEach(function(el){
      var box=el.getBoundingClientRect(), row=null;
      for(var i=0;i<rows.length;i++)if(Math.abs(rows[i].top-box.top)<26){row=rows[i];break}
      if(!row){row={top:box.top,items:[]};rows.push(row)}
      row.items.push({el:el,left:box.left});
    });
    rows.sort(function(a,b){return a.top-b.top});
    var ordered=[];
    rows.forEach(function(row,depth){
      row.items.sort(function(a,b){return a.left-b.left});
      /* Every row takes about as long to cross regardless of how many pieces it holds, so a row of eleven
         navigation pills cannot still be arriving after the cards below it have landed. */
      var step=row.items.length>1?Math.min(26,150/(row.items.length-1)):0;
      row.items.forEach(function(item,across){
        ordered.push({el:item.el,row:depth,col:across,offset:Math.round(across*step)});
      });
    });
    return ordered;
  }
  function typePath(){
    var brand=document.querySelector('.brand');
    if(!brand||reduce&&reduce.matches)return;
    var source=document.createElement('span');
    source.className='brand-source';
    while(brand.firstChild)source.appendChild(brand.firstChild);
    brand.appendChild(source);
    var strong=source.querySelector('b');
    var full=source.textContent||'', tail=strong?strong.textContent:'';
    var cut=tail?full.lastIndexOf(tail):full.length;
    var typed=document.createElement('span'), lead=document.createTextNode('');
    var accent=document.createElement('b');
    typed.className='typed-path is-active';
    typed.setAttribute('aria-hidden','true');
    typed.appendChild(lead);typed.appendChild(accent);brand.appendChild(typed);
    brand.classList.add('is-typing');
    var index=0;
    function add(){
      index++;
      lead.nodeValue=full.slice(0,Math.min(index,cut));
      accent.textContent=index>cut?full.slice(cut,index):'';
      if(index<full.length)setTimeout(add,45);
      else setTimeout(function(){typed.classList.remove('is-active')},520);
    }
    setTimeout(add,45);
  }
  function enterPage(){
    if(reduce&&reduce.matches){root.classList.remove('motion-pending');return}
    var lineSelector='.hero .kicker,.hero h1,.hero .manifesto,.hero .lede,section>h2,section>.section-intro,.layout>.side,.layout>nav,footer';
    var popSelector='.backlink,.icon-btn,.search,.wrap>.crumbs:first-child>*,.wrap>.series:first-child>*,.formula,.metric,.toolbar,.controls,.card,.lesson';
    var lines=[].filter.call(document.querySelectorAll(lineSelector),visible);
    var pops=[].filter.call(document.querySelectorAll(popSelector),visible);
    lines.forEach(function(el,i){
      el.classList.add('motion-line');
      el.style.setProperty('--motion-delay',(35+i*28)+'ms');
    });
    /* A row of surfaces ripples across before the row under it starts, and the whole sequence is capped so a
       dense page still finishes promptly. */
    byReadingOrder(pops).forEach(function(item){
      item.el.classList.add('motion-pop');
      item.el.style.setProperty('--motion-delay',Math.min(15+item.row*54+item.offset,560)+'ms');
    });
    typePath();
    requestAnimationFrame(function(){
      root.classList.add('motion-in');
      root.classList.remove('motion-pending');
    });
    /* Long enough for the last surface in the sequence: the delay cap plus the animation itself. */
    setTimeout(function(){
      root.classList.remove('motion-in');
      lines.concat(pops).forEach(function(el){
        el.classList.remove('motion-line','motion-pop');
        el.style.removeProperty('--motion-delay');
      });
    },1050);
  }
  /* The sticky top bar lifts off the page only once something has scrolled under it. */
  var bar;
  function markScrolled(){
    if(bar===undefined)bar=document.querySelector('.topbar');
    if(bar)bar.classList.toggle('is-scrolled',(window.pageYOffset||root.scrollTop||0)>6);
  }
  /* A slim fill on the topbar's top edge reads how far down the page you are. One injected element
     covers every template, so no page needs its own markup for it. */
  var progressFill;
  function initScrollProgress(){
    var bar=document.createElement('div');
    bar.className='scroll-progress';
    bar.setAttribute('aria-hidden','true');
    progressFill=document.createElement('span');
    bar.appendChild(progressFill);
    document.body.insertBefore(bar,document.body.firstChild);
  }
  function updateScrollProgress(){
    if(!progressFill)return;
    var max=root.scrollHeight-innerHeight;
    var ratio=max>0?Math.min(1,Math.max(0,(window.pageYOffset||root.scrollTop||0)/max)):0;
    progressFill.style.transform='scaleX('+ratio+')';
  }
  /* A quiet way back up on the pages long enough to need it. Injected rather than templated, like the
     progress bar above, and reuses .icon-btn so it matches the theme toggle without new styling. */
  var backTop;
  function initBackToTop(){
    backTop=document.createElement('button');
    backTop.type='button';
    backTop.className='icon-btn back-to-top';
    backTop.setAttribute('aria-label','Back to top');
    backTop.title='Back to top';
    backTop.textContent='↑';
    backTop.addEventListener('click',function(){
      scrollTo({top:0,behavior:(reduce&&reduce.matches)?'auto':'smooth'});
    });
    document.body.appendChild(backTop);
  }
  function updateBackToTop(){
    if(!backTop)return;
    backTop.classList.toggle('is-visible',(window.pageYOffset||root.scrollTop||0)>innerHeight*.9);
  }
  function onScroll(){markScrolled();updateScrollProgress();updateBackToTop()}
  addEventListener('scroll',onScroll,{passive:true});
  addEventListener('resize',updateScrollProgress,{passive:true});
  /* Cards and lessons that start below the first screen settle in as they are reached, once each. They are
     only hidden after this script runs, so the page stays fully readable without scripting. */
  function settleOnApproach(){
    if((reduce&&reduce.matches)||!('IntersectionObserver' in window))return;
    var waiting=[].filter.call(document.querySelectorAll('.card,.lesson'),function(el){
      return el.getBoundingClientRect().top>innerHeight*1.05;
    });
    if(!waiting.length)return;
    waiting.forEach(function(el){el.classList.add('settle')});
    var watcher=new IntersectionObserver(function(entries){
      var arriving=[];
      entries.forEach(function(entry){
        if(!entry.isIntersecting)return;
        watcher.unobserve(entry.target);
        arriving.push(entry.target);
      });
      if(!arriving.length)return;
      /* Left to right within the row that came into view, and staggered within one batch only, so a fast
         scroll never queues a long cascade. */
      byReadingOrder(arriving).forEach(function(item,i){
        var el=item.el;
        setTimeout(function(){
          el.classList.add('is-in');
          setTimeout(function(){el.classList.remove('settle','is-in')},420);
        },Math.min(i,3)*40);
      });
    },{rootMargin:'0px 0px -6% 0px',threshold:.08});
    waiting.forEach(function(el){watcher.observe(el)});
  }
  /* On a long guide the course map follows the module on screen rather than staying inert. The copied
     crypto pages label their on-page nav instead of classing it, so both shapes are matched. */
  function followCourseMap(){
    if(!('IntersectionObserver' in window))return;
    var links=document.querySelectorAll('.side a[href^="#"],nav[aria-label="On this page"] a[href^="#"]');
    if(!links.length)return;
    var byId={}, current=null;
    Array.prototype.forEach.call(links,function(link){
      var id=link.getAttribute('href').slice(1);
      if(id&&!byId[id])byId[id]=link;
    });
    var spy=new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        var link=entry.isIntersecting&&byId[entry.target.id];
        if(!link||link===current)return;
        if(current)current.classList.remove('is-current');
        link.classList.add('is-current');
        current=link;
        /* The link's own list scrolls independently of the page (.side has its own overflow), so the
           highlighted entry can otherwise drift out of view while the reader keeps scrolling the guide. */
        if(!(reduce&&reduce.matches)&&link.scrollIntoView)link.scrollIntoView({block:'nearest',behavior:'smooth'});
      });
    },{rootMargin:'-90px 0px -68% 0px'});
    Object.keys(byId).forEach(function(id){
      var target=document.getElementById(id);
      if(target)spy.observe(target);
    });
  }
  /* Jumping via the course map lands the reader on a new heading with no cue beyond the scroll itself.
     A brief wash on arrival marks the spot, timed to the actual scroll rather than a guessed duration
     where the browser supports it. */
  function flashOnArrival(){
    var links=document.querySelectorAll('.side a[href^="#"],nav[aria-label="On this page"] a[href^="#"]');
    if(!links.length)return;
    document.addEventListener('click',function(e){
      if(reduce&&reduce.matches)return;
      var link=e.target&&e.target.closest?e.target.closest('.side a[href^="#"],nav[aria-label="On this page"] a[href^="#"]'):null;
      if(!link)return;
      var target=document.getElementById(link.getAttribute('href').slice(1));
      if(!target)return;
      var head=target.querySelector('.module-head,h2')||target;
      var fired=false;
      function fire(){
        if(fired)return;
        fired=true;
        removeEventListener('scrollend',fire);
        head.classList.remove('target-flash');
        void head.offsetWidth;
        head.classList.add('target-flash');
        setTimeout(function(){head.classList.remove('target-flash')},900);
      }
      if('onscrollend' in window)addEventListener('scrollend',fire,{once:true});
      setTimeout(fire,600);
    });
  }
  document.addEventListener('DOMContentLoaded',function(){
    initScrollProgress();initBackToTop();markScrolled();updateScrollProgress();updateBackToTop();
    settleOnApproach();enterPage();followCourseMap();flashOnArrival();
  });
  /* A back/forward-cache restore can retain the outgoing class from the moment this page was left. */
  window.addEventListener('pageshow',function(event){
    if(!event.persisted)return;
    leaving=false;
    document.body.classList.remove('is-leaving');
    updateScrollProgress();
    updateBackToTop();
  });
})();
