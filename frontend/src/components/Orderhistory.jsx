import React, { useEffect, useState } from "react";
import axios from "axios";

function OrderHistory({ user, setCurrentView, setOrderInput }) {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHistory = async () => {
            if (!user) return;
            try {
                const userId = user.ID || user.id;
                const response = await axios.get(`https://theerasstore-production.up.railway.app/api/orders/${userId}`);
                setOrders(response.data);
            } catch (error) {
                console.error('Gagal memuat riwayat order:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchHistory();
    }, [user]);

    const handleRepayment = (orderId, totalHarga) => {
        if (typeof setOrderInput === 'function') {
            setOrderInput({ id: orderId, total: totalHarga });
        }
        setCurrentView('payment');
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#f8fafc]">
                <p className="font-folklore text-slate-500">Loading your order eras...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 py-16 px-6 md:px-12 lg:px-24">
            <div className="max-w-4xl mx-auto">
                <button
                    onClick={() => setCurrentView('pembeli')}
                    className="mb-8 text-sm font-folklore font-bold text-slate-600 hover:text-black transition-colors"
                >
                    ← Back to Shop
                </button>

                <h2 className="text-3xl font-bold text-slate-800 font-folklore tracking-tight mb-12">
                    Your Order History
                </h2>

                {orders.length === 0 ? (
                    <div className="text-center py-16 bg-white border border-slate-200 rounded-sm shadow-sm p-8">
                        <p className="font-folklore text-lg text-slate-500">You haven't made any memories (orders) yet.</p>
                    </div>
                ) : (
                    <div className="space-y-8">
                        {orders.map((order) => {
                            const isPending = order.Status.toUpperCase() === 'PENDING';

                            return (
                                <div key={order.Order_ID} className="bg-white border border-slate-200 rounded-sm shadow-sm overflow-hidden">
                                    <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex flex-wrap justify-between items-center gap-4 text-xs font-folklore">
                                        <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex flex-wrap justify-between items-center gap-4 text-xs font-folklore">
                                            <div>
                                                <p className="text-slate-400">ORDER PLACED</p>
                                                <p className="font-bold text-slate-700">
                                                    {new Date(order.Tanggal_Order).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                                                </p>
                                            </div>

                                            {/* TAMBAHAN: Alamat pengiriman */}
                                            <div>
                                                <p className="text-slate-400">SHIPPING ADDRESS</p>
                                                <p className="font-bold text-slate-700 max-w-[200px] truncate" title={order.Alamat}>
                                                    {order.Alamat || '-'}
                                                </p>
                                            </div>

                                            <div>
                                                <p className="text-slate-400">TOTAL PRICE</p>
                                                {/* ... sisanya sama */}
                                            </div>
                                            {/* ... */}
                                        </div>
                                        <div>
                                            <p className="text-slate-400 mb-0.5">STATUS</p>
                                            <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] uppercase tracking-wider ${isPending
                                                ? 'bg-amber-100 text-amber-800 border border-amber-200'
                                                : 'bg-green-100 text-green-800 border border-green-200'
                                                }`}>
                                                {order.Status}
                                            </span>
                                        </div>

                                        <div className="flex items-center gap-4">
                                            <p className="text-slate-400 font-mono">ID: #{order.Order_ID}</p>

                                            {isPending && (
                                                <button
                                                    onClick={() => handleRepayment(order.Order_ID, order.Total_Harga)}
                                                    className="px-3 py-1 bg-amber-500 hover:bg-amber-600 text-white font-bold text-[11px] rounded-sm shadow-sm transition-all uppercase tracking-wide"
                                                >
                                                    Proceed to Payment →
                                                </button>
                                            )}
                                        </div>
                                    </div>

                                    <div className="p-6 divide-y divide-slate-100">
                                        {order.Items.map((item, idx) => (
                                            <div key={idx} className="flex gap-4 items-center py-4 first:pt-0 last:pb-0">
                                                <img
                                                    src={item.Gambar ? item.Gambar.split(',')[0].trim() : 'https://via.placeholder.com/80'}
                                                    alt={item.Namaproduk}
                                                    className="w-16 h-16 object-cover bg-slate-50 border border-slate-200 rounded-sm"
                                                />
                                                <div className="flex-1">
                                                    <h4 className="text-sm font-bold font-folklore text-slate-900">{item.Namaproduk}</h4>
                                                    <p className="text-xs text-slate-500 font-folklore mt-0.5">Quantity: {item.Jumlah}</p>
                                                    <p className="text-xs font-bold text-slate-600 font-folklore mt-1">
                                                        Rp {Number(item.Harga_Beli).toLocaleString('id-ID')}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}

export default OrderHistory;
