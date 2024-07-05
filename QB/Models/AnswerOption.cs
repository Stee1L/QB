using System.ComponentModel.DataAnnotations;
 
 namespace QB.Models;
 
 public class AnswerOption
 {
     [Key]
     public Guid AnswerId { get; set; }
 
     [Required]
     public string Text { get; set; }
 
     public int Votes { get; set; } = 0;
 
     public Guid QuestionId { get; set; }
 }