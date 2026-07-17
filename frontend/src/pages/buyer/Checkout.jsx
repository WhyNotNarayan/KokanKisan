import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, Truck, Store, Users } from 'lucide-react';
import useCartStore from '../../store/useCartStore';
import useAuthStore from '../../store/useAuthStore';
import { api } from '../../utils/api';
import toast from 'react-hot-toast';

const DELIVERY_METHODS = [
  { id: 'pickup', label: 'Pickup Point', desc: 'Collect from nearest bus stop or kirana partner', icon: Store },
  { id: 'st_bus', label: 'ST Bus Parcel', desc: 'Sent via ST bus conductor', icon: Truck },
  { id: 'courier', label: 'Courier', desc: 'India Post / Delhivery (+₹50)', icon: CreditCard },
  { id: 'community', label: 'Community Carrier', desc: 'Local volunteer delivery', icon: Users },
];

export default function Checkout() {
  const { items, getTotal, clearCart } = useCartStore();
  const user = useAuthStore((s) => s.user);
  const navigate = useNavigate();
  const [deliveryMethod, setDeliveryMethod] = useState('pickup');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [loading, setLoading] = useState(false);

  const total = getTotal();
  const convenienceFee = total > 200 ? 20 : 0;
  const courierFee = deliveryMethod === 'courier' ? 50 : 0;
  const grandTotal = total + convenienceFee + courierFee;

  const handlePlaceOrder = async () => {
    if (items.length === 0) return;
    setLoading(true);

    try {
      for (const item of items) {
        await api.post('/orders', {
          productId: item.productId,
          quantity: item.quantity,
          deliveryMethod,
          deliveryAddress,
        });
      }

      clearCart();
      toast.success('Orders placed successfully!');
      navigate('/buyer/orders');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    navigate('/buyer/cart');
    return null;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Checkout</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          <div className="card">
            <h2 className="font-semibold mb-4">Delivery Method</h2>
            <div className="space-y-3">
              {DELIVERY_METHODS.map((method) => (
                <label
                  key={method.id}
                  className={`flex items-center gap-4 p-4 rounded-lg border-2 cursor-pointer transition-colors ${deliveryMethod === method.id ? 'border-forest-500 bg-forest-50' : 'border-gray-200 hover:border-gray-300'}`}
                >
                  <input type="radio" name="delivery" value={method.id} checked={deliveryMethod === method.id} onChange={(e) => setDeliveryMethod(e.target.value)} className="text-forest-500" />
                  <method.icon className="w-5 h-5 text-forest-500" />
                  <div>
                    <p className="font-medium">{method.label}</p>
                    <p className="text-sm text-gray-500">{method.desc}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div className="card">
            <h2 className="font-semibold mb-4">Delivery Address</h2>
            <textarea
              value={deliveryAddress}
              onChange={(e) => setDeliveryAddress(e.target.value)}
              placeholder="Enter your full delivery address..."
              className="input-field h-24 resize-none"
            />
          </div>

          <div className="card">
            <h2 className="font-semibold mb-4">Order Items</h2>
            <div className="space-y-3">
              {items.map((item) => (
                <div key={item.productId} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-gray-500">{item.quantity} × ₹{item.price}</p>
                  </div>
                  <p className="font-bold">₹{item.price * item.quantity}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div>
          <div className="card sticky top-24">
            <h2 className="font-semibold mb-4">Order Summary</h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Subtotal</span>
                <span>₹{total}</span>
              </div>
              {convenienceFee > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Convenience Fee</span>
                  <span>₹{convenienceFee}</span>
                </div>
              )}
              {courierFee > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Courier Fee</span>
                  <span>₹{courierFee}</span>
                </div>
              )}
              <div className="border-t pt-3 flex justify-between text-lg font-bold">
                <span>Total</span>
                <span className="text-forest-600">₹{grandTotal}</span>
              </div>
            </div>
            <button onClick={handlePlaceOrder} className="btn-primary w-full mt-6" disabled={loading}>
              {loading ? 'Placing Orders...' : 'Place Order'}
            </button>
            <p className="text-xs text-gray-400 text-center mt-3">Payment will be handled separately</p>
          </div>
        </div>
      </div>
    </div>
  );
}
