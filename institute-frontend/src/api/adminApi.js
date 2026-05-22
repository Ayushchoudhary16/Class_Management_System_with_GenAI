import api from './axios';

export const adminApi = {
  signup: (data) => api.post('/admin/admin_register', data),
  login: (data) => api.post('/admin/admin_login', data),
  getById: () => api.get('/admin/get_admin_by_id'),
  update: (data) => api.put('/admin/update_admin', data),
  delete: () => api.delete('/admin/delete_admin'),
  approveFaculty: (id) => api.put(`/admin/approve/${id}`),
  getPendingFaculty: () => api.get('/admin/requests'),
};
