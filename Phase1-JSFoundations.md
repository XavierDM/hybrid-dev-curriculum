# Phase 1 — JavaScript/TypeScript Foundations
## Weeks 1-6

**Focus:** Modern JavaScript and TypeScript from your existing foundation  
**Duration:** 6 weeks | **Hours/week:** 15-20 | **OS:** Windows

---

## Phase Overview

Your JS assessment confirmed you're at intermediate level — the concepts are there, the modern patterns need sharpening. Weeks 1-6 cover ES6+ deeply, TypeScript's type system thoroughly, and builds to a complete REST API by Week 6.

No Python. TypeScript is your scripting language going forward.

**Portfolio output:**
- Week 2: Type-safe utility library (TypeScript)
- Week 4: Multi-source API fetcher (GitHub + weather)
- Week 6: Full REST API with Express + validation

---

## Week 1 — JavaScript ES6+ Refresh

**Goal:** Modern JS syntax becomes automatic. By end of week you write clean ES6+ without thinking.

### Day 1 (Evening ~2hrs): Arrays & Objects

```javascript
// The three array methods you'll use constantly

// map — transform every item, return new array
const numbers = [1, 2, 3, 4, 5];
const doubled = numbers.map(n => n * 2);  // [2, 4, 6, 8, 10]

// filter — keep items that pass the test
const evens = numbers.filter(n => n % 2 === 0);  // [2, 4]

// reduce — accumulate to a single value
const sum = numbers.reduce((total, n) => total + n, 0);  // 15

// Chain them
const result = numbers
  .filter(n => n > 2)
  .map(n => n * 10)
  .reduce((sum, n) => sum + n, 0);  // 120
```

Destructuring:
```javascript
// Array destructuring
const [first, second, ...rest] = [1, 2, 3, 4, 5];
// first=1, second=2, rest=[3,4,5]

// Object destructuring
const user = { name: 'Xavier', age: 30, city: 'Waregem' };
const { name, city } = user;

// Destructuring in function parameters
function greet({ name, city }) {
  return `${name} from ${city}`;
}
```

Spread and rest:
```javascript
// Merge arrays
const combined = [...arr1, ...arr2];

// Clone and modify an object (immutable pattern — use this everywhere)
const original = { name: 'Xavier', role: 'developer' };
const updated = { ...original, role: 'senior developer' };
// original unchanged

// Rest parameters
function logAll(first, ...others) {
  console.log('First:', first);
  console.log('Others:', others);
}
```

**Day 1 exercise:** Write a function that takes an array of employee objects (`{ name, salary, department }`) and returns the total salary for a given department. Use filter + reduce. No loops.

---

### Day 2 (Evening ~2hrs): Async/Await Properly

```javascript
// Always use try/catch with async
async function fetchUser(id) {
  try {
    const response = await fetch(`https://api.example.com/users/${id}`);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error('Failed:', error.message);
    return null;
  }
}

// Parallel async — don't await sequentially when not needed
// Slow (2 seconds if each takes 1s):
const user = await fetchUser(1);
const posts = await fetchPosts(1);

// Fast (1 second total):
const [user, posts] = await Promise.all([fetchUser(1), fetchPosts(1)]);
```

**Day 2 exercise:** Fetch your GitHub profile from `https://api.github.com/users/XavierDM` and return a summary with just: name, public_repos, followers, created_at. Handle errors gracefully.

---

### Weekend (Sat ~3hrs + Sun ~3hrs): Closures, Modules, Modern Patterns

**Saturday — Closures:**
```javascript
function makeCounter(start = 0) {
  let count = start;
  return {
    increment: () => ++count,
    decrement: () => --count,
    value: () => count,
    reset: () => { count = start; }
  };
}
// State without classes — you'll see this in React hooks
```

ES Modules:
```javascript
// math.js
export function add(a, b) { return a + b; }
export default function multiply(a, b) { return a * b; }

// importing
import multiply, { add } from './math.js';
import * as math from './math.js';
```

**Saturday project:** Build a `dataUtils.js` module with: `groupBy(array, key)`, `sortBy(array, key, direction)`, `uniqueBy(array, key)`. Test against an array of 10 employee objects.

**Sunday — Optional chaining and nullish coalescing:**
```javascript
// Optional chaining — safe property access
const city = user?.profile?.address?.city;  // undefined, not crash

// Nullish coalescing — default only for null/undefined
const city = user?.profile?.address?.city ?? 'Unknown';

// vs || which catches empty string and 0 too
const name = '' ?? 'Default';  // '' (keeps empty string)
const name = '' || 'Default';  // 'Default' (might not want this)
```

**Sunday project:** Write `safeGet(object, path)` that safely accesses nested properties via dot-notation: `safeGet(user, 'profile.address.city')`.

---

