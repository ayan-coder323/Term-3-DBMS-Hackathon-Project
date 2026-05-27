package mth.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import mth.entity.SalesOrderItem;
import java.util.List;

@Repository
public interface SalesOrderItemRepository extends JpaRepository<SalesOrderItem, Long> {

    @Query("SELECT soi FROM SalesOrderItem soi WHERE soi.orderId = :orderId")
    List<SalesOrderItem> findByOrderId(@Param("orderId") Long orderId);

    @Query("SELECT soi FROM SalesOrderItem soi WHERE soi.itemId = :itemId")
    List<SalesOrderItem> findByItemId(@Param("itemId") Long itemId);

    @Query("SELECT soi.itemId, SUM(soi.quantity) as totalQty, SUM(soi.lineTotal) as totalRevenue " +
           "FROM SalesOrderItem soi GROUP BY soi.itemId ORDER BY totalRevenue DESC")
    List<Object[]> findTopSellingItems();
}
