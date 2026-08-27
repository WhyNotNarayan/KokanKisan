import { useState, useEffect } from 'react';
import { CheckCircle, XCircle, MapPin, Eye, X } from 'lucide-react';
import { api } from '../../utils/api';
import toast from 'react-hot-toast';

export default function FarmerApproval() {
  const [farmers, setFarmers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFarmer, setSelectedFarmer] = useState(null);
  const [showModal, setShowModal] = useState(false);

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
      setShowModal(false);
      fetchPendingFarmers();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const suspendFarmer = async (uid) => {
    try {
      await api.put(`/admin/farmers/${uid}/suspend`);
      toast.success('Farmer rejected');
      setShowModal(false);
      fetchPendingFarmers();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const viewFarmer = (farmer) => {
    setSelectedFarmer(farmer);
    setShowModal(true);
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
                  {farmer.profile?.idCardImage && (
                    <button onClick={() => viewFarmer(farmer)} className="px-4 py-2 bg-blue-100 text-blue-600 rounded-lg text-sm font-medium hover:bg-blue-200 flex items-center gap-1">
                      <Eye className="w-4 h-4" /> View ID
                    </button>
                  )}
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

      {showModal && selectedFarmer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-lg font-semibold">Farmer ID Card Verification</h3>
              <button onClick={() => setShowModal(false)} className="p-1 hover:bg-gray-100 rounded">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-forest-100 rounded-full flex items-center justify-center text-forest-600 font-bold text-lg">
                  {selectedFarmer.name?.[0] || 'F'}
                </div>
                <div>
                  <h4 className="font-semibold">{selectedFarmer.name}</h4>
                  <p className="text-sm text-gray-500">{selectedFarmer.phone}</p>
                </div>
              </div>

              <div className="text-sm space-y-1">
                <p><span className="font-medium">Village:</span> {selectedFarmer.village}</p>
                <p><span className="font-medium">Taluka:</span> {selectedFarmer.taluka}</p>
                <p><span className="font-medium">Registered:</span> {new Date(selectedFarmer.createdAt).toLocaleDateString()}</p>
              </div>

              {selectedFarmer.profile?.idCardImage && (
                <div>
                  <p className="text-sm font-medium mb-2">ID Card:</p>
                  <img
                    src={selectedFarmer.profile.idCardImage}
                    alt="Farmer ID Card"
                    className="w-full rounded-lg border"
                  />
                </div>
              )}

              <div className="flex gap-2 pt-2">
                <button onClick={() => approveFarmer(selectedFarmer.uid)} className="flex-1 py-2 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 flex items-center justify-center gap-1">
                  <CheckCircle className="w-4 h-4" /> Approve
                </button>
                <button onClick={() => suspendFarmer(selectedFarmer.uid)} className="flex-1 py-2 bg-red-100 text-red-600 rounded-lg font-medium hover:bg-red-200 flex items-center justify-center gap-1">
                  <XCircle className="w-4 h-4" /> Reject
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
