import os
from dotenv import load_dotenv

load_dotenv()


class Settings:
    """Application settings and configuration"""
    
    # API Configuration
    API_TITLE = "Inventory Dashboard Manager API"
    API_DESCRIPTION = "Complete REST API for Inventory Management and Analytics"
    API_VERSION = "1.0.0"
    
    # Server Configuration
    HOST = os.getenv("HOST", "0.0.0.0")
    PORT = int(os.getenv("PORT", 8001))
    RELOAD = os.getenv("RELOAD", True)
    
    # JWT Configuration
    SECRET_KEY = os.getenv("SECRET_KEY", "qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM0987654321")
    ALGORITHM = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", 30))

    
    # Database Configuration
    DATABASE_URL = os.getenv(
        "DATABASE_URL",
        "sqlite:///./inventory.db"
    )
    
    # CORS Configuration
    CORS_ORIGINS = [
        "http://localhost:5173",
        "http://localhost:3000",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:3000",
    ]
    CORS_CREDENTIALS = True
    CORS_METHODS = ["*"]
    CORS_HEADERS = ["*"]
    
    # Logging
    LOG_LEVEL = os.getenv("LOG_LEVEL", "INFO")
    
    # Frontend Configuration
    FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:5173")
    
    # Email Configuration (for notifications)
    SMTP_SERVER = os.getenv("SMTP_SERVER", "smtp.gmail.com")
    SMTP_PORT = int(os.getenv("SMTP_PORT", 587))
    SMTP_USER = os.getenv("SMTP_USER", "")
    SMTP_PASSWORD = os.getenv("SMTP_PASSWORD", "")
    
    # Inventory Configuration
    LOW_STOCK_WARNING_THRESHOLD = int(os.getenv("LOW_STOCK_WARNING_THRESHOLD", 10))
    CRITICAL_STOCK_THRESHOLD = int(os.getenv("CRITICAL_STOCK_THRESHOLD", 5))
    
    # Pagination
    DEFAULT_SKIP = 0
    DEFAULT_LIMIT = 10
    MAX_LIMIT = 100

    # Spring Boot backend URL
    SPRING_BOOT_URL = os.getenv("SPRING_BOOT_URL", "http://localhost:8083")


# Create settings instance
settings = Settings()

