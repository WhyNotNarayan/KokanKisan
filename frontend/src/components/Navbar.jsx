import { Link, useNavigate } from 'react-router-dom';
import { Leaf, ShoppingCart, User, LogOut, Menu, X } from 'lucide-react';
import { useState } from 'react';
import useAuthStore from '../store/useAuthStore';
import useCartStore from '../store/useCartStore';

export default function Navbar() {
  const { user, logout } = useAuthStore();
  const cartCount = useCartStore((s) => s.getItemCount());
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMenuOpen(false);
  };

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <Leaf className="w-8 h-8 text-forest-500" />
            <span className="text-xl font-bold text-forest-700">KokanKisan</span>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            <Link to="/products" className="text-gray-600 hover:text-forest-500 font-medium">Products</Link>
            {user?.role === 'buyer' && (
              <Link to="/buyer/cart" className="relative text-gray-600 hover:text-forest-500">
                <ShoppingCart className="w-5 h-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-forest-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Link>
            )}
            {user ? (
              <div className="flex items-center gap-4">
                <Link to={getDashPath(user.role)} className="text-gray-600 hover:text-forest-500 font-medium">
                  Dashboard
                </Link>
                <button onClick={handleLogout} className="text-gray-500 hover:text-red-500">
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <Link to="/login" className="btn-primary text-sm">Login</Link>
            )}
          </div>

          <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden border-t bg-white px-4 py-4 space-y-3">
          <Link to="/products" onClick={() => setMenuOpen(false)} className="block text-gray-600 hover:text-forest-500">Products</Link>
          {user?.role === 'buyer' && (
            <Link to="/buyer/cart" onClick={() => setMenuOpen(false)} className="block text-gray-600 hover:text-forest-500">
              Cart ({cartCount})
            </Link>
          )}
          {user ? (
            <>
              <Link to={getDashPath(user.role)} onClick={() => setMenuOpen(false)} className="block text-gray-600 hover:text-forest-500">Dashboard</Link>
              <button onClick={handleLogout} className="block text-red-500">Logout</button>
            </>
          ) : (
            <Link to="/login" onClick={() => setMenuOpen(false)} className="block text-forest-500 font-semibold">Login</Link>
          )}
        </div>
      )}
    </nav>
  );
}

function getDashPath(role) {
  switch (role) {
    case 'farmer': return '/farmer';
    case 'admin': return '/admin';
    default: return '/buyer';
  }
}
