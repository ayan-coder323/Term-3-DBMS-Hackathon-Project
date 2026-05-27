package mth.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import mth.entity.StockMovement;
import java.util.List;
import java.time.LocalDateTime;

@Repository
public interface StockMovementRepository extends JpaRepository<StockMovement, Long> {

    @Query("SELECT sm FROM StockMovement sm WHERE sm.itemId = :itemId")
    List<StockMovement> findByItemId(@Param("itemId") Long itemId);

    @Query("SELECT sm FROM StockMovement sm WHERE sm.movementType = :movementType")
    List<StockMovement> findByMovementType(@Param("movementType") String movementType);

    @Query("SELECT sm FROM StockMovement sm WHERE sm.createdAt BETWEEN :start AND :end")
    List<StockMovement> findByCreatedAtBetween(@Param("start") LocalDateTime start, @Param("end") LocalDateTime end);

    @Query("SELECT sm FROM StockMovement sm WHERE sm.itemId = :itemId AND sm.movementType = :movementType")
    List<StockMovement> findByItemIdAndMovementType(@Param("itemId") Long itemId, @Param("movementType") String movementType);
}
