﻿using Talent.Common.Contracts;
using Talent.Common.Models;
using Talent.Services.Profile.Domain.Contracts;
using Talent.Services.Profile.Models.Profile;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using MongoDB.Driver;
using MongoDB.Bson;
using Talent.Services.Profile.Models;
using Microsoft.AspNetCore.Http;
using System.IO;
using Talent.Common.Security;

namespace Talent.Services.Profile.Domain.Services
{
    public class ProfileService : IProfileService
    {
        private readonly IUserAppContext _userAppContext;
        IRepository<UserLanguage> _userLanguageRepository;
        IRepository<User> _userRepository;
        IRepository<Employer> _employerRepository;
        IRepository<Job> _jobRepository;
        IRepository<Recruiter> _recruiterRepository;
        IFileService _fileService;


        public ProfileService(IUserAppContext userAppContext,
                              IRepository<UserLanguage> userLanguageRepository,
                              IRepository<User> userRepository,
                              IRepository<Employer> employerRepository,
                              IRepository<Job> jobRepository,
                              IRepository<Recruiter> recruiterRepository,
                              IFileService fileService)
        {
            _userAppContext = userAppContext;
            _userLanguageRepository = userLanguageRepository;
            _userRepository = userRepository;
            _employerRepository = employerRepository;
            _jobRepository = jobRepository;
            _recruiterRepository = recruiterRepository;
            _fileService = fileService;
        }

        public bool AddNewLanguage(AddLanguageViewModel language)
        {
            //Your code here;
            throw new NotImplementedException();
        }

        public async Task<TalentProfileViewModel> GetTalentProfile(string Id)
        {
            User talent = (await _userRepository.Get(x => x.Id == Id)).FirstOrDefault();
            var videoUrl = string.IsNullOrWhiteSpace(talent.VideoName)
                          ? ""
                          : await _fileService.GetFileURL(talent.VideoName, FileType.UserVideo);
            var cvUrl = string.IsNullOrWhiteSpace(talent.CvName)
                        ? ""
                        : await _fileService.GetFileURL(talent.CvName, FileType.UserCV);
            var languages = talent.Languages.Select(x => ViewModelFromLanguage(x)).ToList();
            var skills = talent.Skills.Select(x => ViewModelFromSkill(x)).ToList();
            var education = talent.Education.Select(x => ViewModelFromEducation(x)).ToList();
            var certifications = talent.Certifications.Select(
                x => ViewModelFromCertification(x)).ToList();
            var experience = talent.Experience.Select(x => ViewModelFromExperience(x)).ToList();

            var result = new TalentProfileViewModel
            {
                Id = talent.Id,
                FirstName = talent.FirstName,
                MiddleName = talent.MiddleName,
                LastName = talent.LastName,
                Gender = talent.Gender,

                Email = talent.Email,
                Phone = talent.Phone,
                MobilePhone = talent.MobilePhone,
                IsMobilePhoneVerified = talent.IsMobilePhoneVerified,

                Address = talent.Address,
                Nationality = talent.Nationality,
                VisaStatus = talent.VisaStatus,
                VisaExpiryDate = talent.VisaExpiryDate,
                ProfilePhoto = talent.ProfilePhoto,
                ProfilePhotoUrl = talent.ProfilePhotoUrl,

                VideoName = talent.VideoName,
                VideoUrl = videoUrl,
                CvName = talent.CvName,
                CvUrl = cvUrl,

                Summary = talent.Summary,
                Description = talent.Description,
                LinkedAccounts = talent.LinkedAccounts,
                JobSeekingStatus = talent.JobSeekingStatus,

                Languages = languages,
                Skills = skills,
                Education = education,
                Certifications = certifications,
                Experience = experience
            };
            return result;
        }

        public async Task<IEnumerable<AddLanguageViewModel>> GetLanguages(string id)
        {
            var talent = (await _userRepository.Get(x => x.Id == id)).FirstOrDefault();
            if (null != talent)
            {
                var languages = talent.Languages.Select(x => ViewModelFromLanguage(x)).ToList();
                return languages;
            }
            return null;
        }

