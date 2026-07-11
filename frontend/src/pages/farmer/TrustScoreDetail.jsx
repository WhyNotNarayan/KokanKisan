import { useState, useEffect } from 'react';
import { Star, Shield, Video, Flag, Users, AlertCircle } from 'lucide-react';
import useAuthStore from '../../store/useAuthStore';
import TrustBadge from '../../components/TrustBadge';
import { api } from '../../utils/api';

export default function TrustScoreDetail() {
  const user = useAuthStore((s) => s.user);
  const [trustData, setTrustData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTrustScore();
  }, []);

  const fetchTrustScore = async () => {
    try {
      const data = await api.get(`/trust/${user.uid}`);
      setTrustData(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="h-48 bg-gray-200 rounded-xl"></div>
        </div>
      </div>
    );
  }

  if (!trustData) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <p className="text-gray-500">Could not load trust score</p>
      </div>
    );
  }

  const factors = [
    { label: 'Pledge Signed', value: trustData.pledgeSigned ? 'Yes (+10)' : 'No (+0)', icon: Shield, done: trustData.pledgeSigned },
    { label: 'Vouches Received', value: `${trustData.vouchCount} (${trustData.vouchCount * 15} pts)`, icon: Users, done: trustData.vouchCount > 0 },
    { label: 'Weekly Videos', value: `${trustData.weeklyVideosUploaded} (${trustData.weeklyVideosUploaded * 2} pts)`, icon: Video, done: trustData.weeklyVideosUploaded > 0 },
    { label: 'Flags Received', value: `${trustData.flagsReceived} (-${trustData.flagsReceived * 20} pts)`, icon: Flag, done: false, negative: trustData.flagsReceived > 0 },
  ];

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Trust Score Detail</h1>

      <div className="card mb-8">
        <div className="text-center mb-6">
          <div className="text-6xl font-bold text-forest-600 mb-2">{trustData.trustScore}</div>
          <p className="text-gray-500 mb-3">out of 100</p>
          <TrustBadge score={trustData.trustScore} size="lg" />
        </div>

        <div className="w-full bg-gray-200 rounded-full h-3 mb-6">
          <div
            className="bg-forest-500 h-3 rounded-full transition-all duration-500"
            style={{ width: `${trustData.trustScore}%` }}
          ></div>
        </div>

        <div className="space-y-3">
          {factors.map((factor) => (
            <div key={factor.label} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
              <div className="flex items-center gap-3">
                <factor.icon className={`w-5 h-5 ${factor.negative ? 'text-red-400' : factor.done ? 'text-forest-500' : 'text-gray-400'}`} />
                <span className="text-sm font-medium">{factor.label}</span>
              </div>
              <span className={`text-sm ${factor.negative ? 'text-red-500' : 'text-gray-600'}`}>{factor.value}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <h2 className="font-semibold mb-3">How to Improve Your Score</h2>
        <ul className="space-y-2 text-sm text-gray-600">
          {!trustData.pledgeSigned && (
            <li className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-amber-500 mt-0.5" />
              Sign the natural farming pledge (+10 points)
            </li>
          )}
          <li className="flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-amber-500 mt-0.5" />
            Get vouched by fellow farmers (+15 points each)
          </li>
          <li className="flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-amber-500 mt-0.5" />
            Upload weekly farm videos (+2 points each)
          </li>
          <li className="flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-amber-500 mt-0.5" />
            Maintain good ratings from buyers (+10 × avg rating)
          </li>
        </ul>
      </div>
    </div>
  );
}
