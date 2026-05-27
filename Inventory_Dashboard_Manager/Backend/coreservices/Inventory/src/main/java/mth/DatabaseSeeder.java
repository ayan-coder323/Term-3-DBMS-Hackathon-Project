package mth;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import mth.entity.*;
import mth.repository.*;

import java.time.LocalDateTime;
import java.util.*;

@Component
public class DatabaseSeeder implements CommandLineRunner {

    private final UsersRepository usersRepository;
    private final CategoryRepository categoryRepository;
    private final InventoryItemRepository inventoryItemRepository;
    private final SalesOrderRepository salesOrderRepository;
    private final SalesOrderItemRepository salesOrderItemRepository;
    private final StockMovementRepository stockMovementRepository;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public DatabaseSeeder(UsersRepository usersRepository,
                          CategoryRepository categoryRepository,
                          InventoryItemRepository inventoryItemRepository,
                          SalesOrderRepository salesOrderRepository,
                          SalesOrderItemRepository salesOrderItemRepository,
                          StockMovementRepository stockMovementRepository,
                          PasswordEncoder passwordEncoder) {
        this.usersRepository = usersRepository;
        this.categoryRepository = categoryRepository;
        this.inventoryItemRepository = inventoryItemRepository;
        this.salesOrderRepository = salesOrderRepository;
        this.salesOrderItemRepository = salesOrderItemRepository;
        this.stockMovementRepository = stockMovementRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) throws Exception {
        seedUsers();
        seedCategories();
        seedInventoryItemsAndSales();
    }

    private void seedUsers() {
        if (!usersRepository.existsByEmail("ayan38540@gmail.com")) {
            // ayan38540@gmail.com -> #Gondogol.com10
            Users user = new Users();
            user.setUsername("ayan38540");
            user.setEmail("ayan38540@gmail.com");
            user.setPassword("#Gondogol.com10");
            user.setRole("admin");
            user.setIsActive(1);
            usersRepository.save(user);
            System.out.println("Seeded ayan38540@gmail.com user.");
        }

        if (!usersRepository.existsByEmail("ayan3848@gmail.com")) {
            // ayan3848@gmail.com -> admin123
            Users user = new Users();
            user.setUsername("ayan_alt");
            user.setEmail("ayan3848@gmail.com");
            user.setPassword("admin123");
            user.setRole("admin");
            user.setIsActive(1);
            usersRepository.save(user);
            System.out.println("Seeded ayan3848@gmail.com user.");
        }

        if (!usersRepository.existsByEmail("admin@example.com")) {
            Users user = new Users();
            user.setUsername("admin_example");
            user.setEmail("admin@example.com");
            user.setPassword("admin123");
            user.setRole("admin");
            user.setIsActive(1);
            usersRepository.save(user);
        }

        if (!usersRepository.existsByEmail("user@example.com")) {
            Users user = new Users();
            user.setUsername("user_example");
            user.setEmail("user@example.com");
            user.setPassword("user123");
            user.setRole("user");
            user.setIsActive(1);
            usersRepository.save(user);
        }
    }

    private void seedCategories() {
        String[] categories = {"Electronics", "Apparel", "Food & Bev", "Industrial", "Pharma", "Office"};
        for (String catName : categories) {
            if (!categoryRepository.existsByNameIgnoreCase(catName)) {
                Category category = new Category();
                category.setName(catName);
                category.setDescription(catName + " items category");
                categoryRepository.save(category);
            }
        }
        System.out.println("Seeded categories successfully.");
    }

