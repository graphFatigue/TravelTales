namespace TravelTales.Domain.Entities
{
    public class City
    {
        public long Id { get; set; }
        public string Name { get; set; }
        public long CountryId { get; set; }
        public Country Country { get; set; }
    }
}
