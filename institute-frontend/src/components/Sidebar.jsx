import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard, Users, GraduationCap, BookOpen, Layers,
  ClipboardList, Calendar, Bot, Wallet, LogOut, ChevronLeft,
  ChevronRight, Shield, Bell, Settings
} from 'lucide-react';

const NAV_ITEMS = [
  { label: 'Dashboard', icon: LayoutDashboard, to: '/dashboard' },
  { label: 'Students', icon: GraduationCap, to: '/students', roles: ['admin'] },
  { label: 'Faculty', icon: Users, to: '/faculty', roles: ['admin'] },
  { label: 'Classes', icon: BookOpen, to: '/classes' },
  { label: 'Batches', icon: Layers, to: '/batches' },
  { label: 'Enrollment', icon: ClipboardList, to: '/enrollment' },
  { label: 'Attendance', icon: Calendar, to: '/attendance' },
  { label: 'Fees', icon: Wallet, to: '/fees' },
  { label: 'AI Assistant', icon: Bot, to: '/genai' },
];

const ADMIN_ITEMS = [
  { label: 'Approvals', icon: Shield, to: '/approvals', roles: ['admin'] },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const { user, role, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const filteredNav = NAV_ITEMS.filter(item => !item.roles || item.roles.includes(role));
  const filteredAdmin = ADMIN_ITEMS.filter(item => !item.roles || item.roles.includes(role));

  return (
    <motion.aside
      animate={{ width: collapsed ? 72 : 260 }}
      transition={{ duration: 0.25, ease: 'easeInOut' }}
      className="fixed left-0 top-0 h-screen z-40 flex flex-col
        bg-white dark:bg-[#0f1120] border-r border-slate-100 dark:border-white/[0.05]
        shadow-xl overflow-hidden"
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 h-16 border-b border-slate-100 dark:border-white/[0.05] shrink-0">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center shrink-0 shadow-glow">
          <span className="text-white font-bold text-sm">E</span>
        </div>
        <AnimatePresence>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <p className="font-bold text-slate-900 dark:text-white text-sm leading-tight">EduCore</p>
              <p className="text-[10px] text-slate-400 uppercase tracking-widest">Management</p>
            </motion.div>
          )}
        </AnimatePresence>
        <button
          onClick={() => setCollapsed(c => !c)}
          className="ml-auto p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200
            hover:bg-slate-100 dark:hover:bg-white/[0.06] transition-all shrink-0"
        >
          {collapsed ? <ChevronRight size={15} /> : <ChevronLeft size={15} />}
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-0.5">
        {filteredNav.map(({ label, icon: Icon, to }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `sidebar-link ${isActive ? 'active' : ''} ${collapsed ? 'justify-center px-2' : ''}`
            }
            title={collapsed ? label : undefined}
          >
            <Icon size={18} className="shrink-0" />
            <AnimatePresence>
              {!collapsed && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  className="truncate"
                >
                  {label}
                </motion.span>
              )}
            </AnimatePresence>
          </NavLink>
        ))}

        {filteredAdmin.length > 0 && (
          <>
            <div className={`py-2 ${collapsed ? 'hidden' : ''}`}>
              <p className="px-3 text-[10px] font-semibold text-slate-400 uppercase tracking-widest">Admin</p>
            </div>
            {filteredAdmin.map(({ label, icon: Icon, to }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `sidebar-link ${isActive ? 'active' : ''} ${collapsed ? 'justify-center px-2' : ''}`
                }
                title={collapsed ? label : undefined}
              >
                <Icon size={18} className="shrink-0" />
                {!collapsed && <span className="truncate">{label}</span>}
              </NavLink>
            ))}
          </>
        )}
      </nav>

      {/* User & Logout */}
      <div className="px-2 py-4 border-t border-slate-100 dark:border-white/[0.05] space-y-1 shrink-0">
        <NavLink
          to="/profile"
          className={({ isActive }) =>
            `sidebar-link ${isActive ? 'active' : ''} ${collapsed ? 'justify-center px-2' : ''}`
          }
          title={collapsed ? 'Profile' : undefined}
        >
          <div className="w-[18px] h-[18px] rounded-full bg-gradient-to-br from-primary-400 to-purple-500 flex items-center justify-center shrink-0">
            <span className="text-white text-[9px] font-bold">
              {(user?.name || user?.email || 'U')[0].toUpperCase()}
            </span>
          </div>
          {!collapsed && (
            <span className="truncate text-sm">{user?.name || user?.email || 'Profile'}</span>
          )}
        </NavLink>

        <button
          onClick={handleLogout}
          className={`sidebar-link w-full text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 hover:text-red-600 ${collapsed ? 'justify-center px-2' : ''}`}
          title={collapsed ? 'Logout' : undefined}
        >
          <LogOut size={18} className="shrink-0" />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </motion.aside>
  );
}
