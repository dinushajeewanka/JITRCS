using BE_EmployeeManagement.Interfaces;
using BE_EmployeeManagement.Models;
using System.Data.SqlClient;

namespace BE_EmployeeManagement.Repositories
{
    public class EmployeeRepository : IEmployeeRepository
    {
        private readonly string _connectionString;

        public EmployeeRepository(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("DefaultConnection")
                ?? throw new ArgumentNullException(nameof(configuration));
        }

        public async Task<IEnumerable<Employee>> GetAllAsync()
        {
            var employees = new List<Employee>();

            using (var connection = new SqlConnection(_connectionString))
            {
                await connection.OpenAsync();
                using (var command = new SqlCommand(
                    @"SELECT e.EmployeeId, e.FirstName, e.LastName, e.EmailAddress, e.DateOfBirth, 
                             e.Salary, e.DepartmentId, e.PhoneNumber, e.Address, e.IsActive, 
                             e.CreatedDate, e.ModifiedDate,
                             d.DepartmentCode, d.DepartmentName
                      FROM Employees e
                      INNER JOIN Departments d ON e.DepartmentId = d.DepartmentId
                      WHERE e.IsActive = 1
                      ORDER BY e.FirstName, e.LastName",
                    connection))
                {
                    using (var reader = await command.ExecuteReaderAsync())
                    {
                        while (await reader.ReadAsync())
                        {
                            employees.Add(MapToEmployee(reader));
                        }
                    }
                }
            }

            return employees;
        }

        public async Task<Employee?> GetByIdAsync(int id)
        {
            using (var connection = new SqlConnection(_connectionString))
            {
                await connection.OpenAsync();
                using (var command = new SqlCommand(
                    @"SELECT e.EmployeeId, e.FirstName, e.LastName, e.EmailAddress, e.DateOfBirth, 
                             e.Salary, e.DepartmentId, e.PhoneNumber, e.Address, e.IsActive, 
                             e.CreatedDate, e.ModifiedDate,
                             d.DepartmentCode, d.DepartmentName
                      FROM Employees e
                      INNER JOIN Departments d ON e.DepartmentId = d.DepartmentId
                      WHERE e.EmployeeId = @Id AND e.IsActive = 1",
                    connection))
                {
                    command.Parameters.AddWithValue("@Id", id);

                    using (var reader = await command.ExecuteReaderAsync())
                    {
                        if (await reader.ReadAsync())
                        {
                            return MapToEmployee(reader);
                        }
                    }
                }
            }

            return null;
        }

        public async Task<Employee> CreateAsync(Employee employee)
        {
            using (var connection = new SqlConnection(_connectionString))
            {
                await connection.OpenAsync();
                using (var command = new SqlCommand(
                    @"INSERT INTO Employees (FirstName, LastName, EmailAddress, DateOfBirth, Salary, 
                                             DepartmentId, PhoneNumber, Address, IsActive, CreatedDate, ModifiedDate)
                      VALUES (@FirstName, @LastName, @Email, @DOB, @Salary, @DeptId, @Phone, @Address, 
                              @IsActive, @CreatedDate, @ModifiedDate);
                      SELECT CAST(SCOPE_IDENTITY() as int);",
                    connection))
                {
                    command.Parameters.AddWithValue("@FirstName", employee.FirstName);
                    command.Parameters.AddWithValue("@LastName", employee.LastName);
                    command.Parameters.AddWithValue("@Email", employee.EmailAddress);
                    command.Parameters.AddWithValue("@DOB", employee.DateOfBirth);
                    command.Parameters.AddWithValue("@Salary", employee.Salary);
                    command.Parameters.AddWithValue("@DeptId", employee.DepartmentId);
                    command.Parameters.AddWithValue("@Phone", (object?)employee.PhoneNumber ?? DBNull.Value);
                    command.Parameters.AddWithValue("@Address", (object?)employee.Address ?? DBNull.Value);
                    command.Parameters.AddWithValue("@IsActive", employee.IsActive);
                    command.Parameters.AddWithValue("@CreatedDate", DateTime.Now);
                    command.Parameters.AddWithValue("@ModifiedDate", DateTime.Now);

                    var id = await command.ExecuteScalarAsync();
                    employee.EmployeeId = Convert.ToInt32(id);
                }
            }

            return employee;
        }

