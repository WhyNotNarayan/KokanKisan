import { Link } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';
import useCartStore from '../../store/useCartStore';

export default function Cart() {
  const { items, removeItem, updateQuantity, getTotal } = useCartStore();

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h2 className="text-xl font-bold mb-2">Your cart is empty</h2>
        <p className="text-gray-500 mb-6">Browse products and add them to your cart</p>
        <Link to="/products" className="btn-primary">Browse Products</Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Shopping Cart</h1>

      <div className="space-y-4 mb-8">
        {items.map((item) => (
          <div key={item.productId} className="card flex items-center gap-4">
            <div className="w-20 h-20 bg-gray-100 rounded-lg flex-shrink-0 overflow-hidden">
              {item.images && item.images[0] ? (
                <img src={item.images[0]} alt={item.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400 text-2xl">🌾</div>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <h3 className="font-semibold truncate">{item.name}</h3>
              <p className="text-sm text-gray-500">{item.category} · {item.village}</p>
              <p className="text-forest-600 font-bold mt-1">₹{item.price}/{item.unit}</p>
            </div>

            <div className="flex items-center gap-2">
              <button onClick={() => updateQuantity(item.productId, item.quantity - 1)} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200">
                <Minus className="w-4 h-4" />
              </button>
              <span className="w-8 text-center font-medium">{item.quantity}</span>
              <button onClick={() => updateQuantity(item.productId, item.quantity + 1)} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200">
                <Plus className="w-4 h-4" />
              </button>
            </div>

            <div className="text-right">
              <p className="font-bold">₹{item.price * item.quantity}</p>
              <button onClick={() => removeItem(item.productId)} className="text-red-400 hover:text-red-600 mt-1">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="card">
        <div className="flex items-center justify-between text-lg mb-4">
          <span className="font-medium">Total</span>
          <span className="font-bold text-xl">₹{getTotal()}</span>
        </div>
        <Link to="/buyer/checkout" className="btn-primary w-full block text-center">Proceed to Checkout</Link>
      </div>
    </div>
  );
}
