import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapPin, Star, ShoppingCart, Flag, ChevronLeft, ChevronRight } from 'lucide-react';
import TrustBadge from '../components/TrustBadge';
import useCartStore from '../store/useCartStore';
import useAuthStore from '../store/useAuthStore';
import { api } from '../utils/api';
import toast from 'react-hot-toast';

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [farmer, setFarmer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [flagReason, setFlagReason] = useState('');
  const [showFlag, setShowFlag] = useState(false);
  const addItem = useCartStore((s) => s.addItem);
  const user = useAuthStore((s) => s.user);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const data = await api.get(`/products/${id}`);
      setProduct(data);

      if (data.farmerId) {
        const farmerData = await api.get(`/farmers/${data.farmerId}`);
        setFarmer(farmerData);
      }
    } catch (err) {
      toast.error('Product not found');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    addItem(product, quantity);
    toast.success(`${product.name} added to cart`);
  };

  const handleFlag = async () => {
    if (!flagReason.trim()) return;
    try {
      await api.post(`/products/${id}/flag`, { reason: flagReason });
      toast.success('Product flagged. Thank you for your feedback.');
      setShowFlag(false);
      setFlagReason('');
      fetchProduct();
    } catch (err) {
      toast.error(err.message);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="aspect-square bg-gray-200 rounded-xl"></div>
            <div className="space-y-4">
              <div className="h-6 bg-gray-200 rounded w-2/3"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <p className="text-gray-500">Product not found</p>
      </div>
    );
  }

  const [selectedImage, setSelectedImage] = useState(0);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <Link to="/products" className="inline-flex items-center gap-1 text-gray-500 hover:text-forest-500 mb-6">
        <ChevronLeft className="w-4 h-4" /> Back to Products
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <div className="aspect-square bg-gray-100 rounded-xl overflow-hidden">
            {product.images && product.images[selectedImage] ? (
              <img src={product.images[selectedImage]} alt={product.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-300 text-6xl">🌾</div>
            )}
          </div>
          {product.images && product.images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-2">
              {product.images.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 ${
                    selectedImage === index ? 'border-forest-500' : 'border-gray-200'
                  }`}
                >
                  <img src={img} alt={`${product.name} ${index + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div>
            <div className="flex items-start justify-between gap-4">
              <h1 className="text-2xl font-bold">{product.name}</h1>
              <span className="text-2xl font-bold text-forest-600">₹{product.price}/{product.unit}</span>
            </div>
            <p className="text-gray-500 mt-1">{product.category}</p>
          </div>

          <div className="flex items-center gap-3 text-sm text-gray-500">
            <MapPin className="w-4 h-4" />
            <span>{product.village}, {product.taluka}</span>
          </div>

          {product.description && (
            <p className="text-gray-600">{product.description}</p>
          )}

          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-500">Stock:</span>
            {product.inStock ? (
              <span className="text-sm text-green-600 font-medium">In Stock ({product.quantity} {product.unit} available)</span>
            ) : (
              <span className="text-sm text-red-500 font-medium">Out of Stock</span>
            )}
          </div>

          {farmer && (
            <Link to={`/farmer/${farmer.uid}`} className="card flex items-center gap-4 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-forest-100 rounded-full flex items-center justify-center text-forest-600 font-bold text-lg">
                {farmer.name?.[0] || 'F'}
              </div>
              <div className="flex-1">
                <p className="font-semibold">{farmer.name}</p>
                <p className="text-sm text-gray-500">{farmer.village}, {farmer.taluka}</p>
              </div>
              <TrustBadge score={farmer.profile?.trustScore || 0} size="lg" />
            </Link>
          )}

          {product.inStock && (
            <div className="flex items-center gap-4">
              <div className="flex items-center border rounded-lg">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-3 py-2 text-gray-600 hover:bg-gray-50">-</button>
                <span className="px-4 py-2 font-medium">{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)} className="px-3 py-2 text-gray-600 hover:bg-gray-50">+</button>
              </div>
              <button onClick={handleAddToCart} className="btn-primary flex-1 flex items-center justify-center gap-2">
                <ShoppingCart className="w-5 h-5" /> Add to Cart
              </button>
            </div>
          )}

          {user?.role === 'buyer' && (
            <div className="pt-4 border-t">
              {showFlag ? (
                <div className="space-y-3">
                  <input
                    type="text"
                    value={flagReason}
                    onChange={(e) => setFlagReason(e.target.value)}
                    placeholder="Why are you flagging this product?"
                    className="input-field text-sm"
                  />
                  <div className="flex gap-2">
                    <button onClick={handleFlag} className="btn-primary text-sm py-2">Submit Flag</button>
                    <button onClick={() => setShowFlag(false)} className="btn-outline text-sm py-2">Cancel</button>
                  </div>
                </div>
              ) : (
                <button onClick={() => setShowFlag(true)} className="text-sm text-gray-400 hover:text-red-500 flex items-center gap-1">
                  <Flag className="w-4 h-4" /> Report this product
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
