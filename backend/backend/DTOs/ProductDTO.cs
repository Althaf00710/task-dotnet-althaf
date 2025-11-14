using backend.Models;
using System.ComponentModel.DataAnnotations;

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
        [Required]
        public string Name { get; set; } = default!;
        [Range(0, int.MaxValue)]
        public decimal Price { get; set; }
        [Range(0, int.MaxValue)]
        public int Stock { get; set; }
        [Range(1, int.MaxValue)]
        public int CategoryId { get; set; }
    }

    public class ProductUpdateDTO
    {
        [Required]
        public int Id { get; set; }
        public string? Name { get; set; } = default!;
        public decimal? Price { get; set; }
        public int? Stock { get; set; }
        public int? CategoryId { get; set; }
    }

    public class  ProductStatusDTO 
    {
        [Required]
        public int Id { get; set; }
        public bool Status { get; set; }
    }

    public class ProductSearchDTO
    {
        public string? SearchTerm { get; set; }
        public int? CategoryId { get; set; }
        public string? SortBy { get; set; } // Stock, Price
        public bool SortByDescending { get; set; }
        public int Page { get; set; } = 1;
        public int PageSize { get; set; } = 10;
    }

    public class PagedResult
    {
        public List<ProductDTO> Items { get; set; } = new();
        public int TotalCount { get; set; }
        public int Page { get; set; }
        public int PageSize { get; set; }
        public int TotalPages => (int)Math.Ceiling((double)TotalCount / PageSize);
        public bool HasPreviousPage => Page > 1;
        public bool HasNextPage => Page < TotalPages;
    }
}
