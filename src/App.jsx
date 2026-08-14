import { useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  BadgeCheck, Bag, Bot, ChevronLeft, ChevronRight, Copy, Download,
  Heart, Home, Info, MapPin, Menu, Mic, Minus, PackageCheck, Plus,
  QrCode, Search, Send, Share2, ShieldCheck, ShoppingBag, Sparkles,
  Store, Trash2, X
} from 'lucide-react'
import { QRCodeSVG } from 'qrcode.react'

const PRODUCTS = [
  {
    id: 'aura-mini',
    name: 'Aura Mini',
    category: 'Bienestar',
    price: 89.9,
    badge: 'Más elegido',
    icon: '✦',
    tone: 'violet',
    short: 'Compacto, silencioso y discreto.',
    detail: 'Diseño compacto de tacto suave, pensado para guardarse con discreción.',
  },
  {
    id: 'duo-touch',
    name: 'Duo Touch',
    category: 'Pareja',
    price: 119.9,
    badge: 'Para compartir',
    icon: '∞',
    tone: 'rose',
    short: 'Una opción simple para explorar en pareja.',
    detail: 'Formato flexible y minimalista con presentación discreta.',
  },
  {
    id: 'silk-water',
    name: 'Silk Water',
    category: 'Cuidado íntimo',
    price: 42.9,
    badge: 'Esencial',
    icon: '◌',
    tone: 'blue',
    short: 'Lubricante base agua, textura ligera.',
    detail: 'Fórmula base agua y empaque compacto. Revisa siempre las indicaciones del producto.',
  },
  {
    id: 'after-dark',
    name: 'After Dark',
    category: 'Masaje',
    price: 54.9,
    badge: 'Relax',
    icon: '☾',
    tone: 'amber',
    short: 'Aceite de masaje con aroma suave.',
    detail: 'Aceite para masaje corporal en presentación discreta.',
  },
  {
    id: 'pulse-ring',
    name: 'Pulse Ring',
    category: 'Accesorios',
    price: 69.9,
    badge: 'Nuevo',
    icon: '○',
    tone: 'mint',
    short: 'Pequeño, portable y fácil de llevar.',
    detail: 'Accesorio compacto con empaque neutro para transporte sencillo.',
  },
  {
    id: 'velvet-kit',
    name: 'Velvet Kit',
    category: 'Kits',
    price: 149.9,
    badge: 'Kit',
    icon: '◇',
    tone: 'violet',
    short: 'Selección básica para regalo o primera compra.',
    detail: 'Kit de bienestar íntimo con presentación elegante y discreta.',
  }
]

const money = (n) => new Intl.NumberFormat('es-PE', {
  style: 'currency',
  currency: 'PEN'
}).format(n)

const encodeBag = (obj) => {
  const json = JSON.stringify(obj)
  const bytes = new TextEncoder().encode(json)
  let binary = ''
  bytes.forEach((b) => binary += String.fromCharCode(b))
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '')
}

const decodeBag = (value) => {
  try {
    let base64 = value.replace(/-/g, '+').replace(/_/g, '/')
    while (base64.length % 4) base64 += '='
    const binary = atob(base64)
    const bytes = Uint8Array.from(binary, c => c.charCodeAt(0))
    return JSON.parse(new TextDecoder().decode(bytes))
  } catch {
    return null
  }
}

