using BE_EmployeeManagement.DTOs;
using BE_EmployeeManagement.Interfaces;
using BE_EmployeeManagement.Models;
using Microsoft.AspNetCore.Mvc;

namespace BE_EmployeeManagement.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DepartmentsController : ControllerBase
    {
        private readonly IDepartmentRepository _repository;
        private readonly ILogger<DepartmentsController> _logger;

        public DepartmentsController(IDepartmentRepository repository, ILogger<DepartmentsController> logger)
        {
            _repository = repository;
            _logger = logger;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<DepartmentDto>>> GetAll()
        {
            try
            {
                var departments = await _repository.GetAllAsync();
                var dtos = departments.Select(d => new DepartmentDto
                {
                    DepartmentId = d.DepartmentId,
                    DepartmentCode = d.DepartmentCode,
                    DepartmentName = d.DepartmentName,
                    Description = d.Description,
                    IsActive = d.IsActive
                });

                return Ok(dtos);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving departments");
                return StatusCode(500, "An error occurred while retrieving departments");
            }
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<DepartmentDto>> GetById(int id)
        {
            try
            {
                var department = await _repository.GetByIdAsync(id);
                if (department == null)
                {
                    return NotFound($"Department with ID {id} not found");
                }

                var dto = new DepartmentDto
                {
                    DepartmentId = department.DepartmentId,
                    DepartmentCode = department.DepartmentCode,
                    DepartmentName = department.DepartmentName,
                    Description = department.Description,
                    IsActive = department.IsActive
                };

                return Ok(dto);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving department {Id}", id);
                return StatusCode(500, "An error occurred while retrieving the department");
            }
        }

        [HttpPost]
        public async Task<ActionResult<DepartmentDto>> Create([FromBody] DepartmentDto dto)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                // Check if department code already exists
                if (await _repository.DepartmentCodeExistsAsync(dto.DepartmentCode))
                {
                    return BadRequest("Department code already exists");
                }

                var department = new Department
                {
                    DepartmentCode = dto.DepartmentCode,
                    DepartmentName = dto.DepartmentName,
                    Description = dto.Description,
                    IsActive = dto.IsActive
                };

                var created = await _repository.CreateAsync(department);
                dto.DepartmentId = created.DepartmentId;

                return CreatedAtAction(nameof(GetById), new { id = dto.DepartmentId }, dto);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating department");
                return StatusCode(500, "An error occurred while creating the department");
            }
        }

        [HttpPut("{id}")]
        public async Task<ActionResult> Update(int id, [FromBody] DepartmentDto dto)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                if (id != dto.DepartmentId)
                {
                    return BadRequest("ID mismatch");
                }

                var existing = await _repository.GetByIdAsync(id);
                if (existing == null)
                {
                    return NotFound($"Department with ID {id} not found");
                }

                // Check if department code already exists (excluding current department)
                if (await _repository.DepartmentCodeExistsAsync(dto.DepartmentCode, id))
                {
                    return BadRequest("Department code already exists");
                }

                var department = new Department
                {
                    DepartmentId = dto.DepartmentId,
                    DepartmentCode = dto.DepartmentCode,
                    DepartmentName = dto.DepartmentName,
                    Description = dto.Description,
                    IsActive = dto.IsActive
                };

                var success = await _repository.UpdateAsync(department);
                if (!success)
                {
                    return StatusCode(500, "Failed to update department");
                }

                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating department {Id}", id);
                return StatusCode(500, "An error occurred while updating the department");
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
                    return NotFound($"Department with ID {id} not found");
                }

                var success = await _repository.DeleteAsync(id);
                if (!success)
                {
                    return StatusCode(500, "Failed to delete department");
                }

                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting department {Id}", id);
                return StatusCode(500, "An error occurred while deleting the department");
            }
        }
    }
}
