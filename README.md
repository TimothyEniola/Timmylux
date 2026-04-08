# Timmy Lux Furniture - E-Commerce Furniture Store

A modern, fully responsive React.js e-commerce application for browsing, purchasing, and managing premium furniture products. Features a complete admin panel for inventory management, product variations, collections, and featured items showcase.

## 🚀 Technology Stack

| Package | Version | Purpose |
|---------|---------|----------|
| React | 19.2.3 | Core UI framework |
| Vite | 7.2.4 | Build tool with HMR & code splitting |
| React Router DOM | 7.12.0 | Client-side routing |
| Zustand | 5.0.10 | State management with localStorage persistence |
| Tailwind CSS | 4.1.18 | Utility-first styling |
| Axios | 1.13.3 | HTTP client |
| Lucide React | Latest | Icon library |
| React Icons | Latest | Additional icons |
| Recharts | 3.6.0 | Charts & analytics visualization |

## 📋 Architecture

**Frontend-Only Application**: This is a purely frontend application with no backend API. All data persists using browser localStorage, making it ideal for:
- Prototyping and demonstrations
- Learning React, Zustand, and Tailwind CSS
- Portfolio projects
- E-commerce mockups and UI testing

**State Management**: Zustand with localStorage persistence for:
- 🛒 Shopping cart (persists across sessions)
- ❤️ Wishlist (user-saved favorites)
- 👤 User authentication state (local session)

## 🛠️ Getting Started

### Prerequisites
- Node.js 16+ and npm installed

### Installation & Development

