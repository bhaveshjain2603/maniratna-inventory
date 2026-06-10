# 📋 Development Checklist - MANIRATNA Inventory System

## ✅ Project Setup Complete

### Backend Setup
- [x] Express.js server configured
- [x] MongoDB models created (User, Product, Transaction, Category)
- [x] Authentication middleware implemented
- [x] CORS configured
- [x] Error handling middleware
- [x] All routes created
- [x] All controllers implemented
- [x] Helper utilities added
- [x] Environment configuration template

### Frontend Setup
- [x] React + Vite configured
- [x] Tailwind CSS setup
- [x] React Router configured
- [x] Auth context created
- [x] Protected routes implemented
- [x] All pages created
- [x] Layout component with navigation
- [x] API client with interceptors
- [x] Formatters and utilities
- [x] Material-UI icons integrated

### Project Configuration
- [x] .gitignore file
- [x] Root package.json with scripts
- [x] Backend .env.example
- [x] Frontend .env.example
- [x] README.md documentation
- [x] SETUP.md guide
- [x] PROJECT_SUMMARY.md
- [x] GitHub copilot-instructions tracking

---

## 📌 Before Running

### Must Do
- [ ] Install dependencies: `npm run install:all`
- [ ] Copy backend/.env.example to backend/.env
- [ ] Copy frontend/.env.example to frontend/.env
- [ ] Set MongoDB connection string in backend/.env
- [ ] Set API URL in frontend/.env (if different from default)

### Should Do
- [ ] Read SETUP.md for detailed instructions
- [ ] Review README.md for project overview
- [ ] Check PROJECT_SUMMARY.md for feature details
- [ ] Verify MongoDB Atlas account is ready

---

## 🚀 Getting Started

### Step 1: Install Dependencies
```bash
cd "Maniratna Inventory"
npm run install:all
```
Time: ~5-10 minutes

### Step 2: Configure Environment
```bash
# Backend configuration
cd backend
cp .env.example .env
# Edit .env with:
# - MONGODB_URI (from MongoDB Atlas)
# - JWT_SECRET (any random string)
# - PORT (default 5000)

# Frontend configuration
cd ../frontend
cp .env.example .env
# Default values should work
```

### Step 3: Start Development
```bash
# From root directory
npm run dev
```

Access:
- Frontend: http://localhost:5173
- Backend: http://localhost:5000
- API Health: http://localhost:5000/api/health

---

## 🎯 First Time Usage

### 1. Create Admin User (Choose One)

**Option A: Using API**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Admin User",
    "email": "admin@maniratna.com",
    "password": "YourSecurePassword123",
    "role": "admin"
  }'
```

**Option B: Direct MongoDB**
Use MongoDB Atlas console to insert:
```json
{
  "name": "Admin User",
  "email": "admin@maniratna.com",
  "password": "hashed_password_here",
  "role": "admin",
  "isActive": true
}
```

### 2. Login to Frontend
- Go to http://localhost:5173
- Enter email and password
- You should see the dashboard

### 3. Add Test Products
1. Go to Products page
2. Click "Add Product"
3. Fill in details:
   - Product Code: RING-001
   - Category: Ladies Rings
   - Gross Weight: 2.5g
   - Stone Weight: 0.5g
   - Tag Weight: 0.1g
   - (Net Weight auto-calculates: 2.5 - 0.5 - 0.1 = 1.9g)
4. Save

### 4. Test Stock Operations
1. Go to Scanner page
2. Click "Activate Scanner"
3. For testing (without actual scanner):
   - Go to Products, copy a barcode
   - Manual testing of transactions via API

### 5. View Dashboard
1. Go to Dashboard
2. Verify statistics update
3. Check charts display

---

## 🔧 Development Commands

### Root Level
```bash
npm run dev              # Start both frontend & backend
npm run dev:backend      # Start backend only
npm run dev:frontend     # Start frontend only
npm run build            # Build both for production
npm run install:all      # Install all dependencies
```

### Backend
```bash
npm run dev              # Start with nodemon
npm run build            # Prepare for production
npm start                # Production start
```

### Frontend
```bash
npm run dev              # Start Vite dev server
npm run build            # Build for production
npm run preview          # Preview production build
npm run lint             # Run ESLint
```

---

## 🧪 Testing Checklist

### Authentication
- [ ] Login with valid credentials
- [ ] Login fails with invalid credentials
- [ ] Protected routes redirect to login
- [ ] Logout clears session
- [ ] Token persists on page refresh

### Products
- [ ] Add new product
- [ ] Edit existing product
- [ ] Delete product
- [ ] Search by code
- [ ] Search by barcode
- [ ] Filter by category
- [ ] Filter by status
- [ ] Net weight auto-calculates correctly

### Inventory Operations
- [ ] Stock In updates status
- [ ] Stock Out with different reasons
- [ ] Transactions appear in history
- [ ] Daily activity tracked
- [ ] Device type recorded

### Scanner
- [ ] USB scanner input focus works
- [ ] Product lookup by barcode
- [ ] Quick action buttons appear
- [ ] Transaction logs created

### Analytics & Reports
- [ ] Dashboard stats load
- [ ] Charts render correctly
- [ ] Dead stock report shows inactive items
- [ ] Fast-moving report shows top sellers
- [ ] Category distribution displays

---

## 📊 Database Verification

### Check MongoDB Connection
```javascript
// In browser console after logging in:
fetch('http://localhost:5000/api/health')
  .then(r => r.json())
  .then(d => console.log(d))
