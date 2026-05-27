package mth.controller;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import mth.dto.ApiResponseDTO;
import mth.dto.InventoryItemCreateDTO;
import mth.dto.InventoryItemResponseDTO;
import mth.dto.InventoryItemUpdateDTO;
import mth.service.InventoryService;

import java.util.List;

@RestController
@RequestMapping("/api/inventory")
public class InventoryController {

    private final InventoryService inventoryService;

    public InventoryController(InventoryService inventoryService) {
        this.inventoryService = inventoryService;
    }


    @GetMapping
    public ResponseEntity<ApiResponseDTO<List<InventoryItemResponseDTO>>> getAllItems() {
        List<InventoryItemResponseDTO> items = inventoryService.getAllItems();
        return ResponseEntity.ok(ApiResponseDTO.success(items, "Inventory items retrieved"));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponseDTO<InventoryItemResponseDTO>> getItemById(@PathVariable Long id) {
        InventoryItemResponseDTO item = inventoryService.getItemById(id);
        return ResponseEntity.ok(ApiResponseDTO.success(item, "Inventory item retrieved"));
    }

    @PostMapping
    public ResponseEntity<ApiResponseDTO<InventoryItemResponseDTO>> createItem(@Valid @RequestBody InventoryItemCreateDTO dto) {
        InventoryItemResponseDTO created = inventoryService.createItem(dto);
        return new ResponseEntity<>(ApiResponseDTO.success(created, "Inventory item created"), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponseDTO<InventoryItemResponseDTO>> updateItem(@PathVariable Long id, @Valid @RequestBody InventoryItemUpdateDTO dto) {
        InventoryItemResponseDTO updated = inventoryService.updateItem(id, dto);
        return ResponseEntity.ok(ApiResponseDTO.success(updated, "Inventory item updated"));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponseDTO<Void>> deleteItem(@PathVariable Long id) {
        inventoryService.deleteItem(id);
        return ResponseEntity.ok(ApiResponseDTO.success(null, "Inventory item deleted successfully"));
    }

    @GetMapping("/search")
    public ResponseEntity<ApiResponseDTO<List<InventoryItemResponseDTO>>> searchItems(@RequestParam String query) {
        List<InventoryItemResponseDTO> items = inventoryService.searchItems(query);
        return ResponseEntity.ok(ApiResponseDTO.success(items, "Search results for: " + query));
    }

    @GetMapping("/low-stock")
    public ResponseEntity<ApiResponseDTO<List<InventoryItemResponseDTO>>> getLowStockItems() {
        List<InventoryItemResponseDTO> items = inventoryService.getLowStockItems();
        return ResponseEntity.ok(ApiResponseDTO.success(items, "Low stock items retrieved"));
    }

    @GetMapping("/category/{category}")
    public ResponseEntity<ApiResponseDTO<List<InventoryItemResponseDTO>>> getItemsByCategory(@PathVariable String category) {
        List<InventoryItemResponseDTO> items = inventoryService.getItemsByCategory(category);
        return ResponseEntity.ok(ApiResponseDTO.success(items, "Items in category: " + category));
    }
}
