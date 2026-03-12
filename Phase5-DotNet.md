# Phase 5 — C#/.NET Track
## Weeks 18-23

**Focus:** C# language, ASP.NET Core, Entity Framework, Azure deployment  
**Duration:** 6 weeks | **.NET 9** (already installed)

---

## Phase Overview

C# is dominant in Belgian enterprise and government — including the rail sector. TypeScript prepared you well: strong typing, classes, interfaces, generics, async/await — the concepts are familiar, the syntax differs.

**What you'll build:**
- Weeks 18-19: C# fundamentals via mini projects
- Weeks 20-21: ASP.NET Core Web API
- Week 22: Event Booking API (main portfolio project)
- Week 23: Azure deployment + GitHub Actions CI/CD

---

## Week 18 — C# Fundamentals

```bash
dotnet --version   # Verify 9.x.x
dotnet new console -n CSharpFundamentals
cd CSharpFundamentals
dotnet run
```

### C# vs TypeScript — Key Differences

```csharp
// Types
string name = "Xavier";         // var name = "Xavier" also works (inferred)
int age = 30;
bool isActive = true;
decimal price = 19.99m;         // Use decimal for money — not float or double!
double ratio = 0.75;            // Use double for math calculations

// String interpolation — almost identical
string message = $"Hello {name}, you are {age} years old";

// Verbatim strings — no escape needed (useful for Windows paths)
string path = @"C:\Users\Xavier\Documents";

// Nullable reference types — C# is stricter than TypeScript
string name = "Xavier";         // Cannot be null
string? optionalName = null;    // The ? makes it nullable

// Null operators — same as TypeScript
string? city = user?.Address?.City;        // Optional chaining
string display = user?.Name ?? "Anonymous"; // Null coalescing
user.Name ??= "Default";                    // Assign only if null
```

### Day 1 (Evening ~2hrs): Collections

```csharp
// List<T> — like a TypeScript array
var numbers = new List<int> { 1, 2, 3, 4, 5 };
numbers.Add(6);
numbers.Remove(3);
int count = numbers.Count;   // Property, not .length

// Dictionary<TKey, TValue> — like TypeScript Record<K,V>
var scores = new Dictionary<string, int>
{
    { "Alice", 95 },
    { "Bob", 87 }
};
scores["Charlie"] = 92;                    // Add or update
bool exists = scores.ContainsKey("Alice"); // true

// Array — fixed size
int[] fixedArray = { 1, 2, 3, 4, 5 };
```

### Day 2 (Evening ~2hrs): LINQ

LINQ = C#'s version of JavaScript's array methods (map/filter/reduce):

```csharp
var employees = new List<Employee>
{
    new Employee { Name = "Alice", Department = "IT", Salary = 3500 },
    new Employee { Name = "Bob",   Department = "HR", Salary = 2800 },
    new Employee { Name = "Charlie", Department = "IT", Salary = 4000 }
};

// Where = filter
var itEmployees = employees.Where(e => e.Department == "IT");

// Select = map
var names = employees.Select(e => e.Name);

// FirstOrDefault = find (returns null if not found)
var alice = employees.FirstOrDefault(e => e.Name == "Alice");

// OrderBy
var sorted = employees.OrderBy(e => e.Salary);
var descending = employees.OrderByDescending(e => e.Salary);

// Aggregations
decimal totalSalary = employees.Sum(e => e.Salary);
double avgSalary = employees.Average(e => e.Salary);

// GroupBy
var byDept = employees.GroupBy(e => e.Department);
foreach (var group in byDept)
    Console.WriteLine($"{group.Key}: {group.Count()} employees, avg {group.Average(e => e.Salary):C}");

// Chaining
var itTotal = employees
    .Where(e => e.Department == "IT")
    .Sum(e => e.Salary);

// ToList() — execute and return List
var itList = employees.Where(e => e.Department == "IT").ToList();
```

### Day 3 (Evening ~2hrs): Classes and Interfaces

