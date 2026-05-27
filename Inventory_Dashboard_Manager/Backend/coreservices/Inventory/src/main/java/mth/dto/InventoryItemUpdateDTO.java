package mth.dto;

public class InventoryItemUpdateDTO {
    private String name;
    private String description;
    private Integer quantity;
    private Double price;
    private String category;
    private Integer reorderLevel;
    private String sku;

    public InventoryItemUpdateDTO() {
    }

    public InventoryItemUpdateDTO(String name, String description, Integer quantity, Double price, String category, Integer reorderLevel, String sku) {
        this.name = name;
        this.description = description;
        this.quantity = quantity;
        this.price = price;
        this.category = category;
        this.reorderLevel = reorderLevel;
        this.sku = sku;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }

    public Double getPrice() {
        return price;
    }

    public void setPrice(Double price) {
        this.price = price;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public Integer getReorderLevel() {
        return reorderLevel;
    }

    public void setReorderLevel(Integer reorderLevel) {
        this.reorderLevel = reorderLevel;
    }

    public String getSku() {
        return sku;
    }

    public void setSku(String sku) {
        this.sku = sku;
    }

    @Override
    public String toString() {
        return "InventoryItemUpdateDTO [name=" + name + ", description=" + description + ", quantity=" + quantity
                + ", price=" + price + ", category=" + category + ", reorderLevel=" + reorderLevel + ", sku=" + sku
                + "]";
    }
}
