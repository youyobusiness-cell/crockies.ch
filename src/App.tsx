import { useEffect, useRef, useState } from 'react';
import { ArrowDown, ArrowRight, Check, Cookie, Instagram, Menu, Minus, Plus, ShoppingBag, Trash2, X } from 'lucide-react';

type Product = { id: string; name: string; kind: 'cookie' | 'gift'; description: string; palette: string[] };
type CartLine = { id: string; quantity: number };
const PRODUCTS: Product[] = [
  { id: 'pepites', name: 'Pépites de chocolat', kind: 'cookie', description: 'Une recette aux éclats de chocolat, à découvrir et à partager.', palette: ['#d79b5b', '#6c351d', '#9e522e'] },
  { id: 'tout-chocolat', name: 'Tout chocolat', kind: 'cookie', description: 'Une recette pensée pour les amateurs de chocolat.', palette: ['#70402c', '#321910', '#a55d36'] },
  { id: 'cacahuete', name: 'Beurre de cacahuète', kind: 'cookie', description: 'La cacahuète dans une recette gourmande à découvrir.', palette: ['#d9b873', '#79502d', '#a8773e'] },
  { id: 'petite-attention', name: 'La Petite Attention', kind: 'gift', description: 'Un petit geste qui arrive avec le sourire. Le plaisir de partager.', palette: ['#c78852', '#f1d9b6', '#ad6c48'] },
  { id: 'grand-moment', name: 'Le Grand Moment', kind: 'gift', description: 'Pour les grandes tablées et les souvenirs qui méritent leur boîte.', palette: ['#6b3526', '#f1d9b6', '#6b3526'] },
  { id: 'boite-bonheur', name: 'La Boîte à Bonheur', kind: 'gift', description: 'Une attention à offrir, à partager, ou à garder juste un peu.', palette: ['#849575', '#f1d9b6', '#849575'] },
];
const EMAIL = 'contact.crockies@gmail.com';
const SOCIALS = [
  { name: 'Instagram', href: 'https://www.instagram.com/crockies.officiel/' },
  { name: 'TikTok', href: 'https://www.tiktok.com/@crockies.officiel' },
  { name: 'Facebook', href: 'https://www.facebook.com/profile.php?id=61594312695276&locale=fr_FR' },
];
const asset = (path: string) => `${import.meta.env.BASE_URL}${path.replace(/^\//, '')}`;

function readCart(): CartLine[] {
  try {
    const stored: unknown = JSON.parse(localStorage.getItem('crockies-cart-v1') ?? '[]');
    if (!Array.isArray(stored)) return [];
    return stored.filter((line): line is CartLine => {
      if (typeof line !== 'object' || line === null) return false;
      const value = line as Record<string, unknown>;
      return PRODUCTS.some((product) => product.id === value.id)
        && Number.isInteger(value.quantity)
        && Number(value.quantity) > 0
        && Number(value.quantity) <= 99;
    });
  } catch {
    return [];
  }
}

function CookieDrawing({ palette, label }: { palette: string[]; label: string }) {
  const chips = [[75, 69, 10], [118, 82, 8], [93, 112, 11], [53, 119, 7], [132, 131, 10], [71, 151, 8], [112, 51, 6], [48, 89, 5]];
  return <svg className="cookie-illustration" viewBox="0 0 180 180" role="img" aria-label={`Illustration de cookie ${label}`}>
    <circle cx="90" cy="90" r="77" fill={palette[0]} />
    <circle cx="90" cy="90" r="70" fill="none" stroke="#f2d9bb" strokeWidth="2" opacity=".6" />
    {chips.map(([x, y, r], i) => <path key={i} d={`M ${x-r} ${y} Q ${x-r} ${y-r} ${x} ${y-r*.7} Q ${x+r} ${y-r} ${x+r*.8} ${y} Q ${x+r} ${y+r*.8} ${x} ${y+r} Q ${x-r} ${y+r*.6} ${x-r} ${y}Z`} fill={palette[1]} />)}
    <path d="M35 102c4 30 27 53 57 57" fill="none" stroke={palette[2]} strokeWidth="2" opacity=".55" />
    <circle cx="90" cy="90" r="77" fill="transparent" stroke="#fff2de" strokeWidth="1.3" opacity=".7" />
  </svg>;
}

