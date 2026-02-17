import React, { useState, useEffect } from "react";
import { employeeAPI, departmentAPI, salaryAPI } from "../../services/api";
import Sidebar from "../../components/common/Sidebar";
import Navbar from "../../components/common/Navbar";
import FormInput from "../../components/common/FormInput";
import Button from "../../components/common/Button";
import Modal from "../../components/common/Modal";
import LoadingSpinner from "../../components/common/LoadingSpinner";

const Salary = () => {
  const [departments, setDepartments] = useState([]);
  const [selectedDept, setSelectedDept] = useState("");
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [currentEmployee, setCurrentEmployee] = useState(null);
  const [salaryData, setSalaryData] = useState({
    amount: "",
    effectiveFrom: "",
    remarks: "",
  });

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      const response = await departmentAPI.getAll();
      setDepartments(response.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchEmployeesByDept = async (deptId) => {
    if (!deptId) {
      setEmployees([]);
      return;
    }
    try {
      setLoading(true);
      const response = await employeeAPI.getByDepartment(deptId);
      setEmployees(response.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeptChange = (e) => {
    const deptId = e.target.value;
    setSelectedDept(deptId);
    fetchEmployeesByDept(deptId);
  };

  const openSalaryModal = (employee) => {
    setCurrentEmployee(employee);
    setSalaryData({
      amount: employee.salary.toString(),
      effectiveFrom: new Date().toISOString().split("T")[0],
      remarks: "",
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await salaryAPI.update(currentEmployee._id, salaryData);
      alert("Salary updated successfully");
      setShowModal(false);
      fetchEmployeesByDept(selectedDept);
    } catch (err) {
      alert(err.message || "Failed to update salary");
    }
  };

  const deptOptions = departments.map((dept) => ({
    value: dept._id,
    label: dept.name,
  }));

  return (
    <div className="layout">
      <Sidebar />
      <div className="main-content">
        <Navbar />
        <div className="content-area">
          <div className="page-header">
            <h1>Salary Management</h1>
            <p>Update employee salaries by department</p>
          </div>

          <div className="filter-section">
            <FormInput
              label="Select Department"
              type="select"
              name="department"
              value={selectedDept}
              onChange={handleDeptChange}
              options={deptOptions}
            />
          </div>

          {loading && <LoadingSpinner />}

          {!loading && employees.length > 0 && (
            <div className="employee-salary-list">
              {employees.map((emp) => (
                <div key={emp._id} className="salary-card">
                  <div className="employee-details">
                    <h3>{emp.fullName}</h3>
                    <p>{emp.email}</p>
                    <p className="current-salary">
                      Current Salary:{" "}
                      <strong>${emp.salary.toLocaleString()}</strong>
                    </p>
                  </div>
                  <Button
                    variant="primary"
                    onClick={() => openSalaryModal(emp)}
                  >
                    Update Salary
                  </Button>
                </div>
              ))}
            </div>
          )}

          {!loading && selectedDept && employees.length === 0 && (
            <p>No employees found in this department</p>
          )}

          <Modal
            isOpen={showModal}
            onClose={() => setShowModal(false)}
            title="Update Salary"
          >
            <form onSubmit={handleSubmit}>
              <FormInput
                label="New Salary Amount"
                type="number"
                name="amount"
                value={salaryData.amount}
                onChange={(e) =>
                  setSalaryData({ ...salaryData, amount: e.target.value })
                }
                required
                min="0"
              />
              <FormInput
                label="Effective From"
                type="date"
                name="effectiveFrom"
                value={salaryData.effectiveFrom}
                onChange={(e) =>
                  setSalaryData({
                    ...salaryData,
                    effectiveFrom: e.target.value,
                  })
                }
                required
              />
              <FormInput
                label="Remarks"
                type="textarea"
                name="remarks"
                value={salaryData.remarks}
                onChange={(e) =>
                  setSalaryData({ ...salaryData, remarks: e.target.value })
                }
              />
              <div className="form-actions">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" variant="primary">
                  Update Salary
                </Button>
              </div>
            </form>
          </Modal>
        </div>
      </div>
    </div>
  );
};

export default Salary;
