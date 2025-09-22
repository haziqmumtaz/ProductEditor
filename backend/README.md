# @codaproducteditor/backend

A Node.js backend API built with Koa.js and TypeScript for the Coda Product Editor application. This backend provides a complete RESTful API for managing digital products with advanced features like pagination, sorting, search, and comprehensive validation to serve the functions required in the coda take home assignment.

## Overview

The backend serves as the data layer for the Product Editor application, providing:

- **RESTful API** with full CRUD operations for products
- **Advanced Querying** with pagination, sorting, and search capabilities
- **Type Safety** with TypeScript and Zod validation
- **File-based Storage** using JSON for simplicity and portability
- **Comprehensive Testing** with 95%+ test coverage
- **Clean Architecture** following separation of concerns principles

## Architecture

The backend follows a **layered architecture** pattern where every layer has only one file per use case which in our example is Product for now.

### Layers Overview

| Layer           | Purpose                                        | Files              |
| --------------- | ---------------------------------------------- | ------------------ |
| **HTTP**        | Request/Response handling, routing, validation | `src/http/`        |
| **Service**     | Business logic, orchestration, error handling  | `src/service/`     |
| **Repository**  | Data access, persistence operations            | `src/repository/`  |
| **Utils**       | Helper functions, utilities                    | `src/utils/`       |
| **Types**       | Model and type definitions                     | `src/types/`       |
| **Middlewares** | Cross-cutting concerns (logging, errors)       | `src/middlewares/` |

## Project Structure

```
backend/
├── src/
│   ├── app.ts                    # Koa application setup and middleware
│   ├── server.ts                 # Server entry point
│   ├── config/
│   │   └── index.ts             # Environment configuration
│   ├── http/                    # HTTP layer
│   │   ├── index.ts            # Router exports
│   │   ├── products.ts         # Product routes and controllers
│   │   ├── products.test.ts    # HTTP layer tests
│   │   └── schemas/
|   |       ├── core.ts          # Core shared schemas
│   │       └── products-schema.ts # Request/response validation
│   ├── service/                 # Service layer
│   │   ├── products-service.ts  # Product business logic
│   │   └── products-service.test.ts # Service layer tests
│   ├── repository/              # Repository layer
│   │   ├── products-repository.ts # Data access layer
│   │   └── products-repository.test.ts # Repository tests
│   ├── middlewares/             # Middleware functions
│   │   ├── errorHandler.ts      # Error handling middleware
│   │   └── logging.ts           # Request logging middleware
│   ├── types/                   # TypeScript definitions
│   │   └── core.ts              # Core domain types
│   ├── utils/                   # Utility functions
│   │   ├── file-database.ts    # File-based database utilities
│   │   ├── file-database.test.ts
│   │   └── generateId.ts       # ID generation utility
│   └── testing/                 # Test utilities and mocks
│       └── repositories/
│           └── products-repository.ts # Test repository factory
├── data/
│   └── products.json           # JSON data storage
├── tsconfig.json              # TypeScript configuration
└── package.json               # Dependencies and scripts
```

## Quick Start

### Prerequisites

- **Node.js** >= 18.0.0
- **npm** >= 8.0.0

### Environment Configuration

Create a `.env` file in the backend directory (this is not a necessary step as we default to port 3001 when no env exists):

```bash
# Server Configuration
PORT=3001
```

### Installation

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Start development server
npm run dev
```

The API will be available at `http://localhost:3001` by default

### Health Check

```bash
curl http://localhost:3001/api/health
```

## Testing

### Test Structure

The backend includes comprehensive tests at all layers. We are using vitest as the testing library and supertest for http request mocking

- **Unit Tests**: Individual functions and classes
- **Integration Tests**: API endpoints with mocked dependencies
- **Repository Tests**: Data access layer with test data

### Running Tests

```bash
# Run all tests
npm run test

# Run tests once (CI / workspace mode)
npm run test:bg

```

## API Documentation

### Base URL

```
http://localhost:3001/api
```

### Authentication

Currently no authentication is required (development setup).

### Content Type

All requests and responses use `application/json`.

### Error Responses

All errors follow a consistent format with the relevant error code:

```json
{
  "error": "Error message"
}
```

### Success Responses

Successful responses return the requested data directly:

```json
{
  "id": 1,
  "name": "LivU",
  "gvtId": 1001
  // ... other product fields
}
```

Paginated success responses return the requested data in the following structure:

```json
{
  data: T[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}
```

## API Endpoints

### Products

| Method   | Endpoint            | Description             | Parameters               | Response Type |
| -------- | ------------------- | ----------------------- | ------------------------ | ------------- |
| `GET`    | `/api/products`     | Get paginated products  | Query params (see below) |               |
| `GET`    | `/api/products/:id` | Get product by ID       | `id` (path parameter)    |               |
| `POST`   | `/api/products`     | Create new product      | Product data in body     |               |
| `PATCH`  | `/api/products/:id` | Update existing product | `id` + Product data      |               |
| `DELETE` | `/api/products/:id` | Delete product          | `id` (path parameter)    |               |

### Query Parameters (GET /api/products)

| Parameter   | Type   | Default | Description                                       |
| ----------- | ------ | ------- | ------------------------------------------------- |
| `page`      | number | 1       | Page number (1-based)                             |
| `limit`     | number | 10      | Items per page (1-100)                            |
| `sortBy`    | string | "id"    | Sort field: `id`, `gvtId`, `name`, `productTitle` |
| `sortOrder` | string | "asc"   | Sort direction: `asc`, `desc`                     |
| `search`    | string | ""      | Search in `name` and `productTitle`               |

### Example Requests

#### Get Products with Pagination

```bash
curl "http://localhost:3001/api/products?page=1&limit=5&sortBy=name&sortOrder=asc"
```

#### Search Products

```bash
curl "http://localhost:3001/api/products?search=livu&page=1&limit=10"
```

#### Get Single Product

```bash
curl "http://localhost:3001/api/products/1"
```

#### Create Product

```bash
curl -X POST "http://localhost:3001/api/products" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "New Product",
    "gvtId": 1009,
    "productTagline": "A great product",
    "shortDescription": "Short description",
    "longDescription": "Long description",
    "logoLocation": "https://example.com/logo.png",
    "productUrl": "https://example.com",
    "voucherTypeName": "Gift Card",
    "orderUrl": "https://example.com/order",
    "productTitle": "New Product Title",
    "variableDenomPriceMinAmount": "10.00",
    "variableDenomPriceMaxAmount": "100.00",
    "__typename": "ProductInfo"
  }'
```

#### Update Product

```bash
curl -X PATCH "http://localhost:3001/api/products/1" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Updated Product Name",
    // ... other fields to update
  }'
```

#### Delete Product

```bash
curl -X DELETE "http://localhost:3001/api/products/1"
```

## Development

### Available Scripts

| Script            | Description                              |
| ----------------- | ---------------------------------------- |
| `npm run dev`     | Start development server with hot reload |
| `npm run build`   | Build TypeScript to JavaScript           |
| `npm run start`   | Start production server                  |
| `npm run test`    | Run tests in watch mode                  |
| `npm run test:bg` | Run tests once and exit                  |

### Development Workflow

1. **Start Development Server**

   ```bash
   npm run dev
   ```

2. **Make Changes**

   - Edit TypeScript files in `src/`
   - Server automatically restarts on changes

3. **Run Tests**

   ```bash
   npm run test
   ```
