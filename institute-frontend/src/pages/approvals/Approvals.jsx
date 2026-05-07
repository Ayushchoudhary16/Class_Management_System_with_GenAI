import { useState } from 'react';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import { CheckCircle, Shield } from 'lucide-react';
import { useFetch } from '../../hooks/useFetch';
import { adminApi } from '../../api/adminApi';
import { PageHeader, ErrorState } from '../../components/index.jsx';
import { getInitials } from '../../utils/helpers';

export default function Approvals() {
  const { data: pending, loading, error, refetch } = useFetch(() => adminApi.getPendingFaculty());
  const [approving, setApproving] = useState(null);

  const handleApprove = async (id) => {
    setApproving(id);
    try {
      await adminApi.approveFaculty(id);
      toast.success('Faculty approved successfully!');
      refetch();
    } catch {
      toast.error('Failed to approve');
    } finally {
      setApproving(null);
    }
  };

  if (error) return <ErrorState message={error} onRetry={refetch} />;

  return (
    <div>
      <PageHeader
        title="Faculty Approvals"
        subtitle="Review and approve pending faculty registrations"
      />

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(i => <div key={i} className="skeleton-light h-20 rounded-2xl" />)}
        </div>
      ) : !pending?.length ? (
        <div className="card p-12 text-center">
          <div className="w-16 h-16 rounded-2xl bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center mx-auto mb-4">
            <CheckCircle size={28} className="text-emerald-500" />
          </div>
          <p className="font-semibold text-slate-700 dark:text-slate-300">All caught up!</p>
          <p className="text-sm text-slate-400 mt-1">No pending faculty approvals at the moment.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {pending.map((faculty, i) => (
            <motion.div
              key={faculty.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="card p-5 flex items-center gap-4"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white font-bold text-sm shrink-0">
                {getInitials(faculty.name)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-slate-800 dark:text-slate-100">{faculty.name}</p>
                <p className="text-sm text-slate-500">{faculty.email}</p>
                <p className="text-xs text-slate-400 mt-0.5">{faculty.department} · {faculty.designation}</p>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <span className="badge badge-yellow">Pending</span>
                <button
                  onClick={() => handleApprove(faculty.id)}
                  disabled={approving === faculty.id}
                  className="btn-primary flex items-center gap-2 text-sm"
                >
                  <Shield size={14} />
                  {approving === faculty.id ? 'Approving...' : 'Approve'}
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
