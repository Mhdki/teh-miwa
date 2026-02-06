import { useState, useMemo, useEffect } from "react";
import "./App.css";

const menus = [
  { id: 1, name: "Teh Original", price: 5000, category: "Original", img: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=300", desc: "Kesegaran daun teh pegunungan asli." },
  { id: 2, name: "Teh Lemon", price: 7000, category: "Fruit Series", img: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=300", desc: "Asam seger lemon pilihan, auto melek!" },
  { id: 3, name: "Teh Susu", price: 8000, category: "Milk Series", img: "https://images.unsplash.com/photo-1571328003758-4a392120563d?w=300", desc: "Creamy susu ketemu teh, perpaduan maut." },
  { id: 4, name: "Teh Yakult", price: 10000, category: "Fruit Series", img: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=300", desc: "Sehat, seger, dan bikin nagih terus." },
];

const categories = ["Semua", "Original", "Milk Series", "Fruit Series"];

export default function App() {
  const [activeCat, setActiveCat] = useState("Semua");
  const [isLoaded, setIsLoaded] = useState(false);
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem("miwaCart");
    return saved ? JSON.parse(saved) : [];
  });
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [name, setName] = useState("");

  useEffect(() => { setIsLoaded(true); }, []);
  useEffect(() => { localStorage.setItem("miwaCart", JSON.stringify(cart)); }, [cart]);

  const totalQty = cart.reduce((acc, item) => acc + item.qty, 0);
  const totalPrice = cart.reduce((acc, item) => acc + (item.price * item.qty), 0);

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

  const clearCart = () => { if(window.confirm("Kosongkan keranjang?")) { setCart([]); setIsCheckoutOpen(false); } };

  const filteredMenus = useMemo(() => activeCat === "Semua" ? menus : menus.filter(m => m.category === activeCat), [activeCat]);

  return (
    <div className={`app-shell ${isLoaded ? 'fade-in' : ''}`}>
      {/* NAVBAR */}
      <nav className="navbar">
        <div className="logo-wrap">
          <span className="logo-icon">🍃</span>
          <span className="logo-text">Teh Miwa</span>
        </div>
        <div className="status-badge">Booth Buka</div>
      </nav>

      {/* HERO SECTION - REVISI UI */}
      <header className="hero">
        <div className="hero-content">
          <p className="hero-sub">#SegernyaMasaKini</p>
          <h1>Haus? Ingat <br/><span className="miwa-highlight">Teh Miwa</span> Sruputnya!</h1>
          <p className="hero-p">Racikan teh autentik yang bikin mood lu balik 100%. Pilih, klik, dan ambil di booth terdekat!</p>
        </div>
        <div className="hero-blob"></div>
      </header>

      {/* MAIN CONTENT */}
      <main className="main-content">
        <div className="cat-scroll">
          {categories.map(c => (
            <button key={c} onClick={() => setActiveCat(c)} className={`cat-pill ${activeCat === c ? 'active' : ''}`}>{c}</button>
          ))}
        </div>

        <div className="menu-list">
          {filteredMenus.map((m, idx) => (
            <div key={m.id} className="menu-card" style={{animationDelay: `${idx * 0.1}s`}}>
              <div className="img-container">
                <img src={m.img} alt={m.name} />
              </div>
              <div className="card-body">
                <h3>{m.name}</h3>
                <p className="m-desc">{m.desc}</p>
                <div className="card-footer">
                  <span className="m-price">Rp{m.price.toLocaleString('id-ID')}</span>
                  <button className="add-circle" onClick={() => addToCart(m)}>+</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      <footer className="footer">
        <div className="footer-line"></div>
        <p>Dibuat dengan ❤️ untuk pecinta Teh</p>
        <small>© 2026 Teh Miwa Indonesia</small>
      </footer>

      {/* FLOAT CART */}
      {cart.length > 0 && !isCheckoutOpen && (
        <div className="float-action" onClick={() => setIsCheckoutOpen(true)}>
          <div className="cart-summary">
            <div className="cart-icon-bg">🛒</div>
            <div className="cart-info-text">
              <span className="q-item">{totalQty} Item terpilih</span>
              <span className="p-item">Rp{totalPrice.toLocaleString('id-ID')}</span>
            </div>
          </div>
          <span className="order-now">Cek Out &rarr;</span>
        </div>
      )}

      {/* MODAL CHECKOUT */}
      {isCheckoutOpen && (
        <div className="modal-backdrop">
          <div className="modal-sheet">
            <div className="sheet-handle"></div>
            <div className="sheet-header">
              <div className="title-stack">
                <h3>Pesanan Lu</h3>
                <p>Udah bener semua kan, cukk?</p>
              </div>
              <button className="trash-btn" onClick={clearCart}>🗑️</button>
              <button className="close-btn" onClick={() => setIsCheckoutOpen(false)}>✕</button>
            </div>
            
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

            <div className="sheet-footer">
              <div className="total-stack">
                <span>Total Bayar:</span>
                <span className="grand-total">Rp{totalPrice.toLocaleString('id-ID')}</span>
              </div>
              <input type="text" placeholder="Pake nama siapa nih?" value={name} onChange={e => setName(e.target.value)} className="modern-input" />
              <button className="wa-submit" onClick={() => window.open(`https://wa.me/62812?text=Mau Miwa!`)}>
                Gaskeun ke WhatsApp 🚀
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}