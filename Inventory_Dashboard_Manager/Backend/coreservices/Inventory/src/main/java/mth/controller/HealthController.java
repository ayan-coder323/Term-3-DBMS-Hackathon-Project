package mth.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
public class HealthController {

    @GetMapping("/health")
    public ResponseEntity<Map<String, String>> healthCheck() {
        Map<String, String> response = new HashMap<>();
        response.put("status", "healthy");
        response.put("service", "Inventory Dashboard Manager Core Service");
        return ResponseEntity.ok(response);
    }

    @GetMapping("/api/info")
    public ResponseEntity<Map<String, Object>> apiInfo() {
        Map<String, Object> response = new HashMap<>();
        response.put("api_name", "Inventory Dashboard Manager Core Service");
        response.put("version", "1.0.0");
        
        Map<String, String> endpoints = new HashMap<>();
        endpoints.put("auth", "/api/auth/**");
        endpoints.put("inventory", "/api/inventory/**");
        endpoints.put("analytics", "/api/analytics/**");
        endpoints.put("sales", "/api/sales/**");
        endpoints.put("categories", "/api/categories/**");
        
        response.put("endpoints", endpoints);
        return ResponseEntity.ok(response);
    }
}
