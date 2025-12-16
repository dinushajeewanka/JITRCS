# Employee Management System - Backend API

## Technology Stack
- .NET Core Web API
- SQL Server
- ADO.NET
- Repository Pattern
- Dependency Injection

## Setup Instructions

1. Update connection string in `appsettings.json`
2. Create database using SQL script
3. Run the project (F5)
4. Access Swagger at https://localhost:7001/swagger

## API Endpoints

### Departments
- GET /api/Departments - Get all departments
- GET /api/Departments/{id} - Get department by ID
- POST /api/Departments - Create department
- PUT /api/Departments/{id} - Update department
- DELETE /api/Departments/{id} - Delete department

### Employees
- GET /api/Employees - Get all employees
- GET /api/Employees/{id} - Get employee by ID
- POST /api/Employees - Create employee
- PUT /api/Employees/{id} - Update employee
- DELETE /api/Employees/{id} - Delete employee

## Architecture
- **Controllers**: Handle HTTP requests
- **Repositories**: Database operations using ADO.NET
- **Interfaces**: Define contracts
- **Models**: Database entities
- **DTOs**: Data transfer objects with validation
