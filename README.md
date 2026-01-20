# PantryPal: Your Smart Kitchen Assistant 🏠

A comprehensive pantry management application that helps you track ingredients, manage recipes, create shopping lists, and optimize your kitchen operations with intelligent cost calculations and expiration tracking.

![PantryPal Logo](public/favicon.svg)

## 🌟 What is PantryPal?

PantryPal is a modern web application designed to revolutionize how you manage your kitchen. It combines the functionality of a digital pantry, recipe manager, and smart shopping assistant into one intuitive platform. Whether you're a home cook, meal planner, or someone who wants to reduce food waste, PantryPal helps you keep track of what you have, what you need, and how much it costs.

## ✨ Key Features

### 🥫 **Smart Pantry Management**
- **Inventory Tracking**: Add, edit, and remove pantry items with quantities, units, and categories
- **Expiration Monitoring**: Automatic tracking of expiration dates with visual warnings
- **Price Management**: Track item costs and update prices easily
- **Category Organization**: Organize items by categories (Dairy, Fresh Produce, Dry Goods, etc.)
- **Location Tracking**: Store items in different locations (Pantry, Refrigerator, Freezer, etc.)

### 🍳 **Intelligent Recipe Management**
- **Recipe Creation**: Build recipes with step-by-step instructions and ingredient lists
- **Smart Ingredient Autocomplete**: Auto-suggest ingredients from your pantry and common items
- **Real-time Cost Calculation**: See recipe costs as you add ingredients with proportional pricing
- **Inventory Integration**: Check if you have ingredients before cooking
- **Cook Recipe Feature**: Automatically deduct ingredients when cooking
- **Expiration Awareness**: Warn about expiring ingredients and allow proceeding if desired

### 🛒 **Smart Shopping Lists**
- **Intelligent Autocomplete**: Suggests items from your pantry and common shopping items
- **Purchase Confirmation**: When marking items off, confirm quantity and price
- **Automatic Pantry Addition**: Add purchased items directly to your pantry
- **Price Tracking**: Update item prices when shopping
- **Category Auto-fill**: Automatically categorize items based on suggestions

### 💰 **Cost Management**
- **Proportional Pricing**: Calculate costs based on actual quantities needed (not full unit prices)
- **Unit Conversions**: Smart conversion between different units (cups, tablespoons, pounds, etc.)
- **Per-serving Costs**: See cost breakdown per serving for recipes
- **Estimated Costs**: Fallback pricing for items not in your pantry
- **Budget Tracking**: Monitor total costs and available vs. missing ingredient costs

### 🔍 **Advanced Features**
- **Search & Filter**: Find items quickly with advanced filtering options
- **Expiration Alerts**: Get notified about items expiring soon
- **Dietary Preferences**: Mark recipes as vegetarian, vegan, or non-vegetarian
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Real-time Updates**: Instant updates across all components

## 🛠️ Technologies Used

### **Frontend Framework**
- **Next.js 15.1.5**: React framework for production with App Router
- **React 18**: Modern React with hooks and functional components
- **TypeScript**: Type-safe development for better code quality

### **UI Components & Styling**
- **shadcn/ui**: Modern, accessible component library
- **Tailwind CSS**: Utility-first CSS framework for rapid styling
- **Lucide React**: Beautiful, customizable icons
- **Sonner**: Elegant toast notifications

### **State Management**
- **Zustand**: Lightweight state management
- **React Hooks**: useState, useEffect, useCallback, useMemo for local state

### **Data Management**
- **In-Memory Storage**: Temporary data storage with sample data
- **API Routes**: Next.js API routes for future database integration
- **Custom Hooks**: usePantryItems, useRecipes, useShoppingList for data operations
- **TypeScript Interfaces**: Strong typing for all data structures
- **Database Ready**: Prisma schema and service layer for easy database integration

