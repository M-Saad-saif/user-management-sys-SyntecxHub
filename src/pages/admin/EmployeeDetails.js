import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { employeeAPI } from '../../services/api';
import Sidebar from '../../components/common/Sidebar';
import Navbar from '../../components/common/Navbar';
import Button from '../../components/common/Button';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const EmployeeDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEmployee();
    // eslint-disable-next-line
  }, [id]);

  const fetchEmployee = async () => {
    try {
      const response = await employeeAPI.getById(id);
      setEmployee(response.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (!employee) return <div>Employee not found</div>;

  return (
    <div className="layout">
      <Sidebar />
      <div className="main-content">
        <Navbar />
        <div className="content-area">
          <div className="page-header">
            <h1>Employee Details</h1>
            <Button variant="secondary" onClick={() => navigate('/admin/employees')}>Back to List</Button>
          </div>

          <div className="form-container">
            <div style={{ display: 'flex', gap: '2rem', marginBottom: '2rem' }}>
              <div className="employee-avatar">
                {employee.profilePicture ? (
                  <img src={`http://localhost:5000/uploads/${employee.profilePicture}`} alt={employee.fullName} />
                ) : (
                  <div className="avatar-placeholder">{employee.fullName.charAt(0)}</div>
                )}
              </div>
              <div>
                <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{employee.fullName}</h2>
                <p style={{ color: 'var(--text-secondary)' }}>{employee.email}</p>
                <span className="badge badge-primary">{employee.department?.name}</span>
              </div>
            </div>

            <div className="info-grid">
              <div className="info-item"><strong>Age:</strong> {employee.age}</div>
              <div className="info-item"><strong>Gender:</strong> {employee.gender}</div>
              <div className="info-item"><strong>Phone:</strong> {employee.phone}</div>
              <div className="info-item"><strong>Salary:</strong> ${employee.salary.toLocaleString()}</div>
              <div className="info-item"><strong>Date Joined:</strong> {new Date(employee.dateJoined).toLocaleDateString()}</div>
              <div className="info-item" style={{ gridColumn: '1 / -1' }}><strong>Address:</strong> {employee.address}</div>
            </div>

            <div className="form-actions">
              <Button variant="primary" onClick={() => navigate(`/admin/employees/edit/${employee._id}`)}>Edit Employee</Button>
              <Button variant="success" onClick={() => navigate(`/admin/salary/employee/${employee._id}`)}>Manage Salary</Button>
              <Button variant="warning" onClick={() => navigate(`/admin/leaves/employee/${employee._id}`)}>View Leaves</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDetails;