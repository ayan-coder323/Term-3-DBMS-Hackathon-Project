package mth.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import mth.dto.*;
import mth.entity.InventoryItem;
import mth.entity.StockMovement;
import mth.exception.DuplicateResourceException;
import mth.exception.ResourceNotFoundException;
import mth.repository.InventoryItemRepository;
import mth.repository.StockMovementRepository;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class InventoryService {

    private final InventoryItemRepository itemRepository;
    private final StockMovementRepository movementRepository;

    @Autowired
    public InventoryService(InventoryItemRepository itemRepository, StockMovementRepository movementRepository) {
        this.itemRepository = itemRepository;
        this.movementRepository = movementRepository;
    }

    /**
     * Get all inventory items.
     */
    public List<InventoryItemResponseDTO> getAllItems() {
        return itemRepository.findAll().stream()
                .map(this::toResponseDTO)
                .collect(Collectors.toList());
    }

    /**
     * Get item by ID.
     */
    public InventoryItemResponseDTO getItemById(Long id) {
        InventoryItem item = itemRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Inventory item not found with id: " + id));
        return toResponseDTO(item);
    }

    /**
     * Create a new inventory item.
     */
    public InventoryItemResponseDTO createItem(InventoryItemCreateDTO dto) {
        if (dto.getSku() != null && itemRepository.existsBySku(dto.getSku())) {
            throw new DuplicateResourceException("SKU already exists: " + dto.getSku());
        }

        InventoryItem item = new InventoryItem();
        item.setName(dto.getName());
        item.setDescription(dto.getDescription());
        item.setQuantity(dto.getQuantity());
        item.setPrice(dto.getPrice());
        item.setCategory(dto.getCategory());
        item.setReorderLevel(dto.getReorderLevel() != null ? dto.getReorderLevel() : 10);
        item.setSku(dto.getSku());

        InventoryItem saved = itemRepository.save(item);

        // Record stock movement
        StockMovement movement = new StockMovement();
        movement.setItemId(saved.getId());
        movement.setQuantityChange(saved.getQuantity());
        movement.setMovementType("purchase");
        movement.setNotes("Initial stock entry");
        movementRepository.save(movement);

        return toResponseDTO(saved);
    }

    /**
     * Update an inventory item.
     */
    public InventoryItemResponseDTO updateItem(Long id, InventoryItemUpdateDTO dto) {
        InventoryItem item = itemRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Inventory item not found with id: " + id));

        int oldQuantity = item.getQuantity();

        if (dto.getName() != null) item.setName(dto.getName());
        if (dto.getDescription() != null) item.setDescription(dto.getDescription());
        if (dto.getQuantity() != null) item.setQuantity(dto.getQuantity());
        if (dto.getPrice() != null) item.setPrice(dto.getPrice());
        if (dto.getCategory() != null) item.setCategory(dto.getCategory());
        if (dto.getReorderLevel() != null) item.setReorderLevel(dto.getReorderLevel());
        if (dto.getSku() != null) {
            if (!dto.getSku().equals(item.getSku()) && itemRepository.existsBySku(dto.getSku())) {
                throw new DuplicateResourceException("SKU already exists: " + dto.getSku());
            }
            item.setSku(dto.getSku());
        }

        InventoryItem saved = itemRepository.save(item);

        // Record stock movement if quantity changed
        if (dto.getQuantity() != null && dto.getQuantity() != oldQuantity) {
            StockMovement movement = new StockMovement();
            movement.setItemId(saved.getId());
            movement.setQuantityChange(dto.getQuantity() - oldQuantity);
            movement.setMovementType("adjustment");
            movement.setNotes("Stock adjustment via update");
            movementRepository.save(movement);
        }

        return toResponseDTO(saved);
    }

    /**
     * Delete an inventory item.
     */
    public void deleteItem(Long id) {
        if (!itemRepository.existsById(id)) {
            throw new ResourceNotFoundException("Inventory item not found with id: " + id);
        }
        itemRepository.deleteById(id);
    }

    /**
     * Get items by category.
     */
    public List<InventoryItemResponseDTO> getItemsByCategory(String category) {
        return itemRepository.findByCategoryIgnoreCase(category).stream()
                .map(this::toResponseDTO)
                .collect(Collectors.toList());
    }

    /**
     * Search items by name.
     */
    public List<InventoryItemResponseDTO> searchItems(String query) {
        return itemRepository.findByNameContainingIgnoreCase(query).stream()
                .map(this::toResponseDTO)
                .collect(Collectors.toList());
    }

    /**
     * Get low stock items.
     */
    public List<InventoryItemResponseDTO> getLowStockItems() {
        return itemRepository.findLowStockItems().stream()
                .map(this::toResponseDTO)
                .collect(Collectors.toList());
    }

    /**
     * Convert entity to response DTO.
     */
    private InventoryItemResponseDTO toResponseDTO(InventoryItem item) {
        InventoryItemResponseDTO dto = new InventoryItemResponseDTO();
        dto.setId(item.getId());
        dto.setName(item.getName());
        dto.setDescription(item.getDescription());
        dto.setQuantity(item.getQuantity());
        dto.setPrice(item.getPrice());
        dto.setCategory(item.getCategory());
        dto.setReorderLevel(item.getReorderLevel());
        dto.setSku(item.getSku());
        dto.setCreatedAt(item.getCreatedAt());
        dto.setUpdatedAt(item.getUpdatedAt());
        return dto;
    }
}