function App() {
  const [ageOk, setAgeOk] = useState(localStorage.getItem('velora_age') === 'ok')
  const [cart, setCart] = useState(() => {
    try { return JSON.parse(localStorage.getItem('velora_cart') || '{}') } catch { return {} }
  })
  const [favorites, setFavorites] = useState(() => {
    try { return JSON.parse(localStorage.getItem('velora_favs') || '[]') } catch { return [] }
  })
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('Todo')
  const [cartOpen, setCartOpen] = useState(false)
  const [detail, setDetail] = useState(null)
  const [assistantOpen, setAssistantOpen] = useState(false)
  const [reservation, setReservation] = useState(null)
  const [sharedBag, setSharedBag] = useState(null)
  const [installEvent, setInstallEvent] = useState(null)
  const [iosInstall, setIosInstall] = useState(false)
  const [toast, setToast] = useState('')
  const [messages, setMessages] = useState([
    { by: 'vela', text: 'Hola ✦ Soy Vela. Puedo ayudarte a explorar, abrir tu bolsa o dejar listo tu recojo.' }
  ])
  const [chatText, setChatText] = useState('')
  const inputRef = useRef(null)

  useEffect(() => localStorage.setItem('velora_cart', JSON.stringify(cart)), [cart])
  useEffect(() => localStorage.setItem('velora_favs', JSON.stringify(favorites)), [favorites])

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const bag = params.get('bag')
    if (bag) {
      const decoded = decodeBag(bag)
      if (decoded?.items) setSharedBag(decoded)
    }

    const onInstall = (e) => {
      e.preventDefault()
      setInstallEvent(e)
    }
    window.addEventListener('beforeinstallprompt', onInstall)

    const ua = window.navigator.userAgent.toLowerCase()
    const isIos = /iphone|ipad|ipod/.test(ua)
    const standalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone
    if (isIos && !standalone) setIosInstall(true)

    return () => window.removeEventListener('beforeinstallprompt', onInstall)
  }, [])

  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => setToast(''), 1800)
    return () => clearTimeout(t)
  }, [toast])

  const categories = ['Todo', ...new Set(PRODUCTS.map(p => p.category))]
  const filtered = PRODUCTS.filter(p => {
    const matchCategory = category === 'Todo' || p.category === category
    const q = query.trim().toLowerCase()
    const matchSearch = !q || `${p.name} ${p.category} ${p.short}`.toLowerCase().includes(q)
    return matchCategory && matchSearch
  })

  const cartLines = useMemo(() => PRODUCTS
    .filter(p => cart[p.id])
    .map(p => ({ ...p, qty: cart[p.id] })), [cart])

  const cartCount = cartLines.reduce((a, x) => a + x.qty, 0)
  const total = cartLines.reduce((a, x) => a + (x.price * x.qty), 0)

  const add = (id, amount = 1) => {
    setCart(prev => ({ ...prev, [id]: Math.max(0, (prev[id] || 0) + amount) }))
    setToast('Agregado a tu bolsa')
  }

  const setQty = (id, qty) => {
    setCart(prev => {
      const next = { ...prev }
      if (qty <= 0) delete next[id]
      else next[id] = qty
      return next
    })
  }

  const toggleFav = (id) => {
    setFavorites(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])
  }

  const makeReservation = () => {
    if (!cartLines.length) return
    const code = `VL-${Date.now().toString(36).slice(-5).toUpperCase()}-${Math.random().toString(36).slice(2, 5).toUpperCase()}`
    const data = {
      code,
      createdAt: new Date().toISOString(),
      items: cartLines.map(({ id, name, price, qty }) => ({ id, name, price, qty }))
    }
    const share = `${window.location.origin}${window.location.pathname}?bag=${encodeBag(data)}`
    const full = { ...data, share }
    setReservation(full)
    localStorage.setItem('velora_reservation', JSON.stringify(full))
  }

  const copy = async (text, label = 'Copiado') => {
    try {
      await navigator.clipboard.writeText(text)
      setToast(label)
    } catch {
      setToast('Mantén presionado para copiar')
    }
  }

  const shareReservation = async () => {
    if (!reservation) return
    const data = {
      title: 'Mi bolsa VELORA',
      text: `Bolsa reservada · código ${reservation.code}`,
      url: reservation.share
    }
    if (navigator.share) {
      try { await navigator.share(data) } catch {}
    } else {
      copy(reservation.share, 'Link copiado')
    }
  }

  const installApp = async () => {
    if (installEvent) {
      await installEvent.prompt()
      setInstallEvent(null)
    } else if (iosInstall) {
      setToast('En iPhone: Compartir → Añadir a pantalla de inicio')
    } else {
      setToast('La instalación aparece cuando el navegador la habilita')
    }
  }

  const openCart = () => {
    setAssistantOpen(false)
    setCartOpen(true)
  }

  const assistantReply = (text) => {
    const t = text.toLowerCase()
    let reply = 'Puedo mostrarte categorías, buscar algo discreto, abrir tu bolsa o preparar tu recojo.'
    if (t.includes('bolsa') || t.includes('carrito')) {
      reply = cartCount ? `Tienes ${cartCount} producto${cartCount > 1 ? 's' : ''} en tu bolsa por ${money(total)}. Te la abro.` : 'Tu bolsa todavía está vacía. Te muestro el catálogo.'
      setTimeout(openCart, 450)
    } else if (t.includes('recojo') || t.includes('reserv')) {
      reply = cartCount ? 'Perfecto. Abre tu bolsa y toca “Preparar recojo” para generar tu código y QR.' : 'Primero agrega uno o más productos; luego preparo tu código de recojo.'
      if (cartCount) setTimeout(openCart, 450)
    } else if (t.includes('discret') || t.includes('compact')) {
      setCategory('Bienestar')
      reply = 'Te filtré opciones compactas y discretas. Aura Mini es una buena entrada visual.'
      window.scrollTo({ top: 520, behavior: 'smooth' })
    } else if (t.includes('pareja')) {
      setCategory('Pareja')
      reply = 'Te muestro la categoría Pareja.'
      window.scrollTo({ top: 520, behavior: 'smooth' })
    } else if (t.includes('masaje')) {
      setCategory('Masaje')
      reply = 'Listo, te muestro opciones de masaje.'
      window.scrollTo({ top: 520, behavior: 'smooth' })
    } else if (t.includes('todo') || t.includes('productos') || t.includes('catálogo') || t.includes('catalogo')) {
      setCategory('Todo')
      reply = 'Catálogo completo abierto. Puedes tocar cualquier producto para verlo mejor.'
      window.scrollTo({ top: 520, behavior: 'smooth' })
    }
    setMessages(prev => [...prev, { by: 'you', text }, { by: 'vela', text: reply }])
  }

  const sendChat = () => {
    const t = chatText.trim()
    if (!t) return
    setChatText('')
    assistantReply(t)
  }

  const startVoice = () => {
    const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!Recognition) {
      setToast('Tu navegador no habilita voz aquí')
      return
    }
    const r = new Recognition()
    r.lang = 'es-PE'
    r.interimResults = false
    r.onresult = (e) => assistantReply(e.results[0][0].transcript)
    r.onerror = () => setToast('No pude escuchar bien')
    r.start()
  }

  const acceptShared = () => {
    if (!sharedBag) return
    const next = {}
    sharedBag.items.forEach(i => next[i.id] = i.qty)
    setCart(next)
    setSharedBag(null)
    window.history.replaceState({}, '', window.location.pathname)
    setToast('Bolsa copiada a este equipo')
  }

  if (!ageOk) {
    return (
      <div className="age-shell">
        <div className="age-orb orb-a" />
        <div className="age-orb orb-b" />
        <motion.div className="age-card" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}>
          <div className="brand-lockup"><span className="brand-mark">V</span><b>VELORA</b></div>
          <div className="age-chip"><ShieldCheck size={16}/> Espacio privado · +18</div>
          <h1>Entra sin ruido.<br/>Explora a tu ritmo.</h1>
          <p>Esta experiencia está dirigida exclusivamente a personas adultas. La reserva se recoge y paga en tienda.</p>
          <button className="primary huge" onClick={() => { localStorage.setItem('velora_age', 'ok'); setAgeOk(true) }}>
            Soy mayor de 18 años <ChevronRight/>
          </button>
          <small>Al continuar confirmas que cumples la mayoría de edad aplicable en tu ubicación.</small>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="app-shell">
      <AnimatePresence>
        {sharedBag && (
          <motion.div className="shared-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div className="shared-card" initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
              <div className="eyebrow">BOLSA COMPARTIDA</div>
              <h2>{sharedBag.code || 'Selección VELORA'}</h2>
              <p>Te compartieron esta selección. Puedes verla sin modificarla o copiarla a tu propia bolsa.</p>
              <div className="shared-list">
                {sharedBag.items.map(i => (
                  <div className="shared-line" key={i.id}>
                    <span>{i.name} <small>x{i.qty}</small></span>
                    <b>{money(i.price * i.qty)}</b>
                  </div>
                ))}
              </div>
              <button className="primary" onClick={acceptShared}>Usar esta bolsa <ShoppingBag size={18}/></button>
              <button className="ghost" onClick={() => setSharedBag(null)}>Solo mirar</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <header className="topbar">
        <div className="brand-lockup"><span className="brand-mark">V</span><b>VELORA</b><em>PRIVATE SHOP</em></div>
        <nav className="desktop-nav">
          <a href="#inicio">Inicio</a>
          <a href="#catalogo">Explorar</a>
          <a href="#recojo">Recojo</a>
          <a href="#privacidad">Privacidad</a>
        </nav>
        <div className="top-actions">
          {(installEvent || iosInstall) && (
            <button className="install-btn" onClick={installApp}><Download size={17}/> Instalar app</button>
          )}
          <button className="cart-button" onClick={() => setCartOpen(true)}>
            <Bag size={19}/><span>Bolsa</span>{cartCount > 0 && <b>{cartCount}</b>}
          </button>
        </div>
      </header>

      <main>
        <section className="hero" id="inicio">
          <div className="hero-glow one"/>
          <div className="hero-glow two"/>
          <div className="hero-copy">
            <div className="eyebrow"><Sparkles size={15}/> COMPRA DISCRETA · RECOJO EN TIENDA</div>
            <h1>Tu espacio.<br/><span>Tu ritmo.</span><br/>Tu bolsa.</h1>
            <p>Explora, guarda lo que te gusta, genera tu código y recoge tu pedido sin explicar de más.</p>
            <div className="hero-actions">
              <a className="primary" href="#catalogo">Explorar ahora <ChevronRight size={18}/></a>
              <button className="soft" onClick={() => setAssistantOpen(true)}><Bot size={18}/> Hablar con Vela</button>
            </div>
            <div className="hero-trust">
              <span><ShieldCheck size={16}/> Reserva privada</span>
              <span><Store size={16}/> Pago en tienda</span>
              <span><QrCode size={16}/> QR inmediato</span>
            </div>
          </div>

          <motion.div className="phone-stage" animate={{ y: [0, -8, 0] }} transition={{ repeat: Infinity, duration: 5, ease: 'easeInOut' }}>
            <div className="phone">
              <div className="phone-island"/>
              <div className="phone-screen">
                <span className="mini-label">TU BOLSA</span>
                <h3>Lista para recoger</h3>
                <div className="mini-product violet"><span>✦</span><div><b>Aura Mini</b><small>Compacto · discreto</small></div><strong>S/ 89.90</strong></div>
                <div className="mini-product rose"><span>∞</span><div><b>Duo Touch</b><small>Para compartir</small></div><strong>S/ 119.90</strong></div>
                <div className="mini-total"><span>Total referencial</span><b>S/ 209.80</b></div>
                <div className="fake-qr">▦</div>
                <div className="mini-code">VL-8F21-X7A</div>
              </div>
            </div>
            <div className="floating-pill pill-1"><BadgeCheck size={16}/> Separado</div>
            <div className="floating-pill pill-2"><PackageCheck size={16}/> Recojo rápido</div>
          </motion.div>
        </section>

        <section className="how" id="recojo">
          <div className="section-title">
            <div>
              <div className="eyebrow">CERO VUELTAS</div>
              <h2>El flujo en 3 movimientos</h2>
            </div>
            <p>Diseñado primero para celular: una mano, pocos toques y siempre sabes dónde estás.</p>
          </div>
          <div className="steps">
            <div className="step"><b>01</b><ShoppingBag/><h3>Arma tu bolsa</h3><p>Guarda productos mientras exploras.</p></div>
            <div className="step"><b>02</b><QrCode/><h3>Genera tu código</h3><p>Obtienes QR, código y link compartible.</p></div>
            <div className="step"><b>03</b><Store/><h3>Recoge y paga</h3><p>Muestras el QR o dictas tu código en tienda.</p></div>
          </div>
        </section>

        <section className="catalog" id="catalogo">
          <div className="section-title compact">
            <div><div className="eyebrow">EXPLORA SIN PRISA</div><h2>Encuentra tu opción</h2></div>
          </div>

          <div className="catalog-tools">
            <label className="searchbox">
              <Search size={18}/>
              <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Buscar algo..." />
              {query && <button onClick={() => setQuery('')}><X size={16}/></button>}
            </label>
            <div className="chips">
              {categories.map(c => <button key={c} className={category === c ? 'active' : ''} onClick={() => setCategory(c)}>{c}</button>)}
            </div>
          </div>

          <div className="product-grid">
            {filtered.map((p, i) => (
              <motion.article
                key={p.id}
                className={`product-card ${p.tone}`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: .1 }}
                transition={{ delay: i * .04 }}
                whileHover={{ y: -7, rotateX: 2, rotateY: -2 }}
              >
                <button className={`heart ${favorites.includes(p.id) ? 'on' : ''}`} onClick={() => toggleFav(p.id)}><Heart size={18} fill={favorites.includes(p.id) ? 'currentColor' : 'none'}/></button>
                <div className="product-visual" onClick={() => setDetail(p)}>
                  <div className="product-halo"/>
                  <span>{p.icon}</span>
                  <small>{p.badge}</small>
                </div>
                <div className="product-info" onClick={() => setDetail(p)}>
                  <span className="category">{p.category}</span>
                  <h3>{p.name}</h3>
                  <p>{p.short}</p>
                </div>
                <div className="product-foot">
                  <b>{money(p.price)}</b>
                  <button onClick={() => add(p.id)}><Plus size={19}/> Agregar</button>
                </div>
              </motion.article>
            ))}
          </div>
        </section>

        <section className="privacy" id="privacidad">
          <div className="privacy-art"><ShieldCheck size={68}/></div>
          <div>
            <div className="eyebrow">PRIVACIDAD POR DISEÑO</div>
            <h2>Comparte la bolsa, no tus datos.</h2>
            <p>Esta V1 genera un link que contiene únicamente la selección de productos, cantidades y código de recojo. No incluye nombre, teléfono ni dirección.</p>
          </div>
          <div className="privacy-badges">
            <span><ShieldCheck/> Sin registro obligatorio</span>
            <span><Store/> Sin envío a domicilio</span>
            <span><PackageCheck/> Recojo presencial</span>
          </div>
        </section>
      </main>

      <div className="mobile-dock">
        <a href="#inicio"><Home/><span>Inicio</span></a>
        <a href="#catalogo"><Search/><span>Explorar</span></a>
        <button className="dock-bag" onClick={() => setCartOpen(true)}><Bag/><b>{cartCount || ''}</b><span>Bolsa</span></button>
        <button onClick={() => setAssistantOpen(true)}><Bot/><span>Vela</span></button>
      </div>

      <button className="assistant-orb" onClick={() => setAssistantOpen(v => !v)}>
        <span className="assistant-face">V</span>
        <i/>
      </button>

      <AnimatePresence>
        {assistantOpen && (
          <motion.aside className="assistant-panel" initial={{ opacity: 0, y: 20, scale: .98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 20, scale: .98 }}>
            <div className="assistant-head">
              <div><span className="assistant-face mini">V</span><div><b>Vela</b><small><i/> Asistente VELORA</small></div></div>
              <button onClick={() => setAssistantOpen(false)}><X/></button>
            </div>
            <div className="assistant-messages">
              {messages.map((m, idx) => <div key={idx} className={`msg ${m.by}`}>{m.text}</div>)}
            </div>
            <div className="quick-prompts">
              <button onClick={() => assistantReply('Muéstrame algo discreto')}>Algo discreto</button>
              <button onClick={() => assistantReply('Abrir mi bolsa')}>Mi bolsa</button>
              <button onClick={() => assistantReply('Quiero recojo')}>Recojo</button>
            </div>
            <div className="chatbar">
              <button className="mic" onClick={startVoice}><Mic size={18}/></button>
              <input ref={inputRef} value={chatText} onChange={e => setChatText(e.target.value)} onKeyDown={e => e.key === 'Enter' && sendChat()} placeholder="Escribe o habla..." />
              <button className="send" onClick={sendChat}><Send size={18}/></button>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {detail && (
          <motion.div className="drawer-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setDetail(null)}>
            <motion.div className="product-drawer" initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} onClick={e => e.stopPropagation()}>
              <button className="drawer-close" onClick={() => setDetail(null)}><X/></button>
              <div className={`detail-visual ${detail.tone}`}><span>{detail.icon}</span></div>
              <span className="category">{detail.category}</span>
              <h2>{detail.name}</h2>
              <p>{detail.detail}</p>
              <div className="detail-notes"><span><ShieldCheck/> Empaque discreto</span><span><Store/> Recojo en tienda</span></div>
              <div className="drawer-foot"><b>{money(detail.price)}</b><button className="primary" onClick={() => { add(detail.id); setDetail(null) }}>Agregar a bolsa <Bag size={18}/></button></div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {cartOpen && (
          <motion.div className="drawer-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setCartOpen(false)}>
            <motion.aside className="cart-drawer" initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} onClick={e => e.stopPropagation()}>
              <div className="cart-head">
                <div><span className="eyebrow">TU SELECCIÓN</span><h2>Mi bolsa <small>{cartCount}</small></h2></div>
                <button onClick={() => setCartOpen(false)}><X/></button>
              </div>

              {!reservation ? (
                <>
                  <div className="cart-lines">
                    {!cartLines.length && <div className="empty"><Bag size={46}/><h3>Tu bolsa está vacía</h3><p>Explora el catálogo y agrega lo que te guste.</p><button className="primary" onClick={() => setCartOpen(false)}>Explorar</button></div>}
                    {cartLines.map(p => (
                      <div className="cart-line" key={p.id}>
                        <div className={`line-visual ${p.tone}`}>{p.icon}</div>
                        <div className="line-info"><b>{p.name}</b><small>{p.category}</small><strong>{money(p.price)}</strong></div>
                        <div className="qty">
                          <button onClick={() => setQty(p.id, p.qty - 1)}>{p.qty === 1 ? <Trash2 size={15}/> : <Minus size={15}/>}</button>
                          <span>{p.qty}</span>
                          <button onClick={() => setQty(p.id, p.qty + 1)}><Plus size={15}/></button>
                        </div>
                      </div>
                    ))}
                  </div>
                  {!!cartLines.length && (
                    <div className="cart-summary">
                      <div><span>Total referencial</span><b>{money(total)}</b></div>
                      <p><Info size={15}/> El pago se realiza únicamente al recoger en tienda.</p>
                      <button className="primary huge" onClick={makeReservation}>Preparar recojo <QrCode size={20}/></button>
                    </div>
                  )}
                </>
              ) : (
                <div className="reservation">
                  <div className="success-mark"><PackageCheck/></div>
                  <div className="eyebrow">LISTO PARA RECOJO</div>
                  <h2>Tu bolsa ya tiene código</h2>
                  <p>Muestra el QR en tienda o dicta el código. También puedes compartir esta selección.</p>
                  <div className="qr-card">
                    <QRCodeSVG value={reservation.share} size={188} bgColor="#ffffff" fgColor="#0a0710" level="M" />
                  </div>
                  <button className="code-box" onClick={() => copy(reservation.code, 'Código copiado')}>
                    <span>CÓDIGO DE RECOJO</span><b>{reservation.code}</b><Copy size={17}/>
                  </button>
                  <div className="reservation-actions">
                    <button className="primary" onClick={shareReservation}><Share2 size={18}/> Compartir bolsa</button>
                    <button className="soft" onClick={() => copy(reservation.share, 'Link copiado')}><Copy size={18}/> Copiar link</button>
                  </div>
                  <div className="reservation-mini">
                    {reservation.items.map(i => <span key={i.id}>{i.name} × {i.qty}</span>)}
                  </div>
                  <button className="ghost" onClick={() => setReservation(null)}><ChevronLeft size={17}/> Volver a editar</button>
                </div>
              )}
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>{toast && <motion.div className="toast" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 20, opacity: 0 }}>{toast}</motion.div>}</AnimatePresence>
    </div>
  )
}

export default App
