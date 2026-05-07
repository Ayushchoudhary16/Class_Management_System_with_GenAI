import { motion } from 'framer-motion';
import { X, AlertTriangle } from 'lucide-react';

// ─── Stat Card ───────────────────────────────────────────────────────────────
export function StatCard({ title, value, icon: Icon, color = 'primary', delta, loading }) {
  const colors = {
    primary: 'from-primary-500 to-primary-600',
    green: 'from-emerald-500 to-emerald-600',
    purple: 'from-purple-500 to-purple-600',
    orange: 'from-orange-500 to-orange-600',
    pink: 'from-pink-500 to-pink-600',
  };

  if (loading) return (
    <div className="card p-6 space-y-4">
      <div className="skeleton-light h-4 w-24 rounded-lg" />
      <div className="skeleton-light h-8 w-16 rounded-lg" />
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="card p-6 hover:shadow-lg transition-shadow duration-300 group"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">{title}</p>
          <p className="text-3xl font-bold text-slate-900 dark:text-white mt-1">{value ?? '—'}</p>
          {delta && (
            <p className="text-xs text-emerald-500 font-medium mt-1">{delta}</p>
          )}
        </div>
        <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${colors[color]} flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-300`}>
          <Icon size={20} className="text-white" />
        </div>
      </div>
    </motion.div>
  );
}

// ─── Generic Card ─────────────────────────────────────────────────────────────
export function Card({ children, className = '', ...props }) {
  return (
    <div className={`card p-6 ${className}`} {...props}>
      {children}
    </div>
  );
}

// ─── Table ────────────────────────────────────────────────────────────────────
export function Table({ columns, data, loading, emptyText = 'No records found', rowKey = 'id' }) {
  if (loading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="skeleton-light h-12 rounded-xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="table-wrapper">
      <table className="data-table">
        <thead>
          <tr>
            {columns.map(col => (
              <th key={col.key}>{col.label}</th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-[#13162a]">
          {!data?.length ? (
            <tr>
              <td colSpan={columns.length} className="text-center py-12 text-slate-400 dark:text-slate-500">
                {emptyText}
              </td>
            </tr>
          ) : (
            data.map((row, i) => (
              <motion.tr
                key={row[rowKey] ?? i}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.03 }}
              >
                {columns.map(col => (
                  <td key={col.key}>
                    {col.render ? col.render(row[col.key], row) : (row[col.key] ?? '—')}
                  </td>
                ))}
              </motion.tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

// ─── Modal ────────────────────────────────────────────────────────────────────
export function Modal({ isOpen, onClose, title, children, size = 'md' }) {
  const sizes = {
    sm: 'max-w-sm',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="modal-overlay"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.2 }}
        className={`card w-full ${sizes[size]} max-h-[90vh] overflow-y-auto shadow-2xl`}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">{title}</h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200
              hover:bg-slate-100 dark:hover:bg-white/[0.06] transition-all"
          >
            <X size={18} />
          </button>
        </div>
        {children}
      </motion.div>
    </motion.div>
  );
}

// ─── Confirm Dialog ───────────────────────────────────────────────────────────
export function ConfirmDialog({ isOpen, onClose, onConfirm, title, message, loading }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm">
      <div className="flex gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-red-100 dark:bg-red-500/20 flex items-center justify-center shrink-0">
          <AlertTriangle size={18} className="text-red-500" />
        </div>
        <p className="text-sm text-slate-600 dark:text-slate-300 mt-2">{message}</p>
      </div>
      <div className="flex gap-3 justify-end">
        <button onClick={onClose} className="btn-secondary">Cancel</button>
        <button onClick={onConfirm} disabled={loading} className="btn-danger">
          {loading ? 'Deleting...' : 'Delete'}
        </button>
      </div>
    </Modal>
  );
}

// ─── Empty State ──────────────────────────────────────────────────────────────
export function EmptyState({ title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-white/[0.05] flex items-center justify-center mb-4">
        <span className="text-3xl">📭</span>
      </div>
      <p className="font-semibold text-slate-700 dark:text-slate-300">{title}</p>
      {description && <p className="text-sm text-slate-400 mt-1">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

// ─── Error State ──────────────────────────────────────────────────────────────
export function ErrorState({ message, onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-16 h-16 rounded-2xl bg-red-50 dark:bg-red-500/10 flex items-center justify-center mb-4">
        <AlertTriangle size={24} className="text-red-400" />
      </div>
      <p className="font-semibold text-slate-700 dark:text-slate-300">Something went wrong</p>
      <p className="text-sm text-slate-400 mt-1">{message}</p>
      {onRetry && (
        <button onClick={onRetry} className="btn-primary mt-4">Try Again</button>
      )}
    </div>
  );
}

// ─── Page Header ──────────────────────────────────────────────────────────────
export function PageHeader({ title, subtitle, actions }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
      <div>
        <h1 className="page-title">{title}</h1>
        {subtitle && <p className="page-subtitle">{subtitle}</p>}
      </div>
      {actions && <div className="flex items-center gap-3">{actions}</div>}
    </div>
  );
}

// ─── Search Input ─────────────────────────────────────────────────────────────
export function SearchInput({ value, onChange, placeholder = 'Search...' }) {
  return (
    <div className="relative">
      <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
      </svg>
      <input
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="input-field pl-10"
      />
    </div>
  );
}
