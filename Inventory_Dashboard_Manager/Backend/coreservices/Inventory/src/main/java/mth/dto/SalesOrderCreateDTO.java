package mth.dto;

import jakarta.validation.constraints.*;
import java.util.List;

public class SalesOrderCreateDTO {

    @NotBlank(message = "Customer name is required")
    @Size(max = 200)
    private String customerName;

    @NotNull(message = "Order items are required")
    @Size(min = 1, message = "At least one order item is required")
    private List<OrderItemDTO> items;

    public SalesOrderCreateDTO() {
    }

    public SalesOrderCreateDTO(String customerName, List<OrderItemDTO> items) {
        this.customerName = customerName;
        this.items = items;
    }

    public String getCustomerName() {
        return customerName;
    }

    public void setCustomerName(String customerName) {
        this.customerName = customerName;
    }

    public List<OrderItemDTO> getItems() {
        return items;
    }

    public void setItems(List<OrderItemDTO> items) {
        this.items = items;
    }

    public static class OrderItemDTO {
        @NotNull(message = "Item ID is required")
        private Long itemId;

        @NotNull(message = "Quantity is required")
        @Min(value = 1, message = "Quantity must be >= 1")
        private Integer quantity;

        public OrderItemDTO() {
        }

        public OrderItemDTO(Long itemId, Integer quantity) {
            this.itemId = itemId;
            this.quantity = quantity;
        }

        public Long getItemId() {
            return itemId;
        }

        public void setItemId(Long itemId) {
            this.itemId = itemId;
        }

        public Integer getQuantity() {
            return quantity;
        }

        public void setQuantity(Integer quantity) {
            this.quantity = quantity;
        }

        @Override
        public String toString() {
            return "OrderItemDTO [itemId=" + itemId + ", quantity=" + quantity + "]";
        }
    }

    @Override
    public String toString() {
        return "SalesOrderCreateDTO [customerName=" + customerName + ", items=" + items + "]";
    }
}
