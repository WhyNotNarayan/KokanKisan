import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Filter } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { api } from '../utils/api';

const CATEGORIES = ['All', 'Rice & Grains', 'Vegetables', 'Fruits', 'Spices', 'Coconut Products', 'Fish & Seafood', 'Pickles & Homemade'];
const TALUKAS = ['All', 'Sindhudurg', 'Malvan', 'Kankavli', 'Sawantwadi', 'Vengurla', 'Devgad', 'Ratnagiri', 'Chiplun', 'Rajapur', 'Dapoli', 'Khed', 'Guhagar', 'Alibag', 'Panvel', 'Mahad'];

export default function BrowseProducts() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [taluka, setTaluka] = useState(searchParams.get('taluka') || 'All');
  const [category, setCategory] = useState(searchParams.get('category') || 'All');
  const [search, setSearch] = useState(searchParams.get('search') || '');

  useEffect(() => {
    fetchProducts();
  }, [taluka, category]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (taluka !== 'All') params.set('taluka', taluka);
      if (category !== 'All') params.set('category', category);
      if (search) params.set('search', search);

      const data = await api.get(`/products?${params.toString()}`);
      setProducts(data.products || []);
    } catch (err) {
      console.error('Failed to fetch products:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchProducts();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Browse Products</h1>
        <p className="text-gray-500">Fresh, natural produce from Kokan's farmers</p>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <form onSubmit={handleSearch} className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products..."
            className="input-field pl-11"
          />
        </form>
      </div>

      <div className="mb-6">
        <h3 className="text-sm font-medium text-gray-700 mb-2">Zone / Taluka</h3>
        <div className="flex flex-wrap gap-2">
          {TALUKAS.map((t) => (
            <button
              key={t}
              onClick={() => setTaluka(t)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${taluka === t ? 'bg-forest-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-8">
        <h3 className="text-sm font-medium text-gray-700 mb-2">Category</h3>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${category === c ? 'bg-soil-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="card animate-pulse">
              <div className="aspect-square bg-gray-200 rounded-lg mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-gray-400 text-lg">No products found</p>
          <p className="text-gray-400 text-sm mt-1">Try changing filters or search terms</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <ProductCard key={product.productId} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
