import { useState, useEffect, useMemo } from "react";
import "./App.css";

const menus = [
  { id: 1, name: "Teh Original", price: 5000, category: "Original", img: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=300", desc: "Kesegaran daun teh pegunungan asli." },
  { id: 2, name: "Teh Lemon", price: 7000, category: "Fruit Series", img: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=300", desc: "Asam seger lemon pilihan, auto melek!" },
  { id: 3, name: "Teh Susu", price: 8000, category: "Milk Series", img: "https://images.unsplash.com/photo-1571328003758-4a392120563d?w=300", desc: "Creamy susu ketemu teh, maut!" },
  { id: 4, name: "Teh Yakult", price: 10000, category: "Fruit Series", img: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=300", desc: "Sehat, seger, dan bikin nagih terus." },
  { id: 5, name: "Leci Tea", price: 12000, category: "Fruit Series", img: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=300", desc: "Ada buah leci aslinya di dalam!" },
];

const quotes = [
  "Hidup itu kayak teh, manisnya lu yang tentuin.",
  "Haus itu manusiawi, tapi beli Miwa itu solusi.",
  "Rehat sejenak, sruput Miwa, lanjut kerja lagi.",
  "Jangan lupa bersyukur atas segelas kesegaran hari ini."
];

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [activeCat, setActiveCat] = useState("Semua");
  const [cart, setCart] = useState([]);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [name, setName] = useState("");
  const [pickupTime, setPickupTime] = useState("");
  const [note, setNote] = useState("");
  const [quoteIdx, setQuoteIdx] = useState(0);

  useEffect(() => {
    setTimeout(() => setShowSplash(false), 3000);
    const qTimer = setInterval(() => setQuoteIdx(p => (p + 1) % quotes.length), 4000);
    return () => clearInterval(qTimer);
  }, []);

  const addToCart = (m) => {
    setCart(prev => {
      const ex = prev.find(i => i.id === m.id);
      if (ex) return prev.map(i => i.id === m.id ? { ...i, qty: i.qty + 1 } : i);
      return [...prev, { ...m, qty: 1 }];
    });
  };

  const removeFromCart = (id) => {
    setCart(prev => prev.map(i => i.id === id ? { ...i, qty: i.qty - 1 } : i).filter(i => i.qty > 0));
  };

  const totalPrice = cart.reduce((acc, item) => acc + (item.price * item.qty), 0);

  const sendOrder = () => {
    if (!name || !pickupTime) return alert("Nama & Jam Jemput jangan kosong, cukk! 🙏");
    const list = cart.map((i, idx) => `${idx + 1}. *${i.name}* (${i.qty}x) - Rp${(i.price * i.qty).toLocaleString()}`).join('%0A');
    const msg = `Halo Teh Miwa! 👋%0A%0A*DETAIL PESANAN WEB*%0A👤 *Nama:* ${name}%0A⏰ *Jam Jemput:* ${pickupTime}%0A🛒 *Pesanan:*%0A${list}%0A%0A📝 *Catatan (Es/Gula):*%0A${note || "-"}%0A%0A💰 *TOTAL: Rp${totalPrice.toLocaleString()}*%0A%0A_Saya meluncur ke booth, pesanan dibuat pas saya sampai ya!_ 🚀`;
    window.open(`https://wa.me/628123456789?text=${msg}`, "_blank");
  };

  const filtered = activeCat === "Semua" ? menus : menus.filter(m => m.category === activeCat);

  return (
    <div className="app-shell">
      {showSplash && (
        <div className="premium-splash">
          <div className="splash-content">
            <div className="splash-leaf">🍃</div>
            <h1 className="splash-brand">TEH MIWA</h1>
            <div className="premium-line"></div>
            <p className="premium-est">EST 2026</p>
          </div>
        </div>
      )}

      <div className={`main-ui ${!showSplash ? "show" : ""}`}>
        <nav className="glass-nav">
          <div className="brand">🍃 <span>MIWA</span></div>
          <div className="status-indicator"><span>●</span> OPEN</div>
        </nav>

        <header className="hero-pro">
          <p className="hero-tag">#PesanDuluJemputLaluBayar</p>
          <h2>Gak Perlu Antri,<br/><span className="text-grad">Langsung Sruput!</span></h2>
          <div className="alert-glass">
            ⚡ Pesanan dikerjakan saat tiba di booth biar es gak cair!
          </div>
        </header>

        <div className="filter-wrapper">
          {["Semua", "Original", "Milk Series", "Fruit Series"].map(c => (
            <button key={c} onClick={() => setActiveCat(c)} className={`pill ${activeCat === c ? 'active' : ''}`}>{c}</button>
          ))}
        </div>

        <div className="menu-container">
          {filtered.map((m, idx) => (
            <div key={m.id} className="menu-card-pro" style={{animationDelay: `${idx * 0.1}s`}}>
              <div className="img-holder"><img src={m.img} alt="" /></div>
              <div className="card-info">
                <h3>{m.name}</h3>
                <p>{m.desc}</p>
                <div className="card-footer-row">
                  <strong>Rp{m.price.toLocaleString()}</strong>
                  <button onClick={() => addToCart(m)} className="btn-add">+</button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <footer className="footer-elegant">
          <div className="quote-wrap">
            <p key={quoteIdx} className="quote-fade">"{quotes[quoteIdx]}"</p>
          </div>
          <div className="footer-meta">
            <span className="footer-logo">🍃 MIWA</span>
            <p>Segernya Masa Kini</p>
            <small>© 2026 Teh Miwa Indonesia</small>
          </div>
        </footer>

        {cart.length > 0 && (
          <div className="action-bar-float" onClick={() => setIsCheckoutOpen(true)}>
            <div className="bar-left">
              <span className="qty-tag">{cart.reduce((a,b)=>a+b.qty,0)} Item</span>
              <span className="total-tag">Rp{totalPrice.toLocaleString()}</span>
            </div>
            <div className="bar-right">Cek Out ➔</div>
          </div>
        )}

        {isCheckoutOpen && (
          <div className="modal-overlay">
            <div className="bottom-sheet">
              <div className="sheet-header">
                <h3>Detail Pesanan</h3>
                <button onClick={() => setIsCheckoutOpen(false)} className="btn-close">✕</button>
              </div>
              <div className="scroll-area">
                {cart.map(i => (
                  <div key={i.id} className="cart-row">
                    <div className="cart-meta">
                      <h4>{i.name}</h4>
                      <span>Rp{(i.price * i.qty).toLocaleString()}</span>
                    </div>
                    <div className="stepper-pro">
                      <button onClick={() => removeFromCart(i.id)}>−</button>
                      <span>{i.qty}</span>
                      <button onClick={() => addToCart(i)}>+</button>
                    </div>
                  </div>
                ))}
                <div className="form-group-pro">
                  <label>Nama Pembeli</label>
                  <input type="text" placeholder="Nama lu siapa cukk?" value={name} onChange={e=>setName(e.target.value)} />
                  <label>Jam Jemput</label>
                  <input type="time" value={pickupTime} onChange={e=>setPickupTime(e.target.value)} />
                  <label>Catatan (Gula/Es)</label>
                  <textarea placeholder="Contoh: Es dikit, kurang gula ya!" value={note} onChange={e=>setNote(e.target.value)} />
                </div>
              </div>
              <div className="sheet-footer-pro">
                <p>⚠️ Bayar di booth ya pas jemput!</p>
                <button className="btn-whatsapp" onClick={sendOrder}>Pesan Sekarang 🚀</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
