package mth.dto;

import java.time.LocalDateTime;

public class InventoryItemResponseDTO {
    private Long id;
    private String name;
    private String description;
    private Integer quantity;
    private Double price;
    private String category;
    private Integer reorderLevel;
    private String sku;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public InventoryItemResponseDTO() {
    }

    public InventoryItemResponseDTO(Long id, String name, String description, Integer quantity, Double price, String category, Integer reorderLevel, String sku, LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.quantity = quantity;
        this.price = price;
        this.category = category;
        this.reorderLevel = reorderLevel;
        this.sku = sku;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    @Override
    public String toString() {
        return "InventoryItemResponseDTO [id=" + id + ", name=" + name + ", description=" + description + ", quantity="
                + quantity + ", price=" + price + ", category=" + category + ", reorderLevel=" + reorderLevel + ", sku="
                + sku + ", createdAt=" + createdAt + ", updatedAt=" + updatedAt + "]";
    }
}
