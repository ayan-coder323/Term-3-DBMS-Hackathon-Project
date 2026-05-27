package mth.dto;

public class SalesMetricsDTO {
    private String date;
    private double totalSales;
    private int itemsSold;
    private double revenue;
    private double averageOrderValue;

    public SalesMetricsDTO() {
    }

    public SalesMetricsDTO(String date, double totalSales, int itemsSold, double revenue, double averageOrderValue) {
        this.date = date;
        this.totalSales = totalSales;
        this.itemsSold = itemsSold;
        this.revenue = revenue;
        this.averageOrderValue = averageOrderValue;
    }

    public String getDate() {
        return date;
    }

    public void setDate(String date) {
        this.date = date;
    }

    public double getTotalSales() {
        return totalSales;
    }

    public void setTotalSales(double totalSales) {
        this.totalSales = totalSales;
    }

    public int getItemsSold() {
        return itemsSold;
    }

    public void setItemsSold(int itemsSold) {
        this.itemsSold = itemsSold;
    }

    public double getRevenue() {
        return revenue;
    }

    public void setRevenue(double revenue) {
        this.revenue = revenue;
    }

    public double getAverageOrderValue() {
        return averageOrderValue;
    }

    public void setAverageOrderValue(double averageOrderValue) {
        this.averageOrderValue = averageOrderValue;
    }

    @Override
    public String toString() {
        return "SalesMetricsDTO [date=" + date + ", totalSales=" + totalSales + ", itemsSold=" + itemsSold
                + ", revenue=" + revenue + ", averageOrderValue=" + averageOrderValue + "]";
    }
}
