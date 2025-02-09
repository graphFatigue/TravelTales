using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using System.Net;
using TravelTales.Application.Exceptions;

namespace TravelTales.API.Middleware
{
    public class ExceptionHandlingMiddleware
    {
        private readonly RequestDelegate next;

        public ExceptionHandlingMiddleware(RequestDelegate next)
        {
            this.next = next;
        }

        public async Task Invoke(HttpContext context)
        {
            try
            {
                await this.next(context);
            }
            catch (ArgumentNullException ex)
            {
                await HandleExceptionAsync(context, ex);
            }
        }

        private static Task HandleExceptionAsync(HttpContext context, Exception exception)
        {
            var (code, message) = exception switch
            {
                NotFoundException => (HttpStatusCode.NotFound, exception.Message),
                BusinessException => (HttpStatusCode.BadRequest, exception.Message),
                InvalidCredentialsAuthException => (HttpStatusCode.Unauthorized, exception.Message),
                NotAuthorizedException => (HttpStatusCode.Unauthorized, exception.Message),
                PermissionsException => (HttpStatusCode.Forbidden, exception.Message),
                UserCreationException => (HttpStatusCode.BadRequest, exception.Message),
                ArgumentNullException or ArgumentException => (HttpStatusCode.BadRequest, exception.Message),
                DbUpdateException => (HttpStatusCode.Conflict, "Database update conflict occurred."),
                _ => (HttpStatusCode.InternalServerError, "An unexpected error occurred.")
            };

            context.Response.ContentType = "application/json";
            context.Response.StatusCode = (int)code;

            var result = JsonConvert.SerializeObject(new
            {
                error = message,
                statusCode = context.Response.StatusCode,
            });

            return context.Response.WriteAsync(result);
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
