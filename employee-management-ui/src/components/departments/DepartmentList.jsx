import React, { useState } from "react";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import Button from "../common/Button";
import Loading from "../common/Loading";
import ErrorMessage from "../common/ErrorMessage";
import { useDepartments } from "../../hooks/useDepartments";
import DepartmentForm from "./DepartmentForm";
import Modal from "../common/Modal";
import "./DepartmentList.css";

const DepartmentList = () => {
  const { departments, isLoading, error, deleteDepartment, isDeleting } =
    useDepartments();

  const [showModal, setShowModal] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const handleAdd = () => {
    setSelectedDepartment(null);
    setShowModal(true);
  };

  const handleEdit = (department) => {
    setSelectedDepartment(department);
    setShowModal(true);
  };

  const handleDelete = (id) => {
    setDeleteConfirm(id);
  };

  const confirmDelete = () => {
    if (deleteConfirm) {
      deleteDepartment(deleteConfirm);
      setDeleteConfirm(null);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedDepartment(null);
  };

  if (isLoading) {
    return <Loading message="Loading departments..." />;
  }

  return (
    <div className="department-list-container">
      <div className="list-header">
        <h2>Departments</h2>
        <Button onClick={handleAdd} variant="success">
          <FaPlus /> Add Department
        </Button>
      </div>

      {error && <ErrorMessage message={error.message} />}

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Code</th>
              <th>Name</th>
              <th>Description</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {departments.length === 0 ? (
              <tr>
                <td colSpan="4" className="no-data">
                  No departments found. Add your first department!
                </td>
              </tr>
            ) : (
              departments.map((dept) => (
                <tr key={dept.departmentId}>
                  <td>{dept.departmentCode}</td>
                  <td>{dept.departmentName}</td>
                  <td>{dept.description || "-"}</td>
                  <td>
                    <div className="action-buttons">
                      <button
                        className="action-btn edit-btn"
                        onClick={() => handleEdit(dept)}
                        title="Edit"
                      >
                        <FaEdit />
                      </button>
                      <button
                        className="action-btn delete-btn"
                        onClick={() => handleDelete(dept.departmentId)}
                        title="Delete"
                        disabled={isDeleting}
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Add/Edit Modal */}
      <Modal
        isOpen={showModal}
        onClose={handleCloseModal}
        title={selectedDepartment ? "Edit Department" : "Add Department"}
        size="medium"
      >
        <DepartmentForm
          department={selectedDepartment}
          onClose={handleCloseModal}
        />
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteConfirm !== null}
        onClose={() => setDeleteConfirm(null)}
        title="Confirm Delete"
        size="small"
      >
        <div className="confirm-dialog">
          <p>Are you sure you want to delete this department?</p>
          <div className="confirm-actions">
            <Button onClick={() => setDeleteConfirm(null)} variant="secondary">
              Cancel
            </Button>
            <Button
              onClick={confirmDelete}
              variant="danger"
              loading={isDeleting}
            >
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default DepartmentList;
