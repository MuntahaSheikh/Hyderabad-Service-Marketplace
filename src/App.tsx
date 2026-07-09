import React, { useState, useEffect, useMemo } from "react";
import { UserRole, UserProfile, Booking, ReverseAuction, Review, Complaint, ChatMessage } from "./types";
import { 
  getProviders, 
  getBookings, 
  getReverseAuctions, 
  getReviews, 
  getComplaints, 
  createBooking, 
  createReverseAuction, 
  createBid, 
  acceptBid, 
  addReview, 
  submitComplaint, 
  updateBookingStatus, 
  updateProviderProfile, 
  updateComplaintStatus, 
  getChats, 
  sendChatMessage,
  seedFirestore
} from "./lib/dbHelpers";
import { 
  INITIAL_CATEGORIES, 
  DEALS_OF_THE_DAY, 
  BLOG_POSTS, 
  HYDERABAD_AREAS 
} from "./lib/seedData";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import ReverseAuctionBoard from "./components/ReverseAuctionBoard";
import DashboardCustomer from "./components/DashboardCustomer";
import DashboardProvider from "./components/DashboardProvider";
import DashboardAdmin from "./components/DashboardAdmin";
import AiAssistant from "./components/AiAssistant";
import { generateSeoMetadata, updateDocumentSeo } from "./lib/seo";
import ProviderFilters, { FilterState, DEFAULT_FILTERS } from "./components/ProviderFilters";
import { 
  showSuccess, 
  showError, 
  showWarning, 
  showInfo, 
  showConfirm, 
  showToast 
} from "./lib/notifications";
import { 
  Bot, 
  Sparkles, 
  Flame, 
  Star, 
  Heart, 
  Wrench, 
  Award, 
  CheckCircle, 
  Clock, 
  ShieldCheck, 
  Coins, 
  ChevronRight, 
  Phone, 
  Zap, 
  Send,
  User,
  Info,
  Calendar,
  Layers,
  MessageSquare,
  Compass,
  MapPin,
  RefreshCw,
  Facebook,
  Instagram,
  Linkedin,
  Twitter,
  MessageCircle
} from "lucide-react";

