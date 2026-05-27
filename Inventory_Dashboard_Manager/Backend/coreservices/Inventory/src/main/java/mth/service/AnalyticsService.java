package mth.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import mth.dto.CategoryAnalyticsDTO;
import mth.dto.DashboardMetricsDTO;
import mth.dto.SalesMetricsDTO;
import mth.dto.StockAlertDTO;
import mth.entity.InventoryItem;
import mth.entity.SalesOrder;
import mth.entity.SalesOrderItem;
import mth.repository.InventoryItemRepository;
import mth.repository.SalesOrderItemRepository;
import mth.repository.SalesOrderRepository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class AnalyticsService {

    private final InventoryItemRepository itemRepository;
    private final SalesOrderRepository salesOrderRepository;
    private final SalesOrderItemRepository salesOrderItemRepository;

    @Autowired
    public AnalyticsService(InventoryItemRepository itemRepository,
                            SalesOrderRepository salesOrderRepository,
                            SalesOrderItemRepository salesOrderItemRepository) {
        this.itemRepository = itemRepository;
        this.salesOrderRepository = salesOrderRepository;
        this.salesOrderItemRepository = salesOrderItemRepository;
    }

    public DashboardMetricsDTO getDashboardMetrics() {
        Long totalItemsObj = itemRepository.calculateTotalItemCount();
        int totalItems = totalItemsObj != null ? totalItemsObj.intValue() : 0;

        Double totalValueObj = itemRepository.calculateTotalInventoryValue();
        double totalValue = totalValueObj != null ? totalValueObj : 0.0;

        Long lowStockObj = itemRepository.countLowStockItems();
        int lowStockItems = lowStockObj != null ? lowStockObj.intValue() : 0;

        int categoriesCount = itemRepository.findDistinctCategories().size();

        LocalDateTime startOfToday = LocalDate.now().atStartOfDay();
        Double revenueTodayObj = salesOrderRepository.calculateRevenueSince(startOfToday);
        double revenueToday = revenueTodayObj != null ? revenueTodayObj : 0.0;

        Long ordersTodayObj = salesOrderRepository.countOrdersSince(startOfToday);
        int ordersToday = ordersTodayObj != null ? ordersTodayObj.intValue() : 0;

        DashboardMetricsDTO dto = new DashboardMetricsDTO();
        dto.setTotalItems(totalItems);
        dto.setTotalValue(Math.round(totalValue * 100.0) / 100.0);
        dto.setLowStockItems(lowStockItems);
        dto.setCategoriesCount(categoriesCount);
        dto.setRevenueToday(Math.round(revenueToday * 100.0) / 100.0);
        dto.setOrdersToday(ordersToday);
        return dto;
    }

    public List<CategoryAnalyticsDTO> getCategoryAnalytics() {
        List<InventoryItem> items = itemRepository.findAll();
        Map<String, List<InventoryItem>> itemsByCategory = items.stream()
                .collect(Collectors.groupingBy(InventoryItem::getCategory));

        List<CategoryAnalyticsDTO> analytics = new ArrayList<>();
        for (Map.Entry<String, List<InventoryItem>> entry : itemsByCategory.entrySet()) {
            String category = entry.getKey();
            List<InventoryItem> catItems = entry.getValue();

            int count = catItems.size();
            double totalVal = catItems.stream()
                    .mapToDouble(i -> i.getQuantity() * i.getPrice())
                    .sum();
            double avgPrice = catItems.stream()
                    .mapToDouble(InventoryItem::getPrice)
                    .average()
                    .orElse(0.0);

            CategoryAnalyticsDTO dto = new CategoryAnalyticsDTO();
            dto.setCategory(category);
            dto.setItemCount(count);
            dto.setTotalValue(Math.round(totalVal * 100.0) / 100.0);
            dto.setAveragePrice(Math.round(avgPrice * 100.0) / 100.0);
            analytics.add(dto);
        }

        analytics.sort((a, b) -> Double.compare(b.getTotalValue(), a.getTotalValue()));
        return analytics;
    }

    public List<StockAlertDTO> getStockAlerts() {
        List<InventoryItem> lowStockItems = itemRepository.findLowStockItems();
        List<StockAlertDTO> alerts = new ArrayList<>();

        for (InventoryItem item : lowStockItems) {
            String status = "normal";
            if (item.getQuantity() == 0) {
                status = "critical";
            } else if (item.getQuantity() <= item.getReorderLevel() / 2) {
                status = "critical";
            } else if (item.getQuantity() <= item.getReorderLevel()) {
                status = "low";
            }

            StockAlertDTO dto = new StockAlertDTO();
            dto.setItemId(item.getId());
            dto.setItemName(item.getName());
            dto.setCurrentQuantity(item.getQuantity());
            dto.setReorderLevel(item.getReorderLevel());
            dto.setStatus(status);
            alerts.add(dto);
        }

        alerts.sort(Comparator.comparingInt(StockAlertDTO::getCurrentQuantity));
        return alerts;
    }

    public Map<String, Object> getInventorySummary() {
        List<InventoryItem> items = itemRepository.findAll();
        Long totalCountObj = itemRepository.calculateTotalItemCount();
        long totalCount = totalCountObj != null ? totalCountObj : 0L;
        Double totalValueObj = itemRepository.calculateTotalInventoryValue();
        double totalValue = totalValueObj != null ? totalValueObj : 0.0;
        List<String> categories = itemRepository.findDistinctCategories();

        Map<String, Object> summary = new HashMap<>();
        summary.put("items", items);
        summary.put("total_count", totalCount);
        summary.put("categories", categories);
        summary.put("total_value", Math.round(totalValue * 100.0) / 100.0);
        summary.put("timestamp", LocalDateTime.now().toString());

        return summary;
    }

    public List<SalesMetricsDTO> getSalesMetrics(int days) {
        List<SalesMetricsDTO> metrics = new ArrayList<>();
        LocalDate today = LocalDate.now();

        for (int i = 0; i < days; i++) {
            LocalDate date = today.minusDays(i);
            LocalDateTime start = date.atStartOfDay();
            LocalDateTime end = date.atTime(LocalTime.MAX);

            List<SalesOrder> orders = salesOrderRepository.findByCreatedAtBetween(start, end);
            double totalSales = orders.stream()
                    .mapToDouble(SalesOrder::getTotalAmount)
                    .sum();

            int itemsSold = 0;
            for (SalesOrder o : orders) {
                List<SalesOrderItem> orderItems = salesOrderItemRepository.findByOrderId(o.getId());
                itemsSold += orderItems.stream()
                        .mapToInt(SalesOrderItem::getQuantity)
                        .sum();
            }

            double avgOrderVal = orders.isEmpty() ? 0.0 : totalSales / orders.size();

            SalesMetricsDTO dto = new SalesMetricsDTO();
            dto.setDate(date.format(DateTimeFormatter.ISO_LOCAL_DATE));
            dto.setTotalSales(Math.round(totalSales * 100.0) / 100.0);
            dto.setItemsSold(itemsSold);
            dto.setRevenue(Math.round(totalSales * 100.0) / 100.0); // matching revenue to totalSales
            dto.setAverageOrderValue(Math.round(avgOrderVal * 100.0) / 100.0);
            metrics.add(dto);
        }

        return metrics;
    }

    public List<Map<String, Object>> getTopSellingItems(int limit) {
        List<SalesOrderItem> allItems = salesOrderItemRepository.findAll();
        Map<Long, Double> revenueMap = allItems.stream()
                .collect(Collectors.groupingBy(SalesOrderItem::getItemId,
                        Collectors.summingDouble(SalesOrderItem::getLineTotal)));

        List<Map.Entry<Long, Double>> sortedItems = new ArrayList<>(revenueMap.entrySet());
        sortedItems.sort((a, b) -> Double.compare(b.getValue(), a.getValue()));

        List<Map<String, Object>> result = new ArrayList<>();
        for (int i = 0; i < Math.min(limit, sortedItems.size()); i++) {
            Map.Entry<Long, Double> entry = sortedItems.get(i);
            Long itemId = entry.getKey();
            Double revenue = entry.getValue();

            InventoryItem item = itemRepository.findById(itemId).orElse(null);
            if (item != null) {
                Map<String, Object> map = new HashMap<>();
                map.put("id", item.getId());
                map.put("name", item.getName());
                map.put("quantity", item.getQuantity());
                map.put("price", item.getPrice());
                map.put("category", item.getCategory());
                map.put("reorder_level", item.getReorderLevel());
                map.put("sku", item.getSku());
                map.put("revenue", Math.round(revenue * 100.0) / 100.0);
                result.add(map);
            }
        }

        return result;
    }

    public Map<String, Object> calculateTurnoverMetrics() {
        Double totalValueObj = itemRepository.calculateTotalInventoryValue();
        double totalValue = totalValueObj != null ? totalValueObj : 0.0;

        Long totalItemsObj = itemRepository.calculateTotalItemCount();
        long totalItems = totalItemsObj != null ? totalItemsObj : 0L;

        List<InventoryItem> items = itemRepository.findAll();
        double averagePrice = items.isEmpty() ? 0.0 : totalValue / items.size();

        int categoryCount = itemRepository.findDistinctCategories().size();

        // Calculate a simple turnover rate: cost of goods sold (COGS) / average inventory.
        // For simplicity, we can use (total revenue from sales orders last 30 days) / (total inventory value + 1.0).
        LocalDateTime thirtyDaysAgo = LocalDateTime.now().minusDays(30);
        Double recentRevenueObj = salesOrderRepository.calculateRevenueSince(thirtyDaysAgo);
        double recentRevenue = recentRevenueObj != null ? recentRevenueObj : 0.0;
        double turnoverRate = totalValue == 0 ? 0.0 : recentRevenue / totalValue;

        Map<String, Object> result = new HashMap<>();
        result.put("total_inventory_value", Math.round(totalValue * 100.0) / 100.0);
        result.put("total_items_count", totalItems);
        result.put("average_item_price", Math.round(averagePrice * 100.0) / 100.0);
        result.put("categories", categoryCount);
        result.put("turnover_rate", Math.round(turnoverRate * 100.0) / 100.0);

        return result;
    }
}
