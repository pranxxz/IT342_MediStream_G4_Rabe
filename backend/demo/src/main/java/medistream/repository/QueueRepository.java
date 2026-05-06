package medistream.repository;

import medistream.entity.Queue;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.Optional;

public interface QueueRepository extends JpaRepository<Queue, Long> {
    @Query(value = "SELECT * FROM queue ORDER BY id DESC LIMIT 1", nativeQuery = true)
    Optional<Queue> findLastQueueEntry();
}