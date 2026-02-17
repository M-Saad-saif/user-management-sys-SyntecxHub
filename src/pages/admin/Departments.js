import React, { useState, useEffect } from "react";
import { departmentAPI } from "../../services/api";
import Sidebar from "../../components/common/Sidebar";
import Navbar from "../../components/common/Navbar";
import Table from "../../components/common/Table";
import Button from "../../components/common/Button";
import Modal from "../../components/common/Modal";
import FormInput from "../../components/common/FormInput";
import LoadingSpinner from "../../components/common/LoadingSpinner";

const Departments = () => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentDept, setCurrentDept] = useState(null);
  const [formData, setFormData] = useState({ name: "", description: "" });

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      const response = await departmentAPI.getAll();
      setDepartments(response.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editMode) {
        await departmentAPI.update(currentDept._id, formData);
        alert("Department updated successfully");
      } else {
        await departmentAPI.create(formData);
        alert("Department created successfully");
      }
      closeModal();
      fetchDepartments();
    } catch (err) {
      alert(err.message || "Operation failed");
    }
  };

  const handleEdit = (dept) => {
    setEditMode(true);
    setCurrentDept(dept);
    setFormData({ name: dept.name, description: dept.description });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this department?")) {
      try {
        await departmentAPI.delete(id);
        alert("Department deleted successfully");
        fetchDepartments();
      } catch (err) {
        alert(err.message || "Failed to delete department");
      }
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setEditMode(false);
    setCurrentDept(null);
    setFormData({ name: "", description: "" });
  };

  const columns = [
    { header: "Department Name", accessor: "name" },
    { header: "Description", accessor: "description" },
    {
      header: "Total Employees",
      accessor: "totalEmployees",
      render: (row) => row.totalEmployees || 0,
    },
    {
      header: "Created Date",
      render: (row) => new Date(row.createdAt).toLocaleDateString(),
    },
  ];

  const actions = (row) => (
    <div className="action-buttons">
      <Button size="small" variant="primary" onClick={() => handleEdit(row)}>
        Edit
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
              <h1>Departments</h1>
              <p>Manage all departments</p>
            </div>
            <Button variant="primary" onClick={() => setShowModal(true)}>
              + Add Department
            </Button>
          </div>

          <Table columns={columns} data={departments} actions={actions} />

          <Modal
            isOpen={showModal}
            onClose={closeModal}
            title={editMode ? "Edit Department" : "Add Department"}
          >
            <form onSubmit={handleSubmit}>
              <FormInput
                label="Department Name"
                name="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
              />
              <FormInput
                label="Description"
                type="textarea"
                name="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                required
              />
              <div className="form-actions">
                <Button type="button" variant="secondary" onClick={closeModal}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary">
                  {editMode ? "Update" : "Create"}
                </Button>
              </div>
            </form>
          </Modal>
        </div>
      </div>
    </div>
  );
};

export default Departments;