        public async Task<bool> UpdateLanguage(string talentId, List<AddLanguageViewModel> languages)
        {
            var talent = (await _userRepository.Get(x => x.Id == talentId)).FirstOrDefault();
            if (null != talent)
            {
                talent.Languages = handleNewLanguage(languages, talent);
                await _userRepository.Update(talent);
                return true;
            }
            return false;
        }

        private List<UserLanguage> handleNewLanguage(
            List<AddLanguageViewModel> model, User existingTalent)
        {
            var newLanguages = new List<UserLanguage>();
            foreach (var item in model)
            {
                var language = existingTalent.Languages.SingleOrDefault(x => x.Id == item.Id);
                if (null == language)
                {
                    language = new UserLanguage
                    {
                        Id = ObjectId.GenerateNewId().ToString(),
                        UserId = existingTalent.Id,
                        IsDeleted = false
                    };
                }
                UpdateLanguageFromView(item, language);
                newLanguages.Add(language);
            }
            return newLanguages;
        }

        private List<UserSkill> handleNewSkill(
            List<AddSkillViewModel> model, User existingTalent)
        {
            var newSkills = new List<UserSkill>();
            foreach (var item in model)
            {
                var skill = existingTalent.Skills.SingleOrDefault(x => x.Id == item.Id);
                if (null == skill)
                {
                    skill = new UserSkill
                    {
                        Id = ObjectId.GenerateNewId().ToString(),
                        UserId = existingTalent.Id,
                        IsDeleted = false
                    };
                }
                UpdateSkillFromView(item, skill);
                newSkills.Add(skill);
            }
            return newSkills;
        }

        private List<UserEducation> handleNewEducation(
            List<AddEducationViewModel> model, User existingTalent)
        {
            var newEducation = new List<UserEducation>();
            foreach (var item in model)
            {
                var education = existingTalent.Education.SingleOrDefault(x => x.Id == item.Id);
                if (null == education)
                {
                    education = new UserEducation
                    {
                        Id = ObjectId.GenerateNewId().ToString(),
                        IsDeleted = false,
                        UserId = existingTalent.Id
                    };
                }
                UpdateEducationFromView(item, education);
                newEducation.Add(education);
            }
            return newEducation;
        }

        private List<UserCertification> handleNewCertification(
            List<AddCertificationViewModel> model, User existingTalent)
        {
            var newCert = new List<UserCertification>();
            foreach (var item in model)
            {
                var cert = existingTalent.Certifications.SingleOrDefault(x => x.Id == item.Id);
                if (null == cert)
                {
                    cert = new UserCertification
                    {
                        Id = ObjectId.GenerateNewId().ToString(),
                        UserId = existingTalent.Id,
                        IsDeleted = false
                    };
                }
                UpdateCertificationFromView(item, cert);
                newCert.Add(cert);
            }
            return newCert;
        }

        private List<UserExperience> handleNewExperience(
            List<AddExperienceViewModel> model, User existingTalent)
        {
            var newExp = new List<UserExperience>();
            foreach (var item in model)
            {
                var exp = existingTalent.Experience.SingleOrDefault(x => x.Id == item.Id);
                if (null == exp)
                {
                    exp = new UserExperience
                    {
                        Id = ObjectId.GenerateNewId().ToString()
                    };
                }
                UpdateExperienceFromView(item, exp);
                newExp.Add(exp);
            }
            return newExp;
        }

