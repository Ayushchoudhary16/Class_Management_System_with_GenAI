import { useState } from 'react';
import { toast } from 'react-toastify';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Plus, Pencil } from 'lucide-react';
import { useFetch, useDisclosure } from '../../hooks/useFetch';
import { feesApi } from '../../api/feesApi';
import { studentApi } from '../../api/studentApi';
import { PageHeader, Table, Modal, ErrorState } from '../../components/index.jsx';
import { formatCurrency, formatDate } from '../../utils/helpers';
import { useAuth } from '../../context/AuthContext';

const createSchema = Yup.object({
  student_id: Yup.number().required('Required'),
  amount: Yup.number().min(1).required('Required'),
});

const updateSchema = Yup.object({
  amount: Yup.number().min(1).required('Required'),
  status: Yup.string().required('Required'),
});

const STATUS_COLORS = {
  paid: 'badge-green',
  pending: 'badge-yellow',
  overdue: 'badge-red',
};

export default function Fees() {
  const { role } = useAuth();
  const isAdmin = role === 'admin';

  // const { data: fees, loading, error, refetch } = useFetch(
  //   () => isAdmin ? feesApi.getAll() : feesApi.getMyFees()
  // );
  // const { data: students } = useFetch(
  //   () => isAdmin ? studentApi.getAll() : Promise.resolve({ data: [] })
  // );
  const { data: feesResponse, loading, error, refetch } = useFetch(
    () => isAdmin ? feesApi.getAll() : feesApi.getMyFees()
  );

  const { data: studentsResponse } = useFetch(
    () => isAdmin ? studentApi.getAll() : Promise.resolve({ data: [] })
  );

  // const fees = feesResponse?.data || [];
  // const fees = Array.isArray(feesResponse?.data?.fees)
  //   ? feesResponse.data.fees
  //   : [];
  // const fees =
  //   Array.isArray(feesResponse)
  //     ? feesResponse
  //     : Array.isArray(feesResponse?.data)
  //       ? feesResponse.data
  //       : [];
      const fees =
        feesResponse?.data?.fees ||
        feesResponse?.data ||
        feesResponse?.fees ||
        [];
  // const students = studentsResponse?.data || [];
  // const students = Array.isArray(studentsResponse?.data?.students)
  //   ? studentsResponse.data.students
  //   : [];
  // const students =
  //   Array.isArray(studentsResponse)
  //       ? studentsResponse
  //       : Array.isArray(studentsResponse?.data)
  //         ? studentsResponse.data
  //         : [];
     const students =
      studentsResponse?.data?.students ||
      studentsResponse?.students ||
      [];

  const addModal = useDisclosure();
  const editModal = useDisclosure();
  const [editing, setEditing] = useState(null);

  const createFormik = useFormik({
    initialValues: { student_id: '', amount: '' },
    validationSchema: createSchema,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      try {
        // await feesApi.create(values);
        await feesApi.create({
          student_id: Number(values.student_id),
          amount: Number(values.amount),
        });
        toast.success('Fee record created');
        resetForm();
        addModal.close();
        refetch();
      } catch (err) {
        toast.error(err?.response?.data?.detail || 'Failed to create fee');
      } finally {
        setSubmitting(false);
      }
    },
  });

  const editFormik = useFormik({
    initialValues: { amount: editing?.amount || '', status: editing?.status || 'pending' },
    validationSchema: updateSchema,
    enableReinitialize: true,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        await feesApi.update(editing.id, values);
        toast.success('Fee updated');
        editModal.close();
        refetch();
      } catch (err) {
        toast.error(err?.response?.data?.detail || 'Failed to update');
      } finally {
        setSubmitting(false);
      }
    },
  });

  const handleEdit = (fee) => {
    setEditing(fee);
    editFormik.setValues({ amount: fee.amount, status: fee.status || 'pending' });
    editModal.open();
  };

  // const getStudentName = (id) => students?.find(s => s.id === id)?.name || `Student #${id}`;
  const getStudentName = (id) =>
    students?.find(s => String(s.id) === String(id))?.name ||
    students?.find(s => String(s.id) === String(id))?.full_name ||
    `${students?.find(s => String(s.id) === String(id))?.first_name || ''} ${students?.find(s => String(s.id) === String(id))?.last_name || ''}`.trim() ||
    `Student #${id}`;

  const adminColumns = [
    { key: 'id', label: '#', render: id => <span className="text-xs text-slate-400">#{id}</span> },
    { key: 'student_id', label: 'Student', render: id => <span className="font-semibold text-slate-800 dark:text-slate-100">{getStudentName(id)}</span> },
    { key: 'amount', label: 'Amount', render: a => <span className="font-semibold text-primary-600 dark:text-primary-400">{formatCurrency(a)}</span> },
    {
      key: 'status', label: 'Status',
      render: s => {
        const cls = STATUS_COLORS[s?.toLowerCase()] || 'badge-blue';
        return <span className={`badge ${cls} capitalize`}>{s || 'pending'}</span>;
      }
    },
    { key: 'created_at', label: 'Date', render: d => formatDate(d) },
    {
      key: 'actions', label: 'Actions',
      render: (_, row) => (
        <button onClick={() => handleEdit(row)} className="p-2 rounded-lg text-slate-400 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-500/10 transition-all">
          <Pencil size={15} />
        </button>
      )
    },
  ];

  const studentColumns = [
    { key: 'id', label: '#', render: id => <span className="text-xs text-slate-400">#{id}</span> },
    { key: 'amount', label: 'Amount', render: a => <span className="font-semibold text-primary-600 dark:text-primary-400">{formatCurrency(a)}</span> },
    {
      key: 'status', label: 'Status',
      render: s => {
        const cls = STATUS_COLORS[s?.toLowerCase()] || 'badge-blue';
        return <span className={`badge ${cls} capitalize`}>{s || 'pending'}</span>;
      }
    },
    { key: 'created_at', label: 'Date', render: d => formatDate(d) },
  ];

  if (error) return <ErrorState message={error} onRetry={refetch} />;

  return (
    <div>
      <PageHeader
        title="Fees"
        subtitle={isAdmin ? 'Manage student fee records' : 'Your fee records'}
        actions={
          isAdmin && (
            <button onClick={addModal.open} className="btn-primary flex items-center gap-2">
              <Plus size={16} /> Add Fee Record
            </button>
          )
        }
      />

      {/* Summary cards for admin */}
      {isAdmin && !loading && fees && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          {[
            { label: 'Total Records', value: fees.length, color: 'text-slate-800 dark:text-white' },
            { label: 'Total Amount', value: formatCurrency(fees.reduce((s, f) => s + (f.amount || 0), 0)), color: 'text-primary-600 dark:text-primary-400' },
            { label: 'Paid', value: fees.filter(f => f.status === 'paid').length, color: 'text-emerald-600 dark:text-emerald-400' },
          ].map(({ label, value, color }) => (
            <div key={label} className="card p-5">
              <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wide font-semibold">{label}</p>
              <p className={`text-2xl font-bold mt-1 ${color}`}>{value}</p>
            </div>
          ))}
        </div>
      )}

      <div className="card p-6">
        <Table
          columns={isAdmin ? adminColumns : studentColumns}
          data={fees}
          loading={loading}
          emptyText="No fee records found"
        />
      </div>

      {/* Create Fee Modal */}
      <Modal isOpen={addModal.isOpen} onClose={addModal.close} title="Add Fee Record">
        <form onSubmit={createFormik.handleSubmit} className="space-y-4">
          <div>
            <label className="label">Student</label>
            <select name="student_id" className="input-field" value={createFormik.values.student_id} onChange={(e) =>
                createFormik.setFieldValue("student_id", Number(e.target.value))
              } onBlur={createFormik.handleBlur}>
              <option value="">Select student...</option>
              {/* {students?.map(s => <option key={s.id} value={s.id}>{s.name}</option>)} */}
              {students?.map(s => (
                <option key={s.id} value={s.id}>
                  {s.name || s.full_name || `${s.first_name || ''} ${s.last_name || ''}`.trim() || `Student ${s.id}`}
                </option>
              ))}
            </select>
            {createFormik.touched.student_id && createFormik.errors.student_id && (
              <p className="text-xs text-red-500 mt-1">{createFormik.errors.student_id}</p>
            )}
          </div>
          <div>
            <label className="label">Amount (₹)</label>
            <input name="amount" type="number" className="input-field" placeholder="5000" value={createFormik.values.amount} onChange={(e) =>
                createFormik.setFieldValue("amount", Number(e.target.value))
              } onBlur={createFormik.handleBlur} />
            {createFormik.touched.amount && createFormik.errors.amount && (
              <p className="text-xs text-red-500 mt-1">{createFormik.errors.amount}</p>
            )}
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={addModal.close} className="btn-secondary">Cancel</button>
            <button type="submit" disabled={createFormik.isSubmitting} className="btn-primary">
              {createFormik.isSubmitting ? 'Creating...' : 'Create Fee'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Edit Fee Modal */}
      <Modal isOpen={editModal.isOpen} onClose={editModal.close} title="Update Fee Record">
        <form onSubmit={editFormik.handleSubmit} className="space-y-4">
          <div>
            <label className="label">Amount (₹)</label>
            <input name="amount" type="number" className="input-field" value={editFormik.values.amount} onChange={editFormik.handleChange} onBlur={editFormik.handleBlur} />
            {editFormik.touched.amount && editFormik.errors.amount && (
              <p className="text-xs text-red-500 mt-1">{editFormik.errors.amount}</p>
            )}
          </div>
          <div>
            <label className="label">Status</label>
            <div className="grid grid-cols-3 gap-2">
              {['pending', 'paid', 'overdue'].map(s => (
                <button key={s} type="button"
                  onClick={() => editFormik.setFieldValue('status', s)}
                  className={`py-2.5 rounded-xl text-sm font-semibold capitalize transition-all border-2 ${
                    editFormik.values.status === s
                      ? s === 'paid' ? 'bg-emerald-500 border-emerald-500 text-white'
                        : s === 'overdue' ? 'bg-red-500 border-red-500 text-white'
                        : 'bg-amber-500 border-amber-500 text-white'
                      : 'border-slate-200 dark:border-white/[0.08] text-slate-500 dark:text-slate-400'
                  }`}
                >{s}</button>
              ))}
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={editModal.close} className="btn-secondary">Cancel</button>
            <button type="submit" disabled={editFormik.isSubmitting} className="btn-primary">
              {editFormik.isSubmitting ? 'Updating...' : 'Update Fee'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
