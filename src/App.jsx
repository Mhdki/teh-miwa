import React, { useState, useEffect } from 'react';
import './App.css';
import './index.css';

// --- DATA PRODUK & COPYWRITING ---
const MENU_ITEMS = [
  // Original
  { id: 1, name: 'Teh Original Merah', category: 'Original', price: 5000, size: 'Cup Besar', desc: 'Sepat wangi asli, manisnya pas.', image: 'https://placehold.co/100x100/orange/white?text=Merah' },
  { id: 2, name: 'Teh Original Merah (Kecil)', category: 'Original', price: 3000, size: 'Cup Kecil', desc: 'Versi mini, kesegaran sama.', image: 'https://placehold.co/100x100/orange/white?text=Merah+S' },
  { id: 3, name: 'Teh Original Hijau', category: 'Original', price: 5000, size: 'Cup Besar', desc: 'Aroma melati khas yang menenangkan.', image: 'https://placehold.co/100x100/green/white?text=Hijau' },
  { id: 4, name: 'Teh Original Hijau (Kecil)', category: 'Original', price: 3000, size: 'Cup Kecil', desc: 'Pas buat penghilang dahaga kilat.', image: 'https://placehold.co/100x100/green/white?text=Hijau+S' },
  // Varian Rasa
  { id: 5, name: 'Miwa Lemon Tea', category: 'Varian Rasa', price: 7000, size: 'Cup Besar', desc: 'Perpaduan teh dan lemon segar. Asem manis nagih!', image: 'https://placehold.co/100x100/yellow/black?text=Lemon' },
  { id: 6, name: 'Miwa Lychee Tea', category: 'Varian Rasa', price: 7000, size: 'Cup Besar', desc: 'Ada sensasi leci yang bikin mood naik.', image: 'https://placehold.co/100x100/red/white?text=Lychee' },
  // Thai Tea
  { id: 7, name: 'Thai Tea Original', category: 'Thai Tea', price: 8000, size: 'Cup Besar', desc: 'Creamy, legit, autentik Thailand.', image: 'https://placehold.co/100x100/orange/white?text=Thai+L' },
  { id: 8, name: 'Thai Tea (Kecil)', category: 'Thai Tea', price: 5000, size: 'Cup Kecil', desc: 'Versi hemat buat yang pengen creamy.', image: 'https://placehold.co/100x100/orange/white?text=Thai+S' },
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

  // Logic Filter
  const categories = ['Semua', 'Original', 'Varian Rasa', 'Thai Tea'];
  const filteredMenu = activeCategory === 'Semua' 
    ? MENU_ITEMS 
    : MENU_ITEMS.filter(item => item.category === activeCategory);

  // Logic Checkout WhatsApp
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

    // Ganti nomor WA di sini
    window.open(`https://wa.me/6281234567890?text=${message}`, '_blank');
  };

  return (
    <div className="min-h-screen pb-20 font-sans text-gray-800">
      
      {/* 1. Navbar */}
      <nav className="fixed top-0 w-full z-40 bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-sm">
        <div className="max-w-md mx-auto px-4 py-3 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-amber-500 tracking-tight">miwa.</h1>
          <div className="relative cursor-pointer p-2" onClick={() => setIsCartOpen(true)}>
            {/* Icon Cart Emoji */}
            <span className="text-2xl">🛍️</span>
            {totalItems > 0 && (
              <span className="absolute top-0 right-0 bg-red-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full animate-bounce">
                {totalItems}
              </span>
            )}
          </div>
        </div>
      </nav>

      {/* Main Content Wrapper */}
      <main className="max-w-md mx-auto pt-24 px-4">
        
        {/* 2. Hero Section */}
        <div className="bg-amber-50 rounded-2xl p-6 mb-8 relative overflow-hidden shadow-sm">
          <div className="relative z-10">
            <span className="inline-block bg-white text-amber-700 text-xs font-bold px-3 py-1 rounded-full mb-3 shadow-sm border border-amber-100">
              #pesandulujemputlalubayar
            </span>
            <h2 className="text-3xl font-bold text-gray-800 leading-tight mb-2">
              Miwa, pesan lebih cepat <span className="text-amber-500">tiba langsung ambil</span>
            </h2>
            <p className="text-xs text-gray-500 italic mb-4 flex items-center gap-1">
              ⚡ Pesanan dikerjakan saat tiba di booth biar es gak cair
            </p>
          </div>
          {/* Foto Ilustrasi Sederhana */}
          <div className="absolute -right-2 -bottom-4 text-[100px] opacity-20 rotate-12">🥤</div>
        </div>

        {/* 3. Category Filter */}
        <div className="flex gap-2 overflow-x-auto pb-4 mb-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-all border ${
                activeCategory === cat 
                  ? 'bg-amber-500 text-white border-amber-500 shadow-md' 
                  : 'bg-white text-gray-500 border-gray-200 hover:bg-gray-50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* 4. Menu Catalog */}
        <div className="space-y-4 mb-10">
          {filteredMenu.map((item) => (
            <div key={item.id} className="bg-white p-3 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4 hover:shadow-md transition">
              {/* Foto Kiri */}
              <div className="w-20 h-20 shrink-0 bg-gray-100 rounded-lg overflow-hidden">
                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
              </div>
              
              {/* Deskripsi Tengah */}
              <div className="flex-1">
                <h3 className="font-bold text-gray-800 text-sm">{item.name}</h3>
                <p className="text-xs text-gray-400 mt-1 line-clamp-2">{item.desc}</p>
                <p className="text-amber-600 font-bold mt-2 text-sm">Rp {item.price.toLocaleString('id-ID')}</p>
              </div>

              {/* Tombol Add Kanan */}
              <button 
                onClick={() => addToCart(item)}
                className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center text-amber-500 border border-gray-200 hover:bg-amber-500 hover:text-white transition active:scale-90 font-bold text-xl"
              >
                +
              </button>
            </div>
          ))}
        </div>

        {/* 5. Motivation Section */}
        <div className="bg-gray-800 text-white rounded-xl p-6 text-center mb-24 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400"></div>
          <p className="text-lg font-medium italic transition-all duration-500">
            "{QUOTES[quoteIndex]}"
          </p>
        </div>

      </main>

      {/* 6. Footer */}
      <footer className="text-center text-gray-400 text-xs py-6 pb-24 border-t border-gray-100">
        <p>&copy; {new Date().getFullYear()} The Miwa.</p>
        <p>Refresh Your Day.</p>
      </footer>

      {/* 7. Cart / Checkout Modal */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsCartOpen(false)}></div>
          
          {/* Content */}
          <div className="bg-white w-full max-w-md rounded-t-3xl p-6 relative z-10 max-h-[90vh] overflow-y-auto animate-bounce-up">
            <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto mb-6"></div>
            
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Pesanan Kamu</h2>
              <button onClick={() => setIsCartOpen(false)} className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 font-bold">
                ✕
              </button>
            </div>

            {cart.length === 0 ? (
              <div className="text-center py-10 text-gray-400">
                <p className="text-4xl mb-2">🛒</p>
                <p>Keranjang masih kosong.</p>
                <button onClick={() => setIsCartOpen(false)} className="mt-4 text-amber-500 font-semibold underline">Pesan dulu yuk!</button>
              </div>
            ) : (
              <>
                {/* List Item Cart */}
                <div className="space-y-4 mb-6">
                  {cart.map((item) => (
                    <div key={item.id} className="flex justify-between items-center border-b border-gray-50 pb-4">
                      <div>
                        <h4 className="font-semibold text-sm">{item.name}</h4>
                        <p className="text-xs text-gray-500">Rp {item.price.toLocaleString('id-ID')}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <button onClick={() => updateQty(item.id, -1)} className="w-8 h-8 bg-gray-100 rounded text-gray-600 font-bold">-</button>
                        <span className="font-bold text-sm w-4 text-center">{item.qty}</span>
                        <button onClick={() => updateQty(item.id, 1)} className="w-8 h-8 bg-amber-500 text-white rounded font-bold">+</button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Form Data Pembeli */}
                <div className="bg-gray-50 p-4 rounded-xl space-y-3 mb-6 border border-gray-100">
                  <h3 className="font-bold text-sm text-gray-700">Detail Penjemputan</h3>
                  <input 
                    type="text" 
                    placeholder="Nama Kamu (Cth: Budi)" 
                    className="w-full p-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                    value={buyerName}
                    onChange={(e) => setBuyerName(e.target.value)}
                  />
                  <input 
                    type="time" 
                    className="w-full p-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                    value={pickupTime}
                    onChange={(e) => setPickupTime(e.target.value)}
                  />
                  <textarea 
                    placeholder="Catatan (Es dikit, gula dikit, dll)" 
                    className="w-full p-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                    rows="2"
                    value={buyerNote}
                    onChange={(e) => setBuyerNote(e.target.value)}
                  ></textarea>
                </div>

                {/* Total & Action */}
                <div className="border-t pt-4">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-gray-500">Total Bayar</span>
                    <span className="text-xl font-bold text-amber-600">Rp {totalAmount.toLocaleString('id-ID')}</span>
                  </div>
                  <button 
                    onClick={handleCheckout}
                    className="w-full bg-emerald-600 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-emerald-700 transition shadow-lg shadow-emerald-100"
                  >
                    💬 Pesan via WhatsApp
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
