// import { useEffect, useState } from 'react';
// import { motion } from 'framer-motion';
// import { GraduationCap, Users, Layers, BookOpen, TrendingUp, Calendar } from 'lucide-react';
// import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, Legend } from 'recharts';
// import { StatCard, PageHeader, Card } from '../../components/index.jsx';
// import { studentApi } from '../../api/studentApi';
// import { facultyApi } from '../../api/facultyApi';
// import { batchApi } from '../../api/batchApi';
// import { classApi } from '../../api/classApi';
// import { enrollApi } from '../../api/enrollApi';
// import { useAuth } from '../../context/AuthContext';

// const COLORS = ['#6172f5', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

// const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

// export default function Dashboard() {
//   const { role } = useAuth();
//   const [stats, setStats] = useState({ students: 0, faculty: 0, batches: 0, classes: 0 });
//   const [loading, setLoading] = useState(true);
//   const [enrollments, setEnrollments] = useState([]);

//   useEffect(() => {
//     if (role !== 'admin') { setLoading(false); return; }
//     const fetchAll = async () => {
//       try {
//         const [s, f, b, c, e] = await Promise.allSettled([
//           studentApi.getAll(),
//           facultyApi.getAll(),
//           batchApi.getAll(),
//           classApi.getAll(),
//           enrollApi.getAll(),
//         ]);
//         // setStats({
//         //   students: s.value?.data?.length ?? 0,
//         //   faculty: f.value?.data?.length ?? 0,
//         //   batches: b.value?.data?.length ?? 0,
//         //   classes: c.value?.data?.length ?? 0,
//         // });
//         // setEnrollments(e.value?.data ?? []);
//         setStats({
//           students: s.status === "fulfilled"
//             ? (s.value.data?.students?.length || 0)
//             : 0,

//           faculty: f.status === "fulfilled"
//             ? (f.value.data?.faculties?.length || 0)
//             : 0,

//           batches: b.status === "fulfilled"
//             ? (b.value.data?.batches?.length || 0)
//             : 0,

//           classes: c.status === "fulfilled"
//             ? (c.value.data?.classes?.length || 0)
//             : 0,
//         });

//         setEnrollments(Array.isArray(e.value?.data?.enrollments) ? e.value.data.enrollments : []);
//       } catch (e) {
//         console.error(e);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchAll();
//   }, [role]);

//   // Generate mock chart data from real stats
//   const areaData = MONTHS.slice(0, 7).map((m, i) => ({
//     month: m,
//     students: Math.round(stats.students * (0.5 + i * 0.08)),
//     enrollments: Math.round(enrollments.length * (0.4 + i * 0.1)),
//   }));

//   const pieData = [
//     { name: 'Students', value: stats.students },
//     { name: 'Faculty', value: stats.faculty },
//     { name: 'Classes', value: stats.classes },
//     { name: 'Batches', value: stats.batches },
//   ].filter(d => d.value > 0);

//   const CustomTooltip = ({ active, payload, label }) => {
//     if (!active || !payload?.length) return null;
//     return (
//       <div className="card p-3 text-xs shadow-xl">
//         <p className="font-semibold text-slate-700 dark:text-slate-200 mb-1">{label}</p>
//         {payload.map(p => (
//           <p key={p.name} style={{ color: p.color }}>{p.name}: {p.value}</p>
//         ))}
//       </div>
//     );
//   };

//   return (
//     <div>
//       <PageHeader
//         title="Dashboard"
//         subtitle={`Overview of your institute's performance`}
//       />

//       {/* Stats Grid */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
//         <StatCard title="Total Students" value={stats.students} icon={GraduationCap} color="primary" loading={loading} />
//         <StatCard title="Total Faculty" value={stats.faculty} icon={Users} color="green" loading={loading} />
//         <StatCard title="Active Batches" value={stats.batches} icon={Layers} color="purple" loading={loading} />
//         <StatCard title="Classes" value={stats.classes} icon={BookOpen} color="orange" loading={loading} />
//       </div>

