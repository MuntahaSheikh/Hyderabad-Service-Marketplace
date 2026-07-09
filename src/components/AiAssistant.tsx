import React, { useState, useEffect, useRef } from "react";
import { MessageSquare, Send, X, Bot, Sparkles, Coins, Zap, HelpCircle, AlertCircle } from "lucide-react";

interface AiAssistantProps {
  isOpen: boolean;
  onClose: () => void;
  onAutoSelectProvider?: (provider: any, serviceName: string) => void;
}

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function AiAssistant({ isOpen, onClose, onAutoSelectProvider }: AiAssistantProps) {
  const [activeTab, setActiveTab] = useState<"chat" | "estimate">("chat");
  const [chatInput, setChatInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Assalam-o-Alaikum! I am **HyderiAI**, your smart service assistant for Hyderabad. Ask me to find providers in Qasimabad, Latifabad, or request a price estimate for electrical, plumbing, beauty, or tutoring services."
    }
  ]);
  const [loading, setLoading] = useState(false);

  // Price Estimator state
  const [estCategory, setEstCategory] = useState("Home Services");
  const [estService, setEstService] = useState("Electrician");
  const [estDesc, setEstDesc] = useState("");
  const [estResult, setEstResult] = useState<{
    estimateRange?: string;
    explanation?: string;
    breakdown?: string[];
    confidence?: string;
  } | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSendChat = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!chatInput.trim() || loading) return;

    const userMsg = chatInput.trim();
    setChatInput("");
    setMessages(prev => [...prev, { role: "user", content: userMsg }]);
    setLoading(true);

    try {
      const response = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, { role: "user", content: userMsg }],
          userContext: { location: "Hyderabad, Sindh" }
        })
      });
      const data = await response.json();
      if (data.reply) {
        setMessages(prev => [...prev, { role: "assistant", content: data.reply }]);
      } else {
        setMessages(prev => [...prev, { role: "assistant", content: "I ran into a small lag. Could you try asking again? (Make sure the server is fully started)." }]);
      }
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, { role: "assistant", content: "AI is briefly sleeping. Let me know if you would like me to assist you locally in matching a provider!" }]);
    } finally {
      setLoading(false);
    }
  };

  const handleGetEstimate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setEstResult(null);

    try {
      const response = await fetch("/api/ai/estimate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category: estCategory,
          service: estService,
          description: estDesc
        })
      });
      const data = await response.json();
      setEstResult(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-white dark:bg-slate-950 shadow-2xl border-l border-slate-200 dark:border-slate-800 flex flex-col animate-slide-left">
      {/* Drawer Header */}
      <div className="p-4 border-b border-slate-100 dark:border-slate-900 bg-gradient-to-r from-blue-600 to-indigo-600 text-white flex justify-between items-center rounded-tl-2xl">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center border border-white/20 animate-pulse">
            <Bot className="w-5 h-5 text-cyan-300" />
          </div>
          <div>
            <h3 className="font-display font-bold text-sm">HyderiAI Assistant</h3>
            <span className="text-[10px] text-cyan-200 font-medium tracking-wide block">Hyderabad Smart Copilot</span>
          </div>
        </div>
        <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-white/10 text-white/80 hover:text-white transition-colors">
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Tabs */}
      <div className="grid grid-cols-2 border-b border-slate-100 dark:border-slate-900 bg-slate-50 dark:bg-slate-900/40 p-1">
        <button
          onClick={() => setActiveTab("chat")}
          className={`py-2 text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition-all ${
            activeTab === "chat"
              ? "bg-white dark:bg-slate-800 text-blue-600 dark:text-cyan-400 shadow-sm"
              : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
          }`}
        >
          <MessageSquare className="w-3.5 h-3.5" />
          <span>Smart AI Chat</span>
        </button>
        <button
          onClick={() => setActiveTab("estimate")}
          className={`py-2 text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition-all ${
            activeTab === "estimate"
              ? "bg-white dark:bg-slate-800 text-blue-600 dark:text-cyan-400 shadow-sm"
              : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
          }`}
        >
          <Coins className="w-3.5 h-3.5" />
          <span>AI Price Estimator</span>
        </button>
      </div>

      {/* Tab Body */}
      <div className="flex-1 overflow-y-auto p-4 flex flex-col">
        {activeTab === "chat" ? (
          <div className="flex-1 flex flex-col justify-between">
            {/* Messages area */}
            <div className="flex-1 space-y-4 max-h-[60vh] overflow-y-auto pr-1">
              {messages.map((m, idx) => (
                <div key={idx} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[85%] rounded-2xl p-3 text-xs leading-relaxed shadow-sm ${
                    m.role === "user"
                      ? "bg-blue-600 text-white rounded-tr-none"
                      : "bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-slate-200 rounded-tl-none border border-slate-200/50 dark:border-slate-800/50"
                  }`}>
                    {/* Render message simply with simple markdown styling for bolding */}
                    <p className="whitespace-pre-line">
                      {m.content.split("**").map((text, i) => i % 2 === 1 ? <strong key={i} className="font-semibold">{text}</strong> : text)}
                    </p>
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-slate-100 dark:bg-slate-900 rounded-2xl rounded-tl-none p-3 border border-slate-200/50 dark:border-slate-800/50 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" />
                    <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-75" />
                    <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-150" />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Suggestions */}
            <div className="mt-4 border-t border-slate-100 dark:border-slate-900/50 pt-3">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">Quick Queries</span>
              <div className="flex flex-wrap gap-1.5">
                {[
                  "Need electrician in Qasimabad",
                  "Estimate beauty makeups",
                  "Recommend Quran tutor"
                ].map((txt) => (
                  <button
                    key={txt}
                    onClick={() => { setChatInput(txt); setTimeout(() => handleSendChat(), 50); }}
                    className="px-2.5 py-1 rounded-lg bg-slate-50 hover:bg-blue-50 dark:bg-slate-900/60 dark:hover:bg-slate-800 border border-slate-200/50 dark:border-slate-800/50 text-[10px] text-slate-600 dark:text-slate-300 transition-colors"
                  >
                    {txt}
                  </button>
                ))}
              </div>
            </div>

            {/* Input form */}
            <form onSubmit={handleSendChat} className="mt-3 flex gap-2">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Message HyderiAI..."
                className="flex-1 bg-slate-100 dark:bg-slate-900 text-xs text-slate-800 dark:text-white rounded-xl px-3 py-2.5 focus:outline-none border border-slate-200/30 dark:border-slate-800/50"
              />
              <button
                type="submit"
                disabled={loading || !chatInput.trim()}
                className="p-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-40 transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="p-3 bg-blue-50/50 dark:bg-blue-950/20 border border-blue-100/50 dark:border-blue-900/40 rounded-xl flex gap-2 items-start text-[11px] text-blue-700 dark:text-cyan-400 leading-relaxed">
              <Sparkles className="w-4 h-4 text-blue-500 shrink-0" />
              <span>
                Enter your service requirements to generate a real-time, transparent price estimate breakdown based on Hyderabad market data.
              </span>
            </div>

            <form onSubmit={handleGetEstimate} className="space-y-3 bg-slate-50 dark:bg-slate-900/40 p-4 rounded-xl border border-slate-200/60 dark:border-slate-800/50">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Category</label>
                  <select
                    value={estCategory}
                    onChange={(e) => setEstCategory(e.target.value)}
                    className="w-full text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-2 text-slate-800 dark:text-white focus:outline-none"
                  >
                    <option value="Home Services">Home Services</option>
                    <option value="Beauty & Grooming">Beauty & Grooming</option>
                    <option value="Education & Quran">Education & Quran</option>
                    <option value="Digital Services">Digital Services</option>
                    <option value="Automotive Care">Automotive Care</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Service</label>
                  <input
                    type="text"
                    value={estService}
                    onChange={(e) => setEstService(e.target.value)}
                    placeholder="e.g. Electrician, Tutor"
                    className="w-full text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-2 text-slate-800 dark:text-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Work Description</label>
                <textarea
                  value={estDesc}
                  onChange={(e) => setEstDesc(e.target.value)}
                  placeholder="Describe your issue, e.g., AC not cooling, split compressor wiring, 3 rooms whitewash, etc."
                  rows={3}
                  className="w-full text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-2.5 text-slate-800 dark:text-white focus:outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={loading || !estService}
                className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs tracking-wider transition-colors disabled:opacity-50"
              >
                {loading ? "Calculating..." : "GENERATE AI ESTIMATION"}
              </button>
            </form>

            {estResult && (
              <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 space-y-3 animate-fade-in shadow-inner">
                <div className="flex justify-between items-center border-b border-slate-200/50 dark:border-slate-800/50 pb-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Estimated Range</span>
                  <span className="px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 font-extrabold text-xs">
                    {estResult.estimateRange}
                  </span>
                </div>

                <div className="text-xs text-slate-600 dark:text-slate-300">
                  <p className="font-semibold mb-1">AI Explanation:</p>
                  <p>{estResult.explanation}</p>
                </div>

                {estResult.breakdown && estResult.breakdown.length > 0 && (
                  <div className="text-xs text-slate-600 dark:text-slate-300 pt-1">
                    <p className="font-semibold mb-1.5">Standard Breakdown (PKR):</p>
                    <ul className="space-y-1 pl-3.5 list-disc text-slate-500 dark:text-slate-400">
                      {estResult.breakdown.map((item, i) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="flex items-center gap-1.5 text-[10px] text-slate-400 pt-2 border-t border-slate-200/30 dark:border-slate-800/30">
                  <Zap className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
                  <span>Market Confidence Score: <strong>{estResult.confidence || "90%"}</strong></span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
