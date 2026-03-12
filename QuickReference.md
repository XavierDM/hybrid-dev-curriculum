# Quick Reference
## n8n Patterns · JavaScript/TypeScript · Common Snippets

---

## n8n Patterns

### Accessing Data

```javascript
// Current node input
$input.all()              // All items as array
$input.first()            // First item
$input.first().json       // First item's data

// Specific previous node
$node["Node Name"].json   // Single output item
$node["Node Name"].all()  // Multiple output items

// Workflow variables
$vars.variableName        // Workflow-level variables
$env.ENV_VAR_NAME         // Environment variables
```

### Returning Data

```javascript
// Single item
return [{ json: { key: 'value' } }];

// Multiple items (n8n processes each separately)
return [
  { json: { id: 1, name: 'First' } },
  { json: { id: 2, name: 'Second' } },
];

// Pass binary data (files)
return [{
  binary: { data: buffer },
  json: { fileName: 'report.xlsx', rowCount: 42 }
}];
```

### Common Transformations

```javascript
// Filter items
const items = $input.all();
const active = items.filter(item => item.json.status === 'active');
return active;

// Map / transform
const transformed = $input.all().map(item => ({
  json: {
    id: item.json.id,
    displayName: `${item.json.firstName} ${item.json.lastName}`,
    domain: item.json.email.split('@')[1]
  }
}));
return transformed;

// Merge two nodes into one item
const users = $node["Fetch Users"].json;
const orders = $node["Fetch Orders"].json;

const merged = users.map(user => ({
  ...user,
  orders: orders.filter(o => o.userId === user.id),
  orderCount: orders.filter(o => o.userId === user.id).length
}));

return [{ json: { users: merged } }];

// Aggregate to summary
const items = $input.all();
const summary = {
  total: items.length,
  byStatus: items.reduce((acc, item) => {
    const s = item.json.status;
    acc[s] = (acc[s] || 0) + 1;
    return acc;
  }, {}),
  totalValue: items.reduce((sum, item) => sum + (item.json.amount || 0), 0)
};
return [{ json: summary }];
```

### Date Handling (Belgian Context)

```javascript
// ISO format (for APIs and storage)
new Date().toISOString()                   // "2025-03-12T09:00:00.000Z"

// Belgian date format
new Date().toLocaleDateString('fr-BE')     // "12/03/2025"
new Date().toLocaleString('fr-BE')         // "12/03/2025, 09:00:00"

// Parse and format
const date = new Date(row.dateString);
const formatted = date.toLocaleDateString('fr-BE');

// Add days
const future = new Date();
future.setDate(future.getDate() + 7);

// Calculate workdays between two dates
function countWorkdays(start, end) {
  let count = 0;
  const current = new Date(start);
  const endDate = new Date(end);
  while (current <= endDate) {
    if (current.getDay() !== 0 && current.getDay() !== 6) count++;
    current.setDate(current.getDate() + 1);
  }
  return count;
}
```

### Safe Property Access

```javascript
// Always use optional chaining for external API data
const name = data?.user?.profile?.name ?? 'Unknown';
const city = data?.address?.city ?? 'No city';

// Parse numbers safely
const amount = parseFloat(String(row.amount ?? '0').replace(/[€$,]/g, ''));

// Trim and normalize strings
const status = row.status?.toLowerCase().trim() ?? 'unknown';
const name = `${row.firstName ?? ''} ${row.lastName ?? ''}`.trim();
```

### Error Handling in Code Nodes

```javascript
try {
  const result = doSomethingRisky();
  return [{ json: { success: true, data: result } }];
} catch (error) {
  // Option 1: Return error as data (workflow continues)
  return [{ json: { success: false, error: error.message } }];

  // Option 2: Throw to stop workflow and trigger error handling
  throw new Error(`Processing failed: ${error.message}`);
}
```

### HTTP Requests in Code Nodes

```javascript
// GET request
const response = await $http.get({
  url: 'https://api.example.com/data',
  headers: { 'Authorization': 'Bearer TOKEN' }
});
const data = response.data;

// POST request
const response = await $http.post({
  url: 'https://api.example.com/items',
  headers: { 'Content-Type': 'application/json' },
  body: { name: 'value' }
});
```

### Cron Quick Reference

```
* * * * *
│ │ │ │ └── Day of week (0=Sun, 1=Mon ... 6=Sat)
│ │ │ └──── Month (1-12)
│ │ └────── Day of month (1-31)
│ └──────── Hour (0-23)
└────────── Minute (0-59)

Common schedules:
0 9 * * 1-5     = 9am Monday–Friday
0 8 * * *       = Every day at 8am
0 18 * * 5      = Friday at 6pm
*/30 * * * *    = Every 30 minutes
0 0 * * *       = Midnight every day
0 9 * * 1       = Every Monday at 9am
```

