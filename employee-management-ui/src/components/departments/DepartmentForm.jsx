import React, { useState, useEffect } from "react";
import Button from "../common/Button";
import ErrorMessage from "../common/ErrorMessage";
import { useDepartments } from "../../hooks/useDepartments";
import { validateDepartmentCode } from "../../utils/validation";
import "./DepartmentForm.css";

const DepartmentForm = ({ department, onClose }) => {
  const { createDepartment, updateDepartment, isCreating, isUpdating } =
    useDepartments();

  const [formData, setFormData] = useState({
    departmentCode: "",
    departmentName: "",
    description: "",
    isActive: true,
  });

  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState("");

  useEffect(() => {
    if (department) {
      setFormData({
        departmentCode: department.departmentCode || "",
        departmentName: department.departmentName || "",
        description: department.description || "",
        isActive: department.isActive ?? true,
      });
    }
  }, [department]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.departmentCode.trim()) {
      newErrors.departmentCode = "Department code is required";
    } else if (!validateDepartmentCode(formData.departmentCode)) {
      newErrors.departmentCode = "Department code must be 2-20 characters";
    }

    if (!formData.departmentName.trim()) {
      newErrors.departmentName = "Department name is required";
    } else if (formData.departmentName.length > 100) {
      newErrors.departmentName = "Department name cannot exceed 100 characters";
    }

    if (formData.description && formData.description.length > 500) {
      newErrors.description = "Description cannot exceed 500 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError("");

    if (!validate()) {
      return;
    }

    try {
      if (department) {
        // Update existing
        await updateDepartment(
          {
            id: department.departmentId,
            data: {
              ...formData,
              departmentId: department.departmentId,
            },
          },
          {
            onSuccess: () => {
              onClose();
            },
            onError: (error) => {
              setSubmitError(
                error.response?.data || "Failed to update department"
              );
            },
          }
        );
      } else {
        // Create new
        await createDepartment(formData, {
          onSuccess: () => {
            onClose();
          },
          onError: (error) => {
            setSubmitError(
              error.response?.data || "Failed to create department"
            );
          },
        });
      }
    } catch (error) {
      setSubmitError("An unexpected error occurred");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="department-form">
      {submitError && (
        <ErrorMessage
          message={submitError}
          onClose={() => setSubmitError("")}
        />
      )}

      <div className="form-group">
        <label htmlFor="departmentCode">
          Department Code <span className="required">*</span>
        </label>
        <input
          type="text"
          id="departmentCode"
          name="departmentCode"
          value={formData.departmentCode}
          onChange={handleChange}
          className={errors.departmentCode ? "input-error" : ""}
          placeholder="e.g., IT, HR, FIN"
          maxLength={20}
        />
        {errors.departmentCode && (
          <span className="error-text">{errors.departmentCode}</span>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="departmentName">
          Department Name <span className="required">*</span>
        </label>
        <input
          type="text"
          id="departmentName"
          name="departmentName"
          value={formData.departmentName}
          onChange={handleChange}
          className={errors.departmentName ? "input-error" : ""}
          placeholder="e.g., Information Technology"
          maxLength={100}
        />
        {errors.departmentName && (
          <span className="error-text">{errors.departmentName}</span>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          className={errors.description ? "input-error" : ""}
          placeholder="Enter department description (optional)"
          rows={4}
          maxLength={500}
        />
        {errors.description && (
          <span className="error-text">{errors.description}</span>
        )}
        <span className="char-count">
          {formData.description.length}/500 characters
        </span>
      </div>

      <div className="form-group checkbox-group">
        <label>
          <input
            type="checkbox"
            name="isActive"
            checked={formData.isActive}
            onChange={handleChange}
          />
          <span>Active</span>
        </label>
      </div>

      <div className="form-actions">
        <Button type="button" onClick={onClose} variant="secondary">
          Cancel
        </Button>
        <Button
          type="submit"
          variant="primary"
          loading={isCreating || isUpdating}
        >
          {department ? "Update" : "Create"}
        </Button>
      </div>
    </form>
  );
};

export default DepartmentForm;
