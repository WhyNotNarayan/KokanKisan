import { useState, useEffect } from 'react';
import useAuthStore from '../../store/useAuthStore';
import { api } from '../../utils/api';
import toast from 'react-hot-toast';

const STATUS_OPTIONS = ['Confirmed', 'Packed', 'Dispatched', 'Delivered', 'Cancelled'];

export default function Orders() {
  const user = useAuthStore((s) => s.user);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const data = await api.get(`/orders/farmer/${user.uid}`);
      setOrders(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (orderId, status) => {
    try {
      await api.put(`/orders/${orderId}/status`, { status });
      toast.success('Order status updated');
      fetchOrders();
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Order Management</h1>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="card animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      ) : orders.length === 0 ? (
        <p className="text-gray-400 text-center py-16">No orders yet</p>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.orderId} className="card">
              <div className="flex items-start justify-between gap-4 mb-3">
                <div>
                  <p className="font-semibold">{order.productName}</p>
                  <p className="text-sm text-gray-500">
                    Qty: {order.quantity} · ₹{order.totalAmount} · {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                  {order.status}
                </span>
              </div>

              {order.status !== 'Delivered' && order.status !== 'Cancelled' && (
                <div className="flex flex-wrap gap-2 pt-3 border-t">
                  {STATUS_OPTIONS.filter((s) => s !== order.status).map((status) => (
                    <button
                      key={status}
                      onClick={() => updateStatus(order.orderId, status)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${status === 'Cancelled' ? 'border-red-200 text-red-600 hover:bg-red-50' : 'border-gray-200 hover:bg-gray-50'}`}
                    >
                      Mark as {status}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
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
