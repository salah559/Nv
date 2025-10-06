# NovaFashion - Professional E-commerce Platform

## Overview
NovaFashion is a modern, professional e-commerce platform for fashion products with complete multi-language support, admin panel, shopping cart, and delivery system integrated with all 58 Algerian wilayas.

## Key Features

### 🌐 Multi-Language Support (3 Languages)
- **Arabic (العربية)** - Primary language with RTL support
- **French (Français)** - Secondary language
- **English** - International support
- Automatic RTL/LTR switching based on language
- Enhanced language switcher with full text labels in header

### 🎨 Design & UI
- **Red-to-Black Gradient Theme** - Professional, modern design
- Responsive layout for all devices
- Smooth animations and transitions
- Professional product cards with hover effects
- Modern glassmorphism effects

### 🛒 Shopping Cart System
- Add to cart functionality
- Persistent storage using localStorage
- Quantity management (increase/decrease)
- Cart modal with live updates
- Remove items from cart

### 📦 Checkout & Delivery
- Complete Algerian location integration (58 wilayas)
- Automatic delivery price calculation per wilaya
- **Dynamic grand total display** - Updates in real-time when wilaya is selected
- Customer information form:
  - Name
  - Phone number
  - Email
  - Wilaya selection
  - Detailed address
- Order summary with live delivery costs calculation

### 👨‍💼 Admin Panel
- Secure authentication (JWT-based)
- Product Management:
  - Add new products (multi-language)
  - Edit existing products
  - Delete products
  - Image URL management
  - Category organization
- Order Management:
  - View all orders
  - Update order status (Pending → Confirmed → Delivered)
  - Customer details display
  - Order items and pricing

## Technology Stack

### Backend
- **Node.js** with Express.js
- **JWT** for authentication
- **bcryptjs** for password hashing
- **JSON file storage** for data persistence
- **CORS** enabled for API access

### Frontend
- **Pure HTML5, CSS3, JavaScript** (No framework dependencies)
- **CSS Grid & Flexbox** for layouts
- **LocalStorage** for cart persistence
- **Fetch API** for backend communication

### Data
- Algerian wilayas and communes data (58 wilayas)
- Configurable delivery pricing per wilaya
- Product catalog with multi-language content

## Project Structure
```
.
├── server/
│   ├── config/
│   │   └── paths.js           # File paths configuration
│   ├── middleware/
│   │   └── auth.js            # JWT authentication middleware
│   ├── routes/
│   │   ├── admin.js           # Admin authentication routes
│   │   ├── products.js        # Product CRUD routes
│   │   └── orders.js          # Order management routes
│   ├── utils/
│   │   ├── fileManager.js     # JSON file read/write utilities
│   │   └── initAdmin.js       # Admin initialization
│   └── server.js              # Main Express server
├── public/
│   ├── css/
│   │   ├── style.css          # Main website styles
│   │   └── admin.css          # Admin panel styles
│   └── js/
│       ├── app.js             # Main application logic
│       ├── cart.js            # Shopping cart functionality
│       ├── translations.js    # Multi-language support
│       └── admin.js           # Admin panel logic
├── data/
│   ├── algeria-locations.json # Wilayas and shipping prices
│   ├── products.json          # Product catalog
│   ├── orders.json            # Customer orders
│   └── admins.json            # Admin users
├── index.html                 # Main storefront
├── admin.html                 # Admin dashboard
├── package.json               # Dependencies
└── replit.md                  # This file
```

## Running the Application

The application runs on a single Node.js server on port 5000:
```bash
node server/server.js
```

## Admin Credentials
- **Username:** salah55
- **Password:** salaho55
- **Email:** salah@novafashion.dz

⚠️ **SECURITY WARNING**: For production deployment:
1. Change the admin password immediately after first login
2. Set a secure JWT_SECRET environment variable
3. Consider implementing proper user registration with email verification
4. Use environment variables for all sensitive configuration

## API Endpoints

### Public Endpoints
- `GET /api/products` - Get all products
- `POST /api/orders` - Create new order

### Protected Endpoints (Admin only)
- `POST /api/admin/login` - Admin login
- `POST /api/products` - Add new product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product
- `GET /api/orders` - Get all orders
- `PUT /api/orders/:id` - Update order status

## Algerian Delivery Integration

