using backend.DTOs;
using backend.Services;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductController : ControllerBase
    {
        private readonly ProductService _productService;
        private readonly ILogger<ProductController> _logger;

        public ProductController(ProductService productService, ILogger<ProductController> logger)
        {
            _productService = productService;
            _logger = logger;
        }

        [HttpGet]
        public IActionResult GetAll()
        {
            var products = _productService.GetAll();
            return Ok(products);
        }

        [HttpGet("{id}")]
        public IActionResult GetById(int id)
        {
            try
            {
                return Ok(_productService.GetById(id));
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "Failed to get product by id");
                return NotFound(new { message = ex.Message });
            }
        }

        [HttpPost]
        public IActionResult Create([FromBody] ProductCreateDTO data)
        {
            try
            {
                var dto = _productService.Add(data);
                return CreatedAtAction(nameof(GetById), new { id = dto.Id }, dto);
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "Failed to create product");
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            try
            {
                return Ok(new { success = _productService.DeleteProduct(id) });
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "Failed to delete product");
                return BadRequest(new { success = false, message = ex.Message });
            }
        }

        [HttpPut]
        public IActionResult Update([FromBody] ProductUpdateDTO data)
        {
            try
            {
                return Ok(_productService.Update(data));
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "Failed to update product");
                return BadRequest(new { message = ex.Message });
            }
        }
    }
}