import { useState, useMemo, useEffect } from "react";
import "./App.css";

const menus = [
  { id: 1, name: "Teh Original", price: 5000, category: "Original", img: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=300", desc: "Kesegaran daun teh pegunungan asli." },
  { id: 2, name: "Teh Lemon", price: 7000, category: "Fruit Series", img: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=300", desc: "Asam seger lemon pilihan, auto melek!" },
  { id: 3, name: "Teh Susu", price: 8000, category: "Milk Series", img: "https://images.unsplash.com/photo-1571328003758-4a392120563d?w=300", desc: "Creamy susu ketemu teh, perpaduan maut." },
  { id: 4, name: "Teh Yakult", price: 10000, category: "Fruit Series", img: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=300", desc: "Sehat, seger, dan bikin nagih terus." },
  { id: 5, name: "Leci Tea", price: 12000, category: "Fruit Series", img: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=300", desc: "Ada buah leci aslinya di dalam!" },
];

const categories = ["Semua", "Original", "Milk Series", "Fruit Series"];

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [activeCat, setActiveCat] = useState("Semua");
  const [cart, setCart] = useState([]);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [name, setName] = useState("");

  useEffect(() => {
    localStorage.removeItem("miwaCart");
    const timer = setTimeout(() => setShowSplash(false), 3000);
    return () => clearTimeout(timer);
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
    if (!name) return alert("Isi nama dulu cukk! 🙏");
    const details = cart.map((i, index) => `${index + 1}. *${i.name}* (${i.qty}x)`).join('%0A');
    const msg = `Halo Teh Miwa!%0A%0A👤 *Nama:* ${name}%0A🛒 *Pesanan:*%0A${details}%0A%0A💰 *Total: Rp${totalPrice.toLocaleString()}*%0A%0ADitunggu ya!`;
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
            <p className="splash-tagline">Segernya Masa Kini!</p>
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
          <h1>Haus? Ingat <br/><span className="miwa-highlight">Teh Miwa</span> Sruputnya!</h1>
        </header>

        <main className="main-content">
          <div className="cat-scroll">
            {categories.map(c => (
              <button key={c} onClick={() => setActiveCat(c)} className={`cat-pill ${activeCat === c ? 'active' : ''}`}>{c}</button>
            ))}
          </div>

          <div className="menu-list">
            {filteredMenus.map(m => (
              <div key={m.id} className="menu-card">
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
          <p>© 2026 Teh Miwa Indonesia</p>
        </footer>

        {cart.length > 0 && !isCheckoutOpen && (
          <div className="float-action" onClick={() => setIsCheckoutOpen(true)}>
            <div className="cart-summary">
              <span>🛒 {totalQty} Item</span>
              <span className="p-item">Rp{totalPrice.toLocaleString()}</span>
            </div>
            <span className="order-now">Cek Out &rarr;</span>
          </div>
        )}

        {isCheckoutOpen && (
          <div className="modal-backdrop">
            <div className="modal-sheet">
              <div className="sheet-header">
                <h3>Keranjang</h3>
                <button className="trash-btn" onClick={() => {setCart([]); setIsCheckoutOpen(false);}}>🗑️</button>
                <button className="close-btn" onClick={() => setIsCheckoutOpen(false)}>✕</button>
              </div>
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
              <input type="text" placeholder="Nama Lu..." value={name} onChange={e => setName(e.target.value)} className="modern-input" />
              <button className="wa-submit" onClick={sendOrder}>Pesan via WhatsApp 🚀</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
