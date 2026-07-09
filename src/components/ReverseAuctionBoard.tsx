import React, { useState, useMemo } from "react";
import { ReverseAuction, Bid, UserProfile } from "../types";
import { INITIAL_CATEGORIES, HYDERABAD_AREAS } from "../lib/seedData";
import { 
  Zap, 
  MapPin, 
  DollarSign, 
  Clock, 
  AlertCircle, 
  Send, 
  CheckCircle, 
  User, 
  Sparkles,
  Plus,
  X,
  Upload,
  Trash2,
  Filter,
  Search
} from "lucide-react";
import { showSuccess, showError } from "../lib/notifications";

interface ReverseAuctionBoardProps {
  auctions: ReverseAuction[];
  providers: UserProfile[];
  currentUserId: string;
  currentUserProfile: UserProfile;
  onCreateAuction: (title: string, category: string, desc: string, location: string, maxBudget: number, deadline: string, attachmentUrl?: string) => void;
  onPlaceBid: (auctionId: string, amount: number, proposal: string) => void;
  onAcceptBid: (auctionId: string, bidId: string, bid: Bid) => void;
}

export default function ReverseAuctionBoard({
  auctions,
  providers,
  currentUserId,
  currentUserProfile,
  onCreateAuction,
  onPlaceBid,
  onAcceptBid
}: ReverseAuctionBoardProps) {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newCategory, setNewCategory] = useState("Home Services");
  const [newDesc, setNewDesc] = useState("");
  const [newLocation, setNewLocation] = useState("Qasimabad");
  const [newBudget, setNewBudget] = useState(5000);
  const [newDeadline, setNewDeadline] = useState("2026-07-15");

  // Submission / validation / upload states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [attachment, setAttachment] = useState<string | null>(null);
  const [attachmentName, setAttachmentName] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Bid states
  const [biddingAuctionId, setBiddingAuctionId] = useState<string | null>(null);
  const [bidAmount, setBidAmount] = useState(1000);
  const [bidProposal, setBidProposal] = useState("");

  // Filter States for Board
  const [filterCategory, setFilterCategory] = useState("All");
  const [filterLocation, setFilterLocation] = useState("All");
  const [filterSearch, setFilterSearch] = useState("");
  const [filterMinBudget, setFilterMinBudget] = useState<number | "">("");
  const [filterMaxBudget, setFilterMaxBudget] = useState<number | "">("");

  const filteredAuctions = useMemo(() => {
    return auctions.filter((auc) => {
      // 1. Category Filter
      if (filterCategory !== "All" && auc.category !== filterCategory) {
        return false;
      }
      // 2. Location / Area Filter
      if (filterLocation !== "All" && filterLocation !== "All Hyderabad" && auc.location !== filterLocation) {
        return false;
      }
      // 3. Search query
      if (filterSearch.trim()) {
        const q = filterSearch.toLowerCase();
        const matchesTitle = auc.title.toLowerCase().includes(q);
        const matchesDesc = auc.description.toLowerCase().includes(q);
        const matchesCust = auc.customerName.toLowerCase().includes(q);
        if (!matchesTitle && !matchesDesc && !matchesCust) {
          return false;
        }
      }
      // 4. Budget Filters
      if (filterMinBudget !== "" && auc.maxBudget < filterMinBudget) {
        return false;
      }
      if (filterMaxBudget !== "" && auc.maxBudget > filterMaxBudget) {
        return false;
      }
      return true;
    });
  }, [auctions, filterCategory, filterLocation, filterSearch, filterMinBudget, filterMaxBudget]);

  const validateForm = () => {
    const tempErrors: Record<string, string> = {};
    if (!newTitle.trim()) {
      tempErrors.title = "Job Title is required";
    } else if (newTitle.trim().length < 10) {
      tempErrors.title = "Job Title must be at least 10 characters";
    }

    if (!newDesc.trim()) {
      tempErrors.desc = "Detailed Requirements are required";
    } else if (newDesc.trim().length < 20) {
      tempErrors.desc = "Requirements must be at least 20 characters";
    }

    if (!newBudget || Number(newBudget) <= 500) {
      tempErrors.budget = "Max Budget Cap must be greater than 500 PKR";
    }

    if (!newDeadline) {
      tempErrors.deadline = "Deadline Date is required";
    } else {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const selDate = new Date(newDeadline);
      if (selDate < today) {
        tempErrors.deadline = "Deadline cannot be in the past";
      }
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handlePostAuction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      showError("Validation Failed", "Please correct the highlighted errors in your request form.");
      return;
    }

    setIsSubmitting(true);
    try {
      // Network lag simulation
      await new Promise((resolve) => setTimeout(resolve, 1200));

      onCreateAuction(
        newTitle.trim(),
        newCategory,
        newDesc.trim(),
        newLocation,
        Number(newBudget),
        newDeadline,
        attachment || undefined
      );

      setShowCreateModal(false);
      showSuccess(
        "Request Broadcasted!",
        `Your request "${newTitle}" is now live on Hyderabad's bidding board for providers in ${newLocation}.`
      );

      // Reset form states
      setNewTitle("");
      setNewDesc("");
      setNewBudget(5000);
      setNewDeadline("2026-07-15");
      setAttachment(null);
      setAttachmentName(null);
      setErrors({});
    } catch (err) {
      showError("System Error", "Failed to broadcast custom service request.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const processFile = (file: File) => {
    if (file.size > 2 * 1024 * 1024) {
      setErrors((prev) => ({ ...prev, file: "File size exceeds 2MB limit" }));
      showError("File Too Large", "Please upload an image smaller than 2MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setAttachment(reader.result as string);
      setAttachmentName(file.name);
      setErrors((prev) => {
        const copy = { ...prev };
        delete copy.file;
        return copy;
      });
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handlePostBid = (e: React.FormEvent) => {
    e.preventDefault();
    if (!biddingAuctionId || !bidProposal) return;
    onPlaceBid(biddingAuctionId, Number(bidAmount), bidProposal);
    setBiddingAuctionId(null);
    setBidProposal("");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-6 mb-8">
        <div>
          <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 font-bold text-[10px] uppercase mb-1">
            <Zap className="w-3 h-3 text-amber-500 animate-pulse" />
            <span>Reverse Auction System</span>
          </div>
          <h2 className="font-display font-black text-2xl md:text-3xl text-slate-900 dark:text-white">
            Hyperlocal Bidding Board
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-xl">
            Post your budget and let verified Hyderabad service providers compete on price and time. Transparent bidding saves you up to 40%!
          </p>
        </div>

        {currentUserProfile.role === "customer" && (
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center justify-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-blue-500/15 shrink-0 self-start md:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>POST NEW REQUIREMENT</span>
          </button>
        )}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Active Board */}
        <div className="lg:col-span-2 space-y-5">
          {/* Filters for Bidding Board */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-2xl p-4 shadow-sm space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/85 pb-2">
              <span className="text-xs font-bold text-slate-800 dark:text-white flex items-center gap-1.5">
                <Filter className="w-3.5 h-3.5 text-blue-500" />
                Refine Auction Board
              </span>
              {(filterCategory !== "All" || filterLocation !== "All" || filterSearch !== "" || filterMinBudget !== "" || filterMaxBudget !== "") && (
                <button
                  onClick={() => {
                    setFilterCategory("All");
                    setFilterLocation("All");
                    setFilterSearch("");
                    setFilterMinBudget("");
                    setFilterMaxBudget("");
                  }}
                  className="text-[10px] font-bold text-red-500 hover:underline flex items-center gap-1"
                >
                  Clear Board Filters
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {/* Search input */}
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search requirements..."
                  value={filterSearch}
                  onChange={(e) => setFilterSearch(e.target.value)}
                  className="w-full pl-7.5 bg-slate-50 dark:bg-slate-950 border border-slate-200/50 dark:border-slate-800 rounded-xl p-2 text-xs text-slate-800 dark:text-white focus:outline-none"
                />
              </div>

              {/* Category selector */}
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200/50 dark:border-slate-800 rounded-xl p-2 text-xs text-slate-800 dark:text-white focus:outline-none cursor-pointer font-medium"
              >
                <option value="All">All Categories</option>
                {INITIAL_CATEGORIES.map(c => (
                  <option key={c.id} value={c.name}>{c.name}</option>
                ))}
              </select>

              {/* Location selector */}
              <select
                value={filterLocation}
                onChange={(e) => setFilterLocation(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200/50 dark:border-slate-800 rounded-xl p-2 text-xs text-slate-800 dark:text-white focus:outline-none cursor-pointer font-medium"
              >
                <option value="All">All Hyderabad Areas</option>
                {HYDERABAD_AREAS.filter(a => a !== "All Hyderabad").map(loc => (
                  <option key={loc} value={loc}>{loc}</option>
                ))}
              </select>
            </div>

            {/* Budget constraints */}
            <div className="grid grid-cols-2 gap-3 pt-1">
              <div className="relative">
                <DollarSign className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-slate-400" />
                <input
                  type="number"
                  placeholder="Min Budget"
                  value={filterMinBudget}
                  onChange={(e) => setFilterMinBudget(e.target.value === "" ? "" : Number(e.target.value))}
                  className="w-full pl-7.5 bg-slate-50 dark:bg-slate-950 border border-slate-200/50 dark:border-slate-800 rounded-xl p-2 text-xs text-slate-800 dark:text-white focus:outline-none"
                />
              </div>
              <div className="relative">
                <DollarSign className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-slate-400" />
                <input
                  type="number"
                  placeholder="Max Budget"
                  value={filterMaxBudget}
                  onChange={(e) => setFilterMaxBudget(e.target.value === "" ? "" : Number(e.target.value))}
                  className="w-full pl-7.5 bg-slate-50 dark:bg-slate-950 border border-slate-200/50 dark:border-slate-800 rounded-xl p-2 text-xs text-slate-800 dark:text-white focus:outline-none"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <h3 className="font-display font-bold text-sm text-slate-400 uppercase tracking-widest">
              Live Bidding Board ({filteredAuctions.length})
            </h3>
            <span className="text-[10px] text-emerald-500 font-bold animate-pulse flex items-center gap-1">
              ● Live Connections
            </span>
          </div>

          {filteredAuctions.length === 0 ? (
            <div className="text-center py-12 px-4 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/10">
              <AlertCircle className="w-8 h-8 text-slate-400 mx-auto mb-2" />
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">No active auctions match your filters.</p>
              <button
                onClick={() => {
                  setFilterCategory("All");
                  setFilterLocation("All");
                  setFilterSearch("");
                  setFilterMinBudget("");
                  setFilterMaxBudget("");
                }}
                className="text-xs text-blue-500 underline mt-1 font-semibold"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredAuctions.map((auc) => {
                const isMyAuction = auc.customerId === currentUserId;
                const alreadyBid = auc.bids?.some(b => b.providerId === currentUserId);

                return (
                  <div
                    key={auc.id}
                    className={`rounded-2xl border bg-white dark:bg-slate-950 p-5 shadow-sm hover:shadow-md transition-all ${
                      auc.status === "accepted"
                        ? "border-emerald-100 dark:border-emerald-950/40 bg-emerald-50/10 dark:bg-emerald-950/5"
                        : "border-slate-200/60 dark:border-slate-800"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-blue-600 dark:text-cyan-400 bg-blue-50 dark:bg-slate-900 px-2 py-0.5 rounded-md mb-2">
                          {auc.category}
                        </span>
                        <h4 className="font-display font-bold text-base text-slate-900 dark:text-white leading-snug">
                          {auc.title}
                        </h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">
                          {auc.description}
                        </p>
                        {auc.attachmentUrl && (
                          <div className="mt-3">
                            <img 
                              src={auc.attachmentUrl} 
                              alt="Attachment / Reference Photo" 
                              className="max-h-40 rounded-xl object-cover border border-slate-200 dark:border-slate-800"
                              referrerPolicy="no-referrer"
                            />
                          </div>
                        )}
                      </div>

                      <div className="text-right shrink-0">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Budget Cap</span>
                        <span className="text-base font-black text-blue-600 dark:text-cyan-400 font-mono block mt-0.5">
                          PKR {auc.maxBudget.toLocaleString()}
                        </span>
                        <span className={`inline-block mt-2 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase ${
                          auc.status === "accepted"
                            ? "bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400"
                            : "bg-amber-100 dark:bg-amber-950/50 text-amber-700 dark:text-amber-400 animate-pulse"
                        }`}>
                          {auc.status === "accepted" ? "Assigned" : "Open Bidding"}
                        </span>
                      </div>
                    </div>

                    {/* Meta bar */}
                    <div className="flex flex-wrap gap-x-4 gap-y-2 mt-4 pt-3.5 border-t border-slate-100 dark:border-slate-800/60 text-[11px] text-slate-400 font-medium">
                      <span className="flex items-center gap-1">
                        <User className="w-3.5 h-3.5 text-slate-400" />
                        <span>By {auc.customerName}</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-blue-500" />
                        <span>{auc.location}</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span>Deadline: {new Date(auc.deadline).toLocaleDateString()}</span>
                      </span>
                    </div>

                    {/* Bids Breakdown Section */}
                    <div className="mt-5 space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800/40">
                      <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                        <span>Offers Competed ({auc.bids?.length || 0})</span>
                        {auc.bids?.length > 0 && (
                          <span className="text-blue-500">
                            Lowest Bid: PKR {Math.min(...auc.bids.map(b => b.amount)).toLocaleString()}
                          </span>
                        )}
                      </div>

                      {auc.bids?.length === 0 ? (
                        <p className="text-[11px] text-slate-400 italic">No bids yet. Responders are preparing quotes...</p>
                      ) : (
                        <div className="space-y-2.5">
                          {auc.bids.map((bid) => (
                            <div
                              key={bid.id}
                              className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200/40 dark:border-slate-800/40 flex items-start justify-between gap-3 text-xs"
                            >
                              <div className="flex gap-3">
                                <img
                                  src={bid.providerAvatar}
                                  alt={`Bidder Avatar ${bid.providerName}`}
                                  className="w-8 h-8 rounded-full border border-white dark:border-slate-800 object-cover shrink-0"
                                  referrerPolicy="no-referrer"
                                  loading="lazy"
                                />
                                <div>
                                  <div className="flex items-center gap-1.5">
                                    <span className="font-bold text-slate-800 dark:text-slate-200">{bid.providerName}</span>
                                    <span className="text-[9px] bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-cyan-400 px-1.5 py-0.5 rounded-md font-bold">Verified</span>
                                  </div>
                                  <p className="text-slate-500 dark:text-slate-400 text-[11px] mt-1 italic">
                                    "{bid.proposal}"
                                  </p>
                                </div>
                              </div>

                              <div className="text-right shrink-0">
                                <span className="font-bold text-emerald-600 dark:text-emerald-400 font-mono text-sm">
                                  PKR {bid.amount.toLocaleString()}
                                </span>
                                {isMyAuction && auc.status === "open" && (
                                  <button
                                    onClick={() => onAcceptBid(auc.id, bid.id, bid)}
                                    className="block mt-1.5 px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-bold rounded-lg transition-all"
                                  >
                                    Accept Bid
                                  </button>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Provider Bid Action */}
                    {currentUserProfile.role === "provider" && auc.status === "open" && !alreadyBid && (
                      <div className="mt-4 pt-3.5 border-t border-slate-100 dark:border-slate-800/40 flex justify-end">
                        <button
                          onClick={() => {
                            setBiddingAuctionId(auc.id);
                            setBidAmount(Math.min(auc.maxBudget - 500, 1000));
                          }}
                          className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg transition-all flex items-center gap-1"
                        >
                          <Zap className="w-3.5 h-3.5" />
                          <span>PLACE COMPETITIVE BID</span>
                        </button>
                      </div>
                    )}
                    {alreadyBid && (
                      <div className="mt-4 p-2 rounded-lg bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-cyan-400 text-[10px] font-bold text-center">
                        ✓ Your bid has been successfully transmitted.
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Sidebar Statistics & How It Works */}
        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-200/60 dark:border-slate-800 bg-white dark:bg-slate-950 p-5 shadow-sm">
            <h3 className="font-display font-bold text-sm text-slate-800 dark:text-white mb-3">
              How Reverse Auctions Work
            </h3>
            <div className="space-y-4">
              {[
                { step: "1", title: "Post a Requirement", text: "Describe what you need done and name your maximum budget cap." },
                { step: "2", title: "Providers Compete", text: "Verified Hyderabad specialists analyze your needs and submit lower bids." },
                { step: "3", title: "Accept & Lock", text: "Accept the optimal bid. We instantly create a timeline-tracked booking." }
              ].map((item) => (
                <div key={item.step} className="flex gap-3">
                  <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-cyan-400 text-xs font-bold flex items-center justify-center shrink-0">
                    {item.step}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 leading-none">{item.title}</h4>
                    <p className="text-[11px] text-slate-400 mt-1 leading-normal">{item.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200/60 dark:border-slate-800 bg-gradient-to-br from-blue-600 to-indigo-700 text-white p-5 shadow-lg">
            <h3 className="font-display font-bold text-sm text-cyan-200 mb-2">
              Weekly Leaderboard
            </h3>
            <p className="text-[11px] text-blue-100 mb-4">
              Top providers in Hyderabad with lowest bidding rates and highest execution trust scores.
            </p>
            <div className="space-y-3">
              {providers.slice(0, 3).map((prov, idx) => (
                <div key={prov.uid} className="flex items-center justify-between bg-white/10 rounded-xl p-2.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-cyan-300">#{idx + 1}</span>
                    <img src={prov.avatar} alt={`Local Provider ${prov.name}`} className="w-7 h-7 rounded-full object-cover" referrerPolicy="no-referrer" loading="lazy" />
                    <div>
                      <p className="text-xs font-bold leading-none">{prov.name.split(" ")[0]}</p>
                      <span className="text-[9px] text-blue-100">{prov.category}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-bold block text-cyan-300">{prov.trustScore}% Trust</span>
                    <span className="text-[9px] text-blue-100">{prov.reviewCount} jobs</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Modal - Create Auction */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-fade-in overflow-y-auto">
          <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 w-full max-w-lg rounded-2xl shadow-2xl p-6 relative my-8">
            <button onClick={() => { if (!isSubmitting) setShowCreateModal(false); }} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 disabled:opacity-50" disabled={isSubmitting}>
              <X className="w-4 h-4" />
            </button>

            <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white mb-1">
              Post Custom Service Request
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
              Your post will be broadcasted live to all registered partners in your Hyderabad area.
            </p>

            <form onSubmit={handlePostAuction} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Job Title</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => {
                    setNewTitle(e.target.value);
                    if (errors.title) setErrors(prev => { const c = { ...prev }; delete c.title; return c; });
                  }}
                  disabled={isSubmitting}
                  placeholder="e.g., Complete internal home whitewashing (5 rooms)"
                  className={`w-full text-xs bg-slate-50 dark:bg-slate-900 border rounded-xl p-3 text-slate-800 dark:text-white focus:outline-none transition-colors ${
                    errors.title ? "border-red-500 focus:border-red-600" : "border-slate-200 dark:border-slate-800"
                  }`}
                />
                {errors.title && (
                  <p className="text-[10px] text-red-500 font-semibold mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> {errors.title}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    disabled={isSubmitting}
                    className="w-full text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 text-slate-800 dark:text-white focus:outline-none"
                  >
                    <option value="Home Services">Home Services</option>
                    <option value="Beauty & Grooming">Beauty & Grooming</option>
                    <option value="Education & Quran">Education & Quran</option>
                    <option value="Digital Services">Digital Services</option>
                    <option value="Automotive Care">Automotive Care</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Hyderabad Location</label>
                  <select
                    value={newLocation}
                    onChange={(e) => setNewLocation(e.target.value)}
                    disabled={isSubmitting}
                    className="w-full text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 text-slate-800 dark:text-white focus:outline-none"
                  >
                    <option value="Qasimabad">Qasimabad</option>
                    <option value="Latifabad (Unit 1-12)">Latifabad (Unit 1-12)</option>
                    <option value="Saddar">Saddar</option>
                    <option value="Autobahn Road">Autobahn Road</option>
                    <option value="Hirabad">Hirabad</option>
                    <option value="Citizen Colony">Citizen Colony</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Max Budget Cap (PKR)</label>
                  <input
                    type="number"
                    required
                    value={newBudget}
                    onChange={(e) => {
                      setNewBudget(Number(e.target.value));
                      if (errors.budget) setErrors(prev => { const c = { ...prev }; delete c.budget; return c; });
                    }}
                    disabled={isSubmitting}
                    className={`w-full text-xs bg-slate-50 dark:bg-slate-900 border rounded-xl p-3 text-slate-800 dark:text-white font-mono focus:outline-none transition-colors ${
                      errors.budget ? "border-red-500 focus:border-red-600" : "border-slate-200 dark:border-slate-800"
                    }`}
                  />
                  {errors.budget && (
                    <p className="text-[10px] text-red-500 font-semibold mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> {errors.budget}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Deadline Date</label>
                  <input
                    type="date"
                    required
                    value={newDeadline}
                    onChange={(e) => {
                      setNewDeadline(e.target.value);
                      if (errors.deadline) setErrors(prev => { const c = { ...prev }; delete c.deadline; return c; });
                    }}
                    disabled={isSubmitting}
                    className={`w-full text-xs bg-slate-50 dark:bg-slate-900 border rounded-xl p-3 text-slate-800 dark:text-white focus:outline-none transition-colors ${
                      errors.deadline ? "border-red-500 focus:border-red-600" : "border-slate-200 dark:border-slate-800"
                    }`}
                  />
                  {errors.deadline && (
                    <p className="text-[10px] text-red-500 font-semibold mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> {errors.deadline}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Detailed Requirements</label>
                <textarea
                  required
                  value={newDesc}
                  onChange={(e) => {
                    setNewDesc(e.target.value);
                    if (errors.desc) setErrors(prev => { const c = { ...prev }; delete c.desc; return c; });
                  }}
                  disabled={isSubmitting}
                  placeholder="Describe your issue, required materials, size of rooms, working hours allowed, and tools needed..."
                  rows={3}
                  className={`w-full text-xs bg-slate-50 dark:bg-slate-900 border rounded-xl p-3 text-slate-800 dark:text-white focus:outline-none transition-colors ${
                    errors.desc ? "border-red-500 focus:border-red-600" : "border-slate-200 dark:border-slate-800"
                  }`}
                />
                {errors.desc && (
                  <p className="text-[10px] text-red-500 font-semibold mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> {errors.desc}
                  </p>
                )}
              </div>

              {/* Enhanced Drag and Drop File/Image Upload Section */}
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                  Reference Photo / Attachment (Max 2MB)
                </label>
                
                {!attachment ? (
                  <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className={`border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-2 ${
                      isDragging 
                        ? "border-blue-500 bg-blue-50/50 dark:bg-blue-950/20" 
                        : "border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50/30 dark:bg-slate-900/10"
                    }`}
                  >
                    <input
                      type="file"
                      accept="image/*"
                      id="file-upload-input"
                      onChange={handleFileChange}
                      disabled={isSubmitting}
                      className="hidden"
                    />
                    <label htmlFor="file-upload-input" className="cursor-pointer w-full h-full block">
                      <Upload className="w-6 h-6 text-slate-400 mx-auto mb-1 animate-bounce" />
                      <p className="text-xs font-bold text-slate-600 dark:text-slate-300">
                        Drag and drop or <span className="text-blue-600 hover:underline">browse files</span>
                      </p>
                      <p className="text-[9px] text-slate-400 mt-0.5">Supports PNG, JPG, JPEG up to 2MB</p>
                    </label>
                  </div>
                ) : (
                  <div className="flex items-center justify-between p-3 border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 rounded-xl">
                    <div className="flex items-center gap-3 min-w-0">
                      {attachment.startsWith("data:image/") ? (
                        <img 
                          src={attachment} 
                          alt="Uploaded attachment preview" 
                          className="w-10 h-10 object-cover rounded-lg border border-slate-200 dark:border-slate-850 shrink-0"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <div className="w-10 h-10 bg-slate-100 dark:bg-slate-850 text-slate-400 rounded-lg flex items-center justify-center font-bold text-xs shrink-0">
                          FILE
                        </div>
                      )}
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-slate-700 dark:text-slate-200 truncate leading-none">
                          {attachmentName || "Attached Image"}
                        </p>
                        <p className="text-[9px] text-emerald-500 mt-1 font-semibold">Ready to upload</p>
                      </div>
                    </div>
                    
                    <button
                      type="button"
                      disabled={isSubmitting}
                      onClick={() => { setAttachment(null); setAttachmentName(null); }}
                      className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                )}
                {errors.file && (
                  <p className="text-[10px] text-red-500 font-semibold mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> {errors.file}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-slate-400 disabled:to-slate-400 disabled:opacity-60 text-white rounded-xl text-xs font-bold tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
              >
                {isSubmitting ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>BROADCASTING TO SINDH PARTNERS...</span>
                  </>
                ) : (
                  <span>BROADCAST TO PROVIDERS</span>
                )}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Modal - Place Bid */}
      {biddingAuctionId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 w-full max-w-md rounded-2xl shadow-2xl p-6 relative">
            <button onClick={() => setBiddingAuctionId(null)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600">
              <X className="w-4 h-4" />
            </button>

            <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white mb-1">
              Submit Bidding Proposal
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
              Enter your competitive quote. Your rating and trust score will be shown alongside this bid.
            </p>

            <form onSubmit={handlePostBid} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Your Bidding Amount (PKR)</label>
                <input
                  type="number"
                  required
                  value={bidAmount}
                  onChange={(e) => setBidAmount(Number(e.target.value))}
                  className="w-full text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 text-slate-800 dark:text-white font-mono focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Your Proposal message</label>
                <textarea
                  required
                  value={bidProposal}
                  onChange={(e) => setBidProposal(e.target.value)}
                  placeholder="Explain why you are qualified, crew size, schedule, and if materials are included in your cost..."
                  rows={3}
                  className="w-full text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 text-slate-800 dark:text-white focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold tracking-wider transition-all"
              >
                TRANSMIT PROPOSAL BID
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
