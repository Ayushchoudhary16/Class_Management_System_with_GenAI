import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-[#0d0f1a] p-6">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-md"
      >
        {/* Big 404 */}
        <div className="relative mb-8">
          <p className="text-[120px] font-black text-slate-100 dark:text-white/[0.04] leading-none select-none">
            404
          </p>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center shadow-glow">
              <span className="text-3xl">🔍</span>
            </div>
          </div>
        </div>

        <h1 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">Page Not Found</h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => navigate(-1)}
            className="btn-secondary flex items-center justify-center gap-2"
          >
            <ArrowLeft size={16} /> Go Back
          </button>
          <button
            onClick={() => navigate('/dashboard')}
            className="btn-primary flex items-center justify-center gap-2"
          >
            <Home size={16} /> Dashboard
          </button>
        </div>
      </motion.div>
    </div>
  );
}
