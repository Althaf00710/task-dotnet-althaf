using AutoMapper;
using backend.Models;
using backend.DTOs;

namespace backend.Services.Mappings
{
    public class ProductMappingProfile : Profile
    {
        public ProductMappingProfile()
        {
            // Product > ProductDTO (with Category)
            CreateMap<Product, ProductDTO>()
                .ForMember(dest => dest.Category, opt => opt.Ignore()); // category handled in service

            // Product <> ProductCreateDTO
            CreateMap<ProductCreateDTO, Product>()
                .ForMember(dest => dest.Code, opt => opt.Ignore()) // code auto-generated
                .ForMember(dest => dest.Status, opt => opt.MapFrom(src => true)); // default true

            // Product <> ProductUpdateDTO
            CreateMap<ProductUpdateDTO, Product>()
                .ForMember(dest => dest.Name, opt => opt.Condition(src => src.Name != null))
                .ForMember(dest => dest.Price, opt => opt.Condition(src => src.Price.HasValue))
                .ForMember(dest => dest.Stock, opt => opt.Condition(src => src.Stock.HasValue))
                .ForMember(dest => dest.CategoryId, opt => opt.Condition(src => src.CategoryId.HasValue));

            // Product <> ProductStatusDTO
            CreateMap<ProductStatusDTO, Product>()
                .ForMember(dest => dest.Status, opt => opt.MapFrom(src => src.Status))
                .ForAllMembers(opt => opt.Condition((src, dest, srcMember) => srcMember != null));

            // Product > DTO 
            CreateMap<Product, ProductCreateDTO>();
            CreateMap<Product, ProductUpdateDTO>();
            CreateMap<Product, ProductStatusDTO>();
        }
    }
}