        // haven't deal with Videos.
        public async Task<bool> UpdateTalentProfile(TalentProfileViewModel talent, string updaterId)
        {
            try
            {
                if (null != talent.Id)
                {
                    User existingTalent = (await _userRepository.GetByIdAsync(talent.Id));
                    existingTalent.FirstName = talent.FirstName;
                    existingTalent.MiddleName = talent.MiddleName;
                    existingTalent.LastName = talent.LastName;
                    existingTalent.Gender = talent.Gender;

                    existingTalent.Email = talent.Email;
                    existingTalent.Phone = talent.Phone;
                    existingTalent.MobilePhone = talent.MobilePhone;
                    existingTalent.IsMobilePhoneVerified = talent.IsMobilePhoneVerified;

                    existingTalent.Address = talent.Address;
                    existingTalent.Nationality = talent.Nationality;
                    existingTalent.VisaStatus = talent.VisaStatus;
                    existingTalent.VisaExpiryDate = talent.VisaExpiryDate;
                    existingTalent.ProfilePhoto = talent.ProfilePhoto;
                    existingTalent.ProfilePhotoUrl = talent.ProfilePhotoUrl;

                    existingTalent.VideoName = talent.VideoName;
                    existingTalent.CvName = talent.CvName;

                    existingTalent.Summary = talent.Summary;
                    existingTalent.Description = talent.Description;
                    existingTalent.LinkedAccounts = talent.LinkedAccounts;
                    existingTalent.JobSeekingStatus = talent.JobSeekingStatus;

                    //existingTalent.Videos = (await _fileService.);

                    existingTalent.Languages = handleNewLanguage(
                        talent.Languages, existingTalent);
                    existingTalent.Skills = handleNewSkill(
                        talent.Skills, existingTalent);
                    existingTalent.Education = handleNewEducation(
                        talent.Education, existingTalent);
                    existingTalent.Certifications = handleNewCertification(
                        talent.Certifications, existingTalent);
                    existingTalent.Experience = handleNewExperience(
                        talent.Experience, existingTalent);
                    await _userRepository.Update(existingTalent);
                    return true;
                }
                else
                {
                    return false;
                }
            }
            catch (MongoException e)
            {
                return false;
            }
        }

        public async Task<EmployerProfileViewModel> GetEmployerProfile(string Id, string role)
        {

            Employer profile = null;
            switch (role)
            {
                case "employer":
                    profile = (await _employerRepository.GetByIdAsync(Id));
                    break;
                case "recruiter":
                    profile = (await _recruiterRepository.GetByIdAsync(Id));
                    break;
            }

            var videoUrl = "";

            if (profile != null)
            {
                videoUrl = string.IsNullOrWhiteSpace(profile.VideoName)
                          ? ""
                          : await _fileService.GetFileURL(profile.VideoName, FileType.UserVideo);

                var skills = profile.Skills.Select(x => ViewModelFromSkill(x)).ToList();

                var result = new EmployerProfileViewModel
                {
                    Id = profile.Id,
                    CompanyContact = profile.CompanyContact,
                    PrimaryContact = profile.PrimaryContact,
                    Skills = skills,
                    ProfilePhoto = profile.ProfilePhoto,
                    ProfilePhotoUrl = profile.ProfilePhotoUrl,
                    VideoName = profile.VideoName,
                    VideoUrl = videoUrl,
                    DisplayProfile = profile.DisplayProfile,
                };
                return result;
            }

            return null;
        }

