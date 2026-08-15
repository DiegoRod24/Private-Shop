(()=>{
'use strict';
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const products=()=>window.P||[];
function product(id){return products().find(p=>p.id===id)}
function setEditorialMedia(){
  $$('[data-product-media]').forEach(host=>{
    const p=product(host.dataset.productMedia); if(!p||!p.image)return;
    let img=host.querySelector('img'); if(!img){img=document.createElement('img');host.appendChild(img)}
    if(img.src!==p.image){img.src=p.image;img.alt=p.name;img.loading='lazy';img.referrerPolicy='no-referrer'}
  })
}
function jumpCategory(cat){
  location.hash='#catalogo';
  setTimeout(()=>{const b=$$('[data-cat]').find(x=>x.dataset.cat===cat);if(b)b.click()},80)
}
function categoryLinks(){
  $$('[data-shopcat]').forEach(el=>el.addEventListener('click',e=>{e.preventDefault();jumpCategory(el.dataset.shopcat)}));
}
function faq(){
  $$('.faqQ').forEach(q=>q.addEventListener('click',()=>{
    const item=q.closest('.faqItem');
    $$('.faqItem.open').filter(x=>x!==item).forEach(x=>x.classList.remove('open'));
    item.classList.toggle('open');
  }))
}
function header(){
  const h=$('.top');if(!h)return;
  const sync=()=>h.classList.toggle('scrolled',scrollY>18);sync();addEventListener('scroll',sync,{passive:true});
}
function reveal(){
  const targets=$$('.luxSection,.editorialBand,.conciergeCard,.serviceProof,.privacy,.faqWrap');targets.forEach(x=>x.classList.add('reveal'));
  if(!('IntersectionObserver'in window)){targets.forEach(x=>x.classList.add('in'));return}
  const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{threshold:.08});targets.forEach(x=>io.observe(x));
}
function polishDynamicCopy(){
  const clean=()=>{
    $$('.bagFoot .total span').forEach(x=>{if(/referencial/i.test(x.textContent))x.textContent='Total'});
    $$('.bagFoot p').forEach(x=>x.textContent='Pago al recoger. Tu selección queda asociada al código generado.');
    $$('.priceDemo,.realCatalogNote').forEach(x=>x.remove());
  };
  clean();
  const mo=new MutationObserver(()=>requestAnimationFrame(clean));mo.observe(document.body,{subtree:true,childList:true});
}
function rodCtas(){
  $$('[data-open-rod]').forEach(b=>b.addEventListener('click',()=>{$('#heroRod')?.click()}));
}
function catalogHints(){
  const grid=$('#grid');if(!grid)return;
  const hint=document.createElement('div');hint.className='mobileSwipeHint';hint.innerHTML='<span>Desliza para explorar</span><i>→</i>';
  grid.parentElement.insertBefore(hint,grid);
}
function accessibility(){
  $$('.catTile,.moodCard').forEach(el=>{el.tabIndex=0;el.setAttribute('role','button');el.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();el.click()}})});
}
function init(){setEditorialMedia();categoryLinks();faq();header();reveal();polishDynamicCopy();rodCtas();catalogHints();accessibility();setTimeout(setEditorialMedia,500)}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();