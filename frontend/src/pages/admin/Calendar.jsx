import { useState, useEffect } from 'react';
import { Calendar as CalIcon, Plus, Trash2, Leaf, Star, BookOpen, TreePine } from 'lucide-react';
import { api } from '../../utils/api';
import toast from 'react-hot-toast';

const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];

export default function Calendar() {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());
  const [events, setEvents] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', date: '', description: '', link: '' });

  useEffect(() => { fetchEvents(); }, [year]);

  const fetchEvents = async () => {
    try {
      const data = await api.get(`/calendar/events?year=${year}`);
      setEvents(data);
    } catch (err) {
      toast.error(err.message);
    }
  };

  const eventsOnDate = (d) => {
    const key = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    return events.filter((e) => {
      const ed = new Date(e.date);
      return `${ed.getFullYear()}-${String(ed.getMonth() + 1).padStart(2, '0')}-${String(ed.getDate()).padStart(2, '0')}` === key;
    });
  };

  const iconFor = (type) => {
    if (type === 'festival') return <Star className="w-3 h-3 text-amber-500" />;
    if (type === 'blog') return <BookOpen className="w-3 h-3 text-forest-500" />;
    if (type === 'drive') return <TreePine className="w-3 h-3 text-green-600" />;
    return <Leaf className="w-3 h-3 text-purple-500" />;
  };

  const addEvent = async () => {
    try {
      await api.post('/calendar/events', form);
      toast.success('Event added');
      setShowForm(false);
      setForm({ title: '', date: '', description: '', link: '' });
      fetchEvents();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const deleteEvent = async (title, date) => {
    if (!confirm('Delete this custom event?')) return;
    try {
      const data = await api.get(`/calendar/events?year=${year}`);
      const match = data.find((e) => e.title === title && e.type === 'custom' && new Date(e.date).toDateString() === new Date(date).toDateString());
      if (match?.eventId) {
        await api.delete(`/calendar/events/${match.eventId}`);
        toast.success('Deleted');
        fetchEvents();
      }
    } catch (err) {
      toast.error(err.message);
    }
  };

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold flex items-center gap-2"><CalIcon className="w-6 h-6" /> Festival & Event Calendar</h1>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary flex items-center gap-1"><Plus className="w-4 h-4" /> Custom Event</button>
      </div>

      <div className="flex items-center gap-3 mb-4">
        <button onClick={() => setMonth(m => m === 0 ? (setYear(y => y - 1), 11) : m - 1)} className="btn-outline px-3 py-1">‹</button>
        <span className="font-semibold w-40 text-center">{MONTHS[month]} {year}</span>
        <button onClick={() => setMonth(m => m === 11 ? (setYear(y => y + 1), 0) : m + 1)} className="btn-outline px-3 py-1">›</button>
      </div>

      {showForm && (
        <div className="card mb-4 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <input placeholder="Event title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="input-field" />
            <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className="input-field" />
          </div>
          <input placeholder="Link (optional)" value={form.link} onChange={(e) => setForm({ ...form, link: e.target.value })} className="input-field" />
          <textarea placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="input-field h-16 resize-none" />
          <button onClick={addEvent} className="btn-primary">Add Event</button>
        </div>
      )}

      <div className="grid grid-cols-7 gap-1 text-center text-xs font-medium text-gray-500 mb-2">
        {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(d => <div key={d}>{d}</div>)}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {cells.map((d, i) => (
          <div key={i} className="min-h-[80px] border rounded-lg p-1 bg-white">
            {d && (
              <>
                <div className="text-xs text-gray-400">{d}</div>
                {eventsOnDate(d).map((ev, j) => (
                  <div key={j} className="flex items-center gap-1 text-[10px] bg-gray-50 rounded px-1 py-0.5 mt-1">
                    {iconFor(ev.type)}
                    <span className="truncate flex-1">{ev.title}</span>
                    {ev.type === 'custom' && (
                      <button onClick={() => deleteEvent(ev.title, ev.date)}><Trash2 className="w-2.5 h-2.5 text-red-400" /></button>
                    )}
                  </div>
                ))}
              </>
            )}
          </div>
        ))}
      </div>

      <div className="flex gap-4 mt-4 text-xs text-gray-500">
        <span className="flex items-center gap-1"><Star className="w-3 h-3 text-amber-500" /> Festival</span>
        <span className="flex items-center gap-1"><BookOpen className="w-3 h-3 text-forest-500" /> Blog</span>
        <span className="flex items-center gap-1"><TreePine className="w-3 h-3 text-green-600" /> Drive</span>
        <span className="flex items-center gap-1"><Leaf className="w-3 h-3 text-purple-500" /> Custom</span>
      </div>
    </div>
  );
}