```bash
# Install dependencies
npm install

# Start development server (http://localhost:5173)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 📱 Features

### Customer Features
- ✅ **Browse Products**: Responsive product catalog with filtering and search
- ✅ **Product Collections**: 8+ curated collections organized by style and room type:
  - Modern Bedroom Collection (luxury and contemporary bedroom furniture)
  - Luxury Living Collection (premium sofas and seating)
  - Modern Dining Collection (elegant dining sets and tables)
  - Comfort Seating Collection (armchairs, ottomans, and lounge furniture)
  - Contemporary Tables Collection (coffee tables and side tables)
  - Contemporary Storage Collection (bookshelves and wall cabinets)
  - Professional Office Collection (desks and office chairs)
  - Luxury Bedroom Suite (premium complete bedroom sets)
- ✅ **Product Details**: View pricing, descriptions, and product variations
- ✅ **Product Variations**: Each product has 3+ design variations with different colors, materials, and price points
- ✅ **Shopping Cart**: Add/remove items with quantity management, persisted with localStorage
- ✅ **Wishlist**: Save favorite items for later, persistent across sessions
- ✅ **Checkout**: Paystack + Cash on Delivery frontend demo with live order summary
  - Product images displayed for each item
  - **Variation Selector**: Select collection type (color/material) for each product during checkout
  - Real-time price updates based on selected variation
  - Expandable variation selector with preview images
- ✅ **Order Customization**: Choose from multiple design variations (colors, materials) before purchase
- ✅ **User Profile**: View and edit profile information with profile picture upload
- ✅ **Order History**: Track previously placed orders with details modal
- ✅ **Order Tracking**: Real-time order status tracking
- ✅ **Order Details**: View complete order information including customer details, shipping address, and items
- ✅ **Responsive Design**: 
  - Mobile-first design (< 640px)
  - Tablet optimization (640px - 1024px)
  - Full desktop experience (> 1024px)
  - All components fully responsive across devices

### Admin Features
- ✅ **Admin Dashboard**: Overview of store metrics and statistics
- ✅ **Product Management**: 
  - Bulk product listing with edit/delete capabilities
  - Add new products with images, descriptions, and pricing
  - Edit existing products with variations support
  - Product variations: Create multiple SKUs per product (color, size, etc.)
- ✅ **Collections**: Create, manage, and organize product collections
  - Assign featured collection status
  - Track product counts per collection
- ✅ **Featured Products**: Curate homepage featured items with star toggle
- ✅ **Admin Profile**: View and edit admin account information with profile picture
- ✅ **Order Management**: View and manage customer orders
- ✅ **Admin Settings**: Access control and permissions management

## 📄 Pages & Routes

### Shop Page Features (`/products`)

The enhanced shop page showcases 20+ premium furniture products organized into 8 curated collections:

**Collections Available**:
1. **Modern Bedroom Collection** - 5 products (beds, wardrobes, nightstands)
2. **Luxury Living Collection** - 3 products (sofas, sectional sofas)
3. **Modern Dining Collection** - 4 products (dining sets, tables, chairs)
4. **Comfort Seating Collection** - 2 products (armchairs, ottomans)
5. **Contemporary Tables Collection** - 3 products (coffee tables, side tables)
6. **Contemporary Storage Collection** - 2 products (bookshelves, wall cabinets)
7. **Professional Office Collection** - 3 products (desks, office chairs, corner desks)

**Features**:
- **Product Variations**: Each product displays 3 design variations with different colors/materials
- **Responsive Grid Layout**:
  - Mobile: 1 column layout
  - Tablet: 2 columns
  - Desktop: 3 columns
- **Search & Filter**: Search by product name, collection, or category; filter by furniture type
- **Collection Grouping**: Products automatically grouped and displayed by collection
- **Product Images**: High-quality images for all product variations
- **Lazy Loading**: Images load on demand for better performance

### Public Routes
| Route | Component | Description |
|-------|-----------|-------------|
| `/` | Home.jsx | Homepage with featured products showcase |
| `/products` | Products.jsx | Full product catalog with filters |
| `/about` | About.jsx | About the company page |
| `/custom-request` | CustomRequest.jsx | Request custom furniture |
| `/cart` | Cart.jsx | Shopping cart review & checkout |
| `/checkout` | Checkout.jsx | Payment and order confirmation with Paystack/COD frontend demo |
| `/wishlist` | Wishlist.jsx | Saved favorite items |
| `/order-history` | OrderHistory.jsx | View past orders |
| `/track-order` | TrackOrder.jsx | Track order status |
| `/signin` | SignIn.jsx | User login page |
| `/signup` | SignUp.jsx | User registration page |
| `/profile` | UserProfile.jsx | User account profile with image upload |
| `/settings` | UserSettings.jsx | User account settings |

### Admin Routes (Protected)
| Route | Component | Description |
|-------|-----------|-------------|
| `/admin` | AdminDashboard.jsx | Admin overview & metrics |
| `/admin/products` | AdminProducts.jsx | Product listing with management |
| `/admin/add-product` | AdminAddProduct.jsx | Create new products with variations |
| `/admin/edit-product/:id` | AdminEditProduct.jsx | Edit products & variations |
| `/admin/collections` | AdminCollections.jsx | Manage product collections |
| `/admin/featured` | AdminFeatured.jsx | Toggle featured products |
| `/admin/orders` | AdminOrders.jsx | Manage customer orders |
| `/admin/profile` | AdminProfile.jsx | Admin profile with image upload |

## 🗂️ Project Structure

```
client/
├── src/
│   ├── components/              # Reusable React components
│   │   ├── Navbar.jsx           # Navigation bar with active page highlighting
│   │   ├── AdminNavbar.jsx      # Admin navigation bar
│   │   ├── ProfileDropdown.jsx  # User profile dropdown menu
│   │   ├── AdminDropdown.jsx    # Admin dropdown menu
│   │   ├── ProductCard.jsx      # Reusable product card
│   │   ├── ProtectedRoute.jsx   # Admin route protection
│   │   ├── AdminRoute.jsx       # Alternative admin protection
│   │   ├── Footer.jsx           # Footer component
│   │   ├── TopBar.jsx           # Top notification bar
│   │   └── loader.jsx           # Loading spinner
│   ├── pages/                   # Page components
│   │   ├── Home.jsx
│   │   ├── Products.jsx         # Shop page with 20+ products organized in 8 collections
│   │   ├── Cart.jsx             # Shopping cart page
│   │   ├── Checkout.jsx         # Checkout with Paystack + COD frontend demo
│   │   ├── Wishlist.jsx
│   │   ├── UserProfile.jsx      # User profile with image upload
│   │   ├── AdminDashboard.jsx   # Admin overview dashboard
│   │   ├── AdminProducts.jsx    # Admin product management
│   │   ├── AdminAddProduct.jsx  # Create products with variations
│   │   ├── AdminEditProduct.jsx # Edit products & variations
│   │   ├── AdminCollections.jsx # Manage collections
│   │   ├── AdminFeatured.jsx    # Manage featured items
│   │   ├── AdminOrders.jsx      # Manage orders with order details modal
│   │   ├── AdminProfile.jsx     # Admin profile with image upload
│   │   ├── OrderHistory.jsx     # User order history with tracking modal
│   │   ├── TrackOrder.jsx
│   │   ├── SignIn.jsx
│   │   ├── SignUp.jsx
│   │   └── Other pages...
│   ├── store/                   # Zustand state management
│   │   ├── cartStore.js         # 🛒 Shopping cart state
│   │   └── wishlistStore.js     # ❤️ Wishlist state
│   ├── config/                  # Configuration files
│   │   └── paystack.js          # Paystack payment config
│   ├── data/                    # Mock data with 20+ products
│   │   └── Products.js          # Complete product listings with collections & variations
│   ├── App.jsx                  # Main app component with routes
│   ├── App.css                  # App styles
│   ├── main.jsx                 # App entry point
│   ├── index.css                # Global styles (includes custom components)
│   └── product.json             # Product data
├── public/                      # Static assets
├── index.html                   # HTML template
├── vite.config.js              # Vite configuration with code splitting
├── tailwind.config.js          # Tailwind CSS configuration
├── eslint.config.js            # ESLint configuration
└── package.json                # Dependencies and scripts
```

### Product Data Structure

**Products.js** now contains:
- **20+ premium furniture items**
- **8 organized collections** by style and room type
- **3+ design variations per product** with:
  - Different colors/finishes
  - Alternative materials
  - Varied pricing
  - High-quality images
- **Full product details** including:
  - Name, price, category
  - Description
  - Material information
  - Availability status
  - Featured status for homepage

## 🎨 Styling

- **CSS Framework**: Tailwind CSS 4.1.18 with utility-first approach
- **Custom Components**: Global CSS classes in `index.css`:
  - `.btn-primary` - Primary action button (gold)
  - `.btn-secondary` - Secondary button
  - `.btn-outline` - Outline button style
  - `.input-premium` - Enhanced form input styling
  - `.card` - Reusable card container
  - `.discount-badge` - Sale/discount label

- **Color Scheme**:
  - Primary: Navy Blue (`#011F5B`)
  - Accent: Gold (`#D4AF37`)
  - Text: White & Gray
  - Backgrounds: Dark & Light variants

