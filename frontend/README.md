# @codaproducteditor/frontend

A Vue.js 3 frontend application built with TypeScript and Tailwind CSS for the Coda Product Editor. This frontend provides a modern, responsive interface for managing digital products with features like search, pagination, sorting, and comprehensive form validation to serve the functions required in the Coda take home assignment.

## Overview

The frontend serves as the user interface for the Product Editor application, providing:

- **Modern UI/UX** with responsive design and intuitive navigation
- **Product Management** with full CRUD operations through forms and cards
- **Advanced Search & Filtering** with real-time search and sorting capabilities
- **Form Validation** with client-side validation using Zod schemas
- **Type Safety** with TypeScript throughout the application
- **Component Architecture** following Vue.js best practices

## Architecture

The frontend follows a **feature-based architecture** pattern organized around business domains.

### Architecture Overview

| Layer          | Purpose                               | Files                            |
| -------------- | ------------------------------------- | -------------------------------- |
| **Pages**      | Route components and page-level logic | `src/features/products/pages/`   |
| **Components** | Reusable UI components                | `src/components/`                |
| **API**        | Data fetching and API integration     | `src/features/products/api/`     |
| **Types**      | TypeScript definitions and schemas    | `src/features/products/types.ts` |
| **Utils**      | Shared utilities and HTTP client      | `src/lib/`                       |
| **Router**     | Navigation and routing logic          | `src/router/`                    |

## Project Structure

```
frontend/
├── src/
│   ├── main.ts                     # Application entry point
│   ├── App.vue                     # Root component
│   ├── style.css                   # Global styles
│   ├── config/
│   │   └── index.ts               # Environment configuration
│   ├── components/                 # Reusable UI components
│   │   ├── buttons/
│   │   │   ├── BaseButton.vue     # Base button component
│   │   │   └── BaseButton.test.ts # Button component tests
│   │   ├── layout/
│   │   │   ├── BaseHeader.vue     # Application header
│   │   │   ├── NotFound.vue       # 404 page component
│   │   │   └── *.test.ts          # Layout component tests
│   │   ├── modals/
│   │   │   ├── BaseModal.vue      # Base modal component
│   │   │   ├── ConfirmationModal.vue # Confirmation dialog
│   │   │   └── *.test.ts          # Modal component tests
│   │   └── searchBar/
│   │       ├── BaseSearchBar.vue  # Search input component
│   │       └── BaseSearchBar.test.ts # Search component tests
│   ├── features/                   # Feature-based modules
│   │   └── products/              # Product management feature
│   │       ├── api/               # API layer and composables
│   │       │   ├── api.ts         # API configuration
│   │       │   ├── schemas/       # Request/response validation
│   │       │   │   └── productSchema.ts
│   │       │   ├── useGetProducts.ts      # Get products composable
│   │       │   ├── useGetProductById.ts   # Get single product composable
│   │       │   ├── usePostProduct.ts      # Create product composable
│   │       │   ├── usePatchProduct.ts     # Update product composable
│   │       │   ├── useDeleteProduct.ts    # Delete product composable
│   │       │   └── *.test.ts              # API composable tests
│   │       ├── components/        # Product-specific components
│   │       │   ├── ProductCard.vue        # Product display card
│   │       │   ├── ProductForm.vue        # Product form component
│   │       │   ├── ProductDetailsSection.vue # Product details display
│   │       │   └── *.test.ts              # Component tests
│   │       ├── pages/             # Route components
│   │       │   ├── ProductsList.vue       # Products listing page
│   │       │   ├── ProductDetails.vue     # Product details page
│   │       │   ├── CreateProduct.vue      # Create product page
│   │       │   └── *.test.ts              # Page component tests
│   │       ├── testing/
│   │       │   └── mock.ts                # Mock data for tests
│   │       └── types.ts                   # Product type definitions
│   ├── lib/                        # Shared utilities
│   │   ├── http.ts                 # HTTP client configuration
│   │   ├── useBaseApi.ts           # Base API composable
│   │   └── *.test.ts               # Utility tests
│   ├── router/
│   │   ├── index.ts                # Router configuration
│   │   └── index.test.ts           # Router tests
│   └── assets/
│       ├── icons/                  # SVG icons
│       └── vue.svg                 # Vue logo
├── public/
│   └── vite.svg                    # Public assets
├── index.html                      # HTML template
├── vite.config.ts                  # Vite build configuration
├── vitest.config.ts                # Test configuration
├── tsconfig.json                   # TypeScript configuration
├── tsconfig.app.json               # App-specific TypeScript config
├── tsconfig.node.json              # Node-specific TypeScript config
└── package.json                    # Dependencies and scripts
```

## Quick Start

### Prerequisites

- **Node.js** >= 18.0.0
- **npm** >= 8.0.0

### Environment Configuration