```csharp
public interface IRepository<T>
{
    Task<T?> GetByIdAsync(int id);
    Task<IEnumerable<T>> GetAllAsync();
    Task<T> CreateAsync(T entity);
    Task DeleteAsync(int id);
}

public class User
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;   // = string.Empty avoids null warning
    public string Email { get; set; } = string.Empty;
    public DateTime CreatedAt { get; } = DateTime.UtcNow;  // Read-only

    // Computed property
    public string DisplayName => $"{Name} <{Email}>";
}

// Record — immutable data class (perfect for DTOs)
public record CreateUserDto(string Name, string Email);
public record UserResponse(int Id, string Name, string Email, DateTime CreatedAt);

// Pattern matching — C# superpower
string GetStatusEmoji(OrderStatus status) => status switch
{
    OrderStatus.Pending    => "⏳",
    OrderStatus.Processing => "🔄",
    OrderStatus.Shipped    => "📦",
    OrderStatus.Delivered  => "✅",
    OrderStatus.Cancelled  => "❌",
    _                      => "❓"
};
```

### Weekend Projects

**Project 1: Bank Account (Sat ~2hrs)**
Build a `BankAccount` class with: Deposit/Withdraw methods, transaction history (List), Balance property calculated from transactions, overdraft protection (throws exception), monthly statement using LINQ.

**Project 2: Grade Calculator (Sun ~2hrs)**
Build a `GradeBook` with: Dictionary of students and grades, LINQ for average/highest/lowest, sorted leaderboard, summary string output.

Both on GitHub. These are C# fundamentals interview questions.

---

## Week 19 — C# Advanced Patterns

### Day 1 (Evening ~2hrs): Async/Await

```csharp
// C# async — same concept as TypeScript, different keywords
// Convention: Async methods end with "Async"

async Task<User?> GetUserAsync(int id, CancellationToken ct = default)
{
    var response = await _httpClient.GetAsync($"/api/users/{id}", ct);
    if (!response.IsSuccessStatusCode) return null;
    return await response.Content.ReadFromJsonAsync<User>(cancellationToken: ct);
}

// Parallel — same as Promise.all
var userTask = GetUserAsync(userId, ct);
var ordersTask = GetOrdersAsync(userId, ct);
await Task.WhenAll(userTask, ordersTask);

var user = await userTask;
var orders = await ordersTask;
```

**CancellationToken** — unique to C#, important for APIs. Allows cancelling requests when the client disconnects. Always accept it as the last parameter in async methods, and pass it through to database calls.

### Day 2 (Evening ~2hrs): Generics and Extension Methods

```csharp
// Generic class
public class PagedResult<T>
{
    public IEnumerable<T> Data { get; set; } = Enumerable.Empty<T>();
    public int Total { get; set; }
    public int Page { get; set; }
    public int Limit { get; set; }
    public int TotalPages => (int)Math.Ceiling((double)Total / Limit);
}

// Extension methods — add methods to existing types
public static class StringExtensions
{
    // Adds .ToSlug() to any string
    public static string ToSlug(this string text) =>
        text.ToLower().Replace(" ", "-");

    // Adds .Truncate() to any string
    public static string Truncate(this string text, int maxLength) =>
        text.Length <= maxLength ? text : text[..maxLength] + "...";
}

// Usage — looks like a built-in method
"My Blog Post Title".ToSlug();       // "my-blog-post-title"
"Very long text here".Truncate(10);  // "Very long ..."
```

### Weekend: Data Pipeline Console App

Build a console app that:
1. Reads a CSV file of employees
2. Transforms data using LINQ (filter, group, calculate averages)
3. Generates a formatted console report
4. Writes summary statistics to a JSON file

Practices: File I/O, LINQ complex queries, JSON serialization (`System.Text.Json`), async file operations.

---

## Weeks 20-21 — ASP.NET Core Web API

### Setup

```bash
dotnet new webapi -n EventBookingApi
cd EventBookingApi
dotnet run
# Swagger at: https://localhost:5001/swagger
```

### ASP.NET Core vs NestJS — The Parallels

```
NestJS                  ASP.NET Core
@Controller()      =    [ApiController] + [Route()]
@Get(':id')        =    [HttpGet("{id}")]
@Body()            =    [FromBody]
@Param()           =    [FromRoute]
@Query()           =    [FromQuery]
ValidationPipe     =    Data Annotations + ModelState
@Injectable()      =    Scoped/Transient/Singleton services
```

### Controller

