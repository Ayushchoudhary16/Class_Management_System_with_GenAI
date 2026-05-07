import { useState } from 'react';
import { toast } from 'react-toastify';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Plus, Trash2, Pencil } from 'lucide-react';
import { useFetch, useDisclosure } from '../../hooks/useFetch';
import { batchApi } from '../../api/batchApi';
import { classApi } from '../../api/classApi';
import { PageHeader, Table, Modal, ConfirmDialog, ErrorState } from '../../components/index.jsx';
import { formatDate, formatCurrency } from '../../utils/helpers';

const schema = Yup.object({
  name: Yup.string().required('Required'),
  class_id: Yup.number().required('Required'),
  batch_fee: Yup.number().min(0).required('Required'),
  start_date: Yup.string().required('Required'),
  end_date: Yup.string().required('Required'),
});

export default function Batches() {
  // const { data: batches, loading, error, refetch } = useFetch(() => batchApi.getAll());
  // const { data: batchRes } = useFetch(() => batchApi.getAll());
  const { data: batchRes, loading, error, refetch } = useFetch(() => batchApi.getAll());
  // const batches = batchRes?.data || [];
  const batches = Array.isArray(batchRes?.batches)
    ? batchRes.batches
    : [];
  // const { data: classes } = useFetch(() => classApi.getAll());
  const { data: classRes } = useFetch(() => classApi.getAll());
  // const classes = classRes?.data || []; 
  const classes = Array.isArray(classRes?.classes)
    ? classRes.classes
    : [];
  const addModal = useDisclosure();
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [editing, setEditing] = useState(null);

  const formik = useFormik({
    initialValues: { name: '', class_id: '', batch_fee: '', start_date: '', end_date: '' },
    validationSchema: schema,
    enableReinitialize: true,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      try {
        if (editing) {
          await batchApi.update(editing.id, values);
          toast.success('Batch updated');
        } else {
          await batchApi.create(values);
          toast.success('Batch created');
        }
        resetForm();
        addModal.close();
        setEditing(null);
        refetch();
      } catch (err) {
        toast.error(err?.response?.data?.detail || 'Operation failed');
      } finally {
        setSubmitting(false);
      }
    },
  });

  const handleEdit = (batch) => {
    setEditing(batch);
    formik.setValues({
      name: batch.name, class_id: batch.class_id,
      batch_fee: batch.batch_fee,
      start_date: batch.start_date?.split('T')[0] || '',
      end_date: batch.end_date?.split('T')[0] || '',
    });
    addModal.open();
  };

  const handleDelete = async () => {
    setDeleteLoading(true);
    try {
      await batchApi.delete(deleteTarget.id);
      toast.success('Batch deleted');
      setDeleteTarget(null);
      refetch();
    } catch {
      toast.error('Failed to delete');
    } finally {
      setDeleteLoading(false);
    }
  };

  const getClassName = (id) => classes?.find(c => c.id === id)?.title || `Class #${id}`;

  const columns = [
    { key: 'id', label: '#', render: id => <span className="text-xs text-slate-400">#{id}</span> },
    { key: 'name', label: 'Batch Name', render: n => <span className="font-semibold text-slate-800 dark:text-slate-100">{n}</span> },
    { key: 'class_id', label: 'Class', render: id => getClassName(id) },
    { key: 'batch_fee', label: 'Fee', render: f => formatCurrency(f) },
    { key: 'start_date', label: 'Start', render: d => formatDate(d) },
    { key: 'end_date', label: 'End', render: d => formatDate(d) },
    // {
    //   key: 'id', label: 'Actions',
    //   render: (id, row) => (
    //     <div className="flex gap-2">
    //       <button onClick={() => handleEdit(row)} className="p-2 rounded-lg text-slate-400 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-500/10 transition-all">
    //         <Pencil size={15} />
    //       </button>
    //       <button onClick={() => setDeleteTarget(row)} className="p-2 rounded-lg text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all">
    //         <Trash2 size={15} />
    //       </button>
    //     </div>
    //   )
    // },
    {
      key: 'actions',   // ✅ FIXED (unique key)
      label: 'Actions',
      render: (id, row) => (
        <div className="flex gap-2">
          <button
            onClick={() => handleEdit(row)}
            className="p-2 rounded-lg text-slate-400 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-500/10 transition-all"
          >
            <Pencil size={15} />
          </button>

          <button
            onClick={() => setDeleteTarget(row)}
            className="p-2 rounded-lg text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all"
          >
            <Trash2 size={15} />
          </button>
        </div>
      )
    }
  ];

  if (error) return <ErrorState message={error} onRetry={refetch} />;

  return (
    <div>
      <PageHeader
        title="Batches"
        subtitle="Manage course batches and scheduling"
        actions={
          <button onClick={() => { setEditing(null); formik.resetForm(); addModal.open(); }} className="btn-primary flex items-center gap-2">
            <Plus size={16} /> Create Batch
          </button>
        }
      />

      <div className="card p-6">
        <Table columns={columns} data={batches} loading={loading} emptyText="No batches found" />
      </div>

      <Modal isOpen={addModal.isOpen} onClose={() => { addModal.close(); setEditing(null); formik.resetForm(); }} title={editing ? 'Edit Batch' : 'Create Batch'}>
        <form onSubmit={formik.handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="label">Batch Name</label>
              <input name="name" className="input-field" placeholder="e.g. Batch A 2025" value={formik.values.name} onChange={formik.handleChange} onBlur={formik.handleBlur} />
              {formik.touched.name && formik.errors.name && <p className="text-xs text-red-500 mt-1">{formik.errors.name}</p>}
            </div>
            <div className="col-span-2">
              <label className="label">Class</label>
              <select name="class_id" className="input-field" value={formik.values.class_id} onChange={formik.handleChange} onBlur={formik.handleBlur}>
                <option value="">Select class...</option>
                {/* {classes?.map(c => <option key={c.id} value={c.id}>{c.title}</option>)} */}
                {Array.isArray(classes) &&
                  classes.map(c => (
                    <option key={c.id} value={c.id}>{c.title}</option>
                  ))
                }
              </select>
              {formik.touched.class_id && formik.errors.class_id && <p className="text-xs text-red-500 mt-1">{formik.errors.class_id}</p>}
            </div>
            <div>
              <label className="label">Batch Fee (₹)</label>
              <input name="batch_fee" type="number" className="input-field" placeholder="5000" value={formik.values.batch_fee} onChange={formik.handleChange} onBlur={formik.handleBlur} />
              {formik.touched.batch_fee && formik.errors.batch_fee && <p className="text-xs text-red-500 mt-1">{formik.errors.batch_fee}</p>}
            </div>
            <div />
            <div>
              <label className="label">Start Date</label>
              <input name="start_date" type="date" className="input-field" value={formik.values.start_date} onChange={formik.handleChange} onBlur={formik.handleBlur} />
              {formik.touched.start_date && formik.errors.start_date && <p className="text-xs text-red-500 mt-1">{formik.errors.start_date}</p>}
            </div>
            <div>
              <label className="label">End Date</label>
              <input name="end_date" type="date" className="input-field" value={formik.values.end_date} onChange={formik.handleChange} onBlur={formik.handleBlur} />
              {formik.touched.end_date && formik.errors.end_date && <p className="text-xs text-red-500 mt-1">{formik.errors.end_date}</p>}
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={addModal.close} className="btn-secondary">Cancel</button>
            <button type="submit" disabled={formik.isSubmitting} className="btn-primary">
              {formik.isSubmitting ? 'Saving...' : editing ? 'Update Batch' : 'Create Batch'}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        loading={deleteLoading}
        title="Delete Batch"
        message={`Delete batch "${deleteTarget?.name}"?`}
      />
    </div>
  );
}
