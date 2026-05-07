import api from './axios';

export const batchApi = {
  create: (data) => api.post('/batch/create_batch', data),
  getAll: () => api.get('/batch/get_all_batches'),
  getById: (batch_id) => api.get('/batch/get_batch_by_id', { params: { batch_id } }),
  update: (batch_id, data) => api.put('/batch/update_batch', data, { params: { batch_id } }),
  delete: (batch_id) => api.delete('/batch/delete_batch', { params: { batch_id } }),
};
