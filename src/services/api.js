import axios from "axios";

const API_URL =
  process.env.REACT_APP_BACKEND_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      if (error.response.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href = "/login";
      }
      return Promise.reject(error.response.data);
    }
    return Promise.reject(error);
  },
);

// Auth APIs
export const authAPI = {
  login: (credentials) => api.post("/auth/login", credentials),
  getMe: () => api.get("/auth/me"),
  changePassword: (data) => api.put("/auth/change-password", data),
  updateProfile: (data) => api.put("/auth/update-profile", data),
};

// Employee APIs
export const employeeAPI = {
  getAll: () => api.get("/employees"),
  getById: (id) => api.get(`/employees/${id}`),
  getByDepartment: (departmentId) =>
    api.get(`/employees/department/${departmentId}`),
  create: (formData) => api.post("/employees", formData),
  update: (id, formData) => api.put(`/employees/${id}`, formData),
  delete: (id) => api.delete(`/employees/${id}`),
};

// Department APIs
export const departmentAPI = {
  getAll: () => api.get("/departments"),
  getById: (id) => api.get(`/departments/${id}`),
  create: (data) => api.post("/departments", data),
  update: (id, data) => api.put(`/departments/${id}`, data),
  delete: (id) => api.delete(`/departments/${id}`),
};

// Leave APIs
export const leaveAPI = {
  getAll: () => api.get("/leaves"),
  getMyLeaves: () => api.get("/leaves/my-leaves"),
  getByEmployee: (employeeId) => api.get(`/leaves/employee/${employeeId}`),
  apply: (data) => api.post("/leaves", data),
  updateStatus: (id, status) => api.put(`/leaves/${id}/status`, { status }),
  delete: (id) => api.delete(`/leaves/${id}`),
};

// Salary APIs
export const salaryAPI = {
  getAll: () => api.get("/salary"),
  getMySalary: () => api.get("/salary/my-salary"),
  getByEmployee: (employeeId) => api.get(`/salary/employee/${employeeId}`),
  update: (employeeId, data) => api.post(`/salary/${employeeId}`, data),
};

// Dashboard APIs
export const dashboardAPI = {
  getAdminDashboard: () => api.get("/dashboard/admin"),
  getEmployeeDashboard: () => api.get("/dashboard/employee"),
};

export default api;