        public async Task<bool> UpdateAsync(Employee employee)
        {
            using (var connection = new SqlConnection(_connectionString))
            {
                await connection.OpenAsync();
                using (var command = new SqlCommand(
                    @"UPDATE Employees 
                      SET FirstName = @FirstName, 
                          LastName = @LastName, 
                          EmailAddress = @Email, 
                          DateOfBirth = @DOB, 
                          Salary = @Salary, 
                          DepartmentId = @DeptId, 
                          PhoneNumber = @Phone, 
                          Address = @Address, 
                          ModifiedDate = @ModifiedDate
                      WHERE EmployeeId = @Id AND IsActive = 1",
                    connection))
                {
                    command.Parameters.AddWithValue("@Id", employee.EmployeeId);
                    command.Parameters.AddWithValue("@FirstName", employee.FirstName);
                    command.Parameters.AddWithValue("@LastName", employee.LastName);
                    command.Parameters.AddWithValue("@Email", employee.EmailAddress);
                    command.Parameters.AddWithValue("@DOB", employee.DateOfBirth);
                    command.Parameters.AddWithValue("@Salary", employee.Salary);
                    command.Parameters.AddWithValue("@DeptId", employee.DepartmentId);
                    command.Parameters.AddWithValue("@Phone", (object?)employee.PhoneNumber ?? DBNull.Value);
                    command.Parameters.AddWithValue("@Address", (object?)employee.Address ?? DBNull.Value);
                    command.Parameters.AddWithValue("@ModifiedDate", DateTime.Now);

                    var rowsAffected = await command.ExecuteNonQueryAsync();
                    return rowsAffected > 0;
                }
            }
        }

        public async Task<bool> DeleteAsync(int id)
        {
            using (var connection = new SqlConnection(_connectionString))
            {
                await connection.OpenAsync();
                using (var command = new SqlCommand(
                    "UPDATE Employees SET IsActive = 0, ModifiedDate = @ModifiedDate WHERE EmployeeId = @Id",
                    connection))
                {
                    command.Parameters.AddWithValue("@Id", id);
                    command.Parameters.AddWithValue("@ModifiedDate", DateTime.Now);

                    var rowsAffected = await command.ExecuteNonQueryAsync();
                    return rowsAffected > 0;
                }
            }
        }

        public async Task<bool> EmailExistsAsync(string email, int? excludeId = null)
        {
            using (var connection = new SqlConnection(_connectionString))
            {
                await connection.OpenAsync();
                var query = "SELECT COUNT(1) FROM Employees WHERE EmailAddress = @Email AND IsActive = 1";

                if (excludeId.HasValue)
                {
                    query += " AND EmployeeId != @ExcludeId";
                }

                using (var command = new SqlCommand(query, connection))
                {
                    command.Parameters.AddWithValue("@Email", email);
                    if (excludeId.HasValue)
                    {
                        command.Parameters.AddWithValue("@ExcludeId", excludeId.Value);
                    }

                    var count = (int)await command.ExecuteScalarAsync();
                    return count > 0;
                }
            }
        }

        private Employee MapToEmployee(SqlDataReader reader)
        {
            return new Employee
            {
                EmployeeId = reader.GetInt32(reader.GetOrdinal("EmployeeId")),
                FirstName = reader.GetString(reader.GetOrdinal("FirstName")),
                LastName = reader.GetString(reader.GetOrdinal("LastName")),
                EmailAddress = reader.GetString(reader.GetOrdinal("EmailAddress")),
                DateOfBirth = reader.GetDateTime(reader.GetOrdinal("DateOfBirth")),
                Salary = reader.GetDecimal(reader.GetOrdinal("Salary")),
                DepartmentId = reader.GetInt32(reader.GetOrdinal("DepartmentId")),
                PhoneNumber = reader.IsDBNull(reader.GetOrdinal("PhoneNumber")) ? null : reader.GetString(reader.GetOrdinal("PhoneNumber")),
                Address = reader.IsDBNull(reader.GetOrdinal("Address")) ? null : reader.GetString(reader.GetOrdinal("Address")),
                IsActive = reader.GetBoolean(reader.GetOrdinal("IsActive")),
                CreatedDate = reader.GetDateTime(reader.GetOrdinal("CreatedDate")),
                ModifiedDate = reader.GetDateTime(reader.GetOrdinal("ModifiedDate")),
                Department = new Department
                {
                    DepartmentId = reader.GetInt32(reader.GetOrdinal("DepartmentId")),
                    DepartmentCode = reader.GetString(reader.GetOrdinal("DepartmentCode")),
                    DepartmentName = reader.GetString(reader.GetOrdinal("DepartmentName"))
                }
            };
        }
    }
}
