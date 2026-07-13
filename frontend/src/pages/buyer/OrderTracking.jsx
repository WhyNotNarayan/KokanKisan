import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronLeft, Package, CheckCircle } from 'lucide-react';
import { api } from '../../utils/api';

const STATUS_STEPS = ['Confirmed', 'Packed', 'Dispatched', 'Delivered'];

export default function OrderTracking() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const fetchOrder = async () => {
    try {
      const data = await api.get(`/orders/${id}`);
      setOrder(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="h-48 bg-gray-200 rounded-xl"></div>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <p className="text-gray-500">Order not found</p>
      </div>
    );
  }

  const currentStep = STATUS_STEPS.indexOf(order.status);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Link to="/buyer/orders" className="inline-flex items-center gap-1 text-gray-500 hover:text-forest-500 mb-6">
        <ChevronLeft className="w-4 h-4" /> Back to Orders
      </Link>

      <h1 className="text-2xl font-bold mb-6">Order Tracking</h1>

      <div className="card mb-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="text-sm text-gray-500">Order ID</p>
            <p className="font-mono text-sm">{order.orderId.slice(0, 8)}...</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">Order Date</p>
            <p className="text-sm">{new Date(order.createdAt).toLocaleDateString()}</p>
          </div>
        </div>

        <div className="flex items-center justify-between mb-4">
          {STATUS_STEPS.map((step, i) => (
            <div key={step} className="flex-1 flex flex-col items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${i <= currentStep ? 'bg-forest-500 text-white' : 'bg-gray-200 text-gray-400'}`}>
                {i <= currentStep ? <CheckCircle className="w-5 h-5" /> : <Package className="w-5 h-5" />}
              </div>
              <span className={`text-xs font-medium ${i <= currentStep ? 'text-forest-600' : 'text-gray-400'}`}>{step}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="font-semibold mb-3">Order Details</h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Product</span>
              <span>{order.productName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Quantity</span>
              <span>{order.quantity}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Price per unit</span>
              <span>₹{order.pricePerUnit}</span>
            </div>
            <div className="flex justify-between font-bold border-t pt-2">
              <span>Total</span>
              <span>₹{order.totalAmount}</span>
            </div>
          </div>
        </div>

        <div className="card">
          <h2 className="font-semibold mb-3">Delivery Info</h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Method</span>
              <span className="capitalize">{order.deliveryMethod?.replace('_', ' ')}</span>
            </div>
            {order.deliveryAddress && (
              <div>
                <span className="text-gray-500">Address</span>
                <p className="mt-1">{order.deliveryAddress}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {order.status === 'Delivered' && (
        <div className="mt-6 text-center">
          <Link to={`/buyer/review/${order.orderId}`} className="btn-primary">Write a Review</Link>
        </div>
      )}
    </div>
  );
}
