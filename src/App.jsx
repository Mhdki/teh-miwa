import { useState, useEffect } from "react";
import "./App.css";

const menus = [
  { id: 1, name: "Teh Original", price: 5000, category: "Original", img: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=300", desc: "Kesegaran daun teh asli." },
  { id: 2, name: "Teh Lemon", price: 7000, category: "Fruit Series", img: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=300", desc: "Asam seger lemon pilihan." },
  { id: 3, name: "Teh Susu", price: 8000, category: "Milk Series", img: "https://images.unsplash.com/photo-1571328003758-4a392120563d?w=300", desc: "Creamy susu ketemu teh." },
  { id: 4, name: "Teh Yakult", price: 10000, category: "Fruit Series", img: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=300", desc: "Sehat, seger, bikin nagih." },
  { id: 5, name: "Leci Tea", price: 12000, category: "Fruit Series", img: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=300", desc: "Ada buah leci aslinya!" },
];

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [activeCat, setActiveCat] = useState("Semua");
  const [cart, setCart] = useState([]);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [name, setName] = useState("");
  const [note, setNote] = useState("");

  useEffect(() => {
    localStorage.removeItem("miwaCart");
    setTimeout(() => setShowSplash(false), 2500);
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
    if (!name) return alert("Nama jangan kosong ya!");
    
    // DETAIL ITEM BUAT WHATSAPP
    const list = cart.map((i, idx) => `${idx + 1}. *${i.name}* (${i.qty}x)`).join('%0A');
    
    const text = `Halo Teh Miwa! 👋%0A%0A` +
      `👤 *Nama:* ${name}%0A` +
      `🛒 *Pesanan:*%0A${list}%0A%0A` +
      `📝 *Catatan:* ${note || "Gak ada"}%0A%0A` +
      `💰 *Total: Rp${totalPrice.toLocaleString()}*%0A%0A` +
      `*Pesan Dulu - Jemput - Bayar di Booth!* 🚀`;

    window.open(`https://wa.me/628123456789?text=${text}`, "_blank");
  };

  const filtered = activeCat === "Semua" ? menus : menus.filter(m => m.category === activeCat);

  return (
    <div className="container">
      {showSplash && (
        <div className="splash">
          <h1 className="splash-logo">🍃 Teh Miwa</h1>
          <div className="loader"></div>
        </div>
      )}

      <nav className="nav">
        <strong>🍃 Teh Miwa</strong>
        <span className="badge">Buka</span>
      </nav>

      <header className="hero">
        <p className="tagline">#PesanDuluJemputLaluBayar</p>
        <h2>Gak Pake Antri,<br/><span>Langsung Sruput!</span></h2>
        <div className="info-box">📍 Ambil & Bayar di Booth</div>
      </header>

      <div className="cat-box">
        {["Semua", "Original", "Milk Series", "Fruit Series"].map(c => (
          <button key={c} onClick={() => setActiveCat(c)} className={activeCat === c ? "active" : ""}>{c}</button>
        ))}
      </div>

      <div className="menu-grid">
        {filtered.map(m => (
          <div key={m.id} className="card">
            <img src={m.img} alt="" />
            <div className="card-info">
              <h3>{m.name}</h3>
              <p>{m.desc}</p>
              <div className="card-flex">
                <strong>Rp{m.price.toLocaleString()}</strong>
                <button onClick={() => addToCart(m)}>+</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <footer className="footer">
        <p>"Haus itu manusiawi, tapi beli Miwa itu solusi hakiki."</p>
        <small>© 2026 Teh Miwa Indonesia</small>
      </footer>

      {cart.length > 0 && !isCheckoutOpen && (
        <div className="floating-bar" onClick={() => setIsCheckoutOpen(true)}>
          <span>🛒 {cart.reduce((a, b) => a + b.qty, 0)} Item | Rp{totalPrice.toLocaleString()}</span>
          <span>Cek Out &rarr;</span>
        </div>
      )}

      {isCheckoutOpen && (
        <div className="overlay">
          <div className="sheet">
            <div className="sheet-top">
              <h3>Keranjang</h3>
              <button onClick={() => setIsCheckoutOpen(false)}>✕</button>
            </div>
            <div className="sheet-list">
              {cart.map(i => (
                <div key={i.id} className="item-row">
                  <div><h4>{i.name}</h4><small>Rp{i.price.toLocaleString()}</small></div>
                  <div className="step">
                    <button onClick={() => removeFromCart(i.id)}>−</button>
                    <span>{i.qty}</span>
                    <button onClick={() => addToCart(i)}>+</button>
                  </div>
                </div>
              ))}
            </div>
            <div className="form">
              <input type="text" placeholder="Nama Kamu?" value={name} onChange={e => setName(e.target.value)} />
              <textarea placeholder="Catatan (Contoh: Kurang gula, es dikit)" value={note} onChange={e => setNote(e.target.value)} />
              <button className="btn-wa" onClick={sendOrder}>Kirim ke WhatsApp 🚀</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
