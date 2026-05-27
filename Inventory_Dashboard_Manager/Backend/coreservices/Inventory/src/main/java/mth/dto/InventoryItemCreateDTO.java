package mth.dto;

import jakarta.validation.constraints.*;

public class InventoryItemCreateDTO {

    @NotBlank(message = "Name is required")
    @Size(min = 1, max = 200)
    private String name;

    private String description;

    @NotNull(message = "Quantity is required")
    @Min(value = 0, message = "Quantity must be >= 0")
    private Integer quantity;

    @NotNull(message = "Price is required")
    @DecimalMin(value = "0.01", message = "Price must be > 0")
    private Double price;

    @NotBlank(message = "Category is required")
    private String category;

    @Min(value = 0, message = "Reorder level must be >= 0")
    private Integer reorderLevel = 10;

    private String sku;

    public InventoryItemCreateDTO() {
    }

    public InventoryItemCreateDTO(String name, String description, Integer quantity, Double price, String category, Integer reorderLevel, String sku) {
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
        return "InventoryItemCreateDTO [name=" + name + ", description=" + description + ", quantity=" + quantity
                + ", price=" + price + ", category=" + category + ", reorderLevel=" + reorderLevel + ", sku=" + sku
                + "]";
    }
}
