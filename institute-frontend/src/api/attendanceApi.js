import api from './axios';

export const attendanceApi = {
  mark: (data) => api.post('/attendance/mark', data),
  getByStudent: (student_id) => api.get('/attendance/student', { params: { student_id } }),
  getByBatch: (batch_id) => api.get('/attendance/batch', { params: { batch_id } }),
  update: (attendance_id, data) => api.put('/attendance/update', data, { params: { attendance_id } }),
  getPercentage: (student_id) => api.get('/attendance/percentage', { params: { student_id } }),
  getMonthly: (student_id) => api.get('/attendance/monthly', { params: { student_id } }),
};
