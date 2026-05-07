import api from './axios';

export const genaiApi = {
  studentChat: (data) => api.post('/genai/student', data),
  adminChat: (data) => api.post('/genai/admin', data),
};