### Week 1 Checkpoint
- Array methods (map/filter/reduce) without looking them up
- Async functions with error handling and parallel requests
- Can explain what a closure is and write one

---

## Week 2 — TypeScript Fundamentals

**Goal:** TypeScript stops feeling like extra work and starts feeling like a safety net.

### Setup
```bash
mkdir ts-utils && cd ts-utils
npm init -y
npm install typescript --save-dev
npx tsc --init
```

**tsconfig.json:**
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "strict": true,
    "outDir": "./dist",
    "rootDir": "./src"
  }
}
```

### Day 1 (Evening ~2hrs): The Type System

```typescript
// TypeScript infers types
let name = 'Xavier';   // TypeScript knows: string
name = 42;             // Error: number not assignable to string

// Interfaces — the backbone of TypeScript
interface User {
  id: number;
  name: string;
  email: string;
  age?: number;        // Optional
  readonly createdAt: Date;  // Can't change after creation
}

function createUser(data: User): User {
  return data;
}

createUser({
  id: '1',         // Error: string not assignable to number
  name: 'Xavier'   // Error: missing required field 'email'
});
```

Type aliases and union types:
```typescript
type Status = 'active' | 'inactive' | 'pending';  // Only these values allowed

type ApiResponse<T> = {
  data: T;
  status: number;
  message: string;
};

type UserResponse = ApiResponse<User>;
type UsersResponse = ApiResponse<User[]>;
```

**Day 1 exercise:** Define interfaces for a simple e-commerce system: `Product`, `CartItem`, `Order`, `Customer`.

---

### Day 2 (Evening ~2hrs): Generics

```typescript
// Write once, use with any type
function first<T>(arr: T[]): T {
  return arr[0];
}

first([1, 2, 3]);        // Returns number
first(['a', 'b', 'c']);  // Returns string

// Generic interfaces
interface Repository<T> {
  findById(id: number): T | null;
  findAll(): T[];
  save(entity: T): T;
  delete(id: number): void;
}
```

**Day 2 exercise:** Write a generic `Stack<T>` class with push, pop, peek, and isEmpty.

---

### Weekend Project: Type-Safe Utility Library

Build a `utils.ts` library you'll reuse throughout the curriculum:

```typescript
// groupBy
export function groupBy<T>(array: T[], key: keyof T): Record<string, T[]> {
  return array.reduce((groups, item) => {
    const groupKey = String(item[key]);
    return { ...groups, [groupKey]: [...(groups[groupKey] || []), item] };
  }, {} as Record<string, T[]>);
}

// chunk
export function chunk<T>(array: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
}

// retry async
export async function retry<T>(
  fn: () => Promise<T>,
  attempts = 3,
  delay = 1000
): Promise<T> {
  for (let i = 0; i < attempts; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === attempts - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  throw new Error('Unreachable');
}

// debounce
export function debounce<T extends (...args: unknown[]) => unknown>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timer: ReturnType<typeof setTimeout>;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}
```

Push to GitHub. Portfolio item #1.

---

## Week 3 — TypeScript Advanced Patterns

**Goal:** The TypeScript patterns you'll encounter in NestJS and PCF.

### Day 1: Utility Types

```typescript
interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'user';
}

type UserUpdate = Partial<User>;           // All optional
type PublicUser = Pick<User, 'id' | 'name' | 'role'>;  // Select fields
type UserWithoutPassword = Omit<User, 'password'>;      // Exclude fields
type ImmutableUser = Readonly<User>;      // Nothing can change
type UserMap = Record<string, User>;      // Typed key-value map
```

These come up constantly in NestJS DTOs. You'll use `Omit` and `Pick` to create `CreateUserDto` and `UpdateUserDto` from your base `User` interface.

### Day 2: Custom Error Classes

```typescript
class AppError extends Error {
  constructor(
    message: string,
    public statusCode = 500,
    public code = 'INTERNAL_ERROR'
  ) {
    super(message);
    this.name = 'AppError';
  }
}

class NotFoundError extends AppError {
  constructor(resource: string) {
    super(`${resource} not found`, 404, 'NOT_FOUND');
  }
}

class ValidationError extends AppError {
  constructor(message: string) {
    super(message, 400, 'VALIDATION_ERROR');
  }
}

// Catch meaningfully
try {
  const user = await findUser(999);
} catch (error) {
  if (error instanceof NotFoundError) {
    res.status(404).json({ message: error.message });
  } else {
    res.status(500).json({ message: 'Internal server error' });
  }
}
```

### Weekend: Result Pattern & Extended Utils

```typescript
// Result pattern — alternative to try/catch at call sites
type Result<T, E = Error> = 
  | { success: true; data: T }
  | { success: false; error: E };

async function safeFind(id: number): Promise<Result<User>> {
  try {
    const user = await findUser(id);
    return { success: true, data: user };
  } catch (error) {
    return { success: false, error: error as Error };
  }
}

