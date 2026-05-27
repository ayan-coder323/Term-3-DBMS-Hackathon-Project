"""Utility functions for the application"""

from datetime import datetime
from typing import Dict, Any
import json


class ResponseFormatter:
    """Format API responses consistently"""
    
    @staticmethod
    def success(data: Any, message: str = "Success", code: int = 200) -> Dict:
        """Format success response"""
        return {
            "status": "success",
            "code": code,
            "message": message,
            "data": data,
            "timestamp": datetime.now().isoformat()
        }
    
    @staticmethod
    def error(message: str, code: int = 400, details: Any = None) -> Dict:
        """Format error response"""
        response = {
            "status": "error",
            "code": code,
            "message": message,
            "timestamp": datetime.now().isoformat()
        }
        
        if details:
            response["details"] = details
        
        return response


class ValidationHelper:
    """Helper functions for validation"""
    
    @staticmethod
    def validate_email(email: str) -> bool:
        """Validate email format"""
        import re
        pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
        return re.match(pattern, email) is not None
    
    @staticmethod
    def validate_price(price: float) -> bool:
        """Validate price"""
        return isinstance(price, (int, float)) and price > 0
    
    @staticmethod
    def validate_quantity(quantity: int) -> bool:
        """Validate quantity"""
        return isinstance(quantity, int) and quantity >= 0


class CalculationHelper:
    """Helper functions for calculations"""
    
    @staticmethod
    def calculate_inventory_value(quantity: int, price: float) -> float:
        """Calculate inventory value"""
        return round(quantity * price, 2)
    
    @staticmethod
    def calculate_percentage(part: float, total: float) -> float:
        """Calculate percentage"""
        if total == 0:
            return 0
        return round((part / total) * 100, 2)
    
    @staticmethod
    def calculate_average(values: list) -> float:
        """Calculate average"""
        if not values:
            return 0
        return round(sum(values) / len(values), 2)


class DateTimeHelper:
    """Helper functions for date and time"""
    
    @staticmethod
    def get_current_datetime() -> str:
        """Get current datetime as ISO string"""
        return datetime.now().isoformat()
    
    @staticmethod
    def get_current_date() -> str:
        """Get current date as ISO string"""
        return datetime.now().date().isoformat()
    
    @staticmethod
    def is_past_date(date_str: str) -> bool:
        """Check if date is in the past"""
        try:
            date = datetime.fromisoformat(date_str)
            return date < datetime.now()
        except:
            return False


class PaginationHelper:
    """Helper functions for pagination"""
    
    @staticmethod
    def paginate(items: list, skip: int = 0, limit: int = 10) -> Dict:
        """Paginate items"""
        total = len(items)
        paginated_items = items[skip:skip + limit]
        
        return {
            "total": total,
            "skip": skip,
            "limit": limit,
            "items": paginated_items,
            "has_more": (skip + limit) < total
        }
    
    @staticmethod
    def get_offset_limit(page: int = 1, page_size: int = 10) -> tuple:
        """Calculate offset and limit from page number"""
        skip = (page - 1) * page_size
        return skip, page_size


class JSONEncoder:
    """Custom JSON encoding helpers"""
    
    @staticmethod
    def serialize_datetime(obj):
        """Serialize datetime objects"""
        if isinstance(obj, datetime):
            return obj.isoformat()
        raise TypeError(f"Object of type {type(obj)} is not JSON serializable")
