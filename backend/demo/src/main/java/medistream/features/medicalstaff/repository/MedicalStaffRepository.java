package medistream.features.medicalstaff.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import medistream.features.medicalstaff.entity.MedicalStaffEntity;

@Repository
public interface MedicalStaffRepository extends JpaRepository<MedicalStaffEntity, Integer> {
    
    // --- Basic Filtering ---
    List<MedicalStaffEntity> findByGenderIgnoreCase(String gender);
    
    List<MedicalStaffEntity> findByRoleIgnoreCase(String role);
    
    List<MedicalStaffEntity> findByAgeBetween(int minAge, int maxAge);
    
    List<MedicalStaffEntity> findByRoleAndGender(String role, String gender);
    
    List<MedicalStaffEntity> findBySpecialtyIgnoreCase(String specialty);
    
    // --- Department Queries ---
    List<MedicalStaffEntity> findByDepartmentIgnoreCase(String department);
    
    List<MedicalStaffEntity> findByDepartmentAndRole(String department, String role);
    
    List<MedicalStaffEntity> findByDepartmentAndGender(String department, String gender);
    
    List<MedicalStaffEntity> findByDepartmentAndSpecialty(String department, String specialty);
    
    // --- Availability Queries ---
    List<MedicalStaffEntity> findByAvailabilityIgnoreCase(String availability);
    
    List<MedicalStaffEntity> findByAvailabilityIsNull();
    
    List<MedicalStaffEntity> findByAvailabilityIsNotNull();
    
    List<MedicalStaffEntity> findByRoleAndAvailability(String role, String availability);
    
    List<MedicalStaffEntity> findByDepartmentAndAvailability(String department, String availability);
}