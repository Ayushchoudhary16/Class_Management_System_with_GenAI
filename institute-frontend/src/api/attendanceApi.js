// import api from './axios';

// export const attendanceApi = {
//   mark: (data) => api.post('/attendance/mark', data),
//   getByStudent: (student_id) => api.get('/attendance/student', { params: { student_id } }),
//   getByBatch: (batch_id) => api.get('/attendance/batch', { params: { batch_id } }),
//   update: (attendance_id, data) => api.put('/attendance/update', data, { params: { attendance_id } }),
//   getPercentage: (student_id) => api.get('/attendance/percentage', { params: { student_id } }),
//   getMonthly: (student_id) => api.get('/attendance/monthly', { params: { student_id } }),
// };

import api from './axios';

export const attendanceApi = {

  // =========================================
  // MARK ATTENDANCE
  // =========================================
  mark: (data) =>
    api.post('/attendance/mark', data),

  // =========================================
  // GET ATTENDANCE BY STUDENT
  // =========================================
  getByStudent: (student_id) =>
    api.get('/attendance/student', {
      params: { student_id }
    }),

  // =========================================
  // GET ATTENDANCE BY BATCH
  // =========================================
  getByBatch: (batch_id) =>
    api.get('/attendance/batch', {
      params: { batch_id }
    }),

  // =========================================
  // UPDATE ATTENDANCE
  // =========================================
  update: (attendance_id, data) =>
    api.put('/attendance/update', data, {
      params: { attendance_id }
    }),

  // =========================================
  // ATTENDANCE PERCENTAGE
  // =========================================
  getPercentage: (student_id, batch_id) =>
    api.get('/attendance/percentage', {
      params: {
        student_id,
        batch_id
      }
    }),

  // =========================================
  // MONTHLY ATTENDANCE REPORT
  // =========================================
  getMonthly: (student_id, batch_id, month) =>
    api.get('/attendance/monthly', {
      params: {
        student_id,
        batch_id,
        month
      }
    }),

  // =========================================
  // STUDENT SELF ATTENDANCE
  // =========================================
  myAttendance: () =>
    api.get('/attendance/my-attendance'),
};