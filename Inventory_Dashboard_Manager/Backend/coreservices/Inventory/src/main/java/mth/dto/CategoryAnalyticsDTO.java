package mth.dto;

public class CategoryAnalyticsDTO {
    private String category;
    private int itemCount;
    private double totalValue;
    private double averagePrice;

    public CategoryAnalyticsDTO() {
    }

    public CategoryAnalyticsDTO(String category, int itemCount, double totalValue, double averagePrice) {
        this.category = category;
        this.itemCount = itemCount;
        this.totalValue = totalValue;
        this.averagePrice = averagePrice;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public int getItemCount() {
        return itemCount;
    }

    public void setItemCount(int itemCount) {
        this.itemCount = itemCount;
    }

    public double getTotalValue() {
        return totalValue;
    }

    public void setTotalValue(double totalValue) {
        this.totalValue = totalValue;
    }

    public double getAveragePrice() {
        return averagePrice;
    }

    public void setAveragePrice(double averagePrice) {
        this.averagePrice = averagePrice;
    }

    @Override
    public String toString() {
        return "CategoryAnalyticsDTO [category=" + category + ", itemCount=" + itemCount + ", totalValue=" + totalValue
                + ", averagePrice=" + averagePrice + "]";
    }
}