### **Development Tools**
- **ESLint**: Code linting and quality enforcement
- **Prettier**: Code formatting
- **Jest**: Unit testing framework
- **TypeScript**: Static type checking

### **Build & Deployment**
- **Vite**: Fast build tool (via Next.js)
- **PostCSS**: CSS processing
- **Autoprefixer**: CSS vendor prefixing

## 🎨 Favicon & Branding

PantryPal includes a custom favicon designed to represent the application's core purpose - managing your kitchen pantry. The favicon features:

- **🏠 House Design**: Represents the home kitchen environment
- **🥫 Pantry Shelves**: Symbolizes food storage and organization
- **🎨 Warm Colors**: Amber (#f59e0b) with brown accents for a welcoming feel
- **📏 Optimized Size**: 32x32 pixels for crisp display in browser tabs

### Favicon Files
- `public/favicon.svg` - Vector format (recommended for modern browsers)
- `public/favicon.ico` - Traditional format (for older browsers)
- `public/favicon-converter.html` - Tool to convert between formats

### Converting to ICO Format
If you need the traditional ICO format:
1. Open `public/favicon-converter.html` in your browser
2. Follow the instructions to convert the SVG to ICO
3. Replace the placeholder favicon.ico file

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn package manager
- (Optional) Database server (PostgreSQL, MySQL, or SQLite)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/pantrypal.git
   cd pantrypal
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables**
   ```bash
   # Copy the example environment file
   cp env.example .env.local
   
   # Edit .env.local with your configuration
   # See Database Integration section below for details
   ```

4. **Start the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000) to see PantryPal in action!

## 🗄️ Database Integration

PantryPal supports both demo data mode (default) and real database integration. The application automatically detects which mode to use based on your environment configuration.

### Demo Data Mode (Default)

By default, PantryPal runs in demo data mode, which uses in-memory storage with sample data. This is perfect for:
- Development and testing
- Quick demos
- Users who don't need persistent storage

**No additional setup required!** Just run `npm run dev` and start using the app.

### Real Database Mode

To use a real database for persistent storage:

#### 1. **Choose Your Database**

PantryPal supports multiple database types:

**SQLite (Recommended for development)**
```bash
# No additional setup needed - SQLite is included
DATABASE_URL="file:./dev.db"
```

**PostgreSQL**
```bash
# Install PostgreSQL and create a database
DATABASE_URL="postgresql://username:password@localhost:5432/pantrypal"
```

**MySQL**
```bash
# Install MySQL and create a database
DATABASE_URL="mysql://username:password@localhost:3306/pantrypal"
```

#### 2. **Configure Environment Variables**

Create or update your `.env.local` file:

```bash
# Set to 'true' to use real database instead of demo data
USE_REAL_DB=true

# Database connection string
DATABASE_URL="file:./dev.db"  # SQLite
# DATABASE_URL="postgresql://username:password@localhost:5432/pantrypal"  # PostgreSQL
# DATABASE_URL="mysql://username:password@localhost:3306/pantrypal"  # MySQL

# Next.js Configuration
NEXTAUTH_SECRET=your-secret-key-here
NEXTAUTH_URL=http://localhost:3000
```

#### 3. **Set Up the Database**

```bash
# Generate Prisma client
npm run db:generate

# Push the schema to your database
npm run db:push

# (Optional) Open Prisma Studio to view/edit data
npm run db:studio
```

#### 4. **Verify Database Connection**

The application will automatically detect your database mode:
- **Demo mode**: Console shows "🔧 Using demo data mode"
- **Real database mode**: Console shows "🗄️ Using real database mode"

### Database Schema

PantryPal uses the following database schema:

