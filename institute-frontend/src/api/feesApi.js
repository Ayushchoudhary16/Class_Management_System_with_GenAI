import api from './axios';

// export const feesApi = {
//   create: (data) => api.post('/fee/create-fee', data),
//   getAll: () => api.get('/fee/all-fees'),
//   getMyFees: () => api.get('/fee/my-fees'),
//   update: (fee_id, data) => api.put(`/fee/update-fee/${fee_id}`, data),
// };

export const feesApi = {
  create: (data) => api.post('/fees/create-fee', data),
  getAll: () => api.get('/fees/all-fees'),
  getMyFees: () => api.get('/fees/my-fees'),
  update: (fee_id, data) => api.put(`/fees/update-fee/${fee_id}`, data),
};