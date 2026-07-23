import React, { useState } from "react";

function Navbar({ user, currentView, setCurrentView, handleLogout, onOpenLogin }) {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const isAdmin = user?.Role === 'admin' ||
        user?.role === 'admin' ||
        user?.data?.role === 'admin' ||
        user?.data?.Role === 'admin' ||
        user?.user?.role === 'admin';

    const navItems = [
        { label: 'Shop', view: 'pembeli' },
        { label: 'Archive', view: 'archive' },
        { label: 'Cart', view: 'cart' },
        { label: 'History', view: 'history' },
        ...(isAdmin ? [{ label: 'Admin Panel', view: 'admin' }] : [])
    ];

    const handleNavClick = (view) => {
        setCurrentView(view);
        setIsMobileMenuOpen(false);
    };

    const closeMobileMenu = () => setIsMobileMenuOpen(false);

    return (
        <>
            {/* Overlay untuk mobile menu */}
            {isMobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 md:hidden"
                    onClick={closeMobileMenu}
                />
            )}

            <nav className="w-full bg-black text-white sticky top-0 z-50 px-4 md:px-16 py-4 flex items-center justify-between border-b border-white/5 font-folklore">
                {/* Logo */}
                <div
                    onClick={() => handleNavClick('pembeli')}
                    className="text-lg md:text-xl font-folklore tracking-tight cursor-pointer select-none flex-shrink-0"
                >
                    The Eras Store
                </div>

                {/* Desktop Navigation - HANYA menu, tidak ada username di sini */}
                <div className="hidden md:flex items-center gap-10 text-sm font-medium text-white/60">
                    {navItems.map((item) => (
                        <button
                            key={item.view}
                            onClick={() => handleNavClick(item.view)}
                            className={`hover:text-white transition-colors cursor-pointer whitespace-nowrap ${
                                currentView === item.view ? 'text-white font-bold' : ''
                            }`}
                        >
                            {item.label}
                        </button>
                    ))}
                </div>

                {/* Area kanan: Username (non-clickable) + Logout/Login + Hamburger */}
                <div className="flex items-center gap-4">
                    {/* Nama akun - dipisah dari menu, tidak terlihat seperti tombol */}
                    {user && (
                        <div className="hidden md:flex items-center gap-2 text-xs text-white/50 border-r border-white/10 pr-4">
                            <span className="w-1.5 h-1.5 bg-green-400 rounded-full flex-shrink-0" />
                            <span className="font-medium whitespace-nowrap">
                                {user.Username || user.username || "User"}
                            </span>
                        </div>
                    )}

                    {user ? (
                        <button
                            onClick={handleLogout}
                            className="bg-white hover:bg-white/90 text-black text-xs md:text-sm font-bold px-4 md:px-5 py-2 rounded-full transition-all active:scale-95 cursor-pointer shadow-sm whitespace-nowrap flex-shrink-0"
                        >
                            Logout
                        </button>
                    ) : (
                        <button
                            onClick={onOpenLogin}
                            className="bg-white hover:bg-white/90 text-black text-xs md:text-sm font-bold px-4 md:px-5 py-2 rounded-full transition-all active:scale-95 cursor-pointer shadow-sm whitespace-nowrap flex-shrink-0"
                        >
                            Login
                        </button>
                    )}

                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="md:hidden flex flex-col gap-1.5 p-2 hover:bg-white/10 rounded-md transition-colors"
                        aria-label="Toggle mobile menu"
                    >
                        <div
                            className={`w-5 h-0.5 bg-white transition-all duration-300 ${
                                isMobileMenuOpen ? 'rotate-45 translate-y-2' : ''
                            }`}
                        />
                        <div
                            className={`w-5 h-0.5 bg-white transition-all duration-300 ${
                                isMobileMenuOpen ? 'opacity-0' : ''
                            }`}
                        />
                        <div
                            className={`w-5 h-0.5 bg-white transition-all duration-300 ${
                                isMobileMenuOpen ? '-rotate-45 -translate-y-2' : ''
                            }`}
                        />
                    </button>
                </div>
            </nav>

            {/* Mobile Menu */}
            <div
                className={`fixed top-16 left-0 right-0 bg-black border-b border-white/5 z-40 md:hidden transition-all duration-300 overflow-hidden font-folklore ${
                    isMobileMenuOpen ? 'max-h-screen' : 'max-h-0'
                }`}
            >
                <div className="flex flex-col py-4 px-4 gap-2">
                    {/* Info akun ditaruh PALING ATAS di mobile menu, dipisah dari nav items */}
                    {user && (
                        <div className="flex items-center gap-2 px-4 py-3 bg-white/5 rounded-md mb-2">
                            <span className="w-2 h-2 bg-green-400 rounded-full flex-shrink-0" />
                            <div>
                                <span className="text-[10px] text-white/40 block">Logged in as</span>
                                <p className="text-sm font-semibold text-white leading-tight">
                                    {user.Username || user.username || "User"}
                                </p>
                            </div>
                        </div>
                    )}

                    {navItems.map((item) => (
                        <button
                            key={item.view}
                            onClick={() => handleNavClick(item.view)}
                            className={`text-left px-4 py-3 rounded-md transition-colors text-sm font-medium ${
                                currentView === item.view
                                    ? 'bg-white/10 text-white font-bold'
                                    : 'text-white/60 hover:text-white hover:bg-white/5'
                            }`}
                        >
                            {item.label}
                        </button>
                    ))}
                </div>
            </div>
        </>
    );
}

export default Navbar;
