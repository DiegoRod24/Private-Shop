(()=>{
'use strict';
const products=()=>window.P||[];
const byId=id=>products().find(p=>p.id===id);
const byName=name=>products().find(p=>p.name===name);
const setText=(el,text)=>{if(el&&el.textContent!==text)el.textContent=text};
const makeImg=p=>{const img=document.createElement('img');img.className='realProductImg';img.src=p.image;img.alt=p.name;img.loading='lazy';img.referrerPolicy='no-referrer';img.dataset.productId=p.id;img.onerror=()=>{const host=img.parentElement;if(host)host.classList.add('noPhoto')};img.onload=()=>{const host=img.parentElement;if(host)host.classList.remove('noPhoto')};return img};
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
 document.querySelectorAll('.card').forEach(card=>{const id=card.querySelector('[data-detail]')?.dataset.detail,p=byId(id);if(!p)return;const info=card.querySelector('.info');if(info&&!info.querySelector('.brandProduct')){const s=document.createElement('span');s.className='brandProduct';s.textContent=p.brand;info.prepend(s)}});
}
function enhanceBag(){document.querySelectorAll('.bag .line').forEach(line=>{const p=byName(line.querySelector('.lineInfo b')?.textContent?.trim());if(p)setPhoto(line.querySelector('.lineArt'),p)})}
function enhanceDetail(){
 const body=document.querySelector('#detailBody');if(!body)return;const p=byName(body.querySelector('h2')?.textContent?.trim());if(!p)return;setPhoto(body.querySelector('.detailArt'),p);
 const tags=body.querySelector('.detailTags');if(tags&&!tags.querySelector('.realTag')){const t=document.createElement('span');t.className='realTag';t.textContent='Marca · '+p.brand;tags.prepend(t)}
 const old=body.querySelector('.realSource');if(old)old.remove();
}
function enhanceVisual(){
 const name=document.querySelector('#visualName')?.textContent?.trim(),p=byName(name);if(!p)return;setPhoto(document.querySelector('#visualArt'),p);
 const info=document.querySelector('.visualInfo');if(info&&!info.querySelector('.brandProduct')){const b=document.createElement('span');b.className='brandProduct';b.textContent=p.brand;info.prepend(b)}else if(info?.querySelector('.brandProduct'))setText(info.querySelector('.brandProduct'),p.brand);
}
function enhanceHero(){document.querySelectorAll('.hero .mini').forEach(m=>{const p=byName(m.querySelector('strong')?.textContent?.trim());if(p)setPhoto(m.querySelector('.miniArt'),p)})}
function productionCopy(){
 if(document.title!=='VELORA Private Shop')document.title='VELORA Private Shop';
 const meta=document.querySelector('meta[name="description"]');const desc='VELORA Private Shop — bienestar íntimo, compra privada, bolsa visual y recojo en tienda.';if(meta&&meta.content!==desc)meta.content=desc;
 document.querySelectorAll('.brandText small').forEach(el=>{if(/V3|V4|REAL|DEMO/i.test(el.textContent))setText(el,'PRIVATE SHOP')});
 const stat=[...document.querySelectorAll('.stats div')][0];if(stat){setText(stat.querySelector('b'),'Marcas');setText(stat.querySelector('span'),'seleccionadas')}
 setText(document.querySelector('footer>span'),'Bienestar íntimo · compra privada · recojo en tienda.');
 const collection=document.querySelector('.collection');if(collection){setText(collection.querySelector('.eye'),'TU SELECCIÓN, A TU MANERA');setText(collection.querySelector('h2'),'Mira antes de recoger.');setText(collection.querySelector('p'),'Guarda lo que te interesa y revisa cada artículo en una vista visual antes de generar tu código de recojo.');const btn=collection.querySelector('#demoVisual');if(btn){const n=btn.cloneNode(true);n.id='shopVisual';n.textContent='Explorar productos →';btn.replaceWith(n);n.onclick=()=>{location.hash='#catalogo'}}}
 setText(document.querySelector('.share>small'),'Disponibilidad y precio se confirman al reservar.');
 document.querySelectorAll('.bagFoot p').forEach(p=>setText(p,'Pago al recoger. Disponibilidad y precio se confirman al reservar.'));
 document.querySelectorAll('*').forEach(el=>{if(el.children.length===0&&el.textContent){const next=el.textContent.replace(/VL-DEMO-/g,'VL-').replace(/Total referencial/g,'Total');if(next!==el.textContent)el.textContent=next}})
}
function addBrandRail(){
 if(document.querySelector('.brandRail'))return;const stats=document.querySelector('.stats');if(!stats)return;
 const rail=document.createElement('section');rail.className='brandRail';rail.innerHTML='<div class="brandRailInner"><span class="brandRailLabel">MARCAS SELECCIONADAS</span><span class="brandChip">LELO</span><span class="brandChip">WE-VIBE</span><span class="brandChip">WOMANIZER</span><span class="brandChip">DUREX</span><span class="brandChip">SKYN</span></div>';stats.insertAdjacentElement('afterend',rail)
}
function addServiceProof(){
 if(document.querySelector('.serviceProof'))return;const privacy=document.querySelector('.privacy');if(!privacy)return;
 const s=document.createElement('section');s.className='serviceProof';s.innerHTML='<div class="serviceProofHead"><div><span class="eye">EXPERIENCIA VELORA</span><h2>Privado, rápido y sin complicaciones.</h2></div><p>La tienda está pensada para que explores con calma en tu celular y llegues a recoger con tu selección lista.</p></div><div class="serviceProofGrid"><article class="serviceCard"><div class="serviceIcon">🔒</div><h3>Privacidad primero</h3><p>Explora y arma tu bolsa sin completar formularios innecesarios.</p></article><article class="serviceCard"><div class="serviceIcon">◫</div><h3>Bolsa visual</h3><p>Revisa artículo por artículo, color, precio y características antes de reservar.</p></article><article class="serviceCard"><div class="serviceIcon">▦</div><h3>Recojo simple</h3><p>Genera un código o QR y muéstralo al llegar a tienda.</p></article><article class="serviceCard"><div class="serviceIcon">✦</div><h3>ROD te acompaña</h3><p>Filtra categorías, abre tu bolsa y te guía durante la compra.</p></article></div>';
 privacy.insertAdjacentElement('beforebegin',s)
}
function addStatus(){
 const hero=document.querySelector('.heroCopy');if(!hero||hero.querySelector('.productionStatus'))return;const x=document.createElement('div');x.className='productionStatus';x.innerHTML='<i></i><span>Compra privada · recojo en tienda</span>';hero.appendChild(x)
}
function enhanceAll(){enhanceCards();enhanceBag();enhanceDetail();enhanceVisual();enhanceHero();productionCopy();addBrandRail();addServiceProof();addStatus()}
let pending=false;function schedule(){if(pending)return;pending=true;requestAnimationFrame(()=>{pending=false;enhanceAll()})}
const observer=new MutationObserver(schedule);
function start(){enhanceAll();observer.observe(document.body,{subtree:true,childList:true,characterData:true});setTimeout(enhanceAll,220);setTimeout(enhanceAll,850)}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start);else start();
})();