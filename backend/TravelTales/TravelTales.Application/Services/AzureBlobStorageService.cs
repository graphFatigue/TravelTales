using Azure.Storage;
using Azure.Storage.Blobs;
using Azure.Storage.Blobs.Models;
using Azure.Storage.Sas;
using Microsoft.Extensions.Configuration;
using TravelTales.Application.Interfaces;

namespace TravelTales.Application.Services
{
    public class AzureBlobStorageService : IStorageService
    {
        private readonly BlobServiceClient _blobServiceClient;
        private readonly string _blobAccessKey;

        public AzureBlobStorageService(
            BlobServiceClient blobServiceClient,
            IConfiguration configuration)
        {
            _blobServiceClient = blobServiceClient;
            _blobAccessKey = configuration.GetSection("Azure:Blob:AccountKey").Value!;
        }

        public async Task<string> UploadAsync(
            Stream file,
            string containerName,
            string fileName)
        {
            var blobContainerClient = GetBlobContainerClient(containerName);
            var blobClient = blobContainerClient.GetBlobClient(fileName);

            await blobClient.UploadAsync(file, true);

            var blobUri = blobClient.Uri.ToString();

            return blobUri;
        }

        public async Task<string> UploadAsync(
            Stream file,
            string containerName,
            string fileName,
            string contentType)
        {
            var blobContainerClient = GetBlobContainerClient(containerName);
            var blobClient = blobContainerClient.GetBlobClient(fileName);

            var blobHttpHeaders = new BlobHttpHeaders
            {
                ContentType = GetContentType(contentType)
            };

            await blobClient.UploadAsync(
                file,
                new BlobUploadOptions { HttpHeaders = blobHttpHeaders },
                cancellationToken: default);

            return blobClient.Uri.ToString();
        }

        public Task<string> GetSasTokenAsync(
            string containerName,
            string fileName)
        {
            var blobSasBuilder = new BlobSasBuilder
            {
                BlobContainerName = containerName,
                BlobName = fileName,
                ExpiresOn = DateTime.UtcNow.AddHours(6)
            };

            blobSasBuilder.SetPermissions(BlobSasPermissions.Read);

            var sasToken = blobSasBuilder.ToSasQueryParameters(
                new StorageSharedKeyCredential(_blobServiceClient.AccountName, _blobAccessKey)).ToString();

            return Task.FromResult(sasToken);
        }

        public async Task DeleteAsync(string containerName, string blobFilename)
        {
            var blobContainerClient = GetBlobContainerClient(containerName);
            var blobClient = blobContainerClient.GetBlobClient(blobFilename);

            await blobClient.DeleteIfExistsAsync();
        }


        private static string GetContentType(string mimeType)
        {
            return mimeType?.ToLower() switch
            {
                "mp4" => "video/mp4",
                "mov" => "video/quicktime",
                "avi" => "video/x-msvideo",
                "webm" => "video/webm",
                "jpg" or "jpeg" => "image/jpeg",
                "png" => "image/png",
                "gif" => "image/gif",
                _ => "application/octet-stream"
            };
        }

        private BlobContainerClient GetBlobContainerClient(string blobContainerName)
        {
            var containerClient = _blobServiceClient.GetBlobContainerClient(blobContainerName);
            containerClient.CreateIfNotExists();
            return containerClient;
        }

        private static (string containerName, string fileName) ExtractBlobInfo(string uri)
        {
            try
            {
                var uriObj = new Uri(uri);
                var pathParts = uriObj.AbsolutePath.Trim('/').Split('/');

                if (pathParts.Length < 2)
                {
                    return (string.Empty, string.Empty);
                }

                var containerName = pathParts[0];
                var fileName = Uri.UnescapeDataString(string.Join("/", pathParts.Skip(1)));

                return (containerName, fileName);
            }
            catch
            {
                return (string.Empty, string.Empty);
            }
        }
    }
}
