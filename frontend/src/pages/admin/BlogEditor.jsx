import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Plus, Trash2, Save, Send, CheckCircle, XCircle } from 'lucide-react';
import { api } from '../../utils/api';
import toast from 'react-hot-toast';

export default function BlogEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [form, setForm] = useState({
    title: '', festival: '', festivalDate: '', status: 'draft',
    sections: { whatIs: '', whyTraditionalFood: '', whyHealthy: '', ingredients: '' },
    ingredientTags: [], images: [], videoUrls: [],
  });
  const [tagInput, setTagInput] = useState('');
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isEdit) fetchBlog();
  }, [id]);

  const fetchBlog = async () => {
    try {
      const blog = await api.get(`/culture/blogs/${id}`);
      setForm({
        title: blog.title || '', festival: blog.festival || '', festivalDate: blog.festivalDate ? blog.festivalDate.slice(0, 10) : '',
        status: blog.status || 'draft',
        sections: blog.sections || { whatIs: '', whyTraditionalFood: '', whyHealthy: '', ingredients: '' },
        ingredientTags: blog.ingredientTags || [], images: blog.images || [], videoUrls: blog.videoUrls || [],
      });
      setInventory(blog.inventoryStatus || []);
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('sections.')) {
      const key = name.split('.')[1];
      setForm({ ...form, sections: { ...form.sections, [key]: value } });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const addTag = () => {
    if (tagInput.trim() && !form.ingredientTags.includes(tagInput.trim())) {
      setForm({ ...form, ingredientTags: [...form.ingredientTags, tagInput.trim()] });
      setTagInput('');
    }
  };

  const removeTag = (tag) => {
    setForm({ ...form, ingredientTags: form.ingredientTags.filter((t) => t !== tag) });
  };

  const runInventoryCheck = async () => {
    setLoading(true);
    try {
      const result = await api.get(`/culture/inventory-check/${id}`);
      setInventory(result);
      toast.success('Inventory checked');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (publish) => {
    setLoading(true);
    try {
      const payload = { ...form, status: publish ? 'published' : 'draft' };
      if (isEdit) {
        await api.put(`/culture/blogs/${id}`, payload);
      } else {
        await api.post('/culture/blogs', payload);
      }
      toast.success(publish ? 'Blog published!' : 'Blog saved!');
      navigate('/admin/blogs');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">{isEdit ? 'Edit Festival Blog' : 'New Festival Blog'}</h1>

      <form className="card space-y-5" onSubmit={(e) => e.preventDefault()}>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Festival Title *</label>
            <input name="title" value={form.title} onChange={handleChange} className="input-field" placeholder="e.g., Nag Panchami" required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Festival Date</label>
            <input type="date" name="festivalDate" value={form.festivalDate} onChange={handleChange} className="input-field" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Festival Name</label>
          <input name="festival" value={form.festival} onChange={handleChange} className="input-field" placeholder="e.g., Nag Panchami" />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">1. What is the festival?</label>
          <textarea name="sections.whatIs" value={form.sections.whatIs} onChange={handleChange} className="input-field h-20 resize-none" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">2. Why is traditional food prepared?</label>
          <textarea name="sections.whyTraditionalFood" value={form.sections.whyTraditionalFood} onChange={handleChange} className="input-field h-20 resize-none" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">3. Why is it healthy?</label>
          <textarea name="sections.whyHealthy" value={form.sections.whyHealthy} onChange={handleChange} className="input-field h-20 resize-none" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">4. What ingredients are required?</label>
          <textarea name="sections.ingredients" value={form.sections.ingredients} onChange={handleChange} className="input-field h-20 resize-none" />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Ingredient Tags (for inventory auto-verify)</label>
          <div className="flex gap-2 mb-2">
            <input value={tagInput} onChange={(e) => setTagInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())} className="input-field flex-1" placeholder="e.g., mango, rice, coconut" />
            <button type="button" onClick={addTag} className="btn-outline flex items-center gap-1"><Plus className="w-4 h-4" /> Add</button>
          </div>
          <div className="flex flex-wrap gap-2">
            {form.ingredientTags.map((tag) => (
              <span key={tag} className="bg-forest-100 text-forest-700 px-2 py-1 rounded-full text-sm flex items-center gap-1">
                {tag}
                <button type="button" onClick={() => removeTag(tag)}><Trash2 className="w-3 h-3" /></button>
              </span>
            ))}
          </div>
        </div>

        {isEdit && (
          <div>
            <button type="button" onClick={runInventoryCheck} disabled={loading} className="btn-outline mb-3">Check Inventory Availability</button>
            {inventory.length > 0 && (
              <div className="space-y-1">
                {inventory.map((item, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm">
                    {item.available ? <CheckCircle className="w-4 h-4 text-green-500" /> : <XCircle className="w-4 h-4 text-red-500" />}
                    <span>{item.ingredient}</span>
                    <span className="text-xs text-gray-400">{item.available ? 'Available from farmer' : 'Not available'}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        <div className="flex gap-3 pt-2">
          <button type="button" onClick={() => handleSubmit(false)} disabled={loading} className="btn-outline flex items-center gap-1"><Save className="w-4 h-4" /> Save Draft</button>
          <button type="button" onClick={() => handleSubmit(true)} disabled={loading} className="btn-primary flex items-center gap-1"><Send className="w-4 h-4" /> Publish</button>
        </div>
      </form>
    </div>
  );
}
