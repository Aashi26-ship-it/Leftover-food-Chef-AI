import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Sparkles, ChefHat } from 'lucide-react';

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

const aiResponses = [
  "I'm analyzing your ingredients... This looks delicious! 🥄",
  "Based on what's in your pantry, I suggest trying a Mediterranean bowl with those fresh vegetables!",
  "Great question! I can help you reduce food waste by suggesting recipes that use ingredients expiring soon.",
  "I found 3 recipes that match your ingredients perfectly! Would you like me to show them?",
  "Your salmon looks like it needs to be used soon. How about an Asian stir-fry tonight?",
  "I can help plan your weekly meals to maximize your ingredients and minimize waste.",
  "That's a great ingredient combination! Let me suggest some creative recipes...",
  "Remember, using fresh ingredients within their peak freshness gives the best results!",
];

interface AIChefMascotProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  animate?: boolean;
}

export function AIChefMascot({ size = 'md', className = '', animate = true }: AIChefMascotProps) {
  const sizes = {
    sm: { container: 'w-16 h-16', chef: 'w-12 h-12' },
    md: { container: 'w-24 h-24', chef: 'w-16 h-16' },
    lg: { container: 'w-32 h-32', chef: 'w-24 h-24' },
  };

  const { container, chef } = sizes[size];

  return (
    <div className={`relative ${container} ${className}`}>
      {/* Glow effect */}
      <motion.div
        animate={animate ? { scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] } : undefined}
        transition={{ duration: 3, repeat: Infinity }}
        className="absolute inset-0 rounded-full bg-gradient-to-br from-emerald-400/30 to-orange-400/30 blur-xl"
      />

      {/* Orb glow ring */}
      <motion.div
        animate={animate ? { rotate: 360 } : undefined}
        transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
        className={`absolute inset-0 ${container} rounded-full`}
      >
        <div className="absolute inset-0 rounded-full border-2 border-emerald-400/50 border-dashed" />
      </motion.div>

      {/* Chef SVG */}
      <motion.div
        animate={animate ? { y: [0, -5, 0] } : undefined}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        className={`absolute inset-0 flex items-center justify-center ${chef}`}
      >
        <svg viewBox="0 0 64 64" fill="none" className="w-full h-full">
          {/* Background circle */}
          <circle cx="32" cy="32" r="28" className="fill-white dark:fill-gray-800" />
          <circle cx="32" cy="32" r="28" className="stroke-emerald-500" strokeWidth="2" />
          <circle cx="32" cy="32" r="28" className="fill-emerald-500/10" />

          {/* Chef hat */}
          <motion.path
            d="M20 26C20 26 18 16 28 14C38 12 40 20 40 26"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.5 }}
            className="fill-emerald-100 dark:fill-emerald-900/50"
          />
          <path d="M20 26H44V30H20V26Z" className="fill-emerald-500" />

          {/* Face */}
          <circle cx="26" cy="36" r="2" className="fill-gray-800 dark:fill-white" />
          <circle cx="38" cy="36" r="2" className="fill-gray-800 dark:fill-white" />

          {/* Smile */}
          <path d="M26 42C26 42 32 48 38 42" className="stroke-emerald-500" strokeWidth="2" strokeLinecap="round" />

          {/* AI sparkles */}
          <motion.circle
            cx="44"
            cy="18"
            r="2"
            animate={animate ? { scale: [1, 1.5, 1], opacity: [1, 0.5, 1] } : undefined}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="fill-orange-400"
          />
          <motion.circle
            cx="50"
            cy="26"
            r="1.5"
            animate={animate ? { scale: [1, 1.5, 1], opacity: [1, 0.5, 1] } : undefined}
            transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }}
            className="fill-emerald-400"
          />
          <motion.circle
            cx="48"
            cy="38"
            r="1"
            animate={animate ? { scale: [1, 1.5, 1], opacity: [1, 0.5, 1] } : undefined}
            transition={{ duration: 1.5, repeat: Infinity, delay: 1 }}
            className="fill-emerald-300"
          />

          {/* Spoon */}
          <path d="M14 32C14 32 10 34 10 39C10 42 12 44 14 44L14 56" className="stroke-emerald-400" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </motion.div>

      {/* Floating particles */}
      {animate && (
        <>
          <motion.div
            animate={{ y: [-5, -15, -5], x: [-3, 3, -3], opacity: [0, 1, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="absolute -top-2 left-1/2 w-1.5 h-1.5 bg-emerald-400 rounded-full"
          />
          <motion.div
            animate={{ y: [-5, -12, -5], x: [3, -2, 3], opacity: [0, 1, 0] }}
            transition={{ duration: 2.5, repeat: Infinity, delay: 0.5 }}
            className="absolute -top-1 left-1/3 w-1 h-1 bg-orange-400 rounded-full"
          />
        </>
      )}
    </div>
  );
}

function TypingIndicator() {
  return (
    <div className="flex items-center gap-1.5 px-4 py-3">
      <div className="flex gap-1">
        <motion.div
          animate={{ y: [0, -4, 0] }}
          transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
          className="w-2 h-2 rounded-full bg-emerald-500"
        />
        <motion.div
          animate={{ y: [0, -4, 0] }}
          transition={{ duration: 0.6, repeat: Infinity, delay: 0.15 }}
          className="w-2 h-2 rounded-full bg-emerald-500"
        />
        <motion.div
          animate={{ y: [0, -4, 0] }}
          transition={{ duration: 0.6, repeat: Infinity, delay: 0.3 }}
          className="w-2 h-2 rounded-full bg-emerald-500"
        />
      </div>
      <span className="text-xs text-gray-400 ml-1">Chef Spoon is thinking...</span>
    </div>
  );
}

export function FloatingMascot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 0,
      text: "Hi! I'm Chef Spoon 🥄 Your AI cooking assistant. Ask me anything about your ingredients, recipes, or meal planning!",
      sender: 'ai',
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleSendMessage = async () => {
    const text = inputValue.trim();
    if (!text || isTyping) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now(),
      text,
      sender: 'user',
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate AI response delay
    setTimeout(() => {
      const randomResponse = aiResponses[Math.floor(Math.random() * aiResponses.length)];
      const aiMessage: Message = {
        id: Date.now() + 1,
        text: randomResponse,
        sender: 'ai',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Floating button */}
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1, duration: 0.5 }}
        className="fixed bottom-6 right-6 z-40 hidden lg:block"
      >
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsOpen(!isOpen)}
          className="relative cursor-pointer group"
        >
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <AIChefMascot size="md" animate={!isOpen} />
          </motion.div>

          {/* Pulse ring when closed */}
          {!isOpen && (
            <motion.div
              animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute inset-0 rounded-full border-2 border-emerald-400"
            />
          )}
        </motion.button>
      </motion.div>

      {/* Chat window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="fixed bottom-24 right-6 z-50 w-96 max-w-[calc(100vw-3rem)] h-[500px] max-h-[70vh] flex flex-col bg-white dark:bg-gray-900 rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center gap-3 px-5 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 border-b border-emerald-400/30">
              <AIChefMascot size="sm" animate={false} />
              <div className="flex-1">
                <h3 className="text-white font-semibold">Chef Spoon</h3>
                <p className="text-white/80 text-xs flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-green-300 animate-pulse" />
                  AI Cooking Assistant
                </p>
              </div>
              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-full bg-white/20 text-white hover:bg-white/30 transition-colors"
              >
                <X className="w-5 h-5" />
              </motion.button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-gray-900">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] px-4 py-3 rounded-2xl ${
                      message.sender === 'user'
                        ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-br-md'
                        : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 shadow-sm border border-gray-100 dark:border-gray-700 rounded-bl-md'
                    }`}
                  >
                    {message.sender === 'ai' && (
                      <div className="flex items-center gap-1.5 mb-1.5">
                        <ChefHat className="w-3.5 h-3.5 text-emerald-500" />
                        <span className="text-xs font-medium text-emerald-500">Chef Spoon</span>
                      </div>
                    )}
                    <p className="text-sm leading-relaxed">{message.text}</p>
                    <p className={`text-xs mt-1.5 ${
                      message.sender === 'user' ? 'text-white/70' : 'text-gray-400 dark:text-gray-500'
                    }`}>
                      {message.timestamp.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                    </p>
                  </div>
                </motion.div>
              ))}

              {/* Typing indicator */}
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-start"
                >
                  <div className="bg-white dark:bg-gray-800 rounded-2xl rounded-bl-md shadow-sm border border-gray-100 dark:border-gray-700">
                    <TypingIndicator />
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3">
                <div className="flex-1 relative">
                  <input
                    ref={inputRef}
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Ask about recipes, ingredients..."
                    className="w-full px-4 py-3 pr-12 rounded-xl bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all text-sm"
                    disabled={isTyping}
                  />
                  <Sparkles className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 dark:text-gray-600" />
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim() || isTyping}
                  className="p-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/25 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  <Send className="w-5 h-5" />
                </motion.button>
              </div>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-2 text-center">
                Press Enter to send • AI responses are simulated
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
