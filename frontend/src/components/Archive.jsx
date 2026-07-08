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
        { name: "Folklore", bg: "bg-[#f1f5f9]", text: "text-[#475569]", border: "border-[#475569]", audio: "/audio/8.mp3" },
        { name: "Evermore", bg: "bg-[#fef3c7]", text: "text-[#78350f]", border: "border-[#78350f]", audio: "/audio/9.mp3" },
        { name: "Midnights", bg: "bg-[#0f172a]", text: "text-[#93c5fd]", border: "border-[#93c5fd]", audio: "/audio/10.mp3" },
        { name: "The Tortured Poets Department", bg: "bg-[#f8f6f0]", text: "text-[#2d2d2d]", border: "border-[#2d2d2d]", audio: "/audio/11.mp3" },
        { name: "The Life of a Showgirl", bg: "bg-[#ffedd5]", text: "text-[#ea580c]", border: "border-[#ea580c]", audio: "/audio/12.mp3" }
    ];

    const [currentBg, setCurrentBg] = useState("bg-[#f8fafc]");
    const [isDetailOpen, setIsDetailOpen] = useState(false);
    const [selectedProductToDetail, setSelectedProductToDetail] = useState(null);

    const observerRef = useRef(null);
    const audioRef = useRef(null);
    const currentAudioPathRef = useRef("");

    const playEraAudio = (audioPath) => {
        if (!audioPath) return;
        if (currentAudioPathRef.current === audioPath) return;

        if (audioRef.current) {
            audioRef.current.pause();
        }

        audioRef.current = new Audio(audioPath);
        audioRef.current.loop = true;
        currentAudioPathRef.current = audioPath;

        audioRef.current.play().catch((err) => {
            console.log(err);
        });
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

                            if (eraBg) setCurrentBg(eraBg);
                            if (eraAudio) playEraAudio(eraAudio);
                        }
                    });
                },
                {
                    threshold: 0.2,
                    rootMargin: "-10% 0px -40% 0px"
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

    return (
        <div className={`min-h-screen ${currentBg} py-16 px-6 md:px-12 lg:px-24 transition-colors duration-700 ease-in-out`}>
            <div className="max-w-7xl mx-auto">

                <button
                    onClick={() => setCurrentView('pembeli')}
                    className="mb-8 text-sm font-folklore font-bold opacity-70 hover:opacity-100 transition-opacity"
                >
                    ← Back to Shop
                </button>

                <h2 className="text-4xl font-bold font-folklore tracking-tight mb-4">
                    The Eras Archive
                </h2>
                <p className="opacity-70 font-folklore mb-16 text-sm md:text-base">
                    Browse through the musical chapters, cataloged by every timeline and memory. *(Scroll to listen)*
                </p>

                <div className="space-y-24">
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
                                className="pt-12 pb-6 transition-all duration-500"
                            >
                                <h3 className={`text-2xl md:text-3xl font-bold font-folklore tracking-wide mb-8 border-b-2 ${era.border} ${era.text} inline-block pb-1 transition-colors duration-500`}>
                                    {era.name} Era
                                </h3>

                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                                    {eraProducts.map((product) => {
                                        const nama = product.Namaproduk || product.namaproduk || product.Nama || product.nama;
                                        const harga = product.Harga || product.harga;
                                        const gambarRaw = product.Gambar || product.gambar;

                                        return (
                                            <div key={product.ID || product.id} className="flex flex-col group bg-white/90 backdrop-blur-sm border border-black/5 p-4 rounded-sm shadow-sm hover:shadow-md transition-all duration-300">

                                                <div
                                                    onClick={() => handleOpenDetail(product)}
                                                    className="w-full aspect-square overflow-hidden bg-slate-100 mb-4 rounded-sm cursor-pointer"
                                                >
                                                    <img
                                                        src={
                                                            gambarRaw && typeof gambarRaw === 'string'
                                                                ? gambarRaw.split(',')[0].trim()
                                                                : 'https://via.placeholder.com/200'
                                                        }
                                                        alt={nama}
                                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                                    />
                                                </div>

                                                <div className="flex-1 flex flex-col justify-between">
                                                    <div className="cursor-pointer" onClick={() => handleOpenDetail(product)}>
                                                        <h4 className="text-sm font-bold font-folklore text-slate-900 hover:underline">{nama}</h4>
                                                        <p className="text-base font-bold text-slate-700 font-folklore mt-2">
                                                            Rp {Number(harga || 0).toLocaleString('id-ID')}
                                                        </p>
                                                    </div>

                                                    <button
                                                        onClick={() => handleRealAddToCart(product.ID || product.id)}
                                                        className="w-full mt-4 bg-[#1a1a1a] hover:bg-black text-white font-folklore text-xs font-semibold py-2.5 rounded-sm transition-all"
                                                    >
                                                        Add To Cart
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