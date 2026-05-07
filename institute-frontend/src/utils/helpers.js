export const formatDate = (dateStr) => {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric'
  });
};

export const formatCurrency = (amount) => {
  if (amount == null) return '—';
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(amount);
};

export const truncate = (str, n = 40) => str?.length > n ? str.slice(0, n) + '...' : str;

export const getInitials = (name = '') =>
  name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();

export const statusColor = (status) => {
  const map = {
    present: 'badge-green', absent: 'badge-red',
    paid: 'badge-green', pending: 'badge-yellow', overdue: 'badge-red',
    approved: 'badge-green', pending_approval: 'badge-yellow',
    active: 'badge-blue', inactive: 'badge-red',
  };
  return map[status?.toLowerCase()] || 'badge-blue';
};