        public async Task<bool> UpdateEmployerProfile(EmployerProfileViewModel employer, string updaterId, string role)
        {
            try
            {
                if (employer.Id != null)
                {
                    switch (role)
                    {
                        case "employer":
                            Employer existingEmployer = (await _employerRepository.GetByIdAsync(employer.Id));
                            existingEmployer.CompanyContact = employer.CompanyContact;
                            existingEmployer.PrimaryContact = employer.PrimaryContact;
                            existingEmployer.ProfilePhoto = employer.ProfilePhoto;
                            existingEmployer.ProfilePhotoUrl = employer.ProfilePhotoUrl;
                            existingEmployer.DisplayProfile = employer.DisplayProfile;
                            existingEmployer.UpdatedBy = updaterId;
                            existingEmployer.UpdatedOn = DateTime.Now;

                            var newSkills = new List<UserSkill>();
                            foreach (var item in employer.Skills)
                            {
                                var skill = existingEmployer.Skills.SingleOrDefault(x => x.Id == item.Id);
                                if (skill == null)
                                {
                                    skill = new UserSkill
                                    {
                                        Id = ObjectId.GenerateNewId().ToString(),
                                        IsDeleted = false
                                    };
                                }
                                UpdateSkillFromView(item, skill);
                                newSkills.Add(skill);
                            }
                            existingEmployer.Skills = newSkills;

                            await _employerRepository.Update(existingEmployer);
                            break;

                        case "recruiter":
                            Recruiter existingRecruiter = (await _recruiterRepository.GetByIdAsync(employer.Id));
                            existingRecruiter.CompanyContact = employer.CompanyContact;
                            existingRecruiter.PrimaryContact = employer.PrimaryContact;
                            existingRecruiter.ProfilePhoto = employer.ProfilePhoto;
                            existingRecruiter.ProfilePhotoUrl = employer.ProfilePhotoUrl;
                            existingRecruiter.DisplayProfile = employer.DisplayProfile;
                            existingRecruiter.UpdatedBy = updaterId;
                            existingRecruiter.UpdatedOn = DateTime.Now;

                            var newRSkills = new List<UserSkill>();
                            foreach (var item in employer.Skills)
                            {
                                var skill = existingRecruiter.Skills.SingleOrDefault(x => x.Id == item.Id);
                                if (skill == null)
                                {
                                    skill = new UserSkill
                                    {
                                        Id = ObjectId.GenerateNewId().ToString(),
                                        IsDeleted = false
                                    };
                                }
                                UpdateSkillFromView(item, skill);
                                newRSkills.Add(skill);
                            }
                            existingRecruiter.Skills = newRSkills;
                            await _recruiterRepository.Update(existingRecruiter);

                            break;
                    }
                    return true;
                }
                return false;
            }
            catch (MongoException e)
            {
                return false;
            }
        }

        public async Task<bool> UpdateEmployerPhoto(string employerId, IFormFile file)
        {
            var fileExtension = Path.GetExtension(file.FileName);
            List<string> acceptedExtensions = new List<string> { ".jpg", ".png", ".gif", ".jpeg" };

            if (fileExtension != null && !acceptedExtensions.Contains(fileExtension.ToLower()))
            {
                return false;
            }

            var profile = (await _employerRepository.Get(x => x.Id == employerId)).SingleOrDefault();

            if (profile == null)
            {
                return false;
            }

            var newFileName = await _fileService.SaveFile(file, FileType.ProfilePhoto);

            if (!string.IsNullOrWhiteSpace(newFileName))
            {
                var oldFileName = profile.ProfilePhoto;

                if (!string.IsNullOrWhiteSpace(oldFileName))
                {
                    await _fileService.DeleteFile(oldFileName, FileType.ProfilePhoto);
                }

                profile.ProfilePhoto = newFileName;
                profile.ProfilePhotoUrl = await _fileService.GetFileURL(newFileName, FileType.ProfilePhoto);

                await _employerRepository.Update(profile);
                return true;
            }

            return false;
        }

        public async Task<bool> AddEmployerVideo(string employerId, IFormFile file)
        {
            //Your code here;
            throw new NotImplementedException();
        }

        public async Task<bool> UpdateTalentPhoto(string talentId, IFormFile file)
        {
            var fileExtension = Path.GetExtension(file.FileName);
            List<string> acceptedExtensions = new List<string> { ".jpg", ".png", ".gif", ".jpeg" };

            if (fileExtension != null && !acceptedExtensions.Contains(fileExtension.ToLower()))
            {
                return false;
            }
            User talent = (await _userRepository.Get(x => x.Id == talentId)).SingleOrDefault();
            var newFileName = await _fileService.SaveFile(file, FileType.ProfilePhoto);
            if (!string.IsNullOrWhiteSpace(newFileName))
            {
                var oldFileName = talent.ProfilePhoto;

                if (!string.IsNullOrWhiteSpace(oldFileName))
                {
                    await _fileService.DeleteFile(oldFileName, FileType.ProfilePhoto);
                }

                talent.ProfilePhoto = newFileName;
                talent.ProfilePhotoUrl = await _fileService.GetFileURL(newFileName, FileType.ProfilePhoto);

                await _userRepository.Update(talent);
                return true;
            }

            return false;
        }

