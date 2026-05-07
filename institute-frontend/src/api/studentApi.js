import api from './axios';

export const studentApi = {
  signup: (data) => api.post('/student/signup', data),
  login: (data) => api.post('/student/login', data),
  getById: (student_id) => api.get('/student/get', { params: { student_id } }),
  getAll: () => api.get('/student/all'),
  update: (data) => api.put('/student/update', data),
  delete: (student_id) => api.delete('/student/delete', { params: { student_id } }),
};
