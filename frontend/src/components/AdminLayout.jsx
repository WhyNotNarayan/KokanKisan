import { NavLink, Outlet } from 'react-router-dom';
import { LayoutDashboard, UserCheck, Flag, BookOpen, Leaf, Calendar, LogOut } from 'lucide-react';
import useAuthStore from '../store/useAuthStore';
import { useNavigate } from 'react-router-dom';

const navItems = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/farmers', label: 'Farmer Approval', icon: UserCheck },
  { to: '/admin/flags', label: 'Flagged Listings', icon: Flag },
  { to: '/admin/blogs', label: 'Culture Hub — Blogs', icon: BookOpen },
  { to: '/admin/green-reports', label: 'Green Kokan — Reports', icon: Leaf },
  { to: '/admin/calendar', label: 'Festival Calendar', icon: Calendar },
];

export default function AdminLayout() {
  const { logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen flex bg-cream-50">
      <aside className="w-64 bg-white border-r border-gray-100 sticky top-0 h-screen flex flex-col">
        <div className="p-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <Leaf className="w-6 h-6 text-forest-500" />
            <span className="font-bold text-forest-700">KokanKisan</span>
          </div>
          <p className="text-xs text-gray-400 mt-1">Admin Panel</p>
        </div>

        <nav className="flex-1 p-3 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive ? 'bg-forest-100 text-forest-700' : 'text-gray-600 hover:bg-gray-50'
                }`
              }
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="p-3 border-t border-gray-100">
          <button onClick={handleLogout} className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-red-500 hover:bg-red-50 w-full">
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-auto p-8">
        <Outlet />
      </main>
    </div>
  );
}
