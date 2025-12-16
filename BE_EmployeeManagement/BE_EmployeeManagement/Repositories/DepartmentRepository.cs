using BE_EmployeeManagement.Interfaces;
using BE_EmployeeManagement.Models;
using System.Data.SqlClient;

namespace BE_EmployeeManagement.Repositories
{
    public class DepartmentRepository : IDepartmentRepository
    {
        private readonly string _connectionString;

        public DepartmentRepository(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("DefaultConnection")
                ?? throw new ArgumentNullException(nameof(configuration));
        }

        public async Task<IEnumerable<Department>> GetAllAsync()
        {
            var departments = new List<Department>();

            using (var connection = new SqlConnection(_connectionString))
            {
                await connection.OpenAsync();
                using (var command = new SqlCommand(
                    "SELECT DepartmentId, DepartmentCode, DepartmentName, Description, IsActive, CreatedDate, ModifiedDate FROM Departments WHERE IsActive = 1 ORDER BY DepartmentName",
                    connection))
                {
                    using (var reader = await command.ExecuteReaderAsync())
                    {
                        while (await reader.ReadAsync())
                        {
                            departments.Add(MapToDepartment(reader));
                        }
                    }
                }
            }

            return departments;
        }

        public async Task<Department?> GetByIdAsync(int id)
        {
            using (var connection = new SqlConnection(_connectionString))
            {
                await connection.OpenAsync();
                using (var command = new SqlCommand(
                    "SELECT DepartmentId, DepartmentCode, DepartmentName, Description, IsActive, CreatedDate, ModifiedDate FROM Departments WHERE DepartmentId = @Id AND IsActive = 1",
                    connection))
                {
                    command.Parameters.AddWithValue("@Id", id);

                    using (var reader = await command.ExecuteReaderAsync())
                    {
                        if (await reader.ReadAsync())
                        {
                            return MapToDepartment(reader);
                        }
                    }
                }
            }

            return null;
        }

        public async Task<Department> CreateAsync(Department department)
        {
            using (var connection = new SqlConnection(_connectionString))
            {
                await connection.OpenAsync();
                using (var command = new SqlCommand(
                    @"INSERT INTO Departments (DepartmentCode, DepartmentName, Description, IsActive, CreatedDate, ModifiedDate)
                      VALUES (@Code, @Name, @Description, @IsActive, @CreatedDate, @ModifiedDate);
                      SELECT CAST(SCOPE_IDENTITY() as int);",
                    connection))
                {
                    command.Parameters.AddWithValue("@Code", department.DepartmentCode);
                    command.Parameters.AddWithValue("@Name", department.DepartmentName);
                    command.Parameters.AddWithValue("@Description", (object?)department.Description ?? DBNull.Value);
                    command.Parameters.AddWithValue("@IsActive", department.IsActive);
                    command.Parameters.AddWithValue("@CreatedDate", DateTime.Now);
                    command.Parameters.AddWithValue("@ModifiedDate", DateTime.Now);

                    var id = await command.ExecuteScalarAsync();
                    department.DepartmentId = Convert.ToInt32(id);
                }
            }

            return department;
        }

        public async Task<bool> UpdateAsync(Department department)
        {
            using (var connection = new SqlConnection(_connectionString))
            {
                await connection.OpenAsync();
                using (var command = new SqlCommand(
                    @"UPDATE Departments 
                      SET DepartmentCode = @Code, 
                          DepartmentName = @Name, 
                          Description = @Description, 
                          ModifiedDate = @ModifiedDate
                      WHERE DepartmentId = @Id AND IsActive = 1",
                    connection))
                {
                    command.Parameters.AddWithValue("@Id", department.DepartmentId);
                    command.Parameters.AddWithValue("@Code", department.DepartmentCode);
                    command.Parameters.AddWithValue("@Name", department.DepartmentName);
                    command.Parameters.AddWithValue("@Description", (object?)department.Description ?? DBNull.Value);
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
                    "UPDATE Departments SET IsActive = 0, ModifiedDate = @ModifiedDate WHERE DepartmentId = @Id",
                    connection))
                {
                    command.Parameters.AddWithValue("@Id", id);
                    command.Parameters.AddWithValue("@ModifiedDate", DateTime.Now);

                    var rowsAffected = await command.ExecuteNonQueryAsync();
                    return rowsAffected > 0;
                }
            }
        }

        public async Task<bool> DepartmentCodeExistsAsync(string code, int? excludeId = null)
        {
            using (var connection = new SqlConnection(_connectionString))
            {
                await connection.OpenAsync();
                var query = "SELECT COUNT(1) FROM Departments WHERE DepartmentCode = @Code AND IsActive = 1";

                if (excludeId.HasValue)
                {
                    query += " AND DepartmentId != @ExcludeId";
                }

                using (var command = new SqlCommand(query, connection))
                {
                    command.Parameters.AddWithValue("@Code", code);
                    if (excludeId.HasValue)
                    {
                        command.Parameters.AddWithValue("@ExcludeId", excludeId.Value);
                    }

                    var count = (int)await command.ExecuteScalarAsync();
                    return count > 0;
                }
            }
        }

        private Department MapToDepartment(SqlDataReader reader)
        {
            return new Department
            {
                DepartmentId = reader.GetInt32(reader.GetOrdinal("DepartmentId")),
                DepartmentCode = reader.GetString(reader.GetOrdinal("DepartmentCode")),
                DepartmentName = reader.GetString(reader.GetOrdinal("DepartmentName")),
                Description = reader.IsDBNull(reader.GetOrdinal("Description")) ? null : reader.GetString(reader.GetOrdinal("Description")),
                IsActive = reader.GetBoolean(reader.GetOrdinal("IsActive")),
                CreatedDate = reader.GetDateTime(reader.GetOrdinal("CreatedDate")),
                ModifiedDate = reader.GetDateTime(reader.GetOrdinal("ModifiedDate"))
            };
        }
    }
}
