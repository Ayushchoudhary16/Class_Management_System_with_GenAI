// import { useState } from 'react';
// import { NavLink, useNavigate } from 'react-router-dom';
// import { motion, AnimatePresence } from 'framer-motion';
// import { useAuth } from '../context/AuthContext';
// import {
//   LayoutDashboard, Users, GraduationCap, BookOpen, Layers,
//   ClipboardList, Calendar, Bot, Wallet, LogOut, ChevronLeft,
//   ChevronRight, Shield, Bell, Settings
// } from 'lucide-react';

// const NAV_ITEMS = [
//   { label: 'Dashboard', icon: LayoutDashboard, to: '/dashboard' },
//   { label: 'Students', icon: GraduationCap, to: '/students', roles: ['admin'] },
//   { label: 'Faculty', icon: Users, to: '/faculty', roles: ['admin'] },
//   { label: 'Classes', icon: BookOpen, to: '/classes' },
//   { label: 'Batches', icon: Layers, to: '/batches' },
//   { label: 'Enrollment', icon: ClipboardList, to: '/enrollment' },
//   { label: 'Attendance', icon: Calendar, to: '/attendance' },
//   { label: 'Fees', icon: Wallet, to: '/fees' },
//   { label: 'AI Assistant', icon: Bot, to: '/genai' },
// ];

// const ADMIN_ITEMS = [
//   { label: 'Approvals', icon: Shield, to: '/approvals', roles: ['admin'] },
// ];

// export default function Sidebar() {
//   const [collapsed, setCollapsed] = useState(false);
//   const { user, role, logout } = useAuth();
//   const navigate = useNavigate();

//   const handleLogout = () => {
//     logout();
//     navigate('/login');
//   };

//   const filteredNav = NAV_ITEMS.filter(item => !item.roles || item.roles.includes(role));
//   const filteredAdmin = ADMIN_ITEMS.filter(item => !item.roles || item.roles.includes(role));

//   return (
//     <motion.aside
//       animate={{ width: collapsed ? 72 : 260 }}
//       transition={{ duration: 0.25, ease: 'easeInOut' }}
//       className="fixed left-0 top-0 h-screen z-40 flex flex-col
//         bg-white dark:bg-[#0f1120] border-r border-slate-100 dark:border-white/[0.05]
//         shadow-xl overflow-hidden"
//     >
//       {/* Logo */}
//       <div className="flex items-center gap-3 px-4 h-16 border-b border-slate-100 dark:border-white/[0.05] shrink-0">
//         <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center shrink-0 shadow-glow">
//           <span className="text-white font-bold text-sm">E</span>
//         </div>
//         <AnimatePresence>
//           {!collapsed && (
//             <motion.div
//               initial={{ opacity: 0, x: -10 }}
//               animate={{ opacity: 1, x: 0 }}
//               exit={{ opacity: 0, x: -10 }}
//               transition={{ duration: 0.2 }}
//               className="overflow-hidden"
//             >
//               <p className="font-bold text-slate-900 dark:text-white text-sm leading-tight">EduCore</p>
//               <p className="text-[10px] text-slate-400 uppercase tracking-widest">Management</p>
//             </motion.div>
//           )}
//         </AnimatePresence>
//         <button
//           onClick={() => setCollapsed(c => !c)}
//           className="ml-auto p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200
//             hover:bg-slate-100 dark:hover:bg-white/[0.06] transition-all shrink-0"
//         >
//           {collapsed ? <ChevronRight size={15} /> : <ChevronLeft size={15} />}
//         </button>
//       </div>

//       {/* Nav */}
//       <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-0.5">
//         {filteredNav.map(({ label, icon: Icon, to }) => (
//           <NavLink
//             key={to}
//             to={to}
//             className={({ isActive }) =>
//               `sidebar-link ${isActive ? 'active' : ''} ${collapsed ? 'justify-center px-2' : ''}`
//             }
//             title={collapsed ? label : undefined}
//           >
//             <Icon size={18} className="shrink-0" />
//             <AnimatePresence>
//               {!collapsed && (
//                 <motion.span
//                   initial={{ opacity: 0 }}
//                   animate={{ opacity: 1 }}
//                   exit={{ opacity: 0 }}
//                   transition={{ duration: 0.15 }}
//                   className="truncate"
//                 >
//                   {label}
//                 </motion.span>
//               )}
//             </AnimatePresence>
//           </NavLink>
//         ))}

