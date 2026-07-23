import React from "react";

export default function Detail({ isOpen, onClose, productData, user, onBuyNow }) {
    if (!isOpen || !productData) return null;

    // Helper untuk membersihkan URL gambar (opsional, aman jika ada URL localhost/Railway)
    const formatImageUrl = (gambarRaw) => {
        if (!gambarRaw || typeof gambarRaw !== 'string') return 'https://via.placeholder.com/360';
        const firstUrl = gambarRaw.split(',')[0].trim();
        return firstUrl.replace('http://localhost:5000', 'https://theerasstore-production.up.railway.app');
    };

    const dataGambar = productData.Gambar || productData.gambar || "";
    const mainImage = formatImageUrl(dataGambar);

    const dataHarga = productData.Harga || productData.harga || 0;
    const hargaProduk = Number(dataHarga);

    const namaProduk = productData.Namaproduk || productData.namaproduk || "Nama Produk Kosong";
    const kategoriProduk = productData.Kategori || productData.kategori || "";
    const deskripsiProduk = productData.Deskripsi || productData.deskripsi || "";
    const stokProduk = productData.Stok || productData.stok || 0;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-3 sm:p-4 md:p-6 overflow-y-auto font-folklore">
            {/* Modal Card - style konsisten Admin Panel (rounded-sm, slate palette) */}
            <div className="bg-white p-5 sm:p-6 md:p-8 rounded-sm border border-slate-200 shadow-2xl w-full max-w-sm sm:max-w-xl md:max-w-3xl relative animate-in fade-in zoom-in-95 duration-200 text-slate-800 my-auto max-h-[90vh] overflow-y-auto custom-scrollbar">

                {/* Tombol Close */}
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 sm:top-4 sm:right-4 text-slate-500 hover:text-slate-800 transition-colors z-10 p-1.5 bg-slate-50 border border-slate-200 rounded-sm shadow-sm"
                    aria-label="Close modal"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 sm:w-5 sm:h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                {/* Grid Responsif: 1 Kolom di HP, 2 Kolom di Tablet & Laptop */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 pt-2 items-start">

                    {/* Gambar Produk */}
                    <div className="w-full aspect-square max-h-[280px] sm:max-h-[350px] md:max-h-none bg-slate-50 rounded-sm overflow-hidden border border-slate-200 flex items-center justify-center mx-auto">
                        <img
                            src={mainImage}
                            alt={namaProduk}
                            className="w-full h-full object-cover object-center"
                        />
                    </div>

                    {/* Info & Detail Produk */}
                    <div className="flex flex-col justify-between h-full space-y-4">
                        <div>
                            {kategoriProduk && (
                                <span className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-sm inline-block">
                                    {kategoriProduk}
                                </span>
                            )}

                            <h2 className="text-xl sm:text-2xl font-black text-slate-800 mt-2 leading-tight">
                                {namaProduk}
                            </h2>

                            <p className="text-xl sm:text-2xl font-black text-slate-800 mt-1 sm:mt-2">
                                Rp {hargaProduk.toLocaleString('id-ID')}
                            </p>

                            <div className="h-[1px] bg-slate-200 my-2 sm:my-3" />

                            <div className="space-y-1">
                                <h4 className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider">Product Description</h4>
                                <div className="text-xs sm:text-sm text-slate-600 leading-relaxed max-h-[120px] sm:max-h-[160px] overflow-y-auto pr-2 custom-scrollbar">
                                    {deskripsiProduk || <span className="italic text-slate-400">There's No Description for this Product</span>}
                                </div>
                            </div>
                        </div>

                        {/* Stok & Tombol Beli */}
                        <div className="space-y-2 sm:space-y-3 pt-2">
                            <div className="flex items-center justify-between text-xs sm:text-sm bg-slate-50 p-2.5 rounded-sm border border-slate-200">
                                <span className="text-slate-500 font-medium">Stock Left:</span>
                                <span className="font-bold text-slate-800">{stokProduk} pcs</span>
                            </div>

                            {user?.role !== 'admin' ? (
                                <button
                                    onClick={() => onBuyNow(productData)}
                                    className="w-full bg-slate-800 hover:bg-black active:scale-[0.98] text-white font-semibold py-2.5 sm:py-3 rounded-sm transition-all shadow-sm flex items-center justify-center gap-2 text-sm sm:text-base"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 sm:w-5 sm:h-5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                                    </svg>
                                    Buy Now
                                </button>
                            ) : (
                                <p className="text-xs text-slate-400 italic text-center py-2">
                                    Admin tidak dapat melakukan pembelian produk.
                                </p>
                            )}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
