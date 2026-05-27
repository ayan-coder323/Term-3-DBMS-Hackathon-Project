package mth.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import mth.dto.SalesOrderCreateDTO;
import mth.dto.SalesOrderResponseDTO;
import mth.entity.InventoryItem;
import mth.entity.SalesOrder;
import mth.entity.SalesOrderItem;
import mth.entity.StockMovement;
import mth.exception.ResourceNotFoundException;
import mth.repository.InventoryItemRepository;
import mth.repository.SalesOrderItemRepository;
import mth.repository.SalesOrderRepository;
import mth.repository.StockMovementRepository;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class SalesOrderService {

    private final SalesOrderRepository salesOrderRepository;
    private final SalesOrderItemRepository salesOrderItemRepository;
    private final InventoryItemRepository inventoryItemRepository;
    private final StockMovementRepository stockMovementRepository;

    @Autowired
    public SalesOrderService(SalesOrderRepository salesOrderRepository,
                             SalesOrderItemRepository salesOrderItemRepository,
                             InventoryItemRepository inventoryItemRepository,
                             StockMovementRepository stockMovementRepository) {
        this.salesOrderRepository = salesOrderRepository;
        this.salesOrderItemRepository = salesOrderItemRepository;
        this.inventoryItemRepository = inventoryItemRepository;
        this.stockMovementRepository = stockMovementRepository;
    }

    @Transactional
    public SalesOrderResponseDTO createOrder(SalesOrderCreateDTO dto) {
        // Generate order number
        String orderNumber = "ORD-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();

        SalesOrder order = new SalesOrder();
        order.setOrderNumber(orderNumber);
        order.setCustomerName(dto.getCustomerName());
        order.setStatus("completed"); // default completed or pending
        order.setTotalAmount(0.0);

        SalesOrder savedOrder = salesOrderRepository.save(order);
        List<SalesOrderItem> orderItems = new ArrayList<>();
        double totalAmount = 0.0;

        for (SalesOrderCreateDTO.OrderItemDTO itemDto : dto.getItems()) {
            InventoryItem item = inventoryItemRepository.findById(itemDto.getItemId())
                    .orElseThrow(() -> new ResourceNotFoundException("Inventory item not found with id: " + itemDto.getItemId()));

            if (item.getQuantity() < itemDto.getQuantity()) {
                throw new IllegalArgumentException("Insufficient stock for item: " + item.getName() + 
                        ". Available: " + item.getQuantity() + ", Requested: " + itemDto.getQuantity());
            }

            // Deduct stock
            item.setQuantity(item.getQuantity() - itemDto.getQuantity());
            inventoryItemRepository.save(item);

            // Record stock movement
            StockMovement movement = new StockMovement();
            movement.setItemId(item.getId());
            movement.setQuantityChange(-itemDto.getQuantity());
            movement.setMovementType("sale");
            movement.setReferenceId(String.valueOf(savedOrder.getId()));
            movement.setNotes("Stock deducted for sales order " + orderNumber);
            stockMovementRepository.save(movement);

            // Calculate line total
            double lineTotal = itemDto.getQuantity() * item.getPrice();
            totalAmount += lineTotal;

            SalesOrderItem orderItem = new SalesOrderItem();
            orderItem.setOrderId(savedOrder.getId());
            orderItem.setItemId(item.getId());
            orderItem.setQuantity(itemDto.getQuantity());
            orderItem.setUnitPrice(item.getPrice());
            orderItem.setLineTotal(lineTotal);

            orderItems.add(salesOrderItemRepository.save(orderItem));
        }

        savedOrder.setTotalAmount(totalAmount);
        salesOrderRepository.save(savedOrder);

        return toResponseDTO(savedOrder, orderItems);
    }

    public List<SalesOrderResponseDTO> getAllOrders() {
        return salesOrderRepository.findAll().stream()
                .map(order -> {
                    List<SalesOrderItem> items = salesOrderItemRepository.findByOrderId(order.getId());
                    return toResponseDTO(order, items);
                })
                .collect(Collectors.toList());
    }

    public SalesOrderResponseDTO getOrderById(Long id) {
        SalesOrder order = salesOrderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with id: " + id));
        List<SalesOrderItem> items = salesOrderItemRepository.findByOrderId(order.getId());
        return toResponseDTO(order, items);
    }

    private SalesOrderResponseDTO toResponseDTO(SalesOrder order, List<SalesOrderItem> items) {
        List<SalesOrderResponseDTO.SalesOrderItemDTO> itemDTOs = items.stream()
                .map(item -> {
                    InventoryItem invItem = inventoryItemRepository.findById(item.getItemId()).orElse(null);
                    String itemName = invItem != null ? invItem.getName() : "Unknown Item";
                    
                    SalesOrderResponseDTO.SalesOrderItemDTO itemDto = new SalesOrderResponseDTO.SalesOrderItemDTO();
                    itemDto.setId(item.getId());
                    itemDto.setItemId(item.getItemId());
                    itemDto.setItemName(itemName);
                    itemDto.setQuantity(item.getQuantity());
                    itemDto.setUnitPrice(item.getUnitPrice());
                    itemDto.setLineTotal(item.getLineTotal());
                    return itemDto;
                })
                .collect(Collectors.toList());

        SalesOrderResponseDTO dto = new SalesOrderResponseDTO();
        dto.setId(order.getId());
        dto.setOrderNumber(order.getOrderNumber());
        dto.setCustomerName(order.getCustomerName());
        dto.setTotalAmount(order.getTotalAmount());
        dto.setStatus(order.getStatus());
        dto.setItems(itemDTOs);
        dto.setCreatedAt(order.getCreatedAt());
        dto.setUpdatedAt(order.getUpdatedAt());
        return dto;
    }
}
