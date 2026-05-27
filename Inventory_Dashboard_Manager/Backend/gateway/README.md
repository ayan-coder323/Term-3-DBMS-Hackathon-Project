# Inventory Dashboard Manager - Gateway API

A complete FastAPI-based REST API gateway for managing and analyzing inventory with comprehensive dashboard metrics.

## Features

- ✅ **Authentication & Authorization** - JWT-based authentication with role-based access control
- ✅ **Inventory Management** - Create, read, update, delete inventory items
- ✅ **Analytics & Reporting** - Comprehensive dashboard metrics and analytics
- ✅ **Stock Alerts** - Real-time stock level monitoring and alerts
- ✅ **Sales Metrics** - Track sales performance and trends
- ✅ **Category Analysis** - Detailed analytics by product category
- ✅ **CORS Support** - Configured for frontend integration
- ✅ **Auto Documentation** - Interactive API documentation with Swagger UI

## Project Structure

```
gateway/
├── Controllers/
│   ├── __init__.py
│   ├── authController.py       # Authentication endpoints
│   └── analyticsController.py  # Analytics endpoints
├── Services/
│   ├── __init__.py
│   ├── authService.py          # Authentication logic & JWT
│   └── analyticsService.py     # Analytics business logic
├── Models/
│   ├── __init__.py
│   └── schemas.py              # Pydantic schemas & validation
├── config.py                    # Configuration management
├── main.py                      # FastAPI app setup
├── run.py                       # Application runner
├── requirements.txt             # Python dependencies
├── .env.example                 # Environment variables template
└── README.md                    # This file
```

## Installation & Setup

### Prerequisites
- Python 3.8+
- pip or conda

### 1. Clone/Navigate to Project
```bash
cd Backend/gateway
```

### 2. Install Dependencies
```bash
pip install -r requirements.txt
```

### 3. Configure Environment Variables
```bash
# Copy .env.example to .env
cp .env.example .env

# Edit .env with your settings
```

### 4. Run the Application
```bash
# Option 1: Direct with run.py
python run.py

# Option 2: Using uvicorn directly
uvicorn main:app --host 0.0.0.0 --port 8001 --reload
```

The API will be available at: `http://localhost:8001`

## API Documentation

Once the server is running, access the interactive API documentation:

- **Swagger UI**: http://localhost:8001/docs
- **ReDoc**: http://localhost:8001/redoc
- **OpenAPI Schema**: http://localhost:8001/openapi.json

## API Endpoints

### Authentication Endpoints (`/api/auth`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/register` | Register new user |
| POST | `/login` | Login and get access token |
| GET | `/me` | Get current user info (requires auth) |
| POST | `/refresh-token` | Refresh access token |
| POST | `/logout` | Logout user |
| GET | `/verify-token` | Verify token validity |

### Analytics Endpoints (`/api/analytics`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/dashboard` | Get dashboard metrics overview |
| GET | `/categories` | Get analytics by category |
| GET | `/stock-alerts` | Get stock alerts |
| GET | `/inventory-summary` | Get complete inventory summary |
| GET | `/low-stock` | Get items below reorder level |
| GET | `/sales-metrics` | Get sales metrics |
| GET | `/top-selling-items` | Get top selling items |
| GET | `/category/{category_name}` | Get items by category |
| GET | `/turnover-metrics` | Get inventory turnover metrics |

## Example Usage

### 1. Register New User
```bash
curl -X POST "http://localhost:8001/api/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "john_doe",
    "email": "john@example.com",
    "password": "securepass123",
    "role": "user"
  }'
```

### 2. Login
```bash
curl -X POST "http://localhost:8001/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "securepass123"
  }'
```

### 3. Get Dashboard Metrics (Requires Authentication)
```bash
curl -X GET "http://localhost:8001/api/analytics/dashboard" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### 4. Get Stock Alerts
```bash
curl -X GET "http://localhost:8001/api/analytics/stock-alerts" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

## Authentication

The API uses JWT (JSON Web Tokens) for authentication:

