import React, { useState, useEffect } from "react";
import { dashboardAPI } from "../../services/api";
import Sidebar from "../../components/common/Sidebar";
import Navbar from "../../components/common/Navbar";
import Card from "../../components/common/Card";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import "../../styles/Dashboard.css";

const EmployeeDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await dashboardAPI.getEmployeeDashboard();
      setDashboardData(response.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  const { employee, leaveStats, recentLeaves, currentSalary } = dashboardData;

  return (
    <div className="layout">
      <Sidebar />
      <div className="main-content">
        <Navbar />
        <div className="content-area">
          <div className="page-header">
            <h1>Employee Dashboard</h1>
            <p>Welcome, {employee.fullName}</p>
          </div>

          <div className="dashboard-grid">
            <Card
              title="Current Salary"
              value={`$${currentSalary.toLocaleString()}`}
              icon="💰"
              color="success"
            />
            <Card
              title="Total Leaves"
              value={leaveStats.totalLeaves}
              icon="📋"
              color="primary"
            />
            <Card
              title="Pending Leaves"
              value={leaveStats.pendingLeaves}
              icon="⏳"
              color="warning"
            />
            <Card
              title="Approved Leaves"
              value={leaveStats.approvedLeaves}
              icon="✅"
              color="success"
            />
          </div>

          <div className="dashboard-sections">
            <div className="dashboard-section">
              <h2>Personal Information</h2>
              <div className="info-grid">
                <div className="info-item">
                  <strong>Email:</strong> {employee.email}
                </div>
                <div className="info-item">
                  <strong>Department:</strong> {employee.department?.name}
                </div>
                <div className="info-item">
                  <strong>Phone:</strong> {employee.phone}
                </div>
                <div className="info-item">
                  <strong>Age:</strong> {employee.age}
                </div>
                <div className="info-item">
                  <strong>Gender:</strong> {employee.gender}
                </div>
                <div className="info-item">
                  <strong>Date Joined:</strong>{" "}
                  {new Date(employee.dateJoined).toLocaleDateString()}
                </div>
                <div className="info-item" style={{ gridColumn: "1 / -1" }}>
                  <strong>Address:</strong> {employee.address}
                </div>
              </div>
            </div>

            <div className="dashboard-section">
              <h2>Recent Leave Applications</h2>
              <div className="leave-list">
                {recentLeaves && recentLeaves.length > 0 ? (
                  recentLeaves.map((leave) => (
                    <div key={leave._id} className="leave-item">
                      <div>
                        <strong>{leave.leaveType}</strong>
                        <p>
                          {new Date(leave.fromDate).toLocaleDateString()} -{" "}
                          {new Date(leave.toDate).toLocaleDateString()}
                        </p>
                      </div>
                      <span
                        className={`badge badge-${leave.status.toLowerCase()}`}
                      >
                        {leave.status}
                      </span>
                    </div>
                  ))
                ) : (
                  <p>No leave applications found</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;
