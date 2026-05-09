package medistream.features.medicalstaff.service;

import medistream.features.medicalstaff.entity.MedicalStaffEntity;
import medistream.features.medicalstaff.repository.MedicalStaffRepository;
import jakarta.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class MedicalStaffService {

    @Autowired
    private MedicalStaffRepository repository;

    // CREATE 
    public MedicalStaffEntity addStaff(MedicalStaffEntity staff) {
        // Validate required fields
        if (staff.getName() == null || staff.getName().trim().isEmpty()) {
            throw new RuntimeException("Name is required");
        }
        
        if (staff.getRole() == null || staff.getRole().trim().isEmpty()) {
            throw new RuntimeException("Role is required");
        }
        
        // Validate age if provided
        if (staff.getAge() != null && (staff.getAge() < 18 || staff.getAge() > 120)) {
            throw new RuntimeException("Age must be between 18 and 120");
        }
        
        // Validate gender if provided
        if (staff.getGender() != null && !staff.getGender().trim().isEmpty()) {
            String gender = staff.getGender().trim();
            if (!gender.equalsIgnoreCase("Male") && 
                !gender.equalsIgnoreCase("Female") && 
                !gender.equalsIgnoreCase("Other") &&
                !gender.equalsIgnoreCase("Prefer not to say")) {
                throw new RuntimeException("Gender must be Male, Female, Other, or Prefer not to say");
            }
        }
        
        // Validate availability if provided
        if (staff.getAvailability() != null && !staff.getAvailability().trim().isEmpty()) {
            String availability = staff.getAvailability().trim();
            if (!availability.equalsIgnoreCase("available") && 
                !availability.equalsIgnoreCase("busy") && 
                !availability.equalsIgnoreCase("offline")) {
                throw new RuntimeException("Availability must be 'available', 'busy', or 'offline'");
            }
        }
        
        // Set default department if not provided
        if (staff.getDepartment() == null || staff.getDepartment().trim().isEmpty()) {
            staff.setDepartment("General Medicine");
        }
        
        return repository.save(staff);
    }

    // READ ALL
    public List<MedicalStaffEntity> getAllStaff() {
        return repository.findAll();
    }

    // READ ONE
    public Optional<MedicalStaffEntity> getStaffById(int id) {
        return repository.findById(id);
    }

    // UPDATE
    public MedicalStaffEntity updateStaff(int id, MedicalStaffEntity updatedStaff) {
        return repository.findById(id).map(staff -> {
            // Update basic fields
            if (updatedStaff.getName() != null && !updatedStaff.getName().trim().isEmpty()) {
                staff.setName(updatedStaff.getName().trim());
            }
            
            if (updatedStaff.getRole() != null && !updatedStaff.getRole().trim().isEmpty()) {
                String newRole = updatedStaff.getRole().trim().toLowerCase();
                staff.setRole(newRole);
                
                if (staff.getUserAccount() != null) {
                    staff.getUserAccount().setRole(newRole);
                }
            }
            
            if (updatedStaff.getContactNo() != null) {
                staff.setContactNo(updatedStaff.getContactNo());
            }
            
            if (updatedStaff.getSpecialty() != null) {
                staff.setSpecialty(updatedStaff.getSpecialty());
            }
            
            // Update age
            if (updatedStaff.getAge() != null) {
                // Validate age
                if (updatedStaff.getAge() < 18 || updatedStaff.getAge() > 120) {
                    throw new RuntimeException("Age must be between 18 and 120");
                }
                staff.setAge(updatedStaff.getAge());
            }
            
            // Update gender
            if (updatedStaff.getGender() != null) {
                String gender = updatedStaff.getGender().trim();
                if (!gender.isEmpty()) {
                    if (!gender.equalsIgnoreCase("Male") && 
                        !gender.equalsIgnoreCase("Female") && 
                        !gender.equalsIgnoreCase("Other") &&
                        !gender.equalsIgnoreCase("Prefer not to say")) {
                        throw new RuntimeException("Gender must be Male, Female, Other, or Prefer not to say");
                    }
                    staff.setGender(gender);
                }
            }
            
            // Update department
            if (updatedStaff.getDepartment() != null) {
                staff.setDepartment(updatedStaff.getDepartment().trim());
            }
            
            // Update availability
            if (updatedStaff.getAvailability() != null) {
                String availability = updatedStaff.getAvailability().trim();
                if (!availability.isEmpty()) {
                    if (!availability.equalsIgnoreCase("available") && 
                        !availability.equalsIgnoreCase("busy") && 
                        !availability.equalsIgnoreCase("offline")) {
                        throw new RuntimeException("Availability must be 'available', 'busy', or 'offline'");
                    }
                    staff.setAvailability(availability.toLowerCase());
                } else {
                    staff.setAvailability(null);
                }
            }
            
            return repository.save(staff);
        }).orElseThrow(() -> new RuntimeException("Medical staff not found with ID: " + id));
    }
    
    // Update availability only
    @Transactional
    public MedicalStaffEntity updateAvailability(int staffId, String availability) {
        MedicalStaffEntity staff = repository.findById(staffId)
            .orElseThrow(() -> new RuntimeException("Medical staff not found with ID: " + staffId));
        
        // Validate availability
        if (availability != null && !availability.trim().isEmpty()) {
            String avail = availability.trim().toLowerCase();
            if (!avail.equals("available") && !avail.equals("busy") && !avail.equals("offline")) {
                throw new RuntimeException("Availability must be 'available', 'busy', or 'offline'");
            }
            staff.setAvailability(avail);
        } else {
            staff.setAvailability(null);
        }
        
        return repository.save(staff);
    }
    
    // DELETE
    @Transactional
    public void deleteStaff(int id) {
        try {
            MedicalStaffEntity staff = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Medical staff not found"));
                
            repository.delete(staff);
            
        } catch (Exception e) {
            throw new RuntimeException("Failed to delete medical staff: " + e.getMessage());
        }
    }
    
    // Additional helper methods
    public List<MedicalStaffEntity> getStaffByRole(String role) {
        return repository.findByRoleIgnoreCase(role);
    }
    
    public List<MedicalStaffEntity> getStaffByGender(String gender) {
        return repository.findByGenderIgnoreCase(gender);
    }
    
    public List<MedicalStaffEntity> getStaffByAgeRange(int minAge, int maxAge) {
        return repository.findByAgeBetween(minAge, maxAge);
    }
    
    public List<MedicalStaffEntity> getStaffByDepartment(String department) {
        return repository.findByDepartmentIgnoreCase(department);
    }
    
    public List<MedicalStaffEntity> getStaffByDepartmentAndRole(String department, String role) {
        return repository.findByDepartmentAndRole(department, role);
    }
    
    public List<MedicalStaffEntity> getStaffByAvailability(String availability) {
        return repository.findByAvailabilityIgnoreCase(availability);
    }
}