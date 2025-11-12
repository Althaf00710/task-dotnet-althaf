namespace backend.DTOs
{
    public class ProductCreateDTO
    {
        public string Name { get; set; } = default!;
        public decimal Price { get; set; }
        public int Stock { get; set; }
        public int CategoryId { get; set; }
    }

    public class ProductUpdateDTO
    {
        public int Id { get; set; }
        public string? Name { get; set; } = default!;
        public decimal? Price { get; set; }
    }

    public class ProductStockDTO
    {
        public int Id { get; set; }
        public int Stock { get; set; }
    }

    public class  ProductStatusDTO 
    {
        public int Id { get; set; }
        public bool Status { get; set; }
    }
}
