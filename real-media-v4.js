(()=>{
'use strict';
const products=()=>window.P||[];
const byId=id=>products().find(p=>p.id===id);
const byName=name=>products().find(p=>p.name===name);
const makeImg=(p)=>{const img=document.createElement('img');img.className='realProductImg';img.src=p.image;img.alt=p.name;img.loading='lazy';img.referrerPolicy='no-referrer';img.dataset.productId=p.id;img.onerror=()=>{const host=img.parentElement;if(host)host.classList.add('noPhoto')};img.onload=()=>{const host=img.parentElement;if(host)host.classList.remove('noPhoto')};return img};
function setPhoto(host,p,mode='normal'){
 if(!host||!p||!p.image)return;
 host.classList.add('realPhoto');
 let img=host.querySelector('.realProductImg');
 if(!img){img=makeImg(p);host.prepend(img)}
 else if(img.dataset.productId!==p.id){img.dataset.productId=p.id;img.alt=p.name;img.src=p.image;host.classList.remove('noPhoto')}
 if(mode==='card'&&!host.querySelector('.realBrand')){const b=document.createElement('span');b.className='realBrand';b.textContent=p.brand;host.appendChild(b)}
}
function enhanceCards(){
 document.querySelectorAll('.art[data-detail]').forEach(art=>{const p=byId(art.dataset.detail);if(p)setPhoto(art,p,'card')});
 document.querySelectorAll('.card').forEach(card=>{const id=card.querySelector('[data-detail]')?.dataset.detail,p=byId(id);if(!p)return;const info=card.querySelector('.info');if(info&&!info.querySelector('.brandProduct')){const s=document.createElement('span');s.className='brandProduct';s.textContent=p.brand;info.prepend(s)}const foot=card.querySelector('.foot');if(foot&&!foot.querySelector('.priceDemo')){const price=foot.querySelector('strong');if(price){const note=document.createElement('small');note.className='priceDemo';note.textContent='Precio referencial · demo';price.insertAdjacentElement('afterend',note)}}});
 const grid=document.querySelector('#grid');if(grid&&products().length&&!grid.querySelector('.realCatalogNote')){const note=document.createElement('div');note.className='realCatalogNote';note.innerHTML='<b>Catálogo real para validar diseño.</b> Marcas, modelos y características corresponden a productos existentes; los precios mostrados son únicamente referenciales para esta demo.';grid.prepend(note)}
}
function enhanceBag(){
 document.querySelectorAll('.bag .line').forEach(line=>{const p=byName(line.querySelector('.lineInfo b')?.textContent?.trim());if(p)setPhoto(line.querySelector('.lineArt'),p)});
}
function enhanceDetail(){
 const body=document.querySelector('#detailBody');if(!body)return;const p=byName(body.querySelector('h2')?.textContent?.trim());if(!p)return;setPhoto(body.querySelector('.detailArt'),p);
 const tags=body.querySelector('.detailTags');if(tags&&!tags.querySelector('.realTag')){const t=document.createElement('span');t.className='realTag';t.textContent=p.brand+' · producto real';tags.prepend(t)}
 if(p.sourceUrl&&!body.querySelector('.realSource')){const a=document.createElement('a');a.className='realSource';a.href=p.sourceUrl;a.target='_blank';a.rel='noopener noreferrer';a.textContent='Ver ficha del producto ↗';const tagsEl=body.querySelector('.detailTags');tagsEl?.insertAdjacentElement('afterend',a)}
 const foot=body.querySelector('.detailFoot');if(foot&&!foot.querySelector('.priceDemo')){const price=foot.querySelector('b');if(price){const n=document.createElement('small');n.className='priceDemo';n.textContent='Precio referencial · demo';price.insertAdjacentElement('afterend',n)}}
}
function enhanceVisual(){
 const name=document.querySelector('#visualName')?.textContent?.trim(),p=byName(name);if(!p)return;const art=document.querySelector('#visualArt');setPhoto(art,p);
 const info=document.querySelector('.visualInfo');if(info&&!info.querySelector('.brandProduct')){const b=document.createElement('span');b.className='brandProduct';b.textContent=p.brand;info.prepend(b)}else if(info?.querySelector('.brandProduct'))info.querySelector('.brandProduct').textContent=p.brand;
}
function enhanceHero(){
 document.querySelectorAll('.hero .mini').forEach(m=>{const p=byName(m.querySelector('strong')?.textContent?.trim());if(p)setPhoto(m.querySelector('.miniArt'),p)});
}
function enhanceAll(){enhanceCards();enhanceBag();enhanceDetail();enhanceVisual();enhanceHero()}
let pending=false;function schedule(){if(pending)return;pending=true;requestAnimationFrame(()=>{pending=false;enhanceAll()})}
const observer=new MutationObserver(schedule);
function start(){enhanceAll();observer.observe(document.body,{subtree:true,childList:true,characterData:true});setTimeout(enhanceAll,250);setTimeout(enhanceAll,900)}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start);else start();
})();