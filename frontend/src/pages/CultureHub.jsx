import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Share2, CheckCircle, XCircle } from 'lucide-react';
import { api } from '../utils/api';
import toast from 'react-hot-toast';

export default function CultureHub() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const data = await api.get('/culture/blogs');
      setBlogs(data);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const share = (blog) => {
    const text = `Check out ${blog.title} on KokanKisan Culture Hub! ${window.location.origin}/culture/${blog.blogId}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-forest-600">Kokan Culture Hub</h1>
        <p className="text-gray-500 mt-2">Celebrate Kokan's festivals, traditional foods, and connect with farm-fresh ingredients</p>
      </div>

      {loading ? (
        <p className="text-center text-gray-400">Loading...</p>
      ) : blogs.length === 0 ? (
        <p className="text-center text-gray-400">No festival blogs published yet.</p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogs.map((blog) => (
            <div key={blog.blogId} className="card hover:shadow-md transition-shadow">
              {blog.images?.[0] ? (
                <img src={blog.images[0]} alt={blog.title} className="w-full h-40 object-cover rounded-lg mb-3" />
              ) : (
                <div className="w-full h-40 bg-forest-50 rounded-lg mb-3 flex items-center justify-center text-forest-300 text-4xl">🪔</div>
              )}
              <h3 className="font-semibold text-lg">{blog.title}</h3>
              <p className="text-sm text-gray-500 mb-2">{blog.festival}</p>

              {blog.inventoryStatus?.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-3">
                  {blog.inventoryStatus.slice(0, 4).map((inv, i) => (
                    <span key={i} className="text-[10px] flex items-center gap-1 bg-gray-50 px-1.5 py-0.5 rounded">
                      {inv.available ? <CheckCircle className="w-3 h-3 text-green-500" /> : <XCircle className="w-3 h-3 text-red-500" />}
                      {inv.ingredient}
                    </span>
                  ))}
                </div>
              )}

              <div className="flex items-center gap-2">
                <Link to={`/culture/${blog.blogId}`} className="btn-primary text-sm flex items-center gap-1 flex-1 justify-center">
                  <BookOpen className="w-4 h-4" /> Read
                </Link>
                <button onClick={() => share(blog)} className="btn-outline text-sm p-2" title="Share on WhatsApp">
                  <Share2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
