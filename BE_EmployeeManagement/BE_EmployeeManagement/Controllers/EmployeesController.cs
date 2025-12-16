using BE_EmployeeManagement.DTOs;
using BE_EmployeeManagement.Interfaces;
using BE_EmployeeManagement.Models;
using Microsoft.AspNetCore.Mvc;

namespace BE_EmployeeManagement.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class EmployeesController : ControllerBase
    {
        private readonly IEmployeeRepository _repository;
        private readonly ILogger<EmployeesController> _logger;

        public EmployeesController(IEmployeeRepository repository, ILogger<EmployeesController> logger)
        {
            _repository = repository;
            _logger = logger;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<EmployeeDto>>> GetAll()
        {
            try
            {
                var employees = await _repository.GetAllAsync();
                var dtos = employees.Select(e => MapToDto(e));

                return Ok(dtos);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving employees");
                return StatusCode(500, "An error occurred while retrieving employees");
            }
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<EmployeeDto>> GetById(int id)
        {
            try
            {
                var employee = await _repository.GetByIdAsync(id);
                if (employee == null)
                {
                    return NotFound($"Employee with ID {id} not found");
                }

                return Ok(MapToDto(employee));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving employee {Id}", id);
                return StatusCode(500, "An error occurred while retrieving the employee");
            }
        }

        [HttpPost]
        public async Task<ActionResult<EmployeeDto>> Create([FromBody] EmployeeDto dto)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                // Validate age
                var age = CalculateAge(dto.DateOfBirth);
                if (age < 18 || age > 65)
                {
                    return BadRequest("Employee age must be between 18 and 65 years");
                }

                // Check if email already exists
                if (await _repository.EmailExistsAsync(dto.EmailAddress))
                {
                    return BadRequest("Email address already exists");
                }

                var employee = new Employee
                {
                    FirstName = dto.FirstName,
                    LastName = dto.LastName,
                    EmailAddress = dto.EmailAddress,
                    DateOfBirth = dto.DateOfBirth,
                    Salary = dto.Salary,
                    DepartmentId = dto.DepartmentId,
                    PhoneNumber = dto.PhoneNumber,
                    Address = dto.Address,
                    IsActive = dto.IsActive
                };

                var created = await _repository.CreateAsync(employee);
                var result = await _repository.GetByIdAsync(created.EmployeeId);

                return CreatedAtAction(nameof(GetById), new { id = created.EmployeeId }, MapToDto(result!));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating employee");
                return StatusCode(500, "An error occurred while creating the employee");
            }
        }

        [HttpPut("{id}")]
        public async Task<ActionResult> Update(int id, [FromBody] EmployeeDto dto)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                if (id != dto.EmployeeId)
                {
                    return BadRequest("ID mismatch");
                }

                var existing = await _repository.GetByIdAsync(id);
                if (existing == null)
                {
                    return NotFound($"Employee with ID {id} not found");
                }

                // Validate age
                var age = CalculateAge(dto.DateOfBirth);
                if (age < 18 || age > 65)
                {
                    return BadRequest("Employee age must be between 18 and 65 years");
                }

                // Check if email already exists (excluding current employee)
                if (await _repository.EmailExistsAsync(dto.EmailAddress, id))
                {
                    return BadRequest("Email address already exists");
                }

                var employee = new Employee
                {
                    EmployeeId = dto.EmployeeId,
                    FirstName = dto.FirstName,
                    LastName = dto.LastName,
                    EmailAddress = dto.EmailAddress,
                    DateOfBirth = dto.DateOfBirth,
                    Salary = dto.Salary,
                    DepartmentId = dto.DepartmentId,
                    PhoneNumber = dto.PhoneNumber,
                    Address = dto.Address,
                    IsActive = dto.IsActive
                };

                var success = await _repository.UpdateAsync(employee);
                if (!success)
                {
                    return StatusCode(500, "Failed to update employee");
                }

                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating employee {Id}", id);
                return StatusCode(500, "An error occurred while updating the employee");
            }
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> Delete(int id)
        {
            try
            {
                var existing = await _repository.GetByIdAsync(id);
                if (existing == null)
                {
                    return NotFound($"Employee with ID {id} not found");
                }

                var success = await _repository.DeleteAsync(id);
                if (!success)
                {
                    return StatusCode(500, "Failed to delete employee");
                }

                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting employee {Id}", id);
                return StatusCode(500, "An error occurred while deleting the employee");
            }
        }

        private EmployeeDto MapToDto(Employee employee)
        {
            return new EmployeeDto
            {
                EmployeeId = employee.EmployeeId,
                FirstName = employee.FirstName,
                LastName = employee.LastName,
                EmailAddress = employee.EmailAddress,
                DateOfBirth = employee.DateOfBirth,
                Age = CalculateAge(employee.DateOfBirth),
                Salary = employee.Salary,
                DepartmentId = employee.DepartmentId,
                DepartmentName = employee.Department?.DepartmentName,
                PhoneNumber = employee.PhoneNumber,
                Address = employee.Address,
                IsActive = employee.IsActive
            };
        }

        private int CalculateAge(DateTime dateOfBirth)
        {
            var today = DateTime.Today;
            var age = today.Year - dateOfBirth.Year;
            if (dateOfBirth.Date > today.AddYears(-age)) age--;
            return age;
        }
    }
}
