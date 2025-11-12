using AutoMapper;
using backend.DTOs;
using backend.Models;

namespace backend.Services.Mappings
{
    public class CategoryMappingProfile : Profile
    {
        public CategoryMappingProfile()
        {
            CreateMap<Category, CategoryDTO>().ReverseMap();
            CreateMap<CategoryUpdateDTO, Category>();
        }
    }
}
