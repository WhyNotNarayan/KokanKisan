import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ImagePlus, X, Upload } from 'lucide-react';
import useAuthStore from '../../store/useAuthStore';
import { api } from '../../utils/api';
import toast from 'react-hot-toast';

const CATEGORIES = ['Rice & Grains', 'Vegetables', 'Fruits', 'Spices', 'Coconut Products', 'Fish & Seafood', 'Pickles & Homemade', 'Other'];

export default function AddProduct() {
  const user = useAuthStore((s) => s.user);
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '', category: '', price: '', quantity: '', unit: 'kg', description: '', village: user.village || '', taluka: user.taluka || '',
  });
  const [images, setImages] = useState([]);
  const [imageUrls, setImageUrls] = useState(['']);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageUrlChange = (index, value) => {
    const newUrls = [...imageUrls];
    newUrls[index] = value;
    setImageUrls(newUrls);
  };

  const addImageUrlField = () => {
    if (imageUrls.length < 5) {
      setImageUrls([...imageUrls, '']);
    }
  };

  const removeImageUrlField = (index) => {
    if (imageUrls.length > 1) {
      const newUrls = imageUrls.filter((_, i) => i !== index);
      setImageUrls(newUrls);
    }
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    files.forEach(file => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (event) => {
          setImages(prev => [...prev, event.target.result]);
        };
        reader.readAsDataURL(file);
      } else {
        toast.error('Please upload only image files');
      }
    });
  };

  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const allImages = [...images, ...imageUrls.filter(url => url.trim() !== '')];
      await api.post('/products', {
        ...form,
        price: Number(form.price),
        quantity: Number(form.quantity),
        images: allImages,
      });
      toast.success('Product added!');
      navigate('/farmer/products');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Add New Product</h1>

      <form onSubmit={handleSubmit} className="card space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Product Name *</label>
          <input type="text" name="name" value={form.name} onChange={handleChange} placeholder="e.g., Organic Alphonso Mango" className="input-field" required />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Product Images</label>
          <p className="text-xs text-gray-500 mb-2">Add images to help customers see your product (max 5 images)</p>
          
          <div className="space-y-3">
            {images.length > 0 && (
              <div className="flex flex-wrap gap-3">
                {images.map((img, index) => (
                  <div key={index} className="relative w-24 h-24">
                    <img src={img} alt={`Preview ${index + 1}`} className="w-full h-full object-cover rounded-lg border border-gray-200" />
                    <button type="button" onClick={() => removeImage(index)} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600">
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {imageUrls.map((url, index) => (
              <div key={index} className="flex items-center gap-2">
                <input type="url" value={url} onChange={(e) => handleImageUrlChange(index, e.target.value)} placeholder="Paste image URL (e.g., https://example.com/image.jpg)" className="input-field flex-1" />
                {imageUrls.length > 1 && (
                  <button type="button" onClick={() => removeImageUrlField(index)} className="text-red-500 hover:text-red-600">
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>
            ))}

            {imageUrls.length < 5 && (
              <button type="button" onClick={addImageUrlField} className="text-sm text-forest-600 hover:text-forest-700 flex items-center gap-1">
                <ImagePlus className="w-4 h-4" /> Add another URL
              </button>
            )}

            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
              <label className="flex flex-col items-center gap-2 cursor-pointer">
                <Upload className="w-8 h-8 text-gray-400" />
                <span className="text-sm text-gray-500">Or upload from device (click to select)</span>
                <input type="file" multiple accept="image/*" onChange={handleFileUpload} className="hidden" />
              </label>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
          <select name="category" value={form.category} onChange={handleChange} className="input-field" required>
            <option value="">Select Category</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Price (₹) *</label>
            <input type="number" name="price" value={form.price} onChange={handleChange} placeholder="0" className="input-field" min="0" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Quantity *</label>
            <input type="number" name="quantity" value={form.quantity} onChange={handleChange} placeholder="0" className="input-field" min="0" required />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Unit</label>
          <select name="unit" value={form.unit} onChange={handleChange} className="input-field">
            <option value="kg">Kilogram (kg)</option>
            <option value="piece">Piece</option>
            <option value="dozen">Dozen</option>
            <option value="bundle">Bundle</option>
            <option value="litre">Litre</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea name="description" value={form.description} onChange={handleChange} placeholder="Describe your product — farming method, freshness, special qualities..." className="input-field h-24 resize-none" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Village *</label>
            <input type="text" name="village" value={form.village} onChange={handleChange} className="input-field" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Taluka *</label>
            <input type="text" name="taluka" value={form.taluka} onChange={handleChange} className="input-field" required />
          </div>
        </div>

        <button type="submit" className="btn-primary w-full" disabled={loading}>
          {loading ? 'Adding Product...' : 'Add Product'}
        </button>
      </form>
    </div>
  );
}