//         {filteredAdmin.length > 0 && (
//           <>
//             <div className={`py-2 ${collapsed ? 'hidden' : ''}`}>
//               <p className="px-3 text-[10px] font-semibold text-slate-400 uppercase tracking-widest">Admin</p>
//             </div>
//             {filteredAdmin.map(({ label, icon: Icon, to }) => (
//               <NavLink
//                 key={to}
//                 to={to}
//                 className={({ isActive }) =>
//                   `sidebar-link ${isActive ? 'active' : ''} ${collapsed ? 'justify-center px-2' : ''}`
//                 }
//                 title={collapsed ? label : undefined}
//               >
//                 <Icon size={18} className="shrink-0" />
//                 {!collapsed && <span className="truncate">{label}</span>}
//               </NavLink>
//             ))}
//           </>
//         )}
//       </nav>

//       {/* User & Logout */}
//       <div className="px-2 py-4 border-t border-slate-100 dark:border-white/[0.05] space-y-1 shrink-0">
//         <NavLink
//           to="/profile"
//           className={({ isActive }) =>
//             `sidebar-link ${isActive ? 'active' : ''} ${collapsed ? 'justify-center px-2' : ''}`
//           }
//           title={collapsed ? 'Profile' : undefined}
//         >
//           <div className="w-[18px] h-[18px] rounded-full bg-gradient-to-br from-primary-400 to-purple-500 flex items-center justify-center shrink-0">
//             <span className="text-white text-[9px] font-bold">
//               {(user?.name || user?.email || 'U')[0].toUpperCase()}
//             </span>
//           </div>
//           {!collapsed && (
//             <span className="truncate text-sm">{user?.name || user?.email || 'Profile'}</span>
//           )}
//         </NavLink>

//         <button
//           onClick={handleLogout}
//           className={`sidebar-link w-full text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 hover:text-red-600 ${collapsed ? 'justify-center px-2' : ''}`}
//           title={collapsed ? 'Logout' : undefined}
//         >
//           <LogOut size={18} className="shrink-0" />
//           {!collapsed && <span>Logout</span>}
//         </button>
//       </div>
//     </motion.aside>
//   );
// }

import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

import {
  LayoutDashboard,
  Users,
  GraduationCap,
  BookOpen,
  Layers,
  ClipboardList,
  Calendar,
  Bot,
  Wallet,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Shield,
  UserCircle,
} from 'lucide-react';

/*
========================================
ROLE BASED NAVIGATION
========================================

ADMIN:
- All Access

FACULTY:
- Dashboard
- Classes
- Attendance
- AI Assistant
- Profile

STUDENT:
- Dashboard
- Attendance
- Fees
- AI Assistant
- Profile
*/

const NAV_ITEMS = [
  // COMMON
  {
    label: 'Dashboard',
    icon: LayoutDashboard,
    to: '/dashboard',
    roles: ['admin', 'faculty', 'student'],
  },

  // ADMIN ONLY
  {
    label: 'Students',
    icon: GraduationCap,
    to: '/students',
    roles: ['admin'],
  },
  {
    label: 'Faculty',
    icon: Users,
    to: '/faculty',
    roles: ['admin'],
  },
  {
    label: 'Batches',
    icon: Layers,
    to: '/batches',
    roles: ['admin'],
  },
  {
    label: 'Enrollment',
    icon: ClipboardList,
    to: '/enrollment',
    roles: ['admin'],
  },

  // ADMIN + FACULTY
  {
    label: 'Classes',
    icon: BookOpen,
    to: '/classes',
    roles: ['admin', 'faculty'],
  },

  // ADMIN + FACULTY + STUDENT
  {
    label: 'Attendance',
    icon: Calendar,
    to: '/attendance',
    roles: ['admin', 'faculty', 'student'],
  },

  // ADMIN + STUDENT
  {
    label: 'Fees',
    icon: Wallet,
    to: '/fees',
    roles: ['admin', 'student'],
  },

  // ALL
  {
    label: 'AI Assistant',
    icon: Bot,
    to: '/genai',
    roles: ['admin', 'faculty', 'student'],
  },
];