### Shipping Prices by Wilaya (in DZD)
- **Alger (16):** 300 DZD
- **Blida (9):** 400 DZD
- **Oran (31):** 500 DZD
- **Constantine (25):** 600 DZD
- And all other 54 wilayas with specific pricing

### Wilaya Coverage
All 58 Algerian wilayas are supported, including the 10 newest wilayas added in December 2019:
- Timimoun (49)
- Bordj Baji Mokhtar (50)
- Ouled Djellal (51)
- Béni Abbès (52)
- In Salah (53)
- In Guezzam (54)
- Touggourt (55)
- Djanet (56)
- El M'Ghair (57)
- El Meniaa (58)

## GitHub Pages Deployment

### ✅ الموقع جاهز للنشر على GitHub Pages
المشروع معد بشكل كامل للنشر على GitHub Pages بطريقتين:

#### الطريقة 1: GitHub Actions (موصى بها)
1. ارفع المشروع إلى GitHub
2. اذهب إلى **Settings > Pages**
3. في **Source**، اختر **GitHub Actions**
4. سيتم النشر تلقائياً عند كل push

#### الطريقة 2: من مجلد docs
1. ارفع المشروع إلى GitHub
2. اذهب إلى **Settings > Pages**
3. في **Source**، اختر **Deploy from a branch**
4. اختر: Branch: **main**, Folder: **/docs**

### هيكل النشر
```
docs/                       # المجلد المخصص للنشر على GitHub Pages
├── index.html             # الصفحة الرئيسية
├── admin.html             # لوحة الإدارة
├── css/                   # ملفات التنسيق
├── js/                    # ملفات JavaScript
├── data/                  # البيانات (منتجات + ولايات)
├── images/                # الصور
└── .nojekyll              # لتعطيل Jekyll

.github/workflows/
└── deploy.yml             # GitHub Actions workflow للنشر التلقائي
```

### ملاحظات مهمة للنشر
- ✅ جميع المسارات نسبية وتبدأ بـ `./`
- ✅ ملف `.nojekyll` موجود لتعطيل Jekyll
- ✅ ملف `algeria-locations.json` مضاف لنظام التوصيل
- ✅ لا توجد ملفات مكررة خارج مجلد docs
- ✅ GitHub Actions workflow جاهز للنشر التلقائي

## Recent Changes

### 2025-10-06 (Latest Update): GitHub Pages Compatibility
- ✅ **Fixed Product Loading Issue:**
  - Changed paths from absolute (`/data/products.json`) to relative (`data/products.json`)
  - Fixed paths in `docs/js/app.js` and `docs/js/cart.js`
  - Fixed paths in `public/js/app.js` and `public/js/cart.js`
  - Products now load correctly on GitHub Pages subdirectory deployments
- ✅ **Admin Panel for GitHub Pages:**
  - Converted admin panel to work without server (using localStorage)
  - Implemented local authentication (username: salah55, password: salaho55)
  - Product management works with localStorage
  - Order management works with localStorage
  - Dashboard statistics calculated from local data
  - **Note:** All data is stored locally in browser, not shared between devices
- ✅ **Updated Documentation:**
  - Enhanced GitHub_Pages_Setup.md with admin panel instructions
  - Added warnings about localStorage limitations
  - Documented all features and setup steps

### 2025-10-05: Advanced Features & Security Enhancements
- ✅ **Security Enhancements:**
  - Added `express-validator` for comprehensive input validation
  - Integrated `helmet` middleware for HTTP security headers
  - Implemented rate limiting (15 requests/15min) for brute force protection
  - Configured `trust proxy` for Replit environment
  - Enhanced orderValidation to match frontend payload structure
- ✅ **Product Features:**
  - Added search functionality for products
  - Implemented category and price range filtering
  - Created ratings system with modal UI and API endpoints
  - Added lazy loading for product images
- ✅ **Admin Dashboard:**
  - Created comprehensive statistics dashboard with:
    - Total orders and sales metrics
    - Order status breakdown (Pending/Confirmed/Delivered)
    - Top-selling products display
    - Recent orders overview
  - Professional card designs with hover effects
  - Real-time data from `/api/stats` endpoint
- ✅ **Bug Fixes:**
  - Fixed orderValidation to accept `total` field from frontend
  - Relaxed phone validation for flexible formats
  - Ensured checkout flow works end-to-end
- ✅ All features tested and architect-reviewed

