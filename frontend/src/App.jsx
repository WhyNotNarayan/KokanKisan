import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import useAuthStore from './store/useAuthStore';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import BrowseProducts from './pages/BrowseProducts';
import ProductDetail from './pages/ProductDetail';
import FarmerProfile from './pages/FarmerProfile';

import BuyerDashboard from './pages/buyer/Dashboard';
import Cart from './pages/buyer/Cart';
import Checkout from './pages/buyer/Checkout';
import OrderTracking from './pages/buyer/OrderTracking';
import OrderHistory from './pages/buyer/OrderHistory';
import WriteReview from './pages/buyer/WriteReview';

import FarmerDashboard from './pages/farmer/Dashboard';
import AddProduct from './pages/farmer/AddProduct';
import ManageProducts from './pages/farmer/ManageProducts';
import FarmerOrders from './pages/farmer/Orders';
import TrustScoreDetail from './pages/farmer/TrustScoreDetail';
import UploadVideo from './pages/farmer/UploadVideo';

import AdminDashboard from './pages/admin/Dashboard';
import FarmerApproval from './pages/admin/FarmerApproval';
import FlaggedListings from './pages/admin/FlaggedListings';
import Blogs from './pages/admin/Blogs';
import BlogEditor from './pages/admin/BlogEditor';
import GreenReports from './pages/admin/GreenReports';
import Calendar from './pages/admin/Calendar';

import CultureHub from './pages/CultureHub';
import FestivalDetail from './pages/FestivalDetail';
import GreenKokan from './pages/GreenKokan';

export default function App() {
  const user = useAuthStore((s) => s.user);

  return (
    <div className="min-h-screen flex flex-col bg-cream-50">
      <Toaster position="top-right" />
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={!user ? <Landing /> : <Navigate to={getDashboard(user.role)} />} />
          <Route path="/login" element={!user ? <Login /> : <Navigate to={getDashboard(user.role)} />} />
          <Route path="/register" element={!user ? <Register /> : <Navigate to={getDashboard(user.role)} />} />
          <Route path="/products" element={<BrowseProducts />} />
          <Route path="/products/:id" element={<ProductDetail />} />
          <Route path="/farmer/:id" element={<FarmerProfile />} />
          <Route path="/culture" element={<CultureHub />} />
          <Route path="/culture/:id" element={<FestivalDetail />} />
          <Route path="/green" element={<GreenKokan />} />

          <Route path="/buyer" element={<ProtectedRoute role="buyer"><BuyerDashboard /></ProtectedRoute>} />
          <Route path="/buyer/cart" element={<ProtectedRoute role="buyer"><Cart /></ProtectedRoute>} />
          <Route path="/buyer/checkout" element={<ProtectedRoute role="buyer"><Checkout /></ProtectedRoute>} />
          <Route path="/buyer/orders" element={<ProtectedRoute role="buyer"><OrderHistory /></ProtectedRoute>} />
          <Route path="/buyer/orders/:id" element={<ProtectedRoute role="buyer"><OrderTracking /></ProtectedRoute>} />
          <Route path="/buyer/review/:orderId" element={<ProtectedRoute role="buyer"><WriteReview /></ProtectedRoute>} />

          <Route path="/farmer" element={<ProtectedRoute role="farmer"><FarmerDashboard /></ProtectedRoute>} />
          <Route path="/farmer/add-product" element={<ProtectedRoute role="farmer"><AddProduct /></ProtectedRoute>} />
          <Route path="/farmer/products" element={<ProtectedRoute role="farmer"><ManageProducts /></ProtectedRoute>} />
          <Route path="/farmer/orders" element={<ProtectedRoute role="farmer"><FarmerOrders /></ProtectedRoute>} />
          <Route path="/farmer/trust-score" element={<ProtectedRoute role="farmer"><TrustScoreDetail /></ProtectedRoute>} />
          <Route path="/farmer/upload-video" element={<ProtectedRoute role="farmer"><UploadVideo /></ProtectedRoute>} />

          <Route path="/admin" element={<ProtectedRoute role="admin"><AdminDashboard /></ProtectedRoute>} />
          <Route path="/admin/farmers" element={<ProtectedRoute role="admin"><FarmerApproval /></ProtectedRoute>} />
          <Route path="/admin/flags" element={<ProtectedRoute role="admin"><FlaggedListings /></ProtectedRoute>} />
          <Route path="/admin/blogs" element={<ProtectedRoute role="admin"><Blogs /></ProtectedRoute>} />
          <Route path="/admin/blogs/new" element={<ProtectedRoute role="admin"><BlogEditor /></ProtectedRoute>} />
          <Route path="/admin/blogs/:id" element={<ProtectedRoute role="admin"><BlogEditor /></ProtectedRoute>} />
          <Route path="/admin/green-reports" element={<ProtectedRoute role="admin"><GreenReports /></ProtectedRoute>} />
          <Route path="/admin/calendar" element={<ProtectedRoute role="admin"><Calendar /></ProtectedRoute>} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

function getDashboard(role) {
  switch (role) {
    case 'farmer': return '/farmer';
    case 'admin': return '/admin';
    default: return '/buyer';
  }
}
