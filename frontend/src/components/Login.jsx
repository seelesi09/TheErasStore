import React, { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

const Login = ({ onLoginSuccess, onSwitchToSignup }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    // Validasi input
    if (!username.trim() || !password.trim()) {
      Swal.fire({
        icon: 'warning',
        title: 'Input Tidak Lengkap',
        text: 'Silakan isi username dan password',
        background: '#0d0d0d',
        color: '#fff',
        confirmButtonColor: '#6366f1',
        scrollbarPadding: false,
        heightAuto: false,
        buttonsStyling: false,
        confirmButtonClass: 'px-6 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-full transition'
      });
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post('https://theerasstore-production.up.railway.app/api/login', {
        username: username.trim(),
        password: password.trim()
      });

      const userData = response.data.user || response.data;

      if (onLoginSuccess) {
        onLoginSuccess(userData);
      }

      // Login berhasil
      Swal.fire({
        icon: 'success',
        title: 'Login Success',
        text: `Welcome, ${response.data.user?.Username || 'User'}!`,
        background: '#0d0d0d',
        color: '#fff',
        confirmButtonColor: '#6366f1',
        scrollbarPadding: false,
        heightAuto: false,
        buttonsStyling: false,
        customClass: { confirmButtonClass: 'px-6 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-full transition' },
        allowOutsideClick: false,
        allowEscapeKey: false
      }).then(() => {
        setUsername('');
        setPassword('');

      });
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'There had an error while login';

      Swal.fire({
        icon: 'error',
        title: 'Login Failed',
        text: errorMessage,
        background: '#0d0d0d',
        color: '#fff',
        confirmButtonColor: '#6366f1',
        scrollbarPadding: false,
        heightAuto: false,
        buttonsStyling: false,
        confirmButtonClass: 'px-6 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-full transition'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-auto bg-[#0d0d0d] flex items-center justify-center px-4 font-folklore">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -right-1/4 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -left-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        <div className="bg-black/40 backdrop-blur-xl border border-white/5 rounded-2xl p-8 shadow-2xl">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Login</h1>
            <p className="text-gray-400 text-sm">Please Login to Your Account</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
  <div className="group">
    <label htmlFor="username" className="block text-xs font-semibold text-gray-300 mb-2 uppercase tracking-wide">
      Username
    </label>
    <input
      id="username"
      type="text"
      placeholder="Input Your Username"
      value={username}
      onChange={(e) => setUsername(e.target.value)}
      disabled={loading}
      className="w-full px-4 py-4 text-base bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition disabled:opacity-50 disabled:cursor-not-allowed"
    />
  </div>  {/* ← TAMBAHKAN INI */}

  <div className="group">
    <label htmlFor="password" className="block text-xs font-semibold text-gray-300 mb-2 uppercase tracking-wide">
      Password
    </label>

    <div className="relative flex items-center">
      <input
        id="password"
        type={showPassword ? 'text' : 'password'}
        placeholder="Input Your Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        disabled={loading}
        className="w-full px-4 py-4 pr-11 text-base bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition disabled:opacity-50 disabled:cursor-not-allowed"
      />

      <button
        type="button"
        onClick={() => setShowPassword(!showPassword)}
        disabled={loading}
        className="absolute right-3.5 text-gray-400 hover:text-white transition-colors focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {showPassword ? (
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12c1.07-4.516 5.183-8 10.016-8 4.832 0 8.946 3.484 10.017 8-1.07 4.516-5.183 8-10.017 8-4.832 0-8.946-3.484-10.017-8z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        )}
      </button>
    </div>
  </div>  {/* ← INI SUDAH BENAR */}

  <button
    type="submit"
    ...
  >
    ...
  </button>
</form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-2 bg-black/40 text-gray-500">Or</span>
            </div>
          </div>

          <div className="text-center">
            <p className="text-gray-400 text-sm">
              Don't Have an Account?{' '}
              <button
                type="button"
                onClick={onSwitchToSignup}
                disabled={loading}
                className="text-indigo-400 hover:text-indigo-300 font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Sign Up Here
              </button>
            </p>
          </div>
        </div>

        <p className="text-center text-gray-600 text-xs mt-6">
          The Eras Store
        </p>
      </div>
    </div>
  );
};

export default Login;