export default function App() {
  // Navigation & Role State
  const [currentView, setCurrentView] = useState<string>("home"); // "home" | "auction" | "dashboard"
  const [currentRole, setCurrentRole] = useState<UserRole>("customer"); // "customer" | "provider" | "admin"
  const [selectedLocation, setSelectedLocation] = useState<string>("All Hyderabad");
  const [showAiAssistant, setShowAiAssistant] = useState<boolean>(false);

  // Database States
  const [providers, setProviders] = useState<UserProfile[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [auctions, setAuctions] = useState<ReverseAuction[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [chats, setChats] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [advancedFilters, setAdvancedFilters] = useState<FilterState>(DEFAULT_FILTERS);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 3;

  // Reset page when filter inputs change
  useEffect(() => {
    setCurrentPage(1);
  }, [advancedFilters, searchQuery, selectedCategory, selectedLocation]);

  // Saved / Faved providers (simulation)
  const [favorites, setFavorites] = useState<string[]>([]);

  // Simulation identities
  const currentUserId = useMemo(() => {
    switch(currentRole) {
      case "customer":
        return "cust-kamran";
      case "vendor":
      case "provider":
        return "prov-maria";
      case "hall_owner":
        return "prov-sajid";
      case "event_planner":
        return "prov-anas";
      default:
        return "admin-agent";
    }
  }, [currentRole]);

  const currentUserProfile: UserProfile = useMemo(() => {
    if (currentRole === "customer") {
      return {
        uid: "cust-kamran",
        name: "Kamran Shah",
        email: "kamran@gmail.com",
        phone: "0301-1112222",
        role: "customer",
        avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150",
        location: "Qasimabad",
        createdAt: new Date().toISOString(),
        loyaltyPoints: 450,
        referralCode: "HYD-KAMRAN"
      };
    } else if (currentRole === "vendor" || currentRole === "provider") {
      return (providers.find(p => p.uid === "prov-maria") || {
        uid: "prov-maria",
        name: "Maria Bridal Studio & Mehndi Care",
        email: "maria.bridal@hsm.com",
        phone: "0333-7654321",
        role: "vendor",
        avatar: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150",
        location: "Qasimabad",
        createdAt: new Date().toISOString(),
        category: "Makeup & Mehndi",
        subcategories: ["Makeup Artists", "Mehndi Artists"],
        isVerified: true,
        kycStatus: "approved",
        trustScore: 96,
        baseRate: 45000,
        rateUnit: "event",
        skills: ["HD Bridal Makeup", "Organic Henna", "Hairstyling"]
      });
    } else if (currentRole === "hall_owner") {
      return (providers.find(p => p.uid === "prov-sajid") || {
        uid: "prov-sajid",
        name: "Shalimar Jewel Banquet & Gardens",
        email: "shalimar@hsm.com",
        phone: "0300-1234567",
        role: "hall_owner",
        avatar: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=150",
        location: "Autobahn Road",
        createdAt: new Date().toISOString(),
        category: "Wedding Halls & Banquets",
        subcategories: ["Banquet Halls", "Wedding Halls"],
        isVerified: true,
        kycStatus: "approved",
        trustScore: 98,
        baseRate: 250000,
        rateUnit: "day",
        skills: ["Seating capacity: 1200", "Valet Parking"],
        capacity: 1200,
        virtualTourUrl: "https://example.com/tour-shalimar-banquet-simulation"
      });
    } else if (currentRole === "event_planner") {
      return (providers.find(p => p.uid === "prov-anas") || {
        uid: "prov-anas",
        name: "Apex Elite Event Planners & Drone Media",
        email: "apex.events@hsm.com",
        phone: "0311-5551212",
        role: "event_planner",
        avatar: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=150",
        location: "Hirabad",
        createdAt: new Date().toISOString(),
        category: "Event Planners",
        subcategories: ["Event Planners", "Photographers"],
        isVerified: true,
        kycStatus: "approved",
        trustScore: 95,
        baseRate: 75000,
        rateUnit: "event",
        skills: ["Complete Wedding Planning", "4K Drone Cinematic Videography"]
      });
    } else {
      return {
        uid: "admin-agent",
        name: "Super Admin Control Desk",
        email: "admin@hsm.com",
        phone: "0321-0000000",
        role: "admin",
        avatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150",
        location: "Saddar",
        createdAt: new Date().toISOString()
      };
    }
  }, [currentRole, providers]);

  // Preload and Seeding
  useEffect(() => {
    async function initApp() {
      // Seed Firestore if empty
      await seedFirestore();
      
      // Load current state
      const pData = await getProviders();
      const bData = await getBookings();
      const aData = await getReverseAuctions();
      const rData = await getReviews();
      const cData = await getComplaints();

      setProviders(pData);
      setBookings(bData);
      setAuctions(aData);
      setReviews(rData);
      setComplaints(cData);

      // Load initial chat history between Kamran and Sajid
      const initialChats = await getChats("cust-kamran", "prov-sajid");
      setChats(initialChats);
      
      setLoading(false);
    }
    initApp();

    // Always ensure Light Mode
    document.documentElement.classList.remove("dark");
  }, []);

  // SEO Meta & Structured Data Synchronization Effect
  useEffect(() => {
    const meta = generateSeoMetadata(currentView, selectedCategory, selectedLocation, searchQuery);
    updateDocumentSeo(meta);
  }, [currentView, selectedCategory, selectedLocation, searchQuery]);

  // ==========================================
  // CORE DISPATCH & BOOKING WORKFLOW HANDLERS
  // ==========================================

  const handleCreateInstantBooking = async (provider: UserProfile, serviceName: string) => {
    const bookingPrice = provider.baseRate || 1000;
    const newBook: Booking = {
      id: "book-" + Math.floor(Math.random() * 90000 + 10000),
      customerId: "cust-kamran",
      customerName: "Kamran Shah",
      customerPhone: "0301-1112222",
      customerLocation: selectedLocation === "All Hyderabad" ? "Qasimabad" : selectedLocation,
      providerId: provider.uid,
      providerName: provider.name,
      providerPhone: provider.phone,
      category: provider.category || "General",
      service: serviceName,
      price: bookingPrice,
      dateTime: new Date(Date.now() + 86400000).toISOString().slice(0, 16), // Tomorrow same time
      status: "pending",
      otpCode: String(Math.floor(Math.random() * 9000 + 1000)),
      isSos: false,
      warrantyDays: 30,
      createdAt: new Date().toISOString(),
      timeline: [
        {
          status: "pending",
          timestamp: new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          description: `Booking requested by customer Kamran Shah for ${serviceName}`
        }
      ]
    };

    const saved = await createBooking(newBook);
    setBookings(prev => [saved, ...prev]);
    setCurrentView("dashboard");
    showSuccess("Booking Requested", `Your booking with ${provider.name} has been successfully requested. Switch to 'My Workspace' to see active timeline.`);
  };

  const handleTriggerSosDispatch = async (serviceName: string) => {
    // Find closest mechanic or electrician
    const categoryMatched = serviceName === "Electrician" ? "Home Services" : "Automotive Care";
    const potentialProviders = providers.filter(p => p.category === categoryMatched);
    const chosenProvider = potentialProviders[0] || providers[0];

    const newBook: Booking = {
      id: "book-sos-" + Math.floor(Math.random() * 90000 + 10000),
      customerId: "cust-kamran",
      customerName: "Kamran Shah",
      customerPhone: "0301-1112222",
      customerLocation: selectedLocation === "All Hyderabad" ? "Qasimabad Bypass" : selectedLocation,
      providerId: chosenProvider.uid,
      providerName: chosenProvider.name,
      providerPhone: chosenProvider.phone,
      category: chosenProvider.category || "General",
      service: serviceName,
      price: 1500, // Fixed emergency fee
      dateTime: new Date().toISOString().slice(0, 16),
      status: "in_progress", // SOS starts immediately
      otpCode: String(Math.floor(Math.random() * 9000 + 1000)),
      isSos: true,
      warrantyDays: 15,
      createdAt: new Date().toISOString(),
      timeline: [
        { status: "pending", timestamp: "Just now", description: "SOS Emergency dispatch created" },
        { status: "accepted", timestamp: "Just now", description: `${chosenProvider.name} accepted the dispatch and is traveling` },
        { status: "in_progress", timestamp: "Just now", description: "Provider has arrived on-site and started diagnosis" }
      ]
    };

    const saved = await createBooking(newBook);
    setBookings(prev => [saved, ...prev]);
    setCurrentView("dashboard");
    showSuccess("🚨 SOS Dispatch Triggered!", `${chosenProvider.name} is on their way with a calculated arrival time of 20 minutes.`);
  };

  const handleUpdateBookingStatusInApp = async (bookingId: string, newStatus: Booking["status"], description: string) => {
    const updated = await updateBookingStatus(bookingId, newStatus, description);
    setBookings(prev => prev.map(b => b.id === bookingId ? updated : b));
  };

  const handleCompleteWithOtp = async (bookingId: string) => {
    const b = bookings.find(book => book.id === bookingId);
    if (b) {
      const updated = await updateBookingStatus(bookingId, "completed", "Job completed successfully. Customer authorized verification OTP code.");
      setBookings(prev => prev.map(bk => bk.id === bookingId ? updated : bk));
      showSuccess("Booking Completed", "Booking verified & completed successfully! Your loyalty points have been updated.");
    }
  };

  // ==========================================
  // REVERSE AUCTION ACTIONS
  // ==========================================

  const handleCreateAuction = async (title: string, category: string, desc: string, location: string, maxBudget: number, deadline: string, attachmentUrl?: string) => {
    const newAuc: ReverseAuction = {
      id: "auc-" + Math.floor(Math.random() * 90000 + 10000),
      customerId: "cust-kamran",
      customerName: "Kamran Shah",
      title,
      category,
      description: desc,
      location,
      maxBudget,
      deadline,
      bids: [],
      status: "open",
      createdAt: new Date().toISOString(),
      attachmentUrl
    };

    const saved = await createReverseAuction(newAuc);
    setAuctions(prev => [saved, ...prev]);
  };

  const handlePlaceBid = async (auctionId: string, amount: number, proposal: string) => {
    const newBid = {
      id: "bid-" + Math.floor(Math.random() * 90000 + 10000),
      providerId: currentUserProfile.uid,
      providerName: currentUserProfile.name,
      providerAvatar: currentUserProfile.avatar,
      amount,
      proposal,
      createdAt: new Date().toISOString()
    };

    const updatedAuction = await createBid(auctionId, newBid);
    setAuctions(prev => prev.map(a => a.id === auctionId ? updatedAuction : a));
  };

  const handleAcceptBid = async (auctionId: string, bidId: string, bid: any) => {
    const updatedAuction = await acceptBid(auctionId, bidId);
    setAuctions(prev => prev.map(a => a.id === auctionId ? updatedAuction : a));

    // Convert accepted bid into active Booking
    const newBook: Booking = {
      id: "book-" + Math.floor(Math.random() * 90000 + 10000),
      customerId: "cust-kamran",
      customerName: "Kamran Shah",
      customerPhone: "0301-1112222",
      customerLocation: updatedAuction.location,
      providerId: bid.providerId,
      providerName: bid.providerName,
      providerPhone: "0300-1234567",
      category: updatedAuction.category,
      service: updatedAuction.title,
      price: bid.amount,
      dateTime: new Date(Date.now() + 86400000).toISOString().slice(0, 16),
      status: "accepted",
      otpCode: String(Math.floor(Math.random() * 9000 + 1000)),
      createdAt: new Date().toISOString(),
      timeline: [
        { status: "accepted", timestamp: "Just now", description: `Bidding Auction matched. Provider ${bid.providerName} accepted the job.` }
      ]
    };

    const saved = await createBooking(newBook);
    setBookings(prev => [saved, ...prev]);
    setCurrentView("dashboard");
    showSuccess("Bidding Proposal Accepted!", `Contract successfully awarded to ${bid.providerName} for PKR ${bid.amount.toLocaleString()}.`);
  };

  // ==========================================
  // REVIEWS, COMPLAINTS & CHAT
  // ==========================================

  const handleAddReview = async (bookingId: string, providerId: string, rating: number, comment: string) => {
    const newRev: Review = {
      id: "rev-" + Math.floor(Math.random() * 90000 + 10000),
      bookingId,
      providerId,
      customerId: "cust-kamran",
      customerName: "Kamran Shah",
      rating,
      comment,
      createdAt: new Date().toISOString()
    };

    const saved = await addReview(newRev);
    setReviews(prev => [saved, ...prev]);
    showSuccess("Review Submitted", "Review submitted successfully! Thank you for supporting honest service providers in Hyderabad.");
  };

  const handleSubmitComplaint = async (bookingId: string, providerId: string, providerName: string, text: string) => {
    const newComp: Complaint = {
      id: "comp-" + Math.floor(Math.random() * 90000 + 10000),
      bookingId,
      customerId: "cust-kamran",
      customerName: "Kamran Shah",
      providerId,
      providerName,
      text,
      status: "pending",
      createdAt: new Date().toISOString()
    };

    const saved = await submitComplaint(newComp);
    setComplaints(prev => [saved, ...prev]);
  };

  const handleSendMessage = async (receiverId: string, text: string) => {
    const newMsg: ChatMessage = {
      id: "chat-" + Math.floor(Math.random() * 90000 + 10000),
      senderId: currentUserId,
      senderName: currentUserProfile.name,
      receiverId,
      text,
      timestamp: Date.now()
    };

    const saved = await sendChatMessage(newMsg);
    setChats(prev => [...prev, saved]);
  };

  const handleUpdateProfile = async (updates: Partial<UserProfile>) => {
    const updated = await updateProviderProfile(currentUserId, updates);
    setProviders(prev => prev.map(p => p.uid === currentUserId ? updated : p));
  };

  const handleVerifyProvider = async (uid: string, status: "approved" | "rejected") => {
    const updated = await updateProviderProfile(uid, { 
      isVerified: status === "approved", 
      kycStatus: status 
    });
    setProviders(prev => prev.map(p => p.uid === uid ? updated : p));
    showSuccess("Credentials Verified", `Provider credentials successfully ${status}!`);
  };

  const handleResolveComplaint = async (id: string) => {
    await updateComplaintStatus(id, "resolved");
    setComplaints(prev => prev.map(c => c.id === id ? { ...c, status: "resolved" } : c));
  };

  // ==========================================
  // SEARCH / FILTERING UTILS
  // ==========================================

  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (advancedFilters.subcategory !== "All") count++;
    if (advancedFilters.area !== "All Hyderabad" && advancedFilters.area !== "") count++;
    if (advancedFilters.minPrice !== "") count++;
    if (advancedFilters.maxPrice !== "") count++;
    if (advancedFilters.minRating !== 0) count++;
    if (advancedFilters.availability !== "All") count++;
    if (advancedFilters.eventDate !== "") count++;
    if (advancedFilters.minExperience !== "") count++;
    if (advancedFilters.trustScoreThreshold !== "") count++;
    if (advancedFilters.verifiedOnly) count++;
    if (advancedFilters.minCapacity !== "") count++;
    return count;
  }, [advancedFilters]);

  const filteredProviders = useMemo(() => {
    return providers.filter((p) => {
      // 1. Location / Area Filter
      const activeArea = (advancedFilters.area && advancedFilters.area !== "All Hyderabad") ? advancedFilters.area : selectedLocation;
      if (activeArea !== "All Hyderabad" && p.location !== activeArea) {
        return false;
      }

      // 2. Category Filter
      if (selectedCategory !== "All" && p.category !== selectedCategory) {
        return false;
      }

      // 3. Subcategory Filter
      if (advancedFilters.subcategory !== "All") {
        if (!p.subcategories || !p.subcategories.includes(advancedFilters.subcategory)) {
          return false;
        }
      }

      // 4. Price range Filter
      if (advancedFilters.minPrice !== "" && p.baseRate !== undefined && p.baseRate < advancedFilters.minPrice) {
        return false;
      }
      if (advancedFilters.maxPrice !== "" && p.baseRate !== undefined && p.baseRate > advancedFilters.maxPrice) {
        return false;
      }

      // 5. Rating Filter
      if (advancedFilters.minRating > 0 && (p.rating === undefined || p.rating < advancedFilters.minRating)) {
        return false;
      }

      // 6. Availability Filter
      if (advancedFilters.availability !== "All" && p.availability !== advancedFilters.availability) {
        return false;
      }

      // 7. Event Date Availability (Dynamic check against bookings)
      if (advancedFilters.eventDate) {
        const isBooked = bookings.some(b => 
          b.providerId === p.uid && 
          (b.status === "accepted" || b.status === "in_progress" || b.status === "pending") &&
          b.dateTime && b.dateTime.startsWith(advancedFilters.eventDate)
        );
        if (isBooked) {
          return false;
        }
      }

      // 8. Experience Years
      if (advancedFilters.minExperience !== "" && (p.experienceYears === undefined || p.experienceYears < advancedFilters.minExperience)) {
        return false;
      }

      // 9. Trust Score
      if (advancedFilters.trustScoreThreshold !== "" && (p.trustScore === undefined || p.trustScore < advancedFilters.trustScoreThreshold)) {
        return false;
      }

      // 10. Verified Only
      if (advancedFilters.verifiedOnly && !p.isVerified) {
        return false;
      }

      // 11. Capacity Filter
      if (advancedFilters.minCapacity !== "" && (p.capacity === undefined || p.capacity < advancedFilters.minCapacity)) {
        return false;
      }

      // 12. Search Query
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const matchesName = p.name.toLowerCase().includes(q);
        const matchesCategory = p.category?.toLowerCase().includes(q);
        const matchesTagline = p.tagline?.toLowerCase().includes(q);
        const matchesBio = p.bio?.toLowerCase().includes(q);
        const matchesSkills = p.skills?.some(s => s.toLowerCase().includes(q));
        const matchesSubcats = p.subcategories?.some(s => s.toLowerCase().includes(q));
        if (!matchesName && !matchesCategory && !matchesTagline && !matchesBio && !matchesSkills && !matchesSubcats) {
          return false;
        }
      }

      return true;
    }).sort((a, b) => {
      // Sorting
      switch (advancedFilters.sortBy) {
        case "price_asc":
          return (a.baseRate || 0) - (b.baseRate || 0);
        case "price_desc":
          return (b.baseRate || 0) - (a.baseRate || 0);
        case "rating_desc":
          return (b.rating || 0) - (a.rating || 0);
        case "experience_desc":
          return (b.experienceYears || 0) - (a.experienceYears || 0);
        case "trust_desc":
          return (b.trustScore || 0) - (a.trustScore || 0);
        case "newest":
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case "best":
        default:
          const scoreA = (a.trustScore || 0) * 0.6 + (a.rating || 0) * 10 * 0.4;
          const scoreB = (b.trustScore || 0) * 0.6 + (b.rating || 0) * 10 * 0.4;
          return scoreB - scoreA;
      }
    });
  }, [providers, bookings, selectedLocation, selectedCategory, searchQuery, advancedFilters]);

  const paginatedProviders = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredProviders.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredProviders, currentPage, itemsPerPage]);

  const totalPages = useMemo(() => {
    return Math.ceil(filteredProviders.length / itemsPerPage);
  }, [filteredProviders, itemsPerPage]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans">
      
      {/* Simulation Identity Topbar alert */}
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950 text-slate-200 border-b border-white/5 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
          
          {/* Left Block: Dynamic System Info */}
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-2.5 text-center md:text-left">
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-mono text-[10px] font-bold tracking-wider uppercase border border-emerald-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              Live Sandbox
            </span>
            <div className="flex items-center gap-2 text-[11px] font-medium text-slate-300">
              <Bot className="w-3.5 h-3.5 text-blue-400" />
              <span>
                Exploring Hyderabad Marketplace in <strong className="text-white uppercase font-bold tracking-wide underline decoration-blue-500 decoration-2 underline-offset-2">{currentRole}</strong> mode. Test roles in the navbar!
              </span>
            </div>
          </div>

          {/* Right Block: Social Media Icons with subtle tooltips and high-end hover triggers */}
          <div className="flex items-center gap-3.5">
            <span className="hidden sm:inline text-[11px] text-slate-400 font-medium">Connect on socials:</span>
            <div className="flex items-center gap-1.5">
              <a 
                href="https://facebook.com" 
                target="_blank" 
                rel="noopener noreferrer"
                title="Facebook"
                className="group p-1.5 rounded-lg border border-white/5 bg-white/5 text-slate-400 hover:text-blue-500 hover:bg-blue-500/10 hover:border-blue-500/20 transition-all duration-300 transform hover:-translate-y-0.5 flex items-center justify-center"
              >
                <Facebook className="w-3.5 h-3.5 transition-transform group-hover:scale-115" />
              </a>
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer"
                title="Instagram"
                className="group p-1.5 rounded-lg border border-white/5 bg-white/5 text-slate-400 hover:text-pink-500 hover:bg-pink-500/10 hover:border-pink-500/20 transition-all duration-300 transform hover:-translate-y-0.5 flex items-center justify-center"
              >
                <Instagram className="w-3.5 h-3.5 transition-transform group-hover:scale-115" />
              </a>
              <a 
                href="https://linkedin.com" 
                target="_blank" 
                rel="noopener noreferrer"
                title="LinkedIn"
                className="group p-1.5 rounded-lg border border-white/5 bg-white/5 text-slate-400 hover:text-blue-400 hover:bg-blue-400/10 hover:border-blue-400/20 transition-all duration-300 transform hover:-translate-y-0.5 flex items-center justify-center"
              >
                <Linkedin className="w-3.5 h-3.5 transition-transform group-hover:scale-115" />
              </a>
              <a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noopener noreferrer"
                title="X"
                className="group p-1.5 rounded-lg border border-white/5 bg-white/5 text-slate-400 hover:text-slate-100 hover:bg-white/10 hover:border-white/20 transition-all duration-300 transform hover:-translate-y-0.5 flex items-center justify-center"
              >
                <Twitter className="w-3.5 h-3.5 transition-transform group-hover:scale-115" />
              </a>
              <a 
                href="https://whatsapp.com" 
                target="_blank" 
                rel="noopener noreferrer"
                title="WhatsApp"
                className="group p-1.5 rounded-lg border border-white/5 bg-white/5 text-slate-400 hover:text-emerald-500 hover:bg-emerald-500/10 hover:border-emerald-500/20 transition-all duration-300 transform hover:-translate-y-0.5 flex items-center justify-center"
              >
                <MessageCircle className="w-3.5 h-3.5 transition-transform group-hover:scale-115" />
              </a>
            </div>
          </div>

        </div>
      </div>

      <Navbar
        currentRole={currentRole}
        onChangeRole={(role) => {
          setCurrentRole(role);
          const roleLabels: Record<string, string> = {
            customer: "Customer (Kamran Shah)",
            vendor: "Maria Bridal Studio",
            hall_owner: "Shalimar Banquet",
            event_planner: "Apex Elite Planners",
            admin: "Hyderabad Admin Desk",
            super_admin: "Super Admin Control Desk",
            provider: "Service Provider"
          };
          showToast(`Workspace role: ${roleLabels[role] || role}`, "success");
        }}
        selectedLocation={selectedLocation}
        onLocationChange={(loc) => {
          setSelectedLocation(loc);
          showToast(`Location filtered: ${loc}`, "info");
        }}
        onNavigate={setCurrentView}
        currentView={currentView}
      />

      {loading ? (
        <div className="flex flex-col items-center justify-center min-h-[70vh] gap-3">
          <RefreshCw className="w-8 h-8 text-blue-500 animate-spin" />
          <p className="text-xs text-slate-400 font-medium">Loading Hyderabad Local Registry...</p>
        </div>
      ) : (
        <main>
          {currentView === "home" && (
            <div>
              {/* Hero Engine */}
              <Hero 
                selectedLocation={selectedLocation} 
                onSearchSubmit={setSearchQuery} 
                onTriggerSos={handleTriggerSosDispatch} 
              />

              {/* Browse Categories */}
              <div id="explore-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="border-b border-slate-100 dark:border-slate-800/80 pb-4 mb-8 flex justify-between items-end">
                  <div>
                    <h3 className="font-display font-black text-xl md:text-2xl text-slate-900 dark:text-white">
                      Explore Categories
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Browse our verified on-demand listings in Hyderabad.</p>
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => setSelectedCategory("All")}
                      className={`px-3 py-1 text-xs rounded-lg font-semibold transition-all ${
                        selectedCategory === "All" ? "bg-blue-600 text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
                      }`}
                    >
                      All
                    </button>
                    {INITIAL_CATEGORIES.map(c => (
                      <button
                        key={c.id}
                        onClick={() => setSelectedCategory(c.name)}
                        className={`px-3 py-1 text-xs rounded-lg font-semibold transition-all ${
                          selectedCategory === c.name ? "bg-blue-600 text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
                        }`}
                      >
                        {c.name.split(" ")[0]}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Popular categories banner matrix */}
                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4 mb-12">
                  {INITIAL_CATEGORIES.map((cat) => (
                    <div
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.name)}
                      className={`cursor-pointer rounded-2xl border p-4 text-center transition-all flex flex-col items-center justify-center gap-2 hover:shadow-lg hover:-translate-y-0.5 duration-200 ${
                        selectedCategory === cat.name 
                          ? "border-indigo-600 dark:border-cyan-400 bg-indigo-50/40 dark:bg-indigo-950/20 glow-primary" 
                          : "border-slate-200/60 dark:border-slate-800/80 bg-white/60 dark:bg-slate-900/40"
                      }`}
                    >
                      <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-slate-900 text-indigo-600 dark:text-cyan-400 flex items-center justify-center shrink-0">
                        <Compass className="w-5 h-5" />
                      </div>
                      <span className="font-display font-bold text-xs text-slate-800 dark:text-slate-200 block truncate w-full">
                        {cat.name}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Advanced Filtering Control Panel */}
                <div className="mb-10">
                  <ProviderFilters
                    selectedCategory={selectedCategory}
                    setSelectedCategory={setSelectedCategory}
                    selectedLocation={selectedLocation}
                    setSelectedLocation={setSelectedLocation}
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    onFiltersChange={setAdvancedFilters}
                    activeFiltersCount={activeFiltersCount}
                  />
                </div>

                {/* Provider Grid section */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {/* Providers directory lists */}
                  <div className="md:col-span-2 space-y-6">
                    <div className="flex justify-between items-center">
                      <h4 className="font-display font-bold text-sm text-slate-400 uppercase tracking-widest">
                        Verified Providers ({filteredProviders.length})
                      </h4>
                      {(selectedLocation !== "All Hyderabad" || advancedFilters.area !== "All Hyderabad") && (
                        <span className="text-[11px] text-blue-500 font-semibold bg-blue-50 dark:bg-blue-950/40 px-2.5 py-1 rounded-lg">
                          Filtering for {advancedFilters.area !== "All Hyderabad" ? advancedFilters.area : selectedLocation}
                        </span>
                      )}
                    </div>

                    {filteredProviders.length === 0 ? (
                      <div className="text-center py-16 bg-white dark:bg-slate-950 rounded-2xl border border-slate-200/50 dark:border-slate-800">
                        <Wrench className="w-10 h-10 text-slate-300 mx-auto mb-3 animate-spin" />
                        <h4 className="text-sm font-bold text-slate-700">No providers match this filter.</h4>
                        <p className="text-xs text-slate-400 mt-1">Try selecting 'All Hyderabad' or clearing your category filters.</p>
                      </div>
                    ) : (
                      <div className="space-y-5">
                        {paginatedProviders.map((prov) => {
                          const isSaved = favorites.includes(prov.uid);

                          return (
                            <div 
                              key={prov.uid} 
                              className="rounded-2xl border border-slate-200/50 dark:border-slate-800/60 bg-white/60 dark:bg-slate-900/30 p-5 shadow-sm hover:shadow-lg transition-all flex flex-col sm:flex-row gap-5 items-start backdrop-blur-sm"
                            >
                              <img 
                                src={prov.avatar} 
                                alt={`Verified Provider ${prov.name} - ${prov.category}`} 
                                className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover shrink-0 border border-slate-200/60 dark:border-slate-800/60" 
                                referrerPolicy="no-referrer"
                                loading="lazy"
                              />

                              <div className="flex-1 space-y-2">
                                <div className="flex items-start justify-between gap-2">
                                  <div>
                                    <div className="flex items-center gap-2">
                                      <h5 className="font-display font-extrabold text-slate-900 dark:text-white text-base sm:text-lg">{prov.name}</h5>
                                      <span className="text-[9px] bg-indigo-600 dark:bg-cyan-500/20 dark:text-cyan-400 text-white px-2 py-0.5 rounded-full font-bold uppercase tracking-wider shrink-0">Vetted</span>
                                    </div>
                                    <p className="text-xs text-indigo-600 dark:text-cyan-400 font-bold uppercase tracking-wider">{prov.category}</p>
                                  </div>

                                  <button
                                    onClick={() => {
                                      if (isSaved) {
                                        setFavorites(favorites.filter(id => id !== prov.uid));
                                      } else {
                                        setFavorites([...favorites, prov.uid]);
                                      }
                                    }}
                                    className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-slate-100 dark:hover:bg-slate-900"
                                  >
                                    <Heart className={`w-4 h-4 ${isSaved ? "fill-red-500 text-red-500" : ""}`} />
                                  </button>
                                </div>

                                <p className="text-xs text-slate-500 dark:text-slate-400 leading-normal line-clamp-2">
                                  {prov.bio}
                                </p>

                                {/* Skills */}
                                <div className="flex flex-wrap gap-1.5 pt-1">
                                  {prov.skills?.map(sk => (
                                    <span key={sk} className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-900/60 text-[10px] text-slate-600 dark:text-slate-300 font-medium">
                                      {sk}
                                    </span>
                                  ))}
                                </div>

                                {/* Bottom metrics */}
                                <div className="flex flex-wrap items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800/60 gap-3 text-xs text-slate-400 font-medium">
                                  <div className="flex items-center gap-4">
                                    <span className="flex items-center gap-1">
                                      <MapPin className="w-3.5 h-3.5 text-indigo-500" />
                                      <span>{prov.location}</span>
                                    </span>
                                    <span className="flex items-center gap-0.5 text-amber-500">
                                      <Star className="w-3.5 h-3.5 fill-amber-500" />
                                      <span className="font-bold text-slate-800 dark:text-white">{prov.rating}</span>
                                      <span>({prov.reviewCount} reviews)</span>
                                    </span>
                                  </div>

                                  <div className="flex items-center gap-3">
                                    <span className="text-slate-500 font-mono">
                                      Rate: <strong className="text-slate-950 dark:text-white">PKR {prov.baseRate}</strong>/{prov.rateUnit}
                                    </span>
                                    <button
                                      onClick={() => handleCreateInstantBooking(prov, prov.category === "Beauty & Grooming" ? "Bridal Makeup" : "Specialist repairs")}
                                      className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold transition-all shadow-md shadow-indigo-600/15 hover:scale-[1.02]"
                                    >
                                      Book Now
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })}

                        {/* Beautiful Pagination UI */}
                        {totalPages > 1 && (
                          <div className="flex items-center justify-between pt-4 border-t border-slate-200/50 dark:border-slate-800">
                            <span className="text-xs text-slate-500 font-medium">
                              Showing <strong className="text-slate-800 dark:text-white">{(currentPage - 1) * itemsPerPage + 1}</strong> to <strong className="text-slate-800 dark:text-white">{Math.min(currentPage * itemsPerPage, filteredProviders.length)}</strong> of <strong className="text-slate-800 dark:text-white">{filteredProviders.length}</strong> providers
                            </span>
                            <div className="flex items-center gap-1">
                              <button
                                disabled={currentPage === 1}
                                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                className="px-3 py-1.5 rounded-xl border border-slate-200/60 dark:border-slate-800 text-xs font-bold disabled:opacity-50 hover:bg-slate-50 dark:hover:bg-slate-900 transition-all text-slate-700 dark:text-slate-200"
                              >
                                Previous
                              </button>
                              {Array.from({ length: totalPages }).map((_, i) => (
                                <button
                                  key={i}
                                  onClick={() => setCurrentPage(i + 1)}
                                  className={`w-8 h-8 rounded-xl text-xs font-bold flex items-center justify-center transition-all ${
                                    currentPage === i + 1
                                      ? "bg-blue-600 text-white shadow-md shadow-blue-600/10 border-blue-600"
                                      : "border border-slate-200/60 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-900"
                                  }`}
                                >
                                  {i + 1}
                                </button>
                              ))}
                              <button
                                disabled={currentPage === totalPages}
                                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                className="px-3 py-1.5 rounded-xl border border-slate-200/60 dark:border-slate-800 text-xs font-bold disabled:opacity-50 hover:bg-slate-50 dark:hover:bg-slate-900 transition-all text-slate-700 dark:text-slate-200"
                              >
                                Next
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Deals, statistics, and Blogs sidebar */}
                  <div className="space-y-6">
                    {/* Today's Deals */}
                    <div className="rounded-2xl border border-slate-200/60 dark:border-slate-800 bg-white dark:bg-slate-950 p-5 shadow-sm space-y-4">
                      <h4 className="font-display font-bold text-sm text-slate-800 dark:text-white uppercase tracking-widest">
                        Today's Hot Deals
                      </h4>
                      <div className="space-y-3">
                        {DEALS_OF_THE_DAY.map(dl => (
                          <div key={dl.id} className="p-3 bg-gradient-to-tr from-amber-50/50 to-orange-50/20 dark:from-slate-900/60 dark:to-orange-950/10 border border-amber-100/60 dark:border-slate-800 rounded-xl flex items-center justify-between text-xs">
                            <div>
                              <span className="px-1.5 py-0.5 bg-orange-600 text-white font-bold rounded text-[9px] uppercase tracking-wider block w-fit mb-1">
                                {dl.discount}
                              </span>
                              <h5 className="font-bold text-slate-900 dark:text-white leading-none">{dl.title}</h5>
                              <span className="text-[10px] text-slate-400 block mt-1">Partner: {dl.providerName}</span>
                            </div>
                            <div className="text-right shrink-0">
                              <span className="text-[10px] text-slate-400 line-through">PKR {dl.originalPrice}</span>
                              <span className="font-black text-orange-600 dark:text-orange-400 block text-sm font-mono">PKR {dl.promoPrice}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Hyderabad Metrics */}
                    <div className="rounded-2xl border border-slate-200/60 dark:border-slate-800 bg-white dark:bg-slate-950 p-5 shadow-sm text-center py-6">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-4">Hyderabad Statistics</span>
                      <div className="grid grid-cols-3 gap-2">
                        <div>
                          <span className="text-xl font-extrabold text-blue-600 dark:text-cyan-400 font-mono block">5,400+</span>
                          <span className="text-[9px] text-slate-400 uppercase font-bold tracking-wider mt-0.5 block">Happy Clients</span>
                        </div>
                        <div>
                          <span className="text-xl font-extrabold text-blue-600 dark:text-cyan-400 font-mono block">120+</span>
                          <span className="text-[9px] text-slate-400 uppercase font-bold tracking-wider mt-0.5 block">Vetted Techs</span>
                        </div>
                        <div>
                          <span className="text-xl font-extrabold text-blue-600 dark:text-cyan-400 font-mono block">24m</span>
                          <span className="text-[9px] text-slate-400 uppercase font-bold tracking-wider mt-0.5 block">Arrival Time</span>
                        </div>
                      </div>
                    </div>

                    {/* Blog Readings */}
                    <div className="rounded-2xl border border-slate-200/60 dark:border-slate-800 bg-white dark:bg-slate-950 p-5 shadow-sm space-y-4">
                      <h4 className="font-display font-bold text-sm text-slate-800 dark:text-white uppercase tracking-widest">
                        Handy Guides & Blogs
                      </h4>
                      <div className="space-y-3.5">
                        {BLOG_POSTS.map(post => (
                          <div key={post.id} className="text-xs group cursor-pointer">
                            <h5 className="font-bold text-slate-900 dark:text-slate-200 group-hover:text-blue-500 transition-colors leading-snug">
                              {post.title}
                            </h5>
                            <p className="text-slate-400 text-[11px] leading-normal mt-1 line-clamp-2">
                              {post.summary}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {currentView === "auction" && (
            <ReverseAuctionBoard
              auctions={auctions}
              providers={providers}
              currentUserId={currentUserId}
              currentUserProfile={currentUserProfile}
              onCreateAuction={handleCreateAuction}
              onPlaceBid={handlePlaceBid}
              onAcceptBid={handleAcceptBid}
            />
          )}

          {currentView === "dashboard" && (
            <div>
              {currentRole === "customer" && (
                <DashboardCustomer
                  bookings={bookings}
                  providers={providers}
                  currentUserId={currentUserId}
                  currentUserProfile={currentUserProfile}
                  chats={chats}
                  onSendMessage={handleSendMessage}
                  onAddReview={handleAddReview}
                  onCancelBooking={(id) => handleUpdateBookingStatusInApp(id, "cancelled", "Cancelled by customer")}
                  onSubmitComplaint={handleSubmitComplaint}
                  onCompleteWithOtp={handleCompleteWithOtp}
                />
              )}

              {(currentRole === "provider" || currentRole === "vendor" || currentRole === "hall_owner" || currentRole === "event_planner") && (
                <DashboardProvider
                  bookings={bookings}
                  currentUserId={currentUserId}
                  currentUserProfile={currentUserProfile}
                  chats={chats}
                  onSendMessage={handleSendMessage}
                  onUpdateBookingStatus={handleUpdateBookingStatusInApp}
                  onUpdateProfile={handleUpdateProfile}
                />
              )}

              {(currentRole === "admin" || currentRole === "super_admin") && (
                <DashboardAdmin
                  bookings={bookings}
                  providers={providers}
                  complaints={complaints}
                  onVerifyProvider={handleVerifyProvider}
                  onResolveComplaint={handleResolveComplaint}
                />
              )}
            </div>
          )}

          {!["home", "auction", "dashboard"].includes(currentView) && (
            <div className="max-w-md mx-auto px-4 py-24 text-center space-y-6 animate-fade-in">
              <div className="w-16 h-16 bg-rose-50 text-rose-600 rounded-full flex items-center justify-center mx-auto text-2xl font-extrabold shadow-sm">
                404
              </div>
              <h2 className="text-xl font-display font-extrabold text-slate-800 tracking-tight">
                Route or Resource Not Found
              </h2>
              <p className="text-xs text-slate-500 leading-relaxed max-w-sm mx-auto">
                The service page, provider listing, or custom bidding request you are looking for does not exist or has expired (HTTP 410 Gone).
              </p>
              <div className="pt-2">
                <button
                  onClick={() => setCurrentView("home")}
                  className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer"
                >
                  Return to Marketplace Home
                </button>
              </div>
            </div>
          )}
        </main>
      )}

      {/* Footer */}
      <footer className="bg-white dark:bg-slate-950 border-t border-slate-200/50 dark:border-slate-900 py-12 mt-16 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <p className="font-display font-bold text-slate-800 dark:text-slate-200">
            HYDERABAD SERVICE MARKETPLACE PLATFORM
          </p>
          <p className="max-w-md mx-auto text-[11px] leading-relaxed">
            Hyderabad's elite local on-demand service board for plumbing, electrical wiring, home tutoring, bridal makeup, and digital consulting.
          </p>
          <div className="pt-4 border-t border-slate-200/40 dark:border-slate-800/60 text-[10px]">
            &copy; {new Date().getFullYear()} Hyderabad Service Marketplace Sindh Inc. Built with Antigravity. All rights reserved.
          </div>
        </div>
      </footer>

      {/* Floating AI Assistant trigger */}
      <button
        onClick={() => setShowAiAssistant(true)}
        className="fixed bottom-6 right-6 z-40 p-4 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-xl hover:scale-105 transition-all flex items-center gap-2"
        id="ai-floating-trigger"
      >
        <Bot className="w-5 h-5 text-cyan-300 animate-bounce" />
        <span className="text-xs font-bold font-display tracking-wide">Ask HyderiAI</span>
      </button>

      {/* Assistant Drawer */}
      <AiAssistant 
        isOpen={showAiAssistant} 
        onClose={() => setShowAiAssistant(false)} 
        onAutoSelectProvider={handleCreateInstantBooking}
      />
    </div>
  );
}