        public async Task<bool> AddTalentVideo(string talentId, IFormFile file)
        {
            //Your code here;
            throw new NotImplementedException();

        }

        public async Task<bool> RemoveTalentVideo(string talentId, string videoName)
        {
            //Your code here;
            throw new NotImplementedException();
        }

        public async Task<bool> UpdateTalentCV(string talentId, IFormFile file)
        {
            //Your code here;
            throw new NotImplementedException();
        }

        public async Task<IEnumerable<string>> GetTalentSuggestionIds(string employerOrJobId, bool forJob, int position, int increment)
        {
            //Your code here;
            throw new NotImplementedException();
        }

        public async Task<IEnumerable<TalentSnapshotViewModel>> GetTalentSnapshotList(string employerOrJobId, bool forJob, int position, int increment)
        {
            //Your code here;
            throw new NotImplementedException();
        }

        public async Task<IEnumerable<TalentSnapshotViewModel>> GetTalentSnapshotList(IEnumerable<string> ids)
        {
            //Your code here;
            throw new NotImplementedException();
        }

        #region TalentMatching

        public async Task<IEnumerable<TalentSuggestionViewModel>> GetFullTalentList()
        {
            var talents = (await _userRepository.Get(x => true)).ToList();
            List<TalentSuggestionViewModel> result =
                new List<TalentSuggestionViewModel>();
            foreach (var talent in talents)
            {
                TalentSuggestionViewModel t = await ViewModelFromTalent(talent);
                result.Add(t);
            }
            return result;
        }

        public async Task<TalentSuggestionViewModel> ViewModelFromTalent(User talent)
        {
            var experiences = talent.Experience.OrderByDescending(x => x.End)
                .Select(x => ViewModelFromExperience(x)).ToList();
            var skills = talent.Skills.Select(
                x => ViewModelFromSkill(x)).ToList();
            var cvUrl = string.IsNullOrWhiteSpace(talent.CvName)
                    ? ""
                    : await _fileService.GetFileURL(talent.CvName, FileType.UserCV);

            return new TalentSuggestionViewModel
            {
                Id = talent.Id,
                Name = talent.FirstName + " " + talent.LastName,
                City = talent.Address.City,
                Country = talent.Address.Country,
                PhotoId = talent.ProfilePhotoUrl,
                Summary = talent.Summary,
                Position = "",
                WorkExperience = experiences,
                Skills = skills,
                VisaStatus = talent.VisaStatus,
                VisaExpiryDate = talent.VisaExpiryDate,
                CvUrl = cvUrl,
                LinkedAccounts = talent.LinkedAccounts,
            };
        }

        public async Task<IEnumerable<Task<TalentSuggestionViewModel>>> GetRecommendTalents()
        {
            return (await _userRepository.Get(x => true)).ToList()
                .Select(async (x) => (await ViewModelFromTalent(x)));
        }

        public IEnumerable<TalentMatchingEmployerViewModel> GetEmployerList()
        {
            //Your code here;
            throw new NotImplementedException();
        }

        public async Task<IEnumerable<TalentMatchingEmployerViewModel>> GetEmployerListByFilterAsync(SearchCompanyModel model)
        {
            //Your code here;
            throw new NotImplementedException();
        }

        public async Task<IEnumerable<TalentSuggestionViewModel>> GetTalentListByFilterAsync(SearchTalentModel model)
        {
            //Your code here;
            throw new NotImplementedException();
        }

