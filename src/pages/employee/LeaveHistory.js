import React, { useState, useEffect } from "react";
import { leaveAPI } from "../../services/api";
import Sidebar from "../../components/common/Sidebar";
import Navbar from "../../components/common/Navbar";
import Table from "../../components/common/Table";
import LoadingSpinner from "../../components/common/LoadingSpinner";

const LeaveHistory = () => {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaves();
  }, []);

  const fetchLeaves = async () => {
    try {
      const response = await leaveAPI.getMyLeaves();
      setLeaves(response.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { header: "Leave Type", accessor: "leaveType" },
    {
      header: "From Date",
      render: (row) => new Date(row.fromDate).toLocaleDateString(),
    },
    {
      header: "To Date",
      render: (row) => new Date(row.toDate).toLocaleDateString(),
    },
    { header: "Cause", accessor: "cause" },
    {
      header: "Applied On",
      render: (row) => new Date(row.appliedAt).toLocaleDateString(),
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

  if (loading) return <LoadingSpinner />;

  return (
    <div className="layout">
      <Sidebar />
      <div className="main-content">
        <Navbar />
        <div className="content-area">
          <div className="page-header">
            <h1>Leave History</h1>
            <p>View all your leave applications</p>
          </div>

          <Table columns={columns} data={leaves} />
        </div>
      </div>
    </div>
  );
};

export default LeaveHistory;
