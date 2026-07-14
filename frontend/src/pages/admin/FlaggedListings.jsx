import { useState, useEffect } from 'react';
import { AlertTriangle, Trash2 } from 'lucide-react';
import { api } from '../../utils/api';
import toast from 'react-hot-toast';

export default function FlaggedListings() {
  const [flags, setFlags] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFlags();
  }, []);

  const fetchFlags = async () => {
    try {
      const data = await api.get('/admin/flags');
      setFlags(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const removeProduct = async (productId) => {
    try {
      await api.put(`/admin/products/${productId}/remove`);
      toast.success('Product removed');
      fetchFlags();
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Flagged Listings</h1>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="card animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      ) : flags.length === 0 ? (
        <div className="text-center py-16">
          <AlertTriangle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">No flagged products. Platform is clean!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {flags.map((flag) => (
            <div key={flag.flagId} className="card">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-mono text-xs text-gray-400 mb-1">Flag ID: {flag.flagId.slice(0, 8)}...</p>
                  <p className="font-medium">Product ID: {flag.productId.slice(0, 8)}...</p>
                  <p className="text-sm text-gray-500 mt-1">Reason: {flag.reason}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    Flagged by: {flag.buyerId.slice(0, 8)}... · {new Date(flag.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <button
                  onClick={() => removeProduct(flag.productId)}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg text-sm font-medium hover:bg-red-600 flex items-center gap-1"
                >
                  <Trash2 className="w-4 h-4" /> Remove Product
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