        public async Task<IEnumerable<TalentSuggestion>> GetSuggestionList(string employerOrJobId, bool forJob, string recruiterId)
        {
            //Your code here;
            throw new NotImplementedException();
        }

        public async Task<bool> AddTalentSuggestions(AddTalentSuggestionList selectedTalents)
        {
            //Your code here;
            throw new NotImplementedException();
        }

        #endregion

        #region Conversion Methods

        #region Update from View

        protected void UpdateSkillFromView(AddSkillViewModel model, UserSkill original)
        {
            original.ExperienceLevel = model.Level;
            original.Skill = model.Name;
        }

        protected void UpdateLanguageFromView(AddLanguageViewModel model, UserLanguage original)
        {
            original.Language = model.Name;
            original.LanguageLevel = model.Level;
            original.UserId = model.CurrentUserId;
        }

        protected void UpdateEducationFromView(AddEducationViewModel model, UserEducation original)
        {
            original.Country = model.Country;
            original.InstituteName = model.InstituteName;
            original.Title = model.Title;
            original.Degree = model.Degree;
            original.YearOfGraduation = model.YearOfGraduation;
        }

        protected void UpdateCertificationFromView(
            AddCertificationViewModel model, UserCertification original)
        {
            original.CertificationName = model.CertificationName;
            original.CertificationFrom = model.CertificationFrom;
            original.CertificationYear = model.CertificationYear;
        }

        protected void UpdateExperienceFromView(
            AddExperienceViewModel model, UserExperience original)
        {
            original.Company = model.Company;
            original.Position = model.Position;
            original.Responsibilities = model.Responsibilities;
            original.Start = model.Start;
            original.End = model.End;
        }

        #endregion

        #region Build Views from Model

        protected AddSkillViewModel ViewModelFromSkill(UserSkill skill)
        {
            return new AddSkillViewModel
            {
                Id = skill.Id,
                Level = skill.ExperienceLevel,
                Name = skill.Skill
            };
        }

        protected AddLanguageViewModel ViewModelFromLanguage(UserLanguage language)
        {
            return new AddLanguageViewModel
            {
                Name = language.Language,
                Id = language.Id,
                Level = language.LanguageLevel,
                CurrentUserId = language.UserId,
            };
        }

        protected AddEducationViewModel ViewModelFromEducation(UserEducation education)
        {
            return new AddEducationViewModel
            {
                Country = education.Country,
                InstituteName = education.InstituteName,
                Title = education.Title,
                Degree = education.Degree,
                YearOfGraduation = education.YearOfGraduation,
                Id = education.Id
            };
        }

        protected AddCertificationViewModel ViewModelFromCertification(
            UserCertification certification)
        {
            return new AddCertificationViewModel
            {
                Id = certification.Id,
                CertificationName = certification.CertificationName,
                CertificationFrom = certification.CertificationFrom,
                CertificationYear = certification.CertificationYear
            };
        }

        protected AddExperienceViewModel ViewModelFromExperience(UserExperience experience)
        {
            return new AddExperienceViewModel
            {
                Id = experience.Id,
                Company = experience.Company,
                Position = experience.Position,
                Responsibilities = experience.Responsibilities,
                Start = experience.Start,
                End = experience.End
            };
        }

        #endregion

        #endregion

        #region ManageClients

        public async Task<IEnumerable<ClientViewModel>> GetClientListAsync(string recruiterId)
        {
            //Your code here;
            throw new NotImplementedException();
        }

        public async Task<ClientViewModel> ConvertToClientsViewAsync(Client client, string recruiterId)
        {
            //Your code here;
            throw new NotImplementedException();
        }

        public async Task<int> GetTotalTalentsForClient(string clientId, string recruiterId)
        {
            //Your code here;
            throw new NotImplementedException();

        }

        public async Task<Employer> GetEmployer(string employerId)
        {
            return await _employerRepository.GetByIdAsync(employerId);
        }
        #endregion

    }
}
