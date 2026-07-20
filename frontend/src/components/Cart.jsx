import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

// template sweet alert swal 
const toast = {
    success: (message) => {
        Swal.fire({
            toast: true,
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
            icon: 'success',
            title: message,
            customClass: {
                popup: 'folk-folklore',
                title: 'font-folkore',
            },
            showClass: { popup: 'animate__animated animate__zoomInDown' },
            hideClass: { popup: 'animate__animated animate__zoomOutDown' }
        });
    },
    error: (message) => {
        Swal.fire({
            toast: true,
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
            icon: 'error',
            title: message,
            customClass: {
                popup: 'folk-folklore',
                title: 'font-folkore',
            },
            showClass: { popup: 'animate__animated animate__zoomInDown' },
            hideClass: { popup: 'animate__animated animate__zoomOutDown' }
        });
    }
};

function Cart({ user, setCurrentView, onCheckoutSuccess }) {

    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);

    // fungsi get keranjang ambil dari endpoint
    const fetchCart = async () => {
        if (!user) return;
        setLoading(true);
        try {
            const userId = user.ID || user.id;
            const response = await axios.get(`https://theerasstore-production.up.railway.app/api/keranjang/${userId}`);
            setCartItems(response.data);
        } catch (error) {
            console.error('Gagal Mengambil Data keranjang: ', error);
            toast.error('Error Load Cart')
        } finally {
            setLoading(false);
        }
    };

    // menggunakan fungsi get keranjang
    useEffect(() => {
        fetchCart();
    }, [user]); // fetch hanya punyanya user aja

    // fungssi delete produk di keranjang 
    const handleDeleteItem = async (keranjangID) => {
        if (!keranjangID) {
            toast.error('Invalid Cart ID');
            return;
        }

        try {
            const response = await axios.delete(`https://https://theerasstore-production.up.railway.app/api/keranjang/${keranjangID}`);
            toast.success(response.data.message || 'Product Deleted');

            fetchCart();
        } catch (error) {
            console.error('Gagal Menghapus Item: ', error);
            toast.error('Error Deleting Product');
        }
    }

    // fungsi add jumlah produk di keranjang
    const handleUpdateQuantity = async (keranjangID, JumlahSaatIni, aksi) => {
        const jumlahBaru = aksi === 'tambah' ? JumlahSaatIni + 1 : JumlahSaatIni - 1;

        if (jumlahBaru < 1) {
            handleDeleteItem(keranjangID);
            return
        }

        try {
            await axios.put(`https://https://theerasstore-production.up.railway.app/api/keranjang/${keranjangID}`, {
                Jumlah: jumlahBaru
            });
            fetchCart();
        } catch (error) {
            console.error('Gagal Memperbarui Jumlah: ', error);
            toast.error('Gagal Memperbarui Jumlah Produk');
        }
    };

    // hitung total harga di keranjang 
    const calculateTotal = () => {
        return cartItems.reduce((sum, item) => sum + (Number(item.Harga) * item.Jumlah), 0);
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#f8fafc]">
                <p className="font-folklore text-slate-500">Loading Your Era's Cart</p>
            </div>
        );
    }

    // fungsi checkout 
    const handleCheckout = async () => {
        // jika blm login dibanned 
        if (!user) return;

        // dikasih pertanyaan dulu apakah bener2 mau byr apa enggak 
        Swal.fire({
            title: 'Are you sure?',
            text: "Do you want to checkout your Era's items?",
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#1a1a1a',
            cancelButtonColor: '#838383',
            confirmButtonText: 'Yes, Checkout!'
            // jika iya bakalan dihitung total harganya
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const userId = user.ID || user.id;
                    const totalHarga = calculateTotal();

                    const response = await axios.post('https://https://theerasstore-production.up.railway.app/api/checkout', {
                        User_ID: userId,
                        Total_Harga: totalHarga
                    });

                    const orderIdDariBackend = response.data.Order_ID;

                    if (orderIdDariBackend) {
                        toast.success('Checkout Successful! Redirecting to payment...');

                        onCheckoutSuccess(orderIdDariBackend, totalHarga);
                    } else {
                        toast.error('Backend did not return Order ID');
                    }

                } catch (error) {
                    console.error('Gagal melakukan checkout:', error);
                    toast.error('Checkout failed, please try again.');
                }
            }
        });
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 py-16 px-6 md:px-12 lg:px-24">
            <div className="max-w-5xl mx-auto">
                <button
                    onClick={() => setCurrentView('pembeli')}
                    className="mb-8 flex items-center gap-2 text-sm font-folklore font-bold text-slate-600 hover:text-black transition-colors"
                >
                    ← Continue Shopping
                </button>

                <h2 className="font-folklore text-2xl font-bold mb-6 text-slate-800">
                    Your Shopping Cart
                </h2>

                {cartItems.length === 0 ? (
                    <div className="text-center py-16 bg-white border border-slate-200 rounded-sm shadow-sm p-8">
                        <p className="font-folklore text-lg text-slate-500 mb-6">Your Cart is Empty</p>
                        <button
                            onClick={() => setCurrentView('pembeli')}
                            className="bg-[#1a1a1a] hover:bg-black text-white font-folklore font-semibold px-6 py-3 rounded-sm transition-all"
                        >
                            Shop Now
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                        <div className="lg:col-span-2 space-y-4">
                            {cartItems.map((item) => (
                                <div
                                    key={item.Keranjang_ID}
                                    className="bg-white p-4 rounded-sm border border-slate-200 shadow-sm flex gap-4 items-center"
                                >
                                    <img src={item.Gambar ? item.Gambar.split(',')[0].trim() : 'https://via.placeholder.com/100'} alt={item.Namaproduk} className="w-20 h-20 object-cover bg-slate-100 rounded-sm border border-slate-200" />
                                    <div className="flex-1">
                                        <h3 className="text-sm font-folklore font-bold text-slate-900">
                                            {item.Namaproduk}
                                        </h3>
                                        <div className="flex items-center gap-3 mt-2">
                                            <span className="text-xs text-slate-500 font-folklore">Qty:</span>
                                            <div className="flex items-center border border-slate-300 rounded-sm bg-slate-50">
                                                {/* Tombol Kurang (-) */}
                                                <button
                                                    onClick={() => handleUpdateQuantity(item.Keranjang_ID, item.Jumlah, 'kurang')}
                                                    className="px-2 py-0.5 text-slate-600 hover:bg-slate-200 transition-colors font-bold text-xs"
                                                >
                                                    -
                                                </button>

                                                {/* Angka Jumlah */}
                                                <span className="px-3 text-xs font-bold text-slate-800 font-folklore">
                                                    {item.Jumlah}
                                                </span>

                                                {/* Tombol Tambah (+) */}
                                                <button
                                                    onClick={() => handleUpdateQuantity(item.Keranjang_ID, item.Jumlah, 'tambah')}
                                                    className="px-2 py-0.5 text-slate-600 hover:bg-slate-200 transition-colors font-bold text-xs"
                                                >
                                                    +
                                                </button>
                                            </div>
                                        </div>
                                        <p className="text-sm font-folklore font-bold text-slate-800 mt-2">
                                            Rp {(Number(item.Harga) * item.Jumlah).toLocaleString('id-ID')}
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => handleDeleteItem(item.Keranjang_ID)}
                                        className="p-2 text-slate-400 hover:text-red-600 transition-colors"
                                        title="Remove Item"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.34 6m-4.74 0L9 9m4.34 6.54L15 9m4.34-3.3a46.53 46.53 0 0 0-5.6-.44m-5.9 0c-1.7 0-3-.93-3.04-2.34-.04-1.4.9-2.5 2.34-2.41a46.5 46.5 0 0 1 5.7.38m0 0a46.53 46.53 0 0 1 4.7 0m-4.7 0c0-1.63-.83-2.96-2.3-3.11a46.59 46.59 0 0 0-3.4 0c-1.47.15-2.3 1.48-2.3 3.11M19.5 8.25v10.5a2.25 2.25 0 0 1-2.25 2.25H6.75A2.25 2.25 0 0 1 4.5 18.5V8.25" />
                                        </svg>
                                    </button>
                                </div>
                            ))}
                        </div>
                        <div className="bg-white p-6 rounded-sm border border-slate-200 shadow-sm space-y-6">
                            <h3 className="text-lg font-bold text-slate-900 font-folklore border-b border-slate-100 pb-3">
                                Order Summary
                            </h3>

                            <div className="flex justify-between items-center text-sm">
                                <span className="text-slate-500 font-folklore">
                                    Total Items
                                </span>
                                <span className="font-bold text-slate-800">
                                    {cartItems.reduce((acc, item) => acc + item.Jumlah, 0)}
                                </span>
                            </div>

                            <div className="flex justify-between items-center border-t border-slate-100 pt-4">
                                <span className="text-base font-bold text-slate-900 font-folklore">Total Price</span>
                                <span className="text-lg font-bold text-slate-900 font-folklore">
                                    Rp {calculateTotal().toLocaleString('id-ID')}
                                </span>
                            </div>

                            <button onClick={handleCheckout}
                                className="w-full bg-[#1a1a1a] hover:bg-black text-white font-folklore font-semibold py-3 rounded-sm transition-all shadow-md mt-4">
                                Proceed to Checkout
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Cart;
