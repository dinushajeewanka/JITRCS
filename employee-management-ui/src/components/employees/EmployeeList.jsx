import React, { useState, useMemo } from "react";
import { FaEdit, FaTrash, FaPlus, FaSearch } from "react-icons/fa";
import Button from "../common/Button";
import Loading from "../common/Loading";
import ErrorMessage from "../common/ErrorMessage";
import { useEmployees } from "../../hooks/useEmployees";
import { useDepartments } from "../../hooks/useDepartments";
import EmployeeForm from "./EmployeeForm";
import Modal from "../common/Modal";
import { formatDate } from "../../utils/dateUtils";
import "./EmployeeList.css";

const EmployeeList = () => {
  const { employees, isLoading, error, deleteEmployee, isDeleting } =
    useEmployees();
  const { departments } = useDepartments();

  const [showModal, setShowModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDepartment, setFilterDepartment] = useState("");

  const filteredEmployees = useMemo(() => {
    return employees.filter((emp) => {
      const matchesSearch =
        emp.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.emailAddress.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesDepartment =
        !filterDepartment || emp.departmentId === parseInt(filterDepartment);

      return matchesSearch && matchesDepartment;
    });
  }, [employees, searchTerm, filterDepartment]);

  const handleAdd = () => {
    setSelectedEmployee(null);
    setShowModal(true);
  };

  const handleEdit = (employee) => {
    setSelectedEmployee(employee);
    setShowModal(true);
  };

  const handleDelete = (id) => {
    setDeleteConfirm(id);
  };

  const confirmDelete = () => {
    if (deleteConfirm) {
      deleteEmployee(deleteConfirm);
      setDeleteConfirm(null);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedEmployee(null);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-LK", {
      style: "currency",
      currency: "LKR",
    }).format(amount);
  };

  if (isLoading) {
    return <Loading message="Loading employees..." />;
  }

  return (
    <div className="employee-list-container">
      <div className="list-header">
        <h2>Employees</h2>
        <Button onClick={handleAdd} variant="success">
          <FaPlus /> Add Employee
        </Button>
      </div>

      {error && <ErrorMessage message={error.message} />}

      {/* Filters */}
      <div className="filters-container">
        <div className="search-box">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="filter-group">
          <label>Department:</label>
          <select
            value={filterDepartment}
            onChange={(e) => setFilterDepartment(e.target.value)}
          >
            <option value="">All Departments</option>
            {departments.map((dept) => (
              <option key={dept.departmentId} value={dept.departmentId}>
                {dept.departmentName}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Age</th>
              <th>Department</th>
              <th>Salary</th>
              <th>Date of Birth</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredEmployees.length === 0 ? (
              <tr>
                <td colSpan="7" className="no-data">
                  {searchTerm || filterDepartment
                    ? "No employees found matching your filters."
                    : "No employees found. Add your first employee!"}
                </td>
              </tr>
            ) : (
              filteredEmployees.map((emp) => (
                <tr key={emp.employeeId}>
                  <td>
                    {emp.firstName} {emp.lastName}
                  </td>
                  <td>{emp.emailAddress}</td>
                  <td>{emp.age}</td>
                  <td>{emp.departmentName}</td>
                  <td>{formatCurrency(emp.salary)}</td>
                  <td>{formatDate(emp.dateOfBirth)}</td>
                  <td>
                    <div className="action-buttons">
                      <button
                        className="action-btn edit-btn"
                        onClick={() => handleEdit(emp)}
                        title="Edit"
                      >
                        <FaEdit />
                      </button>
                      <button
                        className="action-btn delete-btn"
                        onClick={() => handleDelete(emp.employeeId)}
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
        title={selectedEmployee ? "Edit Employee" : "Add Employee"}
        size="large"
      >
        <EmployeeForm employee={selectedEmployee} onClose={handleCloseModal} />
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteConfirm !== null}
        onClose={() => setDeleteConfirm(null)}
        title="Confirm Delete"
        size="small"
      >
        <div className="confirm-dialog">
          <p>Are you sure you want to delete this employee?</p>
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

export default EmployeeList;