## 🛒 Shopping Cart & Wishlist

### Cart Features
- Add/remove products with quantity adjustment
- Persistent storage using localStorage
- Real-time total calculation
- Tax calculation integration
- Cart item count in navbar

**Storage**: `localStorage.cart`

### Wishlist Features
- Add/remove products
- Persistent storage across sessions
- Visual heart icon toggle
- Move items to cart functionality

**Storage**: `localStorage.wishlist`

## 👤 Profile Picture Upload

Both user and admin profiles support image uploads and display the uploaded avatar in the navbar across desktop and mobile views:

1. **User Profile** (`/profile`):
   - Click the camera icon overlay on the profile picture
   - Select an image file (png, jpg, jpeg, gif, webp)
   - Image stored as base64 data URL in localStorage
   - Immediately updates the navbar avatar
   - Persists across browser sessions and screen sizes

2. **Admin Profile** (`/admin/profile`):
   - Same upload mechanism as user profile
   - Image stored separately in localStorage
   - Navbar avatar updates immediately in both desktop and mobile admin navigation

**Storage**:
- User profile: `localStorage.userProfileImage`
- Admin profile: `localStorage.adminProfileImage`

## 🚀 Performance Optimizations

### Vite Configuration
- **Code Splitting**: Separates vendor chunks for better caching:
  - `react-vendor` - React & React DOM
  - `ui-vendor` - UI libraries & icons
  - `state-vendor` - Zustand
  - `chart-vendor` - Recharts
