import { Leaf } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-forest-700 text-white">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Leaf className="w-6 h-6" />
              <span className="text-lg font-bold">KokanKisan</span>
            </div>
            <p className="text-forest-200 text-sm">
              Pure crops from Kokan's soil, straight to your door.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-3">Marketplace</h3>
            <div className="space-y-2 text-sm text-forest-200">
              <Link to="/products" className="block hover:text-white">Browse Products</Link>
              <Link to="/products?category=Fruits" className="block hover:text-white">Fruits</Link>
              <Link to="/products?category=Vegetables" className="block hover:text-white">Vegetables</Link>
            </div>
          </div>
          <div>
            <h3 className="font-semibold mb-3">For Farmers</h3>
            <div className="space-y-2 text-sm text-forest-200">
              <Link to="/register" className="block hover:text-white">Register as Farmer</Link>
              <Link to="/farmer" className="block hover:text-white">Farmer Dashboard</Link>
            </div>
          </div>
          <div>
            <h3 className="font-semibold mb-3">Connect</h3>
            <div className="space-y-2 text-sm text-forest-200">
              <p>Supporting Kokan's natural farmers</p>
              <p>Sindhudurg, Ratnagiri, Raigad</p>
            </div>
          </div>
        </div>
        <div className="border-t border-forest-600 mt-8 pt-8 text-center text-sm text-forest-300">
          &copy; {new Date().getFullYear()} KokanKisan. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
