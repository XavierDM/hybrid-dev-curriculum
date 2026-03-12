# Phase 4 — NestJS/TypeScript Backend
## Weeks 12-17

**Focus:** Enterprise TypeScript backend with NestJS  
**Duration:** 6 weeks | **Prerequisites:** Phases 1-3 complete

---

## Phase Overview

NestJS is the TypeScript framework in Belgian enterprise job listings. It brings Angular-style architecture to the backend — modules, dependency injection, decorators.

Your Express knowledge (Phase 1) makes NestJS click faster — you know the HTTP layer already. Your Docker knowledge (Phase 3) feeds into Week 16 deployment.

**What you'll build:**
- Weeks 12-14: Task Manager API (CRUD, TypeORM, JWT auth)
- Weeks 15-16: Blog API (advanced features, Docker deployment)
- Week 17: NestJS API ↔ n8n integration

---

## Week 12 — NestJS Fundamentals

### Setup
```bash
npm i -g @nestjs/cli
nest new task-manager
cd task-manager
npm run start:dev   # Hot reload at http://localhost:3000
```

### Core Architecture

```
Module     = Feature container (groups related code)
Controller = Handles HTTP requests
Service    = Business logic
```

```typescript
// app.module.ts — root module
@Module({
  imports: [TasksModule, UsersModule, AuthModule],
})
export class AppModule {}

// tasks.module.ts
@Module({
  controllers: [TasksController],
  providers: [TasksService],
  exports: [TasksService],
})
export class TasksModule {}
```

**Controller:**
```typescript
@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}
  // ^ NestJS provides TasksService automatically (dependency injection)

  @Get()          findAll() { return this.tasksService.findAll(); }
  @Get(':id')     findOne(@Param('id') id: string) { return this.tasksService.findOne(+id); }
  @Post()         create(@Body() dto: CreateTaskDto) { return this.tasksService.create(dto); }
  @Patch(':id')   update(@Param('id') id: string, @Body() dto: UpdateTaskDto) { return this.tasksService.update(+id, dto); }
  @Delete(':id')  remove(@Param('id') id: string) { return this.tasksService.remove(+id); }
}
```

**What's different from Express:** No `req`/`res` everywhere. `@Body()` instead of `req.body`. Return values auto-serialized to JSON.

### DTOs and Validation

```bash
npm install class-validator class-transformer
```

```typescript
export enum TaskStatus { OPEN = 'OPEN', IN_PROGRESS = 'IN_PROGRESS', DONE = 'DONE' }

export class CreateTaskDto {
  @IsString() @IsNotEmpty() @MinLength(3)
  title: string;

  @IsString() @IsOptional()
  description?: string;
}
```

**Enable globally in main.ts:**
```typescript
app.useGlobalPipes(new ValidationPipe({
  whitelist: true,           // Strip extra properties
  forbidNonWhitelisted: true, // Error on extra properties
  transform: true            // Auto-convert types
}));
```

Invalid requests now automatically return 400 with clear error messages.

### Service with Exception Handling

```typescript
@Injectable()
export class TasksService {
  private tasks: Task[] = [];

  findOne(id: number): Task {
    const task = this.tasks.find(t => t.id === id);
    if (!task) throw new NotFoundException(`Task #${id} not found`);
    // NestJS automatically returns 404 JSON
    return task;
  }
}

// Built-in HTTP exceptions:
throw new NotFoundException('not found');    // 404
throw new BadRequestException('bad input');  // 400
throw new UnauthorizedException('login');    // 401
throw new ConflictException('duplicate');    // 409
```

### Weekend: Task Manager v1 + Swagger

```bash
npm install @nestjs/swagger swagger-ui-express
```

```typescript
// main.ts
const config = new DocumentBuilder().setTitle('Task Manager').setVersion('1.0').build();
SwaggerModule.setup('api', app, SwaggerModule.createDocument(app, config));
// Docs at: http://localhost:3000/api
```

---

## Week 13 — TypeORM + PostgreSQL

```bash
npm install @nestjs/typeorm typeorm pg
```

```typescript
// app.module.ts
TypeOrmModule.forRoot({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'task_manager',
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'yourpassword',
  entities: [__dirname + '/**/*.entity{.ts,.js}'],
  synchronize: true,  // Dev only — auto-creates tables
})
```

**Entity:**
```typescript
@Entity('tasks')
export class Task {
  @PrimaryGeneratedColumn() id: number;
  @Column({ length: 200 }) title: string;
  @Column({ type: 'enum', enum: TaskStatus, default: TaskStatus.OPEN }) status: TaskStatus;
  @CreateDateColumn() createdAt: Date;
  @UpdateDateColumn() updatedAt: Date;
}
```

**Service with repository:**
```typescript
@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
  ) {}

  async findAll(): Promise<Task[]> {
    return this.taskRepository.find({ order: { createdAt: 'DESC' } });
  }

  async create(dto: CreateTaskDto): Promise<Task> {
    const task = this.taskRepository.create(dto);
    return this.taskRepository.save(task);
  }
}
```

**Weekend:** Add User entity, relate tasks to users, use QueryBuilder for complex queries.

---

## Week 14 — JWT Authentication

```bash
npm install @nestjs/jwt @nestjs/passport passport passport-jwt bcrypt
npm install --save-dev @types/passport-jwt @types/bcrypt
```

**Auth flow:**
1. Register → hash password → save → return JWT
2. Login → verify password → return JWT
3. Request → JWT in Authorization header → Guard validates → allowed/rejected

```typescript
@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const hashed = await bcrypt.hash(dto.password, 12);
    const user = await this.usersService.create({ ...dto, password: hashed });
    return { access_token: this.jwtService.sign({ sub: user.id, email: user.email }) };
  }

  async login(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user || !await bcrypt.compare(password, user.password)) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return { access_token: this.jwtService.sign({ sub: user.id, email: user.email }) };
  }
}
```

**Protect routes:**
```typescript
@UseGuards(JwtAuthGuard)
@Controller('tasks')
export class TasksController { ... }  // All routes protected

