import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';

const VerifyOTPPage = () => {
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();

  const userId = sessionStorage.getItem('tempUserId');

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError('');

    try {
      const res = await api.post('/auth/verify-2fa', {
        userId,
        token: otp,
      });

      sessionStorage.setItem('token', res.data.token);

      sessionStorage.setItem(
        'user',
        JSON.stringify(res.data.user)
      );

      sessionStorage.removeItem('tempUserId');

      navigate('/dashboard');
    } catch (err) {
      setError(
        err.response?.data?.message ||
          'Invalid OTP'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-matte-black to-gray-900 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">

        <h1 className="text-2xl font-bold text-center text-gold mb-2">
          MANIRATNA JEWELS
        </h1>

        <p className="text-center text-gray-600 mb-6">
          Enter Google Authenticator Code
        </p>

        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>

          <input
            type="text"
            maxLength="6"
            value={otp}
            onChange={(e) =>
              setOtp(e.target.value)
            }
            placeholder="123456"
            className="w-full border border-gray-300 rounded-lg px-4 py-3 text-center text-xl tracking-widest mb-4"
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gold text-matte-black font-semibold py-3 rounded-lg hover:bg-yellow-600 transition"
          >
            {loading
              ? 'Verifying...'
              : 'Verify'}
          </button>

        </form>
      </div>
    </div>
  );
};

export default VerifyOTPPage;