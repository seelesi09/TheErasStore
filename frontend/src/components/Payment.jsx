import React, { useState } from 'react';

const Payment = ({ Order_ID, Total_Harga, setCurrentView }) => {
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!image) {
            alert("Silakan pilih foto bukti transfer terlebih dahulu!");
            return;
        }

        setLoading(true);
        setMessage('');

        const formData = new FormData();
        formData.append('Order_ID', Order_ID);
        formData.append('image', image);

        try {
            const response = await fetch('http://localhost:5000/api/payment/confirm', {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();

            if (response.ok) {
                alert("Pembayaran Berhasil Dikonfirmasi!");
                setCurrentView('history');
            } else {
                setMessage(data.message || "Terjadi kesalahan saat konfirmasi.");
            }
        } catch (error) {
            console.error("Error:", error);
            setMessage("Gagal terhubung ke server.");
        } finally {
            setLoading(false);
        }
    };

    if (!Order_ID) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] px-4">
                <div className="p-8 text-center bg-white rounded-sm border border-slate-200 shadow-sm max-w-md w-full">
                    <h3 className="font-folklore text-lg font-bold text-slate-800 mb-6">ID Pesanan tidak ditemukan.</h3>
                    <button
                        onClick={() => setCurrentView('pembeli')}
                        className="w-full bg-[#1a1a1a] hover:bg-black text-white font-folklore font-semibold py-3 rounded-sm transition-all shadow-md"
                    >
                        ← Kembali ke Toko
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 py-16 px-6 md:px-12 lg:px-24">
            <div className="max-w-xl mx-auto">
                <button
                    onClick={() => setCurrentView('pembeli')}
                    className="mb-8 flex items-center gap-2 text-sm font-folklore font-bold text-slate-600 hover:text-black transition-colors"
                >
                    ← Cancel & Back to Shop
                </button>

                <h2 className="font-folklore text-2xl font-bold mb-6 text-slate-800">
                    Complete Your Payment
                </h2>

                <div className="bg-white rounded-sm border border-slate-200 shadow-sm overflow-hidden mb-6">
                    <div className="grid grid-cols-3 gap-4 bg-slate-50 p-4 border-b border-slate-200 text-xs md:text-sm font-folklore">
                        <div>
                            <span className="block text-slate-400 uppercase tracking-wider font-medium text-[10px] md:text-xs">Payment Method</span>
                            <span className="font-bold text-slate-700 block mt-1">Seabank Transfer</span>
                        </div>
                        <div className="text-center">
                            <span className="block text-slate-400 uppercase tracking-wider font-medium text-[10px] md:text-xs">Total Price</span>
                            <span className="font-bold text-slate-900 block mt-1">
                                Rp {Total_Harga ? Total_Harga.toLocaleString('id-ID') : '0'}
                            </span>
                        </div>
                        <div className="text-right">
                            <span className="block text-slate-400 uppercase tracking-wider font-medium text-[10px] md:text-xs">Order ID</span>
                            <span className="font-bold text-slate-500 block mt-1">#{Order_ID}</span>
                        </div>
                    </div>

                    <div className="p-6 bg-white border-b border-slate-100 space-y-3 font-folklore">
                        <span className="inline-block bg-blue-50 text-blue-700 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-sm border border-blue-200">
                            Manual Transfer Account
                        </span>
                        <div className="grid grid-cols-2 gap-y-2 pt-2 text-sm">
                            <div className="text-slate-500">Bank Name</div>
                            <div className="font-bold text-slate-800 text-right">Seabank</div>

                            <div className="text-slate-500">Account Number</div>
                            <div className="font-bold text-slate-900 text-right tracking-wider">9010 6917 3728</div>

                            <div className="text-slate-500">Account Holder</div>
                            <div className="font-bold text-slate-800 text-right">Galang Rambu Anarki</div>
                        </div>
                    </div>

                    <div className="p-6 bg-white">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="font-folklore">
                                <label className="block text-sm font-bold text-slate-800 mb-2">
                                    Upload Receipt / Bukti Transfer
                                </label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    className="block w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-sm file:border file:border-slate-300 file:text-xs file:font-bold file:bg-slate-50 file:text-slate-700 hover:file:bg-slate-100 border border-dashed border-slate-300 rounded-sm p-4 cursor-pointer bg-slate-50/50"
                                    required
                                />
                            </div>

                            {preview && (
                                <div className="text-center p-4 bg-slate-50 border border-slate-200 rounded-sm font-folklore">
                                    <p className="text-xs text-slate-400 mb-3 font-bold">Receipt Preview:</p>
                                    <img src={preview} alt="Preview Bukti" className="max-h-56 mx-auto rounded-sm border border-slate-200 shadow-sm" />
                                </div>
                            )}

                            {message && (
                                <p className="text-xs text-red-600 text-center font-bold font-folklore bg-red-50 p-2 rounded-sm border border-red-100">
                                    {message}
                                </p>
                            )}

                            <button
                                type="submit"
                                disabled={loading}
                                className={`w-full bg-[#1a1a1a] hover:bg-black text-white font-folklore font-semibold py-3 rounded-sm transition-all shadow-md ${loading ? 'opacity-60 cursor-not-allowed' : ''
                                    }`}
                            >
                                {loading ? "Processing Payment..." : "Confirm Payment"}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Payment;