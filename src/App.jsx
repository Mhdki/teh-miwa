import { useState, useMemo, useEffect } from "react";
import "./App.css";

const menus = [
  { id: 1, name: "Teh Original", price: 5000, category: "Original", img: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=300", desc: "Kesegaran daun teh pegunungan asli." },
  { id: 2, name: "Teh Lemon", price: 7000, category: "Fruit Series", img: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=300", desc: "Asam seger lemon pilihan, auto melek!" },
  { id: 3, name: "Teh Susu", price: 8000, category: "Milk Series", img: "https://images.unsplash.com/photo-1571328003758-4a392120563d?w=300", desc: "Creamy susu ketemu teh, perpaduan maut." },
  { id: 4, name: "Teh Yakult", price: 10000, category: "Fruit Series", img: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=300", desc: "Sehat, seger, dan bikin nagih terus." },
  { id: 5, name: "Leci Tea", price: 12000, category: "Fruit Series", img: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=300", desc: "Ada buah leci aslinya di dalam!" },
];

const quotes = [
  "Hidup itu kayak teh, pahit manisnya tergantung cara lu nyeduhnya.",
  "Haus itu manusiawi, tapi beli Teh Miwa itu solusi hakiki.",
  "Kerja terus kapan minumnya? Rehat sejenak bareng Miwa.",
  "Jangan lupa bersyukur, hari ini lu masih bisa minum enak.",
  "Masa depan cerah dimulai dari tenggorokan yang seger."
];

const categories = ["Semua", "Original", "Milk Series", "Fruit Series"];

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [activeCat, setActiveCat] = useState("Semua");
  const [cart, setCart] = useState([]);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [name, setName] = useState("");
  const [currentQuote, setCurrentQuote] = useState(0);

  // Splash & Initial Clean
  useEffect(() => {
    localStorage.removeItem("miwaCart");
    const timer = setTimeout(() => setShowSplash(false), 3000);
    const quoteTimer = setInterval(() => {
      setCurrentQuote(prev => (prev + 1) % quotes.length);
    }, 5000);
    return () => { clearTimeout(timer); clearInterval(quoteTimer); };
  }, []);

  const totalPrice = cart.reduce((acc, item) => acc + (item.price * item.qty), 0);
  const totalQty = cart.reduce((acc, item) => acc + item.qty, 0);

  const addToCart = (menu) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === menu.id);
      if (existing) return prev.map(i => i.id === menu.id ? { ...i, qty: i.qty + 1 } : i);
      return [...prev, { ...menu, qty: 1 }];
    });
  };

  const removeFromCart = (id) => {
    setCart(prev => prev.map(i => i.id === id ? { ...i, qty: i.qty - 1 } : i).filter(i => i.qty > 0));
  };

  const sendOrder = () => {
    if (!name) return alert("Isi nama dulu dong cukk! 🙏");
    const details = cart.map((i, index) => `${index + 1}. *${i.name}* (${i.qty}x)`).join('%0A');
    const msg = `Halo Teh Miwa!%0A%0A👤 *Nama:* ${name}%0A🛒 *Pesanan:*%0A${details}%0A%0A💰 *Total: Rp${totalPrice.toLocaleString()}*%0A%0A*METODE:* Pesan Dulu - Jemput - Bayar di Booth! 🚀`;
    window.open(`https://wa.me/628123456789?text=${msg}`);
  };

  const filteredMenus = useMemo(() => activeCat === "Semua" ? menus : menus.filter(m => m.category === activeCat), [activeCat]);

  return (
    <div className="app-shell">
      {showSplash && (
        <div className="splash-screen">
          <div className="splash-content">
            <span className="splash-logo">🍃</span>
            <h1 className="splash-title">Teh Miwa</h1>
            <div className="loading-bar"></div>
          </div>
        </div>
      )}

      <div className={`main-layout ${!showSplash ? 'show' : ''}`}>
        <nav className="navbar">
          <div className="logo-wrap"><span className="logo-text">Teh Miwa</span></div>
          <div className="status-badge">Booth Buka</div>
        </nav>

        <header className="hero">
          <div className="hero-content">
            <p className="hero-sub">#PesanDuluJemputLaluBayar</p>
            <h1>Gak Pake Antri, <br/><span className="miwa-highlight">Langsung Sruput!</span></h1>
            <p className="hero-p">Kenikmatan teh premium cuma 3 langkah: Pesan lewat sini, Jemput di booth, Bayar pas dapet tehnya. Simple kan, cukk?</p>
            <div className="booth-info-pop">📍 Ambil di Booth Miwa terdekat!</div>
          </div>
          <div className="hero-blob"></div>
        </header>

        <main className="main-content">
          <div className="cat-scroll">
            {categories.map(c => (
              <button 
                key={c} 
                onClick={() => setActiveCat(c)} 
                className={`cat-pill ${activeCat === c ? 'active' : ''}`}
              >
                {c}
              </button>
            ))}
          </div>

          <div className="menu-list">
            {filteredMenus.map((m, idx) => (
              <div key={m.id} className="menu-card" style={{animationDelay: `${idx * 0.1}s`}}>
                <div className="img-container"><img src={m.img} alt="" /></div>
                <div className="card-body">
                  <h3>{m.name}</h3>
                  <p className="m-desc">{m.desc}</p>
                  <div className="card-footer">
                    <span className="m-price">Rp{m.price.toLocaleString()}</span>
                    <button className="add-circle" onClick={() => addToCart(m)}>+</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </main>

        <footer className="footer">
          <div className="footer-line"></div>
          <div className="quote-container">
            <p key={currentQuote} className="quote-text animate-fade">"{quotes[currentQuote]}"</p>
          </div>
          <small>© 2026 Teh Miwa Indonesia</small>
        </footer>

        {cart.length > 0 && !isCheckoutOpen && (
          <div className="float-action bounce-in" onClick={() => setIsCheckoutOpen(true)}>
            <div className="cart-summary">
              <span>🛒 {totalQty} Item</span>
              <span className="p-item">Rp{totalPrice.toLocaleString()}</span>
            </div>
            <span className="order-now">Siap Jemput? &rarr;</span>
          </div>
        )}

        {isCheckoutOpen && (
          <div className="modal-backdrop">
            <div className="modal-sheet">
              <div className="sheet-header">
                <h3>Keranjang Lu</h3>
                <button className="trash-btn" onClick={() => {setCart([]); setIsCheckoutOpen(false);}}>🗑️</button>
                <button className="close-btn" onClick={() => setIsCheckoutOpen(false)}>✕</button>
              </div>
              <div className="booth-reminder">⚠️ Nanti bayar pas sampe di booth ya!</div>
              <div className="item-scroll">
                {cart.map(item => (
                  <div key={item.id} className="cart-item">
                    <img src={item.img} className="mini-thumb" alt="" />
                    <div className="item-meta">
                      <h4>{item.name}</h4>
                      <p>Rp{item.price.toLocaleString()}</p>
                    </div>
                    <div className="stepper-modern">
                      <button onClick={() => removeFromCart(item.id)}>−</button>
                      <span>{item.qty}</span>
                      <button onClick={() => addToCart(item)}>+</button>
                    </div>
                  </div>
                ))}
              </div>
              <input type="text" placeholder="Nama Kamu Siapa?" value={name} onChange={e => setName(e.target.value)} className="modern-input" />
              <button className="wa-submit" onClick={sendOrder}>Pesan & Jemput 🚀</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
