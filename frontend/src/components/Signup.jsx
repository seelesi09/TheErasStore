import React, { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

const Signup = ({ onSignupSuccess, onSwitchToLogin }) => {
    const [formData, setFormData] = useState({
        username: '',
        password: '',
    });

    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [showPassword, setShowPassword] = useState(false); // Perbaikan penamaan setter

    // Validasi form sekarang mengembalikan object error langsung
    const validateForm = () => {
        const newErrors = {};

        if (!formData.username.trim()) {
            newErrors.username = 'Username must be filled.';
        } else if (formData.username.length < 3) {
            newErrors.username = 'Username must be at least 3 characters.';
        }

        if (!formData.password.trim()) {
            newErrors.password = 'Password must be filled.';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters.';
        }

        setErrors(newErrors);
        return newErrors;
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));

        if (errors[name]) {
            setErrors((prev) => ({
                ...prev,
                [name]: '',
            }));
        }
    };

    const handleSignup = async (e) => {
        e.preventDefault();

        // Ambil error hasil validasi
        const validationErrors = validateForm();

        if (Object.keys(validationErrors).length > 0) {
            const firstError = Object.values(validationErrors)[0];
            Swal.fire({
                icon: 'warning',
                title: 'Invalid Input',
                text: firstError,
                background: '#0d0d0d',
                color: '#fff',
                confirmButtonColor: '#6366f1',
                scrollbarPadding: false,
                heightAuto: false,
                customClass: { popup: 'rounded-2xl border border-white/5' }
            });
            return;
        }

        setIsLoading(true);

        try {
            const response = await axios.post('https://theerasstore-production.up.railway.app/api/signup', {
                username: formData.username,
                password: formData.password,
            });

            Swal.fire({
                icon: 'success',
                title: 'Account Successfully Created!',
                text: 'Congratulations, your account has been registered! Please login.',
                background: '#0d0d0d',
                color: '#fff',
                confirmButtonColor: '#6366f1',
                scrollbarPadding: false,
                heightAuto: false,
            }).then(() => {
                setFormData({
                    username: '',
                    password: '',
                });
                onSwitchToLogin()

                if (onSignupSuccess) {
                    onSignupSuccess(response.data.user);
                }
            });
        } catch (error) {
            const errorMessage =
                error.response?.data?.message || error.message || 'An error occurred during signup';

            Swal.fire({
                icon: 'error',
                title: 'Signup Failed',
                text: errorMessage,
                background: '#0d0d0d',
                color: '#fff',
                confirmButtonColor: '#6366f1',
                scrollbarPadding: false,
                heightAuto: false,
            });

            console.error('Signup error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#0d0d0d] flex items-center justify-center px-4 font-folklore">
            <div className="w-full max-w-md">
                {/* Card Form */}
                <div className="bg-black/40 backdrop-blur-sm border border-white/5 rounded-2xl p-8 shadow-2xl">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-white mb-2">Signup</h1>
                        <p className="text-gray-400 text-sm">Create a new account to continue</p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSignup} className="space-y-4">
                        {/* Username Input */}
                        <div>
                            <label htmlFor="username" className="block text-sm font-medium text-gray-300 mb-2">
                                Username
                            </label>
                            <input
                                type="text"
                                id="username"
                                name="username"
                                value={formData.username}
                                onChange={handleInputChange}
                                placeholder="Choose your username"
                                className={`w-full px-4 py-3 bg-white/5 border rounded-lg text-white placeholder-gray-500 focus:outline-none transition-all duration-200 ${errors.username
                                    ? 'border-red-500/50 bg-red-500/10 focus:border-red-500/70'
                                    : 'border-white/10 focus:border-white/20 focus:bg-white/10'
                                    }`}
                                disabled={isLoading}
                            />
                            {errors.username && (
                                <p className="mt-1 text-xs text-red-400">{errors.username}</p>
                            )}
                        </div>

                        {/* Password Input dengan Toggle Show/Hide */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                                Password
                            </label>

                            {/* Container relative */}
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    id="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    placeholder="6 characters minimum"
                                    /* Pastikan ada pr-10 atau pr-12 agar teks password tidak menumpuk ikon */
                                    className={`w-full px-4 py-3 pr-12 bg-white/5 border rounded-lg text-white placeholder-gray-500 focus:outline-none transition-all duration-200 ${errors.password
                                            ? 'border-red-500/50 bg-red-500/10 focus:border-red-500/70'
                                            : 'border-white/10 focus:border-white/20 focus:bg-white/10'
                                        }`}
                                    disabled={isLoading}
                                />

                                {/* Tombol Mata - inset-y-0 + flex items-center membuat ikon presisi di tengah vertikal */}
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 inset-y-0 flex items-center text-gray-400 hover:text-white transition-colors focus:outline-none"
                                >
                                    {showPassword ? (
                                        /* SVG Mata Dicoret */
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                                        </svg>
                                    ) : (
                                        /* SVG Mata Terbuka */
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12c1.07-4.516 5.183-8 10.016-8 4.832 0 8.946 3.484 10.017 8-1.07 4.516-5.183 8-10.017 8-4.832 0-8.946-3.484-10.017-8z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                    )}
                                </button>
                            </div>

                            {errors.password && (
                                <p className="mt-1 text-xs text-red-400">{errors.password}</p>
                            )}
                        </div>

                        {/* Signup Button */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-white text-black font-semibold py-3 rounded-full hover:bg-gray-100 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-6"
                        >
                            {isLoading ? (
                                <>
                                    <svg
                                        className="animate-spin h-5 w-5"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                    >
                                        <circle
                                            className="opacity-25"
                                            cx="12"
                                            cy="12"
                                            r="10"
                                            stroke="currentColor"
                                            strokeWidth="4"
                                        />
                                        <path
                                            className="opacity-75"
                                            fill="currentColor"
                                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                        />
                                    </svg>
                                    Signing Up...
                                </>
                            ) : (
                                'Signup'
                            )}
                        </button>
                    </form>

                    {/* Divider */}
                    <div className="my-6 relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-white/10" />
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-[#0d0d0d] text-gray-500">Or</span>
                        </div>
                    </div>

                    {/* Login Link */}
                    <div className="text-center">
                        <p className="text-gray-400 text-sm">
                            Already have an account?{' '}
                            <button
                                type="button"
                                onClick={onSwitchToLogin}
                                className="text-indigo-400 hover:text-indigo-300 font-semibold transition-colors"
                            >
                                Login Here
                            </button>
                        </p>
                    </div>
                </div>

                {/* Footer Text */}
                <div className="mt-6 text-center text-xs text-gray-600">
                    <p>The Eras Store</p>
                </div>
            </div>
        </div>
    );
};

export default Signup;
