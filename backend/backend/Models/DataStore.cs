namespace backend.Models
{
    public class DataStore
    {
        public List<Category> Categories { get; set; } = new();
        public List<Product> Products { get; set; } = new();
    }
}
