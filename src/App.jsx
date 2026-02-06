import { useState, useEffect, useMemo } from "react";
import "./App.css";

const menus = [
  { id: 1, name: "Teh Original", price: 5000, category: "Original", img: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=300", desc: "Kesegaran daun teh pegunungan asli." },
  { id: 2, name: "Teh Lemon", price: 7000, category: "Fruit Series", img: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=300", desc: "Asam seger lemon pilihan, auto melek!" },
  { id: 3, name: "Teh Susu", price: 8000, category: "Milk Series", img: "https://images.unsplash.com/photo-1571328003758-4a392120563d?w=300", desc: "Creamy susu ketemu teh, perpaduan maut." },
  { id: 4, name: "Teh Yakult", price: 10000, category: "Fruit Series", img: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=300", desc: "Sehat, seger, dan bikin nagih terus." },
  { id: 5, name: "Leci Tea", price: 12000, category: "Fruit Series", img: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=300", desc: "Ada buah leci aslinya di dalam!" },
];

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [activeCat, setActiveCat] = useState("Semua");
  const [cart, setCart] = useState([]);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [name, setName] = useState("");
  const [pickupTime, setPickupTime] = useState(""); // Fitur Jam Jemput
  const [note, setNote] = useState("");

  useEffect(() => {
    localStorage.removeItem("miwaCart");
    setTimeout(() => setShowSplash(false), 2800);
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
    if (!name || !pickupTime) return alert("Nama dan Jam Jemput wajib diisi ya, cukk! 🙏");
    
    const listOrder = cart.map((i, idx) => `${idx + 1}. *${i.name}* (${i.qty}x)`).join('%0A');
    
    const message = `Halo Teh Miwa! 👋%0A%0ASaya mau pesan lewat Web:%0A%0A` +
      `👤 *Nama:* ${name}%0A` +
      `⏰ *Jam Jemput:* ${pickupTime}%0A%0A` +
      `🛒 *Daftar Pesanan:*%0A${listOrder}%0A%0A` +
      `📝 *Catatan (Es/Gula):*%0A${note || "-"}%0A%0A` +
      `💰 *Total Bayar: Rp${totalPrice.toLocaleString()}*%0A%0A` +
      `*Penting:* Saya akan bayar saat tiba di booth. Pesanan mohon dikerjakan pas saya sampai ya biar tetap segar! 🚀`;

    window.open(`https://wa.me/628123456789?text=${message}`, "_blank");
  };

  const filtered = useMemo(() => activeCat === "Semua" ? menus : menus.filter(m => m.category === activeCat), [activeCat]);

  return (
    <div className="app-shell">
      {showSplash && (
        <div className="splash-ui">
          <div className="splash-circle">
            <span className="leaf-icon">🍃</span>
          </div>
          <h1 className="logo-anim">TEH MIWA</h1>
          <p>Segernya Masa Kini</p>
        </div>
      )}

      <div className={`main-ui ${!showSplash ? "show" : ""}`}>
        <nav className="glass-nav">
          <div className="nav-brand">🍃 <span>MIWA</span></div>
          <div className="nav-status"><span>●</span> BOOTH OPEN</div>
        </nav>

        <header className="pro-hero">
          <div className="hero-pill">Pesan Dulu • Jemput • Bayar</div>
          <h2>Gak Perlu Antri,<br/><span className="gradient-text">Langsung Sruput!</span></h2>
          <div className="notice-box">
            📌 Pesanan baru dikerjakan saat kamu tiba di booth biar es gak cair!
          </div>
        </header>

        <div className="filter-scroll">
          {["Semua", "Original", "Milk Series", "Fruit Series"].map(c => (
            <button key={c} onClick={() => setActiveCat(c)} className={activeCat === c ? "active" : ""}>{c}</button>
          ))}
        </div>

        <div className="menu-grid">
          {filtered.map((m, idx) => (
            <div key={m.id} className="menu-card-pro" style={{animationDelay: `${idx * 0.05}s`}}>
              <div className="img-box"><img src={m.img} alt="" /></div>
              <div className="info-box">
                <div className="info-top">
                  <h3>{m.name}</h3>
                  <p>{m.desc}</p>
                </div>
                <div className="info-bottom">
                  <strong>Rp{m.price.toLocaleString()}</strong>
                  <button onClick={() => addToCart(m)} className="add-vibe">+</button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {cart.length > 0 && (
          <div className="checkout-bar" onClick={() => setIsCheckoutOpen(true)}>
            <div className="bar-info">
              <span className="bar-qty">{cart.reduce((a, b) => a + b.qty, 0)} Item</span>
              <span className="bar-total">Rp{totalPrice.toLocaleString()}</span>
            </div>
            <div className="bar-action">Siap Jemput? &rarr;</div>
          </div>
        )}

        {isCheckoutOpen && (
          <div className="modal-ui">
            <div className="sheet-ui">
              <div className="sheet-head">
                <h3>Detail Pesanan</h3>
                <button onClick={() => setIsCheckoutOpen(false)}>✕</button>
              </div>
              
              <div className="sheet-scroll">
                {cart.map(i => (
                  <div key={i.id} className="row-item">
                    <div className="row-info">
                      <h4>{i.name}</h4>
                      <p>Rp{(i.price * i.qty).toLocaleString()}</p>
                    </div>
                    <div className="row-qty">
                      <button onClick={() => removeFromCart(i.id)}>−</button>
                      <span>{i.qty}</span>
                      <button onClick={() => addToCart(i)}>+</button>
                    </div>
                  </div>
                ))}

                <div className="form-ui">
                  <label>Nama Kamu</label>
                  <input type="text" placeholder="Masukkan nama..." value={name} onChange={e => setName(e.target.value)} />
                  
                  <label>Estimasi Jam Jemput</label>
                  <input type="time" value={pickupTime} onChange={e => setPickupTime(e.target.value)} />
                  
                  <label>Catatan (Gula/Es)</label>
                  <textarea placeholder="Contoh: Es sedikit, Gula pisah..." value={note} onChange={e => setNote(e.target.value)} />
                </div>
              </div>

              <div className="sheet-footer">
                <p>💡 Bayar tunai/QRIS saat tiba di booth</p>
                <button className="btn-finish" onClick={sendOrder}>Pesan & Jemput 🚀</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
