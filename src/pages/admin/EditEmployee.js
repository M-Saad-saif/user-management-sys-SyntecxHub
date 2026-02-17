import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { employeeAPI, departmentAPI } from "../../services/api";
import Sidebar from "../../components/common/Sidebar";
import Navbar from "../../components/common/Navbar";
import FormInput from "../../components/common/FormInput";
import Button from "../../components/common/Button";
import LoadingSpinner from "../../components/common/LoadingSpinner";

const EditEmployee = () => {
  const { id } = useParams();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    age: "",
    gender: "",
    phone: "",
    address: "",
    department: "",
    salary: "",
  });
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchEmployee();
    fetchDepartments();
    // eslint-disable-next-line
  }, [id]);

  const fetchEmployee = async () => {
    try {
      const response = await employeeAPI.getById(id);
      const emp = response.data.data;
      setFormData({
        fullName: emp.fullName,
        email: emp.email,
        age: emp.age,
        gender: emp.gender,
        phone: emp.phone,
        address: emp.address,
        department: emp.department._id,
        salary: emp.salary,
      });
    } catch (err) {
      setError(err.message || "Failed to fetch employee");
    } finally {
      setLoading(false);
    }
  };

  const fetchDepartments = async () => {
    try {
      const response = await departmentAPI.getAll();
      setDepartments(response.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      const data = new FormData();
      Object.keys(formData).forEach((key) => {
        data.append(key, formData[key]);
      });

      await employeeAPI.update(id, data);
      alert("Employee updated successfully");
      navigate("/admin/employees");
    } catch (err) {
      setError(err.message || "Failed to update employee");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  const departmentOptions = departments.map((dept) => ({
    value: dept._id,
    label: dept.name,
  }));

  const genderOptions = [
    { value: "Male", label: "Male" },
    { value: "Female", label: "Female" },
    { value: "Other", label: "Other" },
  ];

  return (
    <div className="layout">
      <Sidebar />
      <div className="main-content">
        <Navbar />
        <div className="content-area">
          <div className="page-header">
            <h1>Edit Employee</h1>
          </div>

          <div className="form-container">
            {error && <div className="alert alert-error">{error}</div>}

            <form onSubmit={handleSubmit}>
              <div className="form-grid">
                <FormInput
                  label="Full Name"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                />
                <FormInput
                  label="Email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
                <FormInput
                  label="Age"
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  min="18"
                  max="65"
                  required
                />
                <FormInput
                  label="Gender"
                  type="select"
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  options={genderOptions}
                  required
                />
                <FormInput
                  label="Phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
                <FormInput
                  label="Department"
                  type="select"
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  options={departmentOptions}
                  required
                />
                <FormInput
                  label="Salary"
                  type="number"
                  name="salary"
                  value={formData.salary}
                  onChange={handleChange}
                  min="0"
                  required
                />
                <FormInput
                  label="Address"
                  type="textarea"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  rows={3}
                  required
                />
              </div>

              <div className="form-actions">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => navigate("/admin/employees")}
                >
                  Cancel
                </Button>
                <Button type="submit" variant="primary" disabled={saving}>
                  {saving ? "Updating..." : "Update Employee"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditEmployee;
