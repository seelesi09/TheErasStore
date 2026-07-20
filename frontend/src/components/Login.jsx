import React, { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

const Login = ({ onLoginSuccess, onSwitchToSignup }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

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
      const response = await axios.post('https://https://theerasstore-production.up.railway.app/api/login', {
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
        customClass: {confirmButtonClass: 'px-6 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-full transition'},
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
    <div className="min-h-screen bg-[#0d0d0d] flex items-center justify-center px-4 font-folklore">
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
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>

            <div className="group">
              <label htmlFor="password" className="block text-xs font-semibold text-gray-300 mb-2 uppercase tracking-wide">
                Password
              </label>
              <input
                id="password"
                type="password"
                placeholder="Input Your Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-6 py-3 px-6 bg-white text-black font-semibold rounded-full hover:bg-gray-100 transition disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 shadow-lg"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="w-4 h-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Sedang Login...
                </span>
              ) : (
                'Login'
              )}
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
