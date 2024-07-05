using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Identity;
namespace QB.Models;

public class UserModel : IdentityUser<Guid>
{
    [Required] public string Name { get; set; }
    public int ExperiencePoints { get; set; } = 0;
    public DateTime RegistrationDate { get; set; }
}