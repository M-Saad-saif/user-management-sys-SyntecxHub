import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { leaveAPI } from "../../services/api";
import Sidebar from "../../components/common/Sidebar";
import Navbar from "../../components/common/Navbar";
import FormInput from "../../components/common/FormInput";
import Button from "../../components/common/Button";

const ApplyLeave = () => {
  const [formData, setFormData] = useState({
    leaveType: "",
    fromDate: "",
    toDate: "",
    cause: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const leaveTypeOptions = [
    { value: "Sick Leave", label: "Sick Leave" },
    { value: "Casual Leave", label: "Casual Leave" },
    { value: "Annual Leave", label: "Annual Leave" },
    { value: "Maternity Leave", label: "Maternity Leave" },
    { value: "Paternity Leave", label: "Paternity Leave" },
    { value: "Emergency Leave", label: "Emergency Leave" },
  ];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await leaveAPI.apply(formData);
      alert("Leave application submitted successfully");
      navigate("/employee/leave-history");
    } catch (err) {
      setError(err.message || "Failed to submit leave application");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="layout">
      <Sidebar />
      <div className="main-content">
        <Navbar />
        <div className="content-area">
          <div className="page-header">
            <h1>Apply for Leave</h1>
            <p>Submit a new leave application</p>
          </div>

          <div className="form-container" style={{ maxWidth: "600px" }}>
            {error && <div className="alert alert-error">{error}</div>}

            <form onSubmit={handleSubmit}>
              <FormInput
                label="Leave Type"
                type="select"
                name="leaveType"
                value={formData.leaveType}
                onChange={handleChange}
                options={leaveTypeOptions}
                required
              />

              <FormInput
                label="From Date"
                type="date"
                name="fromDate"
                value={formData.fromDate}
                onChange={handleChange}
                min={new Date().toISOString().split("T")[0]}
                required
              />

              <FormInput
                label="To Date"
                type="date"
                name="toDate"
                value={formData.toDate}
                onChange={handleChange}
                min={
                  formData.fromDate || new Date().toISOString().split("T")[0]
                }
                required
              />

              <FormInput
                label="Reason"
                type="textarea"
                name="cause"
                value={formData.cause}
                onChange={handleChange}
                rows={4}
                required
              />

              <div className="form-actions">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => navigate("/employee/leave-history")}
                >
                  Cancel
                </Button>
                <Button type="submit" variant="primary" disabled={loading}>
                  {loading ? "Submitting..." : "Submit Application"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplyLeave;
