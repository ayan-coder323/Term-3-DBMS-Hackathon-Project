package mth.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import mth.entity.InventoryItem;
import java.util.List;
import java.util.Optional;

@Repository
public interface InventoryItemRepository extends JpaRepository<InventoryItem, Long> {

    @Query("SELECT i FROM InventoryItem i WHERE i.category = :category")
    List<InventoryItem> findByCategory(@Param("category") String category);

    @Query("SELECT i FROM InventoryItem i WHERE LOWER(i.category) = LOWER(:category)")
    List<InventoryItem> findByCategoryIgnoreCase(@Param("category") String category);

    @Query("SELECT i FROM InventoryItem i WHERE i.quantity <= :quantity")
    List<InventoryItem> findByQuantityLessThanEqual(@Param("quantity") int quantity);

    @Query("SELECT i FROM InventoryItem i WHERE i.sku = :sku")
    Optional<InventoryItem> findBySku(@Param("sku") String sku);

    @Query("SELECT CASE WHEN COUNT(i) > 0 THEN true ELSE false END FROM InventoryItem i WHERE i.sku = :sku")
    boolean existsBySku(@Param("sku") String sku);

    @Query("SELECT DISTINCT i.category FROM InventoryItem i ORDER BY i.category")
    List<String> findDistinctCategories();

    @Query("SELECT i FROM InventoryItem i WHERE i.quantity <= i.reorderLevel")
    List<InventoryItem> findLowStockItems();

    @Query("SELECT SUM(i.quantity * i.price) FROM InventoryItem i")
    Double calculateTotalInventoryValue();

    @Query("SELECT SUM(i.quantity) FROM InventoryItem i")
    Long calculateTotalItemCount();

    @Query("SELECT COUNT(i) FROM InventoryItem i WHERE i.quantity <= i.reorderLevel")
    Long countLowStockItems();

    @Query("SELECT i FROM InventoryItem i WHERE LOWER(i.name) LIKE LOWER(CONCAT('%', :name, '%'))")
    List<InventoryItem> findByNameContainingIgnoreCase(@Param("name") String name);
}
