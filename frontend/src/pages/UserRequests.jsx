import { useState, useEffect } from 'react';
import client from '../api/client';
import { 
  MessageSquare, Plus, Clock, CheckCircle2, Loader2, Calendar, Globe, AlertCircle, X, Tv, Film
} from 'lucide-react';
import toast from 'react-hot-toast';

const UserRequests = () => {
  const [requests, setRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitLoading, setIsSubmitLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [title, setTitle] = useState('');
  const [type, setType] = useState('movie'); // 'movie' or 'webseries'
  const [neededDateTime, setNeededDateTime] = useState('');
  const [timezone, setTimezone] = useState('IST'); // 'IST' or 'AEST'

  const fetchRequests = async () => {
    setIsLoading(true);
    try {
      const response = await client.get('/api/movies/requests');
      setRequests(response.data);
    } catch (err) {
      console.error(err);
      toast.error('Failed to fetch request history');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleOpenModal = () => {
    setTitle('');
    setType('movie');
    setNeededDateTime('');
    setTimezone('IST');
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const parseUtcDate = (dateStr) => {
    if (!dateStr) return null;
    const cleanStr = (!dateStr.endsWith('Z') && !/[+-]\d{2}:\d{2}$/.test(dateStr)) ? `${dateStr}Z` : dateStr;
    const d = new Date(cleanStr);
    return isNaN(d.getTime()) ? null : d;
  };

  const getOffset = (tz, dateStr) => {
    if (tz === 'IST') return '+05:30';
    // Melbourne Time: Standard is +10:00, DST is +11:00 (Oct to Apr)
    try {
      const parts = dateStr.split('-');
      if (parts.length >= 2) {
        const month = parseInt(parts[1], 10); // 1-12
        if (month >= 10 || month <= 4) {
          return '+11:00';
        }
      }
    } catch (e) {}
    return '+10:00';
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error('Please enter a movie or webseries title');
      return;
    }
    if (!neededDateTime) {
      toast.error('Please specify when you need it');
      return;
    }

    setIsSubmitLoading(true);
    try {
      const tzOffset = getOffset(timezone, neededDateTime);
      const utcDateTime = new Date(`${neededDateTime}${tzOffset}`).toISOString();

      await client.post('/api/movies/requests', {
        title: title.trim(),
        type,
        needed_by: utcDateTime,
        timezone
      });

      toast.success('Request submitted successfully!');
      setIsModalOpen(false);
      fetchRequests();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.detail || 'Failed to submit request');
    } finally {
      setIsSubmitLoading(false);
    }
  };

  // Helper to format date in timezones
  const formatInTimeZone = (dateStr, timeZone, label) => {
    try {
      const date = parseUtcDate(dateStr);
      if (!date) return 'N/A';
      
      const formatter = new Intl.DateTimeFormat('en-US', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
        timeZone: timeZone
      });
      return `${formatter.format(date)} (${label})`;
    } catch (e) {
      return 'N/A';
    }
  };

  // Status Bar/Timeline component for request lifecycle
  const StatusTracker = ({ status, completedAt }) => {
    const isCompleted = status === 'Completed';

    return (
      <div className="flex items-center w-full max-w-[240px] mt-2 relative">
        {/* Step 1: Submitted */}
        <div className="flex flex-col items-center z-10">
          <div className="w-6 h-6 rounded-full flex items-center justify-center border bg-zinc-900 border-zinc-700 text-zinc-400">
            <Clock className="w-3 h-3" />
          </div>
          <span className="text-[9px] text-zinc-500 font-black uppercase tracking-wider mt-1">Request</span>
        </div>

        {/* Connection Line */}
        <div className="flex-1 h-0.5 bg-zinc-800 relative -top-3.5">
          <div 
            className={`absolute inset-y-0 left-0 transition-all duration-700 ease-out ${
              isCompleted ? 'w-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'w-1/2 bg-cinema-red animate-pulse'
            }`} 
          />
        </div>

        {/* Step 2: Uploaded/Ready */}
        <div className="flex flex-col items-center z-10">
          <div className={`w-6 h-6 rounded-full flex items-center justify-center border transition-all duration-300 ${
            isCompleted 
              ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.4)] scale-110' 
              : 'bg-zinc-950 border-zinc-800 text-zinc-600'
          }`}>
            <CheckCircle2 className="w-3 h-3" />
          </div>
          <span className={`text-[9px] font-black uppercase tracking-wider mt-1 transition-colors duration-300 ${
            isCompleted ? 'text-emerald-400' : 'text-zinc-600'
          }`}>
            {isCompleted ? 'Ready' : 'Pending'}
          </span>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-cinema-black text-white pb-16">
      {/* Hero Banner Area */}
      <div className="relative overflow-hidden bg-[#09090b] border-b border-white/5 py-12 px-6 md:px-12">
        <div className="absolute inset-0 z-0 bg-gradient-to-r from-cinema-red/10 to-transparent" />
        <div className="relative z-10 max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h1 className="text-3xl font-black uppercase tracking-wide text-white">
              Request Portal
            </h1>
            <p className="text-xs text-zinc-500 font-bold uppercase tracking-wider mt-1.5">
              Can't find your title? Ask the Admin to upload it.
            </p>
          </div>
          <button
            onClick={handleOpenModal}
            className="flex items-center space-x-2 bg-cinema-red hover:bg-cinema-red/90 text-white font-black px-6 py-3 rounded-lg text-xs md:text-sm tracking-wider uppercase transition shadow-lg shadow-cinema-red/15 transform hover:-translate-y-0.5"
          >
            <Plus className="w-4 h-4 stroke-[3px]" />
            <span>Request Title</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto p-6 md:px-12 mt-6">
        {isLoading ? (
          <div className="py-24 flex flex-col items-center justify-center space-y-4">
            <Loader2 className="w-10 h-10 text-cinema-red animate-spin" />
            <p className="text-zinc-500 text-sm">Loading requests history...</p>
          </div>
        ) : requests.length === 0 ? (
          <div className="py-24 text-center glass rounded-2xl border border-white/5 p-8 max-w-md mx-auto">
            <MessageSquare className="w-12 h-12 mx-auto mb-4 text-zinc-600" />
            <p className="text-zinc-400 font-bold text-lg">No requests made yet</p>
            <p className="text-zinc-600 text-xs mt-1">Submit a movie or webseries and we will notify you once uploaded!</p>
            <button
              onClick={handleOpenModal}
              className="mt-6 inline-flex items-center space-x-2 bg-zinc-900 border border-zinc-800 hover:border-cinema-red/50 text-white font-bold px-5 py-2.5 rounded-lg text-xs tracking-wider transition"
            >
              Request Now
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {requests.map((req) => (
              <div 
                key={req.id} 
                className="glass rounded-xl border border-white/5 p-5 md:p-6 flex flex-col justify-between hover:border-white/10 transition-all duration-300"
              >
                <div>
                  <div className="flex items-center justify-between gap-4 mb-3">
                    <h3 className="font-extrabold text-lg text-white uppercase tracking-wide truncate max-w-[70%]">
                      {req.title}
                    </h3>
                    <span className="px-2.5 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-[10px] font-black uppercase text-zinc-400 tracking-wider">
                      {req.type === 'movie' ? 'Movie' : 'Web Series'}
                    </span>
                  </div>

                  {/* Needed Date & Time Conversions */}
                  <div className="space-y-2 mt-4 bg-zinc-950/60 p-3 rounded-lg border border-white/5">
                    <span className="text-[10px] text-zinc-500 font-extrabold uppercase tracking-widest block mb-1">Target Need Time</span>
                    <div className="flex flex-col space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className={`text-xs ${req.timezone === 'IST' ? 'text-white font-extrabold' : 'text-zinc-400 font-medium'}`}>
                          {formatInTimeZone(req.needed_by, 'Asia/Kolkata', 'IST')}
                        </span>
                        {req.timezone === 'IST' && (
                          <span className="text-[8px] bg-cinema-red/10 border border-cinema-red/20 text-cinema-red px-1 rounded font-black uppercase">Chosen</span>
                        )}
                      </div>
                      <div className="flex items-center justify-between border-t border-white/5 pt-1.5">
                        <span className={`text-xs ${req.timezone === 'AEST' ? 'text-white font-extrabold' : 'text-zinc-400 font-medium'}`}>
                          {formatInTimeZone(req.needed_by, 'Australia/Melbourne', 'Melbourne Time')}
                        </span>
                        {req.timezone === 'AEST' && (
                          <span className="text-[8px] bg-cinema-red/10 border border-cinema-red/20 text-cinema-red px-1 rounded font-black uppercase">Chosen</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Progress Status Bar Timeline Area */}
                <div className="mt-6 pt-4 border-t border-white/5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div className="flex-1 w-full">
                    <span className="text-[10px] text-zinc-500 font-extrabold uppercase tracking-widest block mb-1">Status Timeline</span>
                    <StatusTracker status={req.status} completedAt={req.completed_at} />
                  </div>
                  {req.status === 'Completed' && req.completed_at && (
                    <div className="text-right sm:text-right mt-2 sm:mt-0 flex flex-col">
                      <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider">Uploaded On</span>
                      <span className="text-xs text-emerald-400 font-bold mt-0.5">
                        {parseUtcDate(req.completed_at)?.toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Modal Overlay */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity duration-300"
            onClick={handleCloseModal}
          />
          <div className="relative w-full max-w-lg bg-[#0e0e11] border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-10 animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="bg-[#121216] border-b border-white/5 p-5 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-black uppercase text-white tracking-wider">Submit Title Request</h2>
                <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mt-0.5">Enter details below</p>
              </div>
              <button 
                onClick={handleCloseModal}
                className="p-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleFormSubmit} className="p-6 space-y-5">
              {/* Title Field */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase text-zinc-400 tracking-wider">Title Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Inception, Stranger Things"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-cinema-red focus:border-cinema-red"
                />
              </div>

              {/* Type Select */}
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setType('movie')}
                  className={`py-3 rounded-lg border font-bold text-xs uppercase tracking-wider flex flex-col items-center justify-center gap-1.5 transition ${
                    type === 'movie' 
                      ? 'bg-cinema-red/10 border-cinema-red text-white' 
                      : 'bg-zinc-950 border-zinc-800 text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  <Film className="w-4 h-4" />
                  <span>Movie</span>
                </button>
                <button
                  type="button"
                  onClick={() => setType('webseries')}
                  className={`py-3 rounded-lg border font-bold text-xs uppercase tracking-wider flex flex-col items-center justify-center gap-1.5 transition ${
                    type === 'webseries' 
                      ? 'bg-cinema-red/10 border-cinema-red text-white' 
                      : 'bg-zinc-950 border-zinc-800 text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  <Tv className="w-4 h-4" />
                  <span>Web Series</span>
                </button>
              </div>

              {/* Timezone Preference */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase text-zinc-400 tracking-wider">Timezone Option</label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setTimezone('IST')}
                    className={`py-2.5 rounded-lg border font-bold text-[11px] uppercase tracking-wider flex items-center justify-center gap-1.5 transition ${
                      timezone === 'IST' 
                        ? 'bg-[#ffffff08] border-white/20 text-white' 
                        : 'bg-zinc-950 border-zinc-800 text-zinc-500 hover:text-zinc-300'
                    }`}
                  >
                    <Globe className="w-3.5 h-3.5 text-cinema-red" />
                    <span>IST (Indian)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setTimezone('AEST')}
                    className={`py-2.5 rounded-lg border font-bold text-[11px] uppercase tracking-wider flex items-center justify-center gap-1.5 transition ${
                      timezone === 'AEST' 
                        ? 'bg-[#ffffff08] border-white/20 text-white' 
                        : 'bg-zinc-950 border-zinc-800 text-zinc-500 hover:text-zinc-300'
                    }`}
                  >
                    <Globe className="w-3.5 h-3.5 text-cinema-red" />
                    <span>Melbourne Time</span>
                  </button>
                </div>
              </div>

              {/* Needed DateTime Picker */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase text-zinc-400 tracking-wider">
                  Needed By Date & Time ({timezone === 'IST' ? 'Indian Time' : 'Australian Time'})
                </label>
                <div className="relative">
                  <input
                    type="datetime-local"
                    required
                    value={neededDateTime}
                    onChange={(e) => setNeededDateTime(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-cinema-red focus:border-cinema-red [color-scheme:dark]"
                  />
                </div>
              </div>

              {/* Notice */}
              <div className="bg-[#121216] border border-white/5 rounded-lg p-3 flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 text-cinema-red mt-0.5 flex-shrink-0" />
                <p className="text-[10px] text-zinc-500 leading-relaxed">
                  We translate target times to both Indian and Australian clocks. The admin will verify slot availability based on your choice.
                </p>
              </div>

              {/* Submit Action */}
              <button
                type="submit"
                disabled={isSubmitLoading}
                className="w-full flex items-center justify-center bg-cinema-red hover:bg-cinema-red/90 disabled:bg-cinema-red/50 text-white font-black py-3 rounded-lg text-xs uppercase tracking-widest transition shadow-lg shadow-cinema-red/10"
              >
                {isSubmitLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    <span>Submitting...</span>
                  </>
                ) : (
                  <span>Send Request</span>
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserRequests;