```sql
-- Pantry Items
CREATE TABLE pantry_items (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  quantity REAL NOT NULL,
  unit TEXT NOT NULL,
  category TEXT NOT NULL,
  expiration_date DATETIME NOT NULL,
  location TEXT,
  price REAL,
  notes TEXT,
  calories REAL,
  protein REAL,
  carbs REAL,
  fat REAL,
  serving_size TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Recipes
CREATE TABLE recipes (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  instructions TEXT NOT NULL,
  servings INTEGER NOT NULL,
  prep_time INTEGER NOT NULL,
  cook_time INTEGER NOT NULL,
  dietary_type TEXT NOT NULL,
  dietary_restrictions TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Recipe Ingredients
CREATE TABLE recipe_ingredients (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  quantity REAL NOT NULL,
  unit TEXT NOT NULL,
  optional BOOLEAN DEFAULT FALSE,
  recipe_id TEXT,
  pantry_item_id TEXT,
  FOREIGN KEY (recipe_id) REFERENCES recipes(id) ON DELETE CASCADE,
  FOREIGN KEY (pantry_item_id) REFERENCES pantry_items(id) ON DELETE SET NULL
);

-- Shopping List Items
CREATE TABLE shopping_list_items (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  quantity REAL NOT NULL,
  unit TEXT NOT NULL,
  category TEXT NOT NULL,
  price REAL,
  is_checked BOOLEAN DEFAULT FALSE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Users (for future authentication)
CREATE TABLE users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### Migration from Demo to Real Database

If you've been using demo data and want to migrate to a real database:

1. **Set up your database** (follow steps above)
2. **Export demo data** (if needed):
   ```bash
   # The demo data is already in the database service
   # You can copy it manually or use Prisma Studio
   npm run db:studio
   ```
3. **Switch to real database mode**:
   ```bash
   # Update .env.local
   USE_REAL_DB=true
   DATABASE_URL="your-database-url"
   ```
4. **Restart the application**:
   ```bash
   npm run dev
   ```

### Database Management Commands

```bash
# Generate Prisma client (required after schema changes)
npm run db:generate

# Push schema changes to database
npm run db:push

# Open Prisma Studio (database GUI)
npm run db:studio

# Reset database (development only)
npm run db:reset

# Create a new migration
npx prisma migrate dev --name your-migration-name
```

### Troubleshooting Database Issues

**Common Issues:**

1. **"Prisma client not available"**
   ```bash
   npm run db:generate
   ```

2. **"PrismaClient is unable to run in this browser environment"**
   - This is expected in static export builds
   - The app automatically uses demo data in browser environments
   - No action needed - this is working as designed

3. **"Database connection failed"**
   - Check your `DATABASE_URL` in `.env.local`
   - Ensure your database server is running
   - Verify credentials and permissions

4. **"Schema out of sync"**
   ```bash
   npm run db:push
   ```

5. **"Demo data not loading"**
   - Check that `USE_REAL_DB` is not set to `true`
   - Clear browser cache and restart the app

**Getting Help:**
- Check the console for error messages
- Verify your environment variables
- Ensure all dependencies are installed
- Try running in demo mode first to isolate issues

### Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server

# Code Quality
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint issues
npm run type-check   # Run TypeScript type checking

# Testing
npm run test         # Run Jest tests
npm run test:watch   # Run tests in watch mode
npm run test:coverage # Run tests with coverage

## 🧪 Testing

PantryPal includes comprehensive test coverage using Jest and React Testing Library.

### Test Structure

```
_tests_/
├── components/           # Component tests
│   └── pantry/
│       └── item-card.test.tsx
├── lib/
│   ├── hooks/           # Hook tests
│   │   ├── usePantryItems.test.tsx
│   │   ├── useRecipes.test.tsx
│   │   └── useShoppingLists.test.tsx
│   └── services/        # Service tests
│       └── api.test.ts
```

### Running Tests

```bash
# Run all tests
npm run test

# Run tests in watch mode (development)
npm run test:watch

# Run tests with coverage report
npm run test:coverage

# Run specific test file
npm test -- item-card.test.tsx

