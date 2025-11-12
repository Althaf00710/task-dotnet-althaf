namespace backend.Models
{
    public class Product
    {
        public int Id { get; set; }
        public string Code { get; set; } = default!;
        public string Name { get; set; } = default!;
        public decimal Price { get; set; }
        public int Stock { get; set; }
        public bool Status { get; set; }
        public int CategoryId { get; set; }

        [System.Text.Json.Serialization.JsonIgnore]
        public Category? Category { get; set; }
    }
}
