import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, CheckCircle, XCircle, Share2, ArrowLeft } from 'lucide-react';
import { api } from '../utils/api';
import toast from 'react-hot-toast';

export default function FestivalDetail() {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchBlog(); }, [id]);

  const fetchBlog = async () => {
    try {
      const data = await api.get(`/culture/blogs/${id}`);
      setBlog(data);
    } catch (err) {
      toast.error('Blog not found');
    } finally {
      setLoading(false);
    }
  };

  const share = () => {
    const text = `Check out ${blog.title} on KokanKisan Culture Hub! ${window.location.href}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  if (loading) return <div className="max-w-3xl mx-auto px-4 py-16 text-center text-gray-400">Loading...</div>;
  if (!blog) return <div className="max-w-3xl mx-auto px-4 py-16 text-center text-gray-500">Blog not found</div>;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <Link to="/culture" className="inline-flex items-center gap-1 text-gray-500 hover:text-forest-500 mb-4">
        <ArrowLeft className="w-4 h-4" /> Back to Culture Hub
      </Link>

      {blog.images?.[0] && <img src={blog.images[0]} alt={blog.title} className="w-full h-60 object-cover rounded-xl mb-6" />}

      <h1 className="text-3xl font-bold text-forest-600">{blog.title}</h1>
      {blog.festivalDate && (
        <p className="text-gray-400 flex items-center gap-1 mt-1"><Calendar className="w-4 h-4" /> {new Date(blog.festivalDate).toLocaleDateString()}</p>
      )}

      <div className="space-y-6 mt-8">
        <Section title="📿 What is this festival?" body={blog.sections?.whatIs} />
        <Section title="🍲 Why is traditional food prepared?" body={blog.sections?.whyTraditionalFood} />
        <Section title="💚 Why is it healthy?" body={blog.sections?.whyHealthy} />
        <Section title="🌾 What ingredients are required?" body={blog.sections?.ingredients} />
      </div>

      {blog.inventoryStatus?.length > 0 && (
        <div className="card mt-8">
          <h3 className="font-semibold mb-3">Available from Kokan Farmers</h3>
          <div className="space-y-2">
            {blog.inventoryStatus.map((inv, i) => (
              <div key={i} className="flex items-center gap-2 text-sm">
                {inv.available ? <CheckCircle className="w-4 h-4 text-green-500" /> : <XCircle className="w-4 h-4 text-red-500" />}
                <span>{inv.ingredient}</span>
                {inv.available && <Link to="/products" className="text-forest-500 text-xs">Shop →</Link>}
                {!inv.available && <span className="text-xs text-red-400">Not available now</span>}
              </div>
            ))}
          </div>
        </div>
      )}

      {blog.videoUrls?.[0] && (
        <div className="mt-8">
          <h3 className="font-semibold mb-2">Watch</h3>
          <a href={blog.videoUrls[0]} target="_blank" rel="noreferrer" className="text-forest-500 underline">Open video</a>
        </div>
      )}

      <div className="mt-8 text-center">
        <button onClick={share} className="btn-primary flex items-center gap-2 mx-auto">
          <Share2 className="w-4 h-4" /> Share on WhatsApp
        </button>
      </div>
    </div>
  );
}

function Section({ title, body }) {
  if (!body) return null;
  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-800 mb-2">{title}</h2>
      <p className="text-gray-600 whitespace-pre-line leading-relaxed">{body}</p>
    </div>
  );
}
