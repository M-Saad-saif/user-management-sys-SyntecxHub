import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './utils/ProtectedRoute';

import Login from './pages/Login';
import AdminDashboard from './pages/admin/AdminDashboard';
import Employees from './pages/admin/Employees';
import AddEmployee from './pages/admin/AddEmployee';
import EditEmployee from './pages/admin/EditEmployee';
import EmployeeDetails from './pages/admin/EmployeeDetails';
import Departments from './pages/admin/Departments';
import Leaves from './pages/admin/Leaves';
import Salary from './pages/admin/Salary';
import Settings from './pages/admin/Settings';
import EmployeeDashboard from './pages/employee/EmployeeDashboard';
import ApplyLeave from './pages/employee/ApplyLeave';
import LeaveHistory from './pages/employee/LeaveHistory';

import './styles/App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Navigate to="/login" replace />} />

          {/* Admin Routes */}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute requireAdmin={true}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/employees"
            element={
              <ProtectedRoute requireAdmin={true}>
                <Employees />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/employees/add"
            element={
              <ProtectedRoute requireAdmin={true}>
                <AddEmployee />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/employees/edit/:id"
            element={
              <ProtectedRoute requireAdmin={true}>
                <EditEmployee />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/employees/:id"
            element={
              <ProtectedRoute requireAdmin={true}>
                <EmployeeDetails />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/departments"
            element={
              <ProtectedRoute requireAdmin={true}>
                <Departments />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/leaves"
            element={
              <ProtectedRoute requireAdmin={true}>
                <Leaves />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/salary"
            element={
              <ProtectedRoute requireAdmin={true}>
                <Salary />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/settings"
            element={
              <ProtectedRoute requireAdmin={true}>
                <Settings />
              </ProtectedRoute>
            }
          />

          {/* Employee Routes */}
          <Route
            path="/employee/dashboard"
            element={
              <ProtectedRoute>
                <EmployeeDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/employee/apply-leave"
            element={
              <ProtectedRoute>
                <ApplyLeave />
              </ProtectedRoute>
            }
          />
          <Route
            path="/employee/leave-history"
            element={
              <ProtectedRoute>
                <LeaveHistory />
              </ProtectedRoute>
            }
          />
          <Route
            path="/employee/settings"
            element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;