import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";

const Setup2FAPage = () => {
  const navigate = useNavigate();

  const [qrCode, setQrCode] = useState("");
  const [secret, setSecret] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(true);
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadQRCode = async () => {
      try {
        const res = await api.post("/auth/setup-2fa");

        setQrCode(res.data.qrCode);
        setSecret(res.data.secret);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to generate QR code");
      } finally {
        setLoading(false);
      }
    };

    loadQRCode();
  }, []);

  const handleEnable2FA = async (e) => {
    e.preventDefault();

    setVerifying(true);
    setError("");

    try {
      await api.post("/auth/enable-2fa", {
        token: otp,
      });

      alert("2FA Enabled Successfully");

      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid OTP");
    } finally {
      setVerifying(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading QR Code...{" "}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-matte-black to-gray-900 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-center text-gold mb-2">
          MANIRATNA JEWELS
        </h1>

        <p className="text-center text-gray-600 mb-6">
          Setup Google Authenticator
        </p>

        {error && (
          <div className="bg-red-100 border border-red-300 text-red-700 p-3 rounded mb-4">
            {error}
          </div>
        )}

        <div className="flex justify-center mb-6">
          <img
            src={qrCode}
            alt="QR Code"
            className="w-56 h-56 border rounded-lg"
          />
        </div>

        <div className="bg-gray-100 p-3 rounded text-xs break-all mb-6">
          <strong>Manual Secret:</strong>
          <br />
          {secret}
        </div>

        <p className="text-sm text-gray-600 mb-4">
          Scan the QR code using Google Authenticator and enter the 6-digit code
          below.
        </p>

        <form onSubmit={handleEnable2FA} className="space-y-4">
          <input
            type="text"
            maxLength={6}
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="Enter 6-digit OTP"
            className="w-full border border-gray-300 rounded-lg px-4 py-3 text-center text-lg tracking-widest"
            required
          />

          <button
            type="submit"
            disabled={verifying}
            className="w-full bg-gold text-matte-black font-semibold py-3 rounded-lg hover:bg-yellow-600 transition"
          >
            {verifying ? "Verifying..." : "Enable 2FA"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Setup2FAPage;
