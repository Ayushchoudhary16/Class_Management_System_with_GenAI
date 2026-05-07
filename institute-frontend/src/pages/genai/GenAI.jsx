import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { Send, Bot, User, Sparkles, Trash2 } from 'lucide-react';
import { genaiApi } from '../../api/genaiApi';
import { useAuth } from '../../context/AuthContext';
import { PageHeader } from '../../components/index.jsx';

const SUGGESTIONS = [
  'How can I improve student attendance?',
  'Generate a weekly study plan for batch students.',
  'What are best practices for class management?',
  'Give tips for student engagement in online classes.',
];

export default function GenAI() {
  const { role } = useAuth();
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: 'assistant',
      content: `Hello! I'm your AI assistant powered by EduCore. I can help you with student management, attendance strategies, class planning, and much more. How can I assist you today?`,
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (text) => {
    const prompt = text || input.trim();
    if (!prompt) return;

    const userMsg = { id: Date.now(), role: 'user', content: prompt };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const fn = role === 'admin' ? genaiApi.adminChat : genaiApi.studentChat;
      const res = await fn({ prompt });
      const reply = res.data?.response || res.data?.message || res.data?.reply || JSON.stringify(res.data);
      setMessages(prev => [...prev, { id: Date.now() + 1, role: 'assistant', content: reply }]);
    } catch (err) {
      toast.error('AI service unavailable. Check your API key.');
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        role: 'assistant',
        content: '⚠️ I\'m having trouble connecting right now. Please ensure the backend GenAI service is configured correctly.',
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const clearChat = () => {
    setMessages([{
      id: Date.now(),
      role: 'assistant',
      content: 'Chat cleared. How can I help you?',
    }]);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-128px)]">
      <PageHeader
        title="AI Assistant"
        subtitle="Powered by Gemini — your intelligent institute companion"
        actions={
          <button onClick={clearChat} className="btn-secondary flex items-center gap-2 text-sm">
            <Trash2 size={14} /> Clear Chat
          </button>
        }
      />

      <div className="flex-1 flex flex-col card overflow-hidden min-h-0">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          <AnimatePresence initial={false}>
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
                className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
              >
                {/* Avatar */}
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                  msg.role === 'assistant'
                    ? 'bg-gradient-to-br from-primary-500 to-purple-600'
                    : 'bg-gradient-to-br from-emerald-400 to-teal-500'
                }`}>
                  {msg.role === 'assistant' ? <Bot size={15} className="text-white" /> : <User size={15} className="text-white" />}
                </div>

                {/* Bubble */}
                <div className={`max-w-[75%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-primary-600 text-white rounded-tr-sm'
                    : 'bg-slate-100 dark:bg-white/[0.06] text-slate-700 dark:text-slate-200 rounded-tl-sm'
                }`}>
                  <p className="whitespace-pre-wrap">{msg.content}</p>
                </div>
              </motion.div>
            ))}

            {/* Typing indicator */}
            {loading && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex gap-3"
              >
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center shrink-0">
                  <Bot size={15} className="text-white" />
                </div>
                <div className="bg-slate-100 dark:bg-white/[0.06] rounded-2xl rounded-tl-sm px-4 py-3">
                  <div className="flex gap-1.5 items-center h-5">
                    {[0, 1, 2].map(i => (
                      <motion.div
                        key={i}
                        className="w-2 h-2 rounded-full bg-slate-400 dark:bg-slate-500"
                        animate={{ y: [0, -6, 0] }}
                        transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
                      />
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <div ref={bottomRef} />
        </div>

        {/* Suggestions */}
        {messages.length <= 1 && (
          <div className="px-6 pb-4">
            <p className="text-xs text-slate-400 mb-2 flex items-center gap-1.5">
              <Sparkles size={12} /> Suggestions
            </p>
            <div className="flex flex-wrap gap-2">
              {SUGGESTIONS.map(s => (
                <button
                  key={s}
                  onClick={() => sendMessage(s)}
                  className="text-xs px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-white/[0.06]
                    text-slate-600 dark:text-slate-300 hover:bg-primary-50 dark:hover:bg-primary-500/10
                    hover:text-primary-700 dark:hover:text-primary-400 transition-all"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input */}
        <div className="p-4 border-t border-slate-100 dark:border-white/[0.05]">
          <div className="flex gap-3 items-end">
            <textarea
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask anything about your institute..."
              rows={1}
              className="input-field flex-1 resize-none min-h-[44px] max-h-32 py-3"
              style={{ height: 'auto' }}
              onInput={e => {
                e.target.style.height = 'auto';
                e.target.style.height = e.target.scrollHeight + 'px';
              }}
            />
            <button
              onClick={() => sendMessage()}
              disabled={loading || !input.trim()}
              className="btn-primary px-4 py-3 shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send size={16} />
            </button>
          </div>
          <p className="text-[10px] text-slate-400 mt-2 text-center">Press Enter to send · Shift+Enter for new line</p>
        </div>
      </div>
    </div>
  );
}
