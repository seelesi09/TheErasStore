import React from "react";

export default function Detail({ isOpen, onClose, productData, onBuyNow }) {
    if (!isOpen || !productData) return null;

    const dataGambar = productData.Gambar || productData.gambar || "";
    const images = dataGambar ? dataGambar.split(',').map(img => img.trim()) : [];
    const mainImage = images.length > 0 ? images[0] : 'https://via.placeholder.com/360';

    const dataHarga = productData.Harga || productData.harga || 0;
    const hargaProduk = Number(dataHarga);

    const namaProduk = productData.Namaproduk || productData.namaproduk || "Nama Produk Kosong";
    const kategoriProduk = productData.Kategori || productData.kategori || "";
    const deskripsiProduk = productData.Deskripsi || productData.deskripsi || "";
    const stokProduk = productData.Stok || productData.stok || 0;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white/90 backdrop-blur-md p-6 rounded-3xl border border-white/20 shadow-2xl w-full max-w-3xl relative animate-in fade-in zoom-in-95 duration-200 text-slate-800">
                
                <button onClick={onClose} className="absolute top-4 right-4 text-[#1a1a1a] hover:opacity-70 transition-opacity z-10">
                    <img src="https://www.svgrepo.com/show/525281/close-circle.svg" alt="Close" className="w-6 h-6" />
                </button>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 items-start">
                    
                    {/* SISI KIRI: Foto Produk */}
                    <div className="w-full aspect-square bg-slate-100 rounded-2xl overflow-hidden shadow-inner border border-slate-200 flex items-center justify-center">
                        <img src={mainImage} alt={namaProduk} className="w-full h-full object-cover object-center" />
                    </div>

                    {/* SISI KANAN: Detail Informasi */}
                    <div className="flex flex-col justify-between h-full space-y-4">
                        <div>
                            {kategoriProduk && (
                                <span className="text-xs font-bold tracking-widest text-slate-500 uppercase bg-slate-200/50 px-2.5 py-1 rounded-md">
                                    {kategoriProduk}
                                </span>
                            )}
                            
                            <h2 className="text-2xl font-black text-slate-900 mt-3 font-folklore">
                                {namaProduk}
                            </h2>
                            
                            <p className="text-2xl font-black text-slate-800 mt-2 font-folklore">
                                Rp {hargaProduk.toLocaleString('id-ID')}
                            </p>
                            
                            <div className="h-[1px] bg-slate-300/50 my-3" />
                            
                            <div className="space-y-1">
                                <h4 className="text-xs font-bold text-slate-400 tracking-wider uppercase">Product Description</h4>
                                <div className="text-sm text-slate-600 leading-relaxed max-h-[150px] overflow-y-auto pr-2 custom-scrollbar">
                                    {deskripsiProduk || <span className="italic text-slate-400">There's No Description for this Product</span>}
                                </div>
                            </div>
                        </div>

                        {/* Stok & Tombol */}
                        <div className="space-y-3 pt-2">
                            <div className="flex items-center justify-between text-sm bg-slate-100/80 p-2.5 rounded-xl border border-slate-200/50">
                                <span className="text-slate-500 font-medium">Stock Left:</span>
                                <span className="font-bold text-slate-900">{stokProduk} pcs</span>
                            </div>

                            <button
                                onClick={() => onBuyNow(productData)}
                                className="w-full bg-[#1a1a1a] hover:bg-black text-white font-semibold py-3 rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                                </svg>
                                Buy Now
                            </button>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}