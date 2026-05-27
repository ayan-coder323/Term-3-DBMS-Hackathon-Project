# FastAPI Inventory Dashboard Manager - Quick Start Guide

## 📋 What Has Been Created

Your FastAPI gateway project is now fully structured with all necessary files:

### ✅ Project Structure
```
gateway/
├── Controllers/
│   ├── __init__.py
│   ├── authController.py              # User authentication endpoints
│   └── analyticsController.py         # Dashboard & analytics endpoints
├── Services/
│   ├── __init__.py
│   ├── authService.py                 # JWT & password management
│   └── analyticsService.py            # Business logic for analytics
├── Models/
│   ├── __init__.py
│   └── schemas.py                     # Pydantic validation models
├── config.py                          # Configuration management
├── database.py                        # Database setup (future)
├── models_db.py                       # SQLAlchemy models (future)
├── utils.py                           # Utility functions
├── main.py                            # FastAPI application
├── run.py                             # Server runner
├── requirements.txt                   # Python dependencies
├── .env.example                       # Environment template
├── README.md                          # Full documentation
└── QUICKSTART.md                      # This file
```

## 🚀 Quick Setup (5 minutes)

### Step 1: Install Dependencies
```bash
cd Backend/gateway
pip install -r requirements.txt
```

### Step 2: Set Environment Variables
```bash
# Copy template to .env
cp .env.example .env

# On Windows:
# copy .env.example .env
```

### Step 3: Run the Server
```bash
python run.py
```

You should see:
```
INFO:     Uvicorn running on http://0.0.0.0:8001
INFO:     Application startup complete
```

### Step 4: Test the API
Open your browser and go to:
- **API Docs**: http://localhost:8001/docs
- **Alternative Docs**: http://localhost:8001/redoc

## 📌 Default Test Accounts

Try logging in with these credentials in the API documentation:

**Admin User:**
- Email: `admin@example.com`
- Password: `admin123`

**Regular User:**
- Email: `user@example.com`
- Password: `user123`

## 🔑 Key Endpoints

### Authentication
```
POST   /api/auth/register           # Create new account
POST   /api/auth/login              # Login & get token
GET    /api/auth/me                 # Get current user
POST   /api/auth/refresh-token      # Refresh JWT token
POST   /api/auth/logout             # Logout
```

### Analytics
```
GET    /api/analytics/dashboard     # Dashboard metrics
GET    /api/analytics/stock-alerts  # Stock alerts
GET    /api/analytics/sales-metrics # Sales data
GET    /api/analytics/categories    # Category breakdown
```

## 🎯 What's Included

### Authentication System
- ✅ JWT token-based authentication
- ✅ Password hashing with bcrypt
- ✅ Role-based access control (Admin, Manager, User)
- ✅ Token refresh mechanism
- ✅ User registration & login

### Analytics Engine
- ✅ Dashboard metrics (total items, inventory value, alerts)
- ✅ Category-wise analytics
- ✅ Stock level monitoring
- ✅ Sales metrics & trends
- ✅ Low stock alerts
- ✅ Inventory turnover calculations
- ✅ Top selling items

### Data Validation
- ✅ Pydantic schemas for all requests/responses
- ✅ Email validation
- ✅ Price & quantity validation
- ✅ Role-based validation

### Security
- ✅ CORS configured for frontend
- ✅ JWT authentication
- ✅ Password hashing
- ✅ Input validation
- ✅ Error handling

## 🔧 Configuration

Edit `.env` file to customize:

```env
# Server
PORT=8001                              # Server port
HOST=0.0.0.0                          # Server host

# Security
SECRET_KEY=change-this-in-production  # JWT secret
ACCESS_TOKEN_EXPIRE_MINUTES=30        # Token expiration

# Frontend
FRONTEND_URL=http://localhost:5173   # Frontend URL

# Database
DATABASE_URL=sqlite:///./inventory.db # Database connection
```

## 📚 File Descriptions

| File | Purpose |
|------|---------|
| `main.py` | FastAPI app setup, routes, middleware |
| `run.py` | Server launcher with uvicorn |
| `config.py` | Centralized configuration |
| `utils.py` | Helper functions (validation, calculations) |
| `database.py` | Database connection setup |
| `models_db.py` | SQLAlchemy ORM models (for future DB integration) |
| `Controllers/authController.py` | Auth endpoints |
| `Controllers/analyticsController.py` | Analytics endpoints |
| `Services/authService.py` | JWT & password logic |
| `Services/analyticsService.py` | Analytics calculations |
| `Models/schemas.py` | Pydantic validation schemas |

## 🔗 Frontend Integration

Connect your React frontend to this API:

```javascript
// Example: Login
const response = await fetch('http://localhost:8001/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'admin@example.com',
    password: 'admin123'
  })
});

const { access_token } = await response.json();

// Example: Get dashboard data
const dashboard = await fetch('http://localhost:8001/api/analytics/dashboard', {
  headers: { 'Authorization': `Bearer ${access_token}` }
});

const metrics = await dashboard.json();
```

## 🐛 Common Issues

### Error: "Port 8001 already in use"
```bash
# Use different port
uvicorn main:app --port 8002
```

### Error: "Module not found"
```bash
# Reinstall dependencies
pip install -r requirements.txt
```

### CORS Error in Frontend
- Ensure frontend URL is in `CORS_ORIGINS` in `config.py`
- Check that `Authorization` header is being sent

## 📈 Next Steps

1. **Connect to Database**: Update `database.py` and `models_db.py` with actual database
2. **Add More Endpoints**: Create new controllers for inventory management
3. **Implement Business Logic**: Replace mock data in services with real logic
4. **Add Tests**: Create pytest tests for endpoints
5. **Deploy**: Use Docker, Heroku, AWS, etc.

## 🎓 Learning Resources

- FastAPI Docs: https://fastapi.tiangolo.com/
- Pydantic: https://docs.pydantic.dev/
- SQLAlchemy: https://www.sqlalchemy.org/
- JWT Auth: https://python-jose.readthedocs.io/

## 📞 Need Help?

Refer to the full `README.md` for detailed documentation on:
- All endpoints with examples
- Error handling
- Security best practices
- Database integration
- Performance optimization

---

**Happy Coding! 🚀**
