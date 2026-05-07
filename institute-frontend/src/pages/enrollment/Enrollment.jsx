import { useState } from 'react';
import { toast } from 'react-toastify';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Plus, Trash2 } from 'lucide-react';
import { useFetch, useDisclosure } from '../../hooks/useFetch';
import { enrollApi } from '../../api/enrollApi';
import { studentApi } from '../../api/studentApi';
import { batchApi } from '../../api/batchApi';
import { PageHeader, Table, Modal, ConfirmDialog, ErrorState } from '../../components/index.jsx';
import { formatDate } from '../../utils/helpers';

const schema = Yup.object({
  student_id: Yup.number().required('Required'),
  batch_id: Yup.number().required('Required'),
});

export default function Enrollment() {
  // const { data: enrollments, loading, error, refetch } = useFetch(() => enrollApi.getAll());
  const { data: enrollmentsRes, loading, error, refetch } = useFetch(() => enrollApi.getAll());
  // const enrollments = Array.isArray(enrollmentsRes)
  //   ? enrollmentsRes
  //   : enrollmentsRes?.data || [];
  const enrollments = Array.isArray(enrollmentsRes?.enrollments)
    ? enrollmentsRes.enrollments
    : [];
  // const { data: students } = useFetch(() => studentApi.getAll());
  // const { data: batches } = useFetch(() => batchApi.getAll());
  const { data: studentsRes } = useFetch(() => studentApi.getAll());
  const { data: batchesRes } = useFetch(() => batchApi.getAll());
  const students = Array.isArray(studentsRes?.students)
    ? studentsRes.students
    : [];

  // const batches = Array.isArray(batchesRes)
  //   ? batchesRes
  //   : batchesRes?.data || [];
  const batches = Array.isArray(batchesRes?.batches)
    ? batchesRes.batches
    : [];
  const addModal = useDisclosure();
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const formik = useFormik({
    initialValues: { student_id: '', batch_id: '' },
    validationSchema: schema,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      try {
        await enrollApi.enroll(values);
        toast.success('Student enrolled successfully');
        resetForm();
        addModal.close();
        refetch();
      } catch (err) {
        toast.error(err?.response?.data?.detail || 'Enrollment failed');
      } finally {
        setSubmitting(false);
      }
    },
  });

  const handleDelete = async () => {
    setDeleteLoading(true);
    try {
      await enrollApi.delete(deleteTarget.id);
      toast.success('Enrollment removed');
      setDeleteTarget(null);
      refetch();
    } catch {
      toast.error('Failed to remove');
    } finally {
      setDeleteLoading(false);
    }
  };

  const getStudentName = (id) => students?.find(s => s.id === id)?.name || `Student #${id}`;
  const getBatchName = (id) => batches?.find(b => b.id === id)?.name || `Batch #${id}`;

  const columns = [
    { key: 'id', label: '#', render: id => <span className="text-xs text-slate-400">#{id}</span> },
    { key: 'student_id', label: 'Student', render: id => <span className="font-semibold text-slate-800 dark:text-slate-100">{getStudentName(id)}</span> },
    { key: 'batch_id', label: 'Batch', render: id => getBatchName(id) },
    { key: 'enrolled_at', label: 'Enrolled On', render: d => formatDate(d) },
    // {
    //   key: 'id', label: 'Actions',
    //   render: (id, row) => (
    //     <button onClick={() => setDeleteTarget(row)} className="p-2 rounded-lg text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all">
    //       <Trash2 size={15} />
    //     </button>
    //   )
    // },
    {
      key: 'actions',   // ✅ change this
      label: 'Actions',
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
        title="Enrollment"
        subtitle="Manage student batch enrollments"
        actions={
          <button onClick={addModal.open} className="btn-primary flex items-center gap-2">
            <Plus size={16} /> Enroll Student
          </button>
        }
      />

      <div className="card p-6">
        <Table columns={columns} data={enrollments} loading={loading} emptyText="No enrollments yet" />
      </div>

      <Modal isOpen={addModal.isOpen} onClose={addModal.close} title="Enroll Student">
        <form onSubmit={formik.handleSubmit} className="space-y-4">
          <div>
            <label className="label">Student</label>
            <select name="student_id" className="input-field" value={formik.values.student_id} onChange={formik.handleChange} onBlur={formik.handleBlur}>
              <option value="">Select student...</option>
              {students?.map(s => <option key={s.id} value={s.id}>{s.name} ({s.email})</option>)}
            </select>
            {formik.touched.student_id && formik.errors.student_id && <p className="text-xs text-red-500 mt-1">{formik.errors.student_id}</p>}
          </div>
          <div>
            <label className="label">Batch</label>
            <select name="batch_id" className="input-field" value={formik.values.batch_id} onChange={formik.handleChange} onBlur={formik.handleBlur}>
              <option value="">Select batch...</option>
              {batches?.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
            </select>
            {formik.touched.batch_id && formik.errors.batch_id && <p className="text-xs text-red-500 mt-1">{formik.errors.batch_id}</p>}
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={addModal.close} className="btn-secondary">Cancel</button>
            <button type="submit" disabled={formik.isSubmitting} className="btn-primary">
              {formik.isSubmitting ? 'Enrolling...' : 'Enroll'}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        loading={deleteLoading}
        title="Remove Enrollment"
        message="Remove this enrollment record?"
      />
    </div>
  );
}
