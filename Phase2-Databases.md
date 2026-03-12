# Phase 2 — Databases
## Weeks 7-8

**Focus:** PostgreSQL, SQL fundamentals, database design  
**Duration:** 2 weeks | **OS:** Windows

---

## Phase Overview

Week 7 covers SQL and PostgreSQL from the ground up. Week 8 covers database design and connects your Phase 1 Express API to a real database using raw SQL — no ORM yet. TypeORM comes in Phase 4 with NestJS.

By the end you have the database foundation that Phases 4 and 5 build on.

---

## Setup

**PostgreSQL 18** — already installed. Connect:
```powershell
psql -U postgres
# \l = list databases | \c dbname = connect | \dt = list tables | \q = quit
```

**pgAdmin:** Download from pgadmin.org — GUI for inspecting tables and running queries visually.

**VS Code SQLTools extension:** SQLTools + SQLTools PostgreSQL Driver — run queries directly in VS Code without switching to pgAdmin.

---

## Week 7 — SQL & PostgreSQL

**Goal:** Write SQL confidently. Cover the 90% you'll actually use day-to-day.

### Day 1 (Evening ~2hrs): Core SQL

```sql
-- Create database
CREATE DATABASE learning;
\c learning

-- Create a table
CREATE TABLE users (
  id         SERIAL PRIMARY KEY,
  name       VARCHAR(100) NOT NULL,
  email      VARCHAR(255) NOT NULL UNIQUE,
  age        INTEGER,
  role       VARCHAR(20) DEFAULT 'user',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Data types you'll use most:
-- SERIAL          = Auto-incrementing integer (primary keys)
-- INTEGER         = Whole numbers
-- DECIMAL(10,2)   = Precise decimals (use for money — not float!)
-- VARCHAR(n)      = String, max n characters
-- TEXT            = Unlimited string
-- BOOLEAN         = true/false
-- TIMESTAMP       = Date and time
-- JSONB           = JSON as binary (PostgreSQL superpower)
```

### Day 2 (Evening ~2hrs): CRUD in SQL

```sql
-- INSERT
INSERT INTO users (name, email, age, role)
VALUES ('Xavier', 'xavier@example.com', 30, 'admin');

-- Multiple rows at once
INSERT INTO users (name, email, age)
VALUES ('Alice', 'alice@example.com', 25),
       ('Bob', 'bob@example.com', 32);

-- SELECT
SELECT * FROM users;
SELECT name, email FROM users;
SELECT * FROM users WHERE role = 'admin';
SELECT * FROM users WHERE age > 25 AND age < 40;
SELECT * FROM users WHERE name LIKE 'A%';      -- Starts with A
SELECT * FROM users ORDER BY name ASC;
SELECT * FROM users LIMIT 10 OFFSET 20;        -- Pagination: rows 21-30

-- UPDATE (ALWAYS use WHERE — without it you update every row)
UPDATE users SET role = 'admin', age = 31 WHERE email = 'xavier@example.com';

-- DELETE (ALWAYS use WHERE)
DELETE FROM users WHERE id = 5;

-- NULL handling
SELECT * FROM users WHERE age IS NULL;
SELECT name, COALESCE(age, 0) AS age FROM users;  -- Replace NULL with 0
```

### Weekend: Joins and Aggregations

```sql
-- Create orders table
CREATE TABLE orders (
  id         SERIAL PRIMARY KEY,
  user_id    INTEGER NOT NULL REFERENCES users(id),
  total      DECIMAL(10,2) NOT NULL,
  status     VARCHAR(20) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW()
);

-- INNER JOIN — only rows matching in both tables
SELECT u.name, u.email, o.total, o.status
FROM orders o
INNER JOIN users u ON o.user_id = u.id;

-- LEFT JOIN — all users, even those with no orders
SELECT u.name, COUNT(o.id) AS order_count, COALESCE(SUM(o.total), 0) AS total_spent
FROM users u
LEFT JOIN orders o ON o.user_id = u.id
GROUP BY u.id, u.name;

-- Aggregation
SELECT status, COUNT(*) AS count, SUM(total) AS revenue
FROM orders
GROUP BY status;

-- HAVING — filter after grouping (WHERE filters before grouping)
SELECT user_id, COUNT(*) AS order_count
FROM orders
GROUP BY user_id
HAVING COUNT(*) > 2;

-- Subquery
SELECT * FROM users
WHERE id IN (SELECT DISTINCT user_id FROM orders);
```

### Week 7 Project: Library Database

Design and build:
- Tables: `books`, `members`, `loans`
- Write 8 queries: books on loan, overdue items, most popular genre, members with no loans, average loan duration, etc.

---

## Week 8 — Database Design & API Integration

**Goal:** Design databases properly. Connect Phase 1 REST API to PostgreSQL.

### Day 1 (Evening ~2hrs): Design Principles

**Normalization — store each fact once:**

