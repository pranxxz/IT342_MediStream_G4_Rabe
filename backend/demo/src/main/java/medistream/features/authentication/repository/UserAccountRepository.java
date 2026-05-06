package medistream.features.authentication.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import medistream.features.authentication.entity.UserAccountEntity;

import java.util.Optional;


public interface UserAccountRepository extends JpaRepository<UserAccountEntity, Integer> {
    Optional<UserAccountEntity> findByUsername(String username);
    boolean existsByUsername(String username); 
}