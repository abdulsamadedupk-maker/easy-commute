import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, Ride, SearchQuery } from '../types';
import { Sparkles, Send, Bot, User, RefreshCw, Zap, ArrowRight, X } from 'lucide-react';

interface CommuteAssistantWidgetProps {
  availableRides: Ride[];
  onApplySearchFilter?: (filter: Partial<SearchQuery>) => void;
}

export const CommuteAssistantWidget: React.FC<CommuteAssistantWidgetProps> = ({
  availableRides,
  onApplySearchFilter
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-1',
      sender: 'ai',
      text: "Hello! I'm your Easy Commute AI Concierge. Ask me anything about route matches, EV carpooling options, or calculating your monthly carbon savings!",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = async (textToSend?: string) => {
    const query = textToSend || inputText;
    if (!query.trim()) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputText('');
    setIsTyping(true);

    try {
      const res = await fetch('/api/ai-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userMessage: query,
          availableRides
        })
      });

      const data = await res.json();

      const aiReply: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: data.reply || "I'm here to help you match with the best driver!",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages((prev) => [...prev, aiReply]);
    } catch (err) {
      console.error('Error in AI Assistant request:', err);
      setMessages((prev) => [
        ...prev,
        {
          id: `ai-err-${Date.now()}`,
          sender: 'ai',
          text: "I'm having trouble connecting right now, but you can use the Smart Match search filters at the top to explore all active rides!",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden max-w-4xl mx-auto my-4 flex flex-col h-[600px]">
      
      {/* Assistant Header */}
      <div className="p-4 sm:p-5 bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 text-white flex items-center justify-between border-b border-emerald-800/40">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500 text-slate-950 flex items-center justify-center font-bold shadow-md shadow-emerald-500/20">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-extrabold text-base text-white">Easy Commute AI Concierge</h3>
              <span className="px-2 py-0.5 text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 rounded-full">
                Gemini 3.6 Flash
              </span>
            </div>
            <p className="text-xs text-slate-300">Intelligent route matcher & eco-savings advisor</p>
          </div>
        </div>
      </div>

      {/* Messages Container */}
      <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4 bg-slate-50/50">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start gap-3 ${
              msg.sender === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            {msg.sender === 'ai' && (
              <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs">
                <Bot className="w-4 h-4" />
              </div>
            )}

            <div
              className={`max-w-[80%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed ${
                msg.sender === 'user'
                  ? 'bg-slate-900 text-white font-medium rounded-tr-xs shadow-xs'
                  : 'bg-white text-slate-800 border border-slate-200 shadow-2xs rounded-tl-xs'
              }`}
            >
              <p>{msg.text}</p>
              <span
                className={`text-[10px] block mt-1.5 ${
                  msg.sender === 'user' ? 'text-slate-400 text-right' : 'text-slate-400'
                }`}
              >
                {msg.timestamp}
              </span>
            </div>

            {msg.sender === 'user' && (
              <div className="w-8 h-8 rounded-lg bg-slate-800 text-white flex items-center justify-center font-bold text-xs shrink-0">
                <User className="w-4 h-4" />
              </div>
            )}
          </div>
        ))}

        {isTyping && (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0">
              <Bot className="w-4 h-4" />
            </div>
            <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-2xs text-xs text-slate-500 flex items-center gap-2">
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-emerald-600" />
              <span>Analyzing commute routes & eco savings...</span>
            </div>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* Quick Prompt Suggestions */}
      <div className="p-3 bg-slate-100 border-t border-slate-200 flex flex-wrap gap-2 text-xs">
        <button
          onClick={() => handleSend("Find me a ride from Bahria Town to Blue Area around 8:15 AM")}
          className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-emerald-50 hover:text-emerald-800 font-medium transition-all text-[11px]"
        >
          🚗 Find ride from Bahria Town to Blue Area
        </button>
        <button
          onClick={() => handleSend("How much CO2 and money (PKR) can I save commuting 4 days a week?")}
          className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-emerald-50 hover:text-emerald-800 font-medium transition-all text-[11px]"
        >
          🍃 Calculate my monthly fuel & CO₂ savings (PKR)
        </button>
        <button
          onClick={() => handleSend("Show rides with minimal detour to NUML or NUST Islamabad")}
          className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-emerald-50 hover:text-emerald-800 font-medium transition-all text-[11px]"
        >
          🎓 University rides (NUML / NUST)
        </button>
      </div>

      {/* Input Box */}
      <div className="p-4 bg-white border-t border-slate-200">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            placeholder="Ask AI Concierge (e.g. 'Is there a ride from DHA Phase II to F-8 Markaz around 8:00 AM?')"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs sm:text-sm font-medium text-slate-900 focus:outline-hidden focus:border-emerald-500"
          />
          <button
            type="submit"
            disabled={!inputText.trim()}
            className="px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-all disabled:opacity-50 flex items-center gap-1.5 cursor-pointer"
          >
            <span>Send</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>

    </div>
  );
};
