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
        public ActionResult<PagedResult> GetProducts([FromQuery] ProductSearchDTO data)
        {
            var products = _productService.GetProducts(data);

            return Ok(products);
        }

        [HttpGet("{id}")]
        public ActionResult<ProductDTO> GetById(int id)
        {
            try
            {
                var product = _productService.GetById(id);
                if (product == null)
                    return NotFound(new { message = "Product not found" });

                return Ok(product);
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "Failed to get product by id");
                return NotFound(new { message = ex.Message });
            }
        }

        [HttpGet("total")]
        public ActionResult<int> GetTotal()
        {
            try
            {
                var total = _productService.GetTotalProductsCount();
                return Ok(total );
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "Failed to get total products");
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpGet("active/total")]
        public ActionResult<int> GetActiveTotal()
        {
            try
            {
                var total = _productService.GetActiveProductsCount();
                return Ok(new { total });
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "Failed to get active products");
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpGet("low-stock/total")]
        public ActionResult<int> GetLowStockProductsCount()
        {
            try
            {
                var total = _productService.GetLowStockProductsCount();
                return Ok(total);
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "Failed to get low stock products");
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPost]
        public ActionResult<ProductDTO> Create([FromBody] ProductCreateDTO data)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

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
                var deleted = _productService.DeleteProduct(id);
                if (!deleted)
                    return NotFound(new { message = "Product not found" });

                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "Failed to delete product with ID {ProductId}", id);
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPatch("toggle-status/{id}")]
        public ActionResult<ProductStatusDTO> ToggleStatus(int id, ProductStatusDTO data)
        {
            if (data.Id != id)
                return BadRequest(new { message = "URL id does not match body id." });

            try
            {
                var updatedProduct = _productService.UpdateStatus(data);
                return Ok(updatedProduct);
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "Failed to toggle status for product with ID {ProductId}", id);
                return NotFound(new { message = ex.Message });
            }
        }

        [HttpPut("{id}")]
        public ActionResult<ProductDTO> Update(int id, [FromBody] ProductUpdateDTO data)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            if (data.Id != id)
                return BadRequest(new { message = "URL id does not match body id." });

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