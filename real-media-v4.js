(()=>{
'use strict';
const products=()=>window.P||[];
const byId=id=>products().find(p=>p.id===id);
const byName=name=>products().find(p=>p.name===name);
function makeImg(p){const img=document.createElement('img');img.className='realProductImg';img.src=p.image;img.alt=p.name;img.loading='lazy';img.referrerPolicy='no-referrer';img.dataset.productId=p.id;img.onerror=()=>img.parentElement?.classList.add('noPhoto');img.onload=()=>img.parentElement?.classList.remove('noPhoto');return img}
function setPhoto(host,p,brand=false){if(!host||!p?.image)return;host.classList.add('realPhoto');let img=host.querySelector('.realProductImg');if(!img){img=makeImg(p);host.prepend(img)}else if(img.dataset.productId!==p.id){img.dataset.productId=p.id;img.alt=p.name;img.src=p.image;host.classList.remove('noPhoto')}if(brand&&!host.querySelector('.realBrand')){const b=document.createElement('span');b.className='realBrand';b.textContent=p.brand;host.appendChild(b)}}
function cards(){document.querySelectorAll('.art[data-detail]').forEach(art=>{const p=byId(art.dataset.detail);if(p)setPhoto(art,p,true)});document.querySelectorAll('.card').forEach(card=>{const p=byId(card.querySelector('[data-detail]')?.dataset.detail);if(!p)return;const info=card.querySelector('.info');if(info&&!info.querySelector('.brandProduct')){const b=document.createElement('span');b.className='brandProduct';b.textContent=p.brand;info.prepend(b)}})}
function bag(){document.querySelectorAll('.bag .line').forEach(line=>{const p=byName(line.querySelector('.lineInfo b')?.textContent?.trim());if(p)setPhoto(line.querySelector('.lineArt'),p)})}
function detail(){const body=document.querySelector('#detailBody');const p=byName(body?.querySelector('h2')?.textContent?.trim());if(!p)return;setPhoto(body.querySelector('.detailArt'),p);const tags=body.querySelector('.detailTags');if(tags&&!tags.querySelector('.realTag')){const t=document.createElement('span');t.className='realTag';t.textContent='Marca · '+p.brand;tags.prepend(t)}}
function visual(){const p=byName(document.querySelector('#visualName')?.textContent?.trim());if(!p)return;setPhoto(document.querySelector('#visualArt'),p);const info=document.querySelector('.visualInfo');let brand=info?.querySelector('.brandProduct');if(info&&!brand){brand=document.createElement('span');brand.className='brandProduct';info.prepend(brand)}if(brand&&brand.textContent!==p.brand)brand.textContent=p.brand}
function all(){cards();bag();detail();visual()}
let scheduled=false;function schedule(){if(scheduled)return;scheduled=true;requestAnimationFrame(()=>{scheduled=false;all()})}
function init(){all();const observer=new MutationObserver(schedule);observer.observe(document.body,{childList:true,subtree:true});setTimeout(all,250);setTimeout(all,800)}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();