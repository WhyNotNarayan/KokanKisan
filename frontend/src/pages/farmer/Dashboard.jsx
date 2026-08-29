import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, DollarSign, Star, Plus, Video, ShoppingBag, Clock, CheckCircle, AlertCircle, Leaf } from 'lucide-react';
import useAuthStore from '../../store/useAuthStore';
import TrustBadge from '../../components/TrustBadge';
import Consent from './Consent';
import { api } from '../../utils/api';
import toast from 'react-hot-toast';

export default function FarmerDashboard() {
  const user = useAuthStore((s) => s.user);
  const [stats, setStats] = useState({ products: 0, orders: 0, earnings: 0 });
  const [trustData, setTrustData] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [farmerStatus, setFarmerStatus] = useState(null);
  const [showConsent, setShowConsent] = useState(false);

  useEffect(() => {
    fetchFarmerStatus();
  }, []);

  const fetchFarmerStatus = async () => {
    try {
      const statusData = await api.get(`/auth/farmer-status/${user.uid}`);
      setFarmerStatus(statusData);

      if (statusData.status === 'pending') {
        setLoading(false);
        return;
      }

      if (statusData.status === 'approved' && !statusData.consentGiven) {
        setShowConsent(true);
        setLoading(false);
        return;
      }

      fetchDashboard();
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const fetchDashboard = async () => {
    try {
      const [products, orders, trust] = await Promise.all([
        api.get(`/products?farmerId=${user.uid}`),
        api.get(`/orders/farmer/${user.uid}`),
        api.get(`/trust/${user.uid}`).catch(() => null),
      ]);

      const productCount = products.products?.filter((p) => p.farmerId === user.uid).length || 0;

      setStats({
        products: productCount,
        orders: orders.length,
        earnings: orders.filter((o) => o.status === 'Delivered').reduce((sum, o) => sum + (o.farmerPayout || 0), 0),
      });

      setTrustData(trust);
      setRecentOrders(orders.slice(0, 5));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleConsentGiven = () => {
    setShowConsent(false);
    setFarmerStatus((prev) => ({ ...prev, consentGiven: true }));
    fetchDashboard();
  };

  if (showConsent) {
    return <Consent onConsentGiven={handleConsentGiven} />;
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (farmerStatus?.status === 'pending') {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center py-16">
          <Clock className="w-16 h-16 text-amber-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Account Under Review</h2>
          <p className="text-gray-500 mb-6">
            Your account is pending admin approval. You will receive a notification once your account is approved.
          </p>
          <div className="card max-w-md mx-auto">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-amber-500" />
              <p className="text-sm text-gray-600">
                <strong>Status:</strong> Pending Approval
              </p>
            </div>
            <p className="text-xs text-gray-400 mt-2">
              Registered: {new Date(farmerStatus.createdAt || Date.now()).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Farmer Dashboard</h1>
        <Link to="/farmer/add-product" className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add Product
        </Link>
      </div>

      <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
        <div className="flex items-center gap-3">
          <CheckCircle className="w-5 h-5 text-green-500" />
          <p className="text-sm text-green-800">
            <strong>Welcome!</strong> Your account has been approved. You are now an official member of KokanKisan.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="card flex items-center gap-3">
          <div className="w-10 h-10 bg-forest-100 rounded-full flex items-center justify-center">
            <Package className="w-5 h-5 text-forest-500" />
          </div>
          <div>
            <p className="text-xl font-bold">{stats.products}</p>
            <p className="text-xs text-gray-500">Products</p>
          </div>
        </div>
        <div className="card flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
            <ShoppingBag className="w-5 h-5 text-blue-500" />
          </div>
          <div>
            <p className="text-xl font-bold">{stats.orders}</p>
            <p className="text-xs text-gray-500">Orders</p>
          </div>
        </div>
        <div className="card flex items-center gap-3">
          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
            <DollarSign className="w-5 h-5 text-green-500" />
          </div>
          <div>
            <p className="text-xl font-bold">₹{stats.earnings}</p>
            <p className="text-xs text-gray-500">Earnings</p>
          </div>
        </div>
        <div className="card">
          <p className="text-xs text-gray-500 mb-1">Trust Score</p>
          {trustData && <TrustBadge score={trustData.trustScore} size="lg" />}
        </div>
      </div>

      <div className="flex flex-wrap gap-3 mb-8">
        <Link to="/farmer/products" className="btn-outline text-sm py-2">Manage Products</Link>
        <Link to="/farmer/orders" className="btn-outline text-sm py-2">View Orders</Link>
        <Link to="/farmer/trust-score" className="btn-outline text-sm py-2">Trust Score</Link>
        <Link to="/farmer/ingredient-requests" className="btn-outline text-sm py-2 flex items-center gap-1 border-amber-300 text-amber-700 hover:bg-amber-50">
          <Leaf className="w-4 h-4" /> Festival Ingredients
        </Link>
        <Link to="/farmer/upload-video" className="btn-outline text-sm py-2 flex items-center gap-1">
          <Video className="w-4 h-4" /> Upload Video
        </Link>
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-4">Recent Orders</h2>
        {recentOrders.length > 0 ? (
          <div className="space-y-3">
            {recentOrders.map((order) => (
              <div key={order.orderId} className="card flex items-center justify-between">
                <div>
                  <p className="font-medium">{order.productName}</p>
                  <p className="text-sm text-gray-500">Qty: {order.quantity} · ₹{order.totalAmount}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                  {order.status}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-400">No orders yet</p>
        )}
      </div>
    </div>
  );
}

function getStatusColor(status) {
  switch (status) {
    case 'Confirmed': return 'bg-blue-100 text-blue-700';
    case 'Packed': return 'bg-amber-100 text-amber-700';
    case 'Dispatched': return 'bg-purple-100 text-purple-700';
    case 'Delivered': return 'bg-green-100 text-green-700';
    case 'Cancelled': return 'bg-red-100 text-red-700';
    default: return 'bg-gray-100 text-gray-700';
  }
}
