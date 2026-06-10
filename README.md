# MANIRATNA JEWELS - Gold Jewellery Inventory Management Dashboard

A comprehensive MERN Stack (MongoDB, Express.js, React.js, Node.js) inventory management system for tracking gold jewellery stock using barcode/QR code scanning.

## Project Overview

This is an internal inventory management system exclusively for MANIRATNA JEWELS. It enables:

- **Product Entry**: Add jewellery products with weight details
- **Stock Tracking**: Real-time inventory management
- **Barcode Operations**: USB scanner (desktop) and camera scanning (mobile)
- **Sales Tracking**: Monitor sold and returned products
- **Analytics**: Comprehensive inventory insights with charts
- **Audit Trail**: Complete transaction history

### Key Features

✓ JWT Authentication with role-based access
✓ Product management with automatic net weight calculation
✓ Dual-mode barcode scanning (desktop USB + mobile camera)
✓ Real-time inventory updates
✓ Comprehensive analytics dashboard
✓ Transaction logging and audit trail
✓ Multi-device support (desktop, tablet, mobile)
✓ Reports generation
✓ Responsive design (Tailwind CSS + Material UI)

## Technology Stack

### Frontend
- **React** - UI framework
- **Tailwind CSS** - Utility-first styling
- **Material-UI** - Component library
- **React Router** - Client-side routing
- **Recharts** - Data visualization
- **html5-qrcode** - Barcode/QR scanning
- **Axios** - HTTP client

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - ODM
- **JWT** - Authentication
- **Bcryptjs** - Password hashing

### Hosting
- **Frontend**: Vercel
- **Backend**: Render
- **Database**: MongoDB Atlas

## Project Structure

```
Maniratna Inventory/
├── backend/
│   ├── models/
│   │   ├── Product.js
│   │   ├── Transaction.js
│   │   └── User.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── products.js
│   │   ├── transactions.js
│   │   └── analytics.js
│   ├── controllers/
│   ├── middleware/
│   ├── config/
│   ├── server.js
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Dashboard/
│   │   │   ├── Products/
│   │   │   ├── Scanning/
│   │   │   ├── Reports/
│   │   │   └── Auth/
│   │   ├── pages/
│   │   ├── hooks/
│   │   ├── utils/
│   │   ├── App.jsx
│   │   └── index.jsx
│   ├── public/
│   └── package.json
├── .gitignore
└── README.md
```

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- MongoDB Atlas account
- Git

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```env
PORT=5000
MONGODB_URI=your_mongodb_atlas_uri
JWT_SECRET=your_jwt_secret
NODE_ENV=development
```

4. Start backend server:
```bash
npm start
```

Backend server will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```env
VITE_API_URL=http://localhost:5000/api
```

4. Start frontend development server:
```bash
npm run dev
```

Frontend will run on `http://localhost:5173`

## Product Schema

### Basic Details
- **Product Code** (Unique) - SKU identifier
- **Category** - Earrings, Rings, Bracelets, etc.
- **Notes** - Additional information

### Weight Details
- **Gross Weight** - Total weight including stone and tag
- **Stone Weight** - Weight of stones
- **Tag Weight** - Weight of barcode tag
- **Net Weight** - Auto-calculated: Gross - Stone - Tag

### Inventory Details
- **Status** - In Stock / Sold / Returned

<!-- ### Barcode Details
- **Barcode Number** - Factory-printed barcode
- **QR Code** - Factory-printed QR code -->

## Core Modules

### 1. Authentication
- Admin login with JWT
- Session persistence
- Protected routes

### 2. Dashboard
- Inventory overview cards
- Stock status summary
- Daily activity feed
- Weight analytics

### 3. Product Management
- Add products manually or by barcode
- Edit product details
- Delete products
- Search functionality

<!-- ### 4. Barcode Scanning
- **Desktop**: USB barcode scanner support
- **Mobile**: Camera-based QR/barcode scanning
- Auto-fill product fields on scan -->

### 4. Stock Management
- Stock In: Add products to inventory
- Stock Out: Remove sold/returned products
- Real-time status updates

### 5. Analytics & Reports
- Inventory reports
- Sales reports
- Category-wise distribution
- Weight analysis
- Fast-moving products
- Dead stock detection

### 6. Transaction History
Complete audit trail with:
- Product details
- Action type
- Previous/new status
- Timestamp
- User information
- Device type

## API Endpoints

### Authentication
```
POST   /api/auth/login
POST   /api/auth/logout
POST   /api/auth/refresh
```

### Products
```
GET    /api/products
GET    /api/products/:id
GET    /api/products/code/:code
POST   /api/products
PUT    /api/products/:id
DELETE /api/products/:id
GET    /api/products/search?query=
```

### Stock Operations
```
POST   /api/transactions/stock-in
POST   /api/transactions/stock-out
GET    /api/transactions
```

### Analytics
```
GET    /api/analytics/dashboard
GET    /api/analytics/daily
GET    /api/analytics/category
GET    /api/analytics/weight
```

<!-- ## Barcode Scanning Guide

### Desktop USB Scanner
1. Click "Scan Product" button
2. Focus scanner input field
3. Scan barcode with USB scanner
4. System loads product details
5. Select action: Stock In, Stock Out, etc.

### Mobile Camera Scanner
1. Click camera icon
2. Grant camera permission
3. Point camera at barcode/QR code
4. System automatically detects and reads code
5. Product details load instantly
6. Select action -->

## Environment Variables

### Backend (.env)
```env
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/maniratna
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRE=7d
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:5000/api
```

## Development

### Running Both Servers (Concurrently)
From project root:
```bash
npm run dev
```

This requires `concurrently` package installed globally.

### Building for Production

Backend:
```bash
cd backend
npm run build
```

Frontend:
```bash
cd frontend
npm run build
```

## Deployment

### Frontend (Vercel)
```bash
npm install -g vercel
cd frontend
vercel
```

### Backend (Render)
- Connect GitHub repository
- Set environment variables
- Deploy main branch

### Database (MongoDB Atlas)
1. Create cluster on MongoDB Atlas
2. Create database user
3. Whitelist IP address
4. Get connection string
5. Update MONGODB_URI in backend .env

## Contributing

1. Create feature branch: `git checkout -b feature/feature-name`
2. Commit changes: `git commit -m 'Add feature'`
3. Push branch: `git push origin feature/feature-name`
4. Open Pull Request

## License

Private - MANIRATNA JEWELS

## Contact & Support

For technical support or inquiries, contact the development team.

---

**Last Updated**: June 2026
