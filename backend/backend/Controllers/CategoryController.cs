using backend.DTOs;
using backend.Models;
using backend.Services;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [Route("api/categories")]
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
        public ActionResult<IEnumerable<Category>> GetAll()
        {
            var categories = _categoryService.GetAll();
            return Ok(categories);
        }

        [HttpGet("{id}")]
        public ActionResult<Category> GetById(int id)
        {
            var category = _categoryService.GetById(id);
            if (category == null)
            {
                return NotFound(new { message = "Category not found" });
            }
            return Ok(category);
        }

        [HttpGet("total")]
        public ActionResult<int> GetTotal()
        {
            var total = _categoryService.GetTotalCount();
            return Ok(total);
        }

        [HttpGet("with-count")]
        public ActionResult<IEnumerable<CategoryWithCountDTO>> GetCategoriesWithCount()
        {
            try
            {
                var data = _categoryService.GetCategoriesWithProductCount();
                return Ok(data);
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "Failed to get categories with product count");
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPost]
        public ActionResult<Category> Create([FromBody] CategoryDTO data)
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
                var deleted = _categoryService.Delete(id);
                if (!deleted) return NotFound(new {message = "Category Not Found"});
                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "Failed to delete category");
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPut("{id}")]
        public ActionResult<Category> Update(int id, [FromBody] CategoryUpdateDTO data)
        {
            if (id != data.Id)
            {
                _logger.LogWarning("Mismatched category ID in update request");
                return BadRequest(new { message = "Mismatched category ID" });
            }

            if (!ModelState.IsValid) {
                _logger.LogWarning("Invalid model state for updating category");
                return BadRequest(ModelState);
            }

            try
            {
                return Ok(_categoryService.Update(data));
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "Failed to update category");
                return BadRequest(new { message = ex.Message });    
            }
        }
    }
}
