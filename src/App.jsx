import { useState, useMemo, useEffect } from "react";
import "./App.css";

const menus = [
  { id: 1, name: "Teh Original", price: 5000, category: "Original", img: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=300", desc: "Kesegaran daun teh asli." },
  { id: 2, name: "Teh Lemon", price: 7000, category: "Fruit Series", img: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=300", desc: "Asam seger lemon pilihan." },
  { id: 3, name: "Teh Susu", price: 8000, category: "Milk Series", img: "https://images.unsplash.com/photo-1571328003758-4a392120563d?w=300", desc: "Creamy susu ketemu teh." },
  { id: 4, name: "Teh Yakult", price: 10000, category: "Fruit Series", img: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=300", desc: "Sehat, seger, bikin nagih." },
  { id: 5, name: "Leci Tea", price: 12000, category: "Fruit Series", img: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=300", desc: "Ada buah leci aslinya!" },
];

const quotes = [
  "Hidup itu kayak teh, pahit manisnya tergantung cara lu nyeduhnya.",
  "Haus itu manusiawi, tapi beli Teh Miwa itu solusi hakiki.",
  "Masa depan cerah dimulai dari tenggorokan yang seger."
];

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [activeCat, setActiveCat] = useState("Semua");
  const [cart, setCart] = useState([]);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [name, setName] = useState("");
  const [note, setNote] = useState(""); // State baru untuk catatan tambahan
  const [currentQuote, setCurrentQuote] = useState(0);

  useEffect(() => {
    localStorage.removeItem("miwaCart");
    setTimeout(() => setShowSplash(false), 3000);
    const qTimer = setInterval(() => setCurrentQuote(p => (p + 1) % quotes.length), 5000);
    return () => clearInterval(qTimer);
  }, []);

  const totalPrice = cart.reduce((acc, item) => acc + (item.price * item.qty), 0);
  const totalQty = cart.reduce((acc, item) => acc + item.qty, 0);

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

  const sendOrder = () => {
    if (!name) return alert("Isi nama dulu cukk! 🙏");
    
    // FORMAT PESANAN DETAIL
    const itemDetails = cart.map((i, idx) => `${idx + 1}. *${i.name}* (${i.qty}x) - Rp${(i.price * i.qty).toLocaleString()}`).join('%0A');
    
    const message = `Halo Teh Miwa! 👋%0A%0A Saya mau pesan dong:%0A` +
      `👤 *Nama:* ${name}%0A` +
      `🛒 *Pesanan:*%0A${itemDetails}%0A%0A` +
      `📝 *Catatan:* ${note || "-"}%0A%0A` +
      `💰 *Total Bayar: Rp${totalPrice.toLocaleString()}*%0A%0A` +
      `*#PesanDuluJemputLaluBayar* 🚀`;

    window.open(`https://wa.me/628123456789?text=${message}`, "_blank");
  };

  const filtered = activeCat === "Semua" ? menus : menus.filter(m => m.category === activeCat);

  return (
    <div className="app-shell">
      {showSplash && (
        <div className="splash-screen">
          <div className="splash-content">
            <div className="splash-logo">🍃</div>
            <h1 className="splash-title">Teh Miwa</h1>
            <div className="loading-bar"></div>
          </div>
        </div>
      )}

      <div className={`main-layout ${!showSplash ? 'show' : ''}`}>
        <nav className="navbar">
          <span className="logo-text">🍃 Teh Miwa</span>
          <div className="status-badge">Booth Buka</div>
        </nav>

        <header className="hero">
          <p className="hero-sub">#PesanDuluJemputLaluBayar</p>
          <h1>Gak Pake Antri, <br/><span className="miwa-highlight">Langsung Sruput!</span></h1>
          <div className="booth-pop">📍 Ambil di Booth Miwa terdekat!</div>
        </header>

        <div className="cat-scroll">
          {["Semua", "Original", "Milk Series", "Fruit Series"].map(c => (
            <button key={c} onClick={() => setActiveCat(c)} className={`cat-pill ${activeCat === c ? 'active' : ''}`}>{c}</button>
          ))}
        </div>

        <div className="menu-list">
          {filtered.map(m => (
            <div key={m.id} className="menu-card">
              <img src={m.img} alt="" className="menu-img" />
              <div className="card-info">
                <h3>{m.name}</h3>
                <p className="m-desc">{m.desc}</p>
                <div className="card-bottom">
                  <span className="m-price">Rp{m.price.toLocaleString()}</span>
                  <button className="add-btn" onClick={() => addToCart(m)}>+</button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <footer className="footer">
          <p className="quote-text animate-fade">"{quotes[currentQuote]}"</p>
          <small>© 2026 Teh Miwa Indonesia</small>
        </footer>

        {cart.length > 0 && !isCheckoutOpen && (
          <div className="float-cart" onClick={() => setIsCheckoutOpen(true)}>
            <div className="cart-left">
              <span>🛒 {totalQty} Item</span>
              <p>Rp{totalPrice.toLocaleString()}</p>
            </div>
            <span className="order-now">Cek Out &rarr;</span>
          </div>
        )}

        {isCheckoutOpen && (
          <div className="modal-overlay">
            <div className="modal-box">
              <div className="modal-header">
                <h3>Detail Pesanan</h3>
                <button onClick={() => setIsCheckoutOpen(false)}>✕</button>
              </div>
              <div className="item-list">
                {cart.map(i => (
                  <div key={i.id} className="cart-item">
                    <div className="item-info">
                      <h4>{i.name}</h4>
                      <span>Rp{(i.price * i.qty).toLocaleString()}</span>
                    </div>
                    <div className="stepper">
                      <button onClick={() => removeFromCart(i.id)}>−</button>
                      <span>{i.qty}</span>
                      <button onClick={() => addToCart(i)}>+</button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="input-group">
                <input type="text" placeholder="Nama Kamu Siapa?" value={name} onChange={e => setName(e.target.value)} />
                <textarea 
                  placeholder="Contoh: Es dikit, kurang gula, atau tambahin topping..." 
                  value={note} 
                  onChange={e => setNote(e.target.value)}
                />
              </div>
              <button className="wa-btn" onClick={sendOrder}>Pesan Sekarang 🚀</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
