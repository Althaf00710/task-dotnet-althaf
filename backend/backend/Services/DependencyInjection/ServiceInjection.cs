using backend.Services.Mappings;
using backend.Services.utils;
using System.Reflection;

namespace backend.Services.DependencyInjection
{
    public static class ServiceInjection
    {
        public static IServiceCollection AddAppServices(this IServiceCollection services)
        {
            // Utility Services
            services.AddSingleton<JsonDataService>();

            // AutoMapper 
            services.AddAutoMapper(typeof(CategoryMappingProfile).Assembly);

            // Entity Services
            services.AddScoped<CategoryService>();
            services.AddScoped<ProductService>();

            return services;
        }
    }
}
