import api from './axios';

export const classApi = {
  create: (data) => api.post('/class/create_class', data),
  getAll: () => api.get('/class/get_all_classes'),
  getById: (class_id) => api.get('/class/get_class_by_id', { params: { class_id } }),
  getWithBatches: (class_id) => api.get('/class/get_class_by_id_p_batch', { params: { class_id } }),
  update: (class_id, data) => api.put('/class/update_class', data, { params: { class_id } }),
  delete: (class_id) => api.delete('/class/delete_class', { params: { class_id } }),
};
