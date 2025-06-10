namespace TravelTales.Application.Exceptions
{
    public class PermissionsException : Exception
    {
        public PermissionsException()
        : base("You don't have enough permissions to perform this action.")
        {
        }

        public PermissionsException(string message)
            : base(message)
        {
        }

        public PermissionsException(string message, Exception innerException)
            : base(message, innerException)
        {
        }
    }
}
