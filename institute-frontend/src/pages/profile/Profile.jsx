import { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { User, Mail, Phone, MapPin, Shield, Edit3, Save, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { adminApi } from '../../api/adminApi';
import { studentApi } from '../../api/studentApi';
import { facultyApi } from '../../api/facultyApi';
import { PageHeader, Card } from '../../components/index.jsx';
import { getInitials } from '../../utils/helpers';

export default function Profile() {
  const { user, role } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [editing, setEditing] = useState(false);

  const schema = Yup.object({
    name: Yup.string().required('Required'),
    password: Yup.string().min(6, 'Min 6 chars').required('Required'),
    ...(role === 'student' && {
      address: Yup.string().required('Required'),
      mobile_no: Yup.string().required('Required'),
      parent_mobile_no: Yup.string().required('Required'),
    }),
    ...(role === 'faculty' && {
      department: Yup.string().required('Required'),
      designation: Yup.string().required('Required'),
    }),
  });

  const formik = useFormik({
    initialValues: {
      name: user?.name || '',
      password: '',
      address: user?.address || '',
      mobile_no: user?.mobile_no || '',
      parent_mobile_no: user?.parent_mobile_no || '',
      department: user?.department || '',
      designation: user?.designation || '',
    },
    validationSchema: schema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        if (role === 'admin') await adminApi.update({ name: values.name, password: values.password });
        else if (role === 'student') await studentApi.update(values);
        else if (role === 'faculty') await facultyApi.update(values);
        toast.success('Profile updated!');
        setEditing(false);
      } catch (err) {
        toast.error(err?.response?.data?.detail || 'Update failed');
      } finally {
        setSubmitting(false);
      }
    },
  });

  const ROLE_COLORS = {
    admin: 'from-purple-500 to-indigo-600',
    student: 'from-primary-500 to-blue-600',
    faculty: 'from-emerald-500 to-teal-600',
  };

  const fields = [
    { icon: User, label: 'Name', value: user?.name },
    { icon: Mail, label: 'Email', value: user?.email },
    ...(role === 'student' ? [
      { icon: Phone, label: 'Mobile', value: user?.mobile_no },
      { icon: Phone, label: 'Parent Mobile', value: user?.parent_mobile_no },
      { icon: MapPin, label: 'Address', value: user?.address },
    ] : []),
    ...(role === 'faculty' ? [
      { icon: Shield, label: 'Department', value: user?.department },
      { icon: Shield, label: 'Designation', value: user?.designation },
    ] : []),
  ];

  return (
    <div className="max-w-2xl mx-auto">
      <PageHeader title="Profile" subtitle="Manage your account details" />

      {/* Avatar card */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="card p-8 mb-5 text-center"
      >
        <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${ROLE_COLORS[role]} flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4 shadow-glow`}>
          {getInitials(user?.name || user?.email || 'U')}
        </div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">{user?.name || '—'}</h2>
        <p className="text-slate-500 text-sm mt-0.5">{user?.email}</p>
        <span className={`badge mt-3 inline-flex capitalize ${role === 'admin' ? 'badge-purple' : role === 'faculty' ? 'badge-green' : 'badge-blue'}`}>
          {role}
        </span>
      </motion.div>

      {/* Info card */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="card p-6 mb-5"
      >
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-semibold text-slate-800 dark:text-white">Account Information</h3>
          {!editing && (
            <button onClick={() => setEditing(true)} className="btn-secondary flex items-center gap-2 text-sm">
              <Edit3 size={14} /> Edit
            </button>
          )}
        </div>

        {!editing ? (
          <div className="space-y-4">
            {fields.map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-white/[0.06] flex items-center justify-center shrink-0">
                  <Icon size={15} className="text-slate-500 dark:text-slate-400" />
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-medium">{label}</p>
                  <p className="text-sm text-slate-700 dark:text-slate-200 font-medium mt-0.5">{value || '—'}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <form onSubmit={formik.handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="label">Full Name</label>
                <input name="name" className="input-field" value={formik.values.name} onChange={formik.handleChange} onBlur={formik.handleBlur} />
                {formik.touched.name && formik.errors.name && <p className="text-xs text-red-500 mt-1">{formik.errors.name}</p>}
              </div>
              <div className="col-span-2">
                <label className="label">New Password</label>
                <input name="password" type="password" className="input-field" placeholder="••••••••" value={formik.values.password} onChange={formik.handleChange} onBlur={formik.handleBlur} />
                {formik.touched.password && formik.errors.password && <p className="text-xs text-red-500 mt-1">{formik.errors.password}</p>}
              </div>
              {role === 'student' && (
                <>
                  <div>
                    <label className="label">Mobile</label>
                    <input name="mobile_no" className="input-field" value={formik.values.mobile_no} onChange={formik.handleChange} />
                  </div>
                  <div>
                    <label className="label">Parent Mobile</label>
                    <input name="parent_mobile_no" className="input-field" value={formik.values.parent_mobile_no} onChange={formik.handleChange} />
                  </div>
                  <div className="col-span-2">
                    <label className="label">Address</label>
                    <input name="address" className="input-field" value={formik.values.address} onChange={formik.handleChange} />
                  </div>
                </>
              )}
              {role === 'faculty' && (
                <>
                  <div>
                    <label className="label">Department</label>
                    <input name="department" className="input-field" value={formik.values.department} onChange={formik.handleChange} />
                  </div>
                  <div>
                    <label className="label">Designation</label>
                    <input name="designation" className="input-field" value={formik.values.designation} onChange={formik.handleChange} />
                  </div>
                </>
              )}
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <button type="button" onClick={() => setEditing(false)} className="btn-secondary flex items-center gap-2">
                <X size={14} /> Cancel
              </button>
              <button type="submit" disabled={formik.isSubmitting} className="btn-primary flex items-center gap-2">
                <Save size={14} /> {formik.isSubmitting ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        )}
      </motion.div>

      {/* Preferences */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="card p-6"
      >
        <h3 className="font-semibold text-slate-800 dark:text-white mb-4">Preferences</h3>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-700 dark:text-slate-200">Theme</p>
            <p className="text-xs text-slate-400 mt-0.5">Switch between light and dark mode</p>
          </div>
          <button
            onClick={toggleTheme}
            className={`relative w-12 h-6 rounded-full transition-colors duration-300 ${theme === 'dark' ? 'bg-primary-600' : 'bg-slate-300'}`}
          >
            <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-300 ${theme === 'dark' ? 'translate-x-6' : ''}`} />
          </button>
        </div>
      </motion.div>
    </div>
  );
}
