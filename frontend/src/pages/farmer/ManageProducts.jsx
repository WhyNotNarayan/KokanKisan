import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Edit, Trash2, ToggleLeft, ToggleRight } from 'lucide-react';
import useAuthStore from '../../store/useAuthStore';
import { api } from '../../utils/api';
import toast from 'react-hot-toast';

export default function ManageProducts() {
  const user = useAuthStore((s) => s.user);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const data = await api.get(`/products`);
      setProducts(data.products?.filter((p) => p.farmerId === user.uid) || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const toggleStock = async (productId) => {
    try {
      await api.put(`/products/${productId}/stock`);
      toast.success('Stock status updated');
      fetchProducts();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const deleteProduct = async (productId) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    try {
      await api.delete(`/products/${productId}`);
      toast.success('Product deleted');
      fetchProducts();
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Manage Products</h1>
        <Link to="/farmer/add-product" className="btn-primary text-sm">Add New</Link>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="card animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-gray-400 mb-4">No products yet</p>
          <Link to="/farmer/add-product" className="btn-primary">Add Your First Product</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {products.map((product) => (
            <div key={product.productId} className="card flex items-center gap-4">
              <div className="w-16 h-16 bg-gray-100 rounded-lg flex-shrink-0 overflow-hidden">
                {product.images && product.images[0] ? (
                  <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400 text-xl">🌾</div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="font-semibold truncate">{product.name}</h3>
                <p className="text-sm text-gray-500">{product.category} · ₹{product.price}/{product.unit}</p>
                <p className="text-xs text-gray-400">Stock: {product.quantity} {product.unit}</p>
              </div>

              <div className="flex items-center gap-2">
                <button onClick={() => toggleStock(product.productId)} className="p-2 rounded-lg hover:bg-gray-100" title="Toggle stock">
                  {product.inStock ? (
                    <ToggleRight className="w-8 h-8 text-green-500" />
                  ) : (
                    <ToggleLeft className="w-8 h-8 text-gray-400" />
                  )}
                </button>
                <button onClick={() => deleteProduct(product.productId)} className="p-2 rounded-lg hover:bg-red-50 text-red-400 hover:text-red-600">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
