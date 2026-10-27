(()=>{'use strict';
 const loader=document.querySelector('.page-loader');
 const dismiss=()=>{if(loader){loader.hidden=true;loader.classList.remove('is-leaving');}};
 if(document.readyState==='complete')dismiss();else window.addEventListener('load',dismiss,{once:true});
 setTimeout(dismiss,5500);
 window.addEventListener('pageshow',dismiss);
 document.addEventListener('click',event=>{
  const link=event.target.closest('a[href]');
  if(!link||event.defaultPrevented||event.button!==0||event.ctrlKey||event.metaKey||event.shiftKey||event.altKey||link.hasAttribute('download')||(link.target&&link.target!=='_self'))return;
  const dest=new URL(link.href,location.href);
  if(dest.protocol!==location.protocol||dest.host!==location.host||!dest.pathname.endsWith('.html')||dest.pathname===location.pathname)return;
  event.preventDefault();loader.hidden=false;loader.classList.add('is-leaving');
  // Allow the overlay to paint before the browser begins loading the next page.
  requestAnimationFrame(()=>requestAnimationFrame(()=>{location.href=dest.href;}));
  setTimeout(dismiss,5500);
 });
 const carousel=document.querySelector('.school-carousel');if(!carousel)return;
 const slides=[...carousel.querySelectorAll('.carousel-item')];let current=0,timer=null,focused=false,startX=null,startY=null;
 const reduced=window.matchMedia('(prefers-reduced-motion: reduce)');
 function show(next,manual=false){current=(next+slides.length)%slides.length;slides.forEach((slide,i)=>{const active=i===current;slide.classList.toggle('active',active);slide.setAttribute('aria-hidden',String(!active));slide.inert=!active;});if(manual)carousel.querySelector('.slide-announcement').textContent=`Highlight ${current+1} of ${slides.length}: ${slides[current].querySelector('h1,h2').textContent}`;}
 function restart(){clearInterval(timer);timer=null;if(!focused&&!document.hidden&&!reduced.matches)timer=setInterval(()=>show(current+1),6000);}
 function move(step){show(current+step,true);restart();}
 carousel.querySelector('.school-slide-prev').addEventListener('click',()=>move(-1));
 carousel.querySelector('.school-slide-next').addEventListener('click',()=>move(1));
 carousel.addEventListener('keydown',e=>{if(!['ArrowLeft','ArrowRight'].includes(e.key)||!e.target.closest('button'))return;e.preventDefault();move(e.key==='ArrowRight'?1:-1);});
 carousel.addEventListener('focusin',()=>{focused=true;restart();});
 carousel.addEventListener('focusout',e=>{focused=carousel.contains(e.relatedTarget);restart();});
 document.addEventListener('visibilitychange',restart);
 reduced.addEventListener('change',restart);
 carousel.addEventListener('touchstart',e=>{startX=e.touches[0].clientX;startY=e.touches[0].clientY;clearInterval(timer);},{passive:true});
 carousel.addEventListener('touchend',e=>{if(startX===null)return;const dx=e.changedTouches[0].clientX-startX,dy=e.changedTouches[0].clientY-startY;startX=null;if(Math.abs(dx)>50&&Math.abs(dx)>Math.abs(dy))move(dx<0?1:-1);else restart();},{passive:true});
 carousel.addEventListener('touchcancel',()=>{startX=null;restart();},{passive:true});
 restart();
})();
