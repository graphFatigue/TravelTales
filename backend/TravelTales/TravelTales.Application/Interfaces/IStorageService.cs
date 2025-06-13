namespace TravelTales.Application.Interfaces
{
    public interface IStorageService
    {
        Task<string> UploadAsync(Stream file, string containerName, string fileName);
        Task<string> UploadAsync(
           Stream file,
           string containerName,
           string fileName,
           string contentType);
        Task<string> GetSasTokenAsync(string containerName, string fileName);
        Task DeleteAsync(string containerName, string blobFilename);

        (string containerName, string fileName) ExtractBlobInfo(string uri);
    }
}
