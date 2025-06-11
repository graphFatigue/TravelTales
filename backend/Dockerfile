# Use the official ASP.NET 8 runtime image
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443

# Use the .NET SDK image to build the app
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy solution and project files
COPY TravelTales/TravelTales.sln ./
COPY TravelTales/TravelTales.API/TravelTales.API.csproj TravelTales.API/
COPY TravelTales/TravelTales.Application/TravelTales.Application.csproj TravelTales.Application/
COPY TravelTales/TravelTales.Domain/TravelTales.Domain.csproj TravelTales.Domain/
COPY TravelTales/TravelTales.Persistence/TravelTales.Persistence.csproj TravelTales.Persistence/

RUN dotnet restore TravelTales.sln

# Copy everything
COPY TravelTales/. .

WORKDIR /src/TravelTales.API
RUN dotnet build -c Release -o /app/build

# Publish the app
FROM build AS publish
RUN dotnet publish -c Release -o /app/publish

# Final runtime stage
FROM base AS final
WORKDIR /app

ENV ASPNETCORE_URLS=http://+:80

COPY --from=publish /app/publish .

ENTRYPOINT ["dotnet", "TravelTales.API.dll"]
