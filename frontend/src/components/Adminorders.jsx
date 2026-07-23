import React, { useEffect, useState } from 'react';
import axios from 'axios';

function AdminOrders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedBukti, setSelectedBukti] = useState(null);

    // State untuk modal detail pesanan
    const [selectedOrderDetail, setSelectedOrderDetail] = useState(null);
    const [detailItems, setDetailItems] = useState([]);
    const [loadingDetail, setLoadingDetail] = useState(false);

    // untuk menampilkan history order pada admin dashboard dari endpoint
    const fetchAdminOrders = async () => {
        try {
            const response = await axios.get('https://theerasstore-production.up.railway.app/api/admin/orders');
            setOrders(response.data);
        } catch (error) {
            console.error('Gagal mengambil data order admin:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAdminOrders();
    }, []);

    // Ambil detail item pesanan
    const handleViewDetail = async (order) => {
        setSelectedOrderDetail(order);
        setLoadingDetail(true);
        try {
            const response = await axios.get(
                `https://theerasstore-production.up.railway.app/api/admin/orders/${order.Order_ID}/detail`
            );
            setDetailItems(response.data);
        } catch (error) {
            console.error('Gagal mengambil detail pesanan:', error);
            setDetailItems([]);
        } finally {
            setLoadingDetail(false);
        }
    };

    const closeDetailModal = () => {
        setSelectedOrderDetail(null);
        setDetailItems([]);
    };

    if (loading) {
        return (
            <div className="p-8 text-center font-folklore text-slate-500">
                Loading dashboard orders...
            </div>
        );
    }

    return (
        <div className="p-6 md:p-10 max-w-7xl mx-auto bg-white min-h-screen">
            <h2 className="text-2xl font-bold font-folklore text-slate-800 mb-2">
                Customer Payments Dashboard
            </h2>
            <p className="text-sm font-folklore text-slate-500 mb-8">
                Pantau riwayat checkout, nominal transfer, beserta bukti pembayaran customer.
            </p>

            <div className="overflow-x-auto border border-slate-200 rounded-sm shadow-sm">
                <table className="w-full min-w-[800px] text-left border-collapse font-folklore text-sm">
                    <thead>
                        <tr className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider">
                            <th className="p-4">Order ID</th>
                            <th className="p-4">Customer</th>
                            <th className="p-4">Date Placed</th>
                            <th className="p-4">Shipping Address</th>
                            <th className="p-4">Total Price</th>
                            <th className="p-4">Status</th>
                            <th className="p-4 text-center">Receipt</th>
                            <th className="p-4 text-center">Detail</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {orders.map((order) => (
                            <tr key={order.Order_ID}>
                                <td className="py-4 px-6 text-slate-700 font-medium">
                                    #{order.Order_ID}
                                </td>

                                <td className="py-4 px-6 text-slate-700 font-medium">
                                    {order.Nama_Customer}
                                </td>

                                <td className="py-4 px-6 text-slate-500 italic">
                                    {new Date(order.Tanggal_Order).toLocaleDateString('id-ID', {
                                        day: 'numeric',
                                        month: 'short',
                                        year: 'numeric'
                                    })}
                                </td>

                                <td className="py-4 px-6 text-slate-600 max-w-[220px]">
                                    <span className="line-clamp-2" title={order.Alamat}>
                                        {order.Alamat || '-'}
                                    </span>
                                </td>

                                <td className="py-4 px-6 font-bold text-slate-800">
                                    Rp {Number(order.Total_Harga).toLocaleString('id-ID')}
                                </td>

                                <td className="py-4 px-6">
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                                        order.Status.toLowerCase() === 'success'
                                            ? 'bg-green-100 text-green-700'
                                            : 'bg-amber-100 text-amber-700'
                                    }`}>
                                        {order.Status.toUpperCase()}
                                    </span>
                                </td>

                                <td className="py-4 px-6 text-center">
                                    {order.Bukti_Bayar ? (
                                        <button
                                            onClick={() => setSelectedBukti(order.Bukti_Bayar)}
                                            className="text-indigo-600 hover:underline text-sm font-semibold cursor-pointer"
                                        >
                                            View Image
                                        </button>
                                    ) : (
                                        <span className="text-slate-400 italic text-sm">No receipt uploaded</span>
                                    )}
                                </td>

                                <td className="py-4 px-6 text-center">
                                    <button
                                        onClick={() => handleViewDetail(order)}
                                        className="px-3 py-1.5 text-xs font-bold text-white bg-slate-800 hover:bg-black rounded-sm transition-colors cursor-pointer"
                                    >
                                        View Detail
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modal Bukti Bayar */}
            {selectedBukti && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
                    <div className="bg-white p-6 max-w-md w-full rounded-sm border border-slate-200 shadow-xl relative font-folklore">
                        <h3 className="font-bold text-slate-800 mb-4">Proof of Transfer</h3>

                        <div className="bg-slate-50 p-2 border border-slate-200 rounded-sm mb-6">
                            <img
                                src={selectedBukti}
                                alt="Bukti Transfer Customer"
                                className="w-full max-h-96 object-contain mx-auto"
                            />
                        </div>

                        <button
                            onClick={() => setSelectedBukti(null)}
                            className="w-full bg-[#1a1a1a] hover:bg-black text-white font-semibold py-2.5 rounded-sm transition-all text-sm cursor-pointer"
                        >
                            Close Preview
                        </button>
                    </div>
                </div>
            )}

            {/* Modal Detail Pesanan */}
            {selectedOrderDetail && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
                    <div className="bg-white p-6 md:p-8 max-w-2xl w-full rounded-sm border border-slate-200 shadow-xl relative font-folklore max-h-[85vh] overflow-y-auto custom-scrollbar">
                        <div className="flex items-start justify-between mb-6">
                            <div>
                                <h3 className="text-lg font-bold text-slate-800">
                                    Order Detail #{selectedOrderDetail.Order_ID}
                                </h3>
                                <p className="text-xs text-slate-500 mt-1">
                                    {selectedOrderDetail.Nama_Customer} &middot;{' '}
                                    {new Date(selectedOrderDetail.Tanggal_Order).toLocaleDateString('id-ID', {
                                        day: 'numeric',
                                        month: 'long',
                                        year: 'numeric'
                                    })}
                                </p>
                            </div>
                            <button
                                onClick={closeDetailModal}
                                className="text-slate-400 hover:text-slate-700 transition-colors p-1 cursor-pointer"
                                aria-label="Close detail modal"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <div className="grid grid-cols-2 gap-3 mb-6">
                            <div className="bg-slate-50 border border-slate-200 rounded-sm p-3">
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Status</p>
                                <span className={`inline-block mt-1 px-2.5 py-1 rounded-full text-xs font-bold ${
                                    selectedOrderDetail.Status.toLowerCase() === 'success'
                                        ? 'bg-green-100 text-green-700'
                                        : 'bg-amber-100 text-amber-700'
                                }`}>
                                    {selectedOrderDetail.Status.toUpperCase()}
                                </span>
                            </div>
                            <div className="bg-slate-50 border border-slate-200 rounded-sm p-3">
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Price</p>
                                <p className="text-sm font-bold text-slate-800 mt-1">
                                    Rp {Number(selectedOrderDetail.Total_Harga).toLocaleString('id-ID')}
                                </p>
                            </div>
                        </div>

                        <div className="bg-slate-50 border border-slate-200 rounded-sm p-3 mb-6">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Shipping Address</p>
                            <p className="text-sm text-slate-700 mt-1">{selectedOrderDetail.Alamat || '-'}</p>
                        </div>

                        <div>
                            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
                                Items Purchased
                            </h4>

                            {loadingDetail ? (
                                <p className="text-sm text-slate-400 italic py-4 text-center">Loading items...</p>
                            ) : detailItems.length > 0 ? (
                                <div className="border border-slate-200 rounded-sm overflow-hidden">
                                    <table className="w-full text-left text-sm">
                                        <thead>
                                            <tr className="bg-slate-50 border-b border-slate-200 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                                                <th className="p-3">Product</th>
                                                <th className="p-3 text-center">Qty</th>
                                                <th className="p-3 text-right">Price</th>
                                                <th className="p-3 text-right">Subtotal</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100">
                                            {detailItems.map((item) => (
                                                <tr key={item.Item_ID}>
                                                    <td className="p-3 flex items-center gap-2">
                                                        {item.Gambar && (
                                                            <img
                                                                src={item.Gambar.split(',')[0]}
                                                                alt={item.Namaproduk}
                                                                className="w-8 h-8 object-contain bg-slate-100 border border-slate-200 rounded-sm flex-shrink-0"
                                                            />
                                                        )}
                                                        <span className="font-medium text-slate-700">{item.Namaproduk}</span>
                                                    </td>
                                                    <td className="p-3 text-center text-slate-600">{item.Qty}</td>
                                                    <td className="p-3 text-right text-slate-600">
                                                        Rp {Number(item.Harga_Beli).toLocaleString('id-ID')}
                                                    </td>
                                                    <td className="p-3 text-right font-bold text-slate-800">
                                                        Rp {(Number(item.Harga_Beli) * Number(item.Qty)).toLocaleString('id-ID')}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <p className="text-sm text-slate-400 italic py-4 text-center">
                                    Tidak ada data item untuk pesanan ini.
                                </p>
                            )}
                        </div>

                        <button
                            onClick={closeDetailModal}
                            className="w-full mt-6 bg-slate-800 hover:bg-black text-white font-semibold py-2.5 rounded-sm transition-all text-sm cursor-pointer"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AdminOrders;
