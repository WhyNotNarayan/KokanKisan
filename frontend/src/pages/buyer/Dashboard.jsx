import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, ShoppingCart, Clock, Star } from 'lucide-react';
import useAuthStore from '../../store/useAuthStore';
import { api } from '../../utils/api';

export default function BuyerDashboard() {
  const user = useAuthStore((s) => s.user);
  const [stats, setStats] = useState({ orders: 0, pending: 0, delivered: 0 });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const orders = await api.get(`/orders/buyer/${user.uid}`);
      setRecentOrders(orders.slice(0, 5));
      setStats({
        orders: orders.length,
        pending: orders.filter((o) => o.status !== 'Delivered').length,
        delivered: orders.filter((o) => o.status === 'Delivered').length,
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Welcome, {user.name}!</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="card flex items-center gap-4">
          <div className="w-12 h-12 bg-forest-100 rounded-full flex items-center justify-center">
            <Package className="w-6 h-6 text-forest-500" />
          </div>
          <div>
            <p className="text-2xl font-bold">{stats.orders}</p>
            <p className="text-sm text-gray-500">Total Orders</p>
          </div>
        </div>
        <div className="card flex items-center gap-4">
          <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center">
            <Clock className="w-6 h-6 text-amber-500" />
          </div>
          <div>
            <p className="text-2xl font-bold">{stats.pending}</p>
            <p className="text-sm text-gray-500">Pending</p>
          </div>
        </div>
        <div className="card flex items-center gap-4">
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
            <Star className="w-6 h-6 text-green-500" />
          </div>
          <div>
            <p className="text-2xl font-bold">{stats.delivered}</p>
            <p className="text-sm text-gray-500">Delivered</p>
          </div>
        </div>
      </div>

      <div className="flex gap-4 mb-8">
        <Link to="/products" className="btn-primary">Browse Products</Link>
        <Link to="/buyer/orders" className="btn-outline">View All Orders</Link>
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-4">Recent Orders</h2>
        {recentOrders.length > 0 ? (
          <div className="space-y-3">
            {recentOrders.map((order) => (
              <Link key={order.orderId} to={`/buyer/orders/${order.orderId}`} className="card flex items-center justify-between hover:shadow-md transition-shadow">
                <div>
                  <p className="font-medium">{order.productName}</p>
                  <p className="text-sm text-gray-500">₹{order.totalAmount} · {order.quantity} units</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                  {order.status}
                </span>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-gray-400">No orders yet. Start shopping!</p>
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
