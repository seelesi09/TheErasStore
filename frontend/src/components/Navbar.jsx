import React from "react";

function Navbar({ user, currentView, setCurrentView, handleLogout, onOpenLogin }) {
    const isAdmin = user?.Role === 'admin' ||
        user?.role === 'admin' ||
        user?.data?.role === 'admin' ||
        user?.data?.Role === 'admin' ||
        user?.user?.role === 'admin';

    return (
        <nav className="w-full bg-black text-white sticky top-0 z-50 px-6 md:px-16 py-4 flex items-center justify-between border-b border-white/5 font-folklore">
            <div onClick={() => setCurrentView('pembeli')}
                className="text-xl font-folklore tracking-tight cursor-pointer select-none">
                The Eras Store
            </div>

            <div className="hidden md:flex items-center gap-10 text-sm font-medium text-white/60">
                <button
                    onClick={() => setCurrentView('pembeli')}
                    className={`hover:text-white transition-colors cursor-pointer ${currentView === 'pembeli' ? 'text-white font-bold' : ''}`}>
                    Shop
                </button>

                <button
                    onClick={() => setCurrentView('cart')}
                    className={`hover:text-white transition-colors cursor-pointer ${currentView === 'cart' ? 'text-white font-bold' : ''}`}>
                    Cart
                </button>

                <button
                    onClick={() => setCurrentView('history')}
                    className={`hover:text-white transition-colors cursor-pointer ${currentView === 'history' ? 'text-white font-bold' : ''}`}>
                    History
                </button>

                {isAdmin && (
                    <button
                        onClick={() => setCurrentView('admin')}
                        className={`hover:text-white transition-colors cursor-pointer ${currentView === 'admin' ? 'text-white font-bold' : ''}`}
                    >
                        Admin Dashboard
                    </button>
                )}
                {user && (
                    <span className="text-xs bg-white/10 text-white/80 px-2.5 py-1 rounded-md tracking-wider font-semibold">
                        {user.Username || user.username || "User"}
                    </span>
                )}
            </div>

            {/* TOMBOL AKSI UTAMA (KANAN) */}
            <div>
                {user ? (
                    <button
                        onClick={handleLogout}
                        className="bg-white hover:bg-white/90 text-black text-xs md:text-sm font-bold px-5 py-2 rounded-full transition-all active:scale-95 cursor-pointer shadow-sm"
                    >
                        Logout
                    </button>
                ) : (
                    <button
                        onClick={onOpenLogin}
                        className="bg-white hover:bg-white/90 text-black text-xs md:text-sm font-bold px-5 py-2 rounded-full transition-all active:scale-95 cursor-pointer shadow-sm"
                    >
                        Login
                    </button>
                )}
            </div>
        </nav>
    );
}

export default Navbar;