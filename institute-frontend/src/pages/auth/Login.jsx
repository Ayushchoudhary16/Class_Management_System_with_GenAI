import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';
import { Eye, EyeOff, GraduationCap, Shield, Users } from 'lucide-react';

const ROLES = [
  { value: 'admin', label: 'Admin', icon: Shield, color: 'from-purple-500 to-red-600' },
  // { value: 'student', label: 'Student', icon: GraduationCap, color: 'from-primary-500 to-blue-600' },
  { value: 'faculty', label: 'Faculty', icon: Users, color: 'from-emerald-500 to-teal-600' },
];

const schema = Yup.object({
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string().min(4, 'Too short').required('Password is required'),
});

export default function Login() {
  const [role, setRole] = useState('admin');
  const [showPw, setShowPw] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: { email: '', password: '' },
    validationSchema: schema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        await login(values, role);
        toast.success(`Welcome back! Logged in as ${role}`);
        navigate('/dashboard');
      } catch (err) {
        const msg = err?.response?.data?.detail || 'Invalid credentials';
        toast.error(msg);
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-[#0d0f1a]">
      {/* Left decorative panel */}
      <div className="hidden lg:flex flex-col flex-1 relative overflow-hidden bg-gradient-to-br from-primary-600 via-primary-700 to-purple-800">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white/5 rounded-full -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-white/5 rounded-full translate-x-1/3 translate-y-1/3" />
          <div className="absolute top-1/2 left-1/2 w-48 h-48 bg-white/5 rounded-full -translate-x-1/2 -translate-y-1/2" />
        </div>
        <div className="relative z-10 flex flex-col justify-center h-full px-16">
          <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center mb-8">
            <span className="text-white font-bold text-1xl">CMS</span>
          </div>
          <h1 className="text-4xl font-bold text-white leading-tight mb-4">
            Class<br/>Management<br/>System
          </h1>
          <p className="text-primary-200 text-lg leading-relaxed max-w-sm">
            Streamline your Classes operations with our powerful, all-in-one management platform.
          </p>
          {/* <div className="mt-12 flex flex-col gap-4">
            {['Manage students & faculty', 'Track attendance in real-time', 'AI-powered insights'].map((f, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-lg bg-white/20 flex items-center justify-center">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
                </div>
                <span className="text-white/80 text-sm">{f}</span>
              </div>
            ))}
          </div> */}
        </div>
      </div>

      {/* Right login form */}
      <div className="flex flex-1 lg:max-w-[480px] items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md"
        >
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Sign in</h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Welcome back! Choose your role below.</p>
          </div>

          {/* Role picker */}
          <div className="grid grid-cols-3 gap-2 mb-6">
            {ROLES.map(({ value, label, icon: Icon, color }) => (
              <button
                key={value}
                type="button"
                onClick={() => setRole(value)}
                className={`relative flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all duration-200
                  ${role === value
                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-500/10'
                    : 'border-slate-200 dark:border-white/[0.08] hover:border-slate-300 dark:hover:border-white/[0.12]'
                  }`}
              >
                <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${color} flex items-center justify-center`}>
                  <Icon size={15} className="text-white" />
                </div>
                <span className={`text-xs font-semibold ${role === value ? 'text-primary-700 dark:text-primary-400' : 'text-slate-600 dark:text-slate-400'}`}>
                  {label}
                </span>
              </button>
            ))}
          </div>

          <form onSubmit={formik.handleSubmit} className="space-y-4">
            <div>
              <label className="label">Email</label>
              <input
                type="email"
                name="email"
                placeholder="you@example.com"
                className="input-field"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.email && formik.errors.email && (
                <p className="text-xs text-red-500 mt-1">{formik.errors.email}</p>
              )}
            </div>

            <div>
              <label className="label">Password</label>
              <div className="relative">
                <input
                  type={showPw ? 'text' : 'password'}
                  name="password"
                  placeholder="••••••••"
                  className="input-field pr-11"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                <button
                  type="button"
                  onClick={() => setShowPw(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {formik.touched.password && formik.errors.password && (
                <p className="text-xs text-red-500 mt-1">{formik.errors.password}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={formik.isSubmitting}
              className="btn-primary w-full py-3 mt-2"
            >
              {formik.isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                  </svg>
                  Signing in...
                </span>
              ) : `Sign in as ${role.charAt(0).toUpperCase() + role.slice(1)}`}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-slate-100 dark:border-white/[0.06] text-center">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              `Don't have an account?{' '}`
              <Link to="/register" className="text-primary-600 dark:text-primary-400 font-semibold hover:underline">
                Create account
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
