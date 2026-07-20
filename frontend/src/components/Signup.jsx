import React, { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

const Signup = ({ onSignupSuccess, onSwitchToLogin }) => {
    // bikin variabel buat nyimpen usn pw 
    const [formData, setFormData] = useState({
        username: '',
        password: '',
    });

    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState({});

    const validateForm = () => {
        const newErrors = {};

        // Validasi username harus diizi
        if (!formData.username.trim()) {
            newErrors.username = 'Username must be filled.';
        // kl misal usernem ngisi kurg 3 karakter bakal dibanned
        } else if (formData.username.length < 3) {
            newErrors.username = 'Username must be at least 3 characters.';
        }

        // pw harus diizi dong masa kosong
        if (!formData.password.trim()) {
            newErrors.password = 'Password must be filled';
        // kl misal ngisi pw kurang dr 6 dibanned 
        } else if (formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
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

        // Validasi form
        if (!validateForm()) {
            const firstError = Object.values(errors)[0];
            Swal.fire({
                icon: 'warning',
                title: "Input Doesn't Valid",
                text: firstError,
                background: '#0d0d0d',
                color: '#fff',
                confirmButtonColor: '#6366f1',
                scrollbarPadding: false,
                heightAuto: false,
            });
            return;
        } if (formData.password.length < 6) {
            Swal.fire({
                title: "Password Too Short",
                text: "For Safety, Please Make a Password of Minimum 6 Characters",
                icon: 'warning',
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
            const response = await axios.post('https://https://theerasstore-production.up.railway.app/api/signup', {
                username: formData.username,
                password: formData.password,
            });

            // Signup berhasil
            Swal.fire({
                icon: 'success',
                title: 'Account Succesfully Made!',
                text: 'Congratulation Your Account Have Been Signed up!, Please Login',
                background: '#0d0d0d',
                color: '#fff',
                confirmButtonColor: '#6366f1',
                scrollbarPadding: false,
                heightAuto: false,
            }).then(() => {
                // Reset form
                setFormData({
                    username: '',
                    password: '',
                });

                if (onSignupSuccess) {
                    onSignupSuccess(response.data.user);
                }
            });
        } catch (error) {

            const errorMessage =
                error.response?.data?.message || error.message || 'Terjadi kesalahan saat mendaftar';

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
                        <p className="text-gray-400 text-sm">Make New Account to Continue</p>
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
                                placeholder="Choose Your Username"
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


                        {/* Password Input */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                                Password
                            </label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleInputChange}
                                placeholder="6 Characters Minimum"
                                className={`w-full px-4 py-3 bg-white/5 border rounded-lg text-white placeholder-gray-500 focus:outline-none transition-all duration-200 ${errors.password
                                        ? 'border-red-500/50 bg-red-500/10 focus:border-red-500/70'
                                        : 'border-white/10 focus:border-white/20 focus:bg-white/10'
                                    }`}
                                disabled={isLoading}
                            />
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
                                    Signing Up
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
                            <span className="px-2 bg-black/40 text-gray-500">Or</span>
                        </div>
                    </div>

                    {/* Login Link */}
                    <div className="text-center">
                        <p className="text-gray-400 text-sm">
                            Already Had an Account?{' '}
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
