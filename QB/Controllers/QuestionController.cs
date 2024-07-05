using System;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using QB.Data;
using QB.Models;

namespace QB.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class QuestionController : ControllerBase
    {
        private readonly AppDbContext _context;

        public QuestionController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet("random")]
        [Authorize]
        public async Task<IActionResult> GetRandomQuestion()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);

            if (userIdClaim == null || !Guid.TryParse(userIdClaim.Value, out Guid userIdGuid))
            {
                return BadRequest(new { message = "Некорректный формат идентификатора пользователя" });
            }

            var answeredQuestionIds = await _context.UserQuestionAnswers
                .Where(uqa => uqa.UserId == userIdGuid)
                .Select(uqa => uqa.QuestionId)
                .ToListAsync();

            var question = await _context.Questions
                .Where(q => !answeredQuestionIds.Contains(q.Id) && q.AuthorId != userIdGuid)
                .OrderBy(r => Guid.NewGuid())
                .Select(q => new 
                {
                    q.Id,
                    q.Topic,
                    q.Text,
                    AnswerOptions = _context.AnswerOptions.Where(a => a.QuestionId == q.Id).Select(a => new { a.AnswerId, a.Text }).ToList()
                })
                .FirstOrDefaultAsync();



            if (question == null)
            {
                return NotFound(new { message = "Нет доступных вопросов" });
            }

            return Ok(question);
        }

        [HttpGet("my-questions")]
        [Authorize]
        public async Task<IActionResult> GetMyQuestions()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);

            if (userIdClaim == null || !Guid.TryParse(userIdClaim.Value, out Guid userIdGuid))
            {
                return BadRequest(new { message = "Некорректный формат идентификатора пользователя" });
            }

            var questions = await _context.Questions
                .Where(q => q.AuthorId == userIdGuid)
                .Select(q => new
                {
                    q.Id,
                    q.Topic,
                    q.Text,
                    AnswerOptions = _context.AnswerOptions
                        .Where(a => a.QuestionId == q.Id)
                        .Select(a => new { a.AnswerId, a.Text, a.Votes })
                        .ToList()
                })
                .ToListAsync();

            return Ok(questions);
        }


        [HttpPost("create")]
        [Authorize]
        public async Task<IActionResult> CreateQuestion([FromBody] CreateQuestionViewModel model)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);

            if (userIdClaim == null || !Guid.TryParse(userIdClaim.Value, out Guid userIdGuid))
            {
                return BadRequest(new { message = "Некорректный формат идентификатора пользователя" });
            }

            var question = new QuestionModel
            {
                Id = Guid.NewGuid(),
                Topic = model.Topic,
                Text = model.Text,
                AuthorId = userIdGuid
            };

            var answers = model.AnswerOptions.Select(f => new AnswerOption()
            {
                Text = f,
                AnswerId = Guid.NewGuid(),
                QuestionId = question.Id,
                Votes = 0
            });

            _context.Questions.Add(question);
            _context.AnswerOptions.AddRange(answers);
            
            await _context.SaveChangesAsync();

            return Ok(question);

        }

        [HttpPost("answer")]
        [Authorize]
        public async Task<IActionResult> AnswerQuestion([FromBody] AnswerQuestionViewModel model)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);

            if (userIdClaim == null || !Guid.TryParse(userIdClaim.Value, out Guid userIdGuid))
            {
                return BadRequest(new { message = "Некорректный формат идентификатора пользователя" });
            }

            var question = await _context.Questions
                .FirstOrDefaultAsync(q => q.Id == model.QuestionId);

            if (question == null)
            {
                return NotFound(new { message = "Вопрос не найден" });
            }

            var answerOption = _context.AnswerOptions.FirstOrDefault(a => a.AnswerId == model.AnswerId);

            if (answerOption == null)
            {
                return BadRequest(new { message = "Некорректный ответ" });
            }

            // Увеличиваем количество голосов
            answerOption.Votes++;

            // Добавляем запись о том, что пользователь ответил на этот вопрос
            _context.UserQuestionAnswers.Add(new UserQuestionAnswer
            {
                UserId = userIdGuid,
                QuestionId = model.QuestionId
            });

            // Добавляем опыт пользователю
            var user = await _context.Users.FindAsync(userIdGuid);
            if (user != null)
            {
                user.ExperiencePoints += 10;
            }
            
            await _context.SaveChangesAsync();

            // Возвращаем обновленную статистику голосов
            var stats = _context.AnswerOptions
                .Where(q => q.QuestionId == model.QuestionId)
                .Select(a => new { a.Text, a.Votes })
                .ToList();

            return Ok(stats);
        }
    }
}
