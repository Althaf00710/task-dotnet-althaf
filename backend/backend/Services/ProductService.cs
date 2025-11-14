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

        public PagedResult GetProducts(ProductSearchDTO search)
        {
            var store = _jsonService.Read();
            var products = store.Products.AsQueryable();

            // Search by name 
            if (!string.IsNullOrWhiteSpace(search.SearchTerm))
            {
                products = products.Where(p =>
                    p.Name.Contains(search.SearchTerm, StringComparison.OrdinalIgnoreCase) 
                );
            }

            // Filter by CategoryId
            if (search.CategoryId.HasValue)
            {
                products = products.Where(p => p.CategoryId == search.CategoryId.Value);
            }

            // Sorting
            if (!string.IsNullOrWhiteSpace(search.SortBy))
            {
                switch (search.SortBy.ToLower())
                {
                    case "price":
                        products = search.SortByDescending
                            ? products.OrderByDescending(p => p.Price)
                            : products.OrderBy(p => p.Price);
                        break;

                    case "stock":
                        products = search.SortByDescending
                            ? products.OrderByDescending(p => p.Stock)
                            : products.OrderBy(p => p.Stock);
                        break;
                }
            }

            // Count before pagination
            var totalCount = products.Count();

            // Apply pagination
            var resultProducts = products
                .Skip((search.Page - 1) * search.PageSize)
                .Take(search.PageSize)
                .ToList();

            // Map to DTO + Load Categories
            var dtoList = _mapper.Map<List<ProductDTO>>(resultProducts);

            foreach (var dto in dtoList)
            {
                var prod = resultProducts.First(p => p.Id == dto.Id);
                dto.Category = GetCategoryOrDefault(prod.CategoryId);
            }

            return new PagedResult
            {
                Items = dtoList,
                TotalCount = totalCount,
                Page = search.Page,
                PageSize = search.PageSize
            };
        }

        public int GetTotalProductsCount()
        {
            var store = _jsonService.Read();
            return store.Products.Count;
        }

        public int GetActiveProductsCount()
        {
            var store = _jsonService.Read();
            return store.Products.Count(p => p.Status);
        }

        public int GetLowStockProductsCount()
        {
            var store = _jsonService.Read();
            return store.Products.Count(p => p.Stock < 5); //less than 5
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

                var removed = store.Products.RemoveAll(p => p.Id == existing.Id);

                // Save updated data
                _jsonService.Write(store);

                return removed > 0;
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
                throw new KeyNotFoundException("Product not found");
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
