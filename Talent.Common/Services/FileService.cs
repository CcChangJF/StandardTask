using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Amazon.S3.Model;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Talent.Common.Aws;
using Talent.Common.Contracts;

namespace Talent.Common.Services
{
    public class FileService : IFileService
    {
        private readonly IHostingEnvironment _environment;
        private readonly string _tempFolder;
        private IAwsService _awsService;

        public FileService(IHostingEnvironment environment,
            IAwsService awsService)
        {
            _environment = environment;
            _tempFolder = "images\\";
            _awsService = awsService;
        }

        public async Task<string> GetFileURL(string id, FileType type)
        {
            //var basePath = "http://localhost:60290";
            var basePath = "https://standardtask.azurewebsites.net/profile";
            return Path.Combine(basePath, _tempFolder, id).Replace('\\', '/');
        }

        private async Task<string> savePhoto(IFormFile file)
        {
            string newFileName = Guid.NewGuid().ToString()
                + Path.GetExtension(file.FileName);
            var fullfilePath = Path.Combine(
                _environment.WebRootPath, _tempFolder, newFileName);
            using (var stream = new FileStream(fullfilePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }
            return newFileName;
        }

        public async Task<string> SaveFile(IFormFile file, FileType type)
        {
            string newFileName = "";
            switch (type)
            {
                case FileType.ProfilePhoto:
                    newFileName = await savePhoto(file);
                    break;
                case FileType.UserVideo:
                    break;
                case FileType.UserCV:
                    break;
            }
            return newFileName;
        }

        public async Task<bool> DeleteFile(string id, FileType type)
        {
            try
            {
                var filePath = _tempFolder + id;
                var fullFilePath = Path.GetFullPath(filePath);
                File.Delete(fullFilePath);
            }
            catch (Exception)
            {
                return false;
            }
            return true;
        }


        #region Document Save Methods

        private async Task<string> SaveFileGeneral(IFormFile file, string bucket, string folder, bool isPublic)
        {
            //Your code here;
            throw new NotImplementedException();
        }

        private async Task<bool> DeleteFileGeneral(string id, string bucket)
        {
            //Your code here;
            throw new NotImplementedException();
        }
        #endregion
    }
}
