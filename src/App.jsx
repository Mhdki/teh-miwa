import React, { useState, useEffect } from 'react';
import './index.css';

// --- DATA PRODUK (Foto Asli) ---
const MENU_ITEMS = [
  // Original
  { id: 1, name: 'Teh Original Merah', category: 'Original', price: 5000, size: 'Cup Besar', desc: 'Sepat wangi asli, manisnya pas.', image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&w=300&q=80' },
  { id: 2, name: 'Teh Original Merah (Kecil)', category: 'Original', price: 3000, size: 'Cup Kecil', desc: 'Versi mini, kesegaran sama.', image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&w=300&q=80' },
  { id: 3, name: 'Teh Original Hijau', category: 'Original', price: 5000, size: 'Cup Besar', desc: 'Aroma melati khas yang menenangkan.', image: 'https://images.unsplash.com/photo-1627435601361-ec25412569dd?auto=format&fit=crop&w=300&q=80' },
  // Varian Rasa
  { id: 5, name: 'Miwa Lemon Tea', category: 'Varian Rasa', price: 7000, size: 'Cup Besar', desc: 'Perpaduan teh dan lemon segar.', image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=300&q=80' },
  { id: 6, name: 'Miwa Lychee Tea', category: 'Varian Rasa', price: 7000, size: 'Cup Besar', desc: 'Ada sensasi leci yang bikin mood naik.', image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&w=300&q=80' }, // Placeholder Leci
  // Thai Tea
  { id: 7, name: 'Thai Tea Original', category: 'Thai Tea', price: 8000, size: 'Cup Besar', desc: 'Creamy, legit, autentik Thailand.', image: 'https://images.unsplash.com/photo-1597318181409-cf64d0b5d8a2?auto=format&fit=crop&w=300&q=80' },
  { id: 8, name: 'Thai Tea (Kecil)', category: 'Thai Tea', price: 5000, size: 'Cup Kecil', desc: 'Versi hemat buat yang pengen creamy.', image: 'https://images.unsplash.com/photo-1597318181409-cf64d0b5d8a2?auto=format&fit=crop&w=300&q=80' },
];

const QUOTES = [
  "Jangan lupa minum, nanti kamu dehidrasi lho :(",
  "Hari yang berat butuh teh yang tepat.",
  "Semangat kerjanya, segarkan dengan Miwa!",
  "Es batu kami setia menunggu kamu jemput."
];

function App() {
  const [activeCategory, setActiveCategory] = useState('Semua');
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [quoteIndex, setQuoteIndex] = useState(0);
  
  // State Form Checkout
  const [buyerName, setBuyerName] = useState('');
  const [pickupTime, setPickupTime] = useState('');
  const [buyerNote, setBuyerNote] = useState('');

  // Animasi Quotes
  useEffect(() => {
    const interval = setInterval(() => {
      setQuoteIndex((prev) => (prev + 1) % QUOTES.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Logic Cart
  const addToCart = (product) => {
    const existingItem = cart.find((item) => item.id === product.id);
    if (existingItem) {
      setCart(cart.map((item) => item.id === product.id ? { ...item, qty: item.qty + 1 } : item));
    } else {
      setCart([...cart, { ...product, qty: 1 }]);
    }
    // Efek getar pada HP (haptic) jika support
    if (navigator.vibrate) navigator.vibrate(50);
  };

  const updateQty = (id, amount) => {
    setCart(cart.map(item => {
      if (item.id === id) {
        return { ...item, qty: Math.max(0, item.qty + amount) };
      }
      return item;
    }).filter(item => item.qty > 0));
  };

  const totalAmount = cart.reduce((acc, item) => acc + (item.price * item.qty), 0);
  const totalItems = cart.reduce((acc, item) => acc + item.qty, 0);

  const categories = ['Semua', 'Original', 'Varian Rasa', 'Thai Tea'];
  const filteredMenu = activeCategory === 'Semua' 
    ? MENU_ITEMS 
    : MENU_ITEMS.filter(item => item.category === activeCategory);

  const handleCheckout = () => {
    if (!buyerName || !pickupTime || cart.length === 0) {
      alert("Mohon isi Nama, Jam Jemput, dan pilih pesanan dulu ya!");
      return;
    }
    let message = `Halo Kak, mau pesan *The Miwa* dong! 🥤%0A%0A`;
    message += `👤 Nama: *${buyerName}*%0A`;
    message += `⏰ Jam Jemput: *${pickupTime}*%0A`;
    message += `📝 Catatan: ${buyerNote || '-'}\n%0A`;
    message += `*Daftar Pesanan:*%0A`;
    cart.forEach((item, index) => {
      message += `${index + 1}. ${item.name} (${item.qty}x) - Rp ${(item.price * item.qty).toLocaleString('id-ID')}%0A`;
    });
    message += `%0A💰 *Total: Rp ${totalAmount.toLocaleString('id-ID')}*%0A`;
    message += `%0A#pesandulujemputlalubayar`;
    window.open(`https://wa.me/6281234567890?text=${message}`, '_blank');
  };

  return (
    <div className="min-h-screen pb-24 font-sans text-gray-800 bg-gray-50">
      
      {/* 1. Navbar Glassmorphism */}
      <nav className="fixed top-0 w-full z-40 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm transition-all">
        <div className="max-w-md mx-auto px-5 py-3 flex justify-between items-center">
          <h1 className="text-2xl font-extrabold text-amber-500 tracking-tight">miwa<span className="text-emerald-500">.</span></h1>
          
          {/* Cart Icon dengan Badge */}
          <div className="relative cursor-pointer p-2 active-bounce" onClick={() => setIsCartOpen(true)}>
            <span className="text-2xl filter drop-shadow-sm">🛍️</span>
            {totalItems > 0 && (
              <span className="absolute top-0 right-0 bg-red-500 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full ring-2 ring-white animate-pulse">
                {totalItems}
              </span>
            )}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-md mx-auto pt-24 px-5 animate-fade-in">
        
        {/* 2. Hero Section (Gradient Amber) */}
        <div className="bg-gradient-to-r from-amber-400 to-amber-500 rounded-2xl p-6 mb-8 text-white relative overflow-hidden shadow-lg shadow-amber-200">
          <div className="relative z-10">
            <span className="inline-block bg-white/20 backdrop-blur-sm border border-white/30 text-xs font-bold px-3 py-1 rounded-full mb-3">
              #pesandulujemputlalubayar
            </span>
            <h2 className="text-3xl font-bold leading-tight mb-2 drop-shadow-md">
              Pesan cepat, <br/> Tiba langsung <span className="text-amber-100 italic">sruput!</span>
            </h2>
            <p className="text-xs text-amber-50 mt-2 flex items-center gap-1 opacity-90">
              ⚡ Es gak cair, rasa tetap orisinil.
            </p>
          </div>
          {/* Hiasan Background */}
          <div className="absolute -right-5 -bottom-10 text-[120px] opacity-20 rotate-12 select-none">🥤</div>
        </div>

        {/* 3. Filter Kategori (Pill Shape) */}
        <div className="flex gap-2 overflow-x-auto pb-4 mb-2 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`whitespace-nowrap px-5 py-2 rounded-full text-xs font-bold transition-all active-bounce ${
                activeCategory === cat 
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-200' 
                  : 'bg-white text-gray-400 border border-gray-100 hover:bg-gray-50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* 4. Menu Catalog (Grid Card Modern) */}
        <div className="space-y-4 mb-10">
          {filteredMenu.map((item) => (
            <div key={item.id} className="group bg-white p-3 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4 hover:shadow-lg transition-all duration-300">
              {/* Foto Produk dengan Rounded Cantik */}
              <div className="w-24 h-24 shrink-0 bg-gray-100 rounded-xl overflow-hidden relative">
                <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              </div>
              
              {/* Info Produk */}
              <div className="flex-1">
                <h3 className="font-bold text-gray-800 text-sm leading-tight">{item.name}</h3>
                <p className="text-xs text-gray-400 mt-1 line-clamp-2 leading-relaxed">{item.desc}</p>
                <div className="flex justify-between items-end mt-3">
                  <p className="text-amber-500 font-bold text-base">Rp {item.price.toLocaleString('id-ID')}</p>
                  
                  {/* Tombol Tambah (Kuning) */}
                  <button 
                    onClick={() => addToCart(item)}
                    className="w-9 h-9 bg-amber-100 rounded-full flex items-center justify-center text-amber-600 active-bounce hover:bg-amber-500 hover:text-white transition-colors"
                  >
                    <span className="font-bold text-xl">+</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 5. Motivation Section (Dark Mode) */}
        <div className="bg-gray-800 text-white rounded-2xl p-6 text-center mb-24 relative overflow-hidden shadow-xl">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-400 to-emerald-400"></div>
          <p className="text-sm font-medium italic opacity-80 mb-2">Daily Reminder:</p>
          <p className="text-lg font-bold transition-all duration-500 animate-fade-in">
            "{QUOTES[quoteIndex]}"
          </p>
        </div>

      </main>

      {/* 6. Footer */}
      <footer className="text-center text-gray-300 text-[10px] py-6 pb-24 border-t border-gray-200/50 bg-white">
        <p>&copy; {new Date().getFullYear()} The Miwa.</p>
      </footer>

      {/* 7. Cart / Checkout Modal (Slide Up) */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center">
          {/* Backdrop Blur */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={() => setIsCartOpen(false)}></div>
          
          {/* Isi Modal */}
          <div className="bg-white w-full max-w-md rounded-t-3xl p-6 relative z-10 max-h-[85vh] overflow-y-auto animate-slide-up shadow-2xl">
            {/* Handle Bar */}
            <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-6"></div>
            
            <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-4">
              <h2 className="text-lg font-bold text-gray-800">Keranjang <span className="text-amber-500">Miwa</span></h2>
              <button onClick={() => setIsCartOpen(false)} className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded-full text-gray-500 hover:bg-red-100 hover:text-red-500 transition">
                ✕
              </button>
            </div>

            {cart.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4 grayscale opacity-50">🥤</div>
                <p className="text-gray-400 text-sm">Haus ya? Pesan dulu yuk!</p>
                <button onClick={() => setIsCartOpen(false)} className="mt-6 px-6 py-2 bg-amber-500 text-white rounded-full font-bold text-sm shadow-lg shadow-amber-200 active-bounce">
                  Lihat Menu
                </button>
              </div>
            ) : (
              <>
                <div className="space-y-4 mb-8">
                  {cart.map((item) => (
                    <div key={item.id} className="flex justify-between items-center bg-gray-50 p-3 rounded-xl border border-gray-100">
                      <div>
                        <h4 className="font-bold text-sm text-gray-800">{item.name}</h4>
                        <p className="text-xs text-amber-600 font-semibold">Rp {item.price.toLocaleString('id-ID')}</p>
                      </div>
                      <div className="flex items-center gap-3 bg-white px-2 py-1 rounded-lg border border-gray-200 shadow-sm">
                        <button onClick={() => updateQty(item.id, -1)} className="text-gray-400 hover:text-red-500 font-bold px-2">-</button>
                        <span className="font-bold text-sm w-4 text-center">{item.qty}</span>
                        <button onClick={() => updateQty(item.id, 1)} className="text-emerald-600 font-bold px-2">+</button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="bg-amber-50 p-5 rounded-2xl space-y-3 mb-6 border border-amber-100">
                  <h3 className="font-bold text-xs text-amber-700 uppercase tracking-wider">Data Penjemputan</h3>
                  <input 
                    type="text" 
                    placeholder="Nama Pemesan" 
                    className="w-full p-3 rounded-xl border border-amber-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 bg-white"
                    value={buyerName}
                    onChange={(e) => setBuyerName(e.target.value)}
                  />
                  <div className="flex gap-2">
                     <input 
                      type="time" 
                      className="w-1/3 p-3 rounded-xl border border-amber-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 bg-white text-center"
                      value={pickupTime}
                      onChange={(e) => setPickupTime(e.target.value)}
                    />
                     <input 
                      type="text" 
                      placeholder="Catatan (Es dikit, gula dikit)" 
                      className="w-2/3 p-3 rounded-xl border border-amber-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 bg-white"
                      value={buyerNote}
                      onChange={(e) => setBuyerNote(e.target.value)}
                    />
                  </div>
                </div>

                <div className="border-t border-gray-100 pt-4">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-gray-500 text-sm">Total Pembayaran</span>
                    <span className="text-2xl font-extrabold text-gray-800">Rp {totalAmount.toLocaleString('id-ID')}</span>
                  </div>
                  <button 
                    onClick={handleCheckout}
                    className="w-full bg-emerald-500 text-white py-4 rounded-xl font-bold text-lg shadow-xl shadow-emerald-200 active-bounce flex items-center justify-center gap-2 hover:bg-emerald-600 transition"
                  >
                    <span>Pesan Sekarang</span>
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/></svg>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

    </div>
  );
}

export default App;
