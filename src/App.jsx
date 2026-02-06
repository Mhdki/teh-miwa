import React, { useState, useEffect } from 'react';
import './index.css';

// --- DATA PRODUK (LENGKAP) ---
const MENU_ITEMS = [
  // Original
  { id: 1, name: 'Teh Original Merah', category: 'Original', price: 5000, desc: 'Sepat wangi asli, manisnya pas.', image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&w=300&q=80', isBestSeller: true },
  { id: 2, name: 'Teh Original Merah (Kecil)', category: 'Original', price: 3000, desc: 'Versi mini, kesegaran sama.', image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&w=300&q=80', isBestSeller: false },
  { id: 3, name: 'Teh Original Hijau', category: 'Original', price: 5000, desc: 'Aroma melati khas yang menenangkan.', image: 'https://images.unsplash.com/photo-1627435601361-ec25412569dd?auto=format&fit=crop&w=300&q=80', isBestSeller: false },
  // ITEM BARU: Hijau Kecil
  { id: 4, name: 'Teh Original Hijau (Kecil)', category: 'Original', price: 3000, desc: 'Versi mini, aroma melati khas.', image: 'https://images.unsplash.com/photo-1627435601361-ec25412569dd?auto=format&fit=crop&w=300&q=80', isBestSeller: false },
  
  // Varian Rasa
  { id: 5, name: 'Miwa Lemon Tea', category: 'Varian Rasa', price: 7000, desc: 'Perpaduan teh dan lemon segar.', image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=300&q=80', isBestSeller: true },
  { id: 6, name: 'Miwa Lychee Tea', category: 'Varian Rasa', price: 7000, desc: 'Ada sensasi leci yang bikin mood naik.', image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&w=300&q=80', isBestSeller: false },
  
  // Thai Tea
  { id: 7, name: 'Thai Tea Original', category: 'Thai Tea', price: 8000, desc: 'Creamy, legit, autentik Thailand.', image: 'https://images.unsplash.com/photo-1597318181409-cf64d0b5d8a2?auto=format&fit=crop&w=300&q=80', isBestSeller: true },
  { id: 8, name: 'Thai Tea (Kecil)', category: 'Thai Tea', price: 5000, desc: 'Versi hemat buat yang pengen creamy.', image: 'https://images.unsplash.com/photo-1597318181409-cf64d0b5d8a2?auto=format&fit=crop&w=300&q=80', isBestSeller: false },
];

const TESTIMONIALS = [
  { id: 1, name: 'Kak Rina', text: 'Suka banget sama Lemon Tea-nya! Asem manisnya pas, gak bikin serak.', star: 5 },
  { id: 2, name: 'Bang Jago', text: 'Pesan dulu, pas sampe booth tinggal ambil. Mantap servicenya!', star: 5 },
  { id: 3, name: 'Dinda', text: 'Thai Tea-nya creamy parah, wajib coba sih.', star: 4 },
];

const QUOTES = [
  "Jangan lupa minum, nanti kamu dehidrasi lho :(",
  "Hari yang berat butuh teh yang tepat.",
  "Semangat kerjanya, segarkan dengan Miwa!",
  "Es batu kami setia menunggu kamu jemput."
];

function App() {
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('Semua');
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [buyerName, setBuyerName] = useState('');
  const [pickupTime, setPickupTime] = useState('');
  const [buyerNote, setBuyerNote] = useState('');
  const [showWarning, setShowWarning] = useState(false);

  useEffect(() => { const timer = setTimeout(() => setLoading(false), 2500); return () => clearTimeout(timer); }, []);
  useEffect(() => { const interval = setInterval(() => { setQuoteIndex((prev) => (prev + 1) % QUOTES.length); }, 4000); return () => clearInterval(interval); }, []);

  const addToCart = (product) => {
    const existingItem = cart.find((item) => item.id === product.id);
    if (existingItem) { setCart(cart.map((item) => item.id === product.id ? { ...item, qty: item.qty + 1 } : item)); } 
    else { setCart([...cart, { ...product, qty: 1 }]); }
    if (navigator.vibrate) navigator.vibrate(50);
    setIsCartOpen(true);
  };

  const updateQty = (id, amount) => { setCart(cart.map(item => { if (item.id === id) { return { ...item, qty: Math.max(0, item.qty + amount) }; } return item; }).filter(item => item.qty > 0)); };
  const getItemQty = (id) => { const item = cart.find(i => i.id === id); return item ? item.qty : 0; };
  const totalAmount = cart.reduce((acc, item) => acc + (item.price * item.qty), 0);
  const totalItems = cart.reduce((acc, item) => acc + item.qty, 0);

  const filteredMenu = activeCategory === 'Semua' ? MENU_ITEMS : MENU_ITEMS.filter(item => item.category === activeCategory);
  const categories = ['Semua', 'Original', 'Varian Rasa', 'Thai Tea'];

  const handlePreCheckout = () => { if (!buyerName || !pickupTime || cart.length === 0) { alert("Mohon isi Nama & Jam Jemput dulu ya, Kak!"); return; } setShowWarning(true); };
  
  const handleFinalCheckout = () => {
    let message = `Halo Kak, mau pesan *The Miwa* dong! 🥤%0A%0A`;
    message += `👤 Nama: *${buyerName}*%0A`;
    message += `⏰ Jam Jemput: *${pickupTime}*%0A`;
    message += `📝 Catatan: ${buyerNote || '-'}\n%0A`;
    message += `*Daftar Pesanan:*%0A`;
    cart.forEach((item, index) => { message += `${index + 1}. ${item.name} (${item.qty}x) - Rp ${(item.price * item.qty).toLocaleString('id-ID')}%0A`; });
    message += `%0A💰 *Total: Rp ${totalAmount.toLocaleString('id-ID')}*%0A`;
    message += `%0A#pesandulujemputlalubayar`;
    setShowWarning(false); setIsCartOpen(false);
    window.open(`https://wa.me/6281234567890?text=${message}`, '_blank');
  };

  const handleFeedback = () => {
    window.open(`https://wa.me/6282287686071?text=Halo Kak Miwa, saya mau kasih masukan nih...`, '_blank');
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-amber-500 z-[9999] flex flex-col items-center justify-center text-white splash-exit-wrapper">
        <div className="text-center splash-bounce"><h1 className="text-6xl font-extrabold tracking-tighter mb-2">miwa<span className="text-emerald-200">.</span></h1><p className="text-amber-100 text-sm tracking-widest uppercase">Refresh Your Day</p></div>
        <div className="w-48 h-1.5 bg-amber-700/30 rounded-full mt-8 overflow-hidden"><div className="h-full bg-white loading-bar rounded-full"></div></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-24 font-sans text-gray-800 bg-gray-50">
      
      {/* Navbar Fixed */}
      <nav className="fixed top-0 w-full z-40 bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-sm transition-all">
        {/* FITUR PROMO BERJALAN */}
        <div className="bg-emerald-500 text-white text-[10px] py-1 overflow-hidden relative">
          <div className="animate-marquee font-medium">
            🔥 PROMO: Jumat Berkah Beli 2 Gratis 1 Cup Kecil! • Buka Senin - Sabtu (10.00 - 18.00) • Pesan Dulu Jemput Nanti, Biar Es Gak Cair! ⚡
          </div>
        </div>

        <div className="max-w-md mx-auto px-5 py-3 flex justify-between items-center">
          <h1 className="text-2xl font-extrabold text-amber-500 tracking-tight">miwa<span className="text-emerald-500">.</span></h1>
          <div className="relative cursor-pointer p-2 active-bounce" onClick={() => setIsCartOpen(true)}>
            <span className="text-2xl filter drop-shadow-sm">🛍️</span>
            {totalItems > 0 && <span className="absolute top-0 right-0 bg-red-500 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full ring-2 ring-white animate-pulse">{totalItems}</span>}
          </div>
        </div>
      </nav>

      <main className="max-w-md mx-auto pt-28 px-5 animate-fade-in"> 
        
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-amber-400 to-amber-500 rounded-2xl p-6 mb-8 text-white relative overflow-hidden shadow-lg shadow-amber-200">
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-2">
              <span className="inline-block bg-white/20 backdrop-blur-sm border border-white/30 text-xs font-bold px-3 py-1 rounded-full">#pesandulujemputlalubayar</span>
              <div className="flex items-center gap-1 bg-black/20 px-2 py-1 rounded-lg backdrop-blur-sm">
                <span className="text-yellow-300 text-xs">⭐</span>
                <span className="text-[10px] font-bold">4.9/5.0</span>
              </div>
            </div>
            <h2 className="text-3xl font-bold leading-tight mb-2 drop-shadow-md">Pesan cepat, <br/> Tiba langsung <span className="text-amber-100 italic">sruput!</span></h2>
            <p className="text-xs text-amber-50 mt-2 flex items-center gap-1 opacity-90">⚡ Pesanan dikerjakan saat tiba di booth</p>
          </div>
          <div className="absolute -right-5 -bottom-10 text-[120px] opacity-20 rotate-12 select-none">🥤</div>
        </div>

        {/* Filter Kategori */}
        <div className="flex gap-2 overflow-x-auto pb-4 mb-2 no-scrollbar">
          {categories.map((cat) => (
            <button key={cat} onClick={() => setActiveCategory(cat)} className={`whitespace-nowrap px-5 py-2 rounded-full text-xs font-bold transition-all active-bounce ${activeCategory === cat ? 'bg-emerald-600 text-white shadow-md shadow-emerald-200' : 'bg-white text-gray-400 border border-gray-100 hover:bg-gray-50'}`}>{cat}</button>
          ))}
        </div>

        {/* Katalog Menu */}
        <div className="space-y-4 mb-12">
          {filteredMenu.map((item) => {
            const itemQty = getItemQty(item.id);
            return (
              <div key={item.id} className={`group bg-white p-3 rounded-2xl border transition-all duration-300 flex items-center gap-4 hover:shadow-lg relative overflow-hidden ${itemQty > 0 ? 'border-amber-400 ring-1 ring-amber-400 bg-amber-50/30' : 'border-gray-100 shadow-sm'}`}>
                {item.isBestSeller && ( <div className="absolute top-0 right-0"><div className="bg-red-500 text-white text-[8px] font-bold px-3 py-1 rounded-bl-xl shadow-sm z-10">BEST SELLER 🔥</div></div> )}
                <div className="w-24 h-24 shrink-0 bg-gray-100 rounded-xl overflow-hidden relative">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  {itemQty > 0 && <div className="absolute inset-0 bg-black/40 flex items-center justify-center backdrop-blur-[2px] animate-fade-in"><span className="text-white font-extrabold text-2xl drop-shadow-md">{itemQty}x</span></div>}
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-gray-800 text-sm leading-tight pr-4">{item.name}</h3>
                  <p className="text-xs text-gray-400 mt-1 line-clamp-2 leading-relaxed">{item.desc}</p>
                  <div className="flex justify-between items-end mt-3">
                    <p className="text-amber-500 font-bold text-base">Rp {item.price.toLocaleString('id-ID')}</p>
                    <button onClick={() => addToCart(item)} className={`w-9 h-9 rounded-full flex items-center justify-center active-bounce transition-colors ${itemQty > 0 ? 'bg-emerald-500 text-white shadow-emerald-200 shadow-md' : 'bg-amber-100 text-amber-600 hover:bg-amber-500 hover:text-white'}`}><span className="font-bold text-xl">{itemQty > 0 ? '✎' : '+'}</span></button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Testimonials */}
        <div className="mb-12">
          <h3 className="font-bold text-gray-800 text-lg mb-4 flex items-center gap-2">Kata Mereka <span className="text-amber-500">🫶</span></h3>
          <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
            {TESTIMONIALS.map((testi) => (
              <div key={testi.id} className="min-w-[250px] bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
                <div className="flex gap-1 mb-2 text-yellow-400 text-xs">{[...Array(testi.star)].map((_, i) => <span key={i}>⭐</span>)}</div>
                <p className="text-gray-600 text-xs italic leading-relaxed mb-3">"{testi.text}"</p>
                <div className="flex items-center gap-2"><div className="w-6 h-6 bg-gray-200 rounded-full overflow-hidden"><img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${testi.name}`} alt="avatar" /></div><span className="text-xs font-bold text-gray-800">{testi.name}</span></div>
              </div>
            ))}
          </div>
        </div>

        {/* Quotes */}
        <div className="bg-gray-800 text-white rounded-2xl p-6 text-center mb-10 relative overflow-hidden shadow-xl">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-400 to-emerald-400"></div>
          <p className="text-sm font-medium italic opacity-80 mb-2">Daily Reminder:</p>
          <p className="text-lg font-bold transition-all duration-500 animate-fade-in">"{QUOTES[quoteIndex]}"</p>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-100 pt-8 pb-32 px-5 text-center">
        <h2 className="text-2xl font-extrabold text-gray-300 mb-4">miwa.</h2>
        <div className="flex justify-center gap-4 mb-6"><button onClick={handleFeedback} className="text-xs text-gray-500 hover:text-emerald-500 transition underline">Kirim Kritik & Saran</button><span className="text-gray-300">•</span><a href="#" className="text-xs text-gray-500 hover:text-amber-500 transition">Instagram</a></div>
        <p className="text-[10px] text-gray-400">&copy; {new Date().getFullYear()} The Miwa. Refresh Your Day.</p>
      </footer>

      {/* Cart Modal */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={() => setIsCartOpen(false)}></div>
          <div className="bg-white w-full max-w-md rounded-t-3xl p-6 relative z-10 max-h-[85vh] overflow-y-auto animate-slide-up shadow-2xl">
            <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-6"></div>
            <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-4"><h2 className="text-lg font-bold text-gray-800">Keranjang <span className="text-amber-500">Miwa</span></h2><button onClick={() => setIsCartOpen(false)} className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded-full text-gray-500 hover:bg-red-100 hover:text-red-500 transition">✕</button></div>
            {cart.length === 0 ? ( <div className="text-center py-12"><div className="text-6xl mb-4 grayscale opacity-50">🛒</div><p className="text-gray-400 text-sm">Keranjang kosong.</p></div> ) : ( <>
              <div className="space-y-4 mb-8">
                {cart.map((item) => ( <div key={item.id} className="flex justify-between items-center bg-amber-50 p-3 rounded-xl border border-amber-100"><div><h4 className="font-bold text-sm text-gray-800">{item.name}</h4><p className="text-xs text-amber-600 font-semibold">Rp {item.price.toLocaleString('id-ID')}</p></div><div className="flex items-center gap-3 bg-white px-2 py-1 rounded-lg border border-amber-200 shadow-sm"><button onClick={() => updateQty(item.id, -1)} className="text-gray-400 hover:text-red-500 font-bold px-2 text-lg">-</button><span className="font-bold text-sm w-6 text-center">{item.qty}</span><button onClick={() => updateQty(item.id, 1)} className="text-emerald-600 font-bold px-2 text-lg">+</button></div></div> ))}
              </div>
              <div className="bg-white p-1 rounded-2xl space-y-3 mb-6"><h3 className="font-bold text-xs text-gray-500 uppercase tracking-wider mb-2">Lengkapi Data</h3><input type="text" placeholder="Nama Pemesan (Wajib)" className="w-full p-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 bg-gray-50" value={buyerName} onChange={(e) => setBuyerName(e.target.value)} /><div className="flex gap-2"><input type="time" className="w-1/3 p-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 bg-gray-50 text-center" value={pickupTime} onChange={(e) => setPickupTime(e.target.value)} /><input type="text" placeholder="Catatan..." className="w-2/3 p-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 bg-gray-50" value={buyerNote} onChange={(e) => setBuyerNote(e.target.value)} /></div></div>
              <div className="border-t border-gray-100 pt-4"><div className="flex justify-between items-center mb-4"><span className="text-gray-500 text-sm">Total Pembayaran</span><span className="text-2xl font-extrabold text-gray-800">Rp {totalAmount.toLocaleString('id-ID')}</span></div><button onClick={handlePreCheckout} className="w-full bg-emerald-500 text-white py-4 rounded-xl font-bold text-lg shadow-xl shadow-emerald-200 active-bounce flex items-center justify-center gap-2 hover:bg-emerald-600 transition"><span>Pesan Sekarang</span></button></div>
            </> )}
          </div>
        </div>
      )}

      {showWarning && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm animate-fade-in" onClick={() => setShowWarning(false)}></div>
          <div className="bg-white w-full max-w-sm rounded-3xl p-6 relative z-20 text-center shadow-2xl animate-slide-up border-4 border-amber-100">
            <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4 text-4xl animate-bounce">⚠️</div>
            <h3 className="text-xl font-extrabold text-gray-800 mb-2">Sebentar ya Kak!</h3>
            <p className="text-gray-600 text-sm leading-relaxed mb-6">Agar <span className="font-bold text-amber-500">Es Tidak Cair</span> dan rasa tetap segar, pesanan baru akan kami buat <span className="font-bold text-gray-800"> SAAT KAKAK TIBA DI BOOTH</span> ya.</p>
            <div className="flex gap-3"><button onClick={() => setShowWarning(false)} className="flex-1 py-3 rounded-xl font-bold text-gray-500 bg-gray-100 hover:bg-gray-200 transition">Batal</button><button onClick={handleFinalCheckout} className="flex-[2] py-3 rounded-xl font-bold text-white bg-emerald-500 hover:bg-emerald-600 shadow-lg shadow-emerald-200 transition active-bounce">Siap, Mengerti!</button></div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
