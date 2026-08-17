import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, CircleMarker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Leaf, MapPin, FileText, TreePine, Trophy, Newspaper, Plus, Check } from 'lucide-react';
import { api } from '../utils/api';
import toast from 'react-hot-toast';

function LocationPicker({ onPick }) {
  useMapEvents({
    click(e) {
      onPick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

export default function GreenKokan() {
  const [reports, setReports] = useState([]);
  const [petitions, setPetitions] = useState([]);
  const [drives, setDrives] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [news, setNews] = useState([]);
  const [tab, setTab] = useState('report');

  const [form, setForm] = useState({
    reporterName: '', reporterPhone: '', title: '', description: '', photos: [''], lat: '', lng: '', address: '',
  });

  useEffect(() => { fetchAll(); }, []);

  const fetchAll = async () => {
    try {
      const [r, p, d, l, n] = await Promise.all([
        api.get('/green/reports'),
        api.get('/green/petitions'),
        api.get('/green/drives'),
        api.get('/green/leaderboard'),
        api.get('/green/news'),
      ]);
      setReports(r); setPetitions(p); setDrives(d); setLeaderboard(l); setNews(n);
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handlePick = (lat, lng) => {
    setForm({ ...form, lat, lng });
    toast.success(`Location set: ${lat.toFixed(4)}, ${lng.toFixed(4)}`);
  };

  const submitReport = async (e) => {
    e.preventDefault();
    if (!form.lat || !form.lng) return toast.error('Click map to set location');
    try {
      const payload = {
        ...form,
        lat: Number(form.lat), lng: Number(form.lng),
        photos: form.photos.filter((p) => p.trim()),
      };
      await api.post('/green/reports', payload);
      toast.success('Report submitted! Admin will review.');
      setForm({ reporterName: '', reporterPhone: '', title: '', description: '', photos: [''], lat: '', lng: '', address: '' });
      fetchAll();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const signPetition = async (id) => {
    const phone = prompt('Enter your phone to sign:');
    if (!phone) return;
    try {
      await api.post(`/green/petitions/${id}/sign`, { phone });
      toast.success('Signed!');
      fetchAll();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const volunteer = async (id) => {
    const name = prompt('Your name:');
    const phone = prompt('Your phone:');
    if (!name || !phone) return;
    try {
      await api.post(`/green/drives/${id}/volunteer`, { name, phone });
      toast.success('Registered as volunteer!');
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold text-green-700 flex items-center justify-center gap-2"><Leaf className="w-8 h-8" /> Green Kokan</h1>
        <p className="text-gray-500 mt-2">Report deforestation, sign petitions, join plantation drives — protect Kokan's ecology</p>
      </div>

      <div className="flex flex-wrap gap-2 mb-6 justify-center">
        {[['report', 'Report'], ['petitions', 'Petitions'], ['drives', 'Drives'], ['leaderboard', 'Leaderboard'], ['news', 'News']].map(([k, label]) => (
          <button key={k} onClick={() => setTab(k)} className={`px-4 py-2 rounded-lg text-sm font-medium ${tab === k ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-600'}`}>{label}</button>
        ))}
      </div>

      {tab === 'report' && (
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h2 className="font-semibold mb-2 flex items-center gap-1"><MapPin className="w-4 h-4" /> Report Deforestation</h2>
            <form onSubmit={submitReport} className="card space-y-3">
              <input placeholder="Your name" value={form.reporterName} onChange={(e) => setForm({ ...form, reporterName: e.target.value })} className="input-field" />
              <input placeholder="Phone" value={form.reporterPhone} onChange={(e) => setForm({ ...form, reporterPhone: e.target.value })} className="input-field" />
              <input placeholder="Title *" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="input-field" required />
              <textarea placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="input-field h-20 resize-none" />
              <input placeholder="Photo URL" value={form.photos[0]} onChange={(e) => setForm({ ...form, photos: [e.target.value] })} className="input-field" />
              <input placeholder="Address / landmark" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} className="input-field" />
              <p className="text-xs text-gray-400">Lat: {form.lat || '—'} Lng: {form.lng || '—'} (click map →)</p>
              <button className="btn-primary w-full">Submit Report</button>
            </form>
          </div>
          <div>
            <div className="h-[400px] rounded-xl overflow-hidden">
              <MapContainer center={[16.3, 73.5]} zoom={9} style={{ height: '100%', width: '100%' }}>
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="&copy; OpenStreetMap" />
                <LocationPicker onPick={handlePick} />
                {form.lat && form.lng && <Marker position={[Number(form.lat), Number(form.lng)]} />}
                {reports.map((r) => (
                  <CircleMarker key={r.reportId} center={[r.location.lat, r.location.lng]} radius={8} pathOptions={{ color: r.status === 'Action Taken' ? 'green' : 'red' }} />
                ))}
              </MapContainer>
            </div>
          </div>
        </div>
      )}

      {tab === 'petitions' && (
        <div className="space-y-3">
          {petitions.map((p) => (
            <div key={p.petitionId} className="card flex items-center justify-between">
              <div>
                <h3 className="font-semibold">{p.title}</h3>
                <p className="text-sm text-gray-500">{p.description}</p>
                <p className="text-xs text-gray-400">{p.signatures.length}/{p.goal} signatures · To: {p.targetAuthority}</p>
              </div>
              <button onClick={() => signPetition(p.petitionId)} className="btn-primary flex items-center gap-1"><Check className="w-4 h-4" /> Sign</button>
            </div>
          ))}
          {petitions.length === 0 && <p className="text-gray-400 text-center">No petitions yet.</p>}
        </div>
      )}

      {tab === 'drives' && (
        <div className="grid md:grid-cols-2 gap-4">
          {drives.map((d) => (
            <div key={d.driveId} className="card">
              <div className="flex items-center gap-2 mb-1"><TreePine className="w-4 h-4 text-green-600" /><h3 className="font-semibold">{d.title}</h3></div>
              <p className="text-sm text-gray-500">{d.description}</p>
              <p className="text-xs text-gray-400">{new Date(d.date).toLocaleDateString()} · {d.location} · {d.volunteersNeeded} volunteers needed</p>
              <button onClick={() => volunteer(d.driveId)} className="btn-outline text-sm mt-2 flex items-center gap-1"><Plus className="w-4 h-4" /> Volunteer</button>
            </div>
          ))}
          {drives.length === 0 && <p className="text-gray-400 text-center">No drives scheduled.</p>}
        </div>
      )}

      {tab === 'leaderboard' && (
        <div className="max-w-md mx-auto">
          <h2 className="font-semibold mb-3 flex items-center gap-1"><Trophy className="w-4 h-4 text-amber-500" /> Green Warriors</h2>
          {leaderboard.map((v, i) => (
            <div key={i} className="card flex items-center justify-between">
              <span className="font-medium">#{i + 1} {v._id}</span>
              <span className="text-forest-600 font-bold">{v.contributions} 🌱</span>
            </div>
          ))}
          {leaderboard.length === 0 && <p className="text-gray-400 text-center">No contributors yet.</p>}
        </div>
      )}

      {tab === 'news' && (
        <div className="space-y-3">
          {news.map((n) => (
            <div key={n.newsId} className="card flex items-center gap-2">
              <Newspaper className="w-4 h-4 text-gray-400" />
              <div>
                <h3 className="font-semibold">{n.title}</h3>
                <p className="text-sm text-gray-500">{n.summary} <span className="text-xs text-gray-400">— {n.source}</span></p>
              </div>
            </div>
          ))}
          {news.length === 0 && <p className="text-gray-400 text-center">No news yet.</p>}
        </div>
      )}
    </div>
  );
}
