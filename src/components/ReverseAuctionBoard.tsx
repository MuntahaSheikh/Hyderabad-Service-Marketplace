import React, { useState } from "react";
import { ReverseAuction, Bid, UserProfile } from "../types";
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
  X
} from "lucide-react";

interface ReverseAuctionBoardProps {
  auctions: ReverseAuction[];
  providers: UserProfile[];
  currentUserId: string;
  currentUserProfile: UserProfile;
  onCreateAuction: (title: string, category: string, desc: string, location: string, maxBudget: number, deadline: string) => void;
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

  // Bid states
  const [biddingAuctionId, setBiddingAuctionId] = useState<string | null>(null);
  const [bidAmount, setBidAmount] = useState(1000);
  const [bidProposal, setBidProposal] = useState("");

  const handlePostAuction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newDesc) return;
    onCreateAuction(newTitle, newCategory, newDesc, newLocation, Number(newBudget), newDeadline);
    setShowCreateModal(false);
    // Reset states
    setNewTitle("");
    setNewDesc("");
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
          <div className="flex items-center justify-between">
            <h3 className="font-display font-bold text-sm text-slate-400 uppercase tracking-widest">
              Live Bidding Board ({auctions.length})
            </h3>
            <span className="text-[10px] text-emerald-500 font-bold animate-pulse flex items-center gap-1">
              ● Live Connections
            </span>
          </div>

          {auctions.length === 0 ? (
            <div className="text-center py-12 px-4 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/10">
              <AlertCircle className="w-8 h-8 text-slate-400 mx-auto mb-2" />
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">No active auctions at the moment.</p>
              {currentUserProfile.role === "customer" && (
                <button onClick={() => setShowCreateModal(true)} className="text-xs text-blue-500 underline mt-1 font-semibold">
                  Create the first post!
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {auctions.map((auc) => {
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 w-full max-w-lg rounded-2xl shadow-2xl p-6 relative">
            <button onClick={() => setShowCreateModal(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600">
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
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g., Complete internal home whitewashing (5 rooms)"
                  className="w-full text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 text-slate-800 dark:text-white focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
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
                    onChange={(e) => setNewBudget(Number(e.target.value))}
                    className="w-full text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 text-slate-800 dark:text-white font-mono focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Deadline Date</label>
                  <input
                    type="date"
                    required
                    value={newDeadline}
                    onChange={(e) => setNewDeadline(e.target.value)}
                    className="w-full text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 text-slate-800 dark:text-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Detailed Requirements</label>
                <textarea
                  required
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="Describe your issue, required materials, size of rooms, working hours allowed, and tools needed..."
                  rows={3}
                  className="w-full text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 text-slate-800 dark:text-white focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold tracking-wider transition-all"
              >
                BROADCAST TO PROVIDERS
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
