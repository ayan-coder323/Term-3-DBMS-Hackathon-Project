package mth.dto;

import java.time.LocalDateTime;
import java.util.List;

public class SalesOrderResponseDTO {
    private Long id;
    private String orderNumber;
    private String customerName;
    private Double totalAmount;
    private String status;
    private List<SalesOrderItemDTO> items;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public SalesOrderResponseDTO() {
    }

    public SalesOrderResponseDTO(Long id, String orderNumber, String customerName, Double totalAmount, String status, List<SalesOrderItemDTO> items, LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.orderNumber = orderNumber;
        this.customerName = customerName;
        this.totalAmount = totalAmount;
        this.status = status;
        this.items = items;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getOrderNumber() {
        return orderNumber;
    }

    public void setOrderNumber(String orderNumber) {
        this.orderNumber = orderNumber;
    }

    public String getCustomerName() {
        return customerName;
    }

    public void setCustomerName(String customerName) {
        this.customerName = customerName;
    }

    public Double getTotalAmount() {
        return totalAmount;
    }

    public void setTotalAmount(Double totalAmount) {
        this.totalAmount = totalAmount;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public List<SalesOrderItemDTO> getItems() {
        return items;
    }

    public void setItems(List<SalesOrderItemDTO> items) {
        this.items = items;
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

    public static class SalesOrderItemDTO {
        private Long id;
        private Long itemId;
        private String itemName;
        private Integer quantity;
        private Double unitPrice;
        private Double lineTotal;

        public SalesOrderItemDTO() {
        }

        public SalesOrderItemDTO(Long id, Long itemId, String itemName, Integer quantity, Double unitPrice, Double lineTotal) {
            this.id = id;
            this.itemId = itemId;
            this.itemName = itemName;
            this.quantity = quantity;
            this.unitPrice = unitPrice;
            this.lineTotal = lineTotal;
        }

        public Long getId() {
            return id;
        }

        public void setId(Long id) {
            this.id = id;
        }

        public Long getItemId() {
            return itemId;
        }

        public void setItemId(Long itemId) {
            this.itemId = itemId;
        }

        public String getItemName() {
            return itemName;
        }

        public void setItemName(String itemName) {
            this.itemName = itemName;
        }

        public Integer getQuantity() {
            return quantity;
        }

        public void setQuantity(Integer quantity) {
            this.quantity = quantity;
        }

        public Double getUnitPrice() {
            return unitPrice;
        }

        public void setUnitPrice(Double unitPrice) {
            this.unitPrice = unitPrice;
        }

        public Double getLineTotal() {
            return lineTotal;
        }

        public void setLineTotal(Double lineTotal) {
            this.lineTotal = lineTotal;
        }

        @Override
        public String toString() {
            return "SalesOrderItemDTO [id=" + id + ", itemId=" + itemId + ", itemName=" + itemName + ", quantity="
                    + quantity + ", unitPrice=" + unitPrice + ", lineTotal=" + lineTotal + "]";
        }
    }

    @Override
    public String toString() {
        return "SalesOrderResponseDTO [id=" + id + ", orderNumber=" + orderNumber + ", customerName=" + customerName
                + ", totalAmount=" + totalAmount + ", status=" + status + ", items=" + items + ", createdAt=" + createdAt
                + ", updatedAt=" + updatedAt + "]";
    }
}
