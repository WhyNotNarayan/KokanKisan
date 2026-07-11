import { useState, useEffect } from 'react';
import { CheckCircle, XCircle, MapPin } from 'lucide-react';
import { api } from '../../utils/api';
import toast from 'react-hot-toast';

export default function FarmerApproval() {
  const [farmers, setFarmers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPendingFarmers();
  }, []);

  const fetchPendingFarmers = async () => {
    try {
      const data = await api.get('/admin/farmers/pending');
      setFarmers(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const approveFarmer = async (uid) => {
    try {
      await api.put(`/admin/farmers/${uid}/approve`);
      toast.success('Farmer approved!');
      fetchPendingFarmers();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const suspendFarmer = async (uid) => {
    try {
      await api.put(`/admin/farmers/${uid}/suspend`);
      toast.success('Farmer suspended');
      fetchPendingFarmers();
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Farmer Approval Queue</h1>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="card animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      ) : farmers.length === 0 ? (
        <div className="text-center py-16">
          <CheckCircle className="w-16 h-16 text-green-300 mx-auto mb-4" />
          <p className="text-gray-500">All caught up! No pending approvals.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {farmers.map((farmer) => (
            <div key={farmer.uid} className="card">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-forest-100 rounded-full flex items-center justify-center text-forest-600 font-bold text-lg">
                    {farmer.name?.[0] || 'F'}
                  </div>
                  <div>
                    <h3 className="font-semibold">{farmer.name}</h3>
                    <p className="text-sm text-gray-500">{farmer.phone}</p>
                    <div className="flex items-center gap-1 text-sm text-gray-500 mt-1">
                      <MapPin className="w-3.5 h-3.5" />
                      <span>{farmer.village}, {farmer.taluka}</span>
                    </div>
                    <p className="text-xs text-gray-400 mt-1">
                      Registered: {new Date(farmer.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button onClick={() => approveFarmer(farmer.uid)} className="px-4 py-2 bg-green-500 text-white rounded-lg text-sm font-medium hover:bg-green-600 flex items-center gap-1">
                    <CheckCircle className="w-4 h-4" /> Approve
                  </button>
                  <button onClick={() => suspendFarmer(farmer.uid)} className="px-4 py-2 bg-red-100 text-red-600 rounded-lg text-sm font-medium hover:bg-red-200 flex items-center gap-1">
                    <XCircle className="w-4 h-4" /> Reject
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
