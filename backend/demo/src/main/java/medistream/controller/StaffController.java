package medistream.controller;

import medistream.entity.MedicalStaffEntity;
import medistream.repository.MedicalStaffRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/staff")
@CrossOrigin(origins = "*")
public class StaffController {

    @Autowired
    private MedicalStaffRepository medicalStaffRepository;

    @GetMapping
    public List<MedicalStaffEntity> getStaff() {
        return medicalStaffRepository.findAll();
    }

    @PostMapping
    public MedicalStaffEntity createStaff(@RequestBody MedicalStaffEntity staff) {
        return medicalStaffRepository.save(staff);
    }

    @PutMapping("/{id}")
    public ResponseEntity<MedicalStaffEntity> updateStaff(@PathVariable int id, @RequestBody MedicalStaffEntity updated) {
        return medicalStaffRepository.findById(id)
            .map(existing -> {
                existing.setName(updated.getName());
                existing.setRole(updated.getRole());
                existing.setContactNo(updated.getContactNo());
                existing.setSpecialty(updated.getSpecialty());
                existing.setAge(updated.getAge());
                existing.setGender(updated.getGender());
                existing.setDepartment(updated.getDepartment());
                existing.setAvailability(updated.getAvailability());
                return ResponseEntity.ok(medicalStaffRepository.save(existing));
            })
            .orElse(ResponseEntity.notFound().build());
    }
}
