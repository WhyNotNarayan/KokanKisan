import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Leaf, Phone, KeyRound, Shield } from 'lucide-react';
import useAuthStore from '../store/useAuthStore';
import toast from 'react-hot-toast';

export default function Login() {
  const [tab, setTab] = useState('user');
  const [step, setStep] = useState('phone');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, verifyOtp, adminLogin, loading } = useAuthStore();
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

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await adminLogin(email, password);
      toast.success('Admin login successful!');
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

        <div className="flex bg-gray-100 rounded-lg p-1 mb-4">
          <button
            onClick={() => setTab('user')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-md text-sm font-medium transition-colors ${
              tab === 'user' ? 'bg-white text-forest-600 shadow-sm' : 'text-gray-500'
            }`}
          >
            <Phone className="w-4 h-4" /> User Login
          </button>
          <button
            onClick={() => setTab('admin')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-md text-sm font-medium transition-colors ${
              tab === 'admin' ? 'bg-white text-forest-600 shadow-sm' : 'text-gray-500'
            }`}
          >
            <Shield className="w-4 h-4" /> Admin Login
          </button>
        </div>

        <div className="card">
          {tab === 'user' ? (
            step === 'phone' ? (
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
            )
          ) : (
            <form onSubmit={handleAdminLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Admin Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@gmail.com"
                  className="input-field"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <div className="relative">
                  <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••"
                    className="input-field pl-11"
                    required
                  />
                </div>
              </div>
              <button type="submit" className="btn-primary w-full" disabled={loading}>
                {loading ? 'Signing in...' : 'Sign In as Admin'}
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
