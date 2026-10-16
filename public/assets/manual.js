// Page navigation
(function(){
  var pages = Array.prototype.slice.call(document.querySelectorAll('.page'));
  var TOTAL = pages.length;
  document.getElementById('total').textContent = TOTAL;
  var links = Array.prototype.slice.call(document.querySelectorAll('.nav a'));
  var main = document.getElementById('main');
  var nav = document.getElementById('nav'), scrim = document.getElementById('scrim');
  var menu = document.getElementById('menu');
  var cur = 1;

  function show(n, push){
    n = Math.min(Math.max(n, 1), TOTAL);
    cur = n;
    pages.forEach(function(p, i){ p.hidden = (i + 1) !== n; });
    links.forEach(function(a){
      a.setAttribute('aria-current', a.dataset.page === String(n) ? 'true' : 'false');
    });
    var p = pages[n - 1];
    document.getElementById('cur').textContent = n;
    document.getElementById('progress').style.width = (n / TOTAL * 100) + '%';
    document.getElementById('chapter').textContent =
      p.dataset.ch ? p.dataset.ch + ' · ' + p.dataset.title : p.dataset.title;
    document.getElementById('prev').disabled = n === 1;
    document.getElementById('next').disabled = n === TOTAL;
    main.scrollTop = 0;
    if (push && location.hash !== '#p' + n) history.replaceState(null, '', '#p' + n);
  }

  function drawer(open){
    nav.classList.toggle('open', open);
    scrim.hidden = !open;
    if (open) requestAnimationFrame(function(){ scrim.style.opacity = 1; });
    else scrim.style.opacity = 0;
    menu.setAttribute('aria-expanded', open ? 'true' : 'false');
  }

  menu.addEventListener('click', function(){ drawer(!nav.classList.contains('open')); });
  scrim.addEventListener('click', function(){ drawer(false); });
  document.getElementById('prev').addEventListener('click', function(){ show(cur - 1, true); });
  document.getElementById('next').addEventListener('click', function(){ show(cur + 1, true); });

  document.addEventListener('click', function(e){
    var a = e.target.closest('a[href^="#p"]');
    if (!a) return;
    e.preventDefault();
    show(parseInt(a.getAttribute('href').slice(2), 10), true);
    drawer(false);
    var to = a.dataset.to && document.getElementById(a.dataset.to);
    if (to) {
      main.scrollTop = to.getBoundingClientRect().top - main.getBoundingClientRect().top + main.scrollTop - 24;
      to.classList.add('flash'); setTimeout(function(){ to.classList.remove('flash'); }, 1400);
    }
  });

  document.addEventListener('keydown', function(e){
    if (/INPUT|TEXTAREA/.test(e.target.tagName)) return;
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    if (e.key === 'ArrowRight') show(cur + 1, true);
    else if (e.key === 'ArrowLeft') show(cur - 1, true);
    else if (e.key === 'Escape') drawer(false);
  });

  var start = parseInt((location.hash.match(/^#p(\d+)$/) || [])[1], 10);
  show(start || 1, false);
})();

// Search
(function(){
  var q=document.getElementById('q'), box=document.getElementById('sres'), main=document.getElementById('main');
  var idx=[];
  Array.prototype.slice.call(document.querySelectorAll('.page')).forEach(function(p,i){
    var n=i+1, pt=(p.dataset.ch?p.dataset.ch+' · ':'')+p.dataset.title;
    var h=p.querySelector('h1'), sub=p.querySelector('.sub');
    idx.push({n:n,t:h?h.textContent:pt,p:pt,x:(sub?sub.textContent:'')});
    p.querySelectorAll('.row').forEach(function(r){
      var rt=r.querySelector('.rt'), num=r.querySelector('.num');
      idx.push({n:n,t:(num?num.textContent+'  ':'')+(rt?rt.textContent:''),p:pt,x:r.querySelector('.rc').textContent.replace(rt?rt.textContent:'',''),el:r});
    });
    p.querySelectorAll('.info').forEach(function(r){
      var h4=r.querySelector('h4');
      idx.push({n:n,t:h4?h4.textContent:pt,p:pt,x:r.textContent.replace(h4?h4.textContent:'',''),el:r});
    });
  });
  function esc(s){return s.replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c];});}
  function hl(s,k){var i=s.toLowerCase().indexOf(k);if(i<0)return esc(s);return esc(s.slice(0,i))+'<mark>'+esc(s.slice(i,i+k.length))+'</mark>'+esc(s.slice(i+k.length));}
  function snip(s,k){s=s.replace(/\s+/g,' ').trim();var i=s.toLowerCase().indexOf(k);if(i<0)return s.slice(0,80);var a=Math.max(0,i-30);return (a?'…':'')+s.slice(a,i+k.length+50)+(i+k.length+50<s.length?'…':'');}
  var hits=[], act=0;
  function render(){
    var k=q.value.trim().toLowerCase();
    if(!k){box.hidden=true;return;}
    hits=idx.filter(function(o){return (o.t+' '+o.x).toLowerCase().indexOf(k)>-1;}).slice(0,12);
    act=0;
    box.innerHTML=hits.length?hits.map(function(o,i){
      var inT=o.t.toLowerCase().indexOf(k)>-1;
      return '<li><a href="#p'+o.n+'" data-i="'+i+'"'+(i===0?' class="act"':'')+'><div class="st">'+hl(o.t,k)+'</div><div class="sp">'+esc(o.p)+'</div>'+(inT?'':'<div class="sx">'+hl(snip(o.x,k),k)+'</div>')+'</a></li>';
    }).join(''):'<li class="none">'+esc(document.body.dataset.none)+'</li>';
    box.hidden=false;
  }
  function go(i){
    var o=hits[i]; if(!o) return;
    box.hidden=true; q.blur();
    setTimeout(function(){
      if(!o.el) return;
      main.scrollTop=o.el.getBoundingClientRect().top-main.getBoundingClientRect().top+main.scrollTop-24;
      o.el.classList.add('flash'); setTimeout(function(){o.el.classList.remove('flash');},1400);
    },0);
  }
  function setAct(i){var as=box.querySelectorAll('a');if(!as.length)return;act=(i+as.length)%as.length;as.forEach(function(a,j){a.classList.toggle('act',j===act);});}
  q.addEventListener('input',render);
  q.addEventListener('focus',render);
  q.addEventListener('keydown',function(e){
    e.stopPropagation();
    if(e.key==='ArrowDown'){e.preventDefault();setAct(act+1);}
    else if(e.key==='ArrowUp'){e.preventDefault();setAct(act-1);}
    else if(e.key==='Enter'){var a=box.querySelectorAll('a')[act];if(a){a.click();}}
    else if(e.key==='Escape'){box.hidden=true;q.blur();}
  });
  box.addEventListener('click',function(e){var a=e.target.closest('a[data-i]');if(a)go(+a.dataset.i);});
  document.addEventListener('mousedown',function(e){if(!e.target.closest('.search'))box.hidden=true;});
  document.addEventListener('keydown',function(e){if(e.key==='/'&&document.activeElement!==q&&!/INPUT|TEXTAREA/.test(document.activeElement.tagName)){e.preventDefault();q.focus();}});
})();