```csharp
[ApiController]
[Route("api/[controller]")]   // Resolves to: api/events
public class EventsController : ControllerBase
{
    private readonly IEventsService _eventsService;

    public EventsController(IEventsService eventsService)
    {
        _eventsService = eventsService;   // Dependency injection
    }

    [HttpGet]
    public async Task<ActionResult<PagedResult<EventDto>>> GetAll(
        [FromQuery] int page = 1,
        [FromQuery] int limit = 20,
        CancellationToken ct = default)
    {
        return Ok(await _eventsService.GetAllAsync(page, limit, ct));
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<EventDto>> GetById(int id, CancellationToken ct)
    {
        var item = await _eventsService.GetByIdAsync(id, ct);
        if (item is null) return NotFound();
        return Ok(item);
    }

    [HttpPost]
    public async Task<ActionResult<EventDto>> Create(CreateEventDto dto, CancellationToken ct)
    {
        var created = await _eventsService.CreateAsync(dto, ct);
        return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
        // Returns 201 Created with Location header pointing to the new resource
    }

    [HttpPut("{id:int}")]
    public async Task<ActionResult<EventDto>> Update(int id, UpdateEventDto dto, CancellationToken ct)
    {
        var updated = await _eventsService.UpdateAsync(id, dto, ct);
        if (updated is null) return NotFound();
        return Ok(updated);
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id, CancellationToken ct)
    {
        var deleted = await _eventsService.DeleteAsync(id, ct);
        if (!deleted) return NotFound();
        return NoContent();   // 204
    }
}
```

### Entity Framework Core

```bash
dotnet add package Microsoft.EntityFrameworkCore
dotnet add package Microsoft.EntityFrameworkCore.Design
dotnet add package Npgsql.EntityFrameworkCore.PostgreSQL
dotnet tool install --global dotnet-ef
```

```csharp
// Event.cs
public class Event
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public DateTime Date { get; set; }
    public string Location { get; set; } = string.Empty;
    public int Capacity { get; set; }
    public decimal Price { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public ICollection<Booking> Bookings { get; set; } = new List<Booking>();
}

// AppDbContext.cs
public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<Event> Events { get; set; }
    public DbSet<Booking> Bookings { get; set; }
    public DbSet<User> Users { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Event>(e => {
            e.HasIndex(x => x.Date);
            e.Property(x => x.Price).HasPrecision(10, 2);
        });
    }
}

// Program.cs — register in DI
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));
```

**Migrations — version control for your schema:**
```bash
dotnet ef migrations add InitialCreate   # Generate migration from entity changes
dotnet ef database update                # Apply to database
dotnet ef migrations list                # See all migrations
```

Much cleaner than NestJS's `synchronize: true` — migrations give you a full history of schema changes.

---

## Week 22 — Event Booking API (Main Project)

A complete, production-grade ASP.NET Core API. Portfolio centerpiece for .NET roles.

### Required Endpoints

```
Auth:
POST /api/auth/register
POST /api/auth/login

Events:
GET    /api/events              — paginated, filter by date/category/location
GET    /api/events/{id}         — event with booking count
POST   /api/events              — create (admin only)
PUT    /api/events/{id}         — update (admin only)
DELETE /api/events/{id}         — delete (admin only)

Bookings:
POST   /api/events/{id}/bookings  — book (auth required, validates capacity)
DELETE /api/bookings/{id}         — cancel own booking
GET    /api/bookings/my           — current user's bookings

Categories:
GET /api/categories
```

### Required Implementation

```bash
# Additional packages
dotnet add package Microsoft.AspNetCore.Authentication.JwtBearer
dotnet add package AutoMapper.Extensions.Microsoft.DependencyInjection
dotnet add package FluentValidation.AspNetCore
dotnet add package Serilog.AspNetCore
```

**Repository pattern:**
```csharp
public interface IEventRepository
{
    Task<Event?> GetByIdAsync(int id, CancellationToken ct = default);
    Task<PagedResult<Event>> GetAllAsync(EventFilterDto filter, CancellationToken ct = default);
    Task<Event> CreateAsync(Event entity, CancellationToken ct = default);
    Task<bool> DeleteAsync(int id, CancellationToken ct = default);
}

public class EventRepository : IEventRepository
{
    private readonly AppDbContext _context;
    public EventRepository(AppDbContext context) { _context = context; }

    public async Task<Event?> GetByIdAsync(int id, CancellationToken ct = default) =>
        await _context.Events
            .Include(e => e.Category)
            .Include(e => e.Bookings)
            .FirstOrDefaultAsync(e => e.Id == id, ct);
}
```

