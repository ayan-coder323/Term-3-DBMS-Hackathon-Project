package mth.dto;

public class StockAlertDTO {
    private Long itemId;
    private String itemName;
    private int currentQuantity;
    private int reorderLevel;
    private String status; // "critical", "low", "normal"

    public StockAlertDTO() {
    }

    public StockAlertDTO(Long itemId, String itemName, int currentQuantity, int reorderLevel, String status) {
        this.itemId = itemId;
        this.itemName = itemName;
        this.currentQuantity = currentQuantity;
        this.reorderLevel = reorderLevel;
        this.status = status;
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

    public int getCurrentQuantity() {
        return currentQuantity;
    }

    public void setCurrentQuantity(int currentQuantity) {
        this.currentQuantity = currentQuantity;
    }

    public int getReorderLevel() {
        return reorderLevel;
    }

    public void setReorderLevel(int reorderLevel) {
        this.reorderLevel = reorderLevel;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    @Override
    public String toString() {
        return "StockAlertDTO [itemId=" + itemId + ", itemName=" + itemName + ", currentQuantity=" + currentQuantity
                + ", reorderLevel=" + reorderLevel + ", status=" + status + "]";
    }
}
