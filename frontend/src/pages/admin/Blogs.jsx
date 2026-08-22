import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { api } from '../../utils/api';
import toast from 'react-hot-toast';

export default function Blogs() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchBlogs(); }, []);

  const fetchBlogs = async () => {
    try {
      const data = await api.get('/culture/admin/blogs');
      setBlogs(data);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const deleteBlog = async (id) => {
    if (!confirm('Delete this blog?')) return;
    try {
      await api.delete(`/culture/blogs/${id}`);
      toast.success('Deleted');
      fetchBlogs();
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Culture Hub — Festival Blogs</h1>
        <Link to="/admin/blogs/new" className="btn-primary flex items-center gap-1"><Plus className="w-4 h-4" /> New Blog</Link>
      </div>

      {loading ? (
        <p className="text-gray-400">Loading...</p>
      ) : blogs.length === 0 ? (
        <p className="text-gray-400">No blogs yet.</p>
      ) : (
        <div className="space-y-3">
          {blogs.map((b) => (
            <div key={b.blogId} className="card flex items-center justify-between">
              <div>
                <h3 className="font-semibold">{b.title}</h3>
                <p className="text-xs text-gray-400">{b.festival} · {b.status}</p>
              </div>
              <div className="flex gap-2">
                <Link to={`/admin/blogs/${b.blogId}`} className="p-2 hover:bg-gray-100 rounded-lg"><Pencil className="w-4 h-4" /></Link>
                <button onClick={() => deleteBlog(b.blogId)} className="p-2 hover:bg-red-50 text-red-500 rounded-lg"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