**Register everything in Program.cs:**
```csharp
builder.Services.AddScoped<IEventRepository, EventRepository>();
builder.Services.AddScoped<IEventsService, EventsService>();
builder.Services.AddAutoMapper(typeof(Program));
builder.Services.AddFluentValidationAutoValidation();
```

**Capacity validation in booking service:**
```csharp
public async Task<BookingDto> CreateAsync(int eventId, CreateBookingDto dto, int userId, CancellationToken ct)
{
    var @event = await _eventRepository.GetByIdAsync(eventId, ct)
        ?? throw new NotFoundException($"Event {eventId} not found");

    var bookingCount = @event.Bookings.Count(b => b.Status != BookingStatus.Cancelled);
    if (bookingCount >= @event.Capacity)
        throw new ConflictException("Event is fully booked");

    var booking = new Booking { EventId = eventId, UserId = userId, ... };
    return _mapper.Map<BookingDto>(await _bookingRepository.CreateAsync(booking, ct));
}
```

**Global exception handler middleware:**
```csharp
app.UseExceptionHandler(errorApp =>
{
    errorApp.Run(async context =>
    {
        var exception = context.Features.Get<IExceptionHandlerFeature>()?.Error;
        context.Response.ContentType = "application/json";
        context.Response.StatusCode = exception switch
        {
            NotFoundException => 404,
            ConflictException => 409,
            UnauthorizedException => 401,
            _ => 500
        };
        await context.Response.WriteAsJsonAsync(new {
            status = context.Response.StatusCode,
            message = exception?.Message ?? "Internal server error"
        });
    });
});
```

---

## Week 23 — Azure Deployment & CI/CD

### Azure CLI Setup

```powershell
winget install Microsoft.AzureCLI
az login
```

### Deploy to Azure App Service (Free Tier)

```powershell
# Create resource group
az group create --name rg-eventbooking --location westeurope

# Create App Service Plan (free tier)
az appservice plan create `
  --name plan-eventbooking `
  --resource-group rg-eventbooking `
  --sku F1 `
  --is-linux

# Create Web App
az webapp create `
  --name eventbooking-api-xavier `
  --resource-group rg-eventbooking `
  --plan plan-eventbooking `
  --runtime "DOTNET:9.0"

# Set environment variables
az webapp config appsettings set `
  --name eventbooking-api-xavier `
  --resource-group rg-eventbooking `
  --settings ConnectionStrings__DefaultConnection="your-connection-string" `
             Jwt__Secret="your-jwt-secret"
```

### GitHub Actions CI/CD

Create `.github/workflows/deploy.yml`:

```yaml
name: Build and Deploy

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-dotnet@v4
        with:
          dotnet-version: '9.0.x'
      - run: dotnet restore
      - run: dotnet build --no-restore
      - run: dotnet test --no-build --verbosity normal

  deploy:
    needs: test
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-dotnet@v4
        with:
          dotnet-version: '9.0.x'
      - run: dotnet publish -c Release -o ./publish
      - uses: azure/webapps-deploy@v2
        with:
          app-name: eventbooking-api-xavier
          publish-profile: ${{ secrets.AZURE_PUBLISH_PROFILE }}
          package: ./publish
```

**What this does:** Push to main → run tests → if tests pass → deploy to Azure. Pull requests run tests but don't deploy.

**Get the publish profile:**
```powershell
az webapp deployment list-publishing-profiles `
  --name eventbooking-api-xavier `
  --resource-group rg-eventbooking `
  --xml
# Copy output → GitHub repo Settings → Secrets → AZURE_PUBLISH_PROFILE
```

---

### Phase 5 Complete — Portfolio

1. Bank Account + Grade Calculator (C# fundamentals, interview classics)
2. Data Pipeline console app (LINQ, file I/O, JSON)
3. Event Booking API — full ASP.NET Core, EF Core, JWT, deployed to Azure
4. CI/CD pipeline running on GitHub Actions

**Event Booking API is live on Azure with Swagger docs.** Link it everywhere.

**Next:** Phase6-PowerPlatformWindmill.md — this is where everything assembles.
