using ExampleAPISignalR.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.ComponentModel.DataAnnotations;

namespace ExampleAPISignalR.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class NotificationController : ControllerBase
    {
        private readonly NotificationService _notificationService;

        public NotificationController(NotificationService notificationService)
        {
            _notificationService = notificationService;
        }

        [HttpPost("registerUser")]
        public IActionResult RegisterUser([FromBody] UserDto user)
        {
            if (_notificationService.AddUserToList(user.Name))
            {
                return NoContent();
            }

            return BadRequest("User already exists");
        }

        public class UserDto
        {
            [Required]
            [MinLength(3)]
            public string Name { get; set; }

        }
    }
}
