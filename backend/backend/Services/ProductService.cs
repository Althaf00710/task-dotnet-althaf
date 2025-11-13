using AutoMapper;
using backend.DTOs;
using backend.Models;
using backend.Services.utils;

namespace backend.Services
{
    public class ProductService
    {
        private readonly JsonDataService _jsonService;
        private readonly CategoryService _categoryService;
        private readonly IMapper _mapper;
        private readonly ILogger<ProductService> _logger;

        public ProductService(JsonDataService jsonService, CategoryService categoryService, IMapper mapper, ILogger<ProductService> logger)
        {
            _jsonService = jsonService;
            _categoryService = categoryService;
            _mapper = mapper;
            _logger = logger;
        }

        // CRUD Operations for Product ==============================

        public IEnumerable<ProductDTO> GetAll()
        {
            // Read JSON Data
            var store = _jsonService.Read();
            var products = store.Products;

            // Map Product to ProductDTO
            var productDTOs = _mapper.Map<IEnumerable<ProductDTO>>(products);

            // Assign Category Object
            foreach (var dto in productDTOs)
            {
                var product = products.First(p => p.Id == dto.Id);
                dto.Category = GetCategoryOrDefault(product.CategoryId);
            }

            return productDTOs;
        }

        public ProductDTO? GetById (int id)
        {
            var store = _jsonService.Read();
            var product = ValidateAndGet(id, store);

            var dto = _mapper.Map<ProductDTO>(product);

            dto.Category = GetCategoryOrDefault(product.CategoryId);

            return dto;
        }

        public ProductDTO Add (ProductCreateDTO data)
        {
            try
            {
                //Validate Input
                ValidateProductCreateDTO(data);

                var store = _jsonService.Read();

                // Validate Category 
                var category = ValidateCategory(data.CategoryId);

                var product = _mapper.Map<Product>(data);

                // Generate Id
                product.Id = store.Products.Any() ? store.Products.Max(p => p.Id) + 1 : 1;

                // Generate Product Code
                product.Code = $"P{product.Id:D3}";

                store.Products.Add(product);

                // Save Changes
                _jsonService.Write(store);

                // Map and Returm
                var dto = _mapper.Map<ProductDTO>(product);
                dto.Category = category;

                return dto;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error adding product with Name: {Name}", data.Name);
                throw;
            }
        }

        public ProductDTO Update (ProductUpdateDTO data)
        {
            try
            {
                var store = _jsonService.Read();

                // Find existing prodccut
                var existing = ValidateAndGet(data.Id, store);

                // Validate category if changed
                if (data.CategoryId.HasValue && data.CategoryId.Value != existing.CategoryId)
                {
                    var newCategory = ValidateCategory(data.CategoryId.Value);

                    existing.CategoryId = data.CategoryId.Value;
                }

                // Map non null fields 
                _mapper.Map(data, existing);

                _jsonService.Write(store);

                // return dto
                var dto = _mapper.Map<ProductDTO>(existing);
                dto.Category = GetCategoryOrDefault(existing.CategoryId);

                return dto;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating product");
                throw new Exception("Failed to update product", ex);
            }
        }

        public ProductStatusDTO UpdateStatus (ProductStatusDTO data)
        {
            try
            {
                var store = _jsonService.Read();

                // Find existing prodccut
                var existing = ValidateAndGet(data.Id, store);

                // update status
                existing.Status = data.Status;

                _jsonService.Write(store);

                return data;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error Updating Product Status");
                throw new Exception("Failed to switch status");
            }
        }

        public bool DeleteProduct(int id)
        {
            try
            {
                var store = _jsonService.Read();

                // Check Exist
                var existing = ValidateAndGet(id, store);

                store.Products.Remove(existing);

                // Save updated data
                _jsonService.Write(store);

                _logger.LogInformation("Product with ID {Id} deleted successfully", id);
                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting product with ID {Id}", id);
                throw new Exception("Failed to Delete Product");
            }
        }


        // ============== Validations

        /// check id its exist
        private Product ValidateAndGet (int id, DataStore store)
        {
            var product = store.Products.FirstOrDefault(p => p.Id == id);

            if (product == null)
            {
                _logger.LogWarning("Product with ID {Id} not found in validation", id);
                throw new Exception("Product not found");
            }

            return product;
        }

        /// Category Validation
        private Category ValidateCategory(int categoryId)
        {
            var category = _categoryService.GetById(categoryId);
            if (category == null)
            {
                _logger.LogError("Category with ID {Id} not found", categoryId);
                throw new Exception("Selected Category Not Exist");
            }

            return category;
        }

        /// Check Category, if not found returns a default value
        private Category GetCategoryOrDefault(int categoryId)
        {
            return _categoryService.GetById(categoryId) ?? new Category { Id = 0, Name = "Unknown" };
        }

        /// Validate Attributes to create
        private void ValidateProductCreateDTO(ProductCreateDTO data)
        {
            if (string.IsNullOrWhiteSpace(data.Name))
            {
                _logger.LogWarning("Product name is null or whitespace");
                throw new ArgumentException("Product name cannot be empty");
            }

            if (data.Price < 0)
            {
                _logger.LogWarning("Product price is negative: {Price}", data.Price);
                throw new ArgumentException("Product price cannot be negative");
            }

            if (data.Stock < 0)
            {
                _logger.LogWarning("Product stock is negative: {Stock}", data.Stock);
                throw new ArgumentException("Product stock cannot be negative");
            }
        }


    }
}
