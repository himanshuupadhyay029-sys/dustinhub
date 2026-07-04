import { useState } from 'react';
import { Sliders, Video, Volume2, ShieldCheck, HelpCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const Settings = () => {
  const [quality, setQuality] = useState('auto');
  const [autoplayNext, setAutoplayNext] = useState(true);
  const [autoplayPreviews, setAutoplayPreviews] = useState(true);
  const [audioMode, setAudioMode] = useState('stereo');
  const [isPrivate, setIsPrivate] = useState(false);

  const handleSaveSettings = () => {
    toast.success('System preferences stored successfully!');
  };

  return (
    <div className="min-h-screen bg-cinema-black text-white p-6 md:p-12">
      <div className="max-w-4xl mx-auto space-y-8 pt-4">
        <div>
          <h1 className="text-2xl md:text-4xl font-black tracking-wide uppercase">Preferences</h1>
          <p className="text-zinc-500 text-xs md:text-sm mt-1 uppercase font-bold tracking-wider">
            Configure default audio, video, & privacy properties
          </p>
        </div>

        <div className="bg-zinc-950 border border-white/5 rounded-2xl p-6 md:p-8 space-y-6">
          {/* Section 1: Playback & Video */}
          <div className="space-y-4">
            <h2 className="text-sm font-black text-cinema-red uppercase tracking-widest flex items-center gap-2 border-b border-white/5 pb-2">
              <Video className="w-4 h-4" />
              <span>Video & Playback</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-1">
                <label className="text-xs font-bold text-zinc-300">Default Streaming Quality</label>
                <select
                  value={quality}
                  onChange={(e) => setQuality(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-cinema-red cursor-pointer text-white"
                >
                  <option value="auto">Auto (Recommended)</option>
                  <option value="1080p">High Definition (1080p)</option>
                  <option value="720p">Standard Definition (720p)</option>
                  <option value="480p">Data Saver (480p)</option>
                </select>
              </div>

              <div className="space-y-3 flex flex-col justify-center">
                <label className="inline-flex items-center space-x-2.5 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={autoplayNext}
                    onChange={(e) => setAutoplayNext(e.target.checked)}
                    className="rounded bg-zinc-900 border-zinc-800 text-cinema-red focus:ring-cinema-red focus:ring-offset-zinc-950 w-4.5 h-4.5"
                  />
                  <span className="text-xs font-bold text-zinc-300">Autoplay next episode automatically</span>
                </label>

                <label className="inline-flex items-center space-x-2.5 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={autoplayPreviews}
                    onChange={(e) => setAutoplayPreviews(e.target.checked)}
                    className="rounded bg-zinc-900 border-zinc-800 text-cinema-red focus:ring-cinema-red focus:ring-offset-zinc-950 w-4.5 h-4.5"
                  />
                  <span className="text-xs font-bold text-zinc-300">Autoplay previews & trailers while browsing</span>
                </label>
              </div>
            </div>
          </div>

          {/* Section 2: Audio Preferences */}
          <div className="space-y-4 pt-4">
            <h2 className="text-sm font-black text-cinema-red uppercase tracking-widest flex items-center gap-2 border-b border-white/5 pb-2">
              <Volume2 className="w-4 h-4" />
              <span>Audio Configuration</span>
            </h2>

            <div className="w-full sm:max-w-xs space-y-1">
              <label className="text-xs font-bold text-zinc-300">Default Audio Channel Output</label>
              <select
                value={audioMode}
                onChange={(e) => setAudioMode(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-cinema-red cursor-pointer text-white"
              >
                <option value="stereo">Stereo (Default)</option>
                <option value="surround">Dolby Atmos Surround 5.1</option>
                <option value="mono">Mono Output</option>
              </select>
            </div>
          </div>

          {/* Section 3: Privacy Settings */}
          <div className="space-y-4 pt-4">
            <h2 className="text-sm font-black text-cinema-red uppercase tracking-widest flex items-center gap-2 border-b border-white/5 pb-2">
              <ShieldCheck className="w-4 h-4" />
              <span>Privacy & Security</span>
            </h2>

            <label className="inline-flex items-center space-x-2.5 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={isPrivate}
                onChange={(e) => setIsPrivate(e.target.checked)}
                className="rounded bg-zinc-900 border-zinc-800 text-cinema-red focus:ring-cinema-red focus:ring-offset-zinc-950 w-4.5 h-4.5"
              />
              <div className="flex flex-col">
                <span className="text-xs font-bold text-zinc-300">Private profile list catalog</span>
                <span className="text-[10px] text-zinc-500 font-semibold">Do not expose watchlist items to standard public domains</span>
              </div>
            </label>
          </div>

          {/* Submit Trigger */}
          <div className="pt-6 border-t border-white/5 flex justify-end">
            <button
              onClick={handleSaveSettings}
              className="px-6 py-3 rounded-xl bg-cinema-red hover:bg-cinema-red/90 text-white font-black text-xs uppercase tracking-widest transition duration-300 shadow-md shadow-cinema-red/20"
            >
              Apply Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
