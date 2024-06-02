using System.ComponentModel.DataAnnotations;

namespace QB.ViewModels;

public class ForgotPasswordViewModel
{
    [Required]
    [EmailAddress]
    public string Email { get; set; }
}