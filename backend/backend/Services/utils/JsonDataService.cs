using backend.Models;
using Microsoft.Extensions.Options;
using System.Text.Json;

namespace backend.Services.utils
{
    public class JsonDataService
    {
        private readonly string _filePath;
        private readonly object _lock = new();
        private readonly ILogger<JsonDataService> _logger;
        private readonly JsonSerializerOptions _options = new (JsonSerializerDefaults.Web)
        {
            WriteIndented = true
        };

        public JsonDataService(IConfiguration config, ILogger<JsonDataService> logger)
        {
            _filePath = config["DataFileSettings:FilePath"] ?? "data.json";
            _logger = logger;
            EnsureFileExists();
        }

        private void EnsureFileExists()
        {
            lock (_lock)
            {
                if (!File.Exists(_filePath))
                {
                    var initial = new DataStore();
                    var json = JsonSerializer.Serialize(initial, _options);
                    File.WriteAllText(_filePath, json);
                }
            }
        }

        public DataStore Read()
        {
            lock (_lock)
            {
                try
                {
                    var json = File.ReadAllText(_filePath);
                    return JsonSerializer.Deserialize<DataStore>(json, _options) ?? new DataStore();
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Failed to read data file at {FilePath}", _filePath);
                    return new DataStore();
                }
            }
        }

        public void Write(DataStore store)
        {
            lock (_lock)
            {
                try
                {
                    var json = JsonSerializer.Serialize(store, _options);
                    File.WriteAllText(_filePath, json);
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Failed to write data file at {FilePath}", _filePath);
                }
            }
        }
    }
}
