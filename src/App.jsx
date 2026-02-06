import { useState, useEffect, useMemo } from "react";
import "./App.css";

const menus = [
  { id: 1, name: "Teh Original", price: 5000, category: "Original", img: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=300", desc: "Kesegaran daun teh pegunungan asli." },
  { id: 2, name: "Teh Lemon", price: 7000, category: "Fruit Series", img: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=300", desc: "Asam seger lemon pilihan, auto melek!" },
  { id: 3, name: "Teh Susu", price: 8000, category: "Milk Series", img: "https://images.unsplash.com/photo-1571328003758-4a392120563d?w=300", desc: "Creamy susu ketemu teh, perpaduan maut." },
  { id: 4, name: "Teh Yakult", price: 10000, category: "Fruit Series", img: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=300", desc: "Sehat, seger, dan bikin nagih terus." },
  { id: 5, name: "Leci Tea", price: 12000, category: "Fruit Series", img: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=300", desc: "Ada buah leci aslinya di dalam!" },
];

const quotes = [
  "Hidup itu kayak teh, pahit manisnya gimana lu nyeduhnya.",
  "Haus itu manusiawi, tapi beli Miwa itu solusi hakiki.",
  "Kerja terus kapan minumnya? Rehat sejenak bareng Miwa.",
  "Jangan lupa bersyukur, hari ini lu masih bisa minum enak."
];

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [activeCat, setActiveCat] = useState("Semua");
  const [cart, setCart] = useState([]);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [name, setName] = useState("");
  const [note, setNote] = useState("");
  const [quoteIndex, setQuoteIndex] = useState(0);

  useEffect(() => {
    localStorage.removeItem("miwaCart");
    setTimeout(() => setShowSplash(false), 2500);
    const interval = setInterval(() => setQuoteIndex(p => (p + 1) % quotes.length), 5000);
    return () => clearInterval(interval);
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
  const totalQty = cart.reduce((acc, item) => acc + item.qty, 0);

  const sendOrder = () => {
    if (!name) return alert("Pake nama siapa nih, cukk? 🙏");
    
    const listOrder = cart.map((i, idx) => `${idx + 1}. *${i.name}* (${i.qty}x) - Rp${(i.price * i.qty).toLocaleString()}`).join('%0A');
    
    const message = `Halo Teh Miwa! 👋%0A%0ASaya mau pesan lewat Web nih:%0A` +
      `👤 *Nama:* ${name}%0A%0A` +
      `🛒 *Pesanan:*%0A${listOrder}%0A%0A` +
      `📝 *Catatan (Es/Gula):*%0A${note || "-"}%0A%0A` +
      `💰 *Total Bayar: Rp${totalPrice.toLocaleString()}*%0A%0A` +
      `*#PesanDuluJemputLaluBayar* 🚀%0A_Ditunggu tehnya ya!_`;

    window.open(`https://wa.me/628123456789?text=${message}`, "_blank");
  };

  const filtered = useMemo(() => activeCat === "Semua" ? menus : menus.filter(m => m.category === activeCat), [activeCat]);

  return (
    <div className="app-container">
      {showSplash && (
        <div className="splash">
          <div className="splash-box">
            <span className="splash-icon">🍃</span>
            <h1>Teh Miwa</h1>
            <div className="loader"></div>
          </div>
        </div>
      )}

      <div className={`main-content ${!showSplash ? "fade-in" : ""}`}>
        <nav className="top-nav">
          <div className="brand">🍃 <span>Teh Miwa</span></div>
          <div className="status">BOOTH OPEN</div>
        </nav>

        <header className="hero-section">
          <p className="hero-tag">#PesanDuluJemputLaluBayar</p>
          <h1>Haus? Jangan Antri,<br/><span className="highlight">Langsung Sruput!</span></h1>
          <div className="booth-badge">📍 Booth: Jl. Raya Miwa No. 1</div>
        </header>

        <div className="category-bar">
          {["Semua", "Original", "Milk Series", "Fruit Series"].map(c => (
            <button key={c} onClick={() => setActiveCat(c)} className={activeCat === c ? "active" : ""}>{c}</button>
          ))}
        </div>

        <div className="menu-container">
          {filtered.map((m, idx) => (
            <div key={m.id} className="menu-card" style={{animationDelay: `${idx * 0.1}s`}}>
              <div className="img-wrapper"><img src={m.img} alt="" /></div>
              <div className="card-detail">
                <h3>{m.name}</h3>
                <p>{m.desc}</p>
                <div className="price-row">
                  <strong>Rp{m.price.toLocaleString()}</strong>
                  <button onClick={() => addToCart(m)} className="add-btn">+</button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <footer className="main-footer">
          <div className="quote-box">
            <p key={quoteIndex} className="quote-anim">"{quotes[quoteIndex]}"</p>
          </div>
          <p className="copyright">© 2026 Teh Miwa • Segernya Masa Kini</p>
        </footer>

        {cart.length > 0 && !isCheckoutOpen && (
          <div className="floating-cart" onClick={() => setIsCheckoutOpen(true)}>
            <div className="cart-left">
              <span className="count">{totalQty} Menu</span>
              <span className="price">Rp{totalPrice.toLocaleString()}</span>
            </div>
            <span className="cta">Cek Out &rarr;</span>
          </div>
        )}

        {isCheckoutOpen && (
          <div className="modal-bg">
            <div className="modal-sheet">
              <div className="sheet-header">
                <h3>Pesanan Lu</h3>
                <button onClick={() => setIsCheckoutOpen(false)} className="close-x">✕</button>
              </div>
              
              <div className="cart-list">
                {cart.map(i => (
                  <div key={i.id} className="cart-item">
                    <div className="item-meta">
                      <h4>{i.name}</h4>
                      <span>Rp{(i.price * i.qty).toLocaleString()}</span>
                    </div>
                    <div className="item-qty">
                      <button onClick={() => removeFromCart(i.id)}>−</button>
                      <span>{i.qty}</span>
                      <button onClick={() => addToCart(i)}>+</button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="checkout-form">
                <p className="note-alert">⚠️ Bayar di booth pas jemput tehnya ya!</p>
                <input type="text" placeholder="Nama Lu Siapa?" value={name} onChange={e => setName(e.target.value)} />
                <textarea 
                  placeholder="Catatan (Contoh: Es dikit, Gula normal)" 
                  value={note} 
                  onChange={e => setNote(e.target.value)}
                />
                <button className="order-btn" onClick={sendOrder}>Kirim ke WhatsApp 🚀</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
