namespace TravelTales.Application.Exceptions
{
    public class InvalidCredentialsAuthException : Exception
    {
        public InvalidCredentialsAuthException()
            : base("Invalid email or password")
        {
        }

        public InvalidCredentialsAuthException(string message)
            : base(message)
        {
        }

        public InvalidCredentialsAuthException(string message, Exception innerException)
            : base(message, innerException)
        {
        }
    }
}
