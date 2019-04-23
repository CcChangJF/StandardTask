using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Talent.Common.Models;
using Talent.Services.Profile.Models.Profile;

namespace Talent.Services.Profile.Models
{
    public class TalentSuggestionViewModel
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public string City { get; set; }
        public string Country { get; set; }
        public string PhotoId { get; set; }
        public string Summary { get; set; }
        public string Position { get; set; }
        public List<AddExperienceViewModel> WorkExperience { get; set; }
        public List<AddSkillViewModel> Skills { get; set; }
        public string VisaStatus { get; set; }
        public DateTime? VisaExpiryDate { get; set; }
        public string Education { get; set; }
        public string CvUrl { get; set; }
        public string VideoUrl { get; set; }
        public LinkedAccounts LinkedAccounts { get; set; } 
    }
}
