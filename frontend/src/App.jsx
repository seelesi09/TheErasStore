import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from './components/Navbar';
import Swal from 'sweetalert2';
import Login from './components/Login';
import Signup from './components/Signup';
import Edit from './components/Edit';
import Footer from './components/Footer';
import Detail from './components/Detail';
import DecryptedText from './components/Decrypt';
import Cart from './components/Cart';
import OrderHistory from './components/Orderhistory';
import AboutUs from './components/AboutUs';
import Archive from './components/Archive';
import Payment from './components/Payment';
import AdminOrders from './components/Adminorders';
import 'animate.css';
import Album from './components/Album';
import AddAlbumForm from './components/AddAlbumForm';
import { staticEras } from './data/staticEras';
import BgFolklore from './assets/picture/dashboard-folklore (1).jpg';

// Custom toast wrapper using SweetAlert2
const toast = {
  success: (message) => {
    Swal.fire({
      toast: true,
      showConfirmButton: false,
      timer: 1000,
      timerProgressBar: true,
      icon: 'success',
      title: message,
      position: 'center',
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
      position: 'center',
      customClass: {
        popup: 'folk-folklore',
        title: 'font-folkore',
      },
      showClass: { popup: 'animate__animated animate__zoomInDown' },
      hideClass: { popup: 'animate__animated animate__zoomOutDown' }
    });
  }
};

