package mth.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import mth.dto.*;
import mth.service.AnalyticsService;
import mth.service.InventoryService;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/analytics")
public class AnalyticsController {

    private final AnalyticsService analyticsService;
    private final InventoryService inventoryService;

    public AnalyticsController(AnalyticsService analyticsService, InventoryService inventoryService) {
        this.analyticsService = analyticsService;
        this.inventoryService = inventoryService;
    }


    @GetMapping("/dashboard")
    public ResponseEntity<ApiResponseDTO<DashboardMetricsDTO>> getDashboardMetrics() {
        DashboardMetricsDTO metrics = analyticsService.getDashboardMetrics();
        return ResponseEntity.ok(ApiResponseDTO.success(metrics, "Dashboard metrics retrieved"));
    }

    @GetMapping("/categories")
    public ResponseEntity<ApiResponseDTO<List<CategoryAnalyticsDTO>>> getCategoryAnalytics() {
        List<CategoryAnalyticsDTO> analytics = analyticsService.getCategoryAnalytics();
        return ResponseEntity.ok(ApiResponseDTO.success(analytics, "Category analytics retrieved"));
    }

    @GetMapping("/stock-alerts")
    public ResponseEntity<ApiResponseDTO<List<StockAlertDTO>>> getStockAlerts() {
        List<StockAlertDTO> alerts = analyticsService.getStockAlerts();
        return ResponseEntity.ok(ApiResponseDTO.success(alerts, "Stock alerts retrieved"));
    }

    @GetMapping("/inventory-summary")
    public ResponseEntity<ApiResponseDTO<Map<String, Object>>> getInventorySummary() {
        Map<String, Object> summary = analyticsService.getInventorySummary();
        return ResponseEntity.ok(ApiResponseDTO.success(summary, "Inventory summary retrieved"));
    }

    @GetMapping("/low-stock")
    public ResponseEntity<ApiResponseDTO<List<InventoryItemResponseDTO>>> getLowStockItems() {
        List<InventoryItemResponseDTO> items = inventoryService.getLowStockItems();
        return ResponseEntity.ok(ApiResponseDTO.success(items, "Low stock items retrieved"));
    }

    @GetMapping("/sales-metrics")
    public ResponseEntity<ApiResponseDTO<List<SalesMetricsDTO>>> getSalesMetrics(@RequestParam(defaultValue = "7") int days) {
        List<SalesMetricsDTO> metrics = analyticsService.getSalesMetrics(days);
        return ResponseEntity.ok(ApiResponseDTO.success(metrics, "Sales metrics retrieved"));
    }

    @GetMapping("/top-selling-items")
    public ResponseEntity<ApiResponseDTO<List<Map<String, Object>>>> getTopSellingItems(@RequestParam(defaultValue = "5") int limit) {
        List<Map<String, Object>> items = analyticsService.getTopSellingItems(limit);
        return ResponseEntity.ok(ApiResponseDTO.success(items, "Top selling items retrieved"));
    }

    @GetMapping("/category/{categoryName}")
    public ResponseEntity<ApiResponseDTO<Map<String, Object>>> getInventoryByCategory(@PathVariable String categoryName) {
        List<InventoryItemResponseDTO> items = inventoryService.getItemsByCategory(categoryName);
        Map<String, Object> result = new HashMap<>();
        result.put("category", categoryName);
        result.put("items", items);
        result.put("total", items.size());
        return ResponseEntity.ok(ApiResponseDTO.success(result, "Category items retrieved"));
    }

    @GetMapping("/turnover-metrics")
    public ResponseEntity<ApiResponseDTO<Map<String, Object>>> getTurnoverMetrics() {
        Map<String, Object> metrics = analyticsService.calculateTurnoverMetrics();
        return ResponseEntity.ok(ApiResponseDTO.success(metrics, "Turnover metrics retrieved"));
    }
}
