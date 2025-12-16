import React, { useState, useEffect } from "react";
import Button from "../common/Button";
import ErrorMessage from "../common/ErrorMessage";
import { useEmployees } from "../../hooks/useEmployees";
import { useDepartments } from "../../hooks/useDepartments";
import {
  validateEmail,
  validatePhone,
  validateSalary,
  validateAge,
} from "../../utils/validation";
import { calculateAge, formatDateForInput } from "../../utils/dateUtils";
import "./EmployeeForm.css";

const EmployeeForm = ({ employee, onClose }) => {
  const { createEmployee, updateEmployee, isCreating, isUpdating } =
    useEmployees();
  const { departments } = useDepartments();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    emailAddress: "",
    dateOfBirth: "",
    salary: "",
    departmentId: "",
    phoneNumber: "",
    address: "",
    isActive: true,
  });

  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState("");
  const [calculatedAge, setCalculatedAge] = useState(0);

  useEffect(() => {
    if (employee) {
      setFormData({
        firstName: employee.firstName || "",
        lastName: employee.lastName || "",
        emailAddress: employee.emailAddress || "",
        dateOfBirth: formatDateForInput(employee.dateOfBirth) || "",
        salary: employee.salary || "",
        departmentId: employee.departmentId || "",
        phoneNumber: employee.phoneNumber || "",
        address: employee.address || "",
        isActive: employee.isActive ?? true,
      });
      if (employee.dateOfBirth) {
        setCalculatedAge(calculateAge(employee.dateOfBirth));
      }
    }
  }, [employee]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === "checkbox" ? checked : value;

    setFormData((prev) => ({
      ...prev,
      [name]: newValue,
    }));

    // Calculate age when date of birth changes
    if (name === "dateOfBirth" && value) {
      const age = calculateAge(value);
      setCalculatedAge(age);
    }

    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validate = () => {
    const newErrors = {};

    // First Name
    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    } else if (formData.firstName.length > 50) {
      newErrors.firstName = "First name cannot exceed 50 characters";
    }

    // Last Name
    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    } else if (formData.lastName.length > 50) {
      newErrors.lastName = "Last name cannot exceed 50 characters";
    }

    // Email
    if (!formData.emailAddress.trim()) {
      newErrors.emailAddress = "Email address is required";
    } else if (!validateEmail(formData.emailAddress)) {
      newErrors.emailAddress = "Invalid email address";
    }

    // Date of Birth
    if (!formData.dateOfBirth) {
      newErrors.dateOfBirth = "Date of birth is required";
    } else if (!validateAge(formData.dateOfBirth)) {
      newErrors.dateOfBirth = "Employee age must be between 18 and 65 years";
    }

    // Salary
    if (!formData.salary) {
      newErrors.salary = "Salary is required";
    } else if (!validateSalary(parseFloat(formData.salary))) {
      newErrors.salary = "Salary must be a positive number";
    }

    // Department
    if (!formData.departmentId) {
      newErrors.departmentId = "Department is required";
    }

    // Phone (optional but validate if provided)
    if (formData.phoneNumber && !validatePhone(formData.phoneNumber)) {
      newErrors.phoneNumber = "Invalid phone number (10-15 digits)";
    }

    // Address
    if (formData.address && formData.address.length > 200) {
      newErrors.address = "Address cannot exceed 200 characters";
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
      const submitData = {
        ...formData,
        salary: parseFloat(formData.salary),
        departmentId: parseInt(formData.departmentId),
      };

      if (employee) {
        // Update existing
        await updateEmployee(
          {
            id: employee.employeeId,
            data: {
              ...submitData,
              employeeId: employee.employeeId,
            },
          },
          {
            onSuccess: () => {
              onClose();
            },
            onError: (error) => {
              setSubmitError(
                error.response?.data || "Failed to update employee"
              );
            },
          }
        );
      } else {
        // Create new
        await createEmployee(submitData, {
          onSuccess: () => {
            onClose();
          },
          onError: (error) => {
            setSubmitError(error.response?.data || "Failed to create employee");
          },
        });
      }
    } catch (error) {
      setSubmitError("An unexpected error occurred");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="employee-form">
      {submitError && (
        <ErrorMessage
          message={submitError}
          onClose={() => setSubmitError("")}
        />
      )}

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="firstName">
            First Name <span className="required">*</span>
          </label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            className={errors.firstName ? "input-error" : ""}
            placeholder="Enter first name"
            maxLength={50}
          />
          {errors.firstName && (
            <span className="error-text">{errors.firstName}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="lastName">
            Last Name <span className="required">*</span>
          </label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            className={errors.lastName ? "input-error" : ""}
            placeholder="Enter last name"
            maxLength={50}
          />
          {errors.lastName && (
            <span className="error-text">{errors.lastName}</span>
          )}
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="emailAddress">
          Email Address <span className="required">*</span>
        </label>
        <input
          type="email"
          id="emailAddress"
          name="emailAddress"
          value={formData.emailAddress}
          onChange={handleChange}
          className={errors.emailAddress ? "input-error" : ""}
          placeholder="example@company.com"
          maxLength={100}
        />
        {errors.emailAddress && (
          <span className="error-text">{errors.emailAddress}</span>
        )}
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="dateOfBirth">
            Date of Birth <span className="required">*</span>
          </label>
          <input
            type="date"
            id="dateOfBirth"
            name="dateOfBirth"
            value={formData.dateOfBirth}
            onChange={handleChange}
            className={errors.dateOfBirth ? "input-error" : ""}
            max={new Date().toISOString().split("T")[0]}
          />
          {errors.dateOfBirth && (
            <span className="error-text">{errors.dateOfBirth}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="age">Age (Auto-calculated)</label>
          <input
            type="text"
            id="age"
            value={calculatedAge}
            readOnly
            className="readonly-input"
            placeholder="Age will be calculated"
          />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="salary">
            Salary <span className="required">*</span>
          </label>
          <input
            type="number"
            id="salary"
            name="salary"
            value={formData.salary}
            onChange={handleChange}
            className={errors.salary ? "input-error" : ""}
            placeholder="50000"
            step="0.01"
            min="0"
          />
          {errors.salary && <span className="error-text">{errors.salary}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="departmentId">
            Department <span className="required">*</span>
          </label>
          <select
            id="departmentId"
            name="departmentId"
            value={formData.departmentId}
            onChange={handleChange}
            className={errors.departmentId ? "input-error" : ""}
          >
            <option value="">Select Department</option>
            {departments.map((dept) => (
              <option key={dept.departmentId} value={dept.departmentId}>
                {dept.departmentName}
              </option>
            ))}
          </select>
          {errors.departmentId && (
            <span className="error-text">{errors.departmentId}</span>
          )}
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="phoneNumber">Phone Number</label>
        <input
          type="tel"
          id="phoneNumber"
          name="phoneNumber"
          value={formData.phoneNumber}
          onChange={handleChange}
          className={errors.phoneNumber ? "input-error" : ""}
          placeholder="1234567890"
          maxLength={20}
        />
        {errors.phoneNumber && (
          <span className="error-text">{errors.phoneNumber}</span>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="address">Address</label>
        <textarea
          id="address"
          name="address"
          value={formData.address}
          onChange={handleChange}
          className={errors.address ? "input-error" : ""}
          placeholder="Enter address (optional)"
          rows={3}
          maxLength={200}
        />
        {errors.address && <span className="error-text">{errors.address}</span>}
        <span className="char-count">
          {formData.address.length}/200 characters
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
          {employee ? "Update" : "Create"}
        </Button>
      </div>
    </form>
  );
};

export default EmployeeForm;