// Usage — no try/catch needed
const result = await safeFind(1);
if (result.success) {
  console.log(result.data.name);
} else {
  console.log(result.error.message);
}
```

Extend your utility library with Result type, tryCatch wrapper, and memoize function. Update the README.

---

## Week 4 — External APIs & Data Fetching

**Goal:** Fetch from real APIs confidently, handle failures cleanly.

### Typed HTTP Client

```typescript
class HttpClient {
  constructor(
    private baseUrl: string,
    private defaultHeaders: Record<string, string> = {}
  ) {}

  private async request<T>(method: string, path: string, body?: unknown): Promise<T> {
    const response = await fetch(`${this.baseUrl}${path}`, {
      method,
      headers: { 'Content-Type': 'application/json', ...this.defaultHeaders },
      body: body ? JSON.stringify(body) : undefined
    });
    if (!response.ok) throw new AppError(`HTTP ${response.status}`, response.status);
    return response.json() as Promise<T>;
  }

  get<T>(path: string): Promise<T> { return this.request<T>('GET', path); }
  post<T>(path: string, body: unknown): Promise<T> { return this.request<T>('POST', path, body); }
}

// Typed GitHub client
interface GitHubUser { login: string; name: string; public_repos: number; }
interface GitHubRepo { name: string; stargazers_count: number; language: string; }

class GitHubClient extends HttpClient {
  constructor(token?: string) {
    super('https://api.github.com', {
      ...(token && { Authorization: `token ${token}` }),
      'User-Agent': 'XavierDM-curriculum'
    });
  }
  getUser(username: string): Promise<GitHubUser> {
    return this.get<GitHubUser>(`/users/${username}`);
  }
  getRepos(username: string): Promise<GitHubRepo[]> {
    return this.get<GitHubRepo[]>(`/users/${username}/repos`);
  }
}
```

### Weekend Project: Multi-Source Data Fetcher

Fetch from GitHub + OpenWeatherMap (Waregem) in parallel, combine into a typed summary object, save to JSON. Practice: parallel requests, typed responses, graceful partial failures.

---

## Week 5 — Express.js Fundamentals

**Goal:** Build a proper HTTP server. Understand request-response before NestJS abstracts it.

### Setup
```bash
mkdir express-api && cd express-api
npm init -y
npm install express
npm install --save-dev typescript @types/express @types/node ts-node nodemon
```

### Core Patterns

```typescript
import express, { Request, Response, NextFunction } from 'express';
const app = express();
app.use(express.json());

// Route handler
app.get('/users/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const user = await findUser(Number(id));
    res.json(user);
  } catch (error) {
    if (error instanceof NotFoundError) {
      res.status(404).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'Internal server error' });
    }
  }
});

// Middleware
function authenticate(req: Request, res: Response, next: NextFunction) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token' });
  next();
}

// Router — organize by feature
import { Router } from 'express';
const router = Router();
router.get('/', getAllUsers);
router.get('/:id', getUserById);
router.post('/', createUser);
app.use('/api/users', router);
```

---

## Week 6 — REST API Project

**Goal:** A complete, production-patterned REST API. Portfolio item #2.

### Project: Products & Orders API

```
GET    /api/products           — list (with filtering)
GET    /api/products/:id       — single product
POST   /api/products           — create (validation required)
PUT    /api/products/:id       — update
DELETE /api/products/:id       — delete
GET    /api/orders             — list orders
POST   /api/orders             — create (validates stock)
GET    /api/orders/:id         — order with products
PATCH  /api/orders/:id/status  — update status
```

**Required:** Request validation | Consistent error responses | TypeScript interfaces for all shapes | Organized folder structure | README with curl examples

**Folder structure:**
```
src/
  controllers/   routes/   services/
  types/         middleware/   data/
  app.ts         server.ts
```

Uses **in-memory storage** — you'll connect it to PostgreSQL in Phase 2. Clean TypeScript architecture now means the database layer slots in cleanly later.

Push to GitHub with README. Portfolio item #2.

---

### Week 6 Checkpoint — Phase 1 Complete

Ready for Phase 2 if:
- REST API running, all endpoints working
- TypeScript strict mode, no `any`
- Organized folder structure
- Consistent error JSON responses
- README with setup + curl examples

**Take a day off. Phase 2 starts with databases.**

---

## package.json Pattern (All Phase 1 Projects)

```json
{
  "scripts": {
    "dev": "nodemon --exec ts-node src/server.ts",
    "build": "tsc",
    "start": "node dist/server.js"
  }
}
```

## tsconfig.json (All Phase 1 Projects)

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "outDir": "./dist",
    "rootDir": "./src"
  }
}
```

---

**Next:** Phase2-Databases.md
