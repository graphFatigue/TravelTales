using Microsoft.AspNetCore.Mvc;

namespace TravelTales.API.Controllers
{
    public class BloggersController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