// Get current user
@Get()
findAll(@CurrentUser() user: User) {
  return this.tasksService.findAll(user.id);
}
```

---

## Week 15 — Blog API

Second, more complex API. Introduces pagination — a pattern you'll use everywhere.

```typescript
export class PaginateDto {
  @IsOptional() @Type(() => Number) @IsInt() @Min(1) page = 1;
  @IsOptional() @Type(() => Number) @IsInt() @Min(1) @Max(100) limit = 20;
}

async findAll(dto: PaginateDto) {
  const [posts, total] = await this.postRepository.findAndCount({
    skip: (dto.page - 1) * dto.limit,
    take: dto.limit,
    order: { createdAt: 'DESC' },
    relations: ['author', 'tags']
  });
  return { data: posts, meta: { total, page: dto.page, limit: dto.limit, totalPages: Math.ceil(total / dto.limit) } };
}
```

---

## Week 16 — Testing & Docker Deployment

**Unit test:**
```typescript
describe('TasksService', () => {
  it('throws NotFoundException for missing task', async () => {
    repository.findOne.mockResolvedValue(null);
    await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
  });
});
```

**Dockerfile (multi-stage):**
```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine AS production
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY --from=builder /app/dist ./dist
EXPOSE 3000
CMD ["node", "dist/main.js"]
```

**docker-compose.yml:**
```yaml
version: '3.8'
services:
  api:
    build: .
    ports: ["3000:3000"]
    environment:
      DB_HOST: postgres
      DB_NAME: task_manager
      JWT_SECRET: your-secret
    depends_on: [postgres]
  postgres:
    image: postgres:16-alpine
    environment:
      POSTGRES_DB: task_manager
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
    volumes: [postgres_data:/var/lib/postgresql/data]
volumes:
  postgres_data:
```

```powershell
docker-compose up --build   # Build and start everything
docker-compose down         # Stop everything
```

---

## Week 17 — NestJS ↔ n8n Integration

**The hybrid integration made concrete:**

**API triggers n8n when something happens:**
```typescript
async create(dto: CreateTaskDto, user: User): Promise<Task> {
  const task = await this.taskRepository.save(this.taskRepository.create({ ...dto, user }));

  // Notify n8n — don't fail the request if n8n is down
  this.httpService.post('http://localhost:5678/webhook/task-created', {
    taskId: task.id, title: task.title, userId: user.id
  }).toPromise().catch(err => console.warn('n8n notification failed:', err.message));

  return task;
}
```

**n8n calls your API:**
```javascript
// In n8n Code node
const response = await $http.get({
  url: 'http://localhost:3000/api/tasks',
  headers: { 'Authorization': `Bearer ${$credentials.apiToken}` }
});

const overdueTasks = response.data.filter(t =>
  t.status !== 'DONE' && new Date(t.dueDate) < new Date()
);
return [{ json: { overdueTasks, count: overdueTasks.length } }];
```

**Build a real workflow:** Daily task digest — Schedule trigger → Call your API → Filter due/overdue → Format → Discord. This workflow demonstrates your hybrid stack to any interviewer.

---

### Phase 4 Complete — Portfolio

1. Task Manager API — NestJS, TypeORM, JWT, tests, Docker Compose
2. Blog API — pagination, relations
3. Integration workflow — NestJS + n8n working together

All deployed via Docker Compose. All on GitHub with READMEs.

**Next:** Phase5-DotNet.md
