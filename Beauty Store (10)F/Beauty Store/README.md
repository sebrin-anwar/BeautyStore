# Beauty Supply Store

A full-stack e-commerce web application for beauty products built with HTML5, CSS3, vanilla JavaScript (ES6+), Express.js, and PostgreSQL.

## 📋 Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Database Setup](#database-setup)
- [Environment Configuration](#environment-configuration)
- [Running the Application](#running-the-application)
- [Default Credentials](#default-credentials)
- [Project Structure](#project-structure)
- [API Endpoints](#api-endpoints)
- [Contributing](#contributing)

## ✨ Features

### Customer Features
- Browse product catalog with search and filter functionality
- View detailed product information
- Add products to shopping cart
- Secure checkout process with multiple payment options
- Order tracking and history
- User profile management
- Newsletter subscription

### Administrator Features
- Complete product management (Create, Read, Update, Delete)
- Category management
- Order management and approval
- Customer overview
- Dashboard with statistics
- Secure admin authentication

## 🛠 Technologies Used

### Front-End
- **HTML5** - Semantic markup
- **CSS3** - Responsive design with Flexbox/Grid
- **JavaScript (ES6+)** - Vanilla JS with modern features
  - Arrow functions
  - Async/await
  - Template literals
  - Destructuring
  - Fetch API

### Back-End
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **PostgreSQL** - Relational database
- **JWT** - Authentication
- **bcryptjs** - Password hashing

### Dependencies
```json
{
  "bcryptjs": "^2.4.3",
  "cors": "^2.8.5",
  "dotenv": "^16.6.1",
  "express": "^4.18.2",
  "jsonwebtoken": "^9.0.2",
  "pg": "^8.16.3"
}
```

## 📦 Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v14 or higher) - [Download](https://nodejs.org/)
- **PostgreSQL** (v12 or higher) - [Download](https://www.postgresql.org/download/)
- **npm** (comes with Node.js)

## 🚀 Installation

1. **Clone or extract the project**
   ```bash
   cd "Beauty Store"
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

## 🗄 Database Setup

1. **Start PostgreSQL service**
   - Windows: PostgreSQL should start automatically
   - Mac: `brew services start postgresql`
   - Linux: `sudo systemctl start postgresql`

2. **Create the database**
   ```bash
   psql -U postgres
   ```
   
   Then in the PostgreSQL prompt:
   ```sql
   CREATE DATABASE beautysupplystore;
   \q
   ```

3. **Run the schema file**
   ```bash
   psql -U postgres -d beautysupplystore -f database/schema.sql
   ```

4. **Seed the database with sample products** (optional)
   ```bash
   psql -U postgres -d beautysupplystore -f database/seed-products.sql
   ```

## ⚙️ Environment Configuration

1. **Create a `.env` file** in the root directory:
   ```bash
   # Copy the example below or create manually
   ```

2. **Add the following environment variables**:
   ```env
   # Database Configuration
   DB_USER=postgres
   DB_HOST=localhost
   DB_NAME=beautysupplystore
   DB_PASSWORD=your_postgres_password
   DB_PORT=5432

   # Server Configuration
   PORT=3000

   # JWT Secret (use a strong random string)
   JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
   ```

   **Important**: Replace `your_postgres_password` with your actual PostgreSQL password.

## ▶️ Running the Application

### Development Mode (with auto-restart)
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

The application will be available at:
```
http://localhost:3000
```

### Available Routes
- **Homepage**: http://localhost:3000/
- **Products**: http://localhost:3000/products
- **Product Details**: http://localhost:3000/product-details
- **Categories**: http://localhost:3000/categories
- **Cart**: http://localhost:3000/cart
- **Checkout**: http://localhost:3000/checkout
- **Order Confirmation**: http://localhost:3000/order-confirmation
- **Order Tracking**: http://localhost:3000/order-tracking
- **Login**: http://localhost:3000/login
- **User Profile**: http://localhost:3000/profile
- **Bank Payment**: http://localhost:3000/bank
- **Admin Dashboard**: http://localhost:3000/admin-dashboard
- **Health Check**: http://localhost:3000/api/health

## 🔐 Default Credentials

### Admin Account
- **Email**: `admin@Beauty Supply Store.com`
- **Password**: `password`

**Note**: The password is hashed in the database. If you need to create a new admin user, use the registration endpoint and manually update the role in the database.

## 📁 Project Structure

```
Beauty Store/
├── Public/
│   ├── CSS/                 # Stylesheets
│   │   ├── style.css        # Main styles
│   │   ├── products.css     # Product page styles
│   │   ├── admin.css        # Admin dashboard styles
│   │   └── ...
│   ├── Html/                # HTML pages
│   │   ├── index.html       # Homepage
│   │   ├── products.html    # Product catalog
│   │   ├── admin-dashboard.html
│   │   └── ...
│   └── JS/                  # JavaScript files
│       ├── main.js          # Main functionality
│       ├── products.js      # Product page logic
│       ├── admin.js         # Admin dashboard logic
│       └── ...
├── database/
│   ├── connection.js        # Database connection
│   ├── schema.sql           # Database schema
│   ├── seed.sql             # Seed data
│   └── seed-products.sql    # Product seed data
├── middleware/
│   ├── auth.js              # Authentication middleware
│   └── validation.js        # Input validation
├── routes/
│   ├── admin.js             # Admin API routes
│   ├── auth.js              # Authentication routes
│   ├── products.js          # Product routes
│   ├── cart.js              # Cart routes
│   └── orders.js            # Order routes
├── server.js                # Main server file
├── package.json             # Dependencies
├── .env                     # Environment variables (create this)
└── README.md                # This file
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login

### Products
- `GET /api/products` - Get all products (with search/filter)
- `GET /api/products/:id` - Get single product
- `GET /api/products/featured` - Get featured products
- `GET /api/search/suggestions` - Get search suggestions

### Cart (Authenticated)
- `GET /api/cart` - Get user's cart
- `POST /api/cart` - Add item to cart
- `PUT /api/cart/:productId` - Update cart item quantity
- `DELETE /api/cart/:productId` - Remove item from cart
- `DELETE /api/cart` - Clear entire cart

### Orders (Authenticated)
- `POST /api/orders` - Create new order
- `GET /api/customer/orders` - Get user's order history

### User Profile (Authenticated)
- `PUT /api/customer/profile` - Update user profile

### Newsletter
- `POST /api/newsletter/subscribe` - Subscribe to newsletter

### Admin (Authenticated - Admin Only)
- `GET /api/admin/dashboard/stats` - Get dashboard statistics
- `GET /api/admin/products` - Get all products
- `POST /api/admin/products` - Create new product
- `PUT /api/admin/products/:id` - Update product
- `DELETE /api/admin/products/:id` - Delete product
- `GET /api/admin/categories` - Get all categories
- `POST /api/admin/categories` - Create new category
- `GET /api/admin/orders` - Get all orders
- `PUT /api/admin/orders/:id/status` - Update order status
- `GET /api/admin/customers` - Get all customers

### System
- `GET /api/health` - Health check endpoint

## 🧪 Testing the Application

1. **Test database connection**:
   ```bash
   curl http://localhost:3000/api/health
   ```

2. **Test product listing**:
   ```bash
   curl http://localhost:3000/api/products
   ```

3. **Login as admin**:
   - Navigate to http://localhost:3000/login
   - Use the default admin credentials
   - Access admin dashboard

## 🐛 Troubleshooting

### Database Connection Issues
- Verify PostgreSQL is running: `pg_isready`
- Check credentials in `.env` file
- Ensure database exists: `psql -U postgres -l`

### Port Already in Use
- Change PORT in `.env` file
- Or kill the process using port 3000:
  ```bash
  # Windows
  netstat -ano | findstr :3000
  taskkill /PID <PID> /F
  
  # Mac/Linux
  lsof -ti:3000 | xargs kill -9
  ```

### Module Not Found Errors
- Delete `node_modules` and reinstall:
  ```bash
  rm -rf node_modules
  npm install
  ```

## 📝 Development Notes

- The application uses localStorage for cart management on the client side
- JWT tokens expire after 24 hours
- All passwords are hashed using bcryptjs with 10 salt rounds
- The admin authentication middleware is currently in development mode (bypassing for testing)
- Product images are stored as URLs in the database
- The application supports multiple payment methods including bank transfers

## 🚀 Performance & Caching Strategy

### Client-Side Caching (Browser Storage)
The application implements browser-based caching using **localStorage** to minimize redundant network requests and improve performance:

#### **Shopping Cart Cache**
- **Storage Key**: `shoppingCart`
- **Purpose**: Persist cart items across page refreshes and sessions
- **Implementation**: Cart data is stored locally and synchronized with the server only during checkout
- **Files**: `products.js`, `product-details.js`, `cart.js`, `categories.js`, `checkout.js`

#### **User Session Cache**
- **Storage Keys**: `currentUser`, `token`, `isLoggedIn`
- **Purpose**: Maintain user authentication state without repeated API calls
- **Implementation**: User data and JWT tokens are cached after login
- **Files**: `auth.js`, `main.js`, `profile.js`

#### **Order History Cache**
- **Storage Key**: `userOrders`
- **Purpose**: Store order confirmations for quick access
- **Implementation**: Orders are cached locally for order tracking and history
- **Files**: `checkout.js`, `order.js`, `order-tracking.js`

### Static Asset Serving
Static files (CSS, JS, images) are served via Express.js static middleware:
```javascript
app.use(express.static(path.join(__dirname, 'public')));
```

### Benefits
- **Reduced Server Load**: Cart operations don't require database queries until checkout
- **Faster Page Loads**: User data and cart persist without API calls
- **Offline Capability**: Cart and user data available even with poor connectivity
- **Better UX**: Instant cart updates and seamless navigation

## 🔒 Security Considerations

For production deployment:
- Change JWT_SECRET to a strong random string
- Enable HTTPS
- Implement rate limiting
- Add input sanitization
- Remove development authentication bypass
- Set secure cookie flags
- Implement CSRF protection

## 👥 Contributing

This is a student project for SE312 - Web Technologies I course.

**Team Members**: [Add your team member names here]

## 📄 License

This project is created for educational purposes as part of the SE312 course requirements.

## 📞 Support

For issues or questions:
- Check the troubleshooting section
- Review the API endpoints documentation
- Verify environment configuration

---

**Last Updated**: October 2025  
**Course**: SE312 - Web Technologies I  
**Institution**: [Your Institution Name]
