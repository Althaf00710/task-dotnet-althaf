using AutoMapper;
using backend.DTOs;
using backend.Models;
using backend.Services.utils;

namespace backend.Services
{
    public class CategoryService
    {
        private readonly JsonDataService _jsonService;
        private readonly IMapper _mapper;
        private readonly ILogger<CategoryService> _logger;

        public CategoryService(JsonDataService jsonService, IMapper mapper, ILogger<CategoryService> logger)
        {
            _jsonService = jsonService;
            _mapper = mapper;
            _logger = logger;
        }


        // CRUD Operations for Category ==============================
        public IEnumerable<Category> GetAll()
        {
            var store = _jsonService.Read();
            return store.Categories;
        }

        public Category? GetById(int id)
        {
            var store = _jsonService.Read();
            return store.Categories.FirstOrDefault(c => c.Id == id);
        }

        public Category Add(CategoryDTO data)
        {
            var store = _jsonService.Read();

            // Common Validations
            ValidateCategory(data.Name, store);

            // Map and assign new ID
            var category = _mapper.Map<Category>(data);
            category.Id = store.Categories.Any() ? store.Categories.Max(c => c.Id) + 1 : 1;

            store.Categories.Add(category);
            _jsonService.Write(store);
            return category;
        }

        public void Update(CategoryUpdateDTO data)
        {
            var store = _jsonService.Read();
            var existing = store.Categories.FirstOrDefault(c => c.Id == data.Id);
            if (existing == null) throw new KeyNotFoundException("Category not found");

            // Common Validations 
            ValidateCategory(data.Name, store, data.Id);

            // map updates
            _mapper.Map(data, existing);    

            _jsonService.Write(store);
        }

        public void Delete(int id)
        {
            var store = _jsonService.Read();

            // Prevent deleting if products are associated
            if (HasProducts(id, store))
                throw new InvalidOperationException("Cannot delete category with associated products.");

            store.Categories.RemoveAll(c => c.Id == id);
            _jsonService.Write(store);
        }



        // Validation Methods =========================================

        /// Check and Validate Category Name 
        /// Unique + Null Check
        private void ValidateCategory(string? name, DataStore store, int? excludeId = null)
        {
            // Trim and clean
            name = name?.Trim();

            if (string.IsNullOrWhiteSpace(name))
                throw new ArgumentException("Category name cannot be empty or whitespace.");

            // Normalize double spaces
            while (name.Contains("  "))
                name = name.Replace("  ", " ");

            // Uniqueness check
            if (CategoryExists(name, store, excludeId))
                throw new InvalidOperationException("Category name must be unique.");
        }

        /// Check if a category name is unique
        /// Optionally exclude a specific category ID (useful for updates)
        private bool CategoryExists(string name, DataStore store, int? excludeId = null)
        {
            return store.Categories.Any(c => c.Name.Equals(name, StringComparison.OrdinalIgnoreCase)
                && (!excludeId.HasValue || c.Id != excludeId.Value));
        }

        /// Check if a category has associated products
        /// To Check before deleting a category
        private bool HasProducts(int categoryId, DataStore store)
        {
            return store.Products.Any(p => p.CategoryId == categoryId);
        }
    }
}
