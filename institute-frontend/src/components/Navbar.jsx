import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Sun, Moon, Bell, ChevronDown, User, LogOut, Settings } from 'lucide-react';
import { getInitials } from '../utils/helpers';

export default function Navbar({ sidebarCollapsed }) {
  const { user, role, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const sidebarWidth = sidebarCollapsed ? 72 : 260;

  return (
    <header
      className="fixed top-0 right-0 z-30 h-16 flex items-center px-6 gap-4
        bg-white/80 dark:bg-[#0d0f1a]/80 backdrop-blur-xl
        border-b border-slate-100 dark:border-white/[0.05]"
      style={{ left: sidebarWidth, transition: 'left 0.25s ease' }}
    >
      {/* Page title area - left side */}
      <div className="flex-1" />

      {/* Right controls */}
      <div className="flex items-center gap-2">
        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-xl text-slate-500 dark:text-slate-400
            hover:bg-slate-100 dark:hover:bg-white/[0.06] hover:text-slate-900 dark:hover:text-slate-100
            transition-all duration-200"
          aria-label="Toggle theme"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={theme}
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </motion.div>
          </AnimatePresence>
        </button>

        {/* Notifications */}
        <button className="relative p-2 rounded-xl text-slate-500 dark:text-slate-400
          hover:bg-slate-100 dark:hover:bg-white/[0.06] transition-all duration-200">
          <Bell size={18} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary-500 rounded-full" />
        </button>

        {/* Role badge */}
        <span className="badge badge-blue capitalize text-xs hidden sm:flex">
          {role}
        </span>

        {/* Avatar dropdown */}
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(v => !v)}
            className="flex items-center gap-2 p-1.5 rounded-xl
              hover:bg-slate-100 dark:hover:bg-white/[0.06] transition-all duration-200"
          >
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary-500 to-purple-600
              flex items-center justify-center text-white text-xs font-bold shadow-sm">
              {getInitials(user?.name || user?.email || 'U')}
            </div>
            <div className="hidden md:block text-left">
              <p className="text-xs font-semibold text-slate-700 dark:text-slate-200 leading-tight">
                {user?.name || (role ? role.charAt(0).toUpperCase() + role.slice(1) : 'User')}
              </p>
              <p className="text-[10px] text-slate-400 leading-tight truncate max-w-[100px]">
                {user?.email}
              </p>
            </div>
            <ChevronDown size={14} className="text-slate-400" />
          </button>

          <AnimatePresence>
            {dropdownOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setDropdownOpen(false)} />
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 top-full mt-2 w-52 z-50
                    card shadow-xl py-1"
                >
                  <div className="px-4 py-3 border-b border-slate-100 dark:border-white/[0.05]">
                    <p className="text-xs font-semibold text-slate-700 dark:text-slate-200">{user?.name}</p>
                    <p className="text-[11px] text-slate-400 truncate">{user?.email}</p>
                  </div>
                  <button
                    onClick={() => { navigate('/profile'); setDropdownOpen(false); }}
                    className="flex items-center gap-2.5 w-full px-4 py-2.5 text-sm text-slate-600 dark:text-slate-300
                      hover:bg-slate-50 dark:hover:bg-white/[0.05] transition-colors"
                  >
                    <User size={15} /> Profile
                  </button>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2.5 w-full px-4 py-2.5 text-sm text-red-500
                      hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                  >
                    <LogOut size={15} /> Logout
                  </button>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}
