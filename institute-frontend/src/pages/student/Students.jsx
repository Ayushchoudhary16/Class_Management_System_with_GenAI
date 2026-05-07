import { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Plus, Pencil, Trash2, Eye } from 'lucide-react';
import { useFetch, useDisclosure, useDebounce } from '../../hooks/useFetch';
import { studentApi } from '../../api/studentApi';
import { PageHeader, Table, Modal, ConfirmDialog, SearchInput, EmptyState, ErrorState } from '../../components/index.jsx';
import { formatDate, getInitials } from '../../utils/helpers';

const schema = Yup.object({
  name: Yup.string().required('Required'),
  email: Yup.string().email().required('Required'),
  password: Yup.string().min(6).required('Required'),
  dob: Yup.string().required('Required'),
  address: Yup.string().required('Required'),
  mobile_no: Yup.string().required('Required'),
  parent_mobile_no: Yup.string().required('Required'),
});

export default function Students() {
  // const { data: students, loading, error, refetch } = useFetch(() => studentApi.getAll());
  const { data: studentRes, loading, error, refetch } = useFetch(() => studentApi.getAll());
  const students = Array.isArray(studentRes?.students) ? studentRes.students : [];
  const addModal = useDisclosure();
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 300);

  // const filtered = students.filter(s =>
  //   s.name?.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
  //   s.email?.toLowerCase().includes(debouncedSearch.toLowerCase())
  // ) ?? [];
  const filtered = (Array.isArray(students) ? students : []).filter(s =>
    s.name?.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
    s.email?.toLowerCase().includes(debouncedSearch.toLowerCase())
  );

  const formik = useFormik({
    initialValues: { name: '', email: '', password: '', dob: '', address: '', mobile_no: '', parent_mobile_no: '' },
    validationSchema: schema,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      try {
        await studentApi.signup(values);
        toast.success('Student added successfully');
        resetForm();
        addModal.close();
        refetch();
      } catch (err) {
        toast.error(err?.response?.data?.detail || 'Failed to add student');
      } finally {
        setSubmitting(false);
      }
    },
  });

  const handleDelete = async () => {
    setDeleteLoading(true);
    try {
      await studentApi.delete(deleteTarget.id);
      toast.success('Student deleted');
      setDeleteTarget(null);
      refetch();
    } catch {
      toast.error('Failed to delete');
    } finally {
      setDeleteLoading(false);
    }
  };

  const columns = [
    {
      key: 'name', label: 'Student',
      render: (name, row) => (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-400 to-purple-500 flex items-center justify-center text-white text-xs font-bold shrink-0">
            {getInitials(name)}
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-100 text-sm">{name}</p>
            <p className="text-xs text-slate-400">{row.email}</p>
          </div>
        </div>
      )
    },
    { key: 'mobile_no', label: 'Mobile' },
    { key: 'dob', label: 'DOB', render: d => formatDate(d) },
    { key: 'address', label: 'Address', render: a => <span className="max-w-[140px] truncate block">{a}</span> },
    {
      key: 'id', label: 'Actions',
      render: (id, row) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => setDeleteTarget(row)}
            className="p-2 rounded-lg text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all"
          >
            <Trash2 size={15} />
          </button>
        </div>
      )
    },
  ];

  if (error) return <ErrorState message={error} onRetry={refetch} />;

  return (
    <div>
      <PageHeader
        title="Students"
        subtitle={`${filtered.length} students enrolled`}
        actions={
          <button onClick={addModal.open} className="btn-primary flex items-center gap-2">
            <Plus size={16} /> Add Student
          </button>
        }
      />

      <div className="card p-6">
        <div className="mb-5">
          <SearchInput value={search} onChange={setSearch} placeholder="Search students..." />
        </div>
        <Table columns={columns} data={filtered} loading={loading} emptyText="No students found" />
      </div>

      {/* Add Modal */}
      <Modal isOpen={addModal.isOpen} onClose={addModal.close} title="Add New Student" size="lg">
        <form onSubmit={formik.handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {[
              { name: 'name', label: 'Full Name', type: 'text', placeholder: 'John Doe', colSpan: 2 },
              { name: 'email', label: 'Email', type: 'email', placeholder: 'john@example.com', colSpan: 2 },
              { name: 'password', label: 'Password', type: 'password', placeholder: '••••••••', colSpan: 1 },
              { name: 'dob', label: 'Date of Birth', type: 'date', colSpan: 1 },
              { name: 'mobile_no', label: 'Mobile', type: 'text', placeholder: '9876543210', colSpan: 1 },
              { name: 'parent_mobile_no', label: 'Parent Mobile', type: 'text', placeholder: '9876543211', colSpan: 1 },
              { name: 'address', label: 'Address', type: 'text', placeholder: '123 Main Street', colSpan: 2 },
            ].map(({ name, label, type, placeholder, colSpan }) => (
              <div key={name} className={colSpan === 2 ? 'col-span-2' : ''}>
                <label className="label">{label}</label>
                <input
                  name={name} type={type} placeholder={placeholder}
                  className="input-field"
                  value={formik.values[name]}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched[name] && formik.errors[name] && (
                  <p className="text-xs text-red-500 mt-1">{formik.errors[name]}</p>
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={addModal.close} className="btn-secondary">Cancel</button>
            <button type="submit" disabled={formik.isSubmitting} className="btn-primary">
              {formik.isSubmitting ? 'Adding...' : 'Add Student'}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        loading={deleteLoading}
        title="Delete Student"
        message={`Are you sure you want to delete "${deleteTarget?.name}"? This action cannot be undone.`}
      />
    </div>
  );
}
