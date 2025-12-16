using BE_EmployeeManagement.Models;

namespace BE_EmployeeManagement.Interfaces
{
    public interface IDepartmentRepository
    {
        Task<IEnumerable<Department>> GetAllAsync();
        Task<Department?> GetByIdAsync(int id);
        Task<Department> CreateAsync(Department department);
        Task<bool> UpdateAsync(Department department);
        Task<bool> DeleteAsync(int id);
        Task<bool> DepartmentCodeExistsAsync(string code, int? excludeId = null);
    }
}