---

## JavaScript/TypeScript Snippets

### Array Methods Cheat Sheet

```typescript
const arr = [1, 2, 3, 4, 5];

arr.map(x => x * 2)           // [2,4,6,8,10]     — transform each
arr.filter(x => x > 2)        // [3,4,5]           — keep matching
arr.reduce((sum, x) => sum + x, 0)  // 15          — accumulate
arr.find(x => x > 3)          // 4                 — first match (or undefined)
arr.findIndex(x => x > 3)     // 3                 — index of first match
arr.some(x => x > 4)          // true              — any match?
arr.every(x => x > 0)         // true              — all match?
arr.includes(3)               // true              — contains?
arr.flat()                    // flatten one level
arr.flatMap(x => [x, x * 2]) // map then flatten
[...new Set(arr)]             // remove duplicates
arr.slice(1, 3)               // [2,3]             — extract without mutating
arr.splice(1, 2)              // removes from original (mutating — avoid)
```

### Object Utilities

```typescript
// Clone (shallow)
const clone = { ...original };

// Clone with override
const updated = { ...original, role: 'admin', updatedAt: new Date() };

// Pick specific keys
function pick<T, K extends keyof T>(obj: T, keys: K[]): Pick<T, K> {
  return Object.fromEntries(keys.map(k => [k, obj[k]])) as Pick<T, K>;
}

// Omit specific keys
function omit<T, K extends keyof T>(obj: T, keys: K[]): Omit<T, K> {
  const result = { ...obj };
  keys.forEach(k => delete result[k]);
  return result as Omit<T, K>;
}

// Check if object is empty
const isEmpty = Object.keys(obj).length === 0;

// Get all entries with types
Object.entries(obj).forEach(([key, value]) => { ... });
```

### Async Patterns

```typescript
// Promise.all — parallel, fails if any fails
const [users, orders] = await Promise.all([fetchUsers(), fetchOrders()]);

// Promise.allSettled — parallel, doesn't fail even if some fail
const results = await Promise.allSettled([fetchA(), fetchB(), fetchC()]);
const succeeded = results.filter(r => r.status === 'fulfilled').map(r => r.value);
const failed = results.filter(r => r.status === 'rejected');

// Retry with exponential backoff
async function retry<T>(fn: () => Promise<T>, maxAttempts = 3): Promise<T> {
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      if (attempt === maxAttempts) throw error;
      await new Promise(r => setTimeout(r, 1000 * attempt)); // 1s, 2s, 3s
    }
  }
  throw new Error('Unreachable');
}

// Timeout wrapper
function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  const timeout = new Promise<never>((_, reject) =>
    setTimeout(() => reject(new Error(`Timeout after ${ms}ms`)), ms)
  );
  return Promise.race([promise, timeout]);
}
```

### TypeScript Utility Types Cheat Sheet

```typescript
interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'user';
}

Partial<User>                   // All fields optional
Required<User>                  // All fields required
Readonly<User>                  // All fields read-only
Pick<User, 'id' | 'name'>       // Only id and name
Omit<User, 'password'>          // Everything except password
Record<string, User>            // { [key: string]: User }
Exclude<'a' | 'b' | 'c', 'a'>  // 'b' | 'c'
Extract<'a' | 'b' | 'c', 'a' | 'b'>  // 'a' | 'b'
ReturnType<typeof someFunction> // Whatever someFunction returns
Parameters<typeof someFunction> // Tuple of function parameters
NonNullable<string | null>      // string
```

---

## NestJS Quick Reference

### Decorators Cheat Sheet

```typescript
// Controller
@Controller('users')              // Base route
@Controller({ path: 'users', version: '1' })

// Route handlers
@Get()  @Post()  @Put()  @Patch()  @Delete()
@Get(':id')                       // Route parameter

// Parameters
@Param('id') id: string           // Route param
@Body() dto: CreateUserDto        // Request body
@Query('page') page: string       // Query param
@Headers('authorization') auth    // Header
@Request() req                    // Full request object

// Guards and interceptors
@UseGuards(JwtAuthGuard)          // Apply auth guard
@UseGuards(RolesGuard)
@Roles('admin')                   // Custom role decorator

// Response
@HttpCode(201)                    // Override status code
@Header('Cache-Control', 'none')  // Set response header
```

### Common Patterns