1. User registers or logs in
2. Server returns an `access_token`
3. Include token in request headers: `Authorization: Bearer <token>`
4. Token expires after configured time (default: 30 minutes)
5. Use `/refresh-token` endpoint to get a new token

## Default Test Users

For quick testing, these users are pre-configured:

| Email | Password | Role |
|-------|----------|------|
| admin@example.com | admin123 | admin |
| user@example.com | user123 | user |

## Configuration

Edit `config.py` or `.env` file to customize:

- **PORT**: API server port (default: 8001)
- **SECRET_KEY**: JWT secret key (CHANGE IN PRODUCTION)
- **ACCESS_TOKEN_EXPIRE_MINUTES**: Token expiration time
- **DATABASE_URL**: Database connection string
- **CORS_ORIGINS**: Allowed frontend origins
- **LOW_STOCK_WARNING_THRESHOLD**: Stock alert threshold

## Data Models

### User Model
```json
{
  "id": 1,
  "username": "john_doe",
  "email": "john@example.com",
  "role": "user",
  "created_at": "2024-01-01T00:00:00"
}
```

### Inventory Item
```json
{
  "id": 1,
  "name": "Laptop",
  "description": "Dell Laptop 15 inch",
  "quantity": 50,
  "price": 999.99,
  "category": "Electronics",
  "reorder_level": 10
}
```

### Dashboard Metrics
```json
{
  "total_items": 200,
  "total_value": 50000.00,
  "low_stock_items": 5,
  "categories_count": 8,
  "revenue_today": 2500.50,
  "orders_today": 12
}
```

## Frontend Integration

The API is pre-configured for frontend integration. Make requests from frontend to:

```javascript
const API_URL = 'http://localhost:8001';

// Login
const response = await fetch(`${API_URL}/api/auth/login`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'user@example.com',
    password: 'password123'
  })
});

const { access_token } = await response.json();

// Get dashboard metrics with authentication
const metrics = await fetch(`${API_URL}/api/analytics/dashboard`, {
  headers: { 'Authorization': `Bearer ${access_token}` }
});
```

## Error Handling

The API returns standardized error responses:

```json
{
  "detail": "Invalid or expired token"
}
```

Common HTTP Status Codes:
- **200**: Success
- **201**: Created
- **400**: Bad Request
- **401**: Unauthorized
- **404**: Not Found
- **422**: Validation Error
- **500**: Server Error

## Security Notes

⚠️ **Important for Production:**

1. Change `SECRET_KEY` in `.env` to a strong random string
2. Use HTTPS/TLS in production
3. Set secure CORS origins (not `*`)
4. Implement database instead of mock data
5. Use environment-specific configurations
6. Enable HTTPS for all API calls
7. Implement rate limiting
8. Add request validation and sanitization

## Development

### Run with Debug Logging
```bash
export LOG_LEVEL=DEBUG
python run.py
```

### Run Tests (when implemented)
```bash
pytest
```

### Format Code
```bash
black .
```

## Database Integration (Future)

To connect to a real database:

1. Install database driver (e.g., `pip install psycopg2-binary` for PostgreSQL)
2. Update `DATABASE_URL` in `.env`
3. Implement SQLAlchemy models and repositories
4. Replace mock data with database queries

## Performance Tips

- Use database indexing on frequently queried fields
- Implement caching for analytics endpoints
- Add pagination for large datasets
- Use async/await for I/O operations
- Monitor API response times

## Troubleshooting

### Port Already in Use
```bash
# Use a different port
uvicorn main:app --port 8002
```

### CORS Errors
- Verify frontend URL is in `CORS_ORIGINS` in config.py
- Check browser console for specific error messages
- Ensure credentials are included in cross-origin requests

### Authentication Failures
- Verify token is included in Authorization header
- Check token expiration time
- Use `/verify-token` endpoint to debug token issues

## Contributing

1. Create feature branches
2. Add tests for new endpoints
3. Update documentation
4. Submit pull requests

## License

[Specify your license here]

## Support

For issues or questions, please contact the development team.

---

**Last Updated**: January 2024
**Version**: 1.0.0
