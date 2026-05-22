import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import { facultyApi } from '../../api/facultyApi';
import { adminApi } from '../../api/adminApi';
import { Eye, EyeOff } from 'lucide-react';

const facultySchema = Yup.object({
  name: Yup.string().required('Name required'),
  email: Yup.string().email('Invalid email').required('Email required'),
  password: Yup.string().min(5, 'Min 5 chars').required('Password required'),
  department: Yup.string().required('Department required'),
  designation: Yup.string().required('Designation required'),
});

const adminSchema = Yup.object({
  name: Yup.string().required('Name required'),
  email: Yup.string().email('Invalid email').required('Email required'),
  password: Yup.string().min(5, 'Min 5 chars').required('Password required'),
  secret_key: Yup.string().required('Admin Secret Key required'),
});

export default function Register() {
  const [role, setRole] = useState('faculty'); // Changed default to 'faculty'
  const [showPw, setShowPw] = useState(false);
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      name: '', email: '', password: '', dob: '',
      address: '', mobile_no: '', parent_mobile_no: '',
      department: '', designation: '', secret_key: '',
    },
    validationSchema: role === 'faculty' ? facultySchema : adminSchema,
    enableReinitialize: true,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        if (role === 'faculty') await facultyApi.signup(values);
        else await adminApi.signup(values);
        toast.success('Account created! Please login.');
        navigate('/login');
      } catch (err) {
        toast.error(err?.response?.data?.detail || 'Registration failed');
      } finally {
        setSubmitting(false);
      }
    },
  });

  const f = formik;

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-[#0d0f1a] p-6">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg card p-8"
      >
        <div className="mb-6">
          <div className="w-12 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center mb-5">
            <span className="text-white font-bold">CMS</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Create Account</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Join CMS today</p>
        </div>

        <div className="flex gap-2 mb-6">
          {['faculty', 'admin'].map(r => (
            <button
              key={r}
              type="button"
              onClick={() => setRole(r)}
              className={`flex-1 py-2 rounded-xl text-sm font-semibold transition-all
                ${role === r ? 'bg-primary-600 text-white' : 'btn-secondary'}`}
            >
              {r.charAt(0).toUpperCase() + r.slice(1)}
            </button>
          ))}
        </div>

        <form onSubmit={f.handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="label">Full Name</label>
              <input name="name" className="input-field" placeholder="John Doe" value={f.values.name} onChange={f.handleChange} onBlur={f.handleBlur} />
              {f.touched.name && f.errors.name && <p className="text-xs text-red-500 mt-1">{f.errors.name}</p>}
            </div>

            <div className="col-span-2">
              <label className="label">Email</label>
              <input name="email" type="email" className="input-field" placeholder="you@example.com" value={f.values.email} onChange={f.handleChange} onBlur={f.handleBlur} />
              {f.touched.email && f.errors.email && <p className="text-xs text-red-500 mt-1">{f.errors.email}</p>}
            </div>

            <div className="col-span-2">
              <label className="label">Password</label>
              <div className="relative">
                <input name="password" type={showPw ? 'text' : 'password'} className="input-field pr-11" placeholder="••••••••" value={f.values.password} onChange={f.handleChange} onBlur={f.handleBlur} />
                <button type="button" onClick={() => setShowPw(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {f.touched.password && f.errors.password && <p className="text-xs text-red-500 mt-1">{f.errors.password}</p>}
            </div>

            {/* role === 'student' && (
              <>
                <div>
                  <label className="label">Date of Birth</label>
                  <input name="dob" type="date" className="input-field" value={f.values.dob} onChange={f.handleChange} onBlur={f.handleBlur} />
                  {f.touched.dob && f.errors.dob && <p className="text-xs text-red-500 mt-1">{f.errors.dob}</p>}
                </div>
                <div>
                  <label className="label">Mobile</label>
                  <input name="mobile_no" className="input-field" placeholder="9876543210" value={f.values.mobile_no} onChange={f.handleChange} onBlur={f.handleBlur} />
                  {f.touched.mobile_no && f.errors.mobile_no && <p className="text-xs text-red-500 mt-1">{f.errors.mobile_no}</p>}
                </div>
                <div>
                  <label className="label">Parent Mobile</label>
                  <input name="parent_mobile_no" className="input-field" placeholder="9876543211" value={f.values.parent_mobile_no} onChange={f.handleChange} onBlur={f.handleBlur} />
                  {f.touched.parent_mobile_no && f.errors.parent_mobile_no && <p className="text-xs text-red-500 mt-1">{f.errors.parent_mobile_no}</p>}
                </div>
                <div>
                  <label className="label">Address</label>
                  <input name="address" className="input-field" placeholder="123 Main St" value={f.values.address} onChange={f.handleChange} onBlur={f.handleBlur} />
                  {f.touched.address && f.errors.address && <p className="text-xs text-red-500 mt-1">{f.errors.address}</p>}
                </div>
              </>
            ) */}

            {role === 'faculty' && (
              <>
                <div>
                  <label className="label">Department</label>
                  <input name="department" className="input-field" placeholder="Computer Science" value={f.values.department} onChange={f.handleChange} onBlur={f.handleBlur} />
                  {f.touched.department && f.errors.department && <p className="text-xs text-red-500 mt-1">{f.errors.department}</p>}
                </div>
                <div>
                  <label className="label">Designation</label>
                  <input name="designation" className="input-field" placeholder="Professor" value={f.values.designation} onChange={f.handleChange} onBlur={f.handleBlur} />
                  {f.touched.designation && f.errors.designation && <p className="text-xs text-red-500 mt-1">{f.errors.designation}</p>}
                </div>
              </>
            )}

            {role === 'admin' && (
              <div className="col-span-2">
                <label className="label">Admin Registration Passcode</label>
                <input 
                  name="secret_key" 
                  type="password" 
                  className="input-field" 
                  placeholder="Enter the Admin Secret Passcode to register" 
                  value={f.values.secret_key} 
                  onChange={f.handleChange} 
                  onBlur={f.handleBlur} 
                />
                {f.touched.secret_key && f.errors.secret_key && (
                  <p className="text-xs text-red-500 mt-1">{f.errors.secret_key}</p>
                )}
              </div>
            )}
          </div>

          {role === 'faculty' && (
            <p className="text-xs text-amber-500 bg-amber-50 dark:bg-amber-500/10 rounded-xl p-3">
              ⚠️ Faculty accounts require admin approval before you can log in.
            </p>
          )}

          <button type="submit" disabled={f.isSubmitting} className="btn-primary w-full py-3">
            {f.isSubmitting ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <p className="text-center text-sm text-slate-500 dark:text-slate-400 mt-4">
          Already have an account?{' '}
          <Link to="/login" className="text-primary-600 dark:text-primary-400 font-semibold hover:underline">Sign in</Link>
        </p>
      </motion.div>
    </div>
  );
}
