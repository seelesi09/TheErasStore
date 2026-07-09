import React, { useEffect, useRef, useState } from 'react';
import Detail from './Detail';

function Archive({ products, handleRealAddToCart, setCurrentView }) {
  const eras = [
    { name: "Taylor Swift", bg: "bg-[#e2ecc8]", text: "text-[#3d5a25]", border: "border-[#3d5a25]", audio: "/audio/1.mp3" },
    { name: "Fearless", bg: "bg-[#f4ebd0]", text: "text-[#b28d46]", border: "border-[#b28d46]", audio: "/audio/2.mp3" },
    { name: "Speak Now", bg: "bg-[#f0dbf0]", text: "text-[#662d66]", border: "border-[#662d66]", audio: "/audio/3.mp3" },
    { name: "Red", bg: "bg-[#f5e6e6]", text: "text-[#8b0000]", border: "border-[#8b0000]", audio: "/audio/4.mp3" },
    { name: "1989", bg: "bg-[#e0f2fe]", text: "text-[#0369a1]", border: "border-[#0369a1]", audio: "/audio/5.mp3" },
    { name: "Reputation", bg: "bg-[#1a1a1a]", text: "text-[#f8fafc]", border: "border-[#f8fafc]", audio: "/audio/6.mp3" },
    { name: "Lover", bg: "bg-[#fce7f3]", text: "text-[#db2777]", border: "border-[#db2777]", audio: "/audio/7.mp3" },
    { name: "folklore", bg: "bg-[#f1f5f9]", text: "text-[#475569]", border: "border-[#475569]", audio: "/audio/8.mp3" },
    { name: "evermore", bg: "bg-[#fef3c7]", text: "text-[#78350f]", border: "border-[#78350f]", audio: "/audio/9.mp3" },
    { name: "Midnights", bg: "bg-[#0f172a]", text: "text-[#93c5fd]", border: "border-[#93c5fd]", audio: "/audio/10.mp3" },
    { name: "The Tortured Poets Department", bg: "bg-[#f8f6f0]", text: "text-[#2d2d2d]", border: "border-[#2d2d2d]", audio: "/audio/11.mp3" },
    { name: "The Life of a Showgirl", bg: "bg-[#ffedd5]", text: "text-[#ea580c]", border: "border-[#ea580c]", audio: "/audio/12.mp3" }
  ];

  const [currentBg, setCurrentBg] = useState("bg-[#f8fafc]");
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedProductToDetail, setSelectedProductToDetail] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeEraName, setActiveEraName] = useState("");

  const observerRef = useRef(null);
  const audioRef = useRef(null); 
  const currentAudioPathRef = useRef(""); 

  const playEraAudio = (audioPath, eraName) => {
    if (!audioPath) return;
    setActiveEraName(eraName);
    
    if (currentAudioPathRef.current === audioPath) {
      if (audioRef.current && audioRef.current.paused) {
        audioRef.current.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
      }
      return;
    }

    if (audioRef.current) {
      audioRef.current.pause();
    }

    audioRef.current = new Audio(audioPath);
    audioRef.current.loop = true; 
    currentAudioPathRef.current = audioPath;

    audioRef.current.play()
      .then(() => {
        setIsPlaying(true);
      })
      .catch((err) => {
        console.log(err);
        setIsPlaying(false);
      });
  };

  const togglePlayback = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play()
        .then(() => setIsPlaying(true))
        .catch((err) => console.log(err));
    }
  };

  const setSectionRef = (el) => {
    if (!el) return;

    if (!observerRef.current) {
      observerRef.current = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const eraBg = entry.target.getAttribute('data-bg');
              const eraAudio = entry.target.getAttribute('data-audio');
              const eraName = entry.target.getAttribute('data-name');
              
              if (eraBg) setCurrentBg(eraBg);
              if (eraAudio) playEraAudio(eraAudio, eraName); 
            }
          });
        },
        {
          threshold: 0.15, 
          rootMargin: "-20% 0px -40% 0px"
        }
      );
    }

    observerRef.current.observe(el);
  };

  useEffect(() => {
    return () => {
      if (observerRef.current) observerRef.current.disconnect();
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const handleOpenDetail = (product) => {
    setSelectedProductToDetail(product);
    setIsDetailOpen(true);
  };

  const isDarkBg = currentBg === "bg-[#1a1a1a]" || currentBg === "bg-[#0f172a]";

  return (
    <div className={`min-h-screen ${currentBg} py-20 px-6 md:px-12 lg:px-24 transition-colors duration-1000 ease-in-out relative selection:bg-black/10`}>
      
      <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-white/80 backdrop-blur-md px-4 py-2.5 rounded-full shadow-lg border border-black/5 transition-all duration-500 ${isPlaying ? 'opacity-100' : 'opacity-60 hover:opacity-100'}`}>
        <div className="text-right hidden sm:block">
          <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">Now Playing</p>
          <p className="text-xs font-semibold font-folklore text-slate-800 max-w-[120px] truncate">{activeEraName || "Silence"}</p>
        </div>
        <button 
          onClick={togglePlayback}
          className={`w-9 h-9 rounded-full bg-slate-900 text-white flex items-center justify-center shadow-md relative overflow-hidden group`}
        >
          <div className={`absolute inset-0.5 rounded-full border border-dashed border-white/30 ${isPlaying ? 'animate-spin [animation-duration:8s]' : ''}`}></div>
          {isPlaying ? (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 relative z-10">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25v13.5m-7.5-13.5v13.5" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 ml-0.5 relative z-10">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347a1.125 1.125 0 0 1-1.667-.986V5.653Z" />
            </svg>
          )}
        </button>
      </div>

      <div className="max-w-7xl mx-auto">
        
        <button 
          onClick={() => setCurrentView('pembeli')}
          className={`mb-12 text-xs uppercase tracking-widest font-bold opacity-60 hover:opacity-100 transition-all flex items-center gap-2 ${isDarkBg ? 'text-white' : 'text-black'}`}
        >
          <span>←</span> Back to Shop
        </button>

        <header className="mb-24">
          <h2 className={`text-5xl md:text-6xl font-normal font-folklore tracking-tight mb-4 transition-colors duration-1000 ${isDarkBg ? 'text-white' : 'text-slate-900'}`}>
            The Eras Archive
          </h2>
          <p className={`font-folklore max-w-xl text-sm md:text-base transition-colors duration-1000 ${isDarkBg ? 'text-slate-300' : 'text-slate-600'}`}>
            Browse through the musical chapters, cataloged by every timeline and memory. Scroll down to trigger the symphony of eras.
          </p>
        </header>

        <div className="space-y-36">
          {eras.map((era) => {
            const eraProducts = products.filter((p) => {
              const kategoriProduk = p.Kategori || p.kategori;
              return kategoriProduk?.toLowerCase().trim() === era.name.toLowerCase().trim();
            });

            if (eraProducts.length === 0) return null;

            return (
              <div 
                key={era.name} 
                ref={setSectionRef}
                data-bg={era.bg} 
                data-audio={era.audio} 
                data-name={era.name}
                className="pt-4 pb-4"
              >
                <div className="mb-12 flex items-center gap-4">
                  <h3 className={`text-3xl md:text-4xl font-normal font-folklore tracking-wide border-b border-current pb-2 ${era.text} inline-block transition-colors duration-500`}>
                    {era.name}
                  </h3>
                  <div className={`h-[1px] flex-1 bg-current opacity-20 ${era.text}`}></div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12">
                  {eraProducts.map((product) => {
                    const nama = product.Namaproduk || product.namaproduk || product.Nama || product.nama;
                    const harga = product.Harga || product.harga;
                    const gambarRaw = product.Gambar || product.gambar;

                    return (
                      <div key={product.ID || product.id} className="flex flex-col group relative">
                        
                        <div 
                          onClick={() => handleOpenDetail(product)}
                          className="w-full aspect-[4/5] overflow-hidden bg-slate-100/50 mb-4 rounded-sm cursor-pointer shadow-sm group-hover:shadow-md transition-all duration-500 relative"
                        >
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-500 z-10" />
                          <img 
                            src={
                              gambarRaw && typeof gambarRaw === 'string'
                                ? gambarRaw.split(',')[0].trim() 
                                : 'https://via.placeholder.com/300'
                            } 
                            alt={nama}
                            className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-700 ease-out"
                          />
                        </div>

                        <div className="flex-1 flex flex-col justify-between px-1">
                          <div className="cursor-pointer" onClick={() => handleOpenDetail(product)}>
                            <h4 className={`text-sm font-medium tracking-wide font-folklore transition-colors duration-500 ${isDarkBg ? 'text-slate-200' : 'text-slate-800'}`}>{nama}</h4>
                            <p className={`text-sm font-light font-sans mt-1 transition-colors duration-500 ${isDarkBg ? 'text-slate-400' : 'text-slate-500'}`}>
                              IDR {Number(harga || 0).toLocaleString('id-ID')}
                            </p>
                          </div>

                          <button
                            onClick={() => handleRealAddToCart(product.ID || product.id)}
                            className={`w-full mt-4 bg-transparent border text-xs tracking-widest font-semibold py-2.5 rounded-sm transition-all duration-300 ${
                              isDarkBg 
                                ? 'border-white/20 text-white hover:bg-white hover:text-black' 
                                : 'border-black/20 text-black hover:bg-black hover:text-white'
                            }`}
                          >
                            ADD TO CART
                          </button>
                        </div>

                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

      </div>

      <Detail
        isOpen={isDetailOpen}
        onClose={() => {
          setIsDetailOpen(false);
          setSelectedProductToDetail(null);
        }}
        productData={selectedProductToDetail}
        onBuyNow={(prod) => {
          handleRealAddToCart(prod?.ID || prod?.id);
        }}
      />
    </div>
  );
}

export default Archive;