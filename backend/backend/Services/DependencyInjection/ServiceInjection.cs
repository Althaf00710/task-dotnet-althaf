using backend.Services.utils;

namespace backend.Services.DependencyInjection
{
    public static class ServiceInjection
    {
        public static IServiceCollection AddAppServices(this IServiceCollection services)
        {
            // Utility Services
            services.AddSingleton<JsonDataService>();

            // Entity Services
            services.AddScoped<CategoryService>();
            services.AddScoped<ProductService>();

            return services;
        }
    }
}