    private void seedInventoryItemsAndSales() {
        if (inventoryItemRepository.count() == 0) {
            // Seed inventory items
            List<InventoryItem> items = new ArrayList<>();
            
            // Electronics
            items.add(createItem("RTX 5090 GPU", "NVIDIA RTX 5090 Graphics Card", 85, 1999.99, "Electronics", 15, "SKU-RTX5090"));
            items.add(createItem("M4 MacBook Pro", "Apple MacBook Pro 16 inch M4", 42, 2499.00, "Electronics", 10, "SKU-MBPM4"));
            items.add(createItem("Sony WH-1000XM6", "Sony Noise Cancelling Headphones", 120, 399.99, "Electronics", 20, "SKU-XM6HEAD"));
            items.add(createItem("Dell XPS 15 Laptop", "Dell XPS Laptop 15 inch", 4, 1599.99, "Electronics", 10, "SKU-DELLXPS15")); // Low stock!

            // Apparel
            items.add(createItem("Premium Denim Jacket", "Classic blue denim jacket", 75, 89.99, "Apparel", 15, "SKU-DENIMJKT"));
            items.add(createItem("Merino Wool Pullover", "100% merino wool sweater", 15, 120.00, "Apparel", 20, "SKU-MERINOWOL")); // Low stock!
            items.add(createItem("Leather Sneakers", "Genuine leather casual shoes", 110, 149.99, "Apparel", 15, "SKU-LEATHSNEAK"));

            // Food & Bev
            items.add(createItem("Organic Cold Brew 12-Pack", "Organic black cold brew coffee", 200, 35.99, "Food & Bev", 30, "SKU-COLDBREW12"));
            items.add(createItem("Matcha Premium Tin 100g", "Uji ceremonial grade matcha", 3, 45.00, "Food & Bev", 15, "SKU-MATCHATIN")); // Critical stock!

            // Industrial
            items.add(createItem("Safety Harness XL", "Full body industrial safety harness", 55, 125.00, "Industrial", 10, "SKU-SAFHARNXL"));
            items.add(createItem("Brushless Impact Drill 20V", "Cordless 20V impact driver", 0, 189.99, "Industrial", 10, "SKU-IMPDRV20V")); // Out of stock!

            // Pharma
            items.add(createItem("Vitamin D3 10,000 IU", "High potency Vitamin D3 softgels", 340, 18.99, "Pharma", 50, "SKU-VITD310K"));
            items.add(createItem("Ultra Omega-3 Fish Oil", "Molecularly distilled fish oil", 22, 29.99, "Pharma", 30, "SKU-OMEGA3OIL")); // Low stock!

            // Office
            items.add(createItem("Ergonomic Mesh Chair", "Adjustable lumbar mesh office chair", 65, 349.99, "Office", 12, "SKU-ERGOCHAIR"));
            items.add(createItem("Tactile Mech Keyboard TKL", "Tenkeyless mechanical keyboard", 90, 119.99, "Office", 15, "SKU-MECHKEYTKL"));

            List<InventoryItem> savedItems = inventoryItemRepository.saveAll(items);
            System.out.println("Seeded inventory items successfully. Total seeded: " + savedItems.size());

            // Save initial stock movements
            for (InventoryItem item : savedItems) {
                StockMovement movement = new StockMovement();
                movement.setItemId(item.getId());
                movement.setQuantityChange(item.getQuantity());
                movement.setMovementType("purchase");
                movement.setNotes("Initial database seed stock");
                movement.setCreatedAt(LocalDateTime.now().minusDays(10));
                stockMovementRepository.save(movement);
            }

            // Seed sales orders and sales order items over the past 7 days to populate analytics
            Random rand = new Random();
            String[] customers = {"John Doe", "Jane Smith", "Apex Corp", "Tech Solutions", "Bob Johnson", "Alice Williams"};
            
            for (int dayOffset = 6; dayOffset >= 0; dayOffset--) {
                int ordersToday = rand.nextInt(3) + 1; // 1 to 3 orders per day
                LocalDateTime orderDate = LocalDateTime.now().minusDays(dayOffset).withHour(rand.nextInt(8) + 9).withMinute(rand.nextInt(60));
                
                for (int o = 0; o < ordersToday; o++) {
                    String orderNum = "ORD-" + (20260000 + dayOffset * 100 + o);
                    String customer = customers[rand.nextInt(customers.length)];
                    
                    // Create Sales Order (empty total for now, will calculate)
                    SalesOrder order = new SalesOrder();
                    order.setOrderNumber(orderNum);
                    order.setCustomerName(customer);
                    order.setTotalAmount(0.0);
                    order.setStatus("completed");
                    order.setCreatedAt(orderDate);
                    order.setUpdatedAt(orderDate);
                    
                    order = salesOrderRepository.save(order);
                    
                    // Select 1 to 3 random items to sell
                    int numItems = rand.nextInt(3) + 1;
                    double totalAmount = 0.0;
                    Collections.shuffle(savedItems);
                    
                    for (int i = 0; i < numItems; i++) {
                        InventoryItem item = savedItems.get(i);
                        int qty = rand.nextInt(3) + 1;
                        double price = item.getPrice();
                        double lineTotal = price * qty;
                        
                        SalesOrderItem soi = new SalesOrderItem();
                        soi.setOrderId(order.getId());
                        soi.setItemId(item.getId());
                        soi.setQuantity(qty);
                        soi.setUnitPrice(price);
                        soi.setLineTotal(lineTotal);
                        salesOrderItemRepository.save(soi);
                        
                        // Record stock movement (sale)
                        StockMovement movement = new StockMovement();
                        movement.setItemId(item.getId());
                        movement.setQuantityChange(-qty);
                        movement.setMovementType("sale");
                        movement.setNotes("Sale order " + orderNum);
                        movement.setCreatedAt(orderDate);
                        stockMovementRepository.save(movement);
                        
                        totalAmount += lineTotal;
                    }
                    
                    // Update order total
                    order.setTotalAmount(Math.round(totalAmount * 100.0) / 100.0);
                    salesOrderRepository.save(order);
                }
            }
            System.out.println("Seeded sales orders and items successfully.");
        }
    }

    private InventoryItem createItem(String name, String desc, int quantity, double price, String category, int reorderLevel, String sku) {
        InventoryItem item = new InventoryItem();
        item.setName(name);
        item.setDescription(desc);
        item.setQuantity(quantity);
        item.setPrice(price);
        item.setCategory(category);
        item.setReorderLevel(reorderLevel);
        item.setSku(sku);
        return item;
    }
}