//       {/* Charts */}
//       <div className="grid grid-cols-1 xl:grid-cols-3 gap-5 mb-5">
//         {/* Area Chart */}
//         <div className="card p-6 xl:col-span-2">
//           <div className="flex items-center justify-between mb-6">
//             <div>
//               <h3 className="font-semibold text-slate-800 dark:text-white">Growth Overview</h3>
//               <p className="text-xs text-slate-500 mt-0.5">Students & enrollment trend</p>
//             </div>
//             <span className="badge badge-green text-[11px]">
//               <TrendingUp size={10} className="mr-1" /> Live
//             </span>
//           </div>
//           {loading ? (
//             <div className="skeleton-light h-52 rounded-xl" />
//           ) : (
//             <ResponsiveContainer width="100%" height={210}>
//               <AreaChart data={areaData}>
//                 <defs>
//                   <linearGradient id="colorStudents" x1="0" y1="0" x2="0" y2="1">
//                     <stop offset="5%" stopColor="#6172f5" stopOpacity={0.3}/>
//                     <stop offset="95%" stopColor="#6172f5" stopOpacity={0}/>
//                   </linearGradient>
//                   <linearGradient id="colorEnroll" x1="0" y1="0" x2="0" y2="1">
//                     <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
//                     <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
//                   </linearGradient>
//                 </defs>
//                 <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.1)" />
//                 <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
//                 <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
//                 <Tooltip content={<CustomTooltip />} />
//                 <Area type="monotone" dataKey="students" stroke="#6172f5" strokeWidth={2} fill="url(#colorStudents)" name="Students" />
//                 <Area type="monotone" dataKey="enrollments" stroke="#10b981" strokeWidth={2} fill="url(#colorEnroll)" name="Enrollments" />
//               </AreaChart>
//             </ResponsiveContainer>
//           )}
//         </div>

//         {/* Pie Chart */}
//         <div className="card p-6">
//           <div className="mb-6">
//             <h3 className="font-semibold text-slate-800 dark:text-white">Distribution</h3>
//             <p className="text-xs text-slate-500 mt-0.5">Institute composition</p>
//           </div>
//           {loading ? (
//             <div className="skeleton-light h-52 rounded-xl" />
//           ) : (
//             <>
//               <ResponsiveContainer width="100%" height={170}>
//                 <PieChart>
//                   <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3} dataKey="value">
//                     {pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
//                   </Pie>
//                   <Tooltip formatter={(v, n) => [v, n]} />
//                 </PieChart>
//               </ResponsiveContainer>
//               <div className="space-y-2 mt-2">
//                 {pieData.map((d, i) => (
//                   <div key={d.name} className="flex items-center justify-between text-xs">
//                     <div className="flex items-center gap-2">
//                       <div className="w-2.5 h-2.5 rounded-sm" style={{ background: COLORS[i] }} />
//                       <span className="text-slate-600 dark:text-slate-300">{d.name}</span>
//                     </div>
//                     <span className="font-semibold text-slate-700 dark:text-slate-200">{d.value}</span>
//                   </div>
//                 ))}
//               </div>
//             </>
//           )}
//         </div>
//       </div>

//       {/* Quick Actions */}
//       <div className="card p-6">
//         <h3 className="font-semibold text-slate-800 dark:text-white mb-4">Quick Actions</h3>
//         <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
//           {[
//             { label: 'Add Student', to: '/students', color: 'bg-primary-50 dark:bg-primary-500/10 text-primary-600 dark:text-primary-400' },
//             { label: 'Mark Attendance', to: '/attendance', color: 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' },
//             { label: 'Create Batch', to: '/batches', color: 'bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400' },
//             { label: 'AI Assistant', to: '/genai', color: 'bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400' },
//           ].map(({ label, to, color }) => (
//             <motion.a
//               key={label}
//               href={to}
//               whileHover={{ scale: 1.02 }}
//               whileTap={{ scale: 0.98 }}
//               className={`flex items-center justify-center px-4 py-3 rounded-xl text-sm font-semibold ${color} transition-all`}
//             >
//               {label}
//             </motion.a>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  GraduationCap,
  Users,
  Layers,
  BookOpen,
  TrendingUp
} from 'lucide-react';

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