- **Minification**: Terser with console removal for production
- **Asset Compression**: Optimized image & asset handling
- **Dynamic Imports**: Lazy loading for better initial load time

### React Optimizations
- **Memoization**: `React.memo()` on ProductCard and Navbar to prevent unnecessary re-renders
- **State Management**: Zustand with fine-grained subscriptions
- **localStorage Persistence**: Reduces API calls and improves offline capability

## 🎯 Active Page Highlighting

The navbar automatically highlights the current page with a gold color (`#D4AF37`). Uses React Router's `useLocation()` hook to detect the active route and apply styling.

**Implementation**: Check `components/Navbar.jsx` for active page detection logic.

## 🔐 Authentication (Frontend Demo)

**Note**: This is a frontend-only demo without backend authentication. Sign-in/signup pages show the UI, but authentication is mocked using localStorage for demonstration.

**To Backend Integration**:
1. Replace login logic with API calls to your backend
2. Store JWT tokens in localStorage
3. Add token validation to ProtectedRoute component
4. Implement refresh token rotation

## 📱 Responsive Design

All components are built mobile-first and responsive:
- **Mobile** (< 640px): Single column, touch-friendly buttons
- **Tablet** (640px - 1024px): Two-column layouts, adjusted spacing
- **Desktop** (> 1024px): Full multi-column layouts, expanded navigation

## 🧪 Testing & Development

### Development Server
```bash
npm run dev
```
- Hot Module Replacement (HMR) for instant feedback
- Fast refresh on file changes
- Development source maps

### Production Build
```bash
npm run build
```
- Minified code with console removal
- Code splitting by vendor
- Tree-shaking of unused code
- Optimized asset sizes

## 📦 Deployment

Built with Vite for easy deployment:

```bash
# Build production bundle
npm run build

# Deploy dist/ folder to:
# - Vercel (included: vercel.json)
# - Netlify
# - GitHub Pages
# - Any static hosting
```

See `vercel.json` for Vercel deployment configuration.

## 🎓 Learning Resources

This project demonstrates:
- React 19 features and hooks
- React Router v7 for client-side routing
- Zustand for lightweight state management
- Tailwind CSS utility-first styling
- localStorage for client-side persistence
- File uploads via FileReader API
- Responsive design patterns
- Component composition and reusability

## 🤝 Contributing

This is a learning/portfolio project. Feel free to:
- Fork and customize for your needs
- Extend with backend API integration
- Add additional payment providers
- Implement real authentication
- Add more product features

## 📄 License

This project is open source and available for learning purposes.

## 🎉 Features Roadmap

**Potential Enhancements**:
- [ ] Backend API integration with Node.js/Express
- [ ] Real user authentication with JWT
- [ ] Database persistence (MongoDB/PostgreSQL)
- [ ] Product reviews and ratings
- [ ] Customer testimonials
- [ ] Email notifications
- [ ] SMS order updates
- [ ] Advanced analytics dashboard
- [ ] Inventory management system
- [ ] Multi-currency support
- [ ] Multiple payment gateways
- [ ] Product recommendations engine

---

**Last Updated**: April 8, 2026
**Version**: 1.5.0

## 📝 Recent Updates (Frontend Only)

### Version 1.5.0
- ✅ **Enhanced Shop Page**: Expanded product catalog to 20+ items with detailed variations
- ✅ **Collection System**: Organized products into 8 curated collections by style and room type
- ✅ **Product Variations**: Each product now features 3+ design variations with different colors, materials, and pricing
- ✅ **Order Details Modal**: Added detailed order information modal in Admin Orders page
- ✅ **Responsive Improvements**: Enhanced mobile responsiveness across all screen sizes
- ✅ **Search & Filter**: Improved product discovery with search by name, collection, or category
