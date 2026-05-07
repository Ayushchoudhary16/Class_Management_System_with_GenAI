import api from './axios';

export const enrollApi = {
  enroll: (data) => api.post('/enroll/enroll', data),
  getAll: () => api.get('/enroll/all'),
  getByStudent: (student_id) => api.get('/enroll/by-student', { params: { student_id } }),
  getByBatch: (batch_id) => api.get('/enroll/by-batch', { params: { batch_id } }),
  delete: (enrollment_id) => api.delete('/enroll/delete', { params: { enrollment_id } }),
};
