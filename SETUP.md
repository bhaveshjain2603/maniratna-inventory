# MANIRATNA Inventory System - Quick Start Guide

## Project Setup Complete ✅

Your MERN Stack Inventory Management System has been fully scaffolded and is ready for development.

## Installation Instructions

### 1. Install All Dependencies

From the project root directory, run:

```bash
# Install root dependencies
npm install

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install

# Return to root
cd ..
```

Or use the convenience script:
```bash
npm run install:all
```

## Environment Configuration

### Backend Setup

1. Copy the example environment file:
```bash
cd backend
cp .env.example .env
```

2. Update `backend/.env` with your values:
```env
# MongoDB Connection
MONGODB_URI=mongodb+srv://your_username:your_password@cluster.mongodb.net/maniratna

# JWT Secret (Generate a strong secret for production)
JWT_SECRET=your_super_secret_key_here

# Port
PORT=5000

# Node Environment
NODE_ENV=development
```

### Frontend Setup

1. Copy the example environment file:
```bash
cd frontend
cp .env.example .env
```

2. Update `frontend/.env`:
```env
VITE_API_URL=http://localhost:5000/api
```

## MongoDB Atlas Setup

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a cluster
3. Create a database user
4. Whitelist your IP address
5. Get connection string
6. Update `MONGODB_URI` in `backend/.env`

## Running the Application

### Development Mode (Both Frontend & Backend)

From the root directory:

```bash
npm run dev
```

This starts:
- Backend API on `http://localhost:5000`
- Frontend App on `http://localhost:5173`

### Backend Only

```bash
npm run dev:backend
```

### Frontend Only

```bash
npm run dev:frontend
```

## Accessing the Application

Once both servers are running:

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000/api
- **Health Check**: http://localhost:5000/api/health

## Default Login Credentials

For testing (you'll need to create users first):

```
Email: admin@maniratna.com
Password: (set during user registration)
```

## Project Structure

```
Maniratna Inventory/
├── backend/
│   ├── models/
│   │   ├── User.js
│   │   ├── Product.js
│   │   ├── Transaction.js
│   │   └── Category.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── productController.js
│   │   ├── transactionController.js
│   │   └── analyticsController.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── products.js
│   │   ├── transactions.js
│   │   └── analytics.js
│   ├── middleware/
│   │   └── auth.js
│   ├── utils/
│   │   └── helpers.js
│   ├── server.js
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Layout.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   ├── pages/
│   │   │   ├── LoginPage.jsx
│   │   │   ├── DashboardPage.jsx
│   │   │   ├── ProductsPage.jsx
│   │   │   ├── AddProductPage.jsx
│   │   │   ├── ScannerPage.jsx
│   │   │   ├── TransactionsPage.jsx
│   │   │   └── ReportsPage.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── hooks/
│   │   │   └── useAuth.js
│   │   ├── utils/
│   │   │   ├── api.js
│   │   │   └── formatters.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── package.json
├── package.json
├── README.md
└── .gitignore
```

## Key Features Ready for Development

### Authentication Module ✅
- JWT-based login
- Protected routes
- User session management
- Admin role support

### Product Management ✅
- Add products with weight calculations
- Manual entry or barcode scanning
- Product search and filtering
- Category management
- Auto-calculated net weight (Gross - Stone - Tag)

### Inventory Operations ✅
- Stock In: Add products to inventory
- Stock Out: Remove sold/returned products
- Transaction logging with audit trail
- Multiple device support (desktop scanner, mobile, manual)

### Analytics Dashboard ✅
- Real-time inventory statistics
- Product status distribution
- Weight analytics
- Daily activity tracking
- Category-wise breakdown

### Scanner Integration ✅
- Desktop USB barcode scanner support
- Framework ready for QR code scanning (html5-qrcode)
- Auto-product lookup
- Quick action buttons (Stock In, Stock Out, etc.)

### Reports Module ✅
- Category distribution reports
- Dead stock analysis (90+ days inactive)
- Fast-moving products report
- Sales and inventory reports

### Transaction History ✅
- Complete audit trail
- Filter by action type and date range
- Device tracking (desktop/mobile)
- User tracking

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - User logout

### Products
- `GET /api/products` - List all products
- `GET /api/products/:id` - Get product by ID
- `GET /api/products/code/:code` - Get product by code
- `GET /api/products/search?barcode=` - Search by barcode
- `POST /api/products` - Create product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product

### Transactions
- `GET /api/transactions` - Get all transactions
- `GET /api/transactions/daily` - Today's transactions
- `POST /api/transactions/stock-in` - Record stock in
- `POST /api/transactions/stock-out` - Record stock out

### Analytics
- `GET /api/analytics/dashboard` - Dashboard statistics
- `GET /api/analytics/category` - Category distribution
- `GET /api/analytics/status` - Status breakdown
- `GET /api/analytics/monthly` - Monthly movement
- `GET /api/analytics/weight` - Weight trends
- `GET /api/analytics/dead-stock` - Dead stock report
- `GET /api/analytics/fast-moving` - Fast-moving products

## Next Steps for Development

1. **Create Admin User**
   - Use API endpoint or MongoDB directly
   - Email: admin@maniratna.com
   - Password: (set during creation)

2. **Test Core Features**
   - Login with admin credentials
   - Add test products
   - Test stock operations
   - Verify transaction logging

3. **Barcode Scanner Setup** (Mobile)
   - Install on mobile device
   - Test QR/barcode scanning
   - Verify product lookup

4. **Customize Categories**
   - Add custom product categories
   - Update product list

5. **Production Deployment**
   - Frontend: Deploy to Vercel
   - Backend: Deploy to Render
   - Database: Use MongoDB Atlas (already configured)

## Troubleshooting

### Backend not starting
- Verify MongoDB connection string
- Check MongoDB Atlas whitelist includes your IP
- Ensure port 5000 is not in use

### Frontend not loading
- Clear browser cache
- Check `.env` file has correct API URL
- Verify backend is running

### Authentication issues
- Check JWT_SECRET is set in backend .env
- Verify tokens are being stored in localStorage

## Support & Documentation

- Backend: See `backend/` folder README
- Frontend: See `frontend/` folder README
- Main: See [README.md](README.md)

## Build for Production

```bash
# Build backend
npm run build:backend

# Build frontend
npm run build:frontend
```

---

**Project Created**: June 2026
**Version**: 1.0.0
**Status**: Development Ready ✅
