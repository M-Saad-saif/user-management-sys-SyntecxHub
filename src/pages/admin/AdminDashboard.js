import React, { useState, useEffect } from "react";
import { dashboardAPI } from "../../services/api";
import Sidebar from "../../components/common/Sidebar";
import Navbar from "../../components/common/Navbar";
import Card from "../../components/common/Card";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import "../../styles/Dashboard.css";

const AdminDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await dashboardAPI.getAdminDashboard();
      setDashboardData(response.data.data);
    } catch (err) {
      setError(err.message || "Failed to fetch dashboard data");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  if (error) {
    return (
      <div className="error-container">
        <p>{error}</p>
      </div>
    );
  }

  const { summary, recentEmployees, departmentStats } = dashboardData;

  return (
    <div className="layout">
      <Sidebar />
      <div className="main-content">
        <Navbar />
        <div className="content-area">
          <div className="page-header">
            <h1>Admin Dashboard</h1>
            <p>Overview of your organization</p>
          </div>

          <div className="dashboard-grid">
            <Card
              title="Total Employees"
              value={summary.totalEmployees}
              icon="👥"
              color="primary"
            />
            <Card
              title="Total Departments"
              value={summary.totalDepartments}
              icon="🏢"
              color="success"
            />
            <Card
              title="Total Salary Expense"
              value={`$${summary.totalSalaryExpense.toLocaleString()}`}
              icon="💰"
              color="warning"
            />
            <Card
              title="Pending Leaves"
              value={summary.totalPendingLeaves}
              icon="⏳"
              color="info"
            />
            <Card
              title="Approved Leaves"
              value={summary.totalApprovedLeaves}
              icon="✅"
              color="success"
            />
            <Card
              title="Rejected Leaves"
              value={summary.totalRejectedLeaves}
              icon="❌"
              color="danger"
            />
          </div>

          <div className="dashboard-sections">
            <div className="dashboard-section">
              <h2>Recent Employees</h2>
              <div className="recent-employees">
                {recentEmployees && recentEmployees.length > 0 ? (
                  recentEmployees.map((employee) => (
                    <div key={employee._id} className="employee-card">
                      <div className="employee-avatar">
                        {employee.profilePicture ? (
                          <img
                            src={`http://localhost:5000/uploads/${employee.profilePicture}`}
                            alt={employee.fullName}
                          />
                        ) : (
                          <div className="avatar-placeholder">
                            {employee.fullName.charAt(0)}
                          </div>
                        )}
                      </div>
                      <div className="employee-info">
                        <h3>{employee.fullName}</h3>
                        <p>{employee.email}</p>
                        <span className="badge">
                          {employee.department?.name}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p>No recent employees</p>
                )}
              </div>
            </div>

            <div className="dashboard-section">
              <h2>Department Statistics</h2>
              <div className="department-stats">
                {departmentStats && departmentStats.length > 0 ? (
                  departmentStats.map((dept, index) => (
                    <div key={index} className="stat-item">
                      <div className="stat-info">
                        <h4>{dept.departmentName}</h4>
                        <p>{dept.employeeCount} Employees</p>
                      </div>
                      <div className="stat-value">
                        ${dept.totalSalary.toLocaleString()}
                      </div>
                    </div>
                  ))
                ) : (
                  <p>No department data available</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
