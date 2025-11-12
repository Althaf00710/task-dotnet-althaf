using AutoMapper;
using backend.Models;
using backend.DTOs;

namespace backend.Services.Mappings
{
    public class ProductMappingProfile : Profile
    {
        public ProductMappingProfile()
        {
            // Product <> ProductCreateDTO
            CreateMap<ProductCreateDTO, Product>()
                .ForMember(dest => dest.Code, opt => opt.Ignore()) // code auto-generated
                .ForMember(dest => dest.Status, opt => opt.MapFrom(src => true)); // default true

            // Product <> ProductUpdateDTO
            CreateMap<ProductUpdateDTO, Product>()
                .ForAllMembers(opt => opt.Condition((src, dest, srcMember) => srcMember != null));

            // Product <> ProductStockDTO
            CreateMap<ProductStockDTO, Product>()
                .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.Id))
                .ForMember(dest => dest.Stock, opt => opt.MapFrom(src => src.Stock))
                .ForAllMembers(opt => opt.Condition((src, dest, srcMember) => srcMember != null));

            // Product <> ProductStatusDTO
            CreateMap<ProductStatusDTO, Product>()
                .ForMember(dest => dest.Status, opt => opt.MapFrom(src => src.Status))
                .ForAllMembers(opt => opt.Condition((src, dest, srcMember) => srcMember != null));

            // Product > DTO 
            CreateMap<Product, ProductCreateDTO>();
            CreateMap<Product, ProductUpdateDTO>();
            CreateMap<Product, ProductStockDTO>();
            CreateMap<Product, ProductStatusDTO>();
        }
    }
}
