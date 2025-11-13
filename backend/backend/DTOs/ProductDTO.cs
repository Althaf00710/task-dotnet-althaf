using backend.Models;

namespace backend.DTOs
{
    public class ProductDTO
    {
        public int Id { get; set; }
        public string Code { get; set; } = default!;
        public string Name { get; set; } = default!;
        public decimal Price { get; set; }
        public int Stock { get; set; }
        public bool Status { get; set; }
        public Category Category { get; set; } = default!;
    }

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
        public int? Stock { get; set; }
        public int? CategoryId { get; set; }
    }

    public class  ProductStatusDTO 
    {
        public int Id { get; set; }
        public bool Status { get; set; }
    }
}