```sql
-- BAD — data repeated in every order row
CREATE TABLE orders_bad (
  customer_name  VARCHAR(100),  -- Repeated per order
  customer_email VARCHAR(255),  -- Repeated per order
  product_name   VARCHAR(100),  -- Changes if product renamed
  quantity       INTEGER
);

-- GOOD — each entity in its own table
CREATE TABLE customers (id SERIAL PRIMARY KEY, name VARCHAR(100), email VARCHAR(255) UNIQUE);
CREATE TABLE products  (id SERIAL PRIMARY KEY, name VARCHAR(100), price DECIMAL(10,2));
CREATE TABLE orders    (id SERIAL PRIMARY KEY, customer_id INTEGER REFERENCES customers(id));
CREATE TABLE order_items (
  id         SERIAL PRIMARY KEY,
  order_id   INTEGER REFERENCES orders(id),
  product_id INTEGER REFERENCES products(id),
  quantity   INTEGER NOT NULL,
  unit_price DECIMAL(10,2) NOT NULL  -- Store price at purchase time
);
```

**Indexes:**
```sql
-- PostgreSQL auto-creates indexes for PRIMARY KEY and UNIQUE
-- Create manually for columns you frequently filter/sort on

CREATE INDEX idx_orders_customer ON orders(customer_id);   -- Always index foreign keys
CREATE INDEX idx_orders_status ON orders(status);          -- Frequently filtered column

-- Check if query uses index
EXPLAIN SELECT * FROM orders WHERE customer_id = 1;
-- Look for "Index Scan" (good) vs "Seq Scan" (scans every row — slow on large tables)
```

### Day 2 (Evening ~2hrs): Node.js + PostgreSQL

```bash
npm install pg
npm install --save-dev @types/pg
```

```typescript
// src/db/connection.ts
import { Pool } from 'pg';

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 5432,
  database: process.env.DB_NAME || 'learning',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'yourpassword',
  max: 10
});

export default pool;

// src/db/query.ts
import pool from './connection';

export async function query<T = unknown>(sql: string, params?: unknown[]): Promise<T[]> {
  const result = await pool.query(sql, params);
  return result.rows as T[];
}

export async function queryOne<T = unknown>(sql: string, params?: unknown[]): Promise<T | null> {
  const rows = await query<T>(sql, params);
  return rows[0] ?? null;
}
```

**CRITICAL — always use parameterized queries:**
```typescript
// NEVER do this — SQL injection vulnerability
const result = await query(`SELECT * FROM users WHERE id = ${id}`);

// ALWAYS do this — PostgreSQL handles escaping
const result = await query('SELECT * FROM users WHERE id = $1', [id]);
```

### Weekend Project: Connect Phase 1 API to PostgreSQL

Replace your Products & Orders API in-memory store with real PostgreSQL.

**Schema:**
```sql
CREATE DATABASE products_api;
\c products_api

CREATE TABLE categories (id SERIAL PRIMARY KEY, name VARCHAR(100) NOT NULL UNIQUE);

CREATE TABLE products (
  id          SERIAL PRIMARY KEY,
  name        VARCHAR(200) NOT NULL,
  description TEXT,
  price       DECIMAL(10,2) NOT NULL CHECK (price > 0),
  stock       INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
  category_id INTEGER REFERENCES categories(id),
  created_at  TIMESTAMP DEFAULT NOW(),
  updated_at  TIMESTAMP DEFAULT NOW()
);

CREATE TABLE orders    (id SERIAL PRIMARY KEY, status VARCHAR(20) DEFAULT 'pending', total DECIMAL(10,2) DEFAULT 0, created_at TIMESTAMP DEFAULT NOW());
CREATE TABLE order_items (id SERIAL PRIMARY KEY, order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE, product_id INTEGER REFERENCES products(id), quantity INTEGER CHECK (quantity > 0), unit_price DECIMAL(10,2));

CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_order_items_order ON order_items(order_id);
```

**Environment variables — .env file (add to .gitignore):**
```
DB_HOST=localhost
DB_PORT=5432
DB_NAME=products_api
DB_USER=postgres
DB_PASSWORD=yourpassword
PORT=3000
```

```bash
npm install dotenv
# First line of server.ts:
import 'dotenv/config';
```

**Service layer pattern:**
```typescript
export class ProductsService {
  async findAll(categoryId?: number): Promise<Product[]> {
    if (categoryId) {
      return query<Product>('SELECT * FROM products WHERE category_id = $1 ORDER BY name', [categoryId]);
    }
    return query<Product>('SELECT * FROM products ORDER BY name');
  }

  async findById(id: number): Promise<Product> {
    const product = await queryOne<Product>('SELECT * FROM products WHERE id = $1', [id]);
    if (!product) throw new NotFoundError(`Product ${id}`);
    return product;
  }

  async create(data: CreateProductDto): Promise<Product> {
    const product = await queryOne<Product>(
      `INSERT INTO products (name, description, price, stock, category_id)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [data.name, data.description, data.price, data.stock, data.categoryId]
    );
    return product!;
  }
}
```

This is now a real application — data persists, multiple clients can connect. Update README with database setup instructions.

### E-Commerce Schema Design

Design a schema for a realistic e-commerce platform:
- Products with categories, images, variants (sizes, colors)
- Users with multiple addresses
- Orders with line items, shipping address, status history
- Product reviews (only from purchasers)
- Discount codes with usage limits

Deliverable: SQL file with CREATE statements, constraints, indexes, and design decision comments. Include 5 sample INSERTs per table. This comes up in interviews — "walk me through a database design."

---

### Week 8 Checkpoint — Phase 2 Complete

- Products API running against PostgreSQL
- All queries parameterized (no string concatenation)
- Schema with foreign keys and indexes
- E-commerce schema on GitHub

**Next:** Phase3-N8nAutomation.md — Docker first, then automation.
