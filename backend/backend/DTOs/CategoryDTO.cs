using System.ComponentModel.DataAnnotations;

namespace backend.DTOs
{
    public class CategoryDTO
    {
        [Required]
        public string Name { get; set; } = default!;
    }

    public class CategoryUpdateDTO
    {
        [Required]
        public int Id { get; set; }
        [Required]
        public string Name { get; set; } = default!;
    }
}
