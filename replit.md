# NovaFashion - Professional E-commerce Platform

## Overview
NovaFashion is a modern, professional e-commerce platform specializing in fashion products. It features comprehensive multi-language support (Arabic, French, English), a secure admin panel, a fully functional shopping cart, and an integrated delivery system covering all 58 Algerian wilayas. The platform aims to provide a professional, modern aesthetic with a red-to-black gradient theme, targeting the Algerian market with a focus on ease of use and rich functionality.

## User Preferences
- Primary language: Arabic (RTL)
- Color scheme: Red gradient to black
- Professional, modern aesthetic
- Focus on Algerian market

## System Architecture

### UI/UX Decisions
The platform features a red-to-black gradient theme, ensuring a professional and modern design. It includes a responsive layout for all devices, smooth animations, professional product cards with hover effects, and modern glassmorphism elements. The language switcher is enhanced with full text labels and supports automatic RTL/LTR switching. Product variants are displayed using clickable button options for an improved user experience, similar to AliExpress.

### Technical Implementations
The frontend is built using pure HTML5, CSS3, and JavaScript, avoiding external frameworks. CSS Grid and Flexbox are utilized for layout. `LocalStorage` handles cart persistence, and the `Fetch API` manages backend communication.

### Feature Specifications
- **Multi-Language Support:** Arabic (RTL), French, and English, with dynamic switching.
- **Shopping Cart:** Add to cart, quantity management, persistent storage, and real-time updates.
- **Checkout & Delivery:** Integration with all 58 Algerian wilayas, dynamic delivery cost calculation, and a comprehensive customer information form.
- **Admin Panel:** Secure JWT-based authentication, full CRUD operations for products (multi-language support), and order management with status updates.
- **Security:** Implements `express-validator` for input validation, `helmet` for HTTP security headers, and rate limiting for brute force protection.
- **Product Features:** Includes search functionality, category and price range filtering, and a ratings system.

### System Design Choices
The backend is built with Node.js and Express.js, utilizing JWT for authentication and bcryptjs for password hashing. Data is persisted using JSON files for products, orders, Algerian locations, and admin users, offering a lightweight solution. The server architecture is modular, following an MVC-like pattern with separate routes, middleware, and utility files for maintainability and scalability. The application is designed to run on a single Node.js server, serving static files from `public/` and handling API requests.

## External Dependencies
- **Node.js**: Backend runtime environment.
- **Express.js**: Web application framework for Node.js.
- **JSON Web Tokens (JWT)**: For secure authentication.
- **bcryptjs**: For password hashing.
- **CORS**: Middleware to enable Cross-Origin Resource Sharing.
- **express-validator**: For input data validation.
- **helmet**: For securing HTTP headers.
- **Algerian wilayas and communes data**: Custom JSON data for location-based delivery and pricing.