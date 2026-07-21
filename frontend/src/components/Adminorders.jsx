import React, { useEffect, useState } from 'react';
import axios from 'axios';

function AdminOrders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedBukti, setSelectedBukti] = useState(null); 

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
        fetchAdminOrders(); // menjalankan fungsi diatas
    }, []); // hny sekali aj

    // jika loding 
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
                <table className="w-full text-left border-collapse font-folklore text-sm">
                    <thead>
                        <tr className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider">
                            <th className="p-4">Order ID</th>
                            <th className="p-4">Customer</th>
                            <th className="p-4">Date Placed</th>
                            <th className="p-4">Shipping Address</th>
                            <th className="p-4">Total Price</th>
                            <th className="p-4">Status</th>
                            <th className="p-4 text-center">Receipt</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {/* render setiap data dari database  */}
                        {orders.map((order) => (
                            // setiap tabel dikasih id dari database
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
                                    {/* jika order sukses status jadi hijau, kl pending kunink oren  */}
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${order.Status.toLowerCase() === 'success'
                                            ? 'bg-green-100 text-green-700'
                                            : 'bg-amber-100 text-amber-700'
                                        }`}>
                                        {order.Status.toUpperCase()}
                                    </span>
                                </td>
                                        {/* cek bukti bayar biar bisa di view  */}
                                <td className="py-4 px-6">
                                    {order.Bukti_Bayar ? (
                                        <a
                                            href={order.Bukti_Bayar}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-indigo-600 hover:underline text-sm font-semibold"
                                        >
                                            View Image
                                        </a>
                                    ) : (
                                        <span className="text-slate-400 italic text-sm">No receipt uploaded</span>
                                    )}
                                </td>

                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

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
                            className="w-full bg-[#1a1a1a] hover:bg-black text-white font-semibold py-2.5 rounded-sm transition-all text-sm"
                        >
                            Close Preview
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AdminOrders;
