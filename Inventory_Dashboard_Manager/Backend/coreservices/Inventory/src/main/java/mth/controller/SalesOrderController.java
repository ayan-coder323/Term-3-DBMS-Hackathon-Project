package mth.controller;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import mth.dto.ApiResponseDTO;
import mth.dto.SalesOrderCreateDTO;
import mth.dto.SalesOrderResponseDTO;
import mth.service.SalesOrderService;

import java.util.List;

@RestController
@RequestMapping("/api/sales")
public class SalesOrderController {

    private final SalesOrderService salesOrderService;

    public SalesOrderController(SalesOrderService salesOrderService) {
        this.salesOrderService = salesOrderService;
    }


    @PostMapping
    public ResponseEntity<ApiResponseDTO<SalesOrderResponseDTO>> createOrder(@Valid @RequestBody SalesOrderCreateDTO dto) {
        SalesOrderResponseDTO order = salesOrderService.createOrder(dto);
        return new ResponseEntity<>(ApiResponseDTO.success(order, "Sales order created successfully"), HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<ApiResponseDTO<List<SalesOrderResponseDTO>>> getAllOrders() {
        List<SalesOrderResponseDTO> orders = salesOrderService.getAllOrders();
        return ResponseEntity.ok(ApiResponseDTO.success(orders, "Sales orders retrieved"));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponseDTO<SalesOrderResponseDTO>> getOrderById(@PathVariable Long id) {
        SalesOrderResponseDTO order = salesOrderService.getOrderById(id);
        return ResponseEntity.ok(ApiResponseDTO.success(order, "Sales order retrieved"));
    }
}
