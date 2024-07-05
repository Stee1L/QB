using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using QB.Models;

public class QuestionModel
{
    [Key]
    public Guid Id { get; set; }

    [Required]
    public string Topic { get; set; }

    [Required]
    public string Text { get; set; }
    public Guid AuthorId { get; set; }

    public ICollection<AnswerOption> AnswerOptions { get; set; }
}