function App() {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('shopey_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('shopey_cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  useEffect(() => {
    localStorage.setItem('shopey_cart', JSON.stringify(cart));
  }, [cart]);

  const [authView, setAuthView] = useState(null);
  const [currentOrderId, setCurrentOrderId] = useState(null);
  const [currentTotalHarga, setCurrentTotalHarga] = useState(0);
  const [currentView, setCurrentView] = useState('pembeli');
  const [adminTab, setAdminTab] = useState('products');

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formAuth, setFormAuth] = useState({ username: '', password: '' });
  const [isDetailOpen, setisDetailOpen] = useState(false);
  const [selectedProductToDetail, setSelectedProductToDetail] = useState(null);
  const [editId, setEditId] = useState(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedProductToEdit, setSelectedProductToEdit] = useState(null);
  const inputFileRef = React.useRef(null);
  const [dbAlbums, setDbAlbums] = useState([]);
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, [currentView]);
  useEffect(() => {
    axios.get('https://theerasstore-production.up.railway.app/api/albums')
      .then((res) => setDbAlbums(res.data))
      .catch((err) => console.error('Gagal mengambil album:', err));
  }, []);

  const allEraOptions = [
    ...staticEras.map((e) => e.name),
    ...dbAlbums.map((a) => a.name),
  ];

  const [formProduct, setFormProduct] = useState({
    Kodeproduk: '',
    Namaproduk: '',
    Kategori: '',
    Harga: '',
    Stok: '',
    Deskripsi: ''
  });
  const [selectedFiles, setSelectedFiles] = useState([]);

  const fetchProducts = async () => {
    setLoading(true);
    axios.get('https://theerasstore-production.up.railway.app/api/produk')
      .then((res) => {
        setProducts(res.data);
        setLoading(false);
      })
      .catch((err) => {
        toast.error("Gagal mengambil produk:", err);
        setLoading(false);
      });
  };

  useEffect(() => {
    const fetchOriginalProducts = async () => {
      try {
        const response = await axios.get('https://theerasstore-production.up.railway.app/api/produk');
        setProducts(response.data);
      } catch (error) {
        console.error("Gagal memuat katalog produk:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOriginalProducts();
  }, []);

  useEffect(() => {
    if (currentView === 'cart' && user?.Role === 'admin') {
      toast.error('Admins doesn\'t have access to this page.');
    };
  }, [currentView, user])

  const handleLogin = (e) => {
    e.preventDefault();
    axios.post('https://theerasstore-production.up.railway.app/api/login', { username: formAuth.username, password: formAuth.password })
      .then((res) => {
        alert(res.data.message || 'Login Berhasil!');
        localStorage.setItem('shopey_user', JSON.stringify(res.data.user));
        setUser(res.data.user);
        setFormAuth({ username: '', password: '' });
      })
      .catch((err) => alert(err.response?.data?.message || 'Username atau Password Salah'));
  };

  const handleLogout = () => {
    localStorage.removeItem('shopey_user');
    setUser(null);
    setCurrentView('pembeli');
    toast.success('Berhasil Logout!');
  };

  const handleSaveProduct = (e, payload = null) => {
    if (e && typeof e.preventDefault === 'function') {
      e.preventDefault();
    }

    const formData = new FormData();

    if (editId) {
      formData.append('Kodeproduk', payload.Kodeproduk || '');
      formData.append('Namaproduk', payload.Namaproduk || '');
      formData.append('Kategori', payload.Kategori || '');
      formData.append('Harga', payload.Harga || 0);
      formData.append('Stok', payload.Stok || 0);
      formData.append('Deskripsi', payload.Deskripsi || '');

      if (payload.fileBaru && payload.fileBaru.length > 0) {
        payload.fileBaru.forEach((file) => {
          formData.append('image', file);
        });
      } else {
        formData.append('Gambar', payload.Gambar || '');
      }

      const config = { headers: { 'Content-Type': 'multipart/form-data' } };

      axios.put(`https://theerasstore-production.up.railway.app/api/produk/${editId}`, formData, config)
        .then(() => {
          toast.success('Produk berhasil diupdate!');
          resetFormProduct();
          setIsEditOpen(false);
          fetchProducts();
        })
        .catch((err) => toast.error('Gagal update produk: ' + (err.response?.data?.error || err.message)));

    } else {
      formData.append('Kodeproduk', formProduct.Kodeproduk || '');
      formData.append('Namaproduk', formProduct.Namaproduk || '');
      formData.append('Kategori', formProduct.Kategori || '');
      formData.append('Harga', formProduct.Harga || 0);
      formData.append('Stok', formProduct.Stok || 0);
      formData.append('Deskripsi', formProduct.Deskripsi || '');

      if (selectedFiles && selectedFiles.length > 0) {
        selectedFiles.forEach((file) => {
          formData.append('image', file);
        });
      }

      const config = { headers: { 'Content-Type': 'multipart/form-data' } };

      axios.post('https://theerasstore-production.up.railway.app/api/produk', formData, config)
        .then(() => {
          toast.success('Produk berhasil ditambahkan!');
          resetFormProduct();
          setSelectedFiles([]);
          fetchProducts();
          if (inputFileRef.current) inputFileRef.current.value = '';
        })
        .catch((err) => toast.error('Gagal tambah produk: ' + (err.response?.data?.error || err.message)));
    }
  };

  const handleEditClick = (product) => {
    setEditId(product.ID);
    setIsEditOpen(true);
    setSelectedProductToEdit(product);

    setFormProduct({
      Kodeproduk: product.Kodeproduk,
      Namaproduk: product.Namaproduk,
      Kategori: product.Kategori,
      Harga: product.Harga,
      Stok: product.Stok,
      Deskripsi: product.Deskripsi
    });
  };

  const resetFormProduct = () => {
    setEditId(null);
    setFormProduct({ Kodeproduk: '', Namaproduk: '', Kategori: '', Harga: '', Stok: '', Deskripsi: '', Gambar: '' });
    setSelectedFiles([]);
  };

  const handleDeleteProduct = (id) => {
    Swal.fire({
      title: 'Hapus Produk?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Hapus',
      cancelButtonText: 'Batal'
    }).then((result) => {
      if (result.isConfirmed) {
        axios.delete(`https://theerasstore-production.up.railway.app/api/produk/${id}`)
          .then(() => {
            toast.success('Produk berhasil dihapus!');
            if (editId === id) resetFormProduct();
            fetchProducts();
          })
          .catch((err) => toast.error('Gagal hapus produk: ' + (err.response?.data?.error || err.message)));
      }
    });
  };

  const handleLoginSuccess = (userData) => {
    setUser(userData);
    localStorage.setItem('shopey_user', JSON.stringify(userData));
    setAuthView(null);

    if (userData?.Role === 'admin') {
      setCurrentView('admin');
    } else {
      setCurrentView('pembeli');
    }
  };

  const handleRealAddToCart = async (productID) => {
    if (!user) {
      toast.error('You Must`ve Login First.');
      setAuthView('login');
      return;
    }
    if (user.Role === 'admin'){
      toast.error('Admin(s) are restricted to checkout product(s)')
      return;
    }
    try {
      const response = await axios.post('https://theerasstore-production.up.railway.app/api/keranjang', {
        User_ID: user.ID,
        Produk_ID: productID
      });

      toast.success(response.data.message || "The Product Successfully Added to Your Cart");
    } catch (error) {
      console.error('Error Add to Cart:', error);
      toast.error(error.response?.data?.error || "Sorry There Are No Stock Left For This Product ");
    }
  };

  const handleGoToPayment = (orderId, totalHarga) => {
    setCurrentOrderId(orderId);
    setCurrentTotalHarga(totalHarga);
    setCurrentView('payment');
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans antialiased text-slate-800">

      <Navbar
        user={user}
        currentView={currentView}
        setCurrentView={setCurrentView}
        setAdminTab={setAdminTab}
        handleLogout={handleLogout}
        onOpenLogin={() => setAuthView('login')}
      />

      {authView === 'login' && (
        <Login
          onLoginSuccess={handleLoginSuccess}
          onSwitchToSignup={() => setAuthView('signup')}
          onClose={() => setAuthView(null)}
        />
      )}

      {authView === 'signup' && (
        <Signup
          onSwitchToLogin={() => setAuthView('login')}
          onClose={() => setAuthView(null)}
        />
      )}

      {/* ========== PEMBELI VIEW ========== */}
      {currentView === 'pembeli' && authView === null && (
        <>
          {/* Hero Section - Fully Responsive */}
          <section className="relative w-full min-h-[400px] sm:min-h-[450px] md:min-h-[550px] lg:min-h-[600px] xl:min-h-[700px] flex items-center bg-black py-12 sm:py-16 md:py-20 lg:py-24 px-4 sm:px-6 md:px-8 lg:px-12 overflow-hidden">
            <img
              src={BgFolklore}
              alt="The Eras Visual"
              className="absolute inset-0 w-full h-full object-cover opacity-40 sm:opacity-50 object-center pointer-events-none"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent pointer-events-none" />

            <div className="relative w-full max-w-[1600px] mx-auto z-10 text-left px-2 sm:px-4 space-y-4 sm:space-y-6 md:space-y-8">
              <h1 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl xl:text-7xl font-folklore text-white/80 leading-tight">
                <DecryptedText
                  text='Find Your Best'
                  idleDelay={1000}
                />
                <span className="text-white block mt-2 sm:mt-3 md:mt-4 drop-shadow-lg">Era's</span>
              </h1>
              <p className="text-xs sm:text-sm md:text-base lg:text-lg max-w-xs sm:max-w-sm md:max-w-md lg:max-w-xl text-slate-200 leading-relaxed font-folklore">
                Hi <strong className="text-white">{user?.Username || "User"}</strong>!
                Welcome to The Eras Store, we hope you can find your Era's!
              </p>
            </div>
          </section>

          <AboutUs id='about' />

          {/* Catalogue Section - Responsive Grid */}
          <section className="py-8 sm:py-10 md:py-14 lg:py-16 xl:py-20 px-4 sm:px-6 md:px-8 lg:px-12 bg-gradient-to-b from-slate-50 to-slate-100" id='catalogue'>
            <div className="w-full max-w-[1600px] mx-auto">
              <div className="mb-6 sm:mb-8 md:mb-10 lg:mb-12">
                <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold text-slate-800 tracking-tight font-folklore">
                  Product Catalogue
                </h2>
              </div>

              {loading ? (
                <div className="flex justify-center items-center py-16 sm:py-20 md:py-24">
                  <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 sm:h-10 sm:w-10 border-b-2 border-slate-400 mb-3 sm:mb-4"></div>
                    <p className="text-slate-500 font-medium text-sm sm:text-base">Memuat produk...</p>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8 lg:gap-10">
                  {products.map((product, index) => {
                    const isEven = index % 2 === 0;
                    const tiltClass = isEven ? '-rotate-3' : 'rotate-3';

                    return (
                      <div
                        key={product.ID}
                        className="flex flex-col h-full cursor-pointer group"
                        onClick={() => {
                          setSelectedProductToDetail(product);
                          setisDetailOpen(true);
                        }}
                      >
                        <div
                          className={`relative bg-white rounded-sm p-2 sm:p-3 md:p-4 pb-4 sm:pb-6 md:pb-8 flex flex-col transition-all duration-300 ${tiltClass} group-hover:rotate-0 group-hover:shadow-2xl border border-slate-300 shadow-md h-full`}
                          style={{ perspective: '1000px' }}
                        >
                          <div className="w-full aspect-square overflow-hidden bg-slate-100 mb-3 sm:mb-4 md:mb-6 rounded-sm">
                            <ProductImageSlider
                              gambarString={product.Gambar}
                              namaProduk={product.Namaproduk}
                            />
                          </div>
                        {user?.Role !== 'admin' && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRealAddToCart(product.ID);
                            }}
                            className="w-full bg-[#545454] hover:bg-[#838383] active:bg-[#3a3a3a] text-white font-folklore font-semibold py-2 sm:py-2.5 md:py-3 rounded-sm transition-all text-xs sm:text-sm active:scale-95"
                          >
                            Add To Cart
                          </button>
                        )}
                        </div>

                        <div className="mt-3 sm:mt-4 md:mt-6 px-1">
                          <span className="text-xs sm:text-sm font-folklore font-bold tracking-widest text-slate-600 line-clamp-1">
                            {product.Kategori}
                          </span>
                          <h3 className="text-xs sm:text-sm font-folklore font-bold text-slate-900 mt-1 sm:mt-2 line-clamp-2">
                            {product.Namaproduk}
                          </h3>
                          <div className="flex items-center justify-between mt-2 sm:mt-3 gap-1 sm:gap-2">
                            <p className="text-sm sm:text-base md:text-lg font-folklore font-bold text-slate-800">
                              Rp {Number(product.Harga).toLocaleString('id-ID')}
                            </p>
                            <span className="text-xs text-slate-600 font-folklore flex-shrink-0">
                              Stock: {product.Stok}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </section>
        </>
      )}

      {/* ========== CART VIEW ========== */}
      {currentView === 'cart' && (
        user?.Role === 'admin' (
        <Cart
          user={user}
          setCurrentView={setCurrentView}
          onCheckoutSuccess={handleGoToPayment}
        />
        )
      )}

      {/* ========== PAYMENT VIEW ========== */}
      {currentView === 'payment' && (
        <Payment
          Order_ID={currentOrderId}
          Total_Harga={currentTotalHarga}
          setCurrentView={setCurrentView}
        />
      )}

      {/* ========== ARCHIVE VIEW ========== */}
      {currentView === 'archive' && authView === null && (
        <Archive
          products={products}
          handleRealAddToCart={handleRealAddToCart}
          setCurrentView={setCurrentView}
        />
      )}

      {/* ========== ALBUM VIEW (BARU) ==========
          Ditaruh sejajar dengan view lain (cart, archive, history, dst),
          BUKAN di dalam blok admin. currentView cuma bisa satu nilai
          dalam satu waktu, jadi nge-nest 'album' di dalam blok 'admin'
          bikin kondisinya mustahil terpenuhi. */}
      {currentView === 'album' && (
        <Album />
      )}

      {/* ========== HISTORY VIEW ========== */}
      {currentView === 'history' && (
        <OrderHistory
          user={user}
          setCurrentView={setCurrentView}
          setOrderInput={(orderData) => {
            setCurrentOrderId(orderData.id);
            setCurrentTotalHarga(orderData.total);
          }}
        />
      )}

      {/* ========== ADMIN PANEL ========== */}
      {currentView === 'admin' && (
        <section className="w-full max-w-7xl mx-auto py-8 md:py-10 px-6 md:px-10 bg-white min-h-screen font-folklore">

          <h2 className="text-2xl font-bold text-slate-800 mb-2">
            Admin Dashboard
          </h2>
          <p className="text-sm text-slate-500 mb-8">
            Kelola produk, album, dan pantau pembayaran customer.
          </p>

          {/* Admin Tabs */}
          <div className="flex border-b border-slate-200 text-sm gap-6 mb-8 overflow-x-auto">
            <button
              onClick={() => setAdminTab('products')}
              className={`pb-3 font-bold tracking-wide transition-all whitespace-nowrap flex-shrink-0 ${adminTab === 'products'
                ? 'text-slate-800 border-b-2 border-slate-800'
                : 'text-slate-400 hover:text-slate-600'
                }`}
            >
              Manage Products
            </button>
            <button
              onClick={() => setAdminTab('payments')}
              className={`pb-3 font-bold tracking-wide transition-all whitespace-nowrap flex-shrink-0 ${adminTab === 'payments'
                ? 'text-slate-800 border-b-2 border-slate-800'
                : 'text-slate-400 hover:text-slate-600'
                }`}
            >
              Customer Payments
            </button>
            <button
              onClick={() => setAdminTab('albums')}
              className={`pb-3 font-bold tracking-wide transition-all whitespace-nowrap flex-shrink-0 ${adminTab === 'albums'
                ? 'text-slate-800 border-b-2 border-slate-800'
                : 'text-slate-400 hover:text-slate-600'
                }`}
            >
              Manage Albums
            </button>
          </div>

          {/* Products Tab */}
          {adminTab === 'products' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 items-start w-full">

              {/* Add Product Form */}
              <div className="bg-white p-6 rounded-sm border border-slate-200 shadow-sm space-y-4">
                <h3 className="text-lg font-bold text-slate-800">Add New Product</h3>
                <form onSubmit={handleSaveProduct} className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Product Code</label>
                    <input
                      type="text"
                      placeholder="P001"
                      value={formProduct.Kodeproduk}
                      onChange={(e) => setFormProduct({ ...formProduct, Kodeproduk: e.target.value })}
                      className="w-full p-2.5 mt-1 text-sm bg-white border border-slate-200 text-slate-700 rounded-sm focus:outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-400 placeholder-slate-400 transition-colors"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Name of the Product</label>
                    <input
                      type="text"
                      placeholder="TTPD Vinyl"
                      value={formProduct.Namaproduk}
                      onChange={(e) => setFormProduct({ ...formProduct, Namaproduk: e.target.value })}
                      className="w-full p-2.5 mt-1 text-sm bg-white border border-slate-200 text-slate-700 rounded-sm focus:outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-400 placeholder-slate-400 transition-colors"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Category (Era/Album)</label>
                    <select
                      value={formProduct.Kategori}
                      onChange={(e) => setFormProduct({ ...formProduct, Kategori: e.target.value })}
                      className="w-full p-2.5 mt-1 text-sm bg-white border border-slate-200 text-slate-700 rounded-sm focus:outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-400 transition-colors"
                      required
                    >
                      <option value="" disabled>Pilih Era / Album</option>
                      {allEraOptions.map((eraName, idx) => (
                        <option key={idx} value={eraName}>{eraName}</option>
                      ))}
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Price</label>
                      <input
                        type="number"
                        placeholder="150000"
                        value={formProduct.Harga}
                        onChange={(e) => setFormProduct({ ...formProduct, Harga: e.target.value })}
                        className="w-full p-2.5 mt-1 text-sm bg-white border border-slate-200 text-slate-700 rounded-sm focus:outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-400 placeholder-slate-400 transition-colors"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Stock</label>
                      <input
                        type="number"
                        placeholder="10"
                        value={formProduct.Stok}
                        onChange={(e) => setFormProduct({ ...formProduct, Stok: e.target.value })}
                        className="w-full p-2.5 mt-1 text-sm bg-white border border-slate-200 text-slate-700 rounded-sm focus:outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-400 placeholder-slate-400 transition-colors"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Description</label>
                    <textarea
                      placeholder="It's a good thing, to buy, etc"
                      value={formProduct.Deskripsi}
                      onChange={(e) => setFormProduct({ ...formProduct, Deskripsi: e.target.value })}
                      className="w-full p-2.5 mt-1 text-sm bg-white border border-slate-200 text-slate-700 rounded-sm focus:outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-400 placeholder-slate-400 min-h-[100px] resize-y transition-colors"
                      required
                    />
                  </div>

                  {/* Upload Picture - dengan preview, style konsisten AdminOrders */}
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Upload Picture</label>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      ref={inputFileRef}
                      onChange={(e) => setSelectedFiles(Array.from(e.target.files))}
                      className="w-full text-sm mt-1 file:mr-4 file:py-2 file:px-4 file:rounded-sm file:border-0 file:text-xs file:font-bold file:uppercase file:tracking-wider file:bg-slate-800 file:text-white hover:file:bg-black file:transition-colors file:cursor-pointer text-slate-500"
                    />

                    {selectedFiles.length > 0 ? (
                      <div className="mt-3 bg-slate-50 p-2 border border-slate-200 rounded-sm grid grid-cols-3 gap-2">
                        {selectedFiles.map((file, idx) => (
                          <div
                            key={idx}
                            className="relative aspect-square bg-white rounded-sm overflow-hidden border border-slate-200 group"
                          >
                            <img
                              src={URL.createObjectURL(file)}
                              alt={`preview-${idx}`}
                              className="w-full h-full object-cover"
                            />
                            <button
                              type="button"
                              onClick={() => setSelectedFiles((prev) => prev.filter((_, i) => i !== idx))}
                              className="absolute top-1 right-1 w-5 h-5 flex items-center justify-center bg-black/60 hover:bg-black/90 text-white text-xs rounded-full transition-colors opacity-0 group-hover:opacity-100"
                              aria-label="Remove image"
                            >
                              ✕
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-slate-400 italic mt-1.5">
                        Belum ada gambar dipilih. Bisa pilih lebih dari 1 file sekaligus.
                      </p>
                    )}
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 text-white font-semibold text-sm rounded-sm transition-all mt-2 bg-slate-800 hover:bg-black active:scale-95 shadow-sm"
                  >
                    Save to Database
                  </button>
                </form>
              </div>

              {/* Product List */}
              <div className="lg:col-span-2 bg-white rounded-sm border border-slate-200 shadow-sm overflow-hidden">
                <h3 className="text-lg font-bold text-slate-800 p-6 pb-0">Product List</h3>
                <div className="overflow-x-auto p-6">
                  <table className="w-full text-left border-collapse text-sm min-w-[500px]">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider">
                        <th className="p-4">Picture</th>
                        <th className="p-4">Name</th>
                        <th className="p-4">Price</th>
                        <th className="p-4">Stock</th>
                        <th className="p-4 text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {products.map((p) => (
                        <tr key={p.ID}>
                          <td className="py-4 px-4">
                            <img
                              src={p.Gambar ? p.Gambar.split(',')[0] : 'https://via.placeholder.com/50'}
                              alt={p.Namaproduk}
                              className="w-10 h-10 object-contain bg-slate-50 border border-slate-200 rounded-sm"
                            />
                          </td>
                          <td className="py-4 px-4 font-medium text-slate-700 line-clamp-2">{p.Namaproduk}</td>
                          <td className="py-4 px-4 font-bold text-slate-800 whitespace-nowrap">Rp {Number(p.Harga).toLocaleString('id-ID')}</td>
                          <td className="py-4 px-4 text-slate-600 font-medium">{p.Stok}</td>
                          <td className="py-4 px-4">
                            <div className="flex items-center justify-center gap-2 flex-wrap">
                              <button
                                onClick={() => handleEditClick(p)}
                                className="px-3 py-1 text-xs font-bold text-indigo-600 hover:underline transition-colors"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleDeleteProduct(p.ID)}
                                className="px-3 py-1 text-xs font-bold text-red-500 hover:underline transition-colors"
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Payments Tab */}
          {adminTab === 'payments' && (
            <div className="w-full -mx-6 md:-mx-10">
              <AdminOrders />
            </div>
          )}

          {/* Albums Tab */}
          {adminTab === 'albums' && (
            <div className="w-full">
              <AddAlbumForm onSuccess={() => toast.success('Album baru berhasil ditambahkan!')} />
            </div>
          )}

        </section>
      )}

      <Footer />

      {/* Modals */}
      <Edit
        isOpen={isEditOpen}
        onClose={() => {
          setIsEditOpen(false);
          resetFormProduct();
        }}
        productData={selectedProductToEdit}
        onSave={handleSaveProduct}
      />

      <Detail
        isOpen={isDetailOpen}
        onClose={() => {
          setisDetailOpen(false);
          setSelectedProductToDetail(null);
        }}
        productData={selectedProductToDetail}
        onBuyNow={(products) => {
          handleRealAddToCart(products.ID);
        }}
      />
    </div>
  );
}

function ProductImageSlider({ gambarString, namaProduk }) {
  const images = gambarString ? gambarString.split(',').map(img => img.trim()) : [];
  const [currentIndex, setCurrentIndex] = React.useState(0);

  if (images.length === 0) {
    return (
      <div className='w-full h-full bg-slate-100 flex items-center justify-center p-4 sm:p-6 rounded-sm'>
        <span className='text-xs sm:text-sm text-slate-400 font-medium font-folklore'>No Image</span>
      </div>
    );
  }

  const nextSlide = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  return (
    <div className='relative w-full h-full group overflow-hidden bg-[#abaaaa] rounded-sm'>
      <img
        src={images[currentIndex]}
        alt={`${namaProduk} - ${currentIndex + 1}`}
        className='w-full h-full object-cover object-top transition-transform duration-500 ease-in-out group-hover:scale-105'
      />

      {images.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className='absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center bg-black/40 hover:bg-black/70 backdrop-blur-sm text-white rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-all duration-300 z-10 border border-white/10 active:scale-90'
            aria-label="Previous image"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-3 h-3 sm:w-4 sm:h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </button>

          <button
            onClick={nextSlide}
            className='absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center bg-black/40 hover:bg-black/70 backdrop-blur-sm text-white rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-all duration-300 z-10 border border-white/10 active:scale-90'
            aria-label="Next image"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-3 h-3 sm:w-4 sm:h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </button>

          <div className='absolute bottom-2 sm:bottom-3 left-1/2 -translate-x-1/2 flex gap-1 sm:gap-1.5 z-10 bg-black/20 px-2 py-1 rounded-full backdrop-blur-[2px]'>
            {images.map((_, index) => (
              <span
                key={index}
                className={`w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full transition-all duration-300 ${index === currentIndex ? 'bg-white w-2 sm:w-3' : 'bg-white/40'}`}
              ></span>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default App;
