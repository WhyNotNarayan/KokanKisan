import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Leaf, Phone, User, MapPin } from 'lucide-react';
import useAuthStore from '../store/useAuthStore';
import toast from 'react-hot-toast';

const TALUKAS = [
  'Sindhudurg', 'Malvan', 'Kankavli', 'Sawantwadi', 'Vengurla', 'Devgad',
  'Ratnagiri', 'Chiplun', 'Rajapur', 'Dapoli', 'Khed', 'Guhagar',
  'Alibag', 'Panvel', 'Mahad', 'Mangaon', 'Tala',
];

export default function Register() {
  const [role, setRole] = useState('buyer');
  const [form, setForm] = useState({ name: '', phone: '', village: '', taluka: '', city: '', aadharNumber: '' });
  const { register, loading } = useAuthStore();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register({ ...form, role });
      toast.success('Registration successful!');
      navigate(role === 'farmer' ? '/farmer' : '/buyer');
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Leaf className="w-12 h-12 text-forest-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold">Join KokanKisan</h1>
          <p className="text-gray-500 mt-1">Create your account</p>
        </div>

        <div className="card">
          <div className="flex rounded-lg bg-gray-100 p-1 mb-6">
            <button
              type="button"
              onClick={() => setRole('buyer')}
              className={`flex-1 py-2 rounded-md text-sm font-medium transition-colors ${role === 'buyer' ? 'bg-white shadow text-forest-600' : 'text-gray-500'}`}
            >
              Buyer
            </button>
            <button
              type="button"
              onClick={() => setRole('farmer')}
              className={`flex-1 py-2 rounded-md text-sm font-medium transition-colors ${role === 'farmer' ? 'bg-white shadow text-forest-600' : 'text-gray-500'}`}
            >
              Farmer
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input type="text" name="name" value={form.name} onChange={handleChange} placeholder="Your full name" className="input-field pl-11" required />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input type="tel" name="phone" value={form.phone} onChange={handleChange} placeholder="+91 98765 43210" className="input-field pl-11" required />
              </div>
            </div>

            {role === 'farmer' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Aadhar Number</label>
                  <input type="text" name="aadharNumber" value={form.aadharNumber} onChange={handleChange} placeholder="12-digit Aadhar number" className="input-field" maxLength={12} required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Village</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input type="text" name="village" value={form.village} onChange={handleChange} placeholder="Your village name" className="input-field pl-11" required />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Taluka</label>
                  <select name="taluka" value={form.taluka} onChange={handleChange} className="input-field" required>
                    <option value="">Select Taluka</option>
                    {TALUKAS.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
              </>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">City (Optional)</label>
              <input type="text" name="city" value={form.city} onChange={handleChange} placeholder="City name" className="input-field" />
            </div>

            <button type="submit" className="btn-primary w-full" disabled={loading}>
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>
        </div>

        <p className="text-center mt-6 text-sm text-gray-500">
          Already have an account?{' '}
          <Link to="/login" className="text-forest-500 font-medium hover:underline">Login</Link>
        </p>
      </div>
    </div>
  );
}
