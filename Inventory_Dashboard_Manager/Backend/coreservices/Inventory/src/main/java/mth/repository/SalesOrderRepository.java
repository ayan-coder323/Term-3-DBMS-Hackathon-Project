package mth.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import mth.entity.SalesOrder;
import java.util.List;
import java.util.Optional;
import java.time.LocalDateTime;

@Repository
public interface SalesOrderRepository extends JpaRepository<SalesOrder, Long> {

    @Query("SELECT o FROM SalesOrder o WHERE o.orderNumber = :orderNumber")
    Optional<SalesOrder> findByOrderNumber(@Param("orderNumber") String orderNumber);

    @Query("SELECT o FROM SalesOrder o WHERE o.status = :status")
    List<SalesOrder> findByStatus(@Param("status") String status);

    @Query("SELECT o FROM SalesOrder o WHERE o.createdAt BETWEEN :start AND :end")
    List<SalesOrder> findByCreatedAtBetween(@Param("start") LocalDateTime start, @Param("end") LocalDateTime end);

    @Query("SELECT COUNT(o) FROM SalesOrder o WHERE o.createdAt >= :start")
    Long countOrdersSince(@Param("start") LocalDateTime start);

    @Query("SELECT COALESCE(SUM(o.totalAmount), 0) FROM SalesOrder o WHERE o.createdAt >= :start")
    Double calculateRevenueSince(@Param("start") LocalDateTime start);
}
