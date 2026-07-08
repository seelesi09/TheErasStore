import React, { useState, useEffect } from "react";

export default function Edit({ isOpen, onClose, productData, onSave }) {
    const [formProduct, setFormProduct] = useState({
        Kodeproduk: '',
        Namaproduk: '',
        Kategori: '',
        Harga: '',
        Stok: '',
        Deskripsi: '', 
        Gambar: '' 
    });
    const [selectedFiles, setSelectedFiles] = useState([]);

    useEffect(() => {
        if (productData) {
            setFormProduct({
                Kodeproduk: productData.Kodeproduk || productData.kodeproduk || '',
                Namaproduk: productData.Namaproduk || productData.namaproduk || '',
                Kategori: productData.Kategori || productData.kategori || '',
                Harga: productData.Harga || productData.harga || '',
                Stok: productData.Stok || productData.stok || '',
                Deskripsi: productData.Deskripsi || productData.deskripsi || '', 
                Gambar: productData.Gambar || productData.gambar || ''
            });
            setSelectedFiles([]); 
        }
    }, [productData, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        
        const updatedData = {
            ...formProduct,
            fileBaru: selectedFiles 
        };

        onSave(e, updatedData); 
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-[#838383] p-6 rounded-3xl border border-[#545454]/30 shadow-xl space-y-4 w-full max-w-md relative">
                <button type="button" onClick={onClose}
                    className="absolute top-4 right-4 text-[#1a1a1a] hover:text-black font-bold text-lg">
                    <img src="https://www.svgrepo.com/show/525281/close-circle.svg" alt="Close" className="w-6 h-6" />
                </button>
                <h3 className="text-lg font-bold text-[#000000] font-folklore">
                    Edit Product
                </h3>

                <form onSubmit={handleSubmit} className="space-y-3">
                    <div>
                        <label className="text-xs font-semibold text-[#1a1a1a]">Product Code</label>
                        <input type="text" value={formProduct.Kodeproduk} onChange={(e) => setFormProduct({ ...formProduct, Kodeproduk: e.target.value })}
                            className="w-full p-2.5 mt-1 text-sm bg-white border border-[#b2b2b2] text-[#1a1a1a] rounded-xl focus:outline-none focus:border-[#000000]"
                            required />
                    </div>
                    <div>
                        <label className="text-xs font-semibold text-[#1a1a1a]">Name of the Product</label>
                        <input type="text" value={formProduct.Namaproduk} onChange={(e) => setFormProduct({ ...formProduct, Namaproduk: e.target.value })}
                            className="w-full p-2.5 mt-1 text-sm bg-white border border-[#b2b2b2] text-[#1a1a1a] rounded-xl focus:outline-none focus:border-[#000000]"
                            required />
                    </div>
                    <div>
                        <label className="text-xs font-semibold text-[#1a1a1a]">Category</label>
                        <input type="text" value={formProduct.Kategori} onChange={(e) => setFormProduct({ ...formProduct, Kategori: e.target.value })}
                            className="w-full p-2.5 mt-1 text-sm bg-white border border-[#b2b2b2] text-[#1a1a1a] rounded-xl focus:outline-none focus:border-[#000000]"
                            required />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                        <div>
                            <label className="text-xs font-semibold text-[#1a1a1a]">Price</label>
                            <input type="text" value={formProduct.Harga} onChange={(e) => setFormProduct({ ...formProduct, Harga: e.target.value })}
                                className="w-full p-2.5 mt-1 text-sm bg-white border border-[#b2b2b2] text-[#1a1a1a] rounded-xl focus:outline-none focus:border-[#000000]"
                                required />
                        </div>
                        <div>
                            <label className="text-xs font-semibold text-[#1a1a1a]">Stock</label>
                            <input type="text" value={formProduct.Stok} onChange={(e) => setFormProduct({ ...formProduct, Stok: e.target.value })}
                                className="w-full p-2.5 mt-1 text-sm bg-white border border-[#b2b2b2] text-[#1a1a1a] rounded-xl focus:outline-none focus:border-[#000000]"
                                required />
                        </div>
                    </div>
                    <div>
                        <label className="text-xs font-semibold text-[#1a1a1a]">Description</label>
                        <textarea
                            placeholder="Masukkan deskripsi produk..."
                            value={formProduct.Deskripsi}
                            onChange={(e) => setFormProduct({ ...formProduct, Deskripsi: e.target.value })}
                            className="w-full p-2.5 mt-1 text-sm bg-white border border-[#b2b2b2] text-[#1a1a1a] rounded-xl focus:outline-none focus:border-[#000000] min-h-[80px] resize-y"
                            required
                        />
                    </div>

                    <div>
                        <label className="text-xs font-semibold text-[#1a1a1a]">Update Picture (Optional)</label>
                        <input type="file" multiple onChange={(e) => setSelectedFiles(Array.from(e.target.files))}
                            className="w-full text-xs mt-1 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-[#1a1a1a] file:text-[#b2b2b2] hover:file:bg-[#000000] text-[#1a1a1a]"
                        />
                        {formProduct.Gambar && selectedFiles.length === 0 && (
                            <p className="text-[10px] text-black/70 mt-1 truncate">Gambar saat ini: {formProduct.Gambar.split('/').pop()}</p>
                        )}
                    </div>

                    <div className="flex gap-2 pt-2 w-full">
                        <button type="button" onClick={onClose} className="w-1/2 py-2.5 bg-white border border-[#b2b2b2] text-[#1a1a1a] font-semibold text-sm rounded-xl hover:bg-gray-100 transition-colors">
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="w-1/2 py-2.5 text-white font-semibold text-sm rounded-xl transition-colors bg-[#1a1a1a] hover:bg-[#000000] shadow-md"
                        >
                            Update Database
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}