# Run tests matching a pattern
npm test -- --testNamePattern="ItemCard"
```

### Test Coverage

The test suite covers:

- **Components**: Rendering, user interactions, props handling
- **Hooks**: State management, side effects, error handling
- **Services**: API calls, database operations, error scenarios
- **Utilities**: Helper functions, data transformations

### Writing Tests

**Component Test Example:**
```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { ItemCard } from '@/components/pantry/item-card';

describe('ItemCard', () => {
  it('renders item information correctly', () => {
    render(<ItemCard item={mockItem} onEdit={jest.fn()} onDelete={jest.fn()} />);
    expect(screen.getByText('Test Item')).toBeInTheDocument();
  });
});
```

**Hook Test Example:**
```typescript
import { renderHook, act } from '@testing-library/react';
import { usePantryItems } from '@/lib/hooks/usePantryItems';

describe('usePantryItems', () => {
  it('should load initial items', async () => {
    const { result } = renderHook(() => usePantryItems());
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });
    expect(result.current.items).toBeDefined();
  });
});
```

### Mocking

Tests use comprehensive mocking for:
- Database services
- API calls
- Toast notifications
- React hooks and stores

### Continuous Integration

Tests run automatically on:
- Pull requests
- Main branch pushes
- Release builds

# Database (if using Prisma)
npm run db:generate  # Generate Prisma client
npm run db:push      # Push schema to database
npm run db:studio    # Open Prisma Studio
```

## 🚀 Deployment

PantryPal is configured for **static export deployment** with mock data, making it perfect for portfolio showcases and demo deployments. The application also preserves API routes for future server deployment when you're ready to integrate a real database.

### Current Configuration: Static Export

The project is configured for static export with the following setup:

```javascript
// next.config.js
output: 'export'  // Creates static files
trailingSlash: true
skipTrailingSlashRedirect: true
```

```typescript
// All API routes configured for static export:
export const dynamic = 'force-static';
export const revalidate = false;
```

### ✅ What This Achieves

- **Static export** for free hosting and portfolio deployment
- **API routes preserved** for future server deployment
- **Mock data** works perfectly for demo purposes
- **Zero configuration** needed for deployment
- **Zero server costs** for hosting

### 🎯 Deployment Options

#### Option 1: Static Export (Current - Recommended for Demo)

**Perfect for:** Portfolio, demo, free hosting

**Deploy to:**
- **Vercel** (recommended) - Automatic deployment from GitHub
- **Netlify** - Connect repository and deploy
- **GitHub Pages** - Free static hosting
- **Any static hosting platform**

**Steps:**
1. Push your code to GitHub
2. Connect to your preferred hosting platform
3. Deploy automatically - no additional configuration needed

#### Option 2: Server Deployment (Future - For Real Database)

**Perfect for:** Production with real database

**Deploy to:**
- **Vercel** (server mode)
- **Railway**
- **Heroku**
- **Self-hosted**

**Migration Steps:**
1. Remove static export configuration from `next.config.js`
2. Remove static config from API routes
3. Set up database and environment variables
4. Deploy to server platform

### 📁 Build Output

After `npm run build`, you'll get:
```
out/
├── index.html
├── _next/
├── api/
└── ... (all static files)
```

### 🔄 Migration Path

When you're ready to use a real database:

1. **Remove static export:**
   ```javascript
   // next.config.js - Remove these lines:
   output: 'export'
   trailingSlash: true
   skipTrailingSlashRedirect: true
   ```

2. **Remove static config from API routes:**
   ```typescript
   // Remove from all API routes:
   // export const dynamic = 'force-static';
   // export const revalidate = false;
   ```

3. **Set up database:**
   ```bash
   npm run db:generate
   npm run db:push
   ```

4. **Configure environment:**
   ```bash
   USE_REAL_DB=true
   DATABASE_URL="your-database-url"
   ```

5. **Deploy to server platform**

### 🎉 Current Status: Ready for Demo Deployment!

