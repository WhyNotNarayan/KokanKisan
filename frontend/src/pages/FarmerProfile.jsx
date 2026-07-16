import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapPin, Star, ChevronLeft } from 'lucide-react';
import TrustBadge from '../components/TrustBadge';
import ProductCard from '../components/ProductCard';
import { api } from '../utils/api';

export default function FarmerProfile() {
  const { id } = useParams();
  const [farmer, setFarmer] = useState(null);
  const [products, setProducts] = useState([]);
  const [reviews, setReviews] = useState({ reviews: [], avgRating: 0, count: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFarmer();
  }, [id]);

  const fetchFarmer = async () => {
    try {
      const farmerData = await api.get(`/farmers/${id}`);
      setFarmer(farmerData);

      const productData = await api.get(`/products?taluka=${farmerData.taluka || ''}`);
      const farmerProducts = (productData.products || []).filter((p) => p.farmerId === id);
      setProducts(farmerProducts);

      const reviewData = await api.get(`/reviews/farmer/${id}`);
      setReviews(reviewData);
    } catch (err) {
      console.error('Failed to fetch farmer:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="h-32 bg-gray-200 rounded-xl"></div>
        </div>
      </div>
    );
  }

  if (!farmer) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <p className="text-gray-500">Farmer not found</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <Link to="/products" className="inline-flex items-center gap-1 text-gray-500 hover:text-forest-500 mb-6">
        <ChevronLeft className="w-4 h-4" /> Back
      </Link>

      <div className="card mb-8">
        <div className="flex flex-col md:flex-row items-start gap-6">
          <div className="w-20 h-20 bg-forest-100 rounded-full flex items-center justify-center text-forest-600 font-bold text-3xl">
            {farmer.name?.[0] || 'F'}
          </div>
          <div className="flex-1">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold">{farmer.name}</h1>
                <div className="flex items-center gap-2 text-gray-500 mt-1">
                  <MapPin className="w-4 h-4" />
                  <span>{farmer.village}, {farmer.taluka}</span>
                </div>
              </div>
              <TrustBadge score={farmer.profile?.trustScore || 0} size="lg" />
            </div>

            {farmer.profile?.farmDescription && (
              <p className="text-gray-600 mt-4">{farmer.profile.farmDescription}</p>
            )}

            <div className="grid grid-cols-3 gap-4 mt-6">
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <p className="text-2xl font-bold text-forest-600">{reviews.count}</p>
                <p className="text-xs text-gray-500">Reviews</p>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <p className="text-2xl font-bold text-forest-600">{reviews.avgRating || '—'}</p>
                <p className="text-xs text-gray-500">Avg Rating</p>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <p className="text-2xl font-bold text-forest-600">{farmer.profile?.totalSales || 0}</p>
                <p className="text-xs text-gray-500">Total Sales</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-bold mb-4">Products by {farmer.name}</h2>
        {products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <ProductCard key={product.productId} product={product} />
            ))}
          </div>
        ) : (
          <p className="text-gray-400">No products listed yet</p>
        )}
      </div>

      {reviews.reviews.length > 0 && (
        <div>
          <h2 className="text-xl font-bold mb-4">Reviews</h2>
          <div className="space-y-4">
            {reviews.reviews.map((review) => (
              <div key={review.reviewId} className="card">
                <div className="flex items-center gap-1 mb-2">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} className={`w-4 h-4 ${s <= review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
                  ))}
                </div>
                {review.comment && <p className="text-gray-600 text-sm">{review.comment}</p>}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
