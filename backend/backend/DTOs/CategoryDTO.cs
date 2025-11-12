namespace backend.DTOs
{
    public class CategoryDTO
    {
        public string Name { get; set; } = default!;
    }

    public class CategoryUpdateDTO
    {
        public int Id { get; set; }
        public string Name { get; set; } = default!;
    }
}
