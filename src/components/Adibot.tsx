import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, Send, X, ShieldAlert, Cpu } from 'lucide-react';

interface ChatMessage {
  role: 'user' | 'model';
  content: string;
}

export const Adibot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', content: "SYSTEM ONLINE. Greetings! I am Adibot, Aditya's personal AI agent. Ask me anything about his technical capabilities, projects, or background." }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    const userMessage = inputValue.trim();
    setInputValue('');
    setError(null);

    // Append user message
    const updatedMessages = [...messages, { role: 'user', content: userMessage } as ChatMessage];
    setMessages(updatedMessages);
    setIsLoading(true);

    try {
      const res = await fetch(`${import.meta.env.VITE_CHATBOT_URL}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ messages: updatedMessages })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || data.detail || 'Connection decryption failed');

      setMessages(prev => [...prev, { role: 'model', content: data.reply }]);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Transmission error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* 1. Floating Toggle Button (Bottom-Left) */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-6 left-6 z-50 w-14 h-14 rounded-full flex items-center justify-center cursor-pointer select-none bg-gradient-to-br from-[#18011F] to-[#7621B0] border border-white/20 shadow-[0_8px_32px_rgba(181,1,167,0.35)] hover:shadow-[0_8px_32px_rgba(181,1,167,0.55)] transition-all duration-300"
      >
        <Bot className="w-6 h-6 text-white animate-[pulse_2s_infinite]" />
        <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#B600A8] opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-[#B600A8]"></span>
        </span>
      </motion.button>

      {/* 2. Chat Console Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 80, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 80, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 220, damping: 22 }}
            className="fixed bottom-24 left-6 z-50 w-[350px] h-[480px] bg-[#0C0C0E]/95 border border-white/10 rounded-[28px] overflow-hidden flex flex-col shadow-[0_12px_40px_rgba(181,1,167,0.15)] backdrop-blur-xl"
          >
            {/* Soft top purple glow line */}
            <div className="absolute top-0 left-8 right-8 h-[1.5px] bg-gradient-to-r from-transparent via-[#B600A8]/30 to-transparent pointer-events-none" />

            {/* Header */}
            <div className="px-5 py-4 bg-black/40 border-b border-white/[0.04] flex items-center justify-between z-10 shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="relative flex items-center justify-center">
                  <div className="w-7 h-7 rounded-lg bg-white/[0.02] border border-white/10 flex items-center justify-center">
                    <Cpu className="w-4 h-4 text-[#B600A8]" />
                  </div>
                  <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-[#B600A8] animate-pulse" />
                </div>
                <div className="text-left font-sans">
                  <h3 className="text-[10px] font-black tracking-widest text-white uppercase leading-none">ADIBOT</h3>
                  <span className="text-[7px] text-gray-500 uppercase tracking-wider block mt-1 leading-none font-medium">AI Representative</span>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-lg border border-white/5 hover:border-white/10 text-gray-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Messages Feed */}
            <div className="flex-grow overflow-y-auto p-5 space-y-4 relative z-10">
              {messages.map((msg, idx) => {
                const isModel = msg.role === 'model';
                return (
                  <div
                    key={idx}
                    className={`flex ${isModel ? 'justify-start' : 'justify-end'} w-full`}
                  >
                    <div
                      className={`max-w-[85%] px-4 py-3 rounded-2xl text-[11px] leading-relaxed text-left border relative ${
                        isModel
                          ? 'bg-white/[0.03] border-white/[0.06] text-gray-200 font-sans'
                          : 'bg-gradient-to-r from-[#7621B0] to-[#B600A8] border-none text-white font-sans'
                      }`}
                    >
                      {isModel && (
                        <div className="absolute top-2 left-3 text-[6px] font-sans font-bold tracking-wider text-[#B600A8] uppercase mb-1">
                          [ADIBOT]
                        </div>
                      )}
                      <p className={isModel ? 'pt-2.5' : ''}>{msg.content}</p>
                    </div>
                  </div>
                );
              })}

              {isLoading && (
                <div className="flex justify-start w-full">
                  <div className="max-w-[85%] px-4 py-3 bg-white/[0.03] border border-white/[0.06] rounded-2xl text-[10px] font-sans text-[#B600A8] flex items-center gap-2 font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#B600A8] animate-ping" />
                    <span>Adibot is typing...</span>
                  </div>
                </div>
              )}

              {error && (
                <div className="flex justify-center w-full">
                  <div className="max-w-[95%] px-4 py-3 bg-red-950/40 border border-red-500/30 rounded-xl text-[9px] font-mono text-red-400 flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4 shrink-0" />
                    <span>ERROR: {error}</span>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Row */}
            <form
              onSubmit={handleSendMessage}
              className="p-4 bg-black/40 border-t border-white/[0.04] flex gap-2 items-center shrink-0 z-10"
            >
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask Adibot about Aditya..."
                className="flex-grow px-3.5 py-2.5 bg-black/60 border border-white/10 focus:border-[#B600A8] rounded-xl text-white font-sans text-xs placeholder-gray-600 focus:outline-none transition-all"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={isLoading || !inputValue.trim()}
                className="w-10 h-10 rounded-xl bg-gradient-to-r from-[#7621B0] to-[#B600A8] text-white flex items-center justify-center transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shrink-0 hover:shadow-[0_0_12px_rgba(181,1,167,0.3)]"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Adibot;
