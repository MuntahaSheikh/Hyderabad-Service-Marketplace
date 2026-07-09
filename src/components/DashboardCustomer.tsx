import React, { useState, useEffect } from "react";
import { Booking, UserProfile, ChatMessage, Review, Complaint } from "../types";
import { 
  Clock, 
  MapPin, 
  Phone, 
  User, 
  Send, 
  Star, 
  ShieldCheck, 
  Award, 
  MessageSquare, 
  AlertTriangle, 
  CheckCircle, 
  Percent, 
  FileText, 
  ArrowRight,
  Sparkles,
  RefreshCw
} from "lucide-react";

interface DashboardCustomerProps {
  bookings: Booking[];
  providers: UserProfile[];
  currentUserId: string;
  currentUserProfile: UserProfile;
  chats: ChatMessage[];
  onSendMessage: (receiverId: string, text: string) => void;
  onAddReview: (bookingId: string, providerId: string, rating: number, comment: string) => void;
  onCancelBooking: (bookingId: string) => void;
  onSubmitComplaint: (bookingId: string, providerId: string, providerName: string, text: string) => void;
  onCompleteWithOtp: (bookingId: string) => void;
}

export default function DashboardCustomer({
  bookings,
  providers,
  currentUserId,
  currentUserProfile,
  chats,
  onSendMessage,
  onAddReview,
  onCancelBooking,
  onSubmitComplaint,
  onCompleteWithOtp
}: DashboardCustomerProps) {
  const [activeBookingId, setActiveBookingId] = useState<string | null>(null);
  const [showChatId, setShowChatId] = useState<string | null>(null); // Provider UID
  const [chatText, setChatText] = useState("");
  
  // Review form state
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [reviewedBookingId, setReviewedBookingId] = useState<string | null>(null);

  // Complaint form state
  const [complaintText, setComplaintText] = useState("");
  const [complaintBooking, setComplaintBooking] = useState<Booking | null>(null);
  const [complaintMsg, setComplaintMsg] = useState("");

  // Simulated provider tracking distance
  const [trackingDistance, setTrackingDistance] = useState("1.8 km away");

  useEffect(() => {
    // Simulate provider moving
    const interval = setInterval(() => {
      const distances = ["1.5 km", "1.1 km", "0.8 km", "0.4 km", "On-site"];
      setTrackingDistance(distances[Math.floor(Math.random() * distances.length)]);
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatText.trim() || !showChatId) return;
    onSendMessage(showChatId, chatText);
    setChatText("");
  };

  const activeChatProvider = providers.find(p => p.uid === showChatId);
  const filteredChats = chats.filter(
    c => (c.senderId === currentUserId && c.receiverId === showChatId) || 
         (c.senderId === showChatId && c.receiverId === currentUserId)
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      {/* Customer Header Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="md:col-span-2 rounded-2xl bg-gradient-to-tr from-blue-900 to-indigo-950 text-white p-6 shadow-md flex items-center justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-44 h-44 bg-blue-500/10 rounded-full filter blur-xl pointer-events-none" />
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center text-xl font-bold border border-white/20 uppercase">
              {currentUserProfile.name[0]}
            </div>
            <div>
              <h2 className="font-display font-bold text-lg leading-none">Welcome back, {currentUserProfile.name}!</h2>
              <p className="text-xs text-blue-200 mt-1 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" />
                <span>Primary Area: Qasimabad, Hyderabad</span>
              </p>
            </div>
          </div>

          <div className="bg-white/10 border border-white/15 px-4 py-2.5 rounded-xl text-center">
            <span className="text-[10px] text-blue-200 uppercase tracking-widest block font-bold">Loyalty Level</span>
            <div className="flex items-center gap-1.5 mt-0.5 justify-center">
              <Award className="w-4 h-4 text-yellow-400" />
              <span className="text-sm font-black">Sindh Elite Gold</span>
            </div>
          </div>
        </div>

        {/* Loyalty Reward Card */}
        <div className="rounded-2xl border border-blue-100 dark:border-blue-950 bg-gradient-to-br from-blue-50 to-indigo-50/50 dark:from-slate-900/60 dark:to-indigo-950/20 p-5 shadow-sm relative overflow-hidden flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[10px] font-bold text-blue-500 uppercase tracking-wider block">Loyalty Points Balance</span>
              <span className="text-2xl font-black text-blue-700 dark:text-cyan-400 font-mono block mt-0.5">
                450 <span className="text-xs font-semibold">Coins</span>
              </span>
            </div>
            <div className="p-2 bg-blue-600 rounded-lg text-white font-mono text-[10px] font-bold uppercase">
              HSM CARD
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-200/50 dark:border-slate-800/50">
            <div className="flex justify-between text-[11px] text-slate-500 dark:text-slate-400">
              <span>Referral: <strong>HYD-KAMRAN</strong></span>
              <span className="text-blue-600 dark:text-cyan-400 font-bold">Share & Earn 100 Coins</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Bookings Tracker */}
        <div className="lg:col-span-2 space-y-6">
          <h3 className="font-display font-bold text-sm text-slate-400 uppercase tracking-widest">
            My Service Bookings ({bookings.length})
          </h3>

          {bookings.length === 0 ? (
            <div className="text-center py-12 rounded-2xl border border-slate-200/50 dark:border-slate-800 bg-white dark:bg-slate-950 shadow-sm">
              <p className="text-xs text-slate-400">No active bookings. Return to the home screen to find service partners.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {bookings.map((book) => {
                const prov = providers.find(p => p.uid === book.providerId);
                const isActive = activeBookingId === book.id;

                return (
                  <div 
                    key={book.id} 
                    className={`rounded-2xl border bg-white dark:bg-slate-950 p-5 shadow-sm hover:shadow-md transition-all ${
                      isActive ? "ring-1 ring-blue-600 dark:ring-cyan-500" : "border-slate-200/60 dark:border-slate-800"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex gap-4">
                        <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-slate-900 flex items-center justify-center text-blue-600 shrink-0">
                          <User className="w-6 h-6" />
                        </div>
                        <div>
                          <span className="text-[10px] uppercase font-extrabold text-blue-600 dark:text-cyan-400 bg-blue-50 dark:bg-slate-900/60 px-2.5 py-0.5 rounded-md block w-fit mb-1">
                            {book.service}
                          </span>
                          <h4 className="font-display font-bold text-base text-slate-900 dark:text-white">
                            {book.providerName}
                          </h4>
                          <span className="text-[11px] text-slate-400 font-mono block mt-0.5">Booking ID: {book.id}</span>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="text-base font-black text-slate-900 dark:text-white font-mono block">PKR {book.price.toLocaleString()}</span>
                        <span className={`inline-block mt-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          book.status === "completed" ? "bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400" :
                          book.status === "in_progress" ? "bg-blue-100 dark:bg-blue-950/50 text-blue-700 dark:text-cyan-400 animate-pulse" :
                          book.status === "cancelled" ? "bg-red-100 dark:bg-red-950/50 text-red-700 dark:text-red-400" :
                          "bg-amber-100 dark:bg-amber-950/50 text-amber-700 dark:text-amber-400"
                        }`}>
                          {book.status.replace("_", " ")}
                        </span>
                      </div>
                    </div>

                    {/* Timeline & details */}
                    <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800/60 flex flex-wrap gap-y-2 gap-x-4 justify-between items-center text-[11px] text-slate-500 dark:text-slate-400">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span>Date & Time: {new Date(book.dateTime).toLocaleString([], { dateStyle: "short", timeStyle: "short" })}</span>
                      </span>
                      {book.warrantyDays && book.status === "completed" && (
                        <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-semibold bg-emerald-50 dark:bg-emerald-950/20 px-2 py-0.5 rounded-md">
                          <ShieldCheck className="w-3.5 h-3.5" />
                          <span>{book.warrantyDays}-Day Digital Warranty Active</span>
                        </span>
                      )}
                    </div>

                    {/* Action Panel for Booking */}
                    <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800/40 flex flex-wrap gap-2 items-center justify-between">
                      <div className="flex gap-2">
                        <button
                          onClick={() => setActiveBookingId(isActive ? null : book.id)}
                          className="px-3.5 py-1.5 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 text-slate-700 dark:text-slate-300 text-xs font-bold rounded-lg transition-colors"
                        >
                          {isActive ? "Hide Timeline" : "View Timeline / Track"}
                        </button>
                        <button
                          onClick={() => setShowChatId(book.providerId)}
                          className="px-3.5 py-1.5 bg-blue-50 dark:bg-blue-950/20 hover:bg-blue-100 dark:hover:bg-blue-950/40 text-blue-600 dark:text-cyan-400 text-xs font-bold rounded-lg transition-colors flex items-center gap-1"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                          <span>Chat</span>
                        </button>
                      </div>

                      <div className="flex gap-2">
                        {book.status === "pending" && (
                          <button
                            onClick={() => onCancelBooking(book.id)}
                            className="px-3.5 py-1.5 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/10 text-xs font-bold rounded-lg transition-colors"
                          >
                            Cancel Request
                          </button>
                        )}

                        {book.status === "in_progress" && (
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-mono text-slate-400">Completion OTP: <strong className="text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-900 px-1.5 py-0.5 rounded font-bold text-xs">{book.otpCode}</strong></span>
                            <button
                              onClick={() => onCompleteWithOtp(book.id)}
                              className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg transition-all"
                            >
                              Verify OTP & Complete
                            </button>
                          </div>
                        )}

                        {book.status === "completed" && !reviewedBookingId && (
                          <button
                            onClick={() => { setReviewedBookingId(book.id); setReviewComment(""); }}
                            className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold rounded-lg transition-colors"
                          >
                            Leave Review
                          </button>
                        )}

                        {book.status !== "cancelled" && (
                          <button
                            onClick={() => { setComplaintBooking(book); setComplaintText(""); setComplaintMsg(""); }}
                            className="px-3 py-1.5 border border-red-200 hover:bg-red-50/20 text-red-600 text-xs font-semibold rounded-lg transition-colors"
                          >
                            File Complaint
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Timeline Expansion Block */}
                    {isActive && (
                      <div className="mt-5 p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/40 space-y-4 animate-fade-in">
                        {book.status === "in_progress" && (
                          <div className="mb-4 p-3 bg-blue-100/40 dark:bg-blue-950/20 border border-blue-200/40 dark:border-blue-900/40 rounded-xl flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="w-2.5 h-2.5 bg-blue-600 rounded-full animate-ping" />
                              <span className="text-xs text-blue-800 dark:text-blue-300 font-semibold">Live Provider Tracking Active:</span>
                              <span className="text-xs text-slate-500 font-medium font-mono">{trackingDistance}</span>
                            </div>
                            <span className="text-[10px] text-slate-400 font-medium">Auto-refreshing GPS</span>
                          </div>
                        )}

                        <div className="relative border-l border-slate-200 dark:border-slate-800 pl-4 space-y-4">
                          {book.timeline?.map((step, sIdx) => (
                            <div key={sIdx} className="relative">
                              <span className="absolute -left-[21px] top-0.5 w-2.5 h-2.5 bg-blue-500 rounded-full ring-4 ring-slate-100 dark:ring-slate-900" />
                              <div className="text-xs">
                                <div className="flex items-center justify-between gap-2">
                                  <span className="font-bold text-slate-800 dark:text-slate-200 capitalize">{step.status.replace("_", " ")}</span>
                                  <span className="text-[10px] text-slate-400 font-mono">{step.timestamp}</span>
                                </div>
                                <p className="text-slate-500 dark:text-slate-400 mt-0.5">{step.description}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Live Chat & Communication Sidebar */}
        <div>
          {showChatId ? (
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-4 shadow-md flex flex-col h-[500px]">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-900 pb-3 mb-3">
                <div className="flex items-center gap-2.5">
                  <img src={activeChatProvider?.avatar} alt={activeChatProvider?.name} className="w-8 h-8 rounded-full object-cover" referrerPolicy="no-referrer" />
                  <div>
                    <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 leading-none">{activeChatProvider?.name}</h4>
                    <span className="text-[10px] text-emerald-500 font-semibold">Online Chatting</span>
                  </div>
                </div>
                <button onClick={() => setShowChatId(null)} className="p-1 rounded bg-slate-100 dark:bg-slate-900 text-slate-400 hover:text-slate-600">
                  <XIcon className="w-4 h-4" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto space-y-3.5 pr-1">
                {filteredChats.length === 0 ? (
                  <div className="text-center py-12 text-slate-400 text-xs">
                    Start of secure chat. Ask Sajid or any provider about tools, scheduling, or cost.
                  </div>
                ) : (
                  filteredChats.map((c) => (
                    <div key={c.id} className={`flex ${c.senderId === currentUserId ? "justify-end" : "justify-start"}`}>
                      <div className={`max-w-[80%] rounded-xl p-2.5 text-xs ${
                        c.senderId === currentUserId 
                          ? "bg-blue-600 text-white rounded-tr-none" 
                          : "bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-slate-200 rounded-tl-none border border-slate-200/50"
                      }`}>
                        <p>{c.text}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <form onSubmit={handleSendChat} className="mt-3 flex gap-1.5 pt-2 border-t border-slate-100 dark:border-slate-900/50">
                <input
                  type="text"
                  value={chatText}
                  onChange={(e) => setChatText(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 text-xs bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-white rounded-lg px-3 py-2 focus:outline-none"
                />
                <button type="submit" className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            </div>
          ) : (
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-5 shadow-sm text-center py-12">
              <MessageSquare className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300">Live Communication Channel</h4>
              <p className="text-[11px] text-slate-400 mt-1 leading-normal">Select "Chat" next to any service booking to coordinate securely on details with providers.</p>
            </div>
          )}
        </div>
      </div>

      {/* Review Modal */}
      {reviewedBookingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 w-full max-w-md rounded-2xl shadow-2xl p-6 relative">
            <button onClick={() => setReviewedBookingId(null)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600">
              <XIcon className="w-4 h-4" />
            </button>

            <h3 className="font-display font-bold text-base text-slate-900 dark:text-white mb-1">
              Submit Completion Review
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
              Your feedback is audited by AI to ensure authentic reviews and updates provider smart scores.
            </p>

            <div className="space-y-4">
              <div className="flex gap-1.5 justify-center py-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setReviewRating(star)}
                    className="p-1 text-slate-300 hover:text-amber-400 transition-colors"
                  >
                    <Star className={`w-7 h-7 ${star <= reviewRating ? "text-amber-400 fill-amber-400" : ""}`} />
                  </button>
                ))}
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Comments</label>
                <textarea
                  required
                  rows={3}
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  placeholder="Share details about punctuality, behavior, pricing accuracy, and quality of service..."
                  className="w-full text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 text-slate-800 dark:text-white focus:outline-none"
                />
              </div>

              <button
                onClick={() => {
                  const b = bookings.find(b => b.id === reviewedBookingId);
                  if (b) {
                    onAddReview(b.id, b.providerId, reviewRating, reviewComment);
                  }
                  setReviewedBookingId(null);
                }}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold tracking-wider transition-all"
              >
                POST VERIFIED REVIEW
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Complaint Modal */}
      {complaintBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 w-full max-w-md rounded-2xl shadow-2xl p-6 relative">
            <button onClick={() => setComplaintBooking(null)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600">
              <XIcon className="w-4 h-4" />
            </button>

            <h3 className="font-display font-bold text-base text-slate-900 dark:text-white mb-1">
              File Dispute / Complaint
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
              This triggers server-side Gemini sentiment analysis to flag potential fraud, and alerts Hyderabad Admins instantly.
            </p>

            <div className="space-y-4">
              <div className="p-3 bg-red-50/50 dark:bg-red-950/20 border border-red-100 rounded-xl text-[11px] text-red-600">
                Dispute against <strong>{complaintBooking.providerName}</strong> for booking <strong>{complaintBooking.service}</strong>.
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Issue Details</label>
                <textarea
                  required
                  rows={4}
                  value={complaintText}
                  onChange={(e) => setComplaintText(e.target.value)}
                  placeholder="Provide precise details, e.g. delay, extra pricing asked, unfinished work, etc."
                  className="w-full text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 text-slate-800 dark:text-white focus:outline-none"
                />
              </div>

              {complaintMsg && (
                <div className="p-3 rounded-xl bg-blue-50/50 border border-blue-100 text-[11px] text-blue-700">
                  {complaintMsg}
                </div>
              )}

              <button
                onClick={async () => {
                  setComplaintMsg("Analyzing complaint and registering dispute with Hyderabad admin desk...");
                  try {
                    const res = await fetch("/api/ai/complaint", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ complaintText, bookingId: complaintBooking.id })
                    });
                    const analysis = await res.json();
                    
                    onSubmitComplaint(
                      complaintBooking.id, 
                      complaintBooking.providerId, 
                      complaintBooking.providerName, 
                      `[Analysis: ${analysis.analysis} | Urgency: ${analysis.urgency} | Fraud suspected: ${analysis.isFraudSuspected}] ${complaintText}`
                    );
                    
                    setComplaintMsg(`Dispute created. Admin response priority: ${analysis.urgency}. Action Plan: ${analysis.actionPlan}`);
                    setTimeout(() => {
                      setComplaintBooking(null);
                    }, 4000);
                  } catch (err) {
                    onSubmitComplaint(complaintBooking.id, complaintBooking.providerId, complaintBooking.providerName, complaintText);
                    setComplaintBooking(null);
                  }
                }}
                className="w-full py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold tracking-wider transition-all"
              >
                SUBMIT COMPLAINT
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Inline fallback X icon
function XIcon(props: any) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
  );
}
