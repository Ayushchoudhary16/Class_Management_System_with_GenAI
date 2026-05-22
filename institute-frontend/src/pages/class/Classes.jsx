import { useState } from 'react';
import { toast } from 'react-toastify';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Plus, Trash2, Pencil } from 'lucide-react';
import { useFetch, useDisclosure } from '../../hooks/useFetch';
import { classApi } from '../../api/classApi';
import { facultyApi } from '../../api/facultyApi';
import { PageHeader, Table, Modal, ConfirmDialog, ErrorState } from '../../components/index.jsx';

const schema = Yup.object({
  title: Yup.string().required('Required'),
  description: Yup.string().required('Required'),
  faculty_id: Yup.number().required('Required'),
});

export default function Classes() {
  // const { data: classes, loading, error, refetch } = useFetch(() => classApi.getAll());
  const { data: classRes, loading, error, refetch } = useFetch(() => classApi.getAll());
  // const classes = classRes?.data || [];
  const classes = Array.isArray(classRes?.classes)
    ? classRes.classes
    : [];
  // const { data: faculty } = useFetch(() => facultyApi.getAll());
  const { data: facultyRes } = useFetch(() => facultyApi.getAll());
  // const faculty = facultyRes?.data || [];
  const faculty = Array.isArray(facultyRes?.faculties)
    ? facultyRes.faculties.filter(f => f.is_approved)
    : [];
  const addModal = useDisclosure();
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [editing, setEditing] = useState(null);

  const formik = useFormik({
    initialValues: { title: '', description: '', faculty_id: '' },
    validationSchema: schema,
    enableReinitialize: true,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      try {
        if (editing) {
          await classApi.update(editing.id, values);
          toast.success('Class updated');
        } else {
          await classApi.create(values);
          toast.success('Class created');
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

  const handleEdit = (cls) => {
    setEditing(cls);
    formik.setValues({ title: cls.title, description: cls.description, faculty_id: cls.faculty_id });
    addModal.open();
  };

  const handleDelete = async () => {
    setDeleteLoading(true);
    try {
      await classApi.delete(deleteTarget.id);
      toast.success('Class deleted');
      setDeleteTarget(null);
      refetch();
    } catch {
      toast.error('Failed to delete');
    } finally {
      setDeleteLoading(false);
    }
  };

  // const getFacultyName = (id) => faculty?.find(f => f.id === id)?.name || `Faculty #${id}`;
  const getFacultyName = (id) =>
    faculty.find(f => f.id === id)?.name || `Faculty #${id}`;

  const columns = [
    { key: 'id', label: '#', render: id => <span className="text-xs text-slate-400">#{id}</span> },
    {
      key: 'title', label: 'Class',
      render: (title, row) => (
        <div>
          <p className="font-semibold text-slate-800 dark:text-slate-100">{title}</p>
          <p className="text-xs text-slate-400">{row.description}</p>
        </div>
      )
    },
    { key: 'faculty_id', label: 'Faculty', render: id => getFacultyName(id) },
    {
      key: 'actions', label: 'Actions',
      render: (id, row) => (
        <div className="flex gap-2">
          <button onClick={() => handleEdit(row)} className="p-2 rounded-lg text-slate-400 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-500/10 transition-all">
            <Pencil size={15} />
          </button>
          <button onClick={() => setDeleteTarget(row)} className="p-2 rounded-lg text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all">
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
        title="Classes"
        subtitle="Manage all classes and their faculty"
        actions={
          <button onClick={() => { setEditing(null); formik.resetForm(); addModal.open(); }} className="btn-primary flex items-center gap-2">
            <Plus size={16} /> Create Class
          </button>
        }
      />

      <div className="card p-6">
        <Table columns={columns} data={classes} loading={loading} emptyText="No classes found" />
      </div>

      <Modal isOpen={addModal.isOpen} onClose={() => { addModal.close(); setEditing(null); formik.resetForm(); }} title={editing ? 'Edit Class' : 'Create Class'}>
        <form onSubmit={formik.handleSubmit} className="space-y-4">
          <div>
            <label className="label">Class Title</label>
            <input name="title" className="input-field" placeholder="e.g. Mathematics Advanced" value={formik.values.title} onChange={formik.handleChange} onBlur={formik.handleBlur} />
            {formik.touched.title && formik.errors.title && <p className="text-xs text-red-500 mt-1">{formik.errors.title}</p>}
          </div>
          <div>
            <label className="label">Description</label>
            <textarea name="description" rows={3} className="input-field resize-none" placeholder="Brief description..." value={formik.values.description} onChange={formik.handleChange} onBlur={formik.handleBlur} />
            {formik.touched.description && formik.errors.description && <p className="text-xs text-red-500 mt-1">{formik.errors.description}</p>}
          </div>
          <div>
            <label className="label">Assign Faculty</label>
            <select name="faculty_id" className="input-field" value={formik.values.faculty_id} onChange={formik.handleChange} onBlur={formik.handleBlur}>
              <option value="">Select faculty...</option>
              {/* {faculty?.map(f => <option key={f.id} value={f.id}>{f.name} — {f.department}</option>)} */}
              {faculty.map(f => (
                <option key={f.id} value={f.id}>
                  {f.name} — {f.department}
                </option>
              ))}
            </select>
            {formik.touched.faculty_id && formik.errors.faculty_id && <p className="text-xs text-red-500 mt-1">{formik.errors.faculty_id}</p>}
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={addModal.close} className="btn-secondary">Cancel</button>
            <button type="submit" disabled={formik.isSubmitting} className="btn-primary">
              {formik.isSubmitting ? 'Saving...' : editing ? 'Update Class' : 'Create Class'}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        loading={deleteLoading}
        title="Delete Class"
        message={`Delete class "${deleteTarget?.title}"?`}
      />
    </div>
  );
}
