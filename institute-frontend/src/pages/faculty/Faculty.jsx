import { useState } from 'react';
import { toast } from 'react-toastify';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Plus, Trash2 } from 'lucide-react';
import { useFetch, useDisclosure, useDebounce } from '../../hooks/useFetch';
import { facultyApi } from '../../api/facultyApi';
import { PageHeader, Table, Modal, ConfirmDialog, SearchInput, ErrorState } from '../../components/index.jsx';
import { getInitials } from '../../utils/helpers';

const schema = Yup.object({
  name: Yup.string().required('Required'),
  email: Yup.string().email().required('Required'),
  password: Yup.string().min(6).required('Required'),
  department: Yup.string().required('Required'),
  designation: Yup.string().required('Required'),
});

export default function Faculty() {
  // const { data: faculty, loading, error, refetch } = useFetch(() => facultyApi.getAll());
  const { data: facultyRes, loading, error, refetch } = useFetch(() => facultyApi.getAll());
  // const faculty = facultyRes?.data?.faculties || [];
  const faculty = Array.isArray(facultyRes?.faculties)
    ? facultyRes.faculties
    : [];
  const addModal = useDisclosure();
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 300);

  const filtered = Array.isArray(faculty)
    ? faculty.filter(f =>
        f.name?.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        f.department?.toLowerCase().includes(debouncedSearch.toLowerCase())
      )
    : [];

  const formik = useFormik({
    initialValues: { name: '', email: '', password: '', department: '', designation: '' },
    validationSchema: schema,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      try {
        await facultyApi.signup(values);
        toast.success('Faculty added. Pending admin approval.');
        resetForm();
        addModal.close();
        refetch();
      } catch (err) {
        toast.error(err?.response?.data?.detail || 'Failed to add faculty');
      } finally {
        setSubmitting(false);
      }
    },
  });

  const handleDelete = async () => {
    setDeleteLoading(true);
    try {
      await facultyApi.delete(deleteTarget.id);
      toast.success('Faculty deleted');
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
      key: 'name', label: 'Faculty',
      render: (name, row) => (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white text-xs font-bold">
            {getInitials(name)}
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-100 text-sm">{name}</p>
            <p className="text-xs text-slate-400">{row.email}</p>
          </div>
        </div>
      )
    },
    { key: 'department', label: 'Department' },
    { key: 'designation', label: 'Designation' },
    {
      key: 'is_approved', label: 'Status',
      render: (v) => v
        ? <span className="badge badge-green">Approved</span>
        : <span className="badge badge-yellow">Pending</span>
    },
    {
      key: 'id', label: 'Actions',
      render: (id, row) => (
        <button
          onClick={() => setDeleteTarget(row)}
          className="p-2 rounded-lg text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all"
        >
          <Trash2 size={15} />
        </button>
      )
    },
  ];

  if (error) return <ErrorState message={error} onRetry={refetch} />;

  return (
    <div>
      <PageHeader
        title="Faculty"
        subtitle={`${filtered.length} faculty members`}
        actions={
          <button onClick={addModal.open} className="btn-primary flex items-center gap-2">
            <Plus size={16} /> Add Faculty
          </button>
        }
      />

      <div className="card p-6">
        <div className="mb-5">
          <SearchInput value={search} onChange={setSearch} placeholder="Search by name or department..." />
        </div>
        <Table columns={columns} data={filtered} loading={loading} emptyText="No faculty members found" />
      </div>

      <Modal isOpen={addModal.isOpen} onClose={addModal.close} title="Add Faculty Member">
        <form onSubmit={formik.handleSubmit} className="space-y-4">
          {[
            { name: 'name', label: 'Full Name', type: 'text', placeholder: 'Dr. Jane Smith' },
            { name: 'email', label: 'Email', type: 'email', placeholder: 'jane@institute.com' },
            { name: 'password', label: 'Password', type: 'password', placeholder: '••••••••' },
            { name: 'department', label: 'Department', type: 'text', placeholder: 'Computer Science' },
            { name: 'designation', label: 'Designation', type: 'text', placeholder: 'Associate Professor' },
          ].map(({ name, label, type, placeholder }) => (
            <div key={name}>
              <label className="label">{label}</label>
              <input name={name} type={type} placeholder={placeholder} className="input-field"
                value={formik.values[name]} onChange={formik.handleChange} onBlur={formik.handleBlur} />
              {formik.touched[name] && formik.errors[name] && (
                <p className="text-xs text-red-500 mt-1">{formik.errors[name]}</p>
              )}
            </div>
          ))}
          <p className="text-xs text-amber-500 bg-amber-50 dark:bg-amber-500/10 rounded-xl p-3">
            Faculty accounts require admin approval.
          </p>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={addModal.close} className="btn-secondary">Cancel</button>
            <button type="submit" disabled={formik.isSubmitting} className="btn-primary">
              {formik.isSubmitting ? 'Adding...' : 'Add Faculty'}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        loading={deleteLoading}
        title="Delete Faculty"
        message={`Delete "${deleteTarget?.name}"? This cannot be undone.`}
      />
    </div>
  );
}