✅ **Build successful**  
✅ **API routes preserved**  
✅ **Mock data working**  
✅ **Ready for any static hosting**  
✅ **Zero server costs**  
✅ **Perfect for portfolio**  

Your app is **production-ready for demo deployment** with the flexibility to easily switch to server deployment when needed!

For detailed deployment instructions, see [DEPLOYMENT.md](DEPLOYMENT.md).

## �� Project Structure

```
PantryPal/
├── app/                          # Next.js App Router
│   ├── api/                     # API routes
│   │   ├── pantry/              # Pantry items API
│   │   │   └── route.ts         # CRUD operations for pantry items
│   │   ├── recipes/             # Recipes API
│   │   │   └── route.ts         # CRUD operations for recipes
│   │   └── shopping-list/       # Shopping list API
│   │       └── route.ts         # CRUD operations for shopping list
│   ├── globals.css              # Global styles
│   ├── layout.tsx               # Root layout component
│   ├── page.tsx                 # Main application page
│   └── providers.tsx            # Context providers
│
├── components/                   # React components
│   ├── layout/                  # Layout components
│   │   └── header.tsx          # Application header
│   ├── pantry/                  # Pantry-related components
│   │   ├── item-card.tsx       # Individual pantry item display
│   │   ├── item-form.tsx       # Add/edit pantry item form
│   │   ├── pantry-tab.tsx      # Main pantry tab component
│   │   ├── recipe-card.tsx     # Individual recipe display
│   │   ├── recipe-form.tsx     # Add recipe form with autocomplete
│   │   ├── recipe-edit-form.tsx # Edit recipe form
│   │   ├── recipes-tab.tsx     # Recipes tab component
│   │   ├── shopping-list.tsx   # Shopping list component
│   │   ├── shopping-list-form.tsx # Add shopping item form
│   │   └── ...                 # Other pantry components
│   └── ui/                      # Reusable UI components (shadcn/ui)
│       ├── button.tsx          # Button component
│       ├── dialog.tsx          # Dialog/modal component
│       ├── input.tsx           # Input field component
│       └── ...                 # Other UI components
│
├── lib/                         # Utility libraries
│   ├── config/                  # Configuration files
│   │   └── database.ts         # Database configuration
│   ├── hooks/                   # Custom React hooks
│   │   ├── usePantryItems.ts   # Pantry items management
│   │   ├── useRecipes.ts       # Recipes management
│   │   └── useShoppingList.ts  # Shopping list management
│   ├── services/               # Service layer
│   │   ├── database.ts         # Database service (demo + real DB)
│   │   └── api.ts              # API service functions
│   ├── utils/                  # Utility functions
│   │   └── recipe-utils.ts     # Recipe-specific utilities
│   └── utils.ts                # General utilities
│
├── types/                       # TypeScript type definitions
│   ├── pantry.ts               # Pantry-related types
│   └── recipe.ts               # Recipe-related types
│
├── _tests_/                     # Test files
│   └── lib/                    # Library tests
│       └── hooks/              # Hook tests
│
├── public/                      # Static assets
│   ├── favicon.svg             # Application favicon (SVG format)
│   ├── favicon.ico             # Application favicon (ICO format - placeholder)
│   └── favicon-converter.html  # Tool to convert SVG to ICO
│
├── prisma/                      # Database schema (if using Prisma)
│   └── schema.prisma           # Database schema definition
│
├── package.json                 # Dependencies and scripts
├── tailwind.config.ts          # Tailwind CSS configuration
├── tsconfig.json               # TypeScript configuration
├── jest.config.js              # Jest testing configuration
└── README.md                   # This file
```

## 🎯 Core Features Explained

### **Smart Autocomplete System**
The autocomplete system combines data from your pantry and a curated list of common items:
- **Pantry Integration**: Shows items you already have with current quantities
- **Common Items**: Suggests frequently used items with proper units and categories
- **Smart Filtering**: Excludes expired items from suggestions
- **Auto-fill**: Click any suggestion to populate name, unit, and category

