package mth.dto;

public class DashboardMetricsDTO {
    private int totalItems;
    private double totalValue;
    private int lowStockItems;
    private int categoriesCount;
    private double revenueToday;
    private int ordersToday;

    public DashboardMetricsDTO() {
    }

    public DashboardMetricsDTO(int totalItems, double totalValue, int lowStockItems, int categoriesCount, double revenueToday, int ordersToday) {
        this.totalItems = totalItems;
        this.totalValue = totalValue;
        this.lowStockItems = lowStockItems;
        this.categoriesCount = categoriesCount;
        this.revenueToday = revenueToday;
        this.ordersToday = ordersToday;
    }

    public int getTotalItems() {
        return totalItems;
    }

    public void setTotalItems(int totalItems) {
        this.totalItems = totalItems;
    }

    public double getTotalValue() {
        return totalValue;
    }

    public void setTotalValue(double totalValue) {
        this.totalValue = totalValue;
    }

    public int getLowStockItems() {
        return lowStockItems;
    }

    public void setLowStockItems(int lowStockItems) {
        this.lowStockItems = lowStockItems;
    }

    public int getCategoriesCount() {
        return categoriesCount;
    }

    public void setCategoriesCount(int categoriesCount) {
        this.categoriesCount = categoriesCount;
    }

    public double getRevenueToday() {
        return revenueToday;
    }

    public void setRevenueToday(double revenueToday) {
        this.revenueToday = revenueToday;
    }

    public int getOrdersToday() {
        return ordersToday;
    }

    public void setOrdersToday(int ordersToday) {
        this.ordersToday = ordersToday;
    }

    @Override
    public String toString() {
        return "DashboardMetricsDTO [totalItems=" + totalItems + ", totalValue=" + totalValue + ", lowStockItems="
                + lowStockItems + ", categoriesCount=" + categoriesCount + ", revenueToday=" + revenueToday
                + ", ordersToday=" + ordersToday + "]";
    }
}
