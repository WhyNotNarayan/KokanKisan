import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Leaf, Plus, Calendar, AlertCircle, ArrowLeft } from 'lucide-react';
import { api } from '../../utils/api';
import toast from 'react-hot-toast';

export default function FarmerIngredientRequests() {
  const [missingIngredients, setMissingIngredients] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMissingIngredients();
  }, []);

  const fetchMissingIngredients = async () => {
    try {
      const data = await api.get('/culture/missing-ingredients');
      setMissingIngredients(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Link to="/farmer" className="inline-flex items-center gap-1 text-gray-500 hover:text-forest-500 mb-4">
        <ArrowLeft className="w-4 h-4" /> Back to Dashboard
      </Link>

      <div className="flex items-center gap-3 mb-6">
        <Leaf className="w-6 h-6 text-amber-500" />
        <h1 className="text-2xl font-bold">Festival Ingredient Requests</h1>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-amber-800">Earn Green Flags</p>
            <p className="text-sm text-amber-700">
              Supply these missing ingredients for festival blogs and earn a <strong>Green Flag</strong> (+2 trust score) per product!
            </p>
          </div>
        </div>
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
      ) : missingIngredients.length === 0 ? (
        <div className="text-center py-16">
          <Leaf className="w-16 h-16 text-green-300 mx-auto mb-4" />
          <p className="text-gray-500">All festival ingredients are available! Great work.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {missingIngredients.map((item, index) => (
            <div key={index} className="card">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Leaf className="w-5 h-5 text-green-500" />
                  <span className="font-semibold text-lg">{item.ingredient}</span>
                </div>
                <Link
                  to={`/farmer/add-product?name=${encodeURIComponent(item.ingredient)}`}
                  className="px-4 py-2 bg-forest-500 text-white rounded-lg text-sm font-medium hover:bg-forest-600 flex items-center gap-1"
                >
                  <Plus className="w-4 h-4" /> Add Product
                </Link>
              </div>

              <p className="text-sm text-gray-500 mb-2">Needed for:</p>
              <div className="space-y-2">
                {item.blogs.map((blog, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm bg-gray-50 rounded-lg p-2">
                    <Calendar className="w-4 h-4 text-forest-500" />
                    <span className="font-medium">{blog.festival}</span>
                    {blog.festivalDate && (
                      <span className="text-gray-400">
                        — {new Date(blog.festivalDate).toLocaleDateString('en-IN', { month: 'long', day: 'numeric', year: 'numeric' })}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
