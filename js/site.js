/* Shared school interactions. Works on static hosting and when opened locally. */
(()=>{'use strict';
const recipient='admin@sric.edu.ph';
// Reserve the measured height so the fixed header never covers page content.
const header=document.querySelector('.site-header');
if(header){
 const syncHeaderHeight=()=>document.documentElement.style.setProperty('--site-header-height',`${Math.ceil(header.getBoundingClientRect().height)}px`);
 syncHeaderHeight();
 if('ResizeObserver' in window)new ResizeObserver(syncHeaderHeight).observe(header);
 window.addEventListener('resize',syncHeaderHeight);
 document.fonts?.ready.then(syncHeaderHeight);
}
const current=location.pathname.split('/').pop()||'index.html';
document.querySelectorAll('#school-links a').forEach(a=>{if(a.getAttribute('href')===current)a.setAttribute('aria-current','page');});
const toggle=document.querySelector('.menu-toggle'),links=document.querySelector('#school-links');
toggle?.addEventListener('click',()=>{const open=links.classList.toggle('open');toggle.setAttribute('aria-expanded',String(open));});
const panel=document.querySelector('.search-panel'),form=document.querySelector('.site-search');
form?.addEventListener('submit',e=>{e.preventDefault();const query=form.querySelector('input').value.trim();panel.hidden=false;const terms=query.toLocaleLowerCase().split(/\s+/).filter(Boolean);const results=terms.length?(window.SCHOOL_SEARCH||[]).map(p=>({...p,score:terms.reduce((n,t)=>n+(p.title.toLowerCase().includes(t)?10:0)+(p.text.toLowerCase().includes(t)?1:0),0)})).filter(p=>terms.every(t=>(p.title+' '+p.text).toLowerCase().includes(t))).sort((a,b)=>b.score-a.score):[];panel.querySelector('.search-summary').textContent=query?`${results.length} page${results.length===1?'':'s'} found for “${query}”.`:'Please enter a word or phrase.';const list=panel.querySelector('.search-items');list.replaceChildren();results.forEach(p=>{const a=document.createElement('a'),title=document.createElement('strong'),desc=document.createElement('p');a.href=p.url;title.textContent=p.title;const pos=p.text.toLowerCase().indexOf(terms[0]);desc.textContent='…'+p.text.slice(Math.max(0,pos-40),Math.max(0,pos-40)+200)+'…';a.append(title,desc);list.append(a);});panel.scrollIntoView({block:'start',behavior:'smooth'});});
document.querySelector('.close-search')?.addEventListener('click',()=>{panel.hidden=true;form.querySelector('input').focus();});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&panel&&!panel.hidden){panel.hidden=true;form.querySelector('input').focus();}});
document.querySelector('#contact-form')?.addEventListener('submit',e=>{e.preventDefault();const f=e.currentTarget;if(!f.reportValidity())return;const val=id=>f.querySelector('#'+id).value.trim();const body=`Name: ${val('name')}\nEmail: ${val('email')}\n\n${val('message')}`;location.href=`mailto:${recipient}?subject=${encodeURIComponent(val('subject'))}&body=${encodeURIComponent(body)}`;f.querySelector('.contact-status').textContent='Your email app will open with your message. Review it and press Send there. If no app opens, email '+recipient+' directly.';});
document.querySelectorAll('[data-newsletter]').forEach(b=>{b.addEventListener('click',()=>{const wrap=b.parentElement,input=wrap.querySelector('input');input.required=true;if(!input.reportValidity())return;let status=wrap.parentElement.querySelector('.newsletter-status');if(!status){status=document.createElement('p');status.className='newsletter-status';status.setAttribute('role','status');wrap.after(status);}location.href=`mailto:${recipient}?subject=${encodeURIComponent('School updates subscription request')}&body=${encodeURIComponent('Please send school updates to: '+input.value.trim())}`;status.textContent='Send the request from your email app. This does not automatically subscribe you.';});});
document.querySelectorAll('h6,p').forEach(el=>{if(el.textContent.trim()==='info@example.com'){const a=document.createElement('a');a.href='mailto:'+recipient;a.textContent=recipient;el.replaceChildren(a);}});
// Keep content visible if an external animation library is unavailable.
window.addEventListener('load',()=>{document.querySelector('#spinner')?.classList.remove('show');document.querySelectorAll('.wow').forEach(el=>el.style.visibility='visible');});
})();
