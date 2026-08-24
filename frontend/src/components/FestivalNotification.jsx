import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Bell, X, BookOpen, Calendar } from 'lucide-react';
import { api } from '../utils/api';

export default function FestivalNotification() {
  const [upcomingFestivals, setUpcomingFestivals] = useState([]);
  const [show, setShow] = useState(false);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    checkUpcomingFestivals();
  }, []);

  const checkUpcomingFestivals = async () => {
    try {
      const blogs = await api.get('/culture/blogs');
      const now = new Date();
      const fourDaysLater = new Date(now.getTime() + 4 * 24 * 60 * 60 * 1000);

      const upcoming = blogs.filter((blog) => {
        if (!blog.festivalDate) return false;
        const festivalDate = new Date(blog.festivalDate);
        const dismissed = JSON.parse(localStorage.getItem('dismissedFestivals') || '[]');
        if (dismissed.includes(blog.blogId)) return false;
        return festivalDate >= now && festivalDate <= fourDaysLater;
      });

      if (upcoming.length > 0) {
        setUpcomingFestivals(upcoming);
        setShow(true);
      }
    } catch (err) {
      console.error('Failed to check upcoming festivals:', err);
    }
  };

  const dismiss = () => {
    const blog = upcomingFestivals[current];
    if (blog) {
      const dismissed = JSON.parse(localStorage.getItem('dismissedFestivals') || '[]');
      dismissed.push(blog.blogId);
      localStorage.setItem('dismissedFestivals', JSON.stringify(dismissed));
    }
    if (current < upcomingFestivals.length - 1) {
      setCurrent(current + 1);
    } else {
      setShow(false);
      setCurrent(0);
    }
  };

  const dismissAll = () => {
    const dismissed = JSON.parse(localStorage.getItem('dismissedFestivals') || '[]');
    upcomingFestivals.forEach((blog) => {
      if (!dismissed.includes(blog.blogId)) {
        dismissed.push(blog.blogId);
      }
    });
    localStorage.setItem('dismissedFestivals', JSON.stringify(dismissed));
    setShow(false);
    setCurrent(0);
  };

  if (!show || upcomingFestivals.length === 0) return null;

  const blog = upcomingFestivals[current];
  const festivalDate = new Date(blog.festivalDate);
  const now = new Date();
  const daysLeft = Math.ceil((festivalDate - now) / (1000 * 60 * 60 * 24));

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full overflow-hidden shadow-2xl">
        <div className="bg-gradient-to-r from-forest-500 to-forest-600 p-6 text-white relative">
          <button onClick={dismissAll} className="absolute top-3 right-3 p-1 hover:bg-white/20 rounded-full">
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <Bell className="w-5 h-5" />
            </div>
            <span className="text-sm font-medium opacity-90">Upcoming Festival</span>
          </div>
          <h2 className="text-2xl font-bold">{blog.title}</h2>
        </div>

        <div className="p-6">
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
            <Calendar className="w-4 h-4" />
            <span>{festivalDate.toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
            <span className={`ml-auto px-2 py-0.5 rounded-full text-xs font-medium ${daysLeft <= 1 ? 'bg-red-100 text-red-600' : 'bg-amber-100 text-amber-600'}`}>
              {daysLeft === 0 ? 'Today!' : daysLeft === 1 ? 'Tomorrow!' : `${daysLeft} days left`}
            </span>
          </div>

          <p className="text-gray-600 text-sm mb-6">
            Prepare for {blog.festival} with farm-fresh ingredients from Kokan farmers!
          </p>

          <div className="flex gap-3">
            <Link
              to={`/culture/${blog.blogId}`}
              onClick={dismiss}
              className="flex-1 py-3 bg-forest-500 text-white rounded-lg font-medium hover:bg-forest-600 flex items-center justify-center gap-2"
            >
              <BookOpen className="w-4 h-4" /> Read Blog
            </Link>
            <button
              onClick={dismiss}
              className="px-4 py-3 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50"
            >
              {current < upcomingFestivals.length - 1 ? 'Next' : 'Dismiss'}
            </button>
          </div>

          {upcomingFestivals.length > 1 && (
            <p className="text-center text-xs text-gray-400 mt-3">
              {current + 1} of {upcomingFestivals.length} upcoming festivals
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
