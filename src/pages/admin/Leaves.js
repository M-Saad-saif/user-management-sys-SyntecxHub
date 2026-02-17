import React, { useState, useEffect } from "react";
import { leaveAPI } from "../../services/api";
import Sidebar from "../../components/common/Sidebar";
import Navbar from "../../components/common/Navbar";
import Table from "../../components/common/Table";
import Button from "../../components/common/Button";
import LoadingSpinner from "../../components/common/LoadingSpinner";

const Leaves = () => {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaves();
  }, []);

  const fetchLeaves = async () => {
    try {
      const response = await leaveAPI.getAll();
      setLeaves(response.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      await leaveAPI.updateStatus(id, status);
      alert(`Leave ${status.toLowerCase()} successfully`);
      fetchLeaves();
    } catch (err) {
      alert(err.message || "Failed to update leave status");
    }
  };

  const columns = [
    {
      header: "Employee Name",
      render: (row) => row.employee?.fullName || "N/A",
    },
    {
      header: "Department",
      render: (row) => row.employee?.department?.name || "N/A",
    },
    { header: "Leave Type", accessor: "leaveType" },
    { header: "Cause", accessor: "cause" },
    {
      header: "From Date",
      render: (row) => new Date(row.fromDate).toLocaleDateString(),
    },
    {
      header: "To Date",
      render: (row) => new Date(row.toDate).toLocaleDateString(),
    },
    {
      header: "Status",
      render: (row) => (
        <span className={`badge badge-${row.status.toLowerCase()}`}>
          {row.status}
        </span>
      ),
    },
  ];

  const actions = (row) => (
    <div className="action-buttons">
      {row.status === "Pending" && (
        <>
          <Button
            size="small"
            variant="success"
            onClick={() => handleStatusUpdate(row._id, "Approved")}
          >
            Approve
          </Button>
          <Button
            size="small"
            variant="danger"
            onClick={() => handleStatusUpdate(row._id, "Rejected")}
          >
            Reject
          </Button>
        </>
      )}
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
            <h1>Leave Management</h1>
            <p>Manage all leave requests</p>
          </div>
          <Table columns={columns} data={leaves} actions={actions} />
        </div>
      </div>
    </div>
  );
};

export default Leaves;
