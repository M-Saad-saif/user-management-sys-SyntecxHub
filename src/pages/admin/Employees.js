import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { employeeAPI } from "../../services/api";
import Sidebar from "../../components/common/Sidebar";
import Navbar from "../../components/common/Navbar";
import Table from "../../components/common/Table";
import Button from "../../components/common/Button";
import LoadingSpinner from "../../components/common/LoadingSpinner";

const Employees = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const response = await employeeAPI.getAll();
      setEmployees(response.data.data);
    } catch (err) {
      setError(err.message || "Failed to fetch employees");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this employee?")) {
      try {
        await employeeAPI.delete(id);
        alert("Employee deleted successfully");
        fetchEmployees();
      } catch (err) {
        alert(err.message || "Failed to delete employee");
      }
    }
  };

  const columns = [
    {
      header: "Photo",
      accessor: "profilePicture",
      render: (row) => (
        <div className="employee-avatar-small">
          {row.profilePicture ? (
            <img
              src={`http://localhost:5000/uploads/${row.profilePicture}`}
              alt={row.fullName}
            />
          ) : (
            <div className="avatar-placeholder-small">
              {row.fullName.charAt(0)}
            </div>
          )}
        </div>
      ),
    },
    { header: "Name", accessor: "fullName" },
    { header: "Email", accessor: "email" },
    {
      header: "Department",
      accessor: "department",
      render: (row) => row.department?.name || "N/A",
    },
    {
      header: "Salary",
      accessor: "salary",
      render: (row) => `$${row.salary.toLocaleString()}`,
    },
    { header: "Phone", accessor: "phone" },
  ];

  const actions = (row) => (
    <div className="action-buttons">
      <Button
        size="small"
        variant="info"
        onClick={() => navigate(`/admin/employees/${row._id}`)}
      >
        View
      </Button>
      <Button
        size="small"
        variant="primary"
        onClick={() => navigate(`/admin/employees/edit/${row._id}`)}
      >
        Edit
      </Button>
      <Button
        size="small"
        variant="success"
        onClick={() => navigate(`/admin/salary/employee/${row._id}`)}
      >
        Salary
      </Button>
      <Button
        size="small"
        variant="warning"
        onClick={() => navigate(`/admin/leaves/employee/${row._id}`)}
      >
        Leaves
      </Button>
      <Button
        size="small"
        variant="danger"
        onClick={() => handleDelete(row._id)}
      >
        Delete
      </Button>
    </div>
  );

  if (loading) return <LoadingSpinner />;

  return (
    <div className="layout">
      <Sidebar />
      <div className="main-content">
        <Navbar />
        <div className="content-area">
          <div className="page-header">
            <div>
              <h1>Employees</h1>
              <p>Manage all employees</p>
            </div>
            <Button
              variant="primary"
              onClick={() => navigate("/admin/employees/add")}
            >
              + Add Employee
            </Button>
          </div>

          {error && <div className="alert alert-error">{error}</div>}

          <Table columns={columns} data={employees} actions={actions} />
        </div>
      </div>
    </div>
  );
};

export default Employees;