import {
  StatCard,
  PageHeader
} from '../../components/index.jsx';

import { studentApi } from '../../api/studentApi';
import { facultyApi } from '../../api/facultyApi';
import { batchApi } from '../../api/batchApi';
import { classApi } from '../../api/classApi';
import { enrollApi } from '../../api/enrollApi';
import { useAuth } from '../../context/AuthContext';

const COLORS = ['#6172f5', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

const MONTHS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul'
];

export default function Dashboard() {
  const { role } = useAuth();

  const [stats, setStats] = useState({
    students: 0,
    faculty: 0,
    batches: 0,
    classes: 0
  });

  const [loading, setLoading] = useState(true);
  const [enrollments, setEnrollments] = useState([]);

  useEffect(() => {
    if (role !== 'admin') {
      setLoading(false);
      return;
    }

    const fetchAll = async () => {
      try {
        const [s, f, b, c, e] = await Promise.allSettled([
          studentApi.getAll(),
          facultyApi.getAll(),
          batchApi.getAll(),
          classApi.getAll(),
          enrollApi.getAll(),
        ]);

        setStats({
          students:
            s.status === 'fulfilled'
              ? (s.value.data?.students?.length || 0)
              : 0,

          faculty:
            f.status === 'fulfilled'
              ? (f.value.data?.faculties?.length || 0)
              : 0,

          batches:
            b.status === 'fulfilled'
              ? (b.value.data?.batches?.length || 0)
              : 0,

          classes:
            c.status === 'fulfilled'
              ? (c.value.data?.classes?.length || 0)
              : 0,
        });

        setEnrollments(
          Array.isArray(e.value?.data?.enrollments)
            ? e.value.data.enrollments
            : []
        );

      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, [role]);

  // Charts Data
  const areaData = MONTHS.map((m, i) => ({
    month: m,
    students: Math.round(stats.students * (0.5 + i * 0.08)),
    enrollments: Math.round(enrollments.length * (0.4 + i * 0.1)),
  }));

  const pieData = [
    { name: 'Students', value: stats.students },
    { name: 'Faculty', value: stats.faculty },
    { name: 'Classes', value: stats.classes },
    { name: 'Batches', value: stats.batches },
  ].filter(d => d.value > 0);

  // Role Based Quick Actions
  const quickActions = {
    admin: [
      {
        label: 'Add Student',
        to: '/students',
        color:
          'bg-primary-50 dark:bg-primary-500/10 text-primary-600 dark:text-primary-400'
      },
      {
        label: 'Mark Attendance',
        to: '/attendance',
        color:
          'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
      },
      {
        label: 'Create Batch',
        to: '/batches',
        color:
          'bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400'
      },
      {
        label: 'AI Assistant',
        to: '/genai',
        color:
          'bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400'
      },
    ],

    faculty: [
      {
        label: 'Mark Attendance',
        to: '/attendance',
        color:
          'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
      },
      {
        label: 'Classes',
        to: '/classes',
        color:
          'bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400'
      },
      {
        label: 'AI Assistant',
        to: '/genai',
        color:
          'bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400'
      },
    ],

    student: [
      {
        label: 'My Attendance',
        to: '/attendance',
        color:
          'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
      },
      {
        label: 'My Fees',
        to: '/fees',
        color:
          'bg-primary-50 dark:bg-primary-500/10 text-primary-600 dark:text-primary-400'
      },
      {
        label: 'AI Assistant',
        to: '/genai',
        color:
          'bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400'
      },
    ]
  };

  // Tooltip
  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;

    return (
      <div className="card p-3 text-xs shadow-xl">
        <p className="font-semibold text-slate-700 dark:text-slate-200 mb-1">
          {label}
        </p>

        {payload.map((p) => (
          <p key={p.name} style={{ color: p.color }}>
            {p.name}: {p.value}
          </p>
        ))}
      </div>
    );
  };

  return (
    <div>
      <PageHeader
        title="Dashboard"
        subtitle="Overview of your institute"
      />

      {/* ADMIN ONLY STATS */}
      {role === 'admin' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
          <StatCard
            title="Total Students"
            value={stats.students}
            icon={GraduationCap}
            color="primary"
            loading={loading}
          />

          <StatCard
            title="Total Faculty"
            value={stats.faculty}
            icon={Users}
            color="green"
            loading={loading}
          />

          <StatCard
            title="Active Batches"
            value={stats.batches}
            icon={Layers}
            color="purple"
            loading={loading}
          />

          <StatCard
            title="Classes"
            value={stats.classes}
            icon={BookOpen}
            color="orange"
            loading={loading}
          />
        </div>
      )}

      {/* ADMIN ONLY CHARTS */}
      {role === 'admin' && (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-5 mb-5">

          {/* AREA CHART */}
          <div className="card p-6 xl:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="font-semibold text-slate-800 dark:text-white">
                  Growth Overview
                </h3>

                <p className="text-xs text-slate-500 mt-0.5">
                  Students & enrollment trend
                </p>
              </div>

              <span className="badge badge-green text-[11px]">
                <TrendingUp size={10} className="mr-1" />
                Live
              </span>
            </div>

            {loading ? (
              <div className="skeleton-light h-52 rounded-xl" />
            ) : (
              <ResponsiveContainer width="100%" height={210}>
                <AreaChart data={areaData}>

                  <defs>
                    <linearGradient id="colorStudents" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6172f5" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#6172f5" stopOpacity={0}/>
                    </linearGradient>

                    <linearGradient id="colorEnroll" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>

                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="rgba(148,163,184,0.1)"
                  />

                  <XAxis
                    dataKey="month"
                    tick={{ fontSize: 11, fill: '#94a3b8' }}
                    axisLine={false}
                    tickLine={false}
                  />

                  <YAxis
                    tick={{ fontSize: 11, fill: '#94a3b8' }}
                    axisLine={false}
                    tickLine={false}
                  />

                  <Tooltip content={<CustomTooltip />} />

                  <Area
                    type="monotone"
                    dataKey="students"
                    stroke="#6172f5"
                    strokeWidth={2}
                    fill="url(#colorStudents)"
                    name="Students"
                  />

                  <Area
                    type="monotone"
                    dataKey="enrollments"
                    stroke="#10b981"
                    strokeWidth={2}
                    fill="url(#colorEnroll)"
                    name="Enrollments"
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* PIE CHART */}
          <div className="card p-6">
            <div className="mb-6">
              <h3 className="font-semibold text-slate-800 dark:text-white">
                Distribution
              </h3>

              <p className="text-xs text-slate-500 mt-0.5">
                Institute composition
              </p>
            </div>

            {loading ? (
              <div className="skeleton-light h-52 rounded-xl" />
            ) : (
              <>
                <ResponsiveContainer width="100%" height={170}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {pieData.map((_, i) => (
                        <Cell
                          key={i}
                          fill={COLORS[i % COLORS.length]}
                        />
                      ))}
                    </Pie>

                    <Tooltip formatter={(v, n) => [v, n]} />
                  </PieChart>
                </ResponsiveContainer>

                <div className="space-y-2 mt-2">
                  {pieData.map((d, i) => (
                    <div
                      key={d.name}
                      className="flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className="w-2.5 h-2.5 rounded-sm"
                          style={{ background: COLORS[i] }}
                        />

                        <span className="text-slate-600 dark:text-slate-300">
                          {d.name}
                        </span>
                      </div>

                      <span className="font-semibold text-slate-700 dark:text-slate-200">
                        {d.value}
                      </span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* QUICK ACTIONS */}
      <div className="card p-6">
        <h3 className="font-semibold text-slate-800 dark:text-white mb-4">
          Quick Actions
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {quickActions[role]?.map(({ label, to, color }) => (
            <motion.a
              key={label}
              href={to}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`flex items-center justify-center px-4 py-3 rounded-xl text-sm font-semibold ${color} transition-all`}
            >
              {label}
            </motion.a>
          ))}
        </div>
      </div>
    </div>
  );
}