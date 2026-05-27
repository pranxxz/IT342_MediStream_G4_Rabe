package medistream.features.medicalstaff.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import medistream.features.medicalstaff.entity.MedicalStaffEntity;
import medistream.features.medicalstaff.service.MedicalStaffService;

@RestController
@RequestMapping("/api/medicalstaff")
@CrossOrigin(origins = "*")
public class MedicalStaffController {

    @Autowired
    private MedicalStaffService service;

    // CREATE
    @PostMapping("/add")
    public MedicalStaffEntity addStaff(@RequestBody MedicalStaffEntity staff) {
        return service.addStaff(staff);
    }

    // READ ALL
    @GetMapping("/all")
    public List<MedicalStaffEntity> getAllStaff() {
        return service.getAllStaff();
    }

    // READ ONE
    @GetMapping("/{id}")
    public Optional<MedicalStaffEntity> getStaffById(@PathVariable int id) {
        return service.getStaffById(id);
    }

    // UPDATE
    @PutMapping("/update/{id}")
    public MedicalStaffEntity updateStaff(@PathVariable int id, @RequestBody MedicalStaffEntity staff) {
        return service.updateStaff(id, staff);
    }
    
    // Update availability only
    @PutMapping("/{id}/availability")
    public ResponseEntity<?> updateAvailability(@PathVariable int id, @RequestBody AvailabilityRequest request) {
        try {
            MedicalStaffEntity updatedStaff = service.updateAvailability(id, request.getAvailability());
            return ResponseEntity.ok(updatedStaff);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    
    // Get staff by availability
    @GetMapping("/availability/{status}")
    public List<MedicalStaffEntity> getStaffByAvailability(@PathVariable String status) {
        return service.getStaffByAvailability(status);
    }

    // DELETE
    @DeleteMapping("/delete/{id}")
    public String deleteStaff(@PathVariable int id) {
        service.deleteStaff(id);
        return "Medical staff with ID " + id + " has been deleted.";
    }
    
    // Inner class for availability request
    public static class AvailabilityRequest {
        private String availability;
        
        public String getAvailability() {
            return availability;
        }

        public void setAvailability(String availability) {
            this.availability = availability;
        }
    }
}