Create a `.env.local` file in the frontend directory (optional, defaults to localhost:3001):

```bash
# API Configuration
VITE_API_URL=http://localhost:3001
```

### Installation

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be available at `http://localhost:5173` by default

## Testing

### Test Structure

The frontend includes comprehensive tests at all layers using Vitest and Vue Test Utils:

- **Component Tests**: Individual Vue components with user interactions
- **Page Tests**: Full page component testing with routing
- **API Tests**: Composables and data fetching logic
- **Integration Tests**: Component integration and user workflows

### Running Tests

```bash
# Run all tests
npm run test

# Run tests once (CI / workspace mode)
npm run test:bg

# Run tests with coverage
npm run test -- --coverage
```

## Application Features

### Pages & Routes

| Route                | Component      | Description                                      |
| -------------------- | -------------- | ------------------------------------------------ |
| `/`                  | ProductsList   | Main products listing with search and pagination |
| `/products`          | ProductsList   | Alternative route to products listing            |
| `/products/:id`      | ProductDetails | View individual product details                  |
| `/products/:id/edit` | ProductDetails | Edit existing product                            |
| `/products/create`   | CreateProduct  | Create new product form                          |
| `/*`                 | NotFound       | 404 error page                                   |

### Key Components

| Component         | Purpose                     | Features                                     |
| ----------------- | --------------------------- | -------------------------------------------- |
| **ProductCard**   | Display product information | Image, title, description, actions           |
| **ProductForm**   | Product creation/editing    | Validation, character counts, error handling |
| **BaseSearchBar** | Search functionality        | Real-time search, debounced input            |
| **BaseModal**     | Modal dialogs               | Confirmation dialogs, overlays               |
| **BaseButton**    | Consistent button styling   | Variants, sizes, loading states              |

### API Integration

The frontend uses Vue 3 Composition API with custom composables for data fetching:

- **useGetProducts**: Fetch paginated products with search/sort options
- **useGetProductById**: Fetch single product by ID
- **usePostProduct**: Create new product
- **usePatchProduct**: Update existing product
- **useDeleteProduct**: Delete product with confirmation

## Development

### Available Scripts

| Script            | Description                              |
| ----------------- | ---------------------------------------- |
| `npm run dev`     | Start development server with hot reload |
| `npm run build`   | Build for production with optimization   |
| `npm run preview` | Preview production build locally         |
| `npm run test`    | Run tests in watch mode                  |
| `npm run test:bg` | Run tests once and exit                  |

### Development Workflow

1. **Start Development Server**

   ```bash
   npm run dev
   ```

2. **Make Changes**

   - Edit Vue/TypeScript files in `src/`
   - Hot reload automatically updates the browser

3. **Run Tests**

   ```bash
   npm run test
   ```

4. **Build for Production**

   ```bash
   npm run build
   npm run preview
   ```

### Key Technologies

- **Vue 3** - Progressive JavaScript framework with Composition API
- **TypeScript** - Type-safe development with full IntelliSense
- **Tailwind CSS 4** - Utility-first CSS framework for styling
- **Vue Router 4** - Official router for single-page applications
- **Vite** - Fast build tool with instant hot reload
- **Vitest** - Fast unit testing framework
- **Zod** - TypeScript-first schema validation

## API Configuration

The frontend communicates with the backend API through a centralized HTTP client:

### Environment Variables

| Variable       | Default               | Description          |
| -------------- | --------------------- | -------------------- |
| `VITE_API_URL` | http://localhost:3001 | Backend API base URL |

## Form Validation

The application uses Zod for comprehensive form validation:

- **Real-time validation** with immediate feedback
- **Field-level validation** with specific error messages
- **Cross-field validation** for complex business rules
- **Character counting** for text areas with limits
- **URL validation** for web links and images

## Responsive Design

The application is fully responsive using Tailwind CSS:

- **Mobile-first** approach with progressive enhancement
- **Flexible grid** layouts that adapt to screen size
- **Touch-friendly** interactions for mobile devices
- **Consistent spacing** and typography across breakpoints

## Production Build

### Build Process

```bash
# Build optimized production bundle
npm run build

# Preview production build locally
npm run preview
```

## Contributing

### Development Guidelines

1. **Component Structure**

   - Use Vue 3 Composition API
   - Follow single-file component pattern
   - Include TypeScript types for all props and emits

2. **Testing**

   - Write tests for all components and composables
   - Test user interactions and edge cases
   - Maintain test coverage above 90%

3. **Styling**
   - Use Tailwind CSS utility classes
   - Follow consistent spacing and color schemes
   - Ensure responsive design principles

### Code Style

- Use TypeScript strict mode
- Follow Vue.js style guide recommendations
- Use descriptive component and variable names
- Add JSDoc comments for complex functions

---

_This frontend demonstrates modern Vue.js development practices with TypeScript, comprehensive testing, and responsive design principles._
