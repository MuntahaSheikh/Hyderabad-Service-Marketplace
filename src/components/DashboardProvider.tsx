import React, { useState, useMemo } from "react";
import { Booking, UserProfile, ChatMessage } from "../types";
import { 
  CheckCircle, 
  X, 
  MapPin, 
  Sparkles, 
  DollarSign, 
  User, 
  MessageSquare, 
  Clock, 
  QrCode, 
  Award, 
  Calendar, 
  Send, 
  Briefcase, 
  Percent, 
  Camera, 
  Activity,
  Layers,
  ChevronRight,
  Plus,
  Trash2,
  Video,
  Settings,
  ShieldCheck,
  Check
} from "lucide-react";
import { 
  showConfirm, 
  showSuccess, 
  showError, 
  showToast, 
  promptOtpInput 
} from "../lib/notifications";

interface DashboardProviderProps {
  bookings: Booking[];
  currentUserId: string;
  currentUserProfile: UserProfile;
  chats: ChatMessage[];
  onSendMessage: (receiverId: string, text: string) => void;
  onUpdateBookingStatus: (bookingId: string, newStatus: Booking["status"], description: string) => void;
  onUpdateProfile: (updates: Partial<UserProfile>) => void;
}

export default function DashboardProvider({
  bookings,
  currentUserId,
  currentUserProfile,
  chats,
  onSendMessage,
  onUpdateBookingStatus,
  onUpdateProfile
}: DashboardProviderProps) {
  const [showChatId, setShowChatId] = useState<string | null>(null);
  const [chatText, setChatText] = useState("");
  const [activeTab, setActiveTab] = useState<"overview" | "packages" | "coupons" | "maintenance" | "planner_assets">("overview");

  // In-UI Notification Banner (instead of generic alerts)
  const [uiNotification, setUiNotification] = useState<string | null>(null);

  // Profile fields state
  const [tagline, setTagline] = useState(currentUserProfile.tagline || "");
  const [bio, setBio] = useState(currentUserProfile.bio || "");
  const [baseRate, setBaseRate] = useState(currentUserProfile.baseRate || 50000);
  const [skills, setSkills] = useState(currentUserProfile.skills?.join(", ") || "");
  const [availability, setAvailability] = useState(currentUserProfile.availability || "Available");

  // State arrays initialized from props or seed data fallbacks
  const [packages, setPackages] = useState(currentUserProfile.packages || [
    { name: "Silver Elegance Package", price: 180000, details: ["Hall rental (6 hours)", "Standard floral entry decor", "Stage setup & lighting"] },
    { name: "Gold Royal Package", price: 290000, details: ["Hall rental & premium suite", "High-end floral stage design", "Professional ambient lighting"] }
  ]);

  const [coupons, setCoupons] = useState(currentUserProfile.coupons || [
    { code: "SHALIMAR99", discount: "PKR 15,000 Flat Off", expiry: "2026-12-31" }
  ]);

  const [maintenanceSchedule, setMaintenanceSchedule] = useState(currentUserProfile.maintenanceSchedule || [
    { date: "2026-07-15", task: "Central Air Conditioning System Servicing" },
    { date: "2026-07-28", task: "Garden lawn redesigning and deep cleaning" }
  ]);

  // AI profile generator state
  const [generatingBio, setGeneratingBio] = useState(false);
  const [showAiModal, setShowAiModal] = useState(false);
  const [aiSkillsInput, setAiSkillsInput] = useState("");
  const [aiBioInput, setAiBioInput] = useState("");

  // AI Quote/Invoice state
  const [showQuoteModal, setShowQuoteModal] = useState(false);
  const [quoteDesc, setQuoteDesc] = useState("");
  const [quoteDetails, setQuoteDetails] = useState<any>(null);
  const [generatingQuote, setGeneratingQuote] = useState(false);

  // OTP Verification
  const [otpVerifyBookingId, setOtpVerifyBookingId] = useState<string | null>(null);
  const [enteredOtp, setEnteredOtp] = useState("");
  const [otpError, setOtpError] = useState("");

  // Withdrawal states
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [withdrawMethod, setWithdrawMethod] = useState("JazzCash");
  const [withdrawAccount, setWithdrawAccount] = useState("0300-1234567");
  const [withdrawMsg, setWithdrawMsg] = useState("");

  // Role details helper
  const roleType = currentUserProfile.role || "vendor";

  // Virtual Tour Simulator state (Hall Owner specific)
  const [cameraPan, setCameraPan] = useState(0);
  const [cameraZoom, setCameraZoom] = useState(1);
  const [spotlightsActive, setSpotlightsActive] = useState(true);
  const [acTemperature, setAcTemperature] = useState(19);

  // Asset Logger state (Event Planner specific)
  const [assets, setAssets] = useState([
    { name: "4K Quadcopter Drone Set", serial: "DJI-I3-0091", status: "Operational", assignedTo: "Ahmed (Pilot)" },
    { name: "Modular P3 LED Wall Modules", serial: "LED-P3-440", status: "Operational", assignedTo: "Tariq Media" },
    { name: "JBL Line-Array Sound Stack", serial: "JBL-LA-12A", status: "Under Maintenance", assignedTo: "Saddar Warehouse" },
    { name: "Wireless Sennheiser Vocal Sets", serial: "SEN-W-9002", status: "Operational", assignedTo: "Anas (Lead Planner)" }
  ]);

  const [newAssetName, setNewAssetName] = useState("");
  const [newAssetSerial, setNewAssetSerial] = useState("");
  const [newAssetAssigned, setNewAssetAssigned] = useState("");

  // Day-of-Event sequence tracker (Event Planner specific)
  const [weddingSequence, setWeddingSequence] = useState([
    { time: "05:00 PM", event: "Vendor Arrivals & Stage Flower Installation", status: "Completed" },
    { time: "07:30 PM", event: "Groom (Barat) Entrance & Rose Petals Cannon", status: "Ongoing" },
    { time: "08:15 PM", event: "Nikah Ceremony & Ring Exchange Protocol", status: "Scheduled" },
    { time: "09:00 PM", event: "Dinner Buffet Launch & Designer Cake Cutting", status: "Scheduled" },
    { time: "11:00 PM", event: "Bride send-off (Rukhsati) & Luxury Car Departure", status: "Scheduled" }
  ]);

  // Package creator state
  const [newPkgName, setNewPkgName] = useState("");
  const [newPkgPrice, setNewPkgPrice] = useState("");
  const [newPkgDetails, setNewPkgDetails] = useState("");

  // Coupon creator state
  const [newCpnCode, setNewCpnCode] = useState("");
  const [newCpnDiscount, setNewCpnDiscount] = useState("");
  const [newCpnExpiry, setNewCpnExpiry] = useState("");

  // Filter bookings for this provider
  const myBookings = bookings.filter(b => b.providerId === currentUserId);
  const activeJobs = myBookings.filter(b => b.status !== "completed" && b.status !== "cancelled");
  const completedJobsCount = myBookings.filter(b => b.status === "completed").length;

  const totalEarnings = myBookings
    .filter(b => b.status === "completed")
    .reduce((sum, b) => sum + b.price, 0) * 0.9; // 10% platform commission deduction

  const triggerNotification = (msg: string) => {
    setUiNotification(msg);
    // Clean up msg prefix for SweetAlert2 toast
    const cleanMsg = msg.replace(/^✓\s*/, "").replace(/^🚨\s*/, "");
    const isError = msg.toLowerCase().includes("could not") || msg.toLowerCase().includes("error") || msg.toLowerCase().includes("invalid") || msg.toLowerCase().includes("incorrect");
    showToast(cleanMsg, isError ? "error" : "success");
    setTimeout(() => {
      setUiNotification(null);
    }, 4500);
  };

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatText.trim() || !showChatId) return;
    onSendMessage(showChatId, chatText);
    setChatText("");
  };

  const handleAcceptJob = async (job: Booking) => {
    const confirm = await showConfirm(
      "Accept Booking Request?",
      `Are you sure you want to accept this booking request from ${job.customerName} for ${job.service}?`,
      "Yes, Accept",
      "No, Go Back"
    );
    if (confirm) {
      onUpdateBookingStatus(job.id, "accepted", "Booking accepted. Custom setup initiating.");
      triggerNotification("✓ Booking accepted successfully!");
    }
  };

  const handleDeclineJob = async (job: Booking) => {
    const confirm = await showConfirm(
      "Decline Booking Request?",
      `Are you sure you want to decline this booking request from ${job.customerName}?`,
      "Yes, Decline",
      "No, Go Back"
    );
    if (confirm) {
      onUpdateBookingStatus(job.id, "cancelled", "Provider declined the dispatch request");
      triggerNotification("✓ Booking request declined.");
    }
  };

  const handleStartJob = async (job: Booking) => {
    const confirm = await showConfirm(
      "Start Job?",
      `Are you ready to mark your arrival and start work for ${job.customerName}?`,
      "Yes, Start",
      "No, Wait"
    );
    if (confirm) {
      onUpdateBookingStatus(job.id, "in_progress", "Provider has arrived on customer site and started setups");
      triggerNotification("✓ Job marked as in progress.");
    }
  };

  const activeChatCustomer = myBookings.find(b => b.customerId === showChatId);
  const filteredChats = chats.filter(
    c => (c.senderId === currentUserId && c.receiverId === showChatId) || 
         (c.senderId === showChatId && c.receiverId === currentUserId)
  );

  const handleUpdateProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile({
      tagline,
      bio,
      baseRate: Number(baseRate),
      skills: skills.split(",").map(s => s.trim()),
      availability,
      packages,
      coupons,
      maintenanceSchedule
    });
    triggerNotification("✓ Business profile configurations updated successfully!");
  };

  const handleGenerateAiBio = async () => {
    setGeneratingBio(true);
    try {
      const response = await fetch("/api/ai/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          providerName: currentUserProfile.name,
          category: currentUserProfile.category || "Wedding Services",
          skills: aiSkillsInput || skills,
          bioDetails: aiBioInput
        })
      });
      const data = await response.json();
      if (data.description) {
        setBio(data.description);
        setTagline(data.tagline);
        setShowAiModal(false);
        triggerNotification("✓ AI biography generated and loaded!");
      }
    } catch (err) {
      console.error(err);
      triggerNotification("Could not contact AI. Fallback biography loaded.");
    } finally {
      setGeneratingBio(false);
    }
  };

  const handleGenerateAiQuote = async () => {
    setGeneratingQuote(true);
    try {
      const response = await fetch("/api/ai/estimate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category: currentUserProfile.category,
          service: currentUserProfile.category + " premium service line",
          description: quoteDesc
        })
      });
      const data = await response.json();
      setQuoteDetails(data);
    } catch (err) {
      console.error(err);
    } finally {
      setGeneratingQuote(false);
    }
  };

  const handleOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const b = bookings.find(b => b.id === otpVerifyBookingId);
    if (b) {
      if (b.otpCode === enteredOtp.trim()) {
        onUpdateBookingStatus(b.id, "completed", "Event service completed with verified customer OTP code matching successfully");
        setOtpVerifyBookingId(null);
        setEnteredOtp("");
        setOtpError("");
        showSuccess("Booking Finalized!", `✓ Booking finalized! PKR ${b.price.toLocaleString()} added to wallet balance.`);
        triggerNotification("✓ Booking finalized successfully!");
      } else {
        const errorMsg = "Incorrect 4-digit code. Please verify the code displayed on the customer's portal screen.";
        setOtpError(errorMsg);
        showError("Verification Failed", errorMsg);
      }
    }
  };

  const handleWithdrawSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (Number(withdrawAmount) > totalEarnings) {
      const errorMsg = "Insufficient earnings balance for transfer.";
      setWithdrawMsg(errorMsg);
      showError("Withdrawal Failed", errorMsg);
      return;
    }
    const successMsg = `Withdrawal initiated! PKR ${Number(withdrawAmount).toLocaleString()} is being routed instantly to your ${withdrawMethod} wallet account ${withdrawAccount}. Available in 15 mins.`;
    setWithdrawMsg(successMsg);
    showSuccess("Withdrawal Initiated!", successMsg);
    setTimeout(() => {
      setShowWithdrawModal(false);
      setWithdrawMsg("");
      setWithdrawAmount("");
    }, 4000);
  };

  const handleAddPackage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPkgName || !newPkgPrice) return;
    const detailsArr = newPkgDetails.split(",").map(d => d.trim()).filter(Boolean);
    const updated = [...packages, { name: newPkgName, price: Number(newPkgPrice), details: detailsArr }];
    setPackages(updated);
    setNewPkgName("");
    setNewPkgPrice("");
    setNewPkgDetails("");
    triggerNotification("✓ Package created and added to listings!");
  };

  const handleAddCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCpnCode || !newCpnDiscount) return;
    const updated = [...coupons, { code: newCpnCode.toUpperCase().replace(/\s/g, ""), discount: newCpnDiscount, expiry: newCpnExpiry || "2026-12-31" }];
    setCoupons(updated);
    setNewCpnCode("");
    setNewCpnDiscount("");
    setNewCpnExpiry("");
    triggerNotification("✓ Promo coupon " + newCpnCode.toUpperCase() + " is now active.");
  };

  const handleDeletePackage = (index: number) => {
    const updated = packages.filter((_, i) => i !== index);
    setPackages(updated);
    triggerNotification("✓ Package removed.");
  };

  const handleDeleteCoupon = (index: number) => {
    const updated = coupons.filter((_, i) => i !== index);
    setCoupons(updated);
    triggerNotification("✓ Coupon code disabled.");
  };

  // Add Asset helper
  const handleAddAsset = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAssetName || !newAssetSerial) return;
    setAssets([...assets, { name: newAssetName, serial: newAssetSerial, status: "Operational", assignedTo: newAssetAssigned || "Unassigned" }]);
    setNewAssetName("");
    setNewAssetSerial("");
    setNewAssetAssigned("");
    triggerNotification("✓ Heavy equipment asset logged in inventory.");
  };

  // Update event status helper
  const toggleSequenceStatus = (index: number) => {
    const sequenceCopy = [...weddingSequence];
    const current = sequenceCopy[index].status;
    let next: "Scheduled" | "Ongoing" | "Completed" = "Scheduled";
    if (current === "Scheduled") next = "Ongoing";
    else if (current === "Ongoing") next = "Completed";
    else next = "Scheduled";
    
    sequenceCopy[index].status = next;
    setWeddingSequence(sequenceCopy);
    triggerNotification(`✓ '${sequenceCopy[index].event}' status updated to ${next}.`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in bg-[#FAFAFA] min-h-screen">
      {/* UI Notifications */}
      {uiNotification && (
        <div className="fixed bottom-5 right-5 z-50 bg-slate-900 text-white px-5 py-3.5 rounded-xl shadow-2xl text-xs font-bold animate-bounce border border-slate-700/50 flex items-center gap-2">
          <div className="w-2 h-2 bg-emerald-400 rounded-full animate-ping" />
          <span>{uiNotification}</span>
        </div>
      )}

      {/* Header Profile Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="md:col-span-2 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-950 text-white p-6 shadow-xl flex justify-between items-center relative overflow-hidden">
          <div className="absolute -right-10 -bottom-10 w-44 h-44 bg-white/5 rounded-full filter blur-xl" />
          <div className="flex items-center gap-4 z-10">
            <img src={currentUserProfile.avatar} alt={currentUserProfile.name} className="w-16 h-16 rounded-full border-2 border-white/20 object-cover" />
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="font-display font-bold text-lg leading-none">{currentUserProfile.name}</h2>
                <span className="text-[9px] bg-amber-500 text-slate-950 px-2 py-0.5 rounded-full font-black uppercase tracking-wider">
                  {roleType.replace("_", " ")}
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-amber-400" />
                <span>Base Location: {currentUserProfile.location}, Hyderabad</span>
              </p>
            </div>
          </div>

          <div className="text-center bg-white/10 border border-white/10 px-3.5 py-2 rounded-xl z-10">
            <span className="text-[8px] uppercase font-bold tracking-widest text-slate-400 block">Trust Score</span>
            <span className="text-lg font-black block mt-0.5 font-mono text-emerald-400">{currentUserProfile.trustScore || 98}%</span>
          </div>
        </div>

        {/* Analytics balance */}
        <div className="rounded-2xl border border-slate-200/60 bg-white p-5 shadow-sm flex flex-col justify-between">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Completed Volume Earnings</span>
            <span className="text-2xl font-black text-slate-900 font-mono block mt-1">
              PKR {totalEarnings.toLocaleString()}
            </span>
            <span className="text-[9px] text-emerald-600 font-bold block mt-1">✓ 10% Platform fee processed</span>
          </div>
          <button 
            onClick={() => setShowWithdrawModal(true)}
            className="w-full mt-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-[11px] font-bold rounded-lg transition-colors tracking-wider"
          >
            WITHDRAW FUNDS
          </button>
        </div>

        {/* Success Scoreboard */}
        <div className="rounded-2xl border border-slate-200/60 bg-white p-5 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Customer Satisfaction</span>
              <span className="text-2xl font-black text-slate-900 font-mono block mt-1">
                {completedJobsCount} <span className="text-xs text-slate-400 font-sans font-normal">Events Delivered</span>
              </span>
            </div>
            <span className="text-xs font-black text-amber-600 bg-amber-50 px-2.5 py-1 rounded-md flex items-center gap-0.5">
              ★ {currentUserProfile.rating || "5.0"}
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-[10px] text-slate-400 mt-2 font-medium">
            <Award className="w-4 h-4 text-amber-500" />
            <span>Top Tier Event Services Endorsement</span>
          </div>
        </div>
      </div>

      {/* Role specific Dashboard Navigation Bar */}
      <div className="flex overflow-x-auto gap-2 pb-2 mb-8 border-b border-slate-200/60 scrollbar-none text-xs font-bold text-slate-500">
        <button
          onClick={() => setActiveTab("overview")}
          className={`px-4 py-2.5 rounded-lg transition-all shrink-0 ${
            activeTab === "overview" 
              ? "bg-slate-900 text-white shadow-sm" 
              : "bg-white border border-slate-200/40 hover:text-slate-950"
          }`}
        >
          Overview & Bookings
        </button>

        <button
          onClick={() => setActiveTab("packages")}
          className={`px-4 py-2.5 rounded-lg transition-all shrink-0 flex items-center gap-1 ${
            activeTab === "packages" 
              ? "bg-slate-900 text-white shadow-sm" 
              : "bg-white border border-slate-200/40 hover:text-slate-950"
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Service Packages ({packages.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("coupons")}
          className={`px-4 py-2.5 rounded-lg transition-all shrink-0 flex items-center gap-1 ${
            activeTab === "coupons" 
              ? "bg-slate-900 text-white shadow-sm" 
              : "bg-white border border-slate-200/40 hover:text-slate-950"
          }`}
        >
          <Percent className="w-3.5 h-3.5" />
          <span>Coupons & Promos ({coupons.length})</span>
        </button>

        {/* Hall Owner exclusive tab */}
        {roleType === "hall_owner" && (
          <button
            onClick={() => setActiveTab("maintenance")}
            className={`px-4 py-2.5 rounded-lg transition-all shrink-0 flex items-center gap-1.5 ${
              activeTab === "maintenance" 
                ? "bg-emerald-600 text-white shadow-sm" 
                : "bg-emerald-50 text-emerald-800 border border-emerald-100 hover:bg-emerald-100/50"
            }`}
          >
            <Video className="w-3.5 h-3.5 animate-pulse" />
            <span>Virtual Tour & Maintenance</span>
          </button>
        )}

        {/* Event Planner exclusive tab */}
        {roleType === "event_planner" && (
          <button
            onClick={() => setActiveTab("planner_assets")}
            className={`px-4 py-2.5 rounded-lg transition-all shrink-0 flex items-center gap-1.5 ${
              activeTab === "planner_assets" 
                ? "bg-fuchsia-600 text-white shadow-sm" 
                : "bg-fuchsia-50 text-fuchsia-800 border border-fuchsia-100 hover:bg-fuchsia-100/50"
            }`}
          >
            <Camera className="w-3.5 h-3.5" />
            <span>Drone Assets & Sequence Orchestration</span>
          </button>
        )}
      </div>

      {/* TAB CONTENT: Overview & Bookings */}
      {activeTab === "overview" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="font-display font-bold text-xs uppercase tracking-wider text-slate-400">
                Incoming Event Requests ({activeJobs.length})
              </h3>
              <button 
                onClick={() => setShowQuoteModal(true)}
                className="px-3 py-1.5 bg-blue-50 text-blue-600 text-xs font-bold rounded-lg hover:bg-blue-100/50 flex items-center gap-1 transition-all border border-blue-100"
              >
                <Sparkles className="w-3.5 h-3.5 text-blue-500 animate-pulse" />
                <span>AI Booking Estimator</span>
              </button>
            </div>

            {activeJobs.length === 0 ? (
              <div className="text-center py-12 rounded-2xl border border-dashed border-slate-200 bg-white">
                <Calendar className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <p className="text-xs text-slate-500 font-medium">No pending bookings. Ensure your status is toggled to 'Available' below.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {activeJobs.map((job) => (
                  <div key={job.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <span className="inline-block px-2.5 py-0.5 rounded bg-amber-50 text-amber-800 text-[10px] font-black uppercase mb-2 border border-amber-100">
                          {job.service}
                        </span>
                        <h4 className="font-display font-black text-slate-900 text-base">
                          Client: {job.customerName}
                        </h4>
                        <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-blue-500" />
                          <span>Venue Area: {job.customerLocation}</span>
                        </p>
                        {job.notes && (
                          <div className="p-3 mt-3 bg-slate-50 rounded-lg text-slate-600 text-[11px] border border-slate-100 italic">
                            <strong>Event Specifications:</strong> "{job.notes}"
                          </div>
                        )}
                      </div>

                      <div className="text-right shrink-0">
                        <span className="font-mono text-sm font-black text-slate-950 block">PKR {job.price.toLocaleString()}</span>
                        <span className="text-[10px] text-slate-400 block mt-1 font-medium">{new Date(job.dateTime).toLocaleString([], { dateStyle: "short", timeStyle: "short" })}</span>
                      </div>
                    </div>

                    <div className="mt-5 pt-4 border-t border-slate-100 flex flex-wrap gap-2 items-center justify-between">
                      <button
                        onClick={() => setShowChatId(job.customerId)}
                        className="px-3 py-1.5 border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-lg transition-colors flex items-center gap-1"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>Instant Chat</span>
                      </button>

                      <div className="flex gap-1.5">
                        {job.status === "pending" && (
                          <>
                            <button
                              onClick={() => handleDeclineJob(job)}
                              className="px-3 py-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 text-xs font-bold rounded-lg transition-colors"
                            >
                              Decline
                            </button>
                            <button
                              onClick={() => handleAcceptJob(job)}
                              className="px-4 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-lg transition-colors"
                            >
                              Accept Booking
                            </button>
                          </>
                        )}

                        {job.status === "accepted" && (
                          <button
                            onClick={() => handleStartJob(job)}
                            className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg transition-colors"
                          >
                            Mark Active Setup
                          </button>
                        )}

                        {job.status === "in_progress" && (
                          <button
                            onClick={() => setOtpVerifyBookingId(job.id)}
                            className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg transition-colors"
                          >
                            Finalize Event (Enter OTP)
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Profile configuration card */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex justify-between items-start mb-4 border-b border-slate-100 pb-4">
                <div>
                  <h4 className="font-display font-bold text-base text-slate-900">Marketplace Listing Settings</h4>
                  <p className="text-xs text-slate-500">Configure your public business profile across Sindh registries.</p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowAiModal(true)}
                  className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1 shadow-sm"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>AI Copywriter</span>
                </button>
              </div>

              <form onSubmit={handleUpdateProfileSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Business Slogan / Tagline</label>
                    <input
                      type="text"
                      value={tagline}
                      onChange={(e) => setTagline(e.target.value)}
                      className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-800 focus:outline-none focus:border-slate-400"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Availability Switch</label>
                    <select
                      value={availability}
                      onChange={(e) => setAvailability(e.target.value)}
                      className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-800 focus:outline-none focus:border-slate-400 font-semibold"
                    >
                      <option value="Available">Available for Bookings</option>
                      <option value="Busy">Busy (Locked)</option>
                      <option value="Holiday">Vacation Mode</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Starting Base Booking Rate (PKR)</label>
                    <input
                      type="number"
                      value={baseRate}
                      onChange={(e) => setBaseRate(Number(e.target.value))}
                      className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-800 font-mono focus:outline-none focus:border-slate-400"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Core Specialties (Comma-separated)</label>
                    <input
                      type="text"
                      value={skills}
                      onChange={(e) => setSkills(e.target.value)}
                      className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-800 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Company Biography & Portfolio Outline</label>
                  <textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    rows={4}
                    className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-800 focus:outline-none focus:border-slate-400 leading-relaxed"
                  />
                </div>

                <button
                  type="submit"
                  className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl tracking-wider transition-colors shadow-sm"
                >
                  SAVE LISTING CONFIGURATION
                </button>
              </form>
            </div>
          </div>

          {/* RIGHT SIDEBAR: Live Customer Chat & Digital Board */}
          <div>
            {showChatId ? (
              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm flex flex-col h-[480px]">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-3">
                  <div>
                    <h4 className="text-xs font-black text-slate-800 leading-none">{activeChatCustomer?.customerName || "Customer Link"}</h4>
                    <span className="text-[10px] text-emerald-600 font-bold block mt-1">✓ Instant Realtime Feed</span>
                  </div>
                  <button onClick={() => setShowChatId(null)} className="p-1 rounded bg-slate-100 text-slate-400">
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto space-y-3 pr-1">
                  {filteredChats.length === 0 ? (
                    <p className="text-xs text-slate-400 italic text-center py-6">No previous messages. Send a message to initiate.</p>
                  ) : (
                    filteredChats.map((c) => (
                      <div key={c.id} className={`flex ${c.senderId === currentUserId ? "justify-end" : "justify-start"}`}>
                        <div className={`max-w-[85%] rounded-xl p-2.5 text-xs ${
                          c.senderId === currentUserId 
                            ? "bg-slate-900 text-white rounded-tr-none" 
                            : "bg-slate-100 text-slate-800 rounded-tl-none border border-slate-200/50"
                        }`}>
                          <p>{c.text}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                <form onSubmit={handleSendChat} className="mt-3 flex gap-1.5 pt-2 border-t border-slate-100">
                  <input
                    type="text"
                    value={chatText}
                    onChange={(e) => setChatText(e.target.value)}
                    placeholder="Type professional reply..."
                    className="flex-1 text-xs bg-slate-100 text-slate-800 rounded-lg px-3 py-2 focus:outline-none"
                  />
                  <button type="submit" className="p-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors">
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </form>
              </div>
            ) : (
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm text-center relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-1.5 bg-slate-900" />
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-4">Verification QR Code</span>
                
                <div className="flex justify-center mb-4">
                  <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 w-fit shadow-sm">
                    <QrCode className="w-24 h-24 text-slate-800" />
                  </div>
                </div>

                <h4 className="font-display font-black text-slate-900 text-base leading-none">{currentUserProfile.name}</h4>
                <p className="text-[10px] text-blue-600 font-bold uppercase mt-1 tracking-widest">{currentUserProfile.category || "Banquet Hall"}</p>
                
                <p className="text-xs text-slate-500 mt-3 px-3 italic leading-normal">
                  "{currentUserProfile.tagline || "Providing luxury event spaces in Hyderabad."}"
                </p>

                <div className="mt-5 p-3 rounded-xl bg-slate-50 border border-slate-100 text-left text-xs space-y-2 text-slate-500">
                  <div className="flex justify-between">
                    <span>Identity Status</span>
                    <span className="font-bold text-emerald-600">✓ approved (KYC)</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Reviews Count</span>
                    <span className="font-bold text-slate-800">★ {currentUserProfile.rating || "5.0"} ({currentUserProfile.reviewCount || 10} reviews)</span>
                  </div>
                  <div className="flex justify-between">
                    <span>CNIC Record</span>
                    <span className="font-mono font-bold text-slate-700">{currentUserProfile.cnic || "41303-XXXXXXX-X"}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB CONTENT: Service Packages */}
      {activeTab === "packages" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
              <h3 className="font-display font-bold text-base text-slate-900 mb-2">Configure Tiered Services Packages</h3>
              <p className="text-xs text-slate-500 mb-6">Create predefined price packages that customers can instantly select and book from your listing.</p>

              <div className="space-y-4">
                {packages.map((pkg, index) => (
                  <div key={index} className="p-4 border border-slate-200/60 rounded-xl bg-[#FAFAFA] flex justify-between items-start gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-sm text-slate-900">{pkg.name}</h4>
                        <span className="text-[11px] text-blue-600 font-mono font-black">PKR {pkg.price.toLocaleString()}</span>
                      </div>
                      <div className="flex flex-wrap gap-1 pt-1.5">
                        {pkg.details.map((detail, dIdx) => (
                          <span key={dIdx} className="px-2 py-0.5 bg-white border border-slate-200 text-[10px] text-slate-600 rounded">
                            {detail}
                          </span>
                        ))}
                      </div>
                    </div>

                    <button 
                      onClick={() => handleDeletePackage(index)}
                      className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div>
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
              <h4 className="font-display font-bold text-sm text-slate-900 mb-4 flex items-center gap-1">
                <Plus className="w-4 h-4 text-blue-500" />
                <span>Create New Package</span>
              </h4>

              <form onSubmit={handleAddPackage} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase mb-1">Package Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Diamond Walima Special"
                    value={newPkgName}
                    onChange={(e) => setNewPkgName(e.target.value)}
                    className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-800 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase mb-1">Package Pricing (PKR)</label>
                  <input
                    type="number"
                    required
                    placeholder="e.g. 450000"
                    value={newPkgPrice}
                    onChange={(e) => setNewPkgPrice(e.target.value)}
                    className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-800 font-mono focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase mb-1">Included Services (Comma separated)</label>
                  <textarea
                    rows={3}
                    required
                    placeholder="e.g. Luxury Florals, Air-conditioned Hall, 8 Chauffeur Valets, Live Stage Sound"
                    value={newPkgDetails}
                    onChange={(e) => setNewPkgDetails(e.target.value)}
                    className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-800 focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl tracking-wider transition-colors"
                >
                  ADD PACKAGE TO PROFILE
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: Coupons & Promos */}
      {activeTab === "coupons" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
              <h3 className="font-display font-bold text-base text-slate-900 mb-2">Coupons & Referral Marketing Desk</h3>
              <p className="text-xs text-slate-500 mb-6">Configure custom coupon codes that clients can enter at checkout for immediate rate discounts.</p>

              <div className="space-y-4">
                {coupons.map((cpn, index) => (
                  <div key={index} className="p-4 border border-dashed border-slate-200 rounded-xl bg-white flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div className="px-3 py-1.5 bg-blue-50 border border-blue-100 text-blue-700 font-mono font-black rounded-lg text-xs tracking-wider">
                        {cpn.code}
                      </div>
                      <div>
                        <span className="text-xs font-bold text-slate-900 block">{cpn.discount}</span>
                        <span className="text-[10px] text-slate-400 block font-medium">Valid till: {cpn.expiry}</span>
                      </div>
                    </div>

                    <button 
                      onClick={() => handleDeleteCoupon(index)}
                      className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div>
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
              <h4 className="font-display font-bold text-sm text-slate-900 mb-4 flex items-center gap-1">
                <Plus className="w-4 h-4 text-blue-500" />
                <span>Create New Coupon</span>
              </h4>

              <form onSubmit={handleAddCoupon} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase mb-1">Coupon Code</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. EIDGLAM80"
                    value={newCpnCode}
                    onChange={(e) => setNewCpnCode(e.target.value)}
                    className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-800 font-mono uppercase focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase mb-1">Discount Specifier</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. PKR 10,000 Flat Off or 15% OFF"
                    value={newCpnDiscount}
                    onChange={(e) => setNewCpnDiscount(e.target.value)}
                    className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-800 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase mb-1">Expiration Date</label>
                  <input
                    type="date"
                    value={newCpnExpiry}
                    onChange={(e) => setNewCpnExpiry(e.target.value)}
                    className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-800 focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl tracking-wider transition-colors"
                >
                  ACTIVATE PROMO CODE
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: Halls & Maintenance (Hall Owner Only) */}
      {activeTab === "maintenance" && roleType === "hall_owner" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Virtual Tour Interactive Simulator */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-display font-black text-slate-900 text-base">Immersive 3D/360 Virtual Tour Simulator</h3>
                  <p className="text-xs text-slate-500">Provide prospective wedding families an interactive pan/zoom simulator of Shalimar Gardens.</p>
                </div>
                <span className="px-2.5 py-1 bg-emerald-50 text-emerald-800 text-[10px] font-bold rounded-md border border-emerald-100 flex items-center gap-1">
                  <Activity className="w-3.5 h-3.5 animate-pulse text-emerald-600" />
                  <span>360 camera FEED LIVE</span>
                </span>
              </div>

              {/* Simulated camera view */}
              <div className="aspect-video w-full rounded-xl bg-slate-950 border border-slate-900 relative overflow-hidden shadow-inner flex items-center justify-center">
                {/* Visual grid rendering camera direction based on states */}
                <div 
                  className="absolute inset-0 bg-cover bg-center transition-all duration-300 filter brightness-90"
                  style={{
                    backgroundImage: `url('https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=1000')`,
                    transform: `scale(${cameraZoom}) rotate(${cameraPan}deg)`,
                    filter: spotlightsActive ? "brightness(1) contrast(1.05)" : "brightness(0.4) contrast(0.9)"
                  }}
                />

                {/* Simulated overlay stats */}
                <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-sm border border-white/10 text-white px-3 py-1.5 rounded-lg text-[10px] font-mono space-y-0.5">
                  <p>CAM: Autobahn PTZ-12</p>
                  <p>PAN OFFSET: {cameraPan}°</p>
                  <p>ZOOM MULTIPLIER: {cameraZoom}x</p>
                  <p>STAGE ILLUMINATION: {spotlightsActive ? "100% ROYAL ACTIVE" : "0% OFF"}</p>
                </div>

                {/* Interactive labels showing stage items */}
                <div className="absolute bottom-4 left-4 right-4 bg-black/60 backdrop-blur-md border border-white/10 text-white p-3 rounded-lg text-[11px] flex justify-between items-center">
                  <span>Capacity Index: <strong>{currentUserProfile.capacity || 1200} guests max</strong></span>
                  <div className="flex items-center gap-3">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                    <span>HVAC TEMP: <strong>{acTemperature}°C (Central AC)</strong></span>
                  </div>
                </div>
              </div>

              {/* Camera controls */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4 pt-4 border-t border-slate-100">
                <button 
                  onClick={() => setCameraPan(prev => Math.max(prev - 15, -45))}
                  className="py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-[11px] font-bold rounded-lg transition-colors"
                >
                  ◀ PAN LEFT
                </button>
                <button 
                  onClick={() => setCameraPan(prev => Math.min(prev + 15, 45))}
                  className="py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-[11px] font-bold rounded-lg transition-colors"
                >
                  PAN RIGHT ▶
                </button>
                <button 
                  onClick={() => setCameraZoom(prev => prev === 1 ? 1.5 : 1)}
                  className="py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-[11px] font-bold rounded-lg transition-colors"
                >
                  🔍 TOGGLE ZOOM ({cameraZoom}x)
                </button>
                <button 
                  onClick={() => setSpotlightsActive(prev => !prev)}
                  className={`py-2 text-[10px] font-black rounded-lg transition-colors ${
                    spotlightsActive ? "bg-amber-100 text-amber-800 border border-amber-200" : "bg-slate-200 text-slate-600"
                  }`}
                >
                  💡 SPOTLIGHTS: {spotlightsActive ? "ACTIVE" : "OFF"}
                </button>
              </div>
            </div>

            {/* Maintenance checklist schedule */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
              <h3 className="font-display font-bold text-base text-slate-900 mb-2">Banquet Maintenance Planner</h3>
              <p className="text-xs text-slate-500 mb-6">Schedule routine inspections of central compressors, flower storage refrigeration, and lawn landscaping.</p>

              <div className="space-y-3.5 text-xs">
                {maintenanceSchedule.map((m, idx) => (
                  <div key={idx} className="flex justify-between items-center p-3.5 bg-slate-50 border border-slate-100 rounded-xl">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 bg-emerald-50 text-emerald-700 rounded-lg">
                        <ShieldCheck className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="font-bold text-slate-900 block">{m.task}</span>
                        <span className="text-[10px] text-slate-400 block font-medium">Scheduled Action Date</span>
                      </div>
                    </div>
                    <span className="font-mono text-slate-600 font-bold bg-white border border-slate-200 px-2.5 py-1 rounded-lg">
                      {m.date}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div>
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
              <h4 className="font-display font-bold text-sm text-slate-900 border-b pb-3">Venue Stats</h4>
              <div className="space-y-4 text-xs">
                <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Hall Capacity</span>
                  <span className="text-lg font-black text-slate-950 font-mono">1,200 Guests</span>
                  <p className="text-[10px] text-slate-500">Divided into 800 Indoor, 400 Outdoor Garden Lounge</p>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Generator Backups</span>
                  <span className="text-sm font-black text-slate-900">2x Caterpillar 250 kVA</span>
                  <p className="text-[10px] text-slate-500">Dual transfer switches with auto 4-second engagement latency</p>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">AC Chiller Status</span>
                  <div className="flex justify-between items-center mt-1">
                    <span className="text-xs font-bold text-emerald-600">✓ Fully Operational</span>
                    <div className="flex gap-1">
                      <button 
                        onClick={() => setAcTemperature(prev => Math.max(prev - 1, 16))}
                        className="w-6 h-6 rounded bg-slate-200 flex items-center justify-center font-bold text-xs"
                      >
                        -
                      </button>
                      <button 
                        onClick={() => setAcTemperature(prev => Math.min(prev + 1, 26))}
                        className="w-6 h-6 rounded bg-slate-200 flex items-center justify-center font-bold text-xs"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: Drone Assets & Sequence (Event Planner Only) */}
      {activeTab === "planner_assets" && roleType === "event_planner" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Day of event schedule sequence */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
              <h3 className="font-display font-black text-slate-900 text-base mb-1">Day-of-Event Timeline Orchestration</h3>
              <p className="text-xs text-slate-500 mb-6">Manage live wedding sequence steps on-site. Inform caterers, sound managers, and camera pilots instantly.</p>

              <div className="space-y-4">
                {weddingSequence.map((seq, index) => (
                  <div key={index} className="flex justify-between items-center p-3 bg-slate-50 border border-slate-100 rounded-xl text-xs">
                    <div className="flex items-center gap-3">
                      <div className="px-2 py-1 bg-white border border-slate-200 rounded font-mono font-black text-slate-700">
                        {seq.time}
                      </div>
                      <div>
                        <span className="font-bold text-slate-900 block">{seq.event}</span>
                        <span className="text-[10px] text-slate-400 block">Milestone Step {index + 1}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => toggleSequenceStatus(index)}
                      className={`px-3 py-1 rounded-lg font-bold text-[10px] transition-all uppercase tracking-wider ${
                        seq.status === "Completed" 
                          ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                          : seq.status === "Ongoing"
                            ? "bg-amber-100 text-amber-800 border border-amber-200 animate-pulse"
                            : "bg-slate-200 text-slate-600"
                      }`}
                    >
                      {seq.status}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Heavy drone asset manager */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
              <h3 className="font-display font-bold text-base text-slate-900 mb-2">Hardware & Media Equipment Logs</h3>
              <p className="text-xs text-slate-500 mb-6">Track physical media hardware kits assigned to ground teams inside Hyderabad.</p>

              <div className="space-y-3.5 text-xs">
                {assets.map((asset, index) => (
                  <div key={index} className="p-3.5 bg-slate-50 border border-slate-100 rounded-xl flex justify-between items-center">
                    <div>
                      <span className="font-bold text-slate-900 block">{asset.name}</span>
                      <span className="text-[10px] text-slate-400 block font-mono">S/N: {asset.serial} &middot; Custodian: {asset.assignedTo}</span>
                    </div>

                    <span className={`px-2.5 py-0.5 rounded-full font-black text-[9px] uppercase tracking-wider ${
                      asset.status === "Operational" 
                        ? "bg-emerald-50 text-emerald-800 border border-emerald-100" 
                        : "bg-red-50 text-red-800 border border-red-100"
                    }`}>
                      {asset.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Add Asset Form */}
          <div>
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
              <h4 className="font-display font-bold text-sm text-slate-900 mb-4 flex items-center gap-1">
                <Plus className="w-4 h-4 text-blue-500" />
                <span>Log Heavy Equipment</span>
              </h4>

              <form onSubmit={handleAddAsset} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase mb-1">Asset Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Sony Alpha 7 IV Kit"
                    value={newAssetName}
                    onChange={(e) => setNewAssetName(e.target.value)}
                    className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-800 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase mb-1">Serial Number</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. SN-SONY-9981"
                    value={newAssetSerial}
                    onChange={(e) => setNewAssetSerial(e.target.value)}
                    className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-800 font-mono focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase mb-1">Assigned Custodian (Staff)</label>
                  <input
                    type="text"
                    placeholder="e.g. Tariq Senior Cameraman"
                    value={newAssetAssigned}
                    onChange={(e) => setNewAssetAssigned(e.target.value)}
                    className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-800 focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl tracking-wider transition-colors"
                >
                  LOG TO EQUIPMENT MATRIX
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* AI PROFILE GENERATOR MODAL */}
      {showAiModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white border border-slate-200 w-full max-w-md rounded-2xl shadow-2xl p-6 relative">
            <button onClick={() => setShowAiModal(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600">
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2.5 mb-2">
              <div className="p-1.5 rounded-lg bg-amber-100 text-amber-700 animate-pulse">
                <Sparkles className="w-5 h-5 animate-spin" />
              </div>
              <h3 className="font-display font-bold text-base text-slate-900">
                AI Listing Description Co-Pilot
              </h3>
            </div>
            <p className="text-xs text-slate-500 mb-4 leading-normal">
              Provide unique details about your event setups or catering taste and we'll draft a highly professional, high-converting bio.
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Key highlights or credentials you hold</label>
                <input
                  type="text"
                  value={aiSkillsInput}
                  onChange={(e) => setAiSkillsInput(e.target.value)}
                  placeholder="e.g. 500+ successful weddings, organic henna, imported spotlights"
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-800 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Your company mission or values</label>
                <textarea
                  rows={3}
                  value={aiBioInput}
                  onChange={(e) => setAiBioInput(e.target.value)}
                  placeholder="e.g. We guarantee zero power blackouts with our standby system, flat pricing, and transparent catering logs."
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-800 focus:outline-none"
                />
              </div>

              <button
                onClick={handleGenerateAiBio}
                disabled={generatingBio || !aiBioInput}
                className="w-full py-3 bg-slate-900 hover:bg-slate-850 text-white rounded-xl text-xs font-bold tracking-wider transition-all disabled:opacity-40"
              >
                {generatingBio ? "Gemini Engine Designing Copy..." : "GENERATE PREMIUM DESCRIPTION"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* AI ESTIMATE MODAL */}
      {showQuoteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white border border-slate-200 w-full max-w-md rounded-2xl shadow-2xl p-6 relative">
            <button onClick={() => { setShowQuoteModal(false); setQuoteDetails(null); }} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600">
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2 mb-2">
              <div className="p-1.5 rounded-lg bg-blue-50 text-blue-700 animate-pulse">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="font-display font-bold text-base text-slate-900">
                AI Custom Event Booking Estimator
              </h3>
            </div>
            <p className="text-xs text-slate-500 mb-4 leading-normal">
              Enter customer guest size and service custom requests to compute a highly accurate cost projection model.
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Custom demands description</label>
                <textarea
                  rows={3}
                  value={quoteDesc}
                  onChange={(e) => setQuoteDesc(e.target.value)}
                  placeholder="e.g. 800 guests catering with mutton biryani, 3 tier cake, 2 high speed drone cameras with LED wall live playback."
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-800 focus:outline-none focus:border-slate-450"
                />
              </div>

              <button
                onClick={handleGenerateAiQuote}
                disabled={generatingQuote || !quoteDesc}
                className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold tracking-wider transition-all disabled:opacity-40"
              >
                {generatingQuote ? "Gemini Estimator Computing Rates..." : "CALCULATE COST PROJECTION"}
              </button>

              {quoteDetails && (
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3 font-mono text-xs">
                  <div className="flex justify-between font-bold border-b pb-1.5">
                    <span>ESTIMATED TOTAL</span>
                    <span className="text-emerald-700">{quoteDetails.estimateRange || "PKR 350,000 - 400,000"}</span>
                  </div>
                  <div className="text-[10px] text-slate-500 leading-normal">
                    {quoteDetails.explanation}
                  </div>
                  {quoteDetails.breakdown && (
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold block text-slate-400">COST MATRIX BREAKDOWN:</span>
                      {quoteDetails.breakdown.map((itm: string, i: number) => (
                        <div key={i} className="text-[10px] text-slate-600">
                          - {itm}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* OTP CODE VERIFICATION MODAL */}
      {otpVerifyBookingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white border border-slate-200 w-full max-w-sm rounded-2xl shadow-2xl p-6 relative">
            <button onClick={() => { setOtpVerifyBookingId(null); setEnteredOtp(""); setOtpError(""); }} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600">
              <X className="w-4 h-4" />
            </button>

            <h3 className="font-display font-bold text-base text-slate-900 mb-1">
              Verify Customer On-Site OTP
            </h3>
            <p className="text-xs text-slate-500 mb-4 leading-normal">
              Enter the 4-digit completion code displayed on the customer's active workspace screen to verify and authorize release of funds.
            </p>

            <form onSubmit={handleOtpSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Enter 4-Digit Code</label>
                <input
                  type="text"
                  required
                  value={enteredOtp}
                  onChange={(e) => setEnteredOtp(e.target.value)}
                  placeholder="e.g. 4029"
                  className="w-full text-center text-lg bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-800 font-mono tracking-widest focus:outline-none"
                />
              </div>

              {otpError && (
                <div className="p-3 bg-red-50 text-red-600 rounded-xl text-[11px] font-semibold leading-normal">
                  {otpError}
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold tracking-wider transition-all"
              >
                CONFIRM COMPLETION
              </button>
            </form>
          </div>
        </div>
      )}

      {/* FUNDS WITHDRAWAL MODAL */}
      {showWithdrawModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white border border-slate-200 w-full max-w-md rounded-2xl shadow-2xl p-6 relative">
            <button onClick={() => setShowWithdrawModal(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600">
              <X className="w-4 h-4" />
            </button>

            <h3 className="font-display font-bold text-base text-slate-900 mb-1">
              Instant Wallet Balance Withdrawal
            </h3>
            <p className="text-xs text-slate-500 mb-4 leading-normal">
              Transfer your completed event earnings directly. Transfers process within 15 minutes across Sindh network banks.
            </p>

            <form onSubmit={handleWithdrawSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Amount (PKR)</label>
                  <input
                    type="number"
                    required
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                    placeholder="e.g. 45000"
                    className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-850 font-mono focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Payment Channel</label>
                  <select
                    value={withdrawMethod}
                    onChange={(e) => setWithdrawMethod(e.target.value)}
                    className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-800 focus:outline-none font-semibold"
                  >
                    <option value="Easypaisa">Easypaisa Mobile Wallet</option>
                    <option value="JazzCash">JazzCash Mobile Wallet</option>
                    <option value="Habib Bank Ltd">Habib Bank (HBL)</option>
                    <option value="Al Baraka Bank">Al Baraka Islamic Bank</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Account Number / Phone Number</label>
                <input
                  type="text"
                  required
                  value={withdrawAccount}
                  onChange={(e) => setWithdrawAccount(e.target.value)}
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-800 font-mono focus:outline-none"
                />
              </div>

              {withdrawMsg && (
                <div className="p-3 bg-blue-50 text-blue-700 rounded-xl text-[11px] leading-relaxed font-semibold">
                  {withdrawMsg}
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold tracking-wider transition-all"
              >
                REQUEST INSTANT BANK DISPATCH
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
