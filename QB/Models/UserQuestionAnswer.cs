namespace QB.Models;

public class UserQuestionAnswer
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public Guid QuestionId { get; set; }
}
