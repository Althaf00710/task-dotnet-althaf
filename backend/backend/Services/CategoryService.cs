using backend.Models;
using backend.Services.utils;

namespace backend.Services
{
    public class CategoryService
    {
        private readonly JsonDataService _jsonService;
        private readonly ILogger<CategoryService> _logger;

        public CategoryService(JsonDataService jsonService, ILogger<CategoryService> logger)
        {
            _jsonService = jsonService;
            _logger = logger;
        }

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

        public void Add(Category category)
        {
            var store = _jsonService.Read();
            category.Id = store.Categories.Any() ? store.Categories.Max(c => c.Id) + 1 : 1;
            store.Categories.Add(category);
            _jsonService.Write(store);
        }

        public void Update(Category category)
        {
            var store = _jsonService.Read();
            var existing = store.Categories.FirstOrDefault(c => c.Id == category.Id);
            if (existing == null) return;
            existing = category;
            _jsonService.Write(store);
        }

        public void Delete(int id)
        {
            var store = _jsonService.Read();
            store.Categories.RemoveAll(c => c.Id == id);
            _jsonService.Write(store);
        }



    }
}
