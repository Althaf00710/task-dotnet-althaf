namespace backend.Models
{
    public class Category
    {
        public int Id { get; set; }
        public string Name { get; set; } = default!;

        [System.Text.Json.Serialization.JsonIgnore]
        public List<Product> Products { get; set; } = new();    

    }
}
