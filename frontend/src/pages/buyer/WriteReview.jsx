import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Star } from 'lucide-react';
import useAuthStore from '../../store/useAuthStore';
import { api } from '../../utils/api';
import toast from 'react-hot-toast';

export default function WriteReview() {
  const { orderId } = useParams();
  const user = useAuthStore((s) => s.user);
  const navigate = useNavigate();
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) {
      toast.error('Please select a rating');
      return;
    }

    setLoading(true);
    try {
      await api.post('/reviews', { orderId, rating, comment });
      toast.success('Review submitted!');
      navigate('/buyer/orders');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Write a Review</h1>

      <form onSubmit={handleSubmit} className="card space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHover(star)}
                onMouseLeave={() => setHover(0)}
                className="p-1"
              >
                <Star className={`w-8 h-8 ${(hover || rating) >= star ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Comment (Optional)</label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Share your experience with this product..."
            className="input-field h-32 resize-none"
          />
        </div>

        <button type="submit" className="btn-primary w-full" disabled={loading}>
          {loading ? 'Submitting...' : 'Submit Review'}
        </button>
      </form>
    </div>
  );
}