```

Expected response:
```json
{"status": "Server running"}
```

### MongoDB Atlas Dashboard
1. Go to https://cloud.mongodb.com
2. Select your cluster
3. View collections under "maniratna" database:
   - users
   - products
   - transactions
   - categories

---

## 🐛 Troubleshooting

### Backend Won't Start
- [ ] Check port 5000 is not in use
- [ ] Verify MongoDB connection string
- [ ] Check .env file exists and has MONGODB_URI
- [ ] Check Node.js version (should be 14+)
- [ ] Run `npm install` in backend folder

### Frontend Won't Load
- [ ] Check port 5173 is not in use
- [ ] Clear browser cache (Ctrl+Shift+Delete)
- [ ] Check .env file has VITE_API_URL
- [ ] Open browser DevTools console for errors

### API Calls Failing
- [ ] Verify backend is running
- [ ] Check CORS settings in backend
- [ ] Verify .env VITE_API_URL matches backend URL
- [ ] Check authentication token in localStorage

### Database Connection Failed
- [ ] Verify MONGODB_URI in backend/.env
- [ ] Check IP whitelist in MongoDB Atlas
- [ ] Verify MongoDB cluster is active
- [ ] Test connection string in MongoDB Compass

---

## 📝 Code Style & Best Practices

### Backend
- Use async/await for promises
- Validate inputs with express-validator
- Return consistent JSON responses
- Use middleware for error handling
- Document API endpoints

### Frontend
- Use functional components with hooks
- Lift state to nearest common parent
- Extract reusable components
- Use custom hooks for logic
- Add error boundaries

### Database
- Always use indexes for queries
- Sanitize inputs before saving
- Use transactions for multi-document operations
- Add timestamps to documents
- Archive old data periodically

---

## 🚢 Production Deployment

### Before Deploying
- [ ] Set NODE_ENV=production in backend
- [ ] Update CORS_ORIGIN to production domain
- [ ] Use strong JWT_SECRET
- [ ] Enable HTTPS
- [ ] Set up error logging
- [ ] Configure backup strategy

### Frontend Deployment (Vercel)
```bash
cd frontend
npm install -g vercel
vercel
```

### Backend Deployment (Render)
1. Push code to GitHub
2. Connect Render to GitHub repository
3. Set environment variables in Render dashboard
4. Deploy from main branch

### Database
- Use MongoDB Atlas (already configured)
- Enable authentication
- Set up IP whitelist
- Configure backup frequency
- Monitor performance metrics

---

## 📚 Additional Resources

### Documentation
- [Express.js Docs](https://expressjs.com)
- [React Docs](https://react.dev)
- [Vite Docs](https://vitejs.dev)
- [Tailwind CSS Docs](https://tailwindcss.com)
- [MongoDB Docs](https://docs.mongodb.com)
- [Recharts Docs](https://recharts.org)

### Learning Resources
- Barcode Scanning: html5-qrcode docs
- JWT: jwt.io
- MongoDB Design: MongoDB Atlas documentation

---

## 🎓 Next Steps for Learning

1. **Understand Architecture**
   - Review Backend structure
   - Study Frontend component hierarchy
   - Learn API design patterns

2. **Extend Features**
   - Add email notifications
   - Implement advanced filtering
   - Build mobile app

3. **Optimize Performance**
   - Add caching layers
   - Optimize database queries
   - Implement pagination

4. **Improve Security**
   - Add rate limiting
   - Implement request signing
   - Add encryption

---

## ✨ Success Indicators

Your setup is successful when:

✅ `npm run dev` starts both servers without errors
✅ Frontend loads at http://localhost:5173
✅ Backend health check returns 200
✅ Can login with created credentials
✅ Can create and view products
✅ Dashboard shows real-time statistics
✅ Transactions log operations
✅ All pages are responsive

---

## 📞 Support

If you encounter issues:

1. Check the [SETUP.md](./SETUP.md) guide
2. Review [PROJECT_SUMMARY.md](./PROJECT_SUMMARY.md)
3. Check server console for error messages
4. Verify all environment variables are set
5. Ensure MongoDB is accessible
6. Check browser DevTools for frontend errors

---

**You're ready to start development! Happy coding! 🚀**

Last Updated: June 2026
