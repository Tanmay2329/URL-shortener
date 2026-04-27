import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Sparkles, 
  Link as LinkIcon, 
  Copy, 
  CheckCircle, 
  Rocket, 
  Zap, 
  Globe, 
  ShieldCheck 
} from "lucide-react";

const App: React.FC = () => {
  const [url, setUrl] = useState<string>("");
  const [shortUrl, setShortUrl] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  const handleShorten = async () => {
    if (!url) return;
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setShortUrl(`https://url-shortener-production-fb16.up.railway.app/${Math.random().toString(36).substring(7)}`);
      setLoading(false);
    }, 2000);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shortUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    // Main Container: Fixed full height and width with a dark mesh gradient
    <div className="relative min-h-screen w-full flex items-center justify-center bg-[#030014] overflow-hidden">
      
      {/* Background Aesthetic Elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[70vw] h-[70vw] bg-purple-600/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[60vw] h-[60vw] bg-blue-600/20 rounded-full blur-[120px]" />
        {/* Subtle Grid Overlay */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 pointer-events-none"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative z-10 w-full max-w-lg px-6 flex flex-col items-center"
      >
        {/* Branding Header */}
        <header className="text-center mb-10">
          <motion.div 
            animate={{ y: [0, -12, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="inline-flex p-4 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md mb-6 shadow-2xl"
          >
            <Rocket className="text-purple-400 w-12 h-12" />
          </motion.div>
          
          <h1 className="text-6xl font-black tracking-tighter text-white mb-4 italic">
            TINY<span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-500 underline decoration-purple-500/30">LINK</span>
          </h1>
          <p className="text-slate-400 text-lg font-medium max-w-sm mx-auto">
            The intelligent way to manage and track your short links. ⚡
          </p>
        </header>

        {/* The Action Card */}
        <div className="w-full backdrop-blur-3xl bg-white/[0.02] border border-white/10 rounded-[2.5rem] p-10 shadow-[0_0_100px_rgba(0,0,0,0.5)]">
          <div className="space-y-6">
            
            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-purple-400/80 ml-2">
                Paste Destination URL
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
                  <LinkIcon size={20} className="text-slate-500 group-focus-within:text-purple-400 transition-colors" />
                </div>
                <input
                  type="text"
                  placeholder="https://very-long-and-messy-link.com/..."
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 pl-14 pr-4 outline-none focus:border-purple-500/50 focus:ring-4 focus:ring-purple-500/10 transition-all text-white placeholder:text-slate-600"
                />
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02, boxShadow: "0 0 20px rgba(168, 85, 247, 0.4)" }}
              whileTap={{ scale: 0.98 }}
              disabled={loading || !url}
              onClick={handleShorten}
              className={`w-full py-5 rounded-2xl font-black text-lg uppercase tracking-wider transition-all flex items-center justify-center gap-3 ${
                loading 
                ? "bg-slate-800 text-slate-500" 
                : "bg-gradient-to-r from-purple-600 to-blue-600 text-white"
              }`}
            >
              {loading ? (
                <div className="w-6 h-6 border-4 border-white/20 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Sparkles size={20} />
                  Shorten Now
                </>
              )}
            </motion.button>

            <AnimatePresence>
              {shortUrl && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="pt-4"
                >
                  <div className="p-5 rounded-[2rem] bg-gradient-to-b from-white/[0.07] to-transparent border border-white/10">
                    <div className="flex items-center justify-between">
                      <div className="overflow-hidden">
                        <p className="text-[10px] font-bold text-blue-400 uppercase mb-1">Link Ready 🚀</p>
                        <p className="text-lg font-semibold truncate text-white">
                          {shortUrl}
                        </p>
                      </div>
                      <button
                        onClick={copyToClipboard}
                        className={`ml-4 p-4 rounded-2xl transition-all ${
                          copied ? "bg-green-500 text-white" : "bg-white/10 text-white hover:bg-white/20"
                        }`}
                      >
                        {copied ? <CheckCircle size={22} /> : <Copy size={22} />}
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Feature Highlights */}
        <div className="mt-12 flex flex-wrap justify-center gap-8 opacity-60">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-300">
            <ShieldCheck size={16} className="text-purple-400" /> Secure Link
          </div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-300">
            <Zap size={16} className="text-purple-400" /> Fast API
          </div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-300">
            <Globe size={16} className="text-purple-400" /> Analytics
          </div>
        </div>

        <footer className="mt-16 text-slate-500 text-[10px] font-bold uppercase tracking-[0.3em]">
          &copy; 2026 TINYLINK AI • PREMIUM EXPERIENCE 💜
        </footer>
      </motion.div>
    </div>
  );
};

export default App;