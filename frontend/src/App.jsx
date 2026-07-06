import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from './components/Navbar';
import Swal from 'sweetalert2';
import Login from './components/Login';
import Signup from './components/Signup';
import Buttons from './components/Button';
import Edit from './components/Edit';
import Footer from './components/Footer';
import Detail from './components/Detail';
import DecryptedText from './components/Decrypt';
import BgFolklore from './assets/picture/dashboard-folklore (1).jpg';

// Custom toast wrapper using SweetAlert2
const toast = {
  success: (message) => {
    Swal.fire({
      toast: true,
      // position: 'top-end',
      showConfirmButton: false,
      timer: 1000,
      timerProgressBar: true,
      icon: 'success',
      title: message
    });
  },
  error: (message) => {
    Swal.fire({
      toast: true,
      // position: 'top-end',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      icon: 'error',
      title: message
    });
  }
};

function App() {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('shopey_user');
    return savedUser ? JSON.parse(savedUser) : null;
  })

  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('shopey_cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  useEffect(() => {
    localStorage.setItem('shopey_cart', JSON.stringify(cart));
  }, [cart]);

  const [authView, setAuthView] = useState(null);

  // const [isRegister, setIsRegister] = useState(false);
  const [currentView, setCurrentView] = useState('pembeli');

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formAuth, setFormAuth] = useState({ username: '', password: '' });
  const [isDetailOpen, setisDetailOpen] = useState(false);
  const [selectedProductToDetail, setSelectedProductToDetail] = useState(null);
  const [editId, setEditId] = useState(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedProductToEdit, setSelectedProductToEdit] = useState(null);
  const [formProduct, setFormProduct] = useState({
    Kodeproduk: '',
    Namaproduk: '',
    Kategori: '',
    Harga: '',
    Stok: '',
    Deskripsi: ''
  });
  const [selectedFiles, setSelectedFiles] = useState([]);

  // 1. GET ALL PRODUK
  const fetchProducts = async () => {
    setLoading(true);
    axios.get('http://localhost:5000/api/produk')
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
    const fetchProduk = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/produk');
        setProducts(response.data);
      } catch (error) {
        console.error("Gagal memuat katalog produk:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduk();
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    axios.post('http://localhost:5000/api/login', { username: formAuth.username, password: formAuth.password })
      .then((res) => {
        alert(res.data.message || 'Login Berhasil!');
        localStorage.setItem('shopey_user', JSON.stringify(res.data.user));
        setUser(res.data.user);
        setFormAuth({ username: '', password: '' });
      })
      .catch((err) => alert(err.response?.data?.message || 'Username atau Password Salah'));
  };

  const handleLogout = () => {
    localStorage.removeItem('shopey_user')
    setUser(null);
    setCurrentView('pembeli');
    toast.success('Berhasil Logout!');
  };

  // 3. LOGIKA SAVE 
  const handleSaveProduct = (e, dataEdit = null) => {
    let dataSource = formProduct;

    if (e && (e.Kodeproduk || e.kodeproduk || e.Namaproduk || e.namaproduk)) {
      dataSource = e;
      dataSource = dataEdit;
    } else if (e && typeof e.preventDefault === 'function') {
      e.preventDefault();
    }

    const formData = new FormData();

    formData.append('Kodeproduk', dataSource.Kodeproduk || dataSource.kodeproduk || '');
    formData.append('Namaproduk', dataSource.Namaproduk || dataSource.namaproduk || '');
    formData.append('Kategori', dataSource.Kategori || dataSource.kategori || '');
    formData.append('Harga', dataSource.Harga || dataSource.harga || 0);
    formData.append('Stok', dataSource.Stok || dataSource.stok || 0);
    formData.append('Deskripsi', dataSource.Deskripsi || dataSource.deskripsi || '');

    if (selectedFiles && selectedFiles.length > 0) {
      selectedFiles.forEach((file) => {
        formData.append('image', file);
      });
    } else {
      formData.append('Gambar', dataSource.Gambar || dataSource.gambar || '');
    }

    const config = {
      headers: { 'Content-Type': 'multipart/form-data' },
    };

    if (editId) {
      axios.put(`http://localhost:5000/api/produk/${editId}`, formData, config)
        .then(() => {
          toast.success('Produk berhasil diupdate!');
          resetFormProduct();
          setIsEditOpen(false);
          setSelectedFiles([]);
          fetchProducts();
        })
        .catch((err) => toast.error('Gagal update produk: ' + (err.response?.data?.error || err.message)));
    } else {
      axios.post('http://localhost:5000/api/produk', formData, config)
        .then(() => {
          toast.success('Produk berhasil ditambahkan!');
          resetFormProduct();
          setSelectedFiles([]);
          fetchProducts();
        })
        .catch((err) => toast.error('Gagal tambah produk: ' + (err.response?.data?.error || err.message)));
    }
  };

  const handleEditClick = (product) => {
    setEditId(product.ID); // Kunci ID produk yang mau diedit

    setIsEditOpen(true)
    setSelectedProductToEdit(product)

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
    setFormProduct({ Kodeproduk: '', Namaproduk: '', Kategori: '', Harga: '', Stok: '', Deskripsi: '' });
    setSelectedFiles([]);
  };

  // 5. LOGIKA HAPUS PRODUK
  const handleDeleteProduct = (id) => {
    if (window.confirm('Yakin ingin menghapus produk ini?')) {
      axios.delete(`http://localhost:5000/api/produk/${id}`)
        .then(() => {
          toast.success('Produk berhasil dihapus!');
          if (editId === id) resetFormProduct();
          fetchProducts();
        })
        .catch((err) => toast.error('Gagal hapus produk: ' + (err.response?.data?.error || err.message)));
    }
  };

  const handleLoginSuccess = (userData) => {
    setUser(userData);
    localStorage.setItem('shopey_user', JSON.stringify(userData));
    setAuthView(null)

    if (userData?.Role === 'admin' || userData?.Role === 'admin') {
      setCurrentView('admin');
    } else {
      setCurrentView('pembeli');
    }
  }

  const handleAddToCollection = async (productID) => {
    try {
      const body = {
        productId: productID,
      };

      const response = await fetch('http://localhost:5000/api/produk/decrease-stock', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body),
      });


      if (response.ok) {
        const data = await response.json();
        toast.success(`Added to Collection!\n `);
        fetchProducts();
      } else {
        const error = await response.json();
        alert(`Error: ${error.message}`)
      }
    } catch (error) {
      console.error('Error: ', error);
      alert('There had an Error');
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans antialiased text-slate-800">

      <Navbar
        user={user}
        currentView={currentView}
        setCurrentView={setCurrentView}
        handleLogout={handleLogout}
        onOpenLogin={() => setAuthView('login')}
      />

      {authView === 'login' && (
        <Login
          onLoginSuccess={handleLoginSuccess}
          onSwitchToSignup={() => setAuthView('signup')}
          onClose={() => setAuthView(null)} // Tombol close modal
        />
      )}

      {authView === 'signup' && (
        <Signup
          onSwitchToLogin={() => setAuthView('login')}
          onClose={() => setAuthView(null)} // Tombol close modal
        />
      )}

      {/* VIEW: KATALOG PEMBELI */}
      {currentView === 'pembeli' && (
        <>
          {/* HERO BANNER SECTION */}
          <section className="relative w-full min-h-[500px] md:min-h-[600px] flex items-center bg-black py-20 px-4 md:px-8 overflow-hidden">
            <img
              src={BgFolklore}
              alt="The Eras Visual"
              className="absolute inset-0 w-full h-full object-cover opacity-50 object-center pointer-events-none"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent pointer-events-none" />
            <div className="relative w-full max-w-[1600px] mx-auto z-10 text-left pl-8 md:pl-16 lg:pl-24 space-y-6">
              <h1 className="text-4xl md:text-5xl lg:text-7xl font-folklore text-white/80 leading-tight">
                <DecryptedText
                text='Find Your Best'
                idleDelay={1000}
                /> <br />
                <span className="text-white block mt-2 drop-shadow-lg">Era's</span>
              </h1>
              <p className="text-sm md:text-base max-w-xl text-slate-200 leading-relaxed font-folklore bg-gray">
                Hi <strong className="text-white">{user?.username || "User"}</strong>!
                Welcome to The Eras Store, we hope you can find your Era's!
              </p>
            </div>
          </section>

          {/* GRID PRODUK */}
          <section className="py-16 px-6 md:px-12 lg:px-24 bg-gradient-to-b from-slate-50 to-slate-100" id='catalogue'>
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-slate-800 tracking-tight sm:text-3xl font-folklore">
                Product Catalogue
              </h2>
            </div>
            {loading ? (
              <div className="text-center text-slate-500 font-medium py-12">
                Memuat produk...
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                {products.map((product, index) => {
                  const isEven = index % 2 === 0;
                  const tiltClass = isEven ? '-rotate-3' : 'rotate-3';

                  return (
                    <div key={product.ID} className="flex flex-col" onClick={() => {
                      setSelectedProductToDetail(product);
                      setisDetailOpen(true)
                    }}>
                      {/* Card dengan foto dan button */}
                      <div
                        className={`group relative bg-white rounded-sm p-3 pb-8 flex flex-col transition-all duration-300 ${tiltClass} hover:rotate-0 hover:shadow-2xl cursor-pointer border border-slate-300 shadow-md`}
                        style={{
                          perspective: '1000px',
                        }}
                      >
                        {/* Foto Produk */}
                        <div className="w-full aspect-square overflow-hidden bg-slate-100 mb-6" style={{ borderRadius: '4px' }}>
                          <ProductImageSlider
                            gambarString={product.Gambar}
                            namaProduk={product.Namaproduk}
                          />
                        </div>

                        {/* Button */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAddToCollection(product.ID);
                          }}
                          className="w-full bg-[#545454] hover:bg-[#838383] text-white font-folklore font-semibold py-3 rounded-sm transition-all"
                        >
                          ADD TO COLLECTION
                        </button>
                      </div>

                      {/* Info Produk */}
                      <div className="mt-6 px-1">
                        <span className="text-[15px] font-folklore font-bold tracking-widest text-slate-600">
                          {product.Kategori}
                        </span>
                        <h3 className="text-sm font-folklore font-bold text-slate-900 mt-2">
                          {product.Namaproduk}
                        </h3>
                        <div className="flex items-center justify-between mt-3">
                          <p className="text-lg font-folklore font-bold text-slate-800">
                            Rp {Number(product.Harga).toLocaleString('id-ID')}
                          </p>
                          <span className="text-xs  text-slate-600 font-folklore">
                            Stock: {product.Stok}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        </>
      )}

      {/* VIEW: DASHBOARD ADMIN */}
      {currentView === 'admin' && (
        <section className="w-full max-w-[1600px] mx-auto py-10 px-4 md:px-8 bg-[#b2b2b2]/10 rounded-3xl">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start w-full">

            {/* FORM INPUT PRODUK (ADD ONLY) */}
            <div className="bg-[#838383] p-6 rounded-3xl border border-[#545454]/30 shadow-md space-y-4 w-full">
              <h3 className="text-lg font-bold text-[#000000] font-folklore">Add New Product</h3>
              <form onSubmit={handleSaveProduct} className="space-y-3">
                <div>
                  <label className="text-xs font-semibold text-[#1a1a1a]">Product Code</label>
                  <input
                    type="text"
                    placeholder="P001"
                    value={formProduct.Kodeproduk}
                    onChange={(e) => setFormProduct({ ...formProduct, Kodeproduk: e.target.value })}
                    className="w-full p-2.5 mt-1 text-sm bg-white border border-[#b2b2b2] text-[#1a1a1a] rounded-xl focus:outline-none focus:border-[#000000] placeholder-[#838383]"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-[#1a1a1a]">Name of the Product</label>
                  <input
                    type="text"
                    placeholder="TTPD Vinyl"
                    value={formProduct.Namaproduk}
                    onChange={(e) => setFormProduct({ ...formProduct, Namaproduk: e.target.value })}
                    className="w-full p-2.5 mt-1 text-sm bg-white border border-[#b2b2b2] text-[#1a1a1a] rounded-xl focus:outline-none focus:border-[#000000] placeholder-[#838383]"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-[#1a1a1a]">Category</label>
                  <input
                    type="text"
                    placeholder="Vinyl, CD, Outfit"
                    value={formProduct.Kategori}
                    onChange={(e) => setFormProduct({ ...formProduct, Kategori: e.target.value })}
                    className="w-full p-2.5 mt-1 text-sm bg-white border border-[#b2b2b2] text-[#1a1a1a] rounded-xl focus:outline-none focus:border-[#000000] placeholder-[#838383]"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-[#1a1a1a]">Price</label>
                    <input
                      type="number"
                      placeholder="150000"
                      value={formProduct.Harga}
                      onChange={(e) => setFormProduct({ ...formProduct, Harga: e.target.value })}
                      className="w-full p-2.5 mt-1 text-sm bg-white border border-[#b2b2b2] text-[#1a1a1a] rounded-xl focus:outline-none focus:border-[#000000] placeholder-[#838383]"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-[#1a1a1a]">Stock</label>
                    <input
                      type="number"
                      placeholder="10"
                      value={formProduct.Stok}
                      onChange={(e) => setFormProduct({ ...formProduct, Stok: e.target.value })}
                      className="w-full p-2.5 mt-1 text-sm bg-white border border-[#b2b2b2] text-[#1a1a1a] rounded-xl focus:outline-none focus:border-[#000000] placeholder-[#838383]"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-semibold text-[#1a1a1a]">Upload Picture</label>
                  <input
                    type="file"
                    multiple
                    onChange={(e) => setSelectedFiles(Array.from(e.target.files))}
                    className="w-full text-xs mt-1 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-[#1a1a1a] file:text-[#b2b2b2] hover:file:bg-[#000000] file:transition-colors text-[#1a1a1a]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 text-white font-semibold text-sm rounded-xl transition-colors mt-2 bg-[#1a1a1a] hover:bg-[#000000] shadow-md"
                >
                  Save to Database
                </button>
              </form>
            </div>

            {/* TABEL INVENTARIS PRODUK DENGAN TOMBOL EDIT & HAPUS */}
            <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-[#b2b2b2]/40 shadow-md w-full">
              <h3 className="text-lg font-bold text-[#1a1a1a] mb-4">Product List</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-[#545454]">
                  <thead className="bg-[#b2b2b2]/20 text-[#1a1a1a] text-xs uppercase font-bold">
                    <tr>
                      <th className="p-3">Picture</th>
                      <th className="p-3">Name</th>
                      <th className="p-3">Price</th>
                      <th className="p-3">Stock</th>
                      <th className="p-3 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#b2b2b2]/30">
                    {products.map((p) => (
                      <tr key={p.ID} className="hover:bg-[#b2b2b2]/10 transition-colors">
                        <td className="p-3">
                          <img
                            src={p.Gambar ? p.Gambar.split(',')[0] : 'https://via.placeholder.com/50'}
                            alt={p.Namaproduk}
                            className="w-10 h-10 object-contain bg-[#b2b2b2]/20 rounded-lg"
                          />
                        </td>
                        <td className="p-3 font-medium text-[#000000]">{p.Namaproduk}</td>
                        <td className="p-3 text-[#1a1a1a]">Rp {Number(p.Harga).toLocaleString('id-ID')}</td>
                        <td className="p-3 font-semibold text-[#1a1a1a]">{p.Stok}</td>
                        <td className="p-3 text-center flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleEditClick(p)}
                            className="px-3 py-1 text-xs font-bold text-white bg-[#545454] rounded-lg hover:bg-[#1a1a1a] transition-colors"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(p.ID)}
                            className="px-3 py-1 text-xs font-bold text-white bg-[#838383] rounded-lg hover:bg-[#545454] transition-colors"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        </section>
      )}
      <Footer />

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
          setisDetailOpen(false);
          toast.success(`Buyed ${products.Namaproduk}, Go ahead to payment`)
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
      <div className='w-full h-full bg-slate-100 flex items-center justify-center p-6 rounded-sm'>
        <span className='text-xs text-slate-400 font-medium font-folklore'>No Image</span>
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
    <div className='relative no-scrollbar w-full h-full group overflow-hidden bg-[#abaaaa] rounded-sm'>
      <img
        src={images[currentIndex]}
        alt={`${namaProduk} - ${currentIndex + 1}`}
        className='w-full h-full object-cover object-top transition-transform duration-500 ease-in-out group-hover:scale-105'
      />

      {images.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className='absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center bg-black/40 hover:bg-black/70 backdrop-blur-sm text-white rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-all duration-300 z-10 border border-white/10'
            aria-label="Previous image"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </button>

          <button
            onClick={nextSlide}
            className='absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center bg-black/40 hover:bg-black/70 backdrop-blur-sm text-white rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-all duration-300 z-10 border border-white/10'
            aria-label="Next image"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </button>

          {/* Indikator Titik (Dots) di Bawah */}
          <div className='absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10 bg-black/20 px-2 py-1 rounded-full backdrop-blur-[2px]'>
            {images.map((_, index) => (
              <span
                key={index}
                className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${index === currentIndex ? 'bg-white w-3' : 'bg-white/40'
                  }`}
              ></span>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default App;