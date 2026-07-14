import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, DollarSign, Star, Plus, Video, ShoppingBag } from 'lucide-react';
import useAuthStore from '../../store/useAuthStore';
import TrustBadge from '../../components/TrustBadge';
import { api } from '../../utils/api';

export default function FarmerDashboard() {
  const user = useAuthStore((s) => s.user);
  const [stats, setStats] = useState({ products: 0, orders: 0, earnings: 0 });
  const [trustData, setTrustData] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

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

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Farmer Dashboard</h1>
        <Link to="/farmer/add-product" className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add Product
        </Link>
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
