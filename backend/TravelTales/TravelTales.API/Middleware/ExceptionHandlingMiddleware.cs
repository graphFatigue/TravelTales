using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using System.Net;
using TravelTales.Application.Exceptions;

namespace TravelTales.API.Middleware
{
    public class ExceptionHandlingMiddleware
    {
        private readonly RequestDelegate next;
        private readonly ILogger<ExceptionHandlingMiddleware> logger;

        public ExceptionHandlingMiddleware(RequestDelegate next, ILogger<ExceptionHandlingMiddleware> logger)
        {
            this.next = next;
            this.logger = logger;
        }

        public async Task Invoke(HttpContext context)
        {
            try
            {
                await next(context);
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "An error occurred");
                await HandleExceptionAsync(context, ex);
            }
        }

        private static Task HandleExceptionAsync(HttpContext context, Exception exception)
        {
            var (code, message) = exception switch
            {
                InvalidCredentialsAuthException => (HttpStatusCode.Unauthorized, "Invalid email or password"),
                NotFoundException => (HttpStatusCode.NotFound, exception.Message),
                BusinessException => (HttpStatusCode.BadRequest, exception.Message),
                NotAuthorizedException => (HttpStatusCode.Unauthorized, exception.Message),
                PermissionsException => (HttpStatusCode.Forbidden, exception.Message),
                UserCreationException => (HttpStatusCode.BadRequest, exception.Message),
                ArgumentNullException or ArgumentException => (HttpStatusCode.BadRequest, "Invalid request parameters"),
                DbUpdateException => (HttpStatusCode.Conflict, "Database update conflict occurred"),
                _ => (HttpStatusCode.InternalServerError, "An unexpected error occurred")
            };

            context.Response.ContentType = "application/json";
            context.Response.StatusCode = (int)code;

            return context.Response.WriteAsync(JsonConvert.SerializeObject(new
            {
                error = message,
                statusCode = context.Response.StatusCode
            }));
        }
    }

    public static partial class AppBuilderExtensions
    {
        public static IApplicationBuilder UseExceptionHandlingMiddleware(this IApplicationBuilder app)
        {
            return app.UseMiddleware<ExceptionHandlingMiddleware>();
        }
    }
}
