# ⚡ Quick Reference Guide

## Start Development (Fastest Route)

```bash
# 1. Navigate to project
cd "c:\Users\bhave\OneDrive\Desktop\MJ\Maniratna Inventory"

# 2. Install all dependencies (one-time)
npm run install:all

# 3. Configure MongoDB
# Edit backend/.env and add your MongoDB connection string

# 4. Start everything
npm run dev

# 5. Open browser
# Frontend: http://localhost:5173
# Backend: http://localhost:5000
```

---

## Key Commands

| Task | Command |
|------|---------|
| **Start all** | `npm run dev` |
| **Start backend only** | `npm run dev:backend` |
| **Start frontend only** | `npm run dev:frontend` |
| **Install dependencies** | `npm run install:all` |
| **Build for production** | `npm run build` |
| **Backend production** | `cd backend && npm start` |

---

## File Locations

| File | Purpose |
|------|---------|
| `backend/server.js` | Express server entry point |
| `frontend/src/App.jsx` | React main component |
| `backend/.env` | Backend configuration |
| `frontend/.env` | Frontend configuration |
| `README.md` | Project overview |
| `SETUP.md` | Detailed setup guide |
| `PROJECT_SUMMARY.md` | Complete feature list |
| `DEVELOPMENT_CHECKLIST.md` | Development guide |

---

## API Quick Test

```bash
# Health check
curl http://localhost:5000/api/health

# Login (create user first)
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@maniratna.com","password":"password123"}'

# List products (with token)
curl http://localhost:5000/api/products \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## Project Pages

| Page | URL | Purpose |
|------|-----|---------|
| Login | `/login` | User authentication |
| Dashboard | `/` | Overview & statistics |
| Products | `/products` | View & manage products |
| Add Product | `/products/add` | Create new product |
| Scanner | `/scanner` | Barcode operations |
| Transactions | `/transactions` | Audit trail |
| Reports | `/reports` | Analytics & insights |

---

## Database Collections

```javascript
// User: Authentication & roles
{ _id, name, email, password, role, isActive, lastLogin }

// Product: Inventory items
{ _id, productCode, category, weight, barcode, qrCode, status, notes }

// Transaction: Audit trail
{ _id, product, statusType, previousStatus, newStatus, weight, user, device }

// Category: Product types
{ _id, name, description, isActive }
```

---

## Environment Variables

### Backend (.env)
```
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/maniratna
JWT_SECRET=your_secret_key
PORT=5000
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173
```

### Frontend (.env)
```
VITE_API_URL=http://localhost:5000/api
```

---

## Common Tasks

### Add a New Product
```javascript
// API call
POST /api/products
{
  "productCode": "RING-001",
  "category": "Ladies Rings",
  "weight": { "gross": 2.5, "stone": 0.5, "tag": 0.1 },
  "barcode": "123456789",
  "notes": "Custom order"
}
```

### Stock In Product
```javascript
// API call
POST /api/transactions/stock-in
{
  "productId": "product_id_here",
  "device": "Desktop Scanner",
  "notes": "Received from factory"
}
```

### Stock Out Product
```javascript
// API call
POST /api/transactions/stock-out
{
  "productId": "product_id_here",
  "reason": "Customer Sale",
  "device": "Manual Entry",
  "notes": "Sold to customer"
}
```

### Get Dashboard Stats
```javascript
// API call
GET /api/analytics/dashboard
// Returns inventory, weights, today's activity
```

---

## Port Information

| Service | Port | URL |
|---------|------|-----|
| Backend API | 5000 | http://localhost:5000 |
| Frontend App | 5173 | http://localhost:5173 |
| MongoDB | 27017 | (Atlas cloud only) |

---

## Keyboard Shortcuts

| Action | Shortcut |
|--------|----------|
| Dev console (Frontend) | F12 |
| Toggle sidebar | (Built-in button) |
| Go to Dashboard | / |
| Go to Products | /products |
| Go to Scanner | /scanner |

---

## Troubleshooting Steps

**Backend won't start?**
1. Check port 5000 is free
2. Verify MongoDB connection
3. Run `cd backend && npm install`

**Frontend won't load?**
1. Clear browser cache
2. Check console for errors
3. Verify backend is running

**Products not showing?**
1. Check MongoDB is connected
2. Verify products exist in database
3. Check token is valid

---

## Documentation Files

| File | When to Read |
|------|-------------|
| `README.md` | Project overview |
| `SETUP.md` | Initial setup |
| `PROJECT_SUMMARY.md` | Feature details |
| `DEVELOPMENT_CHECKLIST.md` | Development guide |
| `DEVELOPMENT.md` | (This file) Quick reference |

---

## Next After Setup

1. ✅ Install dependencies
2. ✅ Configure MongoDB
3. ✅ Create admin user
4. ✅ Login to app
5. ✅ Add test products
6. ✅ Test transactions
7. ✅ Explore dashboard
8. ✅ Review code structure

Then:
- [ ] Customize categories
- [ ] Add more products
- [ ] Test scanner
- [ ] Deploy to production
- [ ] Add more features

---

## Resources

- 📖 **Full Guide**: Read `SETUP.md`
- 🎯 **Features**: See `PROJECT_SUMMARY.md`
- ✅ **Checklist**: Use `DEVELOPMENT_CHECKLIST.md`
- 📚 **Code**: Check `backend/` and `frontend/` folders

---

**Ready to code? Run:** `npm run dev`

**Need help?** Check the guides above!

Last Updated: June 2026