function GiftDrawing({ palette }: { palette: string[] }) {
  return <div className="gift-box" style={{ background: palette[1] }} aria-hidden="true"><span className="gift-bow" style={{ borderColor: palette[2] }} /><span className="gift-letter">pour toi</span></div>;
}

function App() {
  const [cart, setCart] = useState<CartLine[]>(readCart);
  const [cartOpen, setCartOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [added, setAdded] = useState<string | null>(null);
  const closeCartRef = useRef<HTMLButtonElement>(null);
  useEffect(() => { try { localStorage.setItem('crockies-cart-v1', JSON.stringify(cart)); } catch { /* Browser storage can be unavailable; cart still works for this visit. */ } }, [cart]);
  useEffect(() => {
    const initialTargetId = window.location.hash.slice(1);
    if (!initialTargetId) return;
    const frame = window.requestAnimationFrame(() => {
      document.getElementById(initialTargetId)?.scrollIntoView({ block: 'start' });
    });
    return () => window.cancelAnimationFrame(frame);
  }, []);
  useEffect(() => {
    if (!cartOpen && !menuOpen) return;
    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const focusFrame = cartOpen ? window.requestAnimationFrame(() => closeCartRef.current?.focus()) : 0;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') { setCartOpen(false); setMenuOpen(false); return; }
      if (event.key !== 'Tab' || !cartOpen) return;
      const dialog = document.getElementById('cart-dialog');
      const focusable = dialog ? Array.from(dialog.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])')) : [];
      if (!focusable.length) { event.preventDefault(); return; }
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      if (focusFrame) window.cancelAnimationFrame(focusFrame);
      if (cartOpen) previousFocus?.focus();
    };
  }, [cartOpen, menuOpen]);
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);
  const add = (id: string) => {
    setCart((current) => current.some((line) => line.id === id)
      ? current.map((line) => line.id === id ? { ...line, quantity: Math.min(line.quantity + 1, 99) } : line)
      : [...current, { id, quantity: 1 }]);
    setAdded(id); window.setTimeout(() => setAdded((current) => current === id ? null : current), 1600);
  };
  const changeQuantity = (id: string, delta: number) => setCart((current) => current
    .map((line) => line.id === id ? { ...line, quantity: Math.max(0, Math.min(line.quantity + delta, 99)) } : line)
    .filter((line) => line.quantity > 0));
  const remove = (id: string) => setCart((current) => current.filter((line) => line.id !== id));
  const mailto = () => {
    const lines = cart.map((line) => `${line.quantity} × ${PRODUCTS.find((product) => product.id === line.id)?.name ?? line.id}`);
    const subject = encodeURIComponent('Demande de commande — Crockies');
    const body = encodeURIComponent(`Bonjour Crockies,\n\nJ’aimerais me renseigner sur la disponibilité et les prix pour :\n\n${lines.join('\n')}\n\nMerci de me confirmer les détails par retour d’e-mail.\n\n`);
    window.location.href = `mailto:${EMAIL}?subject=${subject}&body=${body}`;
  };
  const closeMenu = () => setMenuOpen(false);
  const openCart = () => { closeMenu(); setCartOpen(true); };
  const nav = <><a className="nav-link" href="#histoire" onClick={closeMenu}>Notre histoire</a><a className="nav-link" href="#cookies" onClick={closeMenu}>Les cookies</a><a className="nav-link" href="#cadeaux" onClick={closeMenu}>Coffrets cadeaux</a><a className="nav-link" href="#contact" onClick={closeMenu}>Contact</a></>;
  return <div className="site-shell">
    <div className="top-note">Une petite douceur imaginée à Fribourg · élaborée en Suisse</div>
    <header className="site-header">
      <a href="#accueil" aria-label="Crockies, accueil"><img className="brand-logo" src={asset('assets/crockies-logo-header.png')} alt="Crockies" width="172" height="55" /></a>
      <nav className="desktop-nav" aria-label="Navigation principale">{nav}</nav>
      <div className="header-actions">
        <button className="cart-button" onClick={openCart} aria-label={`Ouvrir le panier, ${count} article${count > 1 ? 's' : ''}`} data-testid="button-open-cart"><ShoppingBag size={15} /> Panier <span className="cart-count" aria-live="polite">{count}</span></button>
        <button className="menu-button" onClick={() => setMenuOpen((open) => !open)} aria-expanded={menuOpen} aria-controls="mobile-navigation" aria-label={menuOpen ? 'Fermer le menu' : 'Ouvrir le menu'} data-testid="button-mobile-menu">{menuOpen ? <X size={19} /> : <Menu size={19} />}</button>
      </div>
      {menuOpen && <nav className="mobile-menu" id="mobile-navigation" aria-label="Navigation mobile">{nav}</nav>}
    </header>
    <main>
      <section className="hero" id="accueil">
        <div className="hero-copy">
          <div className="eyebrow">Fait pour les petits grands moments</div>
          <h1>Un cookie.<br /><em>Un vrai moment.</em></h1>
          <p className="hero-lead">Des recettes pensées avec soin, préparées en Suisse. À offrir, à partager, ou à savourer sans raison particulière.</p>
          <a className="button-dark" href="#cookies">Découvrir les cookies <ArrowRight size={15} /></a>
          <div className="hero-meta"><span className="swatches"><i style={{ background: '#dba96f' }} /><i style={{ background: '#6b351d' }} /><i style={{ background: '#a6b58f' }} /></span>Des recettes adaptées aux saisons et aux occasions</div>
        </div>
        <div className="hero-art"><img className="hero-brand-mark" src={asset('assets/crockies-logo-hero.png')} alt="Crockies — cookies artisanaux, élaboré en Suisse" width="600" height="600" /></div>
        <div className="scroll-note">Une histoire à découvrir <ArrowDown size={12} /></div>
      </section>
      <section className="story-band" id="histoire">
        <div><div className="eyebrow">01 — L’aventure Crockies</div><h2>Une petite<br /><em>bouchée</em> de<br />bonheur.</h2></div>
        <p className="story-copy">Crockies est une mini-entreprise de Fribourg, née dans le cadre du Company Programme de Young Enterprise Switzerland. Notre envie : faire d’un cookie une attention simple, généreuse et bien pensée.</p>
        <div className="story-points"><div className="story-point"><strong>01</strong><span>Des recettes qui suivent les saisons et les occasions.</span></div><div className="story-point"><strong>02</strong><span>Des cookies élaborés en Suisse avec un partenaire spécialiste.</span></div></div>
      </section>
      <section className="section products-section" id="cookies">
        <div className="section-head"><div className="section-heading"><div className="eyebrow">02 — À découvrir</div><h2>Choisissez votre<br /><em>pause.</em></h2></div><p className="section-intro">Trois recettes à découvrir, chacune avec sa personnalité. Les prix et disponibilités sont confirmés par e-mail.</p></div>
        <div className="product-grid">{PRODUCTS.filter((product) => product.kind === 'cookie').map((product) => <article className="product-card" key={product.id} data-testid={`card-product-${product.id}`}>
          <div className="cookie-plate"><CookieDrawing palette={product.palette} label={product.name} /></div><div className="product-info"><h3>{product.name}</h3><p>{product.description}</p><button className="card-add" onClick={() => add(product.id)} data-testid={`button-add-${product.id}`}>{added === product.id ? <><Check size={14} /> Ajouté au panier</> : 'Ajouter à ma demande'}</button></div>
        </article>)}</div>
      </section>
      <section className="section gift-section" id="cadeaux">
        <div className="section-head"><div className="section-heading"><div className="eyebrow" style={{ color: '#e6ad78' }}>03 — À offrir, à partager</div><h2>Pour chaque<br /><em>attention.</em></h2></div><p className="section-intro">Un coffret à offrir, à choisir selon l’occasion. Écrivez-nous pour connaître le contenu, les prix et les disponibilités.</p></div>
        <div className="gift-grid">{PRODUCTS.filter((product) => product.kind === 'gift').map((product) => <article className="gift-card" key={product.id} data-testid={`card-product-${product.id}`}>
          <div className="gift-art"><GiftDrawing palette={product.palette} /><span className="gift-seal">avec<br />soin</span></div><div className="gift-info"><h3>{product.name}</h3><small>Coffret cadeau</small><p>{product.description}</p><button className="gift-add" onClick={() => add(product.id)} data-testid={`button-add-${product.id}`}>{added === product.id ? 'Ajouté à votre demande' : 'Ajouter à ma demande'}</button></div>
        </article>)}</div>
      </section>
      <section className="section note-section">
        <div><div className="eyebrow">04 — Le petit mot</div><h2>Les mots<br />restent.<br /><em>Les miettes<br />aussi.</em></h2></div>
        <div className="note-card"><span>Une carte dans chaque boîte</span><p>« Pour une personne vraiment chouette. »</p><small>Un petit mot, une grande attention.</small></div>
      </section>
      <section className="section process-section">
        <div className="section-head"><div className="section-heading"><div className="eyebrow">05 — En toute simplicité</div><h2>Une demande,<br /><em>pas un paiement.</em></h2></div><p className="section-intro">Le panier vous aide à préparer votre message. C’est Crockies qui vous répondra pour la suite.</p></div>
        <div className="process-grid"><div className="process-item"><b>01</b><h3>Composez votre sélection</h3><p>Ajoutez les recettes et coffrets qui vous intéressent à votre panier. Celui-ci reste dans votre navigateur.</p></div><div className="process-item"><b>02</b><h3>Préparez un e-mail</h3><p>Le bouton de demande ouvre un brouillon prérempli avec votre sélection, adressé à Crockies.</p></div><div className="process-item"><b>03</b><h3>Nous vous répondons</h3><p>Envoyez vous-même l’e-mail. Prix et disponibilités seront confirmés par Crockies en réponse.</p></div></div>
      </section>
      <section className="section contact-section" id="contact">
        <div className="contact-copy"><div className="eyebrow">06 — Parlons cookies</div><h2>Une question,<br /><em>une envie.</em></h2><p>Pour une demande de coffret, une question sur les recettes ou simplement pour nous écrire, contactez-nous directement.</p><a className="button-outline" href={`mailto:${EMAIL}`}>Écrire à Crockies <ArrowRight size={15} /></a></div>
        <div className="contact-card"><div className="eyebrow">Crockies · Fribourg</div><address>Route du Château 14<br />1772 Nierlet-les-Bois<br />Suisse</address><a className="contact-email" href={`mailto:${EMAIL}`}>{EMAIL}</a><p>Les demandes se préparent par e-mail. Aucune commande n’est réservée ou confirmée avant une réponse de Crockies.</p><a className="button-light" href="#cookies">Préparer une demande <ArrowRight size={14} /></a></div>
      </section>
    </main>
    <footer className="footer">
        <div className="footer-main"><div className="footer-brand"><a href="#accueil" aria-label="Retour à l’accueil Crockies"><img src={asset('assets/crockies-logo-footer.png')} alt="Crockies" width="190" height="61" /></a><p>Des recettes imaginées avec soin à Fribourg. Des petits plaisirs à partager, élaborés en Suisse.</p><div className="social-links">{SOCIALS.map((social) => <a href={social.href} key={social.name} target="_blank" rel="noopener noreferrer" aria-label={`Crockies sur ${social.name}`} data-testid={`link-social-${social.name.toLowerCase()}`}>{social.name === 'Instagram' ? <Instagram size={15} /> : social.name === 'TikTok' ? <span style={{ fontWeight: 700, fontSize: 11 }}>tk</span> : <span style={{ fontWeight: 700, fontSize: 14 }}>f</span>}</a>)}</div></div><div className="footer-links"><h4>Découvrir</h4><a href="#histoire">Notre histoire</a><a href="#cookies">Les cookies</a><a href="#cadeaux">Les coffrets</a></div><div className="footer-links"><h4>Nous écrire</h4><a href={`mailto:${EMAIL}`}>{EMAIL}</a><span style={{ color: '#d6c0b0', fontSize: 11, lineHeight: 1.7 }}>Route du Château 14<br />1772 Nierlet-les-Bois, Suisse</span></div></div>
      <div className="footer-bottom"><span>© Crockies — mini-entreprise à Fribourg</span><span>Élaboré en Suisse · avec soin</span></div>
    </footer>
    {cartOpen && <><button className="drawer-backdrop" aria-label="Fermer le panier" onClick={() => setCartOpen(false)} /><aside className="cart-drawer" id="cart-dialog" role="dialog" aria-modal="true" aria-labelledby="cart-title"><div className="drawer-head"><h2 id="cart-title">Votre sélection <span style={{ color: '#9b5435' }}>({count})</span></h2><button className="icon-button" ref={closeCartRef} aria-label="Fermer le panier" onClick={() => setCartOpen(false)}><X size={18} /></button></div>
      {cart.length ? <><div className="cart-items">{cart.map((line) => { const product = PRODUCTS.find((item) => item.id === line.id); if (!product) return null; return <div className="cart-row" key={line.id} data-testid={`cart-line-${line.id}`}><div className="cart-mini">{product.kind === 'cookie' ? <CookieDrawing palette={product.palette} label={product.name} /> : <GiftDrawing palette={product.palette} />}</div><div><h3>{product.name}</h3><small>{product.kind === 'gift' ? 'Coffret cadeau' : 'Recette de cookie'}</small><div className="qty-control"><button aria-label={`Diminuer ${product.name}`} onClick={() => changeQuantity(line.id, -1)}><Minus size={12} /></button><span aria-label={`Quantité ${line.quantity}`}>{line.quantity}</span><button aria-label={`Augmenter ${product.name}`} onClick={() => changeQuantity(line.id, 1)}><Plus size={12} /></button><button className="remove-button" aria-label={`Retirer ${product.name} du panier`} onClick={() => remove(line.id)}><Trash2 size={12} /> Retirer</button></div></div></div>; })}</div><div className="drawer-foot"><a className="button-dark" href={`mailto:${EMAIL}`} onClick={(event) => { event.preventDefault(); mailto(); }}>Préparer ma demande <ArrowRight size={15} /></a><p>Le bouton ouvre un brouillon d’e-mail avec votre sélection. Vous devrez l’envoyer vous-même. Aucun paiement en ligne, rien n’est réservé ni confirmé avant la réponse de Crockies. Prix et disponibilités confirmés par e-mail.</p></div></> : <div className="empty-cart"><div><Cookie size={30} strokeWidth={1.3} color="#9b5435" /><h3>Un panier tout doux.</h3><p>Votre sélection est vide pour le moment. Choisissez une recette ou un coffret qui vous plaît.</p><a className="button-dark" href="#cookies" onClick={() => setCartOpen(false)}>Découvrir les recettes <ArrowRight size={14} /></a></div></div>}</aside></>}
  </div>;
}

export default App;
