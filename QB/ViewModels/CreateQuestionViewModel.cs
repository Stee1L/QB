using System.ComponentModel.DataAnnotations;

public class CreateQuestionViewModel
{
    [Required]
    public string Topic { get; set; }

    [Required]
    public string Text { get; set; }

    [Required]
    public List<string> AnswerOptions { get; set; }
}