```typescript
// Custom decorator for current user
export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) =>
    ctx.switchToHttp().getRequest().user
);

// Use it:
@Get('profile')
getProfile(@CurrentUser() user: User) { return user; }

// Pagination DTO
export class PaginateDto {
  @IsOptional() @Type(() => Number) @IsInt() @Min(1) page = 1;
  @IsOptional() @Type(() => Number) @IsInt() @Min(1) @Max(100) limit = 20;
}

// Service pagination
async findAll(dto: PaginateDto) {
  const [data, total] = await this.repo.findAndCount({
    skip: (dto.page - 1) * dto.limit,
    take: dto.limit,
    order: { createdAt: 'DESC' }
  });
  return { data, meta: { total, page: dto.page, limit: dto.limit, totalPages: Math.ceil(total / dto.limit) } };
}
```

---

## ASP.NET Core Quick Reference

### Common Return Types

```csharp
return Ok(data);              // 200 with body
return Created(url, data);    // 201 with Location header
return CreatedAtAction(nameof(GetById), new { id }, data);  // 201
return NoContent();           // 204
return BadRequest(errors);    // 400
return Unauthorized();        // 401
return Forbid();              // 403
return NotFound();            // 404
return Conflict(message);     // 409
return StatusCode(500, msg);  // Custom status
```

### LINQ Cheat Sheet

```csharp
// Filtering
list.Where(x => x.Age > 18)
list.First(x => x.Id == id)                // Throws if not found
list.FirstOrDefault(x => x.Id == id)       // Returns null if not found
list.Single(x => x.Email == email)         // Throws if 0 or 2+ found
list.Any(x => x.IsActive)                  // bool — any match?
list.All(x => x.IsActive)                  // bool — all match?
list.Count(x => x.IsActive)               // int — count matches

// Transforming
list.Select(x => x.Name)
list.Select(x => new { x.Id, x.Name })
list.SelectMany(x => x.Tags)               // Flatten nested collections

// Sorting
list.OrderBy(x => x.Name)
list.OrderByDescending(x => x.CreatedAt)
list.ThenBy(x => x.Name)                   // Secondary sort

// Aggregating
list.Sum(x => x.Amount)
list.Average(x => x.Score)
list.Min(x => x.Price)
list.Max(x => x.Price)

// Grouping
list.GroupBy(x => x.Department)
    .Select(g => new { Dept = g.Key, Count = g.Count(), Avg = g.Average(x => x.Salary) })

// Pagination
list.Skip((page - 1) * limit).Take(limit)

// Execute
list.ToList()       // Execute and return List<T>
list.ToArray()      // Execute and return T[]
list.ToDictionary(x => x.Id, x => x)  // Execute and return Dictionary
```

---

## Docker Quick Reference

```powershell
# Containers
docker ps                          # Running containers
docker ps -a                       # All containers
docker start/stop/restart name     # Manage container
docker rm name                     # Remove stopped container
docker rm -f name                  # Force remove (even if running)
docker logs name --tail 50 -f      # Tail logs live

# Images
docker images                      # List images
docker pull image:tag               # Download image
docker rmi image                   # Remove image
docker build -t myapp .            # Build from Dockerfile

# Exec into container
docker exec -it container_name sh  # Open shell

# Volumes
docker volume ls                   # List volumes
docker volume inspect volume_name  # Details

# Compose
docker-compose up --build          # Build and start
docker-compose up -d               # Start detached
docker-compose down                # Stop and remove containers
docker-compose logs -f service     # Tail service logs
```

---

## Git Quick Reference

```bash
git status                         # What's changed
git add .                          # Stage all changes
git add file.ts                    # Stage specific file
git commit -m "feat: add user auth"
git push origin main

git pull origin main               # Get latest
git fetch --all                    # Fetch without merging

# Branches
git checkout -b feature/name       # Create and switch
git checkout main                  # Switch to main
git merge feature/name             # Merge into current

# Undo
git restore file.ts                # Discard file changes
git reset HEAD~1                   # Undo last commit (keep changes)
git reset --hard HEAD~1            # Undo last commit (discard changes)

# Useful
git log --oneline -10              # Last 10 commits one-liner
git diff                           # See unstaged changes
git stash                          # Save changes temporarily
git stash pop                      # Restore stashed changes
```

### Commit Message Convention (Use This)

```
feat: add user authentication
fix: handle null response from GitHub API
docs: update README with setup instructions
refactor: extract validation to separate module
test: add unit tests for TasksService
chore: update dependencies
```

---

## Ports Used in This Curriculum

```
3000  = NestJS API (dev)
5001  = ASP.NET Core API (dev, HTTPS)
5432  = PostgreSQL
5433  = PostgreSQL in Docker (to avoid conflict with local)
5678  = n8n
8000  = Windmill
```
