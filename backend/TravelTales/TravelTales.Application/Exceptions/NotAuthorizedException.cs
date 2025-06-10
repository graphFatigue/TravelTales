namespace TravelTales.Application.Exceptions
{
    public class NotAuthorizedException : Exception
    {
        public NotAuthorizedException()
        : base("Not authorized.")
        {
        }

        public NotAuthorizedException(string message)
            : base(message)
        {
        }

        public NotAuthorizedException(string message, Exception innerException)
            : base(message, innerException)
        {
        }
    }
}