const ADMIN_ITEMS = [
  {
    label: 'Approvals',
    icon: Shield,
    to: '/approvals',
    roles: ['admin'],
  },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);

  const { user, role, logout } = useAuth();

  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // FILTER NAVIGATION ACCORDING TO ROLE
  const filteredNav = NAV_ITEMS.filter((item) =>
    item.roles.includes(role)
  );

  const filteredAdmin = ADMIN_ITEMS.filter((item) =>
    item.roles.includes(role)
  );

  return (
    <motion.aside
      animate={{
        width: collapsed ? 78 : 270,
      }}
      transition={{
        duration: 0.25,
      }}
      className="
        fixed left-0 top-0 z-50 h-screen
        bg-white dark:bg-[#0f172a]
        border-r border-slate-200 dark:border-slate-800
        shadow-xl
        flex flex-col
        overflow-hidden
      "
    >
      {/* =======================================
          LOGO SECTION
      ======================================= */}
      <div
        className="
          h-16 px-4
          border-b border-slate-200 dark:border-slate-800
          flex items-center gap-3
        "
      >
        <div
          className="
            h-10 w-14 rounded-xl
            bg-gradient-to-r from-indigo-500 to-purple-600
            flex items-center justify-center
            text-white font-bold shadow-lg
          "
        >
          CMS
        </div>

        <AnimatePresence>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
            >
              <h2 className="font-bold text-slate-800 dark:text-white">
                Class
              </h2>

              <p className="text-[11px] text-slate-400 uppercase tracking-widest">
                Management System
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="
            ml-auto
            p-2 rounded-lg
            hover:bg-slate-100
            dark:hover:bg-slate-800
            transition
          "
        >
          {collapsed ? (
            <ChevronRight size={16} />
          ) : (
            <ChevronLeft size={16} />
          )}
        </button>
      </div>

      {/* =======================================
          NAVIGATION
      ======================================= */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        {filteredNav.map(({ label, icon: Icon, to }) => (
          <NavLink
            key={to}
            to={to}
            title={collapsed ? label : ''}
            className={({ isActive }) =>
              `
              flex items-center gap-3
              px-3 py-3 rounded-xl
              transition-all duration-200
              text-sm font-medium

              ${
                isActive
                  ? `
                    bg-gradient-to-r
                    from-indigo-500
                    to-purple-600
                    text-white
                    shadow-lg
                  `
                  : `
                    text-slate-600
                    dark:text-slate-300
                    hover:bg-slate-100
                    dark:hover:bg-slate-800
                  `
              }

              ${collapsed ? 'justify-center' : ''}
            `
            }
          >
            <Icon size={19} className="shrink-0" />

            <AnimatePresence>
              {!collapsed && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="truncate"
                >
                  {label}
                </motion.span>
              )}
            </AnimatePresence>
          </NavLink>
        ))}

        {/* ADMIN SECTION */}
        {filteredAdmin.length > 0 && (
          <>
            {!collapsed && (
              <div className="pt-5 pb-2">
                <p
                  className="
                    px-2
                    text-[11px]
                    uppercase
                    tracking-widest
                    text-slate-400
                    font-semibold
                  "
                >
                  Admin Controls
                </p>
              </div>
            )}

            {filteredAdmin.map(({ label, icon: Icon, to }) => (
              <NavLink
                key={to}
                to={to}
                title={collapsed ? label : ''}
                className={({ isActive }) =>
                  `
                  flex items-center gap-3
                  px-3 py-3 rounded-xl
                  transition-all duration-200
                  text-sm font-medium

                  ${
                    isActive
                      ? `
                        bg-red-500
                        text-white
                        shadow-lg
                      `
                      : `
                        text-slate-600
                        dark:text-slate-300
                        hover:bg-red-50
                        dark:hover:bg-red-500/10
                      `
                  }

                  ${collapsed ? 'justify-center' : ''}
                `
                }
              >
                <Icon size={18} className="shrink-0" />

                {!collapsed && (
                  <span className="truncate">{label}</span>
                )}
              </NavLink>
            ))}
          </>
        )}
      </nav>

      {/* =======================================
          USER SECTION
      ======================================= */}
      <div
        className="
          border-t border-slate-200 dark:border-slate-800
          p-3 space-y-2
        "
      >
        {/* PROFILE */}
        <NavLink
          to="/profile"
          title={collapsed ? 'Profile' : ''}
          className={({ isActive }) =>
            `
            flex items-center gap-3
            px-3 py-3 rounded-xl
            transition-all duration-200

            ${
              isActive
                ? `
                  bg-indigo-500
                  text-white
                `
                : `
                  hover:bg-slate-100
                  dark:hover:bg-slate-800
                  text-slate-700 dark:text-slate-300
                `
            }

            ${collapsed ? 'justify-center' : ''}
          `
          }
        >
          <UserCircle size={20} />

          {!collapsed && (
            <div className="flex flex-col overflow-hidden">
              <span className="text-sm font-semibold truncate">
                {user?.name || 'User'}
              </span>

              <span className="text-xs opacity-70 uppercase">
                {role}
              </span>
            </div>
          )}
        </NavLink>

        {/* LOGOUT */}
        <button
          onClick={handleLogout}
          title={collapsed ? 'Logout' : ''}
          className="
            w-full
            flex items-center gap-3
            px-3 py-3 rounded-xl
            text-red-500
            hover:bg-red-50
            dark:hover:bg-red-500/10
            transition-all duration-200
            text-sm font-medium
          "
        >
          <LogOut size={18} />

          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </motion.aside>
  );
}