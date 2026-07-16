import { Link } from 'react-router-dom';
import { MapPin, Star } from 'lucide-react';
import TrustBadge from './TrustBadge';
import useCartStore from '../store/useCartStore';
import toast from 'react-hot-toast';

export default function ProductCard({ product }) {
  const addItem = useCartStore((s) => s.addItem);

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product);
    toast.success(`${product.name} added to cart`);
  };

  return (
    <Link to={`/products/${product.productId}`} className="card hover:shadow-md transition-shadow group">
      <div className="aspect-square bg-gray-100 rounded-lg mb-4 overflow-hidden">
        {product.images && product.images[0] ? (
          <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400 text-4xl">
            🌾
          </div>
        )}
      </div>

      <div className="space-y-2">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-gray-800 group-hover:text-forest-500 transition-colors">{product.name}</h3>
          <span className="text-lg font-bold text-forest-600 whitespace-nowrap">₹{product.price}</span>
        </div>

        <p className="text-sm text-gray-500">{product.category} · {product.unit}</p>

        <div className="flex items-center gap-2 text-sm text-gray-500">
          <MapPin className="w-3.5 h-3.5" />
          <span>{product.village}, {product.taluka}</span>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-gray-50">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-forest-100 rounded-full flex items-center justify-center text-xs text-forest-600 font-medium">
              {product.farmerName?.[0] || 'F'}
            </div>
            <span className="text-xs text-gray-500">{product.farmerName || 'Farmer'}</span>
          </div>
          <TrustBadge score={product.trustScore || 0} />
        </div>

        {product.inStock !== false && (
          <button
            onClick={handleAddToCart}
            className="w-full mt-3 bg-forest-500 text-white py-2 rounded-lg text-sm font-medium hover:bg-forest-600 transition-colors"
          >
            Add to Cart
          </button>
        )}
        {product.inStock === false && (
          <span className="block w-full mt-3 bg-gray-100 text-gray-400 py-2 rounded-lg text-sm font-medium text-center">
            Out of Stock
          </span>
        )}
      </div>
    </Link>
  );
}