### 2025-10-05: Code Reorganization & Clean Architecture
- ✅ Restructured server code into modular MVC-like architecture
- ✅ Separated routes into dedicated files:
  - `/server/routes/admin.js` - Authentication endpoints
  - `/server/routes/products.js` - Product management
  - `/server/routes/orders.js` - Order handling
- ✅ Created middleware directory with authentication logic
- ✅ Organized utilities:
  - `fileManager.js` - Centralized JSON file operations
  - `initAdmin.js` - Admin initialization logic
- ✅ Added configuration directory for paths and constants
- ✅ Improved server console output with emojis and clear URLs
- ✅ Enhanced code maintainability and scalability
- ✅ All routes tested and working perfectly
- ✅ Server running smoothly on reorganized architecture

### 2025-10-05: Replit Environment Setup Complete
- ✅ Successfully imported GitHub project to Replit
- ✅ Installed all npm dependencies (bcryptjs, express, cors, body-parser, jwt, etc.)
- ✅ Configured workflow "NovaFashion Server" to run on port 5000
- ✅ Server binding verified to 0.0.0.0:5000 for Replit environment
- ✅ Configured autoscale deployment for production
- ✅ Tested website - Arabic RTL layout working perfectly
- ✅ Red gradient design rendering correctly
- ✅ Multi-language switcher functional (Arabic/French/English)
- ✅ All API endpoints operational
- ✅ Admin panel accessible at /admin.html
- ✅ Ready for production deployment

### 2025-10-05: UI/UX Enhancements
- ✅ Removed Tamazight language support (now supports 3 languages: Arabic, French, English)
- ✅ Enhanced language switcher buttons with full text labels ("عربي", "Français", "English")
- ✅ Improved language button design with better sizing, golden borders, and hover effects
- ✅ Enhanced shopping cart UI with:
  - Modal content with golden gradient borders
  - Improved cart items with hover animations
  - Better quantity controls with gradient buttons
  - Enhanced cart summary with golden/red gradients
  - Larger product images (90x90) with golden borders
- ✅ Added dynamic grand total display in checkout form
- ✅ Real-time price calculation when wilaya is selected
- ✅ Checkout summary shows: subtotal + delivery + grand total dynamically
- ✅ Updated all product data to remove Tamazight fields

### 2025-10-05: Professional Design Enhancement
- ✅ Created premium logo with animated gold shimmer effect and star icons (✦ NovaFashion ✦)
- ✅ Made logo clickable to access admin panel
- ✅ Enhanced color scheme with vibrant red (#ff0844) and gold (#ffd700) accents
- ✅ Improved gradient backgrounds with richer color depth
- ✅ Added sophisticated animations (shimmer, pulse, fadeInUp)
- ✅ Enhanced button designs with golden borders and hover effects
- ✅ Upgraded product cards with hover animations and glow effects
- ✅ Improved form inputs with focus states and smooth transitions
- ✅ Enhanced admin login page with premium design
- ✅ Updated admin credentials to salah55 / salaho55
- ✅ Added professional visual effects and better color contrast throughout

### 2025-10-05: Replit Environment Setup
- ✅ Imported GitHub project to Replit
- ✅ Installed all npm dependencies
- ✅ Created missing data/orders.json file
- ✅ Updated package.json with proper start script
- ✅ Configured workflow to run server on port 5000
- ✅ Verified server binding to 0.0.0.0:5000
- ✅ Configured deployment settings for autoscale
- ✅ Tested and verified website functionality
- ✅ Confirmed RTL Arabic layout and gradient design working

### 2025-10-04: Complete Platform Transformation
- ✅ Implemented red-to-black gradient professional design
- ✅ Added multi-language support (Arabic, French, English)
- ✅ Built complete shopping cart system with localStorage
- ✅ Integrated all 58 Algerian wilayas with delivery pricing
- ✅ Created secure admin panel with JWT authentication
- ✅ Added product management (CRUD operations)
- ✅ Added order management system
- ✅ Implemented checkout flow with customer information
- ✅ Deployed full-stack Node.js/Express backend
- ✅ Added responsive design for all devices

## User Preferences
- Primary language: Arabic (RTL)
- Color scheme: Red gradient to black
- Professional, modern aesthetic
- Focus on Algerian market

## Development Notes
- Server runs on port 5000 (0.0.0.0)
- Uses JSON file-based storage (can be upgraded to MongoDB)
- Admin panel accessible at `/admin.html`
- All API routes prefixed with `/api/`
- Static files served from `public/` and root directory
