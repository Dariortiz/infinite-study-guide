(function(){
  const K='mooc-theme', root=document.documentElement;
  function read(){try{const q=new URLSearchParams(location.search).get('theme');if(q==='light'||q==='dark')return q;const t=localStorage.getItem(K);if(t==='light'||t==='dark')return t}catch(e){}return matchMedia('(prefers-color-scheme:light)').matches?'light':'dark'}
  const reduce=matchMedia('(prefers-reduced-motion:reduce)');
  function apply(t,animate=false){
    const update=()=>{root.dataset.theme=t;try{localStorage.setItem(K,t)}catch(e){}};
    if(animate&&!reduce.matches&&document.startViewTransition){document.startViewTransition(update);return}
    update();
  }
  apply(read());
  document.addEventListener('DOMContentLoaded',()=>{
    const theme=document.getElementById('theme');if(theme)theme.addEventListener('click',()=>apply(root.dataset.theme==='light'?'dark':'light',true));
    const search=document.getElementById('search'), cards=[...document.querySelectorAll('[data-search]')], empty=document.getElementById('no-results');
    const lessons=[...document.querySelectorAll('.lesson')];
    if(search&&!lessons.length)search.addEventListener('input',()=>{const q=search.value.trim().toLowerCase();let n=0;cards.forEach(c=>{const show=!q||c.textContent.toLowerCase().includes(q);c.classList.toggle('hidden',!show);if(show)n++});if(empty)empty.style.display=n?'none':'block'});
    if(lessons.length){
      const brand=document.querySelector('.brand');
      const guide=((document.body.dataset.guide)||(brand&&brand.firstChild&&brand.firstChild.textContent.trim())||'guide').toLowerCase();
      const doneCount=document.getElementById('done-count');
      const sections=[...document.querySelectorAll('main section')];
      let activeFilter='all', saved={};
      // Restarting an animation needs the class off, a reflow, then on again.
      function replay(el,cls){if(!el||reduce.matches)return;el.classList.remove(cls);void el.offsetWidth;el.classList.add(cls)}
      function updateProgress(animate){const n=lessons.filter(x=>x.querySelector('.check').checked).length;if(!doneCount)return;doneCount.textContent=n+' / '+lessons.length;if(animate)replay(doneCount,'bump')}
      function paintChecks(){lessons.forEach(lesson=>{const box=lesson.querySelector('.check');if(!box)return;box.checked=Boolean(saved[lesson.dataset.id]);lesson.classList.toggle('done',box.checked)});updateProgress()}
      function applyFilters(){
        const query=search?search.value.trim().toLowerCase():'';
        let visibleLessons=0, visibleStandalone=0;
        lessons.forEach(lesson=>{const tags=(lesson.dataset.tags||'').split(' ');const show=(activeFilter==='all'||tags.includes(activeFilter))&&(!query||lesson.textContent.toLowerCase().includes(query));lesson.classList.toggle('hidden',!show);if(show)visibleLessons++});
        sections.forEach(section=>{const inside=[...section.querySelectorAll('.lesson')];if(inside.length)section.classList.toggle('hidden',!inside.some(x=>!x.classList.contains('hidden')));else{const show=!query||section.textContent.toLowerCase().includes(query);section.classList.toggle('hidden',Boolean(query)&&!show);if(show)visibleStandalone++}});
        if(empty)empty.style.display=visibleLessons||visibleStandalone?'none':'block';
      }
      function setFilter(filter){
        const update=()=>{activeFilter=filter;document.querySelectorAll('.filter').forEach(x=>x.classList.toggle('active',x.dataset.filter===filter));applyFilters()};
        if(!reduce.matches&&document.startViewTransition){document.startViewTransition(update);return}
        update();
      }
      const tagOrder=['core','theory','build','optional'];
      lessons.forEach(lesson=>{
        const tags=(lesson.dataset.tags||'').split(' '), meta=lesson.querySelector('.meta'), row=document.createElement('div');
        row.className='lesson-tags';
        tagOrder.filter(tag=>tags.includes(tag)).forEach(tag=>{const pill=document.createElement('button');pill.type='button';pill.className='tag '+tag;pill.textContent=tag;pill.title='Filter by '+tag;pill.addEventListener('click',()=>setFilter(tag));row.append(pill)});
        if(meta)meta.after(row);
        const box=lesson.querySelector('.check');
        box.addEventListener('change',()=>{lesson.classList.toggle('done',box.checked);replay(box,'pop');updateProgress(true)});
      });
      document.querySelectorAll('.filter').forEach(button=>button.addEventListener('click',()=>setFilter(button.dataset.filter)));
      if(search)search.addEventListener('input',applyFilters);
      const src=document.querySelector('script[src*="site.js"]');
      const url=src?new URL('../progress.json',src.src):new URL('progress.json',location.href);
      fetch(url,{cache:'no-cache'}).then(r=>r.ok?r.json():{}).then(data=>{
        const block=data&&typeof data==='object'&&!Array.isArray(data)?data[guide]:null;
        saved=(block&&typeof block==='object'&&!Array.isArray(block))?block:{};
        paintChecks();
      }).catch(()=>{});
    }
    // A campus can sit under several domains; prefer the one actually navigated from.
    if(document.body.dataset.level==='campus'&&document.referrer){
      try{
        const from=new URL(document.referrer,location.href);
        const m=from.pathname.match(/\/domains\/([a-z]{3})\/index\.html$/);
        if(m&&from.origin===location.origin){
          const code=m[1].toUpperCase();
          document.querySelectorAll('.backlink').forEach(el=>{el.href=from.href;el.title='Back to '+code;el.setAttribute('aria-label','Back to '+code);el.lastChild.textContent=code});
          document.querySelectorAll('.pagenav a.pill').forEach(el=>{if(el.textContent.startsWith('←')){el.href=from.href;el.textContent='← Back to '+code}});
        }
      }catch(e){}
    }
  });
})();
