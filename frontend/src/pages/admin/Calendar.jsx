import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar as CalIcon, Plus, Trash2, Leaf, Star, BookOpen, TreePine, X, PenLine } from 'lucide-react';
import { api } from '../../utils/api';
import toast from 'react-hot-toast';

const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];

export default function Calendar() {
  const navigate = useNavigate();
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());
  const [events, setEvents] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', date: '', description: '', link: '' });
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedEvents, setSelectedEvents] = useState([]);

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

  const handleDateClick = (d) => {
    const dateEvents = eventsOnDate(d);
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    setSelectedDate({ day: d, dateStr });
    setSelectedEvents(dateEvents);
  };

  const createBlogForFestival = (festivalName) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(selectedDate.day).padStart(2, '0')}`;
    navigate(`/admin/blogs/new?festival=${encodeURIComponent(festivalName)}&date=${dateStr}`);
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
          <div
            key={i}
            className={`min-h-[80px] border rounded-lg p-1 bg-white transition-colors ${d ? 'cursor-pointer hover:border-forest-400 hover:bg-forest-50' : ''}`}
            onClick={() => d && handleDateClick(d)}
          >
            {d && (
              <>
                <div className="text-xs text-gray-400">{d}</div>
                {eventsOnDate(d).slice(0, 2).map((ev, j) => (
                  <div key={j} className="flex items-center gap-1 text-[10px] bg-gray-50 rounded px-1 py-0.5 mt-1">
                    {iconFor(ev.type)}
                    <span className="truncate flex-1">{ev.title}</span>
                    {ev.type === 'custom' && (
                      <button onClick={(e) => { e.stopPropagation(); deleteEvent(ev.title, ev.date); }}><Trash2 className="w-2.5 h-2.5 text-red-400" /></button>
                    )}
                  </div>
                ))}
                {eventsOnDate(d).length > 2 && (
                  <div className="text-[9px] text-gray-400 mt-0.5">+{eventsOnDate(d).length - 2} more</div>
                )}
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

      {selectedDate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={() => setSelectedDate(null)}>
          <div className="bg-white rounded-xl max-w-md w-full" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-lg font-semibold">
                {MONTHS[month]} {selectedDate.day}, {year}
              </h3>
              <button onClick={() => setSelectedDate(null)} className="p-1 hover:bg-gray-100 rounded">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4">
              {selectedEvents.length === 0 ? (
                <div className="text-center py-6">
                  <p className="text-gray-400 mb-4">No events on this date</p>
                  <button
                    onClick={() => {
                      setSelectedDate(null);
                      setForm({ ...form, date: selectedDate.dateStr });
                      setShowForm(true);
                    }}
                    className="btn-outline flex items-center gap-1 mx-auto"
                  >
                    <Plus className="w-4 h-4" /> Add Custom Event
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {selectedEvents.map((ev, i) => (
                    <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                      <div className="flex items-center gap-2">
                        {iconFor(ev.type)}
                        <div>
                          <p className="font-medium text-sm">{ev.title}</p>
                          <p className="text-xs text-gray-400 capitalize">{ev.type}</p>
                        </div>
                      </div>
                      {ev.type === 'festival' && !selectedEvents.some(e => e.type === 'blog' && e.title.includes(ev.title.split(' ')[0])) && (
                        <button
                          onClick={() => createBlogForFestival(ev.title)}
                          className="px-3 py-1.5 bg-forest-500 text-white rounded-lg text-xs font-medium hover:bg-forest-600 flex items-center gap-1"
                        >
                          <PenLine className="w-3 h-3" /> Write Blog
                        </button>
                      )}
                      {ev.type === 'blog' && (
                        <a href={ev.link} className="px-3 py-1.5 bg-blue-100 text-blue-600 rounded-lg text-xs font-medium hover:bg-blue-200">
                          View Blog
                        </a>
                      )}
                      {ev.type === 'custom' && (
                        <button onClick={() => deleteEvent(ev.title, ev.date)} className="p-1.5 hover:bg-red-50 text-red-500 rounded-lg">
                          <Trash2 className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  ))}

                  {selectedEvents.some(e => e.type === 'festival') && !selectedEvents.some(e => e.type === 'blog') && (
                    <div className="pt-2 border-t">
                      <p className="text-xs text-gray-400 mb-2">This festival has no blog yet. Create one:</p>
                      {selectedEvents.filter(e => e.type === 'festival').map((ev, i) => (
                        <button
                          key={i}
                          onClick={() => createBlogForFestival(ev.title)}
                          className="w-full text-left p-3 rounded-lg border-2 border-dashed border-forest-300 hover:border-forest-500 hover:bg-forest-50 transition-colors flex items-center gap-2 mb-2"
                        >
                          <PenLine className="w-4 h-4 text-forest-500" />
                          <span className="text-sm font-medium text-forest-600">Write blog for {ev.title}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
