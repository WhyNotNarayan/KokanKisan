import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Leaf, Phone, KeyRound } from 'lucide-react';
import useAuthStore from '../store/useAuthStore';
import toast from 'react-hot-toast';

export default function Login() {
  const [step, setStep] = useState('phone');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const { login, verifyOtp, loading } = useAuthStore();
  const navigate = useNavigate();

  const handleSendOtp = async (e) => {
    e.preventDefault();
    try {
      await login(phone);
      toast.success('OTP sent! Check console for dev OTP.');
      setStep('otp');
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    try {
      const res = await verifyOtp(phone, otp);
      toast.success('Login successful!');
      navigate(getDashPath(res.user.role));
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Leaf className="w-12 h-12 text-forest-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold">Welcome Back</h1>
          <p className="text-gray-500 mt-1">Sign in to your KokanKisan account</p>
        </div>

        <div className="card">
          {step === 'phone' ? (
            <form onSubmit={handleSendOtp} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="input-field pl-11"
                    required
                  />
                </div>
              </div>
              <button type="submit" className="btn-primary w-full" disabled={loading}>
                {loading ? 'Sending OTP...' : 'Send OTP'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Enter OTP</label>
                <div className="relative">
                  <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="6-digit OTP"
                    className="input-field pl-11"
                    maxLength={6}
                    required
                  />
                </div>
                <p className="text-xs text-gray-400 mt-1">Check server console for OTP in development mode</p>
              </div>
              <button type="submit" className="btn-primary w-full" disabled={loading}>
                {loading ? 'Verifying...' : 'Verify OTP'}
              </button>
              <button type="button" onClick={() => setStep('phone')} className="text-sm text-forest-500 hover:underline w-full text-center">
                Change phone number
              </button>
            </form>
          )}
        </div>

        <p className="text-center mt-6 text-sm text-gray-500">
          Don't have an account?{' '}
          <Link to="/register" className="text-forest-500 font-medium hover:underline">Register</Link>
        </p>
      </div>
    </div>
  );
}

function getDashPath(role) {
  switch (role) {
    case 'farmer': return '/farmer';
    case 'admin': return '/admin';
    default: return '/buyer';
  }
}
