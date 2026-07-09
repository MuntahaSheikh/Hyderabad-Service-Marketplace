import React, { useState, useEffect } from "react";
import { Search, Mic, Zap, ShieldCheck, MapPin, X, Flame, Loader2 } from "lucide-react";

interface HeroProps {
  selectedLocation: string;
  onSearchSubmit: (query: string) => void;
  onTriggerSos: (service: string) => void;
}

export default function Hero({ selectedLocation, onSearchSubmit, onTriggerSos }: HeroProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [voiceText, setVoiceText] = useState("");
  const [showSosModal, setShowSosModal] = useState(false);
  const [sosService, setSosService] = useState("");
  const [sosPhone, setSosPhone] = useState("0301-1112222");
  const [sosDetails, setSosDetails] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  const handleVoiceSearch = () => {
    setIsListening(true);
    setVoiceText("Listening for your voice in Hyderabad...");
    
    const voiceScenarios = [
      "Need a plumber in Latifabad Unit 6",
      "Best home tutor for mathematics",
      "Bridal makeup artist for wedding in Qasimabad",
      "Car mechanic near Autobahn road",
      "Urgent AC gas charging repair"
    ];

    const randomVoice = voiceScenarios[Math.floor(Math.random() * voiceScenarios.length)];

    setTimeout(() => {
      setVoiceText(`Matched: "${randomVoice}"`);
    }, 1500);

    setTimeout(() => {
      setIsListening(false);
      setSearchQuery(randomVoice);
      setIsSearching(true);
      
      setTimeout(() => {
        onSearchSubmit(randomVoice);
        setIsSearching(false);
        const element = document.getElementById("explore-section");
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 500);
    }, 2800);
  };

  const handleQuickTagClick = async (tag: string) => {
    setSearchQuery(tag);
    setIsSearching(true);
    await new Promise((resolve) => setTimeout(resolve, 400));
    onSearchSubmit(tag);
    setIsSearching(false);
    
    const element = document.getElementById("explore-section");
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSearching(true);
    
    // Smooth professional loading experience
    await new Promise((resolve) => setTimeout(resolve, 550));
    
    onSearchSubmit(searchQuery);
    setIsSearching(false);
    
    const element = document.getElementById("explore-section");
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="relative overflow-hidden py-16 md:py-24 bg-gradient-to-b from-blue-50/70 via-slate-50 to-white dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 border-b border-slate-100 dark:border-slate-900">
      {/* Visual decorative accents */}
      <div className="absolute top-1/4 left-1/10 w-96 h-96 bg-blue-300/20 dark:bg-blue-900/10 rounded-full filter blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/10 w-80 h-80 bg-cyan-300/20 dark:bg-cyan-900/10 rounded-full filter blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        {/* Banner */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100/60 dark:bg-blue-950/40 border border-blue-200/50 dark:border-blue-900/50 mb-6 animate-pulse">
          <Flame className="w-4 h-4 text-orange-500" />
          <span className="text-[11px] font-bold uppercase tracking-wider text-blue-700 dark:text-cyan-400">
            Hyperlocal Sindh Service Network
          </span>
        </div>

        {/* Display Title */}
        <h1 className="font-display text-4xl md:text-6xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-[1.1] max-w-4xl mx-auto">
          Verified Local Services at Your <span className="gradient-text font-black">Doorstep in Hyderabad</span>
        </h1>

        <p className="mt-4 text-sm md:text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
          Find, bid-match, and book certified home technicians, makeup artists, teachers, and developers in Qasimabad, Latifabad, and all areas of Hyderabad.
        </p>

        {/* Search Engine Form */}
        <div className="mt-8 max-w-2xl mx-auto">
          <form 
            onSubmit={handleSubmit} 
            className={`flex flex-col sm:flex-row gap-2 bg-white dark:bg-slate-900 p-2 rounded-2xl shadow-xl border relative transition-all duration-300 ${
              isFocused 
                ? "border-blue-500 ring-4 ring-blue-500/10 shadow-blue-500/5" 
                : "border-slate-200/60 dark:border-slate-800"
            }`}
          >
            <div className="flex-1 flex items-center gap-2 px-3">
              <Search className={`w-5 h-5 transition-colors ${isFocused ? "text-blue-500" : "text-slate-400"}`} />
              <input
                type="text"
                value={searchQuery}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="What service do you need? (e.g. Plumber, Tutor, Mehndi artist...)"
                className="w-full text-sm bg-transparent border-none text-slate-800 dark:text-white focus:outline-none placeholder-slate-400 py-1"
                disabled={isSearching}
              />
              {searchQuery && (
                <button 
                  type="button" 
                  onClick={() => { setSearchQuery(""); onSearchSubmit(""); }} 
                  className="text-slate-400 hover:text-slate-600 transition-colors p-1"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            <div className="flex items-center gap-2 border-t sm:border-t-0 sm:border-l border-slate-100 dark:border-slate-800 pt-2 sm:pt-0 pl-0 sm:pl-2">
              {/* Voice button */}
              <button
                type="button"
                disabled={isSearching}
                onClick={handleVoiceSearch}
                className={`p-2.5 rounded-xl transition-all flex items-center justify-center disabled:opacity-50 ${
                  isListening
                    ? "bg-red-500 text-white animate-bounce"
                    : "text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                }`}
                title="Search with Voice"
              >
                <Mic className="w-4 h-4" />
              </button>

              <button
                type="submit"
                disabled={isSearching}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold text-xs tracking-wide transition-all flex items-center justify-center gap-1.5 min-w-[120px] shadow-sm active:scale-95 cursor-pointer"
              >
                {isSearching ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Searching...</span>
                  </>
                ) : (
                  <span>Find Services</span>
                )}
              </button>
            </div>
          </form>

          {/* Voice status wave */}
          {isListening && (
            <div className="mt-3 bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-950 py-2.5 px-4 rounded-xl flex items-center justify-between animate-fade-in">
              <div className="flex items-center gap-2.5">
                <div className="flex items-center gap-1">
                  <span className="w-1.5 h-4 bg-red-500 rounded-full animate-pulse" />
                  <span className="w-1.5 h-6 bg-red-500 rounded-full animate-pulse delay-75" />
                  <span className="w-1.5 h-3 bg-red-500 rounded-full animate-pulse delay-150" />
                  <span className="w-1.5 h-5 bg-red-500 rounded-full animate-pulse delay-200" />
                </div>
                <span className="text-xs text-red-700 dark:text-red-400 font-medium">
                  {voiceText}
                </span>
              </div>
              <button onClick={() => setIsListening(false)} className="text-red-500 hover:text-red-700 text-[10px] font-bold">
                Cancel
              </button>
            </div>
          )}

          {/* Hot tags */}
          <div className="mt-4 flex flex-wrap justify-center gap-2 items-center text-xs">
            <span className="text-slate-400 font-medium">Popular:</span>
            {["Electrician", "Mehndi Artist", "Quran Teacher", "AC Technician", "Car Mechanic"].map((tag) => (
              <button
                key={tag}
                onClick={() => handleQuickTagClick(tag)}
                className="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-all font-medium text-[11px]"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* SOS Emergency Dispatch Section */}
        <div className="mt-12 max-w-4xl mx-auto p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-red-50 to-amber-50 dark:from-red-950/10 dark:to-amber-950/10 border border-red-100 dark:border-red-950/50 text-left flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-red-500 text-white flex items-center justify-center shadow-lg shadow-red-500/30 shrink-0">
              <Zap className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <span className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-950/40 px-2 py-0.5 rounded-md mb-1">
                SOS Emergency Dispatch
              </span>
              <h3 className="font-display font-bold text-slate-900 dark:text-white text-base leading-snug">
                Immediate Help needed in Hyderabad?
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Dispatch an emergency Electrician, Plumber, or Car Mechanic to your location in 20 minutes with zero pre-booking fees.
              </p>
            </div>
          </div>
          
          <div className="flex gap-2 w-full md:w-auto">
            <button
              onClick={() => { setSosService("Electrician"); setShowSosModal(true); }}
              className="flex-1 md:flex-none px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition-all shadow-md hover:shadow-red-500/20 flex items-center justify-center gap-1.5"
            >
              <Zap className="w-3.5 h-3.5" />
              <span>SOS Electrician</span>
            </button>
            <button
              onClick={() => { setSosService("Car Mechanic"); setShowSosModal(true); }}
              className="flex-1 md:flex-none px-4 py-2.5 bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center justify-center gap-1.5"
            >
              <Flame className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
              <span>SOS Mechanic</span>
            </button>
          </div>
        </div>
      </div>

      {/* SOS Booking Modal */}
      {showSosModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white dark:bg-slate-950 border border-red-100 dark:border-red-950 w-full max-w-md rounded-2xl shadow-2xl p-6 relative">
            <button onClick={() => setShowSosModal(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600">
              <X className="w-4 h-4" />
            </button>

            <div className="text-center">
              <div className="mx-auto w-12 h-12 rounded-full bg-red-100 dark:bg-red-950 flex items-center justify-center text-red-600 mb-3 animate-bounce">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white">
                Dispatch SOS Emergency {sosService}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Your location will be retrieved to instantly dispatch the nearest verified responder in Hyderabad.
              </p>
            </div>

            <div className="mt-5 space-y-3.5">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Your Mobile Phone</label>
                <input
                  type="text"
                  value={sosPhone}
                  onChange={(e) => setSosPhone(e.target.value)}
                  placeholder="03xx-xxxxxxx"
                  className="w-full text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 text-slate-800 dark:text-white font-mono focus:outline-none focus:ring-1 focus:ring-red-500"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Emergency Details (Optional)</label>
                <textarea
                  value={sosDetails}
                  onChange={(e) => setSosDetails(e.target.value)}
                  rows={2}
                  placeholder="e.g., Short circuit sparkling sparks, radiator steaming, etc."
                  className="w-full text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 text-slate-800 dark:text-white focus:outline-none focus:ring-1 focus:ring-red-500"
                />
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 text-[11px] flex gap-2 items-start">
                <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>
                  No advanced payment required. You will verify completion via OTP. Standard emergency visit base fee is fixed at PKR 1500.
                </span>
              </div>

              <button
                onClick={() => {
                  onTriggerSos(sosService);
                  setShowSosModal(false);
                }}
                className="w-full py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs tracking-wider transition-colors shadow-lg shadow-red-500/20"
              >
                CONFIRM EMERGENCY DISPATCH
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
