import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { FaUsers, FaBuilding, FaChartLine } from "react-icons/fa";
import { useEmployees } from "../hooks/useEmployees";
import { useDepartments } from "../hooks/useDepartments";
import Loading from "../components/common/Loading";
import "./Dashboard.css";

const Dashboard = () => {
  const { employees, isLoading: employeesLoading } = useEmployees();
  const { departments, isLoading: departmentsLoading } = useDepartments();

  const isLoading = employeesLoading || departmentsLoading;

  const stats = {
    totalEmployees: employees.length,
    totalDepartments: departments.length,
    averageSalary: employees.length
      ? (
          employees.reduce((sum, emp) => sum + emp.salary, 0) / employees.length
        ).toFixed(2)
      : 0,
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-LK", {
      style: "currency",
      currency: "LKR",
    }).format(amount);
  };

  if (isLoading) {
    return <Loading message="Loading dashboard..." />;
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <p>Welcome to Employee Management System</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon employees-icon">
            <FaUsers />
          </div>
          <div className="stat-content">
            <h3>Total Employees</h3>
            <p className="stat-number">{stats.totalEmployees}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon departments-icon">
            <FaBuilding />
          </div>
          <div className="stat-content">
            <h3>Total Departments</h3>
            <p className="stat-number">{stats.totalDepartments}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon salary-icon">
            <FaChartLine />
          </div>
          <div className="stat-content">
            <h3>Average Salary</h3>
            <p className="stat-number">{formatCurrency(stats.averageSalary)}</p>
          </div>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-card">
          <h2>Recent Employees</h2>
          {employees.length === 0 ? (
            <p className="no-data-message">No employees added yet.</p>
          ) : (
            <div className="recent-list">
              {employees.slice(0, 5).map((emp) => (
                <div key={emp.employeeId} className="recent-item">
                  <div>
                    <p className="item-name">
                      {emp.firstName} {emp.lastName}
                    </p>
                    <p className="item-detail">{emp.departmentName}</p>
                  </div>
                  <span className="item-badge">
                    {formatCurrency(emp.salary)}
                  </span>
                </div>
              ))}
            </div>
          )}
          <Link to="/employees" className="card-link">
            View All Employees →
          </Link>
        </div>

        <div className="dashboard-card">
          <h2>Departments Overview</h2>

          {departments.length === 0 ? (
            <p className="no-data-message">No departments added yet.</p>
          ) : (
            <div className="recent-list">
              {departments.slice(0, 5).map((dept) => {
                const deptEmployees = employees.filter(
                  (emp) => emp.departmentId === dept.departmentId
                );

                return (
                  <div key={dept.departmentId} className="recent-item">
                    <div>
                      <p className="item-name">{dept.departmentName}</p>
                      <p className="item-detail">{dept.departmentCode}</p>
                    </div>

                    <span className="item-badge">
                      {deptEmployees.length} Employee
                      {deptEmployees.length !== 1 ? "s" : ""}
                    </span>
                  </div>
                );
              })}
            </div>
          )}

          <Link to="/departments" className="card-link">
            View All Departments →
          </Link>
        </div>
      </div>

      <div className="quick-actions">
        <h2>Quick Actions</h2>
        <div className="action-buttons">
          <Link to="/employees" className="action-button">
            <FaUsers /> Manage Employees
          </Link>
          <Link to="/departments" className="action-button">
            <FaBuilding /> Manage Departments
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
