import React, { useState, useMemo } from "react";
import { UserRole } from "../types";
import { 
  Shield, 
  User, 
  MapPin, 
  Sun, 
  Moon, 
  Bell, 
  Compass, 
  MessageSquare, 
  Wrench, 
  Sparkles,
  Zap,
  Menu,
  X,
  Check,
  Search,
  ChevronDown,
  Clock,
  Briefcase,
  Layers,
  Award,
  BellRing,
  Settings
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface NavbarProps {
  currentRole: UserRole;
  onChangeRole: (role: UserRole) => void;
  selectedLocation: string;
  onLocationChange: (loc: string) => void;
  onNavigate: (view: string) => void;
  currentView: string;
}

const LOCATIONS = [
  "All Hyderabad",
  "Qasimabad",
  "Latifabad (Unit 1-12)",
  "Saddar",
  "Autobahn Road",
  "Hirabad",
  "Phuleli",
  "Citizen Colony",
  "Gari Khata"
];

export default function Navbar({
  currentRole,
  onChangeRole,
  selectedLocation,
  onLocationChange,
  onNavigate,
  currentView
}: NavbarProps) {
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [locationSearch, setLocationSearch] = useState("");
  const [notifications, setNotifications] = useState([
    { id: 1, text: "Sajid Ali (Electrician) accepted your wiring request!", time: "5m ago", read: false, type: "match" },
    { id: 2, text: "New bid on your painting auction from Imran Mughal!", time: "1h ago", read: true, type: "bid" },
    { id: 3, text: "Your listing for AC Repair is receiving high traffic!", time: "2h ago", read: false, type: "system" }
  ]);
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);

  const activeNotifsCount = notifications.filter(n => !n.read).length;

  // Filter locations dynamically for a high-end experience
  const filteredLocations = useMemo(() => {
    return LOCATIONS.filter(loc => 
      loc.toLowerCase().includes(locationSearch.toLowerCase())
    );
  }, [locationSearch]);

  const handleMarkAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const handleToggleRead = (id: number) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: !n.read } : n));
  };

  const currentPersonaDetails = useMemo(() => {
    switch(currentRole) {
      case "customer":
        return {
          name: "Kamran Shah",
          status: "Verified Buyer",
          color: "from-blue-500 to-indigo-600",
          textColor: "text-indigo-600",
          bgColor: "bg-indigo-50",
          borderColor: "border-indigo-100"
        };
      case "vendor":
      case "provider":
        return {
          name: "Maria Bridal Studio",
          status: "Verified Pro Vendor",
          color: "from-amber-500 to-orange-600",
          textColor: "text-amber-600",
          bgColor: "bg-amber-50",
          borderColor: "border-amber-100"
        };
      case "hall_owner":
        return {
          name: "Shalimar Banquet",
          status: "Hall Owner",
          color: "from-teal-500 to-emerald-600",
          textColor: "text-emerald-700",
          bgColor: "bg-emerald-50",
          borderColor: "border-emerald-100"
        };
      case "event_planner":
        return {
          name: "Apex Planners",
          status: "Elite Planner",
          color: "from-fuchsia-500 to-pink-600",
          textColor: "text-fuchsia-700",
          bgColor: "bg-fuchsia-50",
          borderColor: "border-fuchsia-100"
        };
      case "admin":
        return {
          name: "Admin Center",
          status: "Systems Director",
          color: "from-rose-500 to-red-600",
          textColor: "text-rose-600",
          bgColor: "bg-rose-50",
          borderColor: "border-rose-100"
        };
      case "super_admin":
        return {
          name: "Super Admin Hub",
          status: "Global Director",
          color: "from-purple-600 to-indigo-700",
          textColor: "text-purple-700",
          bgColor: "bg-purple-50",
          borderColor: "border-purple-100"
        };
      default:
        return {
          name: "User",
          status: "Guest",
          color: "from-slate-500 to-slate-600",
          textColor: "text-slate-600",
          bgColor: "bg-slate-50",
          borderColor: "border-slate-100"
        };
    }
  }, [currentRole]);

  return (
    <nav className="sticky top-0 z-50 glass-nav transition-all duration-300 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo Brand section with premium style */}
          <div 
            id="navbar-brand-logo"
            className="flex items-center gap-3 cursor-pointer group" 
            onClick={() => { onNavigate("home"); setMobileMenuOpen(false); }}
          >
            <div className="relative w-11 h-11 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20 transition-all duration-300 group-hover:scale-105 group-hover:rotate-3 overflow-hidden">
              <Compass className="w-5.5 h-5.5 animate-spin-slow text-white z-10" />
              {/* Interactive light beam */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-shimmer duration-1000" />
            </div>
            <div>
              <div className="flex items-center gap-1">
                <span className="font-display font-black text-xl leading-none tracking-tight block bg-gradient-to-r from-slate-900 to-indigo-950 dark:from-white dark:to-slate-100 bg-clip-text text-transparent">
                  Hyderabad
                </span>
                <Sparkles className="w-3.5 h-3.5 text-blue-500 animate-pulse" />
              </div>
              <span className="text-[9px] uppercase font-black tracking-widest text-indigo-600 dark:text-cyan-400 block mt-0.5">
                Service Hub &middot; SaaS
              </span>
            </div>
          </div>

          {/* Desktop Nav Items */}
          <div className="hidden lg:flex items-center gap-8">
            
            {/* Real-time Location Hub */}
            <div className="relative">
              <button
                id="btn-location-dropdown"
                onClick={() => {
                  setShowLocationDropdown(!showLocationDropdown);
                  setShowRoleDropdown(false);
                  setShowNotifDropdown(false);
                }}
                className="flex items-center gap-2 px-3.5 py-2 rounded-xl border border-slate-200/80 dark:border-slate-800/80 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-white/40 dark:bg-slate-900/40 hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-all shadow-sm hover:border-slate-300 dark:hover:border-slate-700"
              >
                <MapPin className="w-3.5 h-3.5 text-indigo-500 animate-bounce" />
                <span>{selectedLocation}</span>
                <ChevronDown className="w-3 h-3 text-slate-400 transition-transform duration-200" style={{ transform: showLocationDropdown ? 'rotate(180deg)' : 'none' }} />
              </button>

              <AnimatePresence>
                {showLocationDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute left-0 mt-3.5 w-64 rounded-2xl glass-dropdown p-2.5 z-50 border border-slate-200/50 dark:border-slate-800/50"
                  >
                    {/* Location search bar inside dropdown */}
                    <div className="relative mb-2">
                      <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                      <input 
                        type="text"
                        placeholder="Search area..."
                        value={locationSearch}
                        onChange={(e) => setLocationSearch(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500 placeholder-slate-400"
                      />
                      {locationSearch && (
                        <button 
                          onClick={() => setLocationSearch("")}
                          className="text-[10px] text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 absolute right-2.5 top-2"
                        >
                          ✕
                        </button>
                      )}
                    </div>

                    <div className="px-2 py-1 text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                      Hyderabad Localities
                    </div>
                    
                    <div className="max-h-56 overflow-y-auto mt-1 space-y-0.5 pr-1">
                      {filteredLocations.length === 0 ? (
                        <div className="text-center py-4 text-xs text-slate-400">No areas found</div>
                      ) : (
                        filteredLocations.map((loc) => {
                          const isSelected = selectedLocation === loc;
                          return (
                            <button
                              id={`loc-option-${loc.replace(/\s+/g, '-').toLowerCase()}`}
                              key={loc}
                              onClick={() => {
                                onLocationChange(loc);
                                setShowLocationDropdown(false);
                                setLocationSearch("");
                              }}
                              className={`w-full text-left px-3 py-2 rounded-lg text-xs transition-all flex items-center justify-between ${
                                isSelected 
                                  ? "bg-indigo-600 text-white font-bold shadow-md shadow-indigo-600/15" 
                                  : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60"
                              }`}
                            >
                              <span>{loc}</span>
                              {isSelected && <Check className="w-3.5 h-3.5 text-white" />}
                            </button>
                          );
                        })
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Slidable/Glow Switcher Active Pill Tab Bar */}
            <div className="relative flex items-center bg-slate-100/60 dark:bg-slate-900/60 p-1.5 rounded-2xl border border-slate-200/30 dark:border-slate-800/30">
              
              <button
                id="btn-nav-home"
                onClick={() => onNavigate("home")}
                className={`relative px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-2 z-10 ${
                  currentView === "home"
                    ? "text-indigo-600 dark:text-cyan-400"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
                }`}
              >
                {currentView === "home" && (
                  <motion.div 
                    layoutId="activeTabGlow"
                    className="absolute inset-0 bg-white dark:bg-slate-800 shadow-md rounded-xl -z-10 border border-slate-200/10 dark:border-slate-700/50"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                <Compass className="w-3.5 h-3.5" />
                <span>Home Marketplace</span>
              </button>

              <button
                id="btn-nav-auction"
                onClick={() => onNavigate("auction")}
                className={`relative px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-2 z-10 ${
                  currentView === "auction"
                    ? "text-indigo-600 dark:text-cyan-400"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
                }`}
              >
                {currentView === "auction" && (
                  <motion.div 
                    layoutId="activeTabGlow"
                    className="absolute inset-0 bg-white dark:bg-slate-800 shadow-md rounded-xl -z-10 border border-slate-200/10 dark:border-slate-700/50"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                </span>
                <span>Reverse Auction</span>
                <span className="px-1.5 py-0.2 bg-amber-500/15 text-amber-600 dark:text-amber-400 text-[8px] font-black uppercase rounded">Live</span>
              </button>

              <button
                id="btn-nav-dashboard"
                onClick={() => onNavigate("dashboard")}
                className={`relative px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-2 z-10 ${
                  currentView === "dashboard"
                    ? "text-indigo-600 dark:text-cyan-400"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
                }`}
              >
                {currentView === "dashboard" && (
                  <motion.div 
                    layoutId="activeTabGlow"
                    className="absolute inset-0 bg-white dark:bg-slate-800 shadow-md rounded-xl -z-10 border border-slate-200/10 dark:border-slate-700/50"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                <Briefcase className="w-3.5 h-3.5" />
                <span>My Workspace</span>
              </button>
            </div>
          </div>

          {/* User Controls, Alerts & Simulated Workspace Switcher */}
          <div className="hidden lg:flex items-center gap-5">
            
            {/* Premium Notification Center */}
            <div className="relative">
              <button 
                id="btn-notif-dropdown"
                onClick={() => {
                  setShowNotifDropdown(!showNotifDropdown);
                  setShowRoleDropdown(false);
                  setShowLocationDropdown(false);
                }}
                className={`p-2.5 rounded-xl border border-slate-200/50 dark:border-slate-800/50 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all relative ${
                  showNotifDropdown ? 'bg-slate-100 dark:bg-slate-800 border-indigo-500/20' : 'bg-white/40 dark:bg-slate-900/40'
                }`}
              >
                <Bell className={`w-4.5 h-4.5 ${activeNotifsCount > 0 ? "animate-pulse" : ""}`} />
                {activeNotifsCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-indigo-600 text-[10px] font-black text-white rounded-full flex items-center justify-center border-2 border-white dark:border-slate-950 shadow-md shadow-indigo-600/20">
                    {activeNotifsCount}
                  </span>
                )}
              </button>

              <AnimatePresence>
                {showNotifDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-3.5 w-88 rounded-2xl glass-dropdown p-1.5 z-50 border border-slate-200/50 dark:border-slate-800/50"
                  >
                    <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800/80 flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <BellRing className="w-4 h-4 text-indigo-500" />
                        <span className="text-xs font-bold text-slate-800 dark:text-slate-100">Updates Hub</span>
                      </div>
                      {activeNotifsCount > 0 && (
                        <button 
                          onClick={handleMarkAllRead}
                          className="text-[10px] font-bold text-indigo-600 dark:text-cyan-400 hover:underline"
                        >
                          Mark all as read
                        </button>
                      )}
                    </div>
                    
                    <div className="max-h-72 overflow-y-auto space-y-1 py-1 px-1">
                      {notifications.length === 0 ? (
                        <div className="px-4 py-8 text-center text-xs text-slate-400">
                          <Check className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                          You are completely caught up!
                        </div>
                      ) : (
                        notifications.map(n => {
                          let typeBadgeColor = "bg-blue-500/10 text-blue-600 dark:text-cyan-400";
                          if (n.type === "match") typeBadgeColor = "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400";
                          if (n.type === "bid") typeBadgeColor = "bg-amber-500/10 text-amber-600 dark:text-amber-400";

                          return (
                            <div 
                              id={`notif-card-${n.id}`}
                              key={n.id} 
                              onClick={() => handleToggleRead(n.id)}
                              className={`p-3 rounded-xl border transition-all text-xs cursor-pointer flex gap-3 ${
                                !n.read 
                                  ? "bg-slate-500/[0.04] dark:bg-slate-400/[0.03] border-slate-200/60 dark:border-slate-800/40 font-medium" 
                                  : "border-transparent opacity-60 hover:opacity-100"
                              } hover:bg-slate-100 dark:hover:bg-slate-800/40`}
                            >
                              <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${!n.read ? "bg-indigo-600" : "bg-transparent"}`} />
                              <div className="flex-1">
                                <p className="text-slate-700 dark:text-slate-300 text-xs leading-snug">{n.text}</p>
                                <div className="flex items-center gap-2 mt-2">
                                  <span className={`text-[8px] font-extrabold uppercase px-1.5 py-0.5 rounded ${typeBadgeColor}`}>
                                    {n.type}
                                  </span>
                                  <div className="flex items-center gap-1 text-[9px] text-slate-400 font-mono">
                                    <Clock className="w-2.5 h-2.5" />
                                    <span>{n.time}</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>



            {/* Simulated Persona Switcher / Team Controller */}
            <div className="relative">
              <button
                id="btn-persona-selector"
                onClick={() => {
                  setShowRoleDropdown(!showRoleDropdown);
                  setShowLocationDropdown(false);
                  setShowNotifDropdown(false);
                }}
                className={`flex items-center gap-3 pl-3 pr-4 py-2 rounded-2xl border transition-all ${currentPersonaDetails.bgColor} ${currentPersonaDetails.borderColor} hover:scale-[1.01]`}
              >
                <div className={`w-8 h-8 rounded-xl bg-gradient-to-tr ${currentPersonaDetails.color} text-white flex items-center justify-center font-bold text-xs shadow-md shadow-indigo-500/10 uppercase`}>
                  {currentRole[0]}
                </div>
                <div className="text-left">
                  <span className="block text-[9px] uppercase font-black tracking-widest text-slate-400 dark:text-slate-500">
                    TESTING AS
                  </span>
                  <span className={`block text-xs font-bold leading-none mt-0.5 ${currentPersonaDetails.textColor}`}>
                    {currentPersonaDetails.name}
                  </span>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-1.5" />
              </button>

              <AnimatePresence>
                {showRoleDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-3 w-80 rounded-2xl glass-dropdown p-2 z-50 border border-slate-200/50 dark:border-slate-800/50"
                  >
                    <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800/80 mb-2">
                      <div className="flex items-center gap-1.5">
                        <Layers className="w-3.5 h-3.5 text-indigo-500 animate-pulse" />
                        <span className="text-[10px] uppercase font-black text-slate-400 tracking-wider">
                          Simulation Controller
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 font-medium">
                        Change the current simulation identity to access custom view-ports:
                      </p>
                    </div>
                    
                    <div className="space-y-1">
                      {/* Customer Persona */}
                      <button
                        id="btn-persona-customer"
                        onClick={() => {
                          onChangeRole("customer");
                          setShowRoleDropdown(false);
                          onNavigate("dashboard");
                        }}
                        className={`w-full text-left p-2.5 rounded-xl transition-all flex items-center gap-3 hover:bg-slate-50 border ${
                          currentRole === "customer" 
                            ? "bg-indigo-50 border-indigo-500/30" 
                            : "border-transparent"
                        }`}
                      >
                        <div className="w-9 h-9 rounded-xl bg-indigo-500/10 text-indigo-600 flex items-center justify-center shrink-0">
                          <User className="w-4.5 h-4.5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-bold text-slate-800">Kamran Shah</span>
                            <span className="px-1.5 py-0.2 bg-indigo-500/15 text-indigo-600 text-[8px] font-black uppercase rounded">Buyer</span>
                          </div>
                          <span className="text-[10px] text-slate-400 block truncate">Customer &middot; Qasimabad</span>
                        </div>
                        {currentRole === "customer" && <Check className="w-4 h-4 text-indigo-600 shrink-0" />}
                      </button>

                      {/* Vendor Persona */}
                      <button
                        id="btn-persona-vendor"
                        onClick={() => {
                          onChangeRole("vendor");
                          setShowRoleDropdown(false);
                          onNavigate("dashboard");
                        }}
                        className={`w-full text-left p-2.5 rounded-xl transition-all flex items-center gap-3 hover:bg-slate-50 border ${
                          currentRole === "vendor" 
                            ? "bg-amber-50 border-amber-500/30" 
                            : "border-transparent"
                        }`}
                      >
                        <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center shrink-0">
                          <Briefcase className="w-4.5 h-4.5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-bold text-slate-800">Maria Bridal</span>
                            <span className="px-1.5 py-0.2 bg-amber-500/15 text-amber-600 text-[8px] font-black uppercase rounded">Vendor</span>
                          </div>
                          <span className="text-[10px] text-slate-400 block truncate">Makeup Artist &middot; Qasimabad</span>
                        </div>
                        {currentRole === "vendor" && <Check className="w-4 h-4 text-amber-600 shrink-0" />}
                      </button>

                      {/* Hall Owner Persona */}
                      <button
                        id="btn-persona-hall-owner"
                        onClick={() => {
                          onChangeRole("hall_owner");
                          setShowRoleDropdown(false);
                          onNavigate("dashboard");
                        }}
                        className={`w-full text-left p-2.5 rounded-xl transition-all flex items-center gap-3 hover:bg-slate-50 border ${
                          currentRole === "hall_owner" 
                            ? "bg-emerald-50 border-emerald-500/30" 
                            : "border-transparent"
                        }`}
                      >
                        <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0">
                          <Clock className="w-4.5 h-4.5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-bold text-slate-800">Shalimar Hall</span>
                            <span className="px-1.5 py-0.2 bg-emerald-500/15 text-emerald-600 text-[8px] font-black uppercase rounded">Hall Owner</span>
                          </div>
                          <span className="text-[10px] text-slate-400 block truncate">Banquet Owner &middot; Autobahn</span>
                        </div>
                        {currentRole === "hall_owner" && <Check className="w-4 h-4 text-emerald-600 shrink-0" />}
                      </button>

                      {/* Event Planner Persona */}
                      <button
                        id="btn-persona-event-planner"
                        onClick={() => {
                          onChangeRole("event_planner");
                          setShowRoleDropdown(false);
                          onNavigate("dashboard");
                        }}
                        className={`w-full text-left p-2.5 rounded-xl transition-all flex items-center gap-3 hover:bg-slate-50 border ${
                          currentRole === "event_planner" 
                            ? "bg-fuchsia-50 border-fuchsia-500/30" 
                            : "border-transparent"
                        }`}
                      >
                        <div className="w-9 h-9 rounded-xl bg-fuchsia-500/10 text-fuchsia-600 flex items-center justify-center shrink-0">
                          <Sparkles className="w-4.5 h-4.5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-bold text-slate-800">Anas Planner</span>
                            <span className="px-1.5 py-0.2 bg-fuchsia-500/15 text-fuchsia-600 text-[8px] font-black uppercase rounded">Planner</span>
                          </div>
                          <span className="text-[10px] text-slate-400 block truncate">Elite Wedding Planner &middot; Hirabad</span>
                        </div>
                        {currentRole === "event_planner" && <Check className="w-4 h-4 text-fuchsia-600 shrink-0" />}
                      </button>

                      {/* Admin Persona */}
                      <button
                        id="btn-persona-admin"
                        onClick={() => {
                          onChangeRole("admin");
                          setShowRoleDropdown(false);
                          onNavigate("dashboard");
                        }}
                        className={`w-full text-left p-2.5 rounded-xl transition-all flex items-center gap-3 hover:bg-slate-50 border ${
                          currentRole === "admin" 
                            ? "bg-rose-50 border-rose-500/30" 
                            : "border-transparent"
                        }`}
                      >
                        <div className="w-9 h-9 rounded-xl bg-rose-500/10 text-rose-600 flex items-center justify-center shrink-0">
                          <Shield className="w-4.5 h-4.5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-bold text-slate-800">Sys-Admin</span>
                            <span className="px-1.5 py-0.2 bg-rose-500/15 text-rose-600 text-[8px] font-black uppercase rounded">Admin</span>
                          </div>
                          <span className="text-[10px] text-slate-400 block truncate">Operations Desk</span>
                        </div>
                        {currentRole === "admin" && <Check className="w-4 h-4 text-rose-600 shrink-0" />}
                      </button>

                      {/* Super Admin Persona */}
                      <button
                        id="btn-persona-super-admin"
                        onClick={() => {
                          onChangeRole("super_admin");
                          setShowRoleDropdown(false);
                          onNavigate("dashboard");
                        }}
                        className={`w-full text-left p-2.5 rounded-xl transition-all flex items-center gap-3 hover:bg-slate-50 border ${
                          currentRole === "super_admin" 
                            ? "bg-purple-50 border-purple-500/30" 
                            : "border-transparent"
                        }`}
                      >
                        <div className="w-9 h-9 rounded-xl bg-purple-500/10 text-purple-600 flex items-center justify-center shrink-0">
                          <Award className="w-4.5 h-4.5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-bold text-slate-800">Super Admin</span>
                            <span className="px-1.5 py-0.2 bg-purple-500/15 text-purple-600 text-[8px] font-black uppercase rounded">Global</span>
                          </div>
                          <span className="text-[10px] text-slate-400 block truncate">Global Platform Oversight</span>
                        </div>
                        {currentRole === "super_admin" && <Check className="w-4 h-4 text-purple-600 shrink-0" />}
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Mobile responsive buttons */}
          <div className="flex lg:hidden items-center gap-3">
            <button
              id="btn-mobile-menu"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-xl border border-slate-200/50 dark:border-slate-800/50 bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-400"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Responsive Navigation overlay with stagger entries */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden glass-nav border-t border-slate-200/50 dark:border-slate-800/50 py-4 px-4 overflow-hidden"
          >
            <div className="flex flex-col gap-4">
              
              {/* Mobile Location choice */}
              <div className="flex flex-col gap-1.5">
                <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                  Location Focus
                </span>
                <select
                  id="select-mobile-location"
                  value={selectedLocation}
                  onChange={(e) => {
                    onLocationChange(e.target.value);
                    setMobileMenuOpen(false);
                  }}
                  className="bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs p-3 rounded-xl text-slate-800 dark:text-slate-200 focus:outline-none"
                >
                  {LOCATIONS.map((loc) => (
                    <option key={loc} value={loc}>{loc}</option>
                  ))}
                </select>
              </div>

              {/* Mobile links */}
              <div className="flex flex-col gap-1.5">
                <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                  Main Navigation
                </span>
                
                <button 
                  id="btn-mobile-nav-home"
                  onClick={() => { onNavigate("home"); setMobileMenuOpen(false); }}
                  className={`w-full text-left px-3.5 py-3 text-xs font-bold rounded-xl flex items-center gap-3 transition-all ${
                    currentView === "home" 
                      ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/10" 
                      : "text-slate-600 dark:text-slate-400 bg-slate-50/50 dark:bg-slate-900/50 hover:bg-slate-100 dark:hover:bg-slate-900"
                  }`}
                >
                  <Compass className="w-4.5 h-4.5" />
                  <span>Home Marketplace</span>
                </button>
                
                <button 
                  id="btn-mobile-nav-auction"
                  onClick={() => { onNavigate("auction"); setMobileMenuOpen(false); }}
                  className={`w-full text-left px-3.5 py-3 text-xs font-bold rounded-xl flex items-center gap-3 transition-all ${
                    currentView === "auction" 
                      ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/10" 
                      : "text-slate-600 dark:text-slate-400 bg-slate-50/50 dark:bg-slate-900/50 hover:bg-slate-100 dark:hover:bg-slate-900"
                  }`}
                >
                  <Zap className="w-4.5 h-4.5 text-amber-500 animate-pulse" />
                  <span className="flex-1">Reverse Auction Board</span>
                  <span className="px-2 py-0.5 bg-amber-500 text-white text-[8px] font-black uppercase rounded">LIVE</span>
                </button>
                
                <button 
                  id="btn-mobile-nav-dashboard"
                  onClick={() => { onNavigate("dashboard"); setMobileMenuOpen(false); }}
                  className={`w-full text-left px-3.5 py-3 text-xs font-bold rounded-xl flex items-center gap-3 transition-all ${
                    currentView === "dashboard" 
                      ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/10" 
                      : "text-slate-600 dark:text-slate-400 bg-slate-50/50 dark:bg-slate-900/50 hover:bg-slate-100 dark:hover:bg-slate-900"
                  }`}
                >
                  <Briefcase className="w-4.5 h-4.5" />
                  <span>My Workspace</span>
                </button>
              </div>

              {/* Mobile Identity switcher */}
              <div className="flex flex-col gap-2 pt-2 border-t border-slate-100 dark:border-slate-800/80">
                <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                  Simulation Personas
                </span>
                
                <div className="grid grid-cols-3 gap-1.5">
                  <button
                    id="btn-mobile-persona-customer"
                    onClick={() => { onChangeRole("customer"); setMobileMenuOpen(false); onNavigate("dashboard"); }}
                    className={`py-2 px-1 text-[10px] font-bold rounded-xl border transition-all text-center ${
                      currentRole === "customer" 
                        ? "bg-indigo-600 text-white border-indigo-600 font-extrabold" 
                        : "bg-slate-50 text-slate-700 border-slate-200"
                    }`}
                  >
                    Customer
                  </button>
                  <button
                    id="btn-mobile-persona-vendor"
                    onClick={() => { onChangeRole("vendor"); setMobileMenuOpen(false); onNavigate("dashboard"); }}
                    className={`py-2 px-1 text-[10px] font-bold rounded-xl border transition-all text-center ${
                      currentRole === "vendor" 
                        ? "bg-amber-600 text-white border-amber-600 font-extrabold" 
                        : "bg-slate-50 text-slate-700 border-slate-200"
                    }`}
                  >
                    Vendor
                  </button>
                  <button
                    id="btn-mobile-persona-hall-owner"
                    onClick={() => { onChangeRole("hall_owner"); setMobileMenuOpen(false); onNavigate("dashboard"); }}
                    className={`py-2 px-1 text-[10px] font-bold rounded-xl border transition-all text-center ${
                      currentRole === "hall_owner" 
                        ? "bg-emerald-600 text-white border-emerald-600 font-extrabold" 
                        : "bg-slate-50 text-slate-700 border-slate-200"
                    }`}
                  >
                    Hall Owner
                  </button>
                  <button
                    id="btn-mobile-persona-event-planner"
                    onClick={() => { onChangeRole("event_planner"); setMobileMenuOpen(false); onNavigate("dashboard"); }}
                    className={`py-2 px-1 text-[10px] font-bold rounded-xl border transition-all text-center ${
                      currentRole === "event_planner" 
                        ? "bg-fuchsia-600 text-white border-fuchsia-600 font-extrabold" 
                        : "bg-slate-50 text-slate-700 border-slate-200"
                    }`}
                  >
                    Planner
                  </button>
                  <button
                    id="btn-mobile-persona-admin"
                    onClick={() => { onChangeRole("admin"); setMobileMenuOpen(false); onNavigate("dashboard"); }}
                    className={`py-2 px-1 text-[10px] font-bold rounded-xl border transition-all text-center ${
                      currentRole === "admin" 
                        ? "bg-rose-600 text-white border-rose-600 font-extrabold" 
                        : "bg-slate-50 text-slate-700 border-slate-200"
                    }`}
                  >
                    Admin
                  </button>
                  <button
                    id="btn-mobile-persona-superadmin"
                    onClick={() => { onChangeRole("super_admin"); setMobileMenuOpen(false); onNavigate("dashboard"); }}
                    className={`py-2 px-1 text-[10px] font-bold rounded-xl border transition-all text-center ${
                      currentRole === "super_admin" 
                        ? "bg-purple-600 text-white border-purple-600 font-extrabold" 
                        : "bg-slate-50 text-slate-700 border-slate-200"
                    }`}
                  >
                    Global
                  </button>
                </div>
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
