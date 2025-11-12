using backend.DTOs;
using backend.Models;
using backend.Services;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CategoryController: ControllerBase
    {
        private readonly CategoryService _categoryService;
        private readonly ILogger<CategoryController> _logger;    

        public CategoryController(CategoryService categoryService, ILogger<CategoryController> logger)
        {
            _categoryService = categoryService;
            _logger = logger;
        }

        [HttpGet]
        public IActionResult GetAll()
        {
            var categories = _categoryService.GetAll();
            return Ok(categories);
        }

        [HttpGet("{id}")]
        public IActionResult GetById(int id)
        {
            var category = _categoryService.GetById(id);
            if (category == null)
            {
                return NotFound(new { message = "Category not found" });
            }
            return Ok(category);
        }

        [HttpPost]
        public IActionResult Create([FromBody] CategoryDTO data)
        {
            try
            {
                var category = _categoryService.Add(data);
                return CreatedAtAction(nameof(GetById), new { id = category.Id }, category);
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "Failed to create category");
                return Conflict(new { success = false, message = ex.Message });
            }
        }

        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            try
            {
                _categoryService.Delete(id);
                return Ok(new { success = true, message = "Category deleted successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "Failed to delete category");
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPut("{id}")]
        public IActionResult Update([FromBody] CategoryUpdateDTO data)
        {
            try
            {
                _categoryService.Update(data);
                return Ok(new { success = true, message = "Category updated successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "Failed to update category");
                return BadRequest(new { message = ex.Message });    
            }
        }
    }
}
