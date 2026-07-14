import { Link } from 'react-router-dom';
import { ArrowRight, Leaf, Shield, Truck, Users } from 'lucide-react';

export default function Landing() {
  return (
    <div>
      <section className="bg-gradient-to-br from-forest-500 to-forest-700 text-white">
        <div className="max-w-7xl mx-auto px-4 py-20 md:py-32">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-6">
              Pure crops from Kokan's soil, straight to your door.
            </h1>
            <p className="text-lg md:text-xl text-forest-100 mb-8">
              A community marketplace connecting natural farmers of Sindhudurg, Ratnagiri, and Raigad directly to you. No middlemen. No chemicals. Just trust.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/products" className="bg-white text-forest-600 px-8 py-3 rounded-lg font-semibold hover:bg-forest-50 transition-colors inline-flex items-center gap-2">
                Browse Products <ArrowRight className="w-5 h-5" />
              </Link>
              <Link to="/register" className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white/10 transition-colors">
                Join as Farmer
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-16 md:py-24">
        <h2 className="text-3xl font-bold text-center mb-12">Why KokanKisan?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="card text-center">
            <div className="w-14 h-14 bg-forest-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-7 h-7 text-forest-500" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Trust Score System</h3>
            <p className="text-gray-500 text-sm">Every farmer is verified through a transparent scoring system based on pledges, vouches, and reviews.</p>
          </div>
          <div className="card text-center">
            <div className="w-14 h-14 bg-forest-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Leaf className="w-7 h-7 text-forest-500" />
            </div>
            <h3 className="font-semibold text-lg mb-2">100% Natural Farming</h3>
            <p className="text-gray-500 text-sm">Every farmer signs a natural farming pledge. Zero chemicals, zero pesticides — only pure Kokan produce.</p>
          </div>
          <div className="card text-center">
            <div className="w-14 h-14 bg-forest-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Truck className="w-7 h-7 text-forest-500" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Zero-Delivery Model</h3>
            <p className="text-gray-500 text-sm">ST bus parcels, pickup points, and community carriers — creative delivery without delivery boys.</p>
          </div>
        </div>
      </section>

      <section className="bg-cream-100 py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Join the Movement</h2>
          <p className="text-gray-500 mb-8 max-w-xl mx-auto">
            Be part of a community that supports natural farming, protects Kokan's forests, and brings pure food to every table.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/register" className="btn-primary inline-flex items-center gap-2">
              <Users className="w-5 h-5" /> Register Now
            </Link>
            <Link to="/products" className="btn-outline">Explore Products</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
