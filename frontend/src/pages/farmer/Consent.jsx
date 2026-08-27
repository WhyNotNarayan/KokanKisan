import { useState } from 'react';
import { Leaf, CheckCircle, AlertTriangle } from 'lucide-react';
import useAuthStore from '../../store/useAuthStore';
import { api } from '../../utils/api';
import toast from 'react-hot-toast';

const RULES = [
  {
    title: 'Only Organic Products',
    description: 'You agree to sell only organic, naturally grown products. No chemical fertilizers, pesticides, or artificial growth hormones are allowed.',
    icon: '🌿',
  },
  {
    title: 'No Harmful Substances',
    description: 'You will not sell any products containing harmful chemicals, preservatives, or artificial additives that may harm consumers.',
    icon: '🚫',
  },
  {
    title: 'Honest Representation',
    description: 'All product descriptions, images, and prices must be accurate and truthful. Misleading information will result in account suspension.',
    icon: '✅',
  },
  {
    title: 'Fresh Products Only',
    description: 'You commit to selling only fresh products. Expired or stale products must never be listed or delivered to customers.',
    icon: 'Fresh',
  },
  {
    title: 'Fair Pricing',
    description: 'You will maintain fair and transparent pricing. No artificial price inflation or price manipulation allowed.',
    icon: '💰',
  },
  {
    title: 'Quality Packaging',
    description: 'All products must be properly packaged to ensure safe delivery. Use eco-friendly packaging when possible.',
    icon: '📦',
  },
  {
    title: 'Timely Delivery',
    description: 'You commit to dispatching orders within the promised timeframe. Delays should be communicated proactively.',
    icon: '🚚',
  },
  {
    title: 'Respectful Communication',
    description: 'Maintain professional and respectful communication with buyers and fellow farmers at all times.',
    icon: '🤝',
  },
  {
    title: 'No Middlemen',
    description: 'This platform connects you directly to consumers. Do not involve middlemen or third-party resellers.',
    icon: '👨‍🌾',
  },
  {
    title: 'Community First',
    description: 'Support the KokanKisan community by participating in vouches, reviews, and helping fellow farmers.',
    icon: '🏘️',
  },
];

export default function Consent({ onConsentGiven }) {
  const user = useAuthStore((s) => s.user);
  const [agreed, setAgreed] = useState({});
  const [allAgreed, setAllAgreed] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleCheckboxChange = (index) => {
    const newAgreed = { ...agreed, [index]: !agreed[index] };
    setAgreed(newAgreed);

    const allChecked = RULES.every((_, i) => newAgreed[i]);
    setAllAgreed(allChecked);
  };

  const handleConfirm = async () => {
    if (!allAgreed) {
      toast.error('Please agree to all rules before proceeding');
      return;
    }

    setLoading(true);
    try {
      await api.put(`/auth/farmer-consent/${user.uid}`, { consentGiven: true });
      toast.success('Welcome to KokanKisan! You are now an official member.');
      onConsentGiven();
    } catch (err) {
      toast.error(err.message || 'Failed to save consent');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <Leaf className="w-12 h-12 text-forest-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold">Welcome to KokanKisan</h1>
          <p className="text-gray-500 mt-1">Please read and accept our community rules</p>
        </div>

        <div className="card">
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-500 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-amber-800">Important</p>
                <p className="text-sm text-amber-700">
                  By joining KokanKisan, you agree to follow all community rules. Violation of these rules may result in account suspension.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4 mb-6">
            {RULES.map((rule, index) => (
              <div key={index} className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50">
                <input
                  type="checkbox"
                  checked={agreed[index] || false}
                  onChange={() => handleCheckboxChange(index)}
                  className="w-5 h-5 mt-0.5 text-forest-500 border-gray-300 rounded focus:ring-forest-500"
                />
                <div>
                  <p className="font-medium text-sm">
                    <span className="mr-2">{rule.icon}</span>
                    {rule.title}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">{rule.description}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="border-t pt-4">
            <button
              onClick={handleConfirm}
              disabled={!allAgreed || loading}
              className={`w-full py-3 rounded-lg font-medium transition-colors ${
                allAgreed
                  ? 'bg-forest-500 text-white hover:bg-forest-600'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="animate-spin">⏳</span> Saving...
                </span>
              ) : allAgreed ? (
                <span className="flex items-center justify-center gap-2">
                  <CheckCircle className="w-5 h-5" /> Confirm & Join KokanKisan
                </span>
              ) : (
                `Agree to all ${RULES.length} rules to continue`
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
