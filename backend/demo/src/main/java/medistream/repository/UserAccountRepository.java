package medistream.repository;

import medistream.entity.UserAccountEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;


public interface UserAccountRepository extends JpaRepository<UserAccountEntity, Integer> {
    Optional<UserAccountEntity> findByUsername(String username);
    boolean existsByUsername(String username); 
}