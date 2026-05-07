import api from './axios';

export const facultyApi = {
  signup: (data) => api.post('/faculty/signup', data),
  login: (data) => api.post('/faculty/login', data),
  getById: (faculty_id) => api.get('/faculty/get', { params: { faculty_id } }),
  getAll: () => api.get('/faculty/all'),
  update: (data) => api.put('/faculty/update', data),
  delete: (faculty_id) => api.delete('/faculty/delete', { params: { faculty_id } }),
};
