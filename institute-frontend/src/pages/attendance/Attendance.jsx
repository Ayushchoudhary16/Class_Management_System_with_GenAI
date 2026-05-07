import { useState } from 'react';
import { toast } from 'react-toastify';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Plus, CheckCircle, XCircle } from 'lucide-react';
import { useFetch, useDisclosure } from '../../hooks/useFetch';
import { attendanceApi } from '../../api/attendanceApi';
import { studentApi } from '../../api/studentApi';
import { batchApi } from '../../api/batchApi';
import { PageHeader, Table, Modal, ErrorState } from '../../components/index.jsx';
import { formatDate } from '../../utils/helpers';

const schema = Yup.object({
  student_id: Yup.number().required('Required'),
  batch_id: Yup.number().required('Required'),
  date: Yup.string().required('Required'),
  status: Yup.string().oneOf(['present', 'absent']).required('Required'),
});

export default function Attendance() {
  // const { data: students } = useFetch(() => studentApi.getAll());
  // const { data: studentsResponse } = useFetch(() => studentApi.getAll());
  // const students = studentsResponse?.data || [];
  const { data: studentsResponse } = useFetch(() => studentApi.getAll());

  // const students = Array.isArray(studentsResponse?.data?.students)
  //   ? studentsResponse.data.students
  //   : [];
  const students =
  Array.isArray(studentsResponse)
    ? studentsResponse
    : Array.isArray(studentsResponse?.data)
      ? studentsResponse.data
      : Array.isArray(studentsResponse?.data?.students)
        ? studentsResponse.data.students
        : Array.isArray(studentsResponse?.students)
          ? studentsResponse.students
          : [];
  // const { data: batches } = useFetch(() => batchApi.getAll());
  const { data: batchRes } = useFetch(() => batchApi.getAll());

  // const batches = Array.isArray(batchRes?.data?.batches)
  //   ? batchRes.data.batches
  //   : [];
  const batches =
  Array.isArray(batchRes)
    ? batchRes
    : Array.isArray(batchRes?.data)
      ? batchRes.data
      : Array.isArray(batchRes?.data?.batches)
        ? batchRes.data.batches
        : Array.isArray(batchRes?.batches)
          ? batchRes.batches
          : [];
          
  const addModal = useDisclosure();
  const [viewData, setViewData] = useState([]);
  const [viewLoading, setViewLoading] = useState(false);
  const [filterStudentId, setFilterStudentId] = useState('');

  const formik = useFormik({
    initialValues: { student_id: '', batch_id: '', date: new Date().toISOString().split('T')[0], status: 'present' },
    validationSchema: schema,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      try {
        await attendanceApi.mark(values);
        toast.success('Attendance marked');
        resetForm();
        addModal.close();
      } catch (err) {
        toast.error(err?.response?.data?.detail || 'Failed to mark attendance');
      } finally {
        setSubmitting(false);
      }
    },
  });

  // const handleViewStudent = async () => {
  //   if (!filterStudentId) return toast.error('Select a student');
  //   setViewLoading(true);
  //   try {
  //     const res = await attendanceApi.getByStudent(filterStudentId);
  //     setViewData(res.data || []);
  //   } catch {
  //     toast.error('Failed to load attendance');
  //   } finally {
  //     setViewLoading(false);
  //   }
  // };
  const handleViewStudent = async () => {
    if (!filterStudentId) return toast.error('Select a student');

    setViewLoading(true);
    try {
      const res = await attendanceApi.getByStudent(filterStudentId);

      setViewData(
        Array.isArray(res?.data?.attendance)
          ? res.data.attendance
          : []
      );
    } catch {
      toast.error('Failed to load attendance');
    } finally {
      setViewLoading(false);
    }
  };

  const getStudentName = (id) => students?.find(s => s.id === id)?.name || `Student #${id}`;
  const getBatchName = (id) => batches?.find(b => b.id === id)?.name || `Batch #${id}`;

  const columns = [
    { key: 'student_id', label: 'Student', render: id => getStudentName(id) },
    { key: 'batch_id', label: 'Batch', render: id => getBatchName(id) },
    { key: 'date', label: 'Date', render: d => formatDate(d) },
    {
      key: 'status', label: 'Status',
      render: s => s === 'present'
        ? <span className="badge badge-green flex items-center gap-1.5 w-fit"><CheckCircle size={11} /> Present</span>
        : <span className="badge badge-red flex items-center gap-1.5 w-fit"><XCircle size={11} /> Absent</span>
    },
  ];

  return (
    <div>
      <PageHeader
        title="Attendance"
        subtitle="Mark and view student attendance records"
        actions={
          <button onClick={addModal.open} className="btn-primary flex items-center gap-2">
            <Plus size={16} /> Mark Attendance
          </button>
        }
      />

      {/* Filter by student */}
      <div className="card p-6 mb-5">
        <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-4">View Attendance by Student</h3>
        <div className="flex gap-3">
          <select
            className="input-field flex-1"
            value={filterStudentId}
            onChange={e => setFilterStudentId(e.target.value)}
          >
            <option value="">Select student...</option>
            {/* {students?.map(s => <option key={s.id} value={s.id}>{s.name}</option>)} */}
            {Array.isArray(students) &&
              students.map((student) => (
                <option key={student.id} value={student.id}>
                  {student.name}
                </option>
              ))
            }
          </select>
          <button onClick={handleViewStudent} disabled={viewLoading} className="btn-primary px-6">
            {viewLoading ? 'Loading...' : 'View'}
          </button>
        </div>
      </div>

      <div className="card p-6">
        <Table columns={columns} data={viewData} loading={viewLoading} emptyText="Select a student to view attendance" />
      </div>

      <Modal isOpen={addModal.isOpen} onClose={addModal.close} title="Mark Attendance">
        <form onSubmit={formik.handleSubmit} className="space-y-4">
          <div>
            <label className="label">Student</label>
            <select name="student_id" className="input-field" value={formik.values.student_id} onChange={formik.handleChange} onBlur={formik.handleBlur}>
              <option value="">Select student...</option>
              {students?.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
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
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Date</label>
              <input name="date" type="date" className="input-field" value={formik.values.date} onChange={formik.handleChange} onBlur={formik.handleBlur} />
              {formik.touched.date && formik.errors.date && <p className="text-xs text-red-500 mt-1">{formik.errors.date}</p>}
            </div>
            <div>
              <label className="label">Status</label>
              <div className="grid grid-cols-2 gap-2 mt-1">
                {['present', 'absent'].map(s => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => formik.setFieldValue('status', s)}
                    className={`py-2.5 rounded-xl text-sm font-semibold transition-all border-2 ${
                      formik.values.status === s
                        ? s === 'present' ? 'bg-emerald-500 border-emerald-500 text-white' : 'bg-red-500 border-red-500 text-white'
                        : 'border-slate-200 dark:border-white/[0.08] text-slate-500'
                    }`}
                  >
                    {s.charAt(0).toUpperCase() + s.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={addModal.close} className="btn-secondary">Cancel</button>
            <button type="submit" disabled={formik.isSubmitting} className="btn-primary">
              {formik.isSubmitting ? 'Marking...' : 'Mark Attendance'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