### **Intelligent Cost Calculation**
PantryPal uses sophisticated unit conversion and proportional pricing:
- **Unit Conversions**: Handles weight (grams, pounds, ounces) and volume (cups, tablespoons, etc.)
- **Proportional Pricing**: Calculates costs based on actual quantities needed
- **Fallback Estimates**: Uses market prices for items not in your pantry
- **Real-time Updates**: Costs update instantly as you modify ingredients

### **Expiration Management**
Comprehensive expiration tracking to reduce food waste:
- **Visual Warnings**: Color-coded expiration status
- **Smart Filtering**: Excludes expired items from available inventory
- **Flexible Cooking**: Option to proceed with expiring items if desired
- **Time-based Alerts**: Warns about items expiring within 3 days

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

### Development Workflow
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **shadcn/ui** for the beautiful component library
- **Lucide** for the amazing icons
- **Tailwind CSS** for the utility-first styling approach
- **Next.js** team for the excellent React framework

## 📞 Support

If you have any questions or need help, please:
- Open an issue on GitHub
- Check our [FAQ](FAQ.md)
- Join our [Discord community](https://discord.gg/pantrypal)

---

**Made with ❤️ for better kitchen management**
Fri Aug  1 01:01:11 UTC 2025
Mon Aug  4 00:59:31 UTC 2025
Tue Aug  5 00:56:11 UTC 2025
Wed Aug  6 00:55:12 UTC 2025
Thu Aug  7 00:55:40 UTC 2025
Fri Aug  8 00:55:22 UTC 2025
Mon Aug 11 00:56:23 UTC 2025
Tue Aug 12 00:50:40 UTC 2025
Wed Aug 13 00:51:51 UTC 2025
Thu Aug 14 00:51:53 UTC 2025
Fri Aug 15 00:52:17 UTC 2025
Mon Aug 18 00:55:17 UTC 2025
Tue Aug 19 00:50:09 UTC 2025
Wed Aug 20 00:46:54 UTC 2025
Thu Aug 21 00:45:45 UTC 2025
Fri Aug 22 00:47:26 UTC 2025
Mon Aug 25 00:50:29 UTC 2025
Tue Aug 26 00:47:43 UTC 2025
Wed Aug 27 00:46:07 UTC 2025
Thu Sep  4 00:43:43 UTC 2025
Fri Sep  5 00:44:41 UTC 2025
Mon Sep  8 00:48:33 UTC 2025
Tue Sep  9 00:45:15 UTC 2025
Wed Sep 10 00:44:30 UTC 2025
Thu Sep 11 00:45:00 UTC 2025
Fri Sep 12 00:43:41 UTC 2025
Mon Sep 15 00:49:19 UTC 2025
Tue Sep 16 00:43:33 UTC 2025
Wed Sep 17 00:44:10 UTC 2025
Thu Sep 18 00:43:47 UTC 2025
Fri Sep 19 00:45:55 UTC 2025
Mon Sep 22 00:50:32 UTC 2025
Tue Sep 23 00:44:13 UTC 2025
Wed Sep 24 00:44:59 UTC 2025
Thu Sep 25 00:45:14 UTC 2025
Fri Sep 26 00:44:09 UTC 2025
Mon Sep 29 00:46:55 UTC 2025
Tue Sep 30 00:45:34 UTC 2025
Wed Oct  1 00:52:42 UTC 2025
Thu Oct  2 00:43:50 UTC 2025
Fri Oct  3 00:43:59 UTC 2025
Mon Oct  6 00:46:03 UTC 2025
Tue Oct  7 00:44:40 UTC 2025
Wed Oct  8 00:44:18 UTC 2025
Thu Oct  9 00:04:10 UTC 2025
Fri Oct 10 00:04:37 UTC 2025
Mon Oct 13 00:04:29 UTC 2025
Tue Oct 14 00:04:06 UTC 2025
Wed Oct 15 00:04:14 UTC 2025
Thu Oct 16 00:04:26 UTC 2025
Fri Oct 17 00:04:29 UTC 2025
Mon Oct 20 00:15:24 UTC 2025
Tue Oct 21 00:04:30 UTC 2025
Wed Oct 22 00:04:31 UTC 2025
Thu Oct 23 00:04:29 UTC 2025
Fri Oct 24 00:03:47 UTC 2025
Mon Oct 27 00:04:41 UTC 2025
Tue Oct 28 00:04:20 UTC 2025
Wed Oct 29 00:04:31 UTC 2025
Thu Oct 30 00:04:27 UTC 2025
Fri Oct 31 00:04:24 UTC 2025
Mon Nov  3 00:04:30 UTC 2025
Tue Nov  4 00:04:20 UTC 2025
Wed Nov  5 00:04:32 UTC 2025
Thu Nov  6 00:04:23 UTC 2025
Fri Nov  7 00:04:21 UTC 2025
Mon Nov 10 00:04:30 UTC 2025
Tue Nov 11 00:04:30 UTC 2025
Wed Nov 12 00:04:29 UTC 2025
Thu Nov 13 00:04:25 UTC 2025
Fri Nov 14 00:04:23 UTC 2025
Mon Nov 17 00:04:16 UTC 2025
Tue Nov 18 00:04:24 UTC 2025
Wed Nov 19 00:04:29 UTC 2025
Thu Nov 20 00:04:17 UTC 2025
Fri Nov 21 00:04:23 UTC 2025
Mon Nov 24 00:04:37 UTC 2025
Tue Nov 25 00:04:02 UTC 2025
Wed Nov 26 00:04:27 UTC 2025
Thu Nov 27 00:04:23 UTC 2025
Fri Nov 28 00:04:31 UTC 2025
Mon Dec  1 00:05:54 UTC 2025
Tue Dec  2 00:04:27 UTC 2025
Wed Dec  3 00:04:23 UTC 2025
Thu Dec  4 00:04:25 UTC 2025
Fri Dec  5 00:04:33 UTC 2025
Mon Dec  8 00:04:56 UTC 2025
Tue Dec  9 00:04:33 UTC 2025
Wed Dec 10 00:04:27 UTC 2025
Thu Dec 11 00:04:39 UTC 2025
Fri Dec 12 00:04:36 UTC 2025
Mon Dec 15 00:04:51 UTC 2025
Tue Dec 16 00:04:56 UTC 2025
Wed Dec 17 00:04:22 UTC 2025
Thu Dec 18 00:04:21 UTC 2025
Fri Dec 19 00:04:55 UTC 2025
Mon Dec 22 00:04:37 UTC 2025
Tue Dec 23 00:04:40 UTC 2025
Wed Dec 24 00:04:33 UTC 2025
Thu Dec 25 00:04:31 UTC 2025
Fri Dec 26 00:04:36 UTC 2025
Mon Dec 29 00:05:16 UTC 2025
Tue Dec 30 00:04:47 UTC 2025
Wed Dec 31 00:04:34 UTC 2025
Thu Jan  1 00:05:46 UTC 2026
Fri Jan  2 00:04:36 UTC 2026
Mon Jan  5 00:05:13 UTC 2026
Tue Jan  6 00:04:59 UTC 2026
Wed Jan  7 00:04:28 UTC 2026
Thu Jan  8 00:04:43 UTC 2026
Fri Jan  9 00:04:40 UTC 2026
Mon Jan 12 00:04:44 UTC 2026
Tue Jan 13 00:04:20 UTC 2026
Wed Jan 14 00:04:48 UTC 2026
Thu Jan 15 00:04:43 UTC 2026
Fri Jan 16 00:04:50 UTC 2026
Mon Jan 19 00:05:35 UTC 2026
Tue Jan 20 00:04:37 UTC 